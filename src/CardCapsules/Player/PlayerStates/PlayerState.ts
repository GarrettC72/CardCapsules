import State from "../../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { CC_EVENTS } from "../../CardCapsulesEnums";
import { SPRING_BLOCK_ENUMS } from "../../GameObjects/SpringBlock";
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

	handleInput(event: GameEvent){}	

	update(deltaT: number): void {
		// Do gravity
		if(!this.parent.freeze)
			this.parent.velocity.y += this.gravity*deltaT;
	}
}