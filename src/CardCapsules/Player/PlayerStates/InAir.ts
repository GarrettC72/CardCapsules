import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { PlayerStates } from "../PlayerController";
import PlayerState from "./PlayerState";

export default abstract class InAir extends PlayerState {
    update(deltaT: number): void {
        super.update(deltaT);

        let dir = this.getInputDirection();

        //original in air movement
		//this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x;

        //new in air movement to allow the spring to give some left right momentum.
        if(!this.parent.slow)
        {
            let slowMultiplier = 0.3;
            let tweakedSpeed = this.parent.speed/3.5;
            if(Math.abs(this.parent.velocity.x) > 200)
            {
                slowMultiplier = 0.01;
                tweakedSpeed = 0;
            } 
            this.parent.velocity.x += (dir.x * tweakedSpeed - slowMultiplier*this.parent.velocity.x);

            
            this.owner.move(this.parent.velocity.scaled(deltaT));
        }
        

        if(this.owner.onGround){
			this.finished(PlayerStates.PREVIOUS);
		}
    }
}