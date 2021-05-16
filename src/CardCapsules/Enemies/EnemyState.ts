import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { CC_EVENTS } from "../CardCapsulesEnums";
import EnemyController from "./EnemyController";

export default abstract class EnemyState extends State {
	owner: GameNode;
	gravity: number = 1000;
	parent: EnemyController

	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		
		this.owner = owner;
	}

	handleInput(event: GameEvent): void {

		if(event.type === CC_EVENTS.PAUSE_GAME)
		{
			if(!this.parent.spiky)
			{
				(<AnimatedSprite>this.owner).animation.pause();
				this.parent.freeze = true;
			}	
		}
			
		if(event.type === CC_EVENTS.UNPAUSE_GAME)
		{
			(<AnimatedSprite>this.owner).animation.resume();
			this.parent.freeze = false;
		}
			

		let node = this.owner.getScene().getSceneGraph().getNode(event.data.get("node"));
		let other = this.owner.getScene().getSceneGraph().getNode(event.data.get("other"));

		if(node === this.owner || other === this.owner)
		{
			//node is springblock
			//this.finished("jump");
			if(event.type === CC_EVENTS.SPRING_TRIGGERED_DOWN)
			{
				this.parent.velocity.y = 500;
			}
			if(event.type === CC_EVENTS.SPRING_TRIGGERED || event.type === CC_EVENTS.SPRING_TRIGGERED_TOP)
			{
				this.parent.velocity.y = -500;
			}
			if(event.type === CC_EVENTS.SPRING_TRIGGERED_LEFT)
			{
				this.parent.velocity.y = -200;
				this.parent.velocity.x = -500;
			}
			if(event.type === CC_EVENTS.SPRING_TRIGGERED_RIGHT)
			{
				this.parent.velocity.y = -200;
				this.parent.velocity.x = 500;
			}
			
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

	update(deltaT: number): void {
		// Do gravity
		// if(this.parent.spiky)
		// 	this.parent.freeze = false;
		if(!this.parent.freeze)
		{
			this.parent.velocity.y += this.gravity*deltaT;


			if(this.owner.onWall){
				// Flip around
				this.parent.direction.x *= -1;
				(<AnimatedSprite>this.owner).invertX = !(<AnimatedSprite>this.owner).invertX;
			}
		}
	
	}
}