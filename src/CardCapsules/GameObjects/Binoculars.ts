import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import { CC_EVENTS } from "../CardCapsulesEnums";


export default class Binoculars extends CanvasNode
{
    private player: GameNode;
    private viewport: Viewport;
    private isActive: boolean;
    private currentXOffset: number;
    private currentYOffset: number;
    private movePercentage: number = 0.05;

    public constructor(viewport: Viewport, player: GameNode)
    {
        super();
        this.player = player;
        this.viewport = viewport;
        this.visible = false;

        this.receiver.subscribe(
            [CC_EVENTS.ACTIVATE_BINOCULARS,
            CC_EVENTS.DEACTIVATE_BINOCULARS,
            CC_EVENTS.TOGGLE_BINOCULARS]);
    }

    private activateBin(): void
    {
        if(!this.isActive)
        {
            this.isActive = true;
            this.currentXOffset = 0;
            this.currentYOffset = 0;
            this.viewport.follow(this);
            //this.player.freeze();
        }
        
    }

    private deactivateBin(): void
    {
        if(this.isActive)
        {
            this.isActive = false;
            this.viewport.follow(this.player);
            //this.player.unfreeze();
        }
        
    }

    update(deltaT: number)
    {
        while(this.receiver.hasNextEvent())
        {
            let event = this.receiver.getNextEvent();
            switch(event.type){
                case CC_EVENTS.ACTIVATE_BINOCULARS:
                {
                    
                    this.activateBin();
                }
                break;

                case CC_EVENTS.DEACTIVATE_BINOCULARS:
                {
                    this.deactivateBin();
                }
                break;

                case CC_EVENTS.TOGGLE_BINOCULARS:
                {
                    if(this.isActive)
                        this.deactivateBin();
                    else
                        this.activateBin();
                }
                break;
            }
        }

        if(Input.isKeyPressed("shift"))
        {
            this.activateBin();
        }
        else
        {
            this.deactivateBin();
        }

        if(this.isActive)
        {
            //Calculate the location of the mouse relative to the center of the screen.
            let mousePos = Input.getMousePosition();
            let viewportHalfsize = this.viewport.getHalfSize();
            let playerPos = this.player.position;

            //negative x means left, negative y means up.
            let relMousePos = new Vec2(mousePos.x - viewportHalfsize.x,  mousePos.y - viewportHalfsize.y);
            let offsetGoalx = relMousePos.x;
            let offsetGoaly = relMousePos.y;
            //calculate the offset of this binocular node to the player.
            this.currentXOffset = this.currentXOffset + (offsetGoalx - this.currentXOffset) * this.movePercentage;
            this.currentYOffset = this.currentYOffset + (offsetGoaly - this.currentYOffset) * this.movePercentage;
            
            this.position = new Vec2(this.currentXOffset + playerPos.x, this.currentYOffset + playerPos.y);
        }
    }

}