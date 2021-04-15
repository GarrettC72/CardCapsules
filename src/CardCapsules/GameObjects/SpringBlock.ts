import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { CC_EVENTS } from "../CardCapsulesEnums";

export enum SPRING_BLOCK_ENUMS {
    FACING_TOP = "spring_facing_top",
    FACING_RIGHT = "spring_facing_right",
    FACING_BOTTOM = "spring_facing_bottom",
    FACING_LEFT = "spring_facing_left"
}

export default class SpringBlock
{
    sprite: AnimatedSprite;
    faceDirection: string;

    /**
     *  DEPRECATED
     * @param sprite 
     * @param faceDirection 
     */
    public constructor(sprite: AnimatedSprite, faceDirection: string)
    {
        this.sprite = sprite;
        this.faceDirection = faceDirection;
        
        //rotate the sprite based on which direction it is facing.
        if(faceDirection == SPRING_BLOCK_ENUMS.FACING_BOTTOM)
            sprite.rotation = Math.PI;
        if(faceDirection == SPRING_BLOCK_ENUMS.FACING_LEFT)
            sprite.rotation = Math.PI * 1.5;
        if(faceDirection == SPRING_BLOCK_ENUMS.FACING_RIGHT)
            sprite.rotation = Math.PI * 0.5;

        //console.log("created spring");
        this.sprite.setTrigger("player", CC_EVENTS.SPRING_TRIGGERED, null);
    }

    private setSpriteRotation()
    {
        
    }
} 