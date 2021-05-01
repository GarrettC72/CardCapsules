import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { CC_EVENTS } from "../CardCapsulesEnums";
import GridNode from "../GameObjects/GridNode";
import SpringBlock, { SPRING_BLOCK_ENUMS } from "../GameObjects/SpringBlock";
//import EnemyController from "../Enemies/EnemyController";
//import { HW4_Events } from "../hw4_enums";
import PlayerController from "../Player/PlayerController";
import MainMenu from "./MainMenu";
import LevelSelect from "./LevelSelect";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import EnemyController from "../Enemies/EnemyController";
import Layer from "../../Wolfie2D/Scene/Layer";
//import Level1 from "./Level1";

// HOMEWORK 4 - TODO
/**
 * Add in some level music.
 * 
 * You can choose whether to add and play music in the generic GameLevel class,
 * in the MainMenu when leaving, or play separate songs in each of the 2 levels.
 */
export default class GameLevel extends Scene {
    // Every level will have a player, which will be an animated sprite
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected respawnTimer: Timer;

    // Labels for the UI
    protected static floatingBlockCardCount: number = 0;
    protected floatingBlockCountLabel: Label;
    protected static springBlockCardCount: number = 0;
    protected springBlockCountLabel: Label;
    protected static drillBlockCardCount: number = 0;
    protected drillBlockCountLabel: Label;
    // protected static coinCount: number = 0;
    // protected coinCountLabel: Label;
    // protected static livesCount: number = 3;
    // protected livesCountLabel: Label;

    protected springBlockCardUI: Sprite;
    protected floatingBlockCardUI: Sprite;
    protected drillBlockCardUI:Sprite;

    //variables to store the data of the block that is being destroyed by the drill.
    protected drillDestroyRowNum:Array<number> = new Array<number>();
    protected drillDestroyColNum:Array<number> = new Array<number>();
    protected drillDestroyBlockId:Array<number> = new Array<number>(); // the id of the block the drill is destroying.
    protected drillDestroyId:Array<number> = new Array<number>(); //the id of the drill.

    // Stuff to end the level and go to the next level
    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => GameLevel;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;
    
    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    protected grid: GridNode;
    protected selectedBlock: string = ""; //The current block that the player clicked on.
    protected showGridTimer: Timer; //Timer to delay the show grid event.

    protected cancelLabel: Label;

    protected timeSlowFilterScreen: Rect;

    protected static invincible: boolean = false;

    protected pause: Layer;


    // Every level will have a goal card, which will be an animated sprite
    protected goal: AnimatedSprite;

    initScene(): void{
        // if(GameLevel.livesCount === 0){
        //     GameLevel.livesCount += this.sceneOptions.inventory.lives;
        // }
        GameLevel.floatingBlockCardCount = this.sceneOptions.inventory.floatingBlocks;
        GameLevel.springBlockCardCount = this.sceneOptions.inventory.springBlocks;
        GameLevel.drillBlockCardCount = this.sceneOptions.inventory.drillBlocks;
        console.log("Drill Card cound" + GameLevel.drillBlockCardCount);
    }

    startScene(): void {
        // Do the game level standard initializations
        this.initLayers();
        this.initViewport();
        this.initPlayer();
        this.initGrid();
        this.subscribeToEvents();
        this.addUI();
        this.addCardGUI(); //add the card buttons on the bottom.

        // Initialize the timers
        this.showGridTimer = new Timer(500, ()=> {
            this.emitter.fireEvent(CC_EVENTS.SHOW_PLACEMENT_GRID);
        });
        this.respawnTimer = new Timer(1000, () => {
            // if(GameLevel.livesCount === 0){
            //     this.sceneManager.changeToScene(MainMenu);
            // } else {
                // this.respawnPlayer();
                // this.player.enablePhysics();
                // this.player.unfreeze();
                this.restartlevel();
            //}
        });
        this.levelTransitionTimer = new Timer(500);
        this.levelEndTimer = new Timer(3000, () => {
            // After the level end timer ends, fade to black and then go to the next scene
            this.levelTransitionScreen.tweens.play("fadeIn");
        });

        // Start the black screen fade out
        this.levelTransitionScreen.tweens.play("fadeOut");

        // Initially disable player movement
        Input.disableInput();
    }

    // HOMEWORK 4 - TODO
    /**
     * Provide a proper death animation for the player character.
     * Use tweens to achieve this goal.
     * You are also welcome to edit the spritesheet to make a new animation,
     * however tweens MUST also be used.
     */
    updateScene(deltaT: number){
        // Handle events and update the UI if needed
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            
            switch(event.type){
                case CC_EVENTS.PLAYER_HIT_FLOATING_BLOCK_CARD:
                    {
                        console.log("card");
                        // Hit a card
                        let card;
                        if(event.data.get("node") === this.player.id){
                            // Other is card, disable
                            card = this.sceneGraph.getNode(event.data.get("other"));
                        } else {
                            // Node is card, disable
                            card = this.sceneGraph.getNode(event.data.get("node"));
                        }
                        
                        // Remove card
                        card.destroy();


                        // Increment our number of cards
                        this.incPlayerFloatingBlockCards(1);

                        // Play a card sound
                        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "coin", loop: false, holdReference: false});
                    }
                    break;

                    case CC_EVENTS.PLAYER_HIT_SPRING_BLOCK_CARD:
                    {
                        console.log("card");
                        // Hit a card
                        let card;
                        if(event.data.get("node") === this.player.id){
                            // Other is card, disable
                            card = this.sceneGraph.getNode(event.data.get("other"));
                        } else {
                            // Node is card, disable
                            card = this.sceneGraph.getNode(event.data.get("node"));
                        }
                        
                        // Remove card
                        card.destroy();


                        // Increment our number of cards
                        this.incPlayerSpringBlockCards(1);

                        // Play a card sound
                        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "coin", loop: false, holdReference: false});
                    }
                    break;

                    case CC_EVENTS.PLAYER_HIT_CIRCULAR_ROCK_CARD:
                    {
                        console.log("card");
                        // Hit a card
                        let card;
                        if(event.data.get("node") === this.player.id){
                            // Other is card, disable
                            card = this.sceneGraph.getNode(event.data.get("other"));
                        } else {
                            // Node is card, disable
                            card = this.sceneGraph.getNode(event.data.get("node"));
                        }
                        
                        // Remove card
                        card.destroy();


                        // Increment our number of cards
                        this.incPlayerCircularRockCards(1);

                        // Play a card sound
                        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "coin", loop: false, holdReference: false});
                    }
                    break;

                    case CC_EVENTS.PLAYER_HIT_DRILL_BLOCK_CARD:
                    {
                        console.log("card");
                        // Hit a card
                        let card;
                        if(event.data.get("node") === this.player.id){
                            // Other is card, disable
                            card = this.sceneGraph.getNode(event.data.get("other"));
                        } else {
                            // Node is card, disable
                            card = this.sceneGraph.getNode(event.data.get("node"));
                        }
                        
                        // Remove card
                        card.destroy();


                        // Increment our number of cards
                        this.incPlayerDrillBlockCards(1);

                        // Play a card sound
                        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "coin", loop: false, holdReference: false});
                    }
                    break;

                // case CC_EVENTS.PLAYER_HIT_COIN_BLOCK:
                //     {
                //         // Hit a coin block, so increment our number of coins
                //         this.incPlayerCoins(1);
                //         this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "coin", loop: false, holdReference: false});
                //     }
                //     break;

                case CC_EVENTS.PLAYER_HIT_ENEMY:
                    {
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));

                        if(node === this.player){
                            // Node is player, other is enemy
                            this.handlePlayerEnemyCollision(<AnimatedSprite>node, <AnimatedSprite>other);
                        } else {
                            // Other is player, node is enemy
                            this.handlePlayerEnemyCollision(<AnimatedSprite>other,<AnimatedSprite>node);
                        }
                    }
                    break;
                
                case CC_EVENTS.PLAYER_DIED:
                    {
                        
                        //this.player.freeze();
                        
                        this.player.isCollidable = false;
                        //this.player.tweens.play("dying", false);
                        this.player.tweens.play("flip2", false);
                        //this.player.animation.play("DYING", false);
                        //setTimeout(() => { this.player.tweens.play("jump", false); }, 500);
                        setTimeout(() => { this.player.unfreeze(); }, 1000);
                        setTimeout(() => { this.player.isCollidable = true; }, 1000);
                        
                    }
                    break;
                case CC_EVENTS.ENEMY_DIED:
                    {
                        // An enemy finished its dying animation, destroy it
                        let node = this.sceneGraph.getNode(event.data.get("owner"));
                        node.destroy();
                        
                    }
                    break;
                    
                case CC_EVENTS.PLAYER_ENTERED_LEVEL_END:
                    {
                        if(!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()){
                            // The player has reached the end of the level
                            this.levelEndTimer.start();
                            this.levelEndLabel.tweens.play("slideIn");
                        }
                    }
                    break;

                case CC_EVENTS.LEVEL_START:
                    {
                        // Re-enable controls
                        Input.enableInput();
                    }
                    break;
                
                case CC_EVENTS.LEVEL_END:
                    {
                        // Go to the next level
                        if(this.nextLevel){
                            let sceneOptions = {
                                physics: {
                                    groupNames: ["ground", "player", "enemy", "card"],
                                    collisions:
                                    [
                                        [0, 1, 1, 0],
                                        [1, 0, 0, 1],
                                        [1, 0, 0, 0],
                                        [0, 1, 0, 0]
                                    ],
                                    inventory: {
                                        floatingBlocks: 0, 
                                        springBlocks: 0, 
                                        drillBlocks: 0
                                    }
                                }
                            }
                            this.sceneManager.changeToScene(this.nextLevel, {}, sceneOptions);
                        }else{
                            this.sceneManager.changeToScene(LevelSelect);
                        }
                    }
                    break;

                case CC_EVENTS.PLACE_BLOCK:
                    {
                        //The code to run when the block has been placed.
                        //this.selectedBlock stores the card name that is currectly selected.
                        let row = event.data.get("row");
                        let col = event.data.get("col");
                            
                        
                        if(this.selectedBlock === "floating_block")
                        {
                            //places floating block.
                            this.addBlock(this.selectedBlock, new Vec2(row, col));
                            this.incPlayerFloatingBlockCards(-1);
                        }
                        else if(this.selectedBlock === "spring_block")
                        {
                            //places spring block. With the given orientation from GridNode class.
                            let orientation = event.data.get("orientation");
                            this.addBlock(this.selectedBlock, new Vec2(row, col), {orientation: orientation});
                            this.incPlayerSpringBlockCards(-1);
                        }
                        else if(this.selectedBlock === "drill_block")
                        {
                            //this.addBlock(this.selectedBlock, new Vec2(row, col));
                            let block = this.add.animatedSprite("drill_block", "primary");
                            //block.rotation = Math.PI;
                            block.position.set(row * 32 + 16, col * 32 + 16);
                            block.scale.set(2, 2);
                            block.animation.play("SPAWN", false, CC_EVENTS.DRILL_BLOCK);
                            block.animation.queue("DESTROY", false, CC_EVENTS.DESTROY_BLOCK);

                            //data used by the DRILL_BLOCK event after the spawn animation finishes.
                            this.drillDestroyColNum.push(col);
                            this.drillDestroyRowNum.push(row);
                            this.drillDestroyBlockId.push(event.data.get("blockId"));
                            this.drillDestroyId.push(block.id);

                            this.incPlayerDrillBlockCards(-1);
                        }

                        //patch up work.
                        this.unfreezeGame(); //unfreeze player and enemy movement.
                        this.grid.setShowGrid(false); //hide the grid.
                        this.cancelLabel.visible = false; //hide the cancel placement label
                        this.timeSlowFilterScreen.tweens.play("fadeOut"); //return from icy blue screen to normal screen.
                        this.selectedBlock = ""; //make the current selected card empty.
                    }
                    break;

                case CC_EVENTS.DRILL_BLOCK:
                    {
                        //The code to run after the drill spawn animation.
                        let blockId = this.drillDestroyBlockId.shift();
                        let row = this.drillDestroyRowNum.shift();
                        let col = this.drillDestroyColNum.shift();
                        if(blockId >= 0)
                        {
                            //destorys block with given id, and remove it from grid's list of current blocks.
                            this.sceneGraph.getNode(blockId).destroy();
                            this.grid.removeBlockLocation(blockId);
                        }
                        else
                        {
                            (this.getTilemap("Main") as OrthogonalTilemap).setTileAtRowCol(new Vec2(row, col), 0);
                        }
                    }
                    break;

                    case CC_EVENTS.DESTROY_BLOCK:
                        {
                            //The code to run after the drill destroy animation.
                            let node = this.sceneGraph.getNode(this.drillDestroyId.shift());
                            node.destroy();
                        }
                        break;

                    //unused
                case CC_EVENTS.HIDE_PLACEMENT_GRID:
                    {
                        this.grid.setShowGrid(false);
                    }
                    break;

                    //unused
                case CC_EVENTS.SHOW_PLACEMENT_GRID:
                    {
                        this.grid.showGridFor(this.selectedBlock);
                        
                    }
                    break;

                case CC_EVENTS.CARD_CLICKED:
                {
                    //gets the card that was pressed. This works together with Mouse_up event below.
                    //Grid will not show unless the player releases the mouse click.
                    let cardName = event.data.get("cardName");
                    //only can select the cards that have a count greater than 0.
                    if(cardName === "spring_block" && GameLevel.springBlockCardCount > 0)
                    {
                        this.selectedBlock = cardName;
                    }
                    if(cardName === "floating_block" && GameLevel.floatingBlockCardCount > 0)
                    {
                        this.selectedBlock = cardName;
                    }
                    if(cardName === "drill_block" && GameLevel.drillBlockCardCount > 0)
                    {
                        this.selectedBlock = cardName;
                    }
                }
                break;

                case GameEventType.MOUSE_UP:
                {
                    //runs when the player clicks on a card. Using game event mouse_up to prevent card from being selected on mouse press only.
                    if(this.selectedBlock !== "" && !this.grid.isShowGrid())
                    {
                        this.activateCardPlacement();
                    }
                    
                }
                break;

                case "pause":
                {
                    this.pause.setHidden(false);
                    this.freezeGame();
                }
                break;

                case "unpause":
                {
                    this.pause.setHidden(true);
                    this.unfreezeGame();
                }
                break;

                case "levelSelect":
                {
                    this.sceneManager.changeToScene(LevelSelect);
                }
                break;

                case "restart":
                {
                    this.restartlevel();
                }
                break;

                case "mainMenu":
                {
                    this.sceneManager.changeToScene(MainMenu);
                }
                break;
            }
        }

        //CHEATTTTTT PRESS k. Get 10 blocks of each type.
        if(Input.isJustPressed("giveBlock") && this.pause.isHidden())
        {
            this.incPlayerFloatingBlockCards(10);
            this.incPlayerSpringBlockCards(10);
            this.incPlayerDrillBlockCards(10);
        }

        //return to main menu.
        if(Input.isJustPressed("mainmenu"))
        {
            this.sceneManager.changeToScene(MainMenu);
        }

        //cancel placement of currect card.
        if(Input.isJustPressed("cancelPlacement"))
        {
            if(this.selectedBlock !== "")
            {
                this.unfreezeGame();
                this.grid.setShowGrid(false);
                
                this.selectedBlock = "";
                this.timeSlowFilterScreen.tweens.play("fadeOut");
                this.cancelLabel.visible = false;
            }
        }

        //select the floating_block
        if(Input.isJustPressed("selectFirstCard") && this.pause.isHidden())
        {
            if(GameLevel.floatingBlockCardCount > 0)
            {
                this.selectedBlock = "floating_block";
                this.activateCardPlacement();
            }
        }

        //select the spring_block
        if(Input.isJustPressed("selectSecondCard") && this.pause.isHidden())
        {
            if(GameLevel.springBlockCardCount > 0)
            {
                this.selectedBlock = "spring_block";
                this.activateCardPlacement();
            }
        }

        //TODO: drill block
        if(Input.isJustPressed("selectThirdCard") && this.pause.isHidden())
        {
            this.selectedBlock = "";
            this.activateCardPlacement();
        }

        if(Input.isJustPressed("invincible") && this.pause.isHidden())
        {
            GameLevel.invincible = !GameLevel.invincible;
        }

        
        // If player falls into a pit, kill them off and reset their position
        if(this.player.position.y > 25*64){
            //this.incPlayerLife(-1);
            // if(GameLevel.livesCount === 0){
            //     this.sceneManager.changeToScene(MainMenu);
            // } else {
                this.restartlevel();
            //}
        }
    }

    /**
     * Function that sets up card placement. If this.selectedCard is empty, does nothing.
     * The deactive function is not implement, it is built into the event CC_EVENTS.PLACE_BLOCK.
     */
    protected activateCardPlacement()
    {
        if(this.selectedBlock !== "")
        {
            this.freezeGame(); //stops all player and enemy movement.
            this.grid.showGridFor(this.selectedBlock);
            this.timeSlowFilterScreen.tweens.play("fadeIn");
            this.cancelLabel.visible = true;
        }
    }

    protected restartlevel()
    {
        //restart level is implemented in the level subclasses.
        console.log("Restart level not overridden");
    }

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer behind the tilemap for coinblock animation
        this.addLayer("coinLayer", 0);

        // Add a layer for UI
        this.addUILayer("UI");

        // Add a layer for players and enemies
        this.addLayer("primary", 1);

        // Add grid layer.
        this.addUILayer("grid");

        //Add a pause popup layer
        this.pause = this.addUILayer("pause");
        this.pause.setHidden(true);
    }


    protected initGrid(): void
    {
        this.grid = new GridNode(this.getLayer("grid"), 32, 32, this.viewport, this.getTilemap("Main") as OrthogonalTilemap);
        this.sceneGraph.addNode(this.grid);
    }

    /**
     * Initializes the viewport
     */
    protected initViewport(): void {
        this.viewport.setZoomLevel(2);
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(){
        this.receiver.subscribe([
            // HW4_Events.PLAYER_HIT_COIN,
            // HW4_Events.PLAYER_HIT_COIN_BLOCK,
            // HW4_Events.PLAYER_HIT_ENEMY,
            // HW4_Events.ENEMY_DIED,
            // HW4_Events.PLAYER_ENTERED_LEVEL_END,
            // HW4_Events.LEVEL_START,
            // HW4_Events.LEVEL_END
        ]);
        this.receiver.subscribe([
            CC_EVENTS.PLACE_BLOCK,
            CC_EVENTS.TIME_RESUME,
            CC_EVENTS.LEVEL_START,
            CC_EVENTS.PLAYER_ENTERED_LEVEL_END,
            CC_EVENTS.LEVEL_END,
            CC_EVENTS.TIME_SLOW,
            CC_EVENTS.SHOW_PLACEMENT_GRID,
            CC_EVENTS.HIDE_PLACEMENT_GRID,
            CC_EVENTS.PLAYER_HIT_FLOATING_BLOCK_CARD,
            CC_EVENTS.PLAYER_HIT_SPRING_BLOCK_CARD,
            CC_EVENTS.PLAYER_HIT_CIRCULAR_ROCK_CARD,
            CC_EVENTS.PLAYER_HIT_DRILL_BLOCK_CARD,
            CC_EVENTS.CARD_CLICKED,
            CC_EVENTS.PLAYER_MOVE,
            CC_EVENTS.PLAYER_JUMP,
            CC_EVENTS.PLAYER_HIT_ENEMY,
            CC_EVENTS.PLAYER_DIED,
            CC_EVENTS.DRILL_BLOCK,
            CC_EVENTS.DESTROY_BLOCK,
            GameEventType.MOUSE_UP,
            "pause",
            "unpause",
            "restart",
            "levelSelect",
            "mainMenu"
        ]);
    }

    /**
     * Adds in any necessary UI to the game
     */
    protected addUI(){
        // In-game labels
        // this.coinCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(80, 30), text: "Cards: " + GameLevel.floatingBlockCardCount});
        // this.coinCountLabel.textColor = Color.WHITE
        // this.coinCountLabel.font = "PixelSimple";
        // this.livesCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(500, 30), text: "Lives: " + GameLevel.livesCount});
        // this.livesCountLabel.textColor = Color.WHITE
        // this.livesCountLabel.font = "PixelSimple";

        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(-300, 200), text: "Level Complete"});
        this.levelEndLabel.size.set(1200, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";

        // Add a tween to move the label on screen
        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -300,
                    end: 300,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        this.levelTransitionScreen = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: new Vec2(300, 200), size: new Vec2(600, 400)});
        this.levelTransitionScreen.color = new Color(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;

        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: CC_EVENTS.LEVEL_END
        });

        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: CC_EVENTS.LEVEL_START
        });

        this.timeSlowFilterScreen = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: new Vec2(300, 200), size: new Vec2(600, 400)});
        this.timeSlowFilterScreen.color = new Color(60, 114, 201);
        this.timeSlowFilterScreen.alpha = 0;

        this.timeSlowFilterScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 200,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 0.2,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
        });

        this.timeSlowFilterScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 200,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0.2,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
        });

        this.cancelLabel = <Label>this.add.uiElement(UIElementType.LABEL, "grid", {position: new Vec2(2.5 * 32, 10 * 32), text: "E to Cancel"});
        this.cancelLabel.font = "PixelSimple";
        this.cancelLabel.fontSize = 36;
        this.cancelLabel.visible = false;
        //this.cancelLabel.size.set(120, 60);
        //this.cancelLabel.backgroundColor = new Color(34, 32, 52);
        this.cancelLabel.textColor = Color.WHITE;

        let size = this.viewport.getHalfSize();

        //Add pause button to UI
        const pauseButton = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(size.x + 275, size.y - 175), text: ""});
        pauseButton.backgroundColor = new Color(21, 163, 121, 0);
        pauseButton.borderColor = new Color(230, 200, 11, 0);
        pauseButton.borderRadius = 1;
        pauseButton.borderWidth = 5;
        pauseButton.size = new Vec2(32, 32);

        let pauseUI = this.add.sprite("pause_button", "UI");
        pauseUI.position = pauseButton.position;
        pauseUI.scale = new Vec2(2, 2);

        pauseButton.onClickEventId = "pause";

        //Add elements to pause popup layer
        let buttonColor = new Color(157,85,17,1);
        const pauseBackground = <Label>this.add.uiElement(UIElementType.LABEL, "pause", {position: new Vec2(size.x, size.y), text: ""});
        pauseBackground.setBackgroundColor(new Color(247,222,146,1));
        pauseBackground.borderColor = buttonColor;
        pauseBackground.size.set(350,400);
        pauseBackground.borderWidth = 5;

        const resumeButton = <Button>this.add.uiElement(UIElementType.BUTTON, "pause", {position: new Vec2(size.x, size.y - 75), text: "Resume"});
        resumeButton.size.set(250, 50);
        resumeButton.setBackgroundColor(buttonColor);
        resumeButton.borderColor = Color.BLACK;
        resumeButton.setPadding(new Vec2(50, 10));
        resumeButton.scale.set(0.5,0.5);
        resumeButton.onClickEventId = "unpause";

        const restartButton = <Button>this.add.uiElement(UIElementType.BUTTON, "pause", {position: new Vec2(size.x, size.y - 25), text: "Restart"});
        restartButton.size.set(250, 50);
        restartButton.setBackgroundColor(buttonColor);
        restartButton.borderColor = Color.BLACK;
        restartButton.setPadding(new Vec2(50, 10));
        restartButton.scale.set(0.5,0.5);
        restartButton.onClickEventId = "restart";
        
        const levelSelectButton = <Button>this.add.uiElement(UIElementType.BUTTON, "pause", {position: new Vec2(size.x, size.y + 25), text: "Level Select"});
        levelSelectButton.size.set(250, 50);
        levelSelectButton.setBackgroundColor(buttonColor);
        levelSelectButton.borderColor = Color.BLACK;
        levelSelectButton.setPadding(new Vec2(50, 10));
        levelSelectButton.scale.set(0.5,0.5);
        levelSelectButton.onClickEventId = "levelSelect";

        const mainMenuButton = <Button>this.add.uiElement(UIElementType.BUTTON, "pause", {position: new Vec2(size.x, size.y + 75), text: "Main Menu"});
        mainMenuButton.size.set(250, 50);
        mainMenuButton.setBackgroundColor(buttonColor);
        mainMenuButton.borderColor = Color.BLACK;
        mainMenuButton.setPadding(new Vec2(50, 10));
        mainMenuButton.scale.set(0.5,0.5);
        mainMenuButton.onClickEventId = "mainMenu";
    }

    protected addCardGUI(): void {
        
        let size = this.viewport.getHalfSize();

        //adding a button for card one.
        let c1Pos = new Vec2((size.x * 2) * 0.07, (size.y * 2) * 0.90);
        let c1 = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: c1Pos.clone(), text: ""});
        c1.backgroundColor = new Color(21, 163, 121, 0);
        c1.borderColor = new Color(230, 200, 11, 0);
        c1.borderRadius = 1;
        c1.borderWidth = 5;
        c1.size = new Vec2(50,60);
        
        let fbui = this.add.sprite("floating_block_ui", "UI");
        fbui.position = c1Pos;
        fbui.scale = new Vec2(5, 5);
        this.floatingBlockCardUI = fbui;


        if(GameLevel.floatingBlockCardCount === 0)
            this.floatingBlockCardUI.alpha = 0.5;
        //fbui.alpha = 0.5;
        
        
        //c1.addPhysics(new AABB(new Vec2(50, 60)));
        
        //due to viewport sizing issues the actual button that can be clicked is here.
        //let c1C = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: c1Pos.clone().mult(new Vec2(2, 2)), text: ""});
        //c1C.size = new Vec2(100,120);
        c1.onClick = () =>
        {
            if(this.pause.isHidden())
            this.emitter.fireEvent(CC_EVENTS.CARD_CLICKED, {cardName: "floating_block"});
        }

        //adding a button for card two.
        let c2Pos = new Vec2((size.x * 2) * 0.18, (size.y * 2) * 0.90);
        let c2 = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: c2Pos.clone(), text: ""});
        c2.backgroundColor = new Color(21, 163, 121, 0);
        c2.borderColor = new Color(230, 200, 11, 0);
        c2.borderRadius = 1;
        c2.borderWidth = 5;
        c2.size = new Vec2(50,60);
        
        //due to viewport sizing issues the actual button that can be clicked is here.
       // let c2C = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: c2Pos.clone().mult(new Vec2(2, 2)), text: ""});
        //c2C.size = new Vec2(100,120);
        c2.onClick = () =>
        {
            if(this.pause.isHidden())
            this.emitter.fireEvent(CC_EVENTS.CARD_CLICKED, {cardName: "spring_block"});
        }

        let sbui = this.add.sprite("spring_block_ui", "UI");
        sbui.position = c2Pos;
        sbui.scale = new Vec2(5, 5);
        this.springBlockCardUI = sbui;
        if(GameLevel.springBlockCardCount === 0)
            this.springBlockCardUI.alpha = 0.5;



        //adding a button for card three.
        let c3Pos = new Vec2((size.x * 2) * 0.29, (size.y * 2) * 0.90);
        let c3 = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: c3Pos.clone(), text: ""});
        c3.backgroundColor = new Color(21, 163, 121, 0);
        c3.borderColor = new Color(230, 200, 11, 0);
        c3.borderRadius = 1;
        c3.borderWidth = 5;
        c3.size = new Vec2(50,60);
        
        c3.onClick = () =>
        {
            if(this.pause.isHidden())
            this.emitter.fireEvent(CC_EVENTS.CARD_CLICKED, {cardName: "drill_block"});
        }

        //sets the image for the drill card.
        let dbui = this.add.sprite("drill_block_ui", "UI");
        dbui.position = c3Pos;
        dbui.scale = new Vec2(5, 5);
        this.drillBlockCardUI = dbui;
        if(GameLevel.drillBlockCardCount === 0)
            this.drillBlockCardUI.alpha = 0.5;


     




        
        //Add card UI labels
        this.floatingBlockCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: c1Pos.clone().mult(new Vec2(1.30,0.955)), text:"" + GameLevel.floatingBlockCardCount});
        this.floatingBlockCountLabel.setTextColor(Color.BLACK);
        this.floatingBlockCountLabel.font = "PixelSimple";
        this.springBlockCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: c2Pos.clone().mult(new Vec2(1.115,0.955)), text:"" + GameLevel.springBlockCardCount});
        this.springBlockCountLabel.setTextColor(Color.BLACK);
        this.springBlockCountLabel.font = "PixelSimple";
        this.drillBlockCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: c3Pos.clone().mult(new Vec2(1.075,0.955)), text:"" + GameLevel.drillBlockCardCount});
        this.drillBlockCountLabel.setTextColor(Color.BLACK);
        this.drillBlockCountLabel.font = "PixelSimple";

        // this.floatingBlockCountLabel.tweens.add("noCard", {
        //     startDelay: 0,
        //     duration: 1000,
        //     effects: [
        //         {
        //             property: TweenableProperties.,
        //             start: 0,
        //             end: 1,
        //             ease: EaseFunctionType.IN_OUT_QUAD
        //         }
        //     ],
        //     reverseOnComplete: true,
        // });
    }

    /**
     * Initializes the player
     */
    protected initPlayer(): void {
        // Add the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.scale.set(2, 2);
        if(!this.playerSpawn){
            console.warn("Player spawn was never set - setting spawn to (0, 0)");
            this.playerSpawn = Vec2.ZERO;
        }
        this.player.position.copy(this.playerSpawn);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 28)));
        this.player.colliderOffset.set(0, 2);
        this.player.addAI(PlayerController, {playerType: "platformer", tilemap: "Main"});

        // Add triggers on colliding with coins or coinBlocks
        this.player.setGroup("player");

        // Add a tween animation for the player jump
        this.player.tweens.add("flip", {
            startDelay: 0,
            duration: 300,
            effects: [
                {
                    property: "rotation",
                    resetOnComplete: true,
                    start: 0,
                    end: 3.14/8,
                    ease: EaseFunctionType.IN_OUT_SINE
                }
            ],
            reverseOnComplete: true,
        })
        this.player.tweens.add("flip2", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 20*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        })
        this.player.tweens.add("flip2", {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 20*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });

        // Add a tween animation for the player death
        this.player.tweens.add("dying", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 10*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });

        this.viewport.follow(this.player);
    }

    /**
     * Initializes the level end area
     */
    protected addLevelEnd(startingTile: Vec2, size: Vec2): void {
        this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, "primary", {position: startingTile.add(size.scaled(0.5)).scale(32), size: size.scale(32)});
        this.levelEndArea.addPhysics(undefined, undefined, false, true);
        this.levelEndArea.setTrigger("player", CC_EVENTS.PLAYER_ENTERED_LEVEL_END, null);
        this.levelEndArea.color = new Color(0, 0, 0, 0);

        this.goal = this.add.animatedSprite("goal_card","primary");
        this.goal.position.set(startingTile.x, startingTile.y);
        this.goal.scale.set(2,2);
        this.goal.animation.play("IDLE");
    }

    // HOMEWORK 4 - TODO
    /*
        Make sure enemies are being set up properly to have triggers so that when they collide
        with players, they send out a trigger event.

        Look at the levelEndArea trigger for reference.
    */
    /**
     * Adds an enemy into the game
     * @param spriteKey The key of the enemy sprite
     * @param tilePos The tilemap position to add the enemy to
     * @param aiOptions The options for the enemy AI
     */
    protected addEnemy(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.position.set(tilePos.x*32, tilePos.y*32);
        enemy.scale.set(2, 2);
        enemy.addPhysics();
        enemy.addAI(EnemyController, aiOptions);
        enemy.setGroup("enemy");
        enemy.setTrigger("player", CC_EVENTS.PLAYER_HIT_ENEMY, null);

    }

    protected addBlock(spriteKey: string, tilePos: Vec2, data: Record<string, any> = null)
    {
        let block = this.add.animatedSprite(spriteKey, "primary");
        //block.rotation = Math.PI;
        block.position.set(tilePos.x * 32 + 16, tilePos.y * 32 + 16);
        block.scale.set(2, 2);
        block.animation.play("SPAWN", false);
        block.animation.queue("IDLE", true);
        
        if(spriteKey == "floating_block")
        {
            block.setGroup("ground");
            block.addPhysics();
        }
        if(spriteKey == "spring_block")
        {
            block.addPhysics(new AABB(new Vec2(0, 0), new Vec2(9, 9)));
            block.setGroup("enemy");
            let faceDirection = data ? data["orientation"] : SPRING_BLOCK_ENUMS.FACING_TOP;

            //console.log(data["orientation"]);
            //block.setTrigger("player", CC_EVENTS.SPRING_TRIGGERED_DOWN, null);
            if(faceDirection == SPRING_BLOCK_ENUMS.FACING_BOTTOM)
            {
                block.rotation = Math.PI;
                block.setTrigger("player", CC_EVENTS.SPRING_TRIGGERED_DOWN, null);
                block.setTrigger("enemy", CC_EVENTS.SPRING_TRIGGERED_DOWN, null);
            }
            if(faceDirection == SPRING_BLOCK_ENUMS.FACING_LEFT)
            {
                block.rotation = Math.PI * 0.5;
                block.setTrigger("player", CC_EVENTS.SPRING_TRIGGERED_LEFT, null);
                block.setTrigger("enemy", CC_EVENTS.SPRING_TRIGGERED_LEFT, null);
            }
            if(faceDirection == SPRING_BLOCK_ENUMS.FACING_RIGHT)
            {
                block.rotation = Math.PI * 1.5;
                block.setTrigger("player", CC_EVENTS.SPRING_TRIGGERED_RIGHT, null);
                block.setTrigger("enemy", CC_EVENTS.SPRING_TRIGGERED_RIGHT, null);
            }
            if(faceDirection == SPRING_BLOCK_ENUMS.FACING_TOP)
            {
                block.setTrigger("player", CC_EVENTS.SPRING_TRIGGERED_TOP, null);
                block.setTrigger("enemy", CC_EVENTS.SPRING_TRIGGERED_TOP, null);
            }
        }

        this.grid.addBlockLocation(spriteKey, tilePos.clone(), block.id); //used to keep track of locations where blocks can be placed.
    }

    // HOMEWORK 4 - TODO
    /**
     * You must implement this method.
     * There are 3 types of collisions:
     * 
     * 1) Collisions with ghost enemies
     *      Jumping on their head kills them, but walking into them kills the player.
     *      Although it never happens in game, assume that if they fall on the player, it kills them.
     *      You must play the death animation and the ghost death noise you created if the ghost dies
     * 
     * 2) Collisions with helicopter enemies
     *      Jumping into them from underneath kills them, but hitting them in any other way kills the player.
     *      You must play the death animation and the helicopter death noise you created if the helicopter dies.
     * 
     * 3) Collisions with spike enemies
     *      The player always dies
     * 
     * Note that node destruction is handled for you.
     * When an enemy dies, play their death animation (which is defined in their json file) with
     * the proper onEnd event to be handled in updateScene().
     * 
     * Make sure when the player dies to decrease their life and respawn them.
     * 
     * For those who are curious, there is actually a node.destroy() method now!
     * You no longer have to make the nodes invisible and pretend they don't exist.
     * As mentioned above, you don't have to use this yourself, but you can see examples
     * of it in this class.
     * 
     * You can implement this method using whatever math you see fit.
     */
     protected handlePlayerEnemyCollision(player: AnimatedSprite, enemy: AnimatedSprite) {
        
        let direction = player.position.dirTo(enemy.position);
        let livenum = 3;

        if((<EnemyController>enemy.ai).jumpy && !(<EnemyController>enemy.ai).spiky){
            if(direction.dot(Vec2.UP) > 0.5){
                enemy.disablePhysics();
                enemy.tweens.stopAll();
                enemy.animation.play("DYING", false, CC_EVENTS.ENEMY_DIED);
                //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "explode", loop: false, holdReference: false});

                
                (<PlayerController>player.ai).velocity.y = 0;
            } else {
                //if(GameLevel.livesCount > 1){
                    if(!GameLevel.invincible){
                    this.player.disablePhysics();
                    //this.incPlayerLife(-1);
                    //this.player.animation.play("DYING", false);
                    this.emitter.fireEvent(CC_EVENTS.PLAYER_DIED);
                    
                    //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
                    //setTimeout(() => { this.respawnPlayer(); }, 500);
                    //setTimeout(() => { this.player.enablePhysics(); }, 500);
                    this.respawnTimer.start();
                    }
                // }
                // else{
                //     this.player.disablePhysics();
                //     this.emitter.fireEvent(CC_EVENTS.PLAYER_DIED);
                //     //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
                //     setTimeout(() => { this.player.enablePhysics(); }, 1200);
                //     setTimeout(() => { this.sceneManager.changeToScene(MainMenu); }, 600);
                // }
            }
        } else {
            if((<EnemyController>enemy.ai).spiky){
                //if(GameLevel.livesCount > 1){
                    if(!GameLevel.invincible){
                    this.player.disablePhysics();
                    //this.incPlayerLife(-1);
                    //this.player.animation.play("DYING", false);
                    this.emitter.fireEvent(CC_EVENTS.PLAYER_DIED);
                    
                    // setTimeout(() => { this.respawnPlayer(); }, 500);
                    // setTimeout(() => { this.player.enablePhysics(); }, 1000);
                    this.respawnTimer.start();
                    }
                //}
                // else{
                //     this.player.disablePhysics();
                //     this.emitter.fireEvent(CC_EVENTS.PLAYER_DIED);
                //     setTimeout(() => { this.player.enablePhysics(); }, 1200);
                //     setTimeout(() => { this.sceneManager.changeToScene(MainMenu); }, 600);
                // }
            }
            if(direction.dot(Vec2.DOWN) > 0.5 && !(<EnemyController>enemy.ai).spiky){
                enemy.disablePhysics();
                enemy.animation.play("DYING", false, CC_EVENTS.ENEMY_DIED);
                //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "bunny_death", loop: false, holdReference: false});

                let tempVelocity = (<PlayerController>player.ai).velocity;
                if(tempVelocity.y < 0){
                    tempVelocity.y += 0.2*(<PlayerController>player.ai).velocity.y;
                } else {
                    tempVelocity.y = -0.5 * (<PlayerController>player.ai).velocity.y;
                }
            } else {
                //if(GameLevel.livesCount > 1){
                    if(!GameLevel.invincible){
                    this.player.disablePhysics();
                    //this.incPlayerLife(-1);
                    //this.player.animation.play("DYING", false);
                    this.emitter.fireEvent(CC_EVENTS.PLAYER_DIED);
                    // this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
                    // setTimeout(() => { this.respawnPlayer(); }, 500);
                    // setTimeout(() => { this.player.enablePhysics(); }, 500);
                    this.respawnTimer.start();
                    }
                // }
                // else{
                //     this.player.disablePhysics();
                //     this.emitter.fireEvent(CC_EVENTS.PLAYER_DIED);
                //     this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
                //     setTimeout(() => { this.player.enablePhysics(); }, 1200);
                //     setTimeout(() => { this.sceneManager.changeToScene(MainMenu); }, 600);
                    
                    
                // }
            }
        }
    }

    /**
     * Increments the amount of life the player has
     * @param amt The amount to add to the player life
     */
    // protected incPlayerLife(amt: number): void {
    //     GameLevel.livesCount += amt;
    //     this.livesCountLabel.setText("Lives: " + GameLevel.livesCount);
    // }

    /**
     * Increments the number of floating block cards the player has
     * @param amt The amount to add the the number of floating block cards
     */
    protected incPlayerFloatingBlockCards(amt: number): void {
        GameLevel.floatingBlockCardCount += amt;
        this.floatingBlockCountLabel.setText("" + GameLevel.floatingBlockCardCount);
        if(GameLevel.floatingBlockCardCount === 0)
            this.floatingBlockCardUI.alpha = 0.5;
        else
            this.floatingBlockCardUI.alpha = 1;
    }

    /**
     * Used to pause the game. Used when player is placing a block.
     */
    protected freezeGame()
    {
        //sends an event to player and enemy
        //(<PlayerController>this.player.ai).slow = true;
        this.emitter.fireEvent(CC_EVENTS.PAUSE_GAME);
        
    }

    /**
     * Unfreeze the game.
     */
    protected unfreezeGame()
    {
        //sends an event to player and enemy
        //(<PlayerController>this.player.ai).slow = false;
        this.emitter.fireEvent(CC_EVENTS.UNPAUSE_GAME);
    }

    /**
     * Increments the number of floating block cards the player has
     * @param amt The amount to add the the number of floating block cards
     */
     protected incPlayerSpringBlockCards(amt: number): void {
        GameLevel.springBlockCardCount += amt;
        this.springBlockCountLabel.setText("" + GameLevel.springBlockCardCount);
        if(GameLevel.springBlockCardCount === 0)
            this.springBlockCardUI.alpha = 0.5;
        else
            this.springBlockCardUI.alpha = 1;
    }

    /**
     * Increments the number of floating block cards the player has
     * @param amt The amount to add the the number of floating block cards
     */
     protected incPlayerCircularRockCards(amt: number): void {
        GameLevel.drillBlockCardCount += amt;
        this.drillBlockCountLabel.setText("" + GameLevel.drillBlockCardCount);
    }

    /**
     * Increments the number of drill block cards the player has
     * @param amt The amount to add the the number of floating block cards
     */
     protected incPlayerDrillBlockCards(amt: number): void {
        GameLevel.drillBlockCardCount += amt;
        this.drillBlockCountLabel.setText("" + GameLevel.drillBlockCardCount);
        if(GameLevel.drillBlockCardCount === 0)
            this.drillBlockCardUI.alpha = 0.5;
        else
            this.drillBlockCardUI.alpha = 1;
    }

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        this.player.position.copy(this.playerSpawn);
    }
}