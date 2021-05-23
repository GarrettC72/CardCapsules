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

    /**
     * 
     * @param layer The layer that the button belongs in
     * @param sceneGraph The scene graph of the game
     * @param button The button gamenode
     * @param defaultSprite The button default image.
     */
    constructor(layer: Layer, sceneGraph: SceneGraph, button: Button, defaultSprite: Sprite)
    {
        super();
        this.layer = layer;
        sceneGraph.addNode(this);

        this.button = button;
        this.defaultSprite = defaultSprite;
        this.isActive = true;

        this.button.onEnter = () => {
            this.entered = true;
        };

        this.button.onLeave = () => {
            this.entered = false;
        }
    }

    public setHoverSprite(hoverSprite: Sprite): void
    {
        this.hoverSprite = hoverSprite;
        this.hoverSprite.visible = false;
    }

    public setToggleOffSprite(toggleOffSprite: Sprite): void
    {
        this.toggleOffSprite = toggleOffSprite;
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
        }
    }

    /**
     * Called by the updated function below to update the appearance of the button.
     */
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

    update(deltaT: number): void
    {
        this.showCorrectSprite();
    }

}