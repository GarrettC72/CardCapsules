import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import Layer from "../../Wolfie2D/Scene/Layer";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Color from "../../Wolfie2D/Utils/Color";
import { CC_EVENTS } from "../CardCapsulesEnums";


export default class GridNode extends CanvasNode
{
    rect: Rect;
    gridWidth: number;
    gridHeight: number;
    hlines: Array<Rect> = new Array<Rect>();
    vlines: Array<Rect> = new Array<Rect>();
    layer: Layer;
    defaultViewportOrigin: Vec2;
    viewport: Viewport;
    private showGrid: boolean;

    public constructor(layer: Layer, gridWidth: number, gridHeight: number, viewport: Viewport)
    {
        super();
        this.visible = false; //this is part of the CanvasNode class not part of the grid itself.
        this.showGrid = false; //This variable decides if the grid is to be shown or not.
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.layer = layer;
        this.defaultViewportOrigin = new Vec2();
        this.viewport = viewport;
        this.initVlines();
        this.initHlines();
        this.initSectionRect();
        this.setShowGrid(false); //forces the gridlines and rectangle indicator to not show.
    }

    /**
     * creates a rectangle to hover over the mouse.
     */
    protected initSectionRect(): void
    {
        let rect = new Rect(new Vec2(0, 0), new Vec2(this.gridWidth, this.gridHeight));
        this.rect = rect;
        rect.color = new Color(0, 255, 0, 0.3);
        this.layer.addNode(rect);
    }

    protected initVlines(): void
    {
        //create 20 vertial rectangles.
        let gap = this.gridWidth;
        let size = new Vec2(1, 2000);
        for(let i = 0; i < 20; i++)
        {
            let rect = new Rect(new Vec2(i * gap, 0), size.clone());
            rect.color = new Color(255, 0, 0, 0.5);
            this.vlines.push(rect);
            this.layer.addNode(rect);
        }
    }

    protected initHlines(): void
    {
        //create 20 vertial rectangles.
        let gap = this.gridHeight;
        let size = new Vec2(2000, 1);
        for(let i = 0; i < 20; i++)
        {
            let rect = new Rect(new Vec2(0, i * gap), size.clone());
            rect.color = new Color(255, 0, 0, 0.5);
            this.hlines.push(rect);
            this.layer.addNode(rect);
        }
    }

    private hideGridLines(): void
    {
        this.vlines.forEach((rline, idx) => {
            rline.visible = false;
        })
        this.hlines.forEach((rline, idx) => {
            rline.visible = false;
        })
    }

    private showGridLines(): void
    {
        this.vlines.forEach((rline, idx) => {
            rline.visible = true;
        })
        this.hlines.forEach((rline, idx) => {
            rline.visible = true;
        })
    }

    update(deltaT: number)
    {
        if(!this.showGrid)
        {
            return;
        }

        let mousePos = Input.getMousePosition();
        //console.log("hello?");
        if(Input.isMousePressed())
        {
            let viewportOrigin = this.viewport.getOrigin();



            let row = Math.floor((mousePos.x +viewportOrigin.x)/ this.gridWidth);
            let col = Math.floor((mousePos.y +viewportOrigin.y)/ this.gridHeight);
            this.emitter.fireEvent(CC_EVENTS.TIME_RESUME);
            this.emitter.fireEvent(CC_EVENTS.PLACE_BLOCK, {row: row, col: col});
        }
        

        let viewportOrigin = this.viewport.getView().topLeft;
        let offsetX = (viewportOrigin.x - this.defaultViewportOrigin.x) % this.gridWidth;
        let offsetY = (viewportOrigin.y - this.defaultViewportOrigin.y) % this.gridHeight;
        
        //update grid position based on the viewport's postion. rline means rectangle line.
        this.vlines.forEach((rline, idx) => {
            rline.position.x = idx * this.gridWidth - offsetX;
        })
        this.hlines.forEach((rline, idx) => {
            rline.position.y = idx * this.gridHeight - offsetY;
        })
        

        //update rectangle position based on the viewport's position.
        this.rect.position.x = (Math.floor((mousePos.x + offsetX) / this.gridWidth) * this.gridWidth) + this.gridWidth/2 - offsetX;
        this.rect.position.y = (Math.floor((mousePos.y + offsetY) / this.gridHeight) * this.gridHeight) + this.gridHeight/2 - offsetY;
        
    }

    public isShowGrid(): boolean
    {
        return this.showGrid;
    }

    public setShowGrid(showGrid: boolean): void
    {
        this.showGrid = showGrid;
        if(this.showGrid)
        {
            this.rect.visible = true;
            this.showGridLines();
        }
        else
        {
            this.rect.visible = false;
            this.hideGridLines();
        }
    }

}