import Idle from "./Idle";
import Jump from "./Jump";
import Walk from "./Walk";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import { CC_EVENTS } from "../CardCapsulesEnums";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";

export enum EnemyStates {
	IDLE = "idle",
	WALK = "walk",
	JUMP = "jump",
	PREVIOUS = "previous",
	SPIKEJUMP = "spikejump"
}

// HOMEWORK 4 - TODO
/**
 * For this homework, you'll have to implement an additional state to the AI from scratch,
 * and handle how it's used in the EnemyController and accessed from other states.
 * 
 * This new behavior should be for a spike ball enemy variant, and it should activate when
 * the player moves too close to the enemy.
 * 
 * The spike ball enemy should jump up and down constantly for as long as the player is nearby.
 * 
 * When the player moves far enough away again, the enemy should return to the idle state.
 * 
 * You have been provided with a spritesheet for the spikeball enemy, which comes with some
 * needed animation states. Feel free to change the sprite (or any of the art) if you want to.
 */
export default class EnemyController extends StateMachineAI {
	owner: GameNode;
	jumpy: boolean;
	direction: Vec2 = Vec2.ZERO;
	velocity: Vec2 = Vec2.ZERO;
	speed: number = 75;
	spiky: boolean;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;
		this.jumpy = options.jumpy ? options.jumpy : false;
		this.spiky = options.spiky ? options.spiky : false;

		//this.jumpy = true;

		this.receiver.subscribe(CC_EVENTS.PLAYER_MOVE);
		if(this.jumpy){
			this.receiver.subscribe(CC_EVENTS.PLAYER_JUMP);
			this.speed = 100;

			// Give the owner a tween for the jump
			owner.tweens.add("jump", {
                startDelay: 0,
                duration: 300,
                effects: [
                    {
                        property: "rotation",
                        resetOnComplete: true,
                        start: -3.14/8,
                        end: 3.14/8,
                        ease: EaseFunctionType.IN_OUT_SINE
                    }
                ],
                reverseOnComplete: true,
            });
		}
		if(this.spiky){
			this.receiver.subscribe(CC_EVENTS.PLAYER_JUMP);
			this.speed = 0;

			// Give the owner a tween for the jump
			owner.tweens.add("spikejump", {
                startDelay: 0,
                duration: 300,
                effects: [
                    {
                        property: "rotation",
                        resetOnComplete: true,
                        start: -3.14/8,
                        end: 3.14/8,
                        ease: EaseFunctionType.IN_OUT_SINE
                    }
                ],
                reverseOnComplete: true,
            });
		}

		let idle = new Idle(this, owner);
		this.addState(EnemyStates.IDLE, idle);
		let walk = new Walk(this, owner);
		this.addState(EnemyStates.WALK, walk);
		let jump = new Jump(this, owner);
		this.addState(EnemyStates.JUMP, jump);
		let spikejump2 = new Jump(this, owner);
		this.addState(EnemyStates.SPIKEJUMP, jump);

		this.initialize(EnemyStates.IDLE);

		this.receiver.subscribe(
            [CC_EVENTS.SPRING_TRIGGERED,
                CC_EVENTS.SPRING_TRIGGERED_DOWN,
                CC_EVENTS.SPRING_TRIGGERED_LEFT,
                CC_EVENTS.SPRING_TRIGGERED_RIGHT,
                CC_EVENTS.SPRING_TRIGGERED_TOP,
        ]);
	}

	changeState(stateName: string): void {

        if(stateName === EnemyStates.JUMP){
            this.stack.push(this.stateMap.get(stateName));
        }
		if(stateName === EnemyStates.SPIKEJUMP){
			this.stack.push(this.stateMap.get(stateName));
		}
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}