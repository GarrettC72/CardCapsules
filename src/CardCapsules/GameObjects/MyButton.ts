import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import SceneGraph from "../../Wolfie2D/SceneGraph/SceneGraph";


/**
 * A class that allows easy switching between different button sprite images. This class supports hover and disabled images.
 */
export default class MyButton extends CanvasNode
{
    private button: Button;
    private defaultSprite: Sprite;
    private hoverSprite: Sprite;
    private toggleOffSprite: Sprite;

    private entered: boolean;
    private isActive: boolean;

    constructor(layer: Layer, sceneGraph: SceneGraph, button: Button, defaultSprite: Sprite)
    {
        super();
        this.layer = layer;
        sceneGraph.addNode(this);

        this.button = button;
        this.defaultSprite = defaultSprite;
        this.isActive = true;

        this.button.onEnter = () => {
            if(this.hoverSprite && !this.entered && this.isActive)
            {
                this.showHoverSprite();
                this.entered = true;
                //console.log("Enter", this.isActive);
            }
        };

        this.button.onLeave = () => {
            if(this.hoverSprite && this.entered && this.isActive)
            {
                this.showDefaultSprite();
                this.entered = false;
            }
        }

        this.showDefaultSprite();
    }

    public setHoverSprite(hoverSprite: Sprite): void
    {
        this.hoverSprite = hoverSprite;
        this.hoverSprite.visible = false;
    }

    public setToggleOffSprite(toggleOffSprite: Sprite): void
    {
        this.toggleOffSprite = toggleOffSprite;
        this.showCorrectSprite();
    }

    /**
     * Show's the default sprite.
     */
    public activateButton():void
    {
        if(!this.isActive)
        {
            //this.button.active = true;
            this.isActive = true;
            if(this.entered)
                this.showHoverSprite();
            else
                this.showDefaultSprite();
        }
    }

    /**
     * Shows the disabled sprite. The sprite is set with setToggleOffSprite()
     */
    public deactivateButton(): void
    {
        if(this.isActive)
        {
            //this.button.active = false;
            this.isActive = false;
            this.showCorrectSprite();
        }
    }

    private showCorrectSprite(): void
    {
        if(this.isActive)
        {
            if(this.entered)
                this.showHoverSprite();
            else
                this.showDefaultSprite();
        }
        else
            this.showToggleOffSprite();
    }

    private showToggleOffSprite(): void
    {
        if(this.toggleOffSprite)
        {
            if(this.hoverSprite)
                this.hoverSprite.visible = false;
            this.toggleOffSprite.visible = true;
            this.defaultSprite.visible = false;
        }
    }

    private showDefaultSprite(): void
    {
        if(this.toggleOffSprite)
            this.toggleOffSprite.visible = false;
        if(this.hoverSprite)
            this.hoverSprite.visible = false;
        this.defaultSprite.visible = true;
    }

    private showHoverSprite(): void
    {
        if(this.hoverSprite)
        {
            if(this.toggleOffSprite)
                this.toggleOffSprite.visible = false;
            this.hoverSprite.visible = true;
            this.defaultSprite.visible = false;
        }
    }

}