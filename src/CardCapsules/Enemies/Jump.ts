import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EnemyStates } from "./EnemyController";
import EnemyState from "./EnemyState";
import { CC_EVENTS } from "../CardCapsulesEnums";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

export default class Jump extends EnemyState {

	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.play("JUMP", true);
		(<AnimatedSprite>this.owner).tweens.play("jump", true);
		this.gravity = 500;
		if(this.parent.spiky){
			this.gravity = 200
		}
	}
	handleInput(event: GameEvent) {
		if(event.type === CC_EVENTS.PLAYER_MOVE){
			let pos = event.data.get("position");
			if(this.owner.position.x - pos.x < (22*10) && (this.parent.spiky) && this.owner.onGround){
				this.finished(EnemyStates.IDLE);
				(<AnimatedSprite>this.owner).tweens.stop("jump");
			}
			if(this.owner.position.x - pos.x > (22*10) && (this.parent.spiky) && this.owner.onGround){
				
				this.finished(EnemyStates.IDLE);
				(<AnimatedSprite>this.owner).tweens.stop("jump");
			}
	}
}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onGround && !(this.parent.spiky)){
			this.finished(EnemyStates.PREVIOUS);
		}
		 if(this.owner.onGround && (this.parent.spiky)){
		 	this.finished(EnemyStates.PREVIOUS);
		 }

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}

		this.parent.velocity.x += this.parent.direction.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		(<AnimatedSprite>this.owner).tweens.stop("jump");
		return {};
	}
}