import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { CC_EVENTS } from "../../CardCapsulesEnums";
import PlayerController from "../PlayerController";


export default abstract class PlayerState extends State {
	owner: GameNode;
	gravity: number = 1000;
	parent: PlayerController;

	constructor(parent: StateMachine, owner: GameNode){
		super(parent);
		this.owner = owner;
	}

	getInputDirection(): Vec2 {
		let direction = Vec2.ZERO;
		direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
		direction.y = (Input.isJustPressed("jump") ? -1 : 0);
		return direction;
	}

	handleInput(event: GameEvent) {
    
		//console.log("EVENT TRIGGEddRED IN PLAYERSTATE");
		if (event.type === CC_EVENTS.SPRING_TRIGGERED) {

			//console.log("EVENT TRIGGERED IN PLAYERSTATE");
			let node = this.owner.getScene().getSceneGraph().getNode(event.data.get("node"));
			let other = this.owner.getScene().getSceneGraph().getNode(event.data.get("other"));

			if(node === this.owner || other === this.owner)
			{
				//node is springblock
				this.finished("jump");
				this.parent.velocity.y = -500;
				this.owner.tweens.play("flip");

			}
			if(node === this.owner)
			{
				(<AnimatedSprite>other).animation.play("ACTIVATED");
				(<AnimatedSprite>other).animation.queue("IDLE", true);
			}
			else
			{
				(<AnimatedSprite>node).animation.play("ACTIVATED");
				(<AnimatedSprite>node).animation.queue("IDLE", true);
			}
		}
	}	

	update(deltaT: number): void {
		// Do gravity
		this.parent.velocity.y += this.gravity*deltaT;
	}
}