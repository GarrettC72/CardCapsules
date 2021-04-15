import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Layer from "../../Wolfie2D/Scene/Layer";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Color from "../../Wolfie2D/Utils/Color";
import { CC_EVENTS } from "../CardCapsulesEnums";
import { SPRING_BLOCK_ENUMS } from "./SpringBlock";


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

    blockName: string;
    tilemap: OrthogonalTilemap;

    colorGreen: Color = new Color(0, 255, 0, 0.3);
    colorRed: Color = new Color(191, 25, 78, 0.3);

    public constructor(layer: Layer, gridWidth: number, gridHeight: number, viewport: Viewport, tilemap:OrthogonalTilemap)
    {
        super();
        this.visible = false; //this is part of the CanvasNode class not part of the grid itself.
        this.showGrid = false; //This variable decides if the grid is to be shown or not.
        this.blockName = ""; //This tells the grid which block is being placed.
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.layer = layer;
        this.defaultViewportOrigin = new Vec2();
        this.viewport = viewport;
        this.tilemap = tilemap;
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

    //forces the grid to display itself according to which block is being placed.
    public showGridFor(blockName:string): void
    {
        this.setShowGrid(true);
        this.blockName = blockName;
    }

    update(deltaT: number)
    {
        if(!this.showGrid)
        {
            return;
        }

        let mousePos = Input.getMousePosition();
        let viewportOrigin = this.viewport.getOrigin();
        

        let row = Math.floor((mousePos.x +viewportOrigin.x)/ this.gridWidth); //in game row of mouse.
        let col = Math.floor((mousePos.y +viewportOrigin.y)/ this.gridHeight); //in game col of mouse.

        //let blockHere = this.isThereBlockAt(new Vec2(row, col)); //is there a block at the given row col.


        //the indicator rectangle turns red if the block cannot be placed. Green if it can be placed.
        let canPlace = false;
        
        //let blockHere = this.isThereBlockAt(new Vec2(row, col));
        let faceDirection = SPRING_BLOCK_ENUMS.FACING_TOP;


        if(this.blockName === "floating_block")
        {
            if(!this.isThereBlockAt(new Vec2(row, col)))
                canPlace = true;
        }
        else if(this.blockName === "spring_block")
        {
            if(!this.isThereBlockAt(new Vec2(row, col)))
            {
                if(this.isThereBlockAt(new Vec2(row, col + 1)))
                {
                    faceDirection = SPRING_BLOCK_ENUMS.FACING_TOP;
                    canPlace = true;
                }
                else if(this.isThereBlockAt(new Vec2(row, col - 1)))
                {
                    faceDirection = SPRING_BLOCK_ENUMS.FACING_BOTTOM;
                    canPlace = true;
                }
                else if(this.isThereBlockAt(new Vec2(row + 1, col)))
                {
                    faceDirection = SPRING_BLOCK_ENUMS.FACING_LEFT;
                    canPlace = true;
                }
                else if(this.isThereBlockAt(new Vec2(row - 1, col)))
                {
                    faceDirection = SPRING_BLOCK_ENUMS.FACING_RIGHT;
                    canPlace = true;
                }
            }
        }
        else
        {
            if(!this.isThereBlockAt(new Vec2(row, col)))
                canPlace = true;
        }

        

        if(!canPlace)
            this.rect.setColor(this.colorRed);
        else
            this.rect.setColor(this.colorGreen);

        //console.log("hello?");
        if(Input.isMousePressed())
        {
            if(canPlace)
            {
                
                this.emitter.fireEvent(CC_EVENTS.TIME_RESUME);
                this.emitter.fireEvent(CC_EVENTS.PLACE_BLOCK, {row: row, col: col, orientation: faceDirection});
            }
            else
            {
                //cannot place block. Maybe play a sound.
            }
        }
        
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

    private isThereBlockAt(rowCol: Vec2): boolean
    {
        //console.log("Tile number: ", this.tilemap.getTileAtRowCol(rowCol));
        if(this.tilemap.getTileAtRowCol(rowCol) === 0)
            return false;
        return true;
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