import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
//import { HW4_Events } from "../../hw4_enums";
import { CC_EVENTS } from "../../CardCapsulesEnums";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";

export default class Walk extends OnGround {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MIN_SPEED;
		this.owner.animation.play("WALK", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);


		let dir = this.getInputDirection();

		//console.log(dir.x);

		if(dir.isZero()){
			this.finished(PlayerStates.IDLE);
		} else {
			if(Input.isPressed("run")){
				this.finished(PlayerStates.RUN);
			}
		}

		this.parent.velocity.x = dir.x * this.parent.speed

		this.emitter.fireEvent(CC_EVENTS.PLAYER_MOVE, {position: this.owner.position.clone()});
		
		if(!this.parent.slow)
			this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}