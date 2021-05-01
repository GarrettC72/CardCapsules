import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { CC_EVENTS } from "../CardCapsulesEnums";
//import { HW4_Events } from "../hw4_enums";
import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import InAir from "./PlayerStates/InAir";
import Jump from "./PlayerStates/Jump";
import Run from "./PlayerStates/Run";
import Walk from "./PlayerStates/Walk";

export enum PlayerType {
    PLATFORMER = "platformer",
    TOPDOWN = "topdown"
}

export enum PlayerStates {
    IDLE = "idle",
    WALK = "walk",
	RUN = "run",
	JUMP = "jump",
    FALL = "fall",
	PREVIOUS = "previous"
}

export default class PlayerController extends StateMachineAI {
    protected owner: GameNode;
    velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;
	MIN_SPEED: number = 200;
    MAX_SPEED: number = 300;
    tilemap: OrthogonalTilemap;
    freeze: boolean;

    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;

        this.initializePlatformer();

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;

        this.freeze = false;
        this.receiver.subscribe(
            [CC_EVENTS.SPRING_TRIGGERED,
                CC_EVENTS.SPRING_TRIGGERED_DOWN,
                CC_EVENTS.SPRING_TRIGGERED_LEFT,
                CC_EVENTS.SPRING_TRIGGERED_RIGHT,
                CC_EVENTS.SPRING_TRIGGERED_TOP,
                CC_EVENTS.PAUSE_GAME,
                CC_EVENTS.UNPAUSE_GAME
        ]);
    }

    initializePlatformer(): void {
        this.speed = 400;

        let idle = new Idle(this, this.owner);
		this.addState(PlayerStates.IDLE, idle);
		let walk = new Walk(this, this.owner);
		this.addState(PlayerStates.WALK, walk);
		let run = new Run(this, this.owner);
		this.addState(PlayerStates.RUN, run);
		let jump = new Jump(this, this.owner);
        this.addState(PlayerStates.JUMP, jump);
        let fall = new Fall(this, this.owner);
        this.addState(PlayerStates.FALL, fall);
        
        this.initialize(PlayerStates.IDLE);
    }

    changeState(stateName: string): void {
        // If we jump or fall, push the state so we can go back to our current state later
        // unless we're going from jump to fall or something
        if((stateName === PlayerStates.JUMP || stateName === PlayerStates.FALL) && !(this.stack.peek() instanceof InAir)){
            this.stack.push(this.stateMap.get(stateName));
        }

        super.changeState(stateName);
    }

    update(deltaT: number): void {
		super.update(deltaT);

		if(this.currentState instanceof Jump){
			Debug.log("playerstate", "Player State: Jump");
		} else if (this.currentState instanceof Walk){
			Debug.log("playerstate", "Player State: Walk");
		} else if (this.currentState instanceof Run){
			Debug.log("playerstate", "Player State: Run");
		} else if (this.currentState instanceof Idle){
			Debug.log("playerstate", "Player State: Idle");
		} else if(this.currentState instanceof Fall){
            Debug.log("playerstate", "Player State: Fall");
        }
	}

    handleEvent(event: GameEvent)
    {
        if(event.type === CC_EVENTS.PAUSE_GAME)
        {
            (<AnimatedSprite>this.owner).animation.pause();
            this.freeze = true;
        }
        if(event.type === CC_EVENTS.UNPAUSE_GAME)
        {
            (<AnimatedSprite>this.owner).animation.resume();
            this.freeze = false;
        }
            

        let node = this.owner.getScene().getSceneGraph().getNode(event.data.get("node"));
		let other = this.owner.getScene().getSceneGraph().getNode(event.data.get("other"));

		if(node === this.owner || other === this.owner)
		{
			//node is springblock
            this.changeState("jump");
			//this.finished("jump");
			if(event.type === CC_EVENTS.SPRING_TRIGGERED_DOWN)
			{
				this.velocity.y = 500;
			}
			if(event.type === CC_EVENTS.SPRING_TRIGGERED || event.type === CC_EVENTS.SPRING_TRIGGERED_TOP)
			{
				this.velocity.y = -650;
			}
			if(event.type === CC_EVENTS.SPRING_TRIGGERED_LEFT)
			{
				this.velocity.y = -200;
				this.velocity.x = -500;
			}
			if(event.type === CC_EVENTS.SPRING_TRIGGERED_RIGHT)
			{
				this.velocity.y = -200;
				this.velocity.x = 500;
			}
			
			this.owner.tweens.play("flip");
			if(!(node === this.owner))
			{
				(<AnimatedSprite>node).animation.play("ACTIVATED", false);
				(<AnimatedSprite>node).animation.queue("IDLE", true);
			}
			else
			{
				(<AnimatedSprite>other).animation.play("ACTIVATED", false);
				(<AnimatedSprite>other).animation.queue("IDLE", true);
			}
		}
    }
}