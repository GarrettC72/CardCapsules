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

	handleInput(event: GameEvent)
	{
		let node = this.owner.getScene().getSceneGraph().getNode(event.data.get("node"));
		let other = this.owner.getScene().getSceneGraph().getNode(event.data.get("other"));
		// if (event.type === CC_EVENTS.SPRING_TRIGGERED || event.type === CC_EVENTS.SPRING_TRIGGERED_TOP)
		// 	this.springTriggerdHelper(node as AnimatedSprite, other as AnimatedSprite, SPRING_BLOCK_ENUMS.FACING_TOP);
		// if (event.type === CC_EVENTS.SPRING_TRIGGERED_DOWN)
		// 	this.springTriggerdHelper(node as AnimatedSprite, other as AnimatedSprite, SPRING_BLOCK_ENUMS.FACING_BOTTOM);
		// if (event.type === CC_EVENTS.SPRING_TRIGGERED_LEFT)
		// 	this.springTriggerdHelper(node as AnimatedSprite, other as AnimatedSprite, SPRING_BLOCK_ENUMS.FACING_LEFT);
		// if (event.type === CC_EVENTS.SPRING_TRIGGERED_RIGHT)
		// 	this.springTriggerdHelper(node as AnimatedSprite, other as AnimatedSprite, SPRING_BLOCK_ENUMS.FACING_RIGHT);

		if(node === this.owner || other === this.owner)
		{
			//node is springblock
			this.finished("jump");
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
			
			this.owner.tweens.play("flip");
		}
		if(!(node === this.owner))
		{
			(<AnimatedSprite>node).animation.play("ACTIVATED", false);
		}
		else
		{
			(<AnimatedSprite>other).animation.play("ACTIVATED", false);
		}
	}	

	private springTriggerdHelper(node: AnimatedSprite, other:AnimatedSprite, dir: string)
	{
		if(node === this.owner || other === this.owner)
		{
			//node is springblock
			this.finished("jump");
			if(dir === SPRING_BLOCK_ENUMS.FACING_BOTTOM)
			{
				this.parent.velocity.y = 500;
			}
			if(dir === SPRING_BLOCK_ENUMS.FACING_TOP)
			{
				this.parent.velocity.y = -500;
			}
			if(dir === SPRING_BLOCK_ENUMS.FACING_LEFT)
			{
				this.parent.velocity.y = -200;
				this.parent.velocity.x = -500;
			}
			if(dir === SPRING_BLOCK_ENUMS.FACING_RIGHT)
			{
				this.parent.velocity.y = -200;
				this.parent.velocity.x = 500;
			}
			
			this.owner.tweens.play("flip");
		}
		if(!(node === this.owner))
		{
			(<AnimatedSprite>node).animation.play("ACTIVATED", false);
		}
		else
		{
			(<AnimatedSprite>other).animation.play("ACTIVATED", false);
		}
	}

	update(deltaT: number): void {
		// Do gravity
		this.parent.velocity.y += this.gravity*deltaT;
	}
}