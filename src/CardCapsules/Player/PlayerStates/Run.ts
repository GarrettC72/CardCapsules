import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";

export default class Run extends OnGround {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MAX_SPEED;
		this.owner.animation.play("WALK", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);

		let dir = this.getInputDirection();

		if(dir.isZero()){
			this.finished(PlayerStates.IDLE);
		} else {
			if(!Input.isPressed("run")){
				this.finished(PlayerStates.WALK);
			}
		}

		this.parent.velocity.x = dir.x * this.parent.speed

		//this.emitter.fireEvent(HW4_Events.PLAYER_MOVE, {position: this.owner.position.clone()});
		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}