import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import CanvasNode from "../../Wolfie2D/Nodes/CanvasNode";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { CC_EVENTS } from "../CardCapsulesEnums";
import ObjectStorage from "./ObjectStorage";


export enum LavaType
{
	SOURCE_BLOCK = "source_block",
    LEFT_BLOCK = "left_block",
    RIGHT_BLOCK = "right_block",
    BOTTOM_BLOCK = "bottom_block"
}

export default class LavaController extends CanvasNode
{
    private lavaSources: Array<LavaData>;
    private decayingLava: Array<LavaData>;
    private objectStorage: ObjectStorage;
    private tilemap: OrthogonalTilemap;
    private time: number;

    public constructor(tilemap: OrthogonalTilemap)
    {
        super();
        this.time = 0;
        this.visible = false;
        this.lavaSources = new Array<LavaData>();
        this.decayingLava = new Array<LavaData>();
        this.objectStorage = ObjectStorage.getObjectStorage();
        this.tilemap = tilemap;
    }

    public addLavaSource(location: Vec2, gamenode: GameNode, type: string)
    {
        let lavaData = new LavaData(type, location, gamenode, null);
        (<AnimatedSprite>gamenode).animation.play("SOURCE", true); //run animation
        
        //add the source lava to the lavaSources array.
        this.lavaSources.push(lavaData);
        //add the source lavaData to the objectStorage.
        this.objectStorage.setItem(location, {data: lavaData});
    }

    /**
     * Used to keep track of where the lava is placed.
     * @param location The location of the lava
     * @param gamenode The gamenode of the lava
     * @param type The type of the lava
     */
    public addLavaLocation(location: Vec2, gamenode: GameNode, type: string, parent: LavaData)
    {
        let lavaData = new LavaData(type, location, gamenode, parent);
        this.objectStorage.setItem(location, {data: lavaData});
        //run animation
        switch(type)
        {
            case LavaType.LEFT_BLOCK: 
            {
                (<AnimatedSprite>gamenode).animation.play("LEFT_FLOW", true);
            }
            break;
            case LavaType.RIGHT_BLOCK: 
            {
                (<AnimatedSprite>gamenode).animation.play("RIGHT_FLOW", true);
            }
            break;
            case LavaType.BOTTOM_BLOCK:
            {
                (<AnimatedSprite>gamenode).animation.play("DOWN_FLOW", true);
            }
        }
    }

    public removeLava(gamenode: GameNode)
    {
        //console.log("removing lava");
        this.lavaSources.forEach((source) => 
        {
            this.removeLavaHelper(gamenode, source);
        });
        this.decayingLava.forEach((source)=>
        {
            this.removeLavaHelper(gamenode, source);
        });

        //if the source has been removed. remove it from the lavasources array.
        let index = -1;
        this.lavaSources.forEach((source, idx)=>{
            if(source.gamenode == null)
                index = idx;
        });
        if(index != -1)
            this.lavaSources.splice(index, 1);
    }

    private removeLavaHelper(gamenode: GameNode, currentLava: LavaData)
    {
        let stack = new Array<LavaData>();
        stack.push(currentLava);
        while(stack.length > 0)
        {
            let lavaNode = stack.pop();
            let currentGameNode = this.objectStorage.getItem(lavaNode.location);
            //console.log("Current game node In lavacontroller", currentGameNode);
            //add childrens to the stack
            if(lavaNode.left)
                stack.push(lavaNode.left);
            if(lavaNode.right)
                stack.push(lavaNode.right);
            if(lavaNode.bottom)
                stack.push(lavaNode.bottom);
            if(currentGameNode && currentGameNode.data && currentGameNode.data.gamenode == gamenode)
            {
                //remove the reference to the lavaNode from the parent. If it has a parent.
                if(lavaNode.parent)
                {
                    if(lavaNode.type == LavaType.LEFT_BLOCK)
                        lavaNode.parent.left = null;
                    if(lavaNode.type == LavaType.RIGHT_BLOCK)
                        lavaNode.parent.right = null;
                    if(lavaNode.type == LavaType.BOTTOM_BLOCK)
                        lavaNode.parent.bottom = null;
                }
                lavaNode.parent = null;
                
                //add children to the removal list. --> they will be removed slowly.
                if(lavaNode.bottom)
                    this.decayingLava.push(lavaNode.bottom);
                if(lavaNode.right)
                    this.decayingLava.push(lavaNode.right);
                if(lavaNode.left)
                    this.decayingLava.push(lavaNode.left);
                
                //remove lavaNode from object storage.
                //console.log("LAVA game node", currentGameNode);
                gamenode.destroy();
                this.objectStorage.clearItem(lavaNode.location);

                //finally remove the lava.
                lavaNode.bottom = null;
                lavaNode.right = null;
                lavaNode.left = null;
                lavaNode.gamenode = null;

                //break out of loop if the lava was successfully removed.
                break;
            }
        }
    }

    update(deltaT: number)
    {
        //every tick update the lava tree.
        this.time += deltaT;
        if(this.time > 1)
        {
            this.time = 0;
            //console.log("Source adding child");
            this.updateLavaSources();
            this.decayTheLava();
        }
    }

    private decayTheLava()
    {
        let tempArray = new Array<LavaData>();
        //transfer all the items in decaying lava to temp array.
        while(this.decayingLava.length > 0)
        {
            tempArray.push(this.decayingLava.pop());
        }

        while(tempArray.length > 0)
        {
            //for every lava parent, remove it and add their children into the decaying lava list(done automatically inside remove lava helper).
            let lavaData = tempArray.pop();
            let lavagamenode = this.objectStorage.getItem(lavaData.location);
            if(lavagamenode && lavagamenode.data && lavagamenode.data.gamenode)
            {
                this.removeLavaHelper(lavagamenode.data.gamenode, lavaData);
            }       
        }
    }

    private updateLavaSources()
    {
        //for each lava source search through each node and add to them.
        
        this.lavaSources.forEach((source, idx) =>
        {
            let stack = new Array<LavaData>();
            stack.push(source);
            while(stack.length > 0) //Depth first search through lava tree.
            {
                let lavaNode = stack.pop();
                let leftCoord = new Vec2(lavaNode.location.x - 1, lavaNode.location.y);
                let rightCoord = new Vec2(lavaNode.location.x + 1, lavaNode.location.y);
                let bottomCoord = new Vec2(lavaNode.location.x, lavaNode.location.y + 1);
                //For each lavanode see if any childrens can be added.
                //First check to see if there is any children on the bottom.
                if(!lavaNode.bottom)
                {
                    //if there is no children check if there is any obstructions, then add it.
                    if(this.isWithinBounds(bottomCoord) && !this.isThereBlockAt(bottomCoord))
                    {
                        //add children to the bottom.
                        this.emitter.fireEvent(CC_EVENTS.PLACE_LAVA, {location: bottomCoord, type: LavaType.BOTTOM_BLOCK, parent: lavaNode});
                        lavaNode.bottom = new LavaData(LavaType.BOTTOM_BLOCK, bottomCoord, null, lavaNode);
                        //this.objectStorage.setItem(bottomCoord, {data: bottomData});
                    }
                    else
                    {
                        if(this.isWithinBounds(bottomCoord)) //if the bottom is not the void.
                        {
                            //if there is no lavablock at the bottom and there is an obstruction, check left and right.
                            if(!lavaNode.left)
                            {
                                if(this.isWithinBounds(leftCoord) && !this.isThereBlockAt(leftCoord))
                                {
                                    //console.log("Is there block left??", this.isThereBlockAt(leftCoord));
                                    this.emitter.fireEvent(CC_EVENTS.PLACE_LAVA, {location: leftCoord, type: LavaType.LEFT_BLOCK, parent: lavaNode});
                                    lavaNode.left = new LavaData(LavaType.LEFT_BLOCK, leftCoord, null, lavaNode);
                                }
                            }
                            else
                            {
                                stack.push(lavaNode.left);
                            }
                            if(!lavaNode.right)
                            {
                                if(this.isWithinBounds(rightCoord) && !this.isThereBlockAt(rightCoord))
                                {
                                    this.emitter.fireEvent(CC_EVENTS.PLACE_LAVA, {location: rightCoord, type: LavaType.RIGHT_BLOCK, parent: lavaNode});
                                    lavaNode.right = new LavaData(LavaType.RIGHT_BLOCK, rightCoord, null, lavaNode);
                                }
                            }
                            else
                            {
                                stack.push(lavaNode.right);
                            }
                        }
                    }
                }
                else
                {
                    stack.push(lavaNode.bottom);
                }
            }
        });

    }

    private playAnimations(): void
    {

    }

    /**
     * Returns whether there is card block or tilemap block at the given row col.
     * @param rowCol specify the row col of the block.
     * @returns is there a card block or tilemap block at the given location.
     */
    private isThereBlockAt(rowCol: Vec2): boolean
    {

        if(this.tilemap.getTileAtRowCol(rowCol) === 0 && this.objectStorage.getItem(rowCol) == null)
            return false;
        return true;
    }

    private isWithinBounds(rowCol: Vec2):boolean
    {
        let bounds = this.tilemap.getDimensions();
        if(rowCol.x > bounds.x - 1 || rowCol.x < 0 || rowCol.y > bounds.y - 1 || rowCol.y < 0)
            return false;
        return true;
    }
}

class LavaData
{
    location:Vec2;
    type:string;
    gamenode: GameNode;

    bottom: LavaData;
    left: LavaData;
    right: LavaData;
    parent: LavaData;

    constructor(type:string, location:Vec2, gamenode: GameNode, parent: LavaData)
    {
        this.type = type;
        this.location = location;
        this.gamenode = gamenode;
        this.parent = parent;
    }
}