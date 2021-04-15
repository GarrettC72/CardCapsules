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
    protected static springBlockCardCount: number = 0;
    protected static circularRockCount: number = 0;
    protected static coinCount: number = 0;
    protected coinCountLabel: Label;
    protected static livesCount: number = 3;
    protected livesCountLabel: Label;

    // Stuff to end the level and go to the next level
    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => GameLevel;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;
    
    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    protected grid: GridNode;
    protected selectedBlock: string = "floating_block"; //The current block that the player clicked on.
    protected showGridTimer: Timer; //Timer to delay the show grid event.


    // Every level will have a goal card, which will be an animated sprite
    protected goal: AnimatedSprite;

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
            if(GameLevel.livesCount === 0){
                this.sceneManager.changeToScene(MainMenu);
            } else {
                this.respawnPlayer();
                this.player.enablePhysics();
                this.player.unfreeze();
            }
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

                // case HW4_Events.PLAYER_HIT_COIN_BLOCK:
                //     {
                //         // Hit a coin block, so increment our number of coins
                //         this.incPlayerCoins(1);
                //         this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "coin", loop: false, holdReference: false});
                //     }
                //     break;

                // case HW4_Events.PLAYER_HIT_ENEMY:
                //     {
                //         let node = this.sceneGraph.getNode(event.data.get("node"));
                //         let other = this.sceneGraph.getNode(event.data.get("other"));

                //         if(node === this.player){
                //             // Node is player, other is enemy
                //             this.handlePlayerEnemyCollision(<AnimatedSprite>node, <AnimatedSprite>other);
                //         } else {
                //             // Other is player, node is enemy
                //             this.handlePlayerEnemyCollision(<AnimatedSprite>other,<AnimatedSprite>node);
                //         }
                //     }
                //     break;

                // case HW4_Events.ENEMY_DIED:
                //     {
                //         // An enemy finished its dying animation, destroy it
                //         let node = this.sceneGraph.getNode(event.data.get("owner"));
                //         node.destroy();
                //     }
                //     break;
                    
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
                                    groupNames: ["ground", "player", "enemy", "coin"],
                                    collisions:
                                    [
                                        [0, 1, 1, 0],
                                        [1, 0, 0, 1],
                                        [1, 0, 0, 0],
                                        [0, 1, 0, 0]
                                    ]
                                }
                            }
                            this.sceneManager.changeToScene(this.nextLevel, {}, sceneOptions);
                        }
                    }
                    break;

                case CC_EVENTS.PLACE_BLOCK:
                    {
                        let row = event.data.get("row");
                        let col = event.data.get("col");
                        let orientation = event.data.get("orientation");
                        if(orientation)
                            this.addBlock(this.selectedBlock, new Vec2(row, col), {orientation: orientation});
                        else
                            this.addBlock(this.selectedBlock, new Vec2(row, col));
                        this.grid.setShowGrid(false);
                    }
                    break;

                case CC_EVENTS.HIDE_PLACEMENT_GRID:
                    {
                        this.grid.setShowGrid(false);
                    }
                    break;

                case CC_EVENTS.SHOW_PLACEMENT_GRID:
                    {
                        this.grid.showGridFor(this.selectedBlock);
                    }
                    break;

                case CC_EVENTS.CARD_CLICKED:
                {
                    let cardName = event.data.get("cardName");
                    this.selectedBlock = cardName;
                    this.showGridTimer.start();
                }
                break;

            }
        }

        if(Input.isJustPressed("grid"))
        {
            this.grid.setShowGrid(!this.grid.isShowGrid());
        }

        // If player falls into a pit, kill them off and reset their position
        if(this.player.position.y > 25*64){
            this.incPlayerLife(-1);
            this.respawnPlayer();
        }
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
            CC_EVENTS.CARD_CLICKED,
        ]);
    }

    /**
     * Adds in any necessary UI to the game
     */
    protected addUI(){
        // In-game labels
        this.coinCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(80, 30), text: "Coins: " + GameLevel.coinCount});
        this.coinCountLabel.textColor = Color.WHITE
        this.coinCountLabel.font = "PixelSimple";
        this.livesCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(500, 30), text: "Lives: " + GameLevel.livesCount});
        this.livesCountLabel.textColor = Color.WHITE
        this.livesCountLabel.font = "PixelSimple";

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
    }

    protected addCardGUI(): void {
        
        let size = this.viewport.getHalfSize();

        //adding a button for card one.
        let c1Pos = new Vec2((size.x * 2) * 0.07, (size.y * 2) * 0.90);
        let c1 = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: c1Pos.clone(), text: "1"});
        c1.backgroundColor = new Color(21, 163, 121);
        c1.borderColor = new Color(230, 200, 11);
        c1.borderRadius = 1;
        c1.borderWidth = 5;
        c1.size = new Vec2(100,120);
        
        //due to viewport sizing issues the actual button that can be clicked is here.
        let c1C = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: c1Pos.clone().mult(new Vec2(2, 2)), text: ""});
        c1C.size = new Vec2(100,120);
        c1C.onClick = () =>
        {
            this.emitter.fireEvent(CC_EVENTS.CARD_CLICKED, {cardName: "floating_block"});
        }

        //adding a button for card two.
        let c2Pos = new Vec2((size.x * 2) * 0.18, (size.y * 2) * 0.90);
        let c2 = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: c2Pos.clone(), text: "2"});
        c2.backgroundColor = new Color(21, 163, 121);
        c2.borderColor = new Color(230, 200, 11);
        c2.borderRadius = 1;
        c2.borderWidth = 5;
        c2.size = new Vec2(100,120);
        
        //due to viewport sizing issues the actual button that can be clicked is here.
        let c2C = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: c2Pos.clone().mult(new Vec2(2, 2)), text: ""});
        c2C.size = new Vec2(100,120);
        c2C.onClick = () =>
        {
            this.emitter.fireEvent(CC_EVENTS.CARD_CLICKED, {cardName: "spring_block"});
        }


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
        //enemy.setTrigger("player", HW4_Events.PLAYER_HIT_ENEMY, null);
        //enemy.addAI(EnemyController, aiOptions);
        enemy.setGroup("enemy");
    }

    protected addBlock(spriteKey: string, tilePos: Vec2, data: Record<string, any> = null)
    {
        let block = this.add.animatedSprite(spriteKey, "primary");
        //block.rotation = Math.PI;
        block.position.set(tilePos.x * 32 + 16, tilePos.y * 32 + 16);
        block.scale.set(2, 2);
        block.animation.play("IDLE");
        
        if(spriteKey == "floating_block")
        {
            block.setGroup("ground");
            block.addPhysics();
        }
        if(spriteKey == "spring_block")
        {
            block.addPhysics();
            block.setGroup("enemy");
            let faceDirection = data ? data["orientation"] : SPRING_BLOCK_ENUMS.FACING_TOP;

            //console.log(data["orientation"]);
            //block.setTrigger("player", CC_EVENTS.SPRING_TRIGGERED_DOWN, null);
            if(faceDirection == SPRING_BLOCK_ENUMS.FACING_BOTTOM)
            {
                block.rotation = Math.PI;
                block.setTrigger("player", CC_EVENTS.SPRING_TRIGGERED_DOWN, null);
            }
            if(faceDirection == SPRING_BLOCK_ENUMS.FACING_LEFT)
            {
                block.rotation = Math.PI * 0.5;
                block.setTrigger("player", CC_EVENTS.SPRING_TRIGGERED_LEFT, null);
            }
            if(faceDirection == SPRING_BLOCK_ENUMS.FACING_RIGHT)
            {
                block.rotation = Math.PI * 1.5;
                block.setTrigger("player", CC_EVENTS.SPRING_TRIGGERED_RIGHT, null);
            }
            if(faceDirection == SPRING_BLOCK_ENUMS.FACING_TOP)
            {
                block.setTrigger("player", CC_EVENTS.SPRING_TRIGGERED_TOP, null);
            }
        }
        this.grid.addBlockLocation(spriteKey, tilePos.clone()); //used to keep track of locations where blocks can be placed.
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
        let width = (player.size.x + enemy.size.x)/2 * (player.position.y - enemy.position.y);
        let height = (player.size.y + enemy.size.y)/2 * (player.position.x - enemy.position.x);

        switch(enemy.imageId){
            case "GhostBunny":
                if(width < height && width < -height){
                    //enemy.animation.play("DYING", false, HW4_Events.ENEMY_DIED);
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "bunny_death", loop: false, holdReference: false});
                    enemy.disablePhysics();
                }else{
                    this.incPlayerLife(-1);
                    player.tweens.play("dying");
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
                    player.disablePhysics();
                    this.respawnTimer.start();
                }
                break;
            case "Hopper":
                if(width > height && width > -height){
                    //enemy.animation.play("DYING", false, HW4_Events.ENEMY_DIED);
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hopper_death", loop: false, holdReference: false});
                    enemy.disablePhysics();
                }else{
                    this.incPlayerLife(-1);
                    player.tweens.play("dying");
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
                    player.disablePhysics();
                    this.respawnTimer.start();
                }
                break;
            case "spikeball":
                this.incPlayerLife(-1);
                player.tweens.play("dying");
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
                player.disablePhysics();
                this.respawnTimer.start();
        }
    }

    /**
     * Increments the amount of life the player has
     * @param amt The amount to add to the player life
     */
    protected incPlayerLife(amt: number): void {
        GameLevel.livesCount += amt;
        this.livesCountLabel.text = "Lives: " + GameLevel.livesCount;
    }

    /**
     * Increments the number of floating block cards the player has
     * @param amt The amount to add the the number of floating block cards
     */
    protected incPlayerFloatingBlockCards(amt: number): void {
        GameLevel.floatingBlockCardCount += amt;
        this.coinCountLabel.text = "Coins: " + GameLevel.floatingBlockCardCount;
    }

    /**
     * Increments the number of floating block cards the player has
     * @param amt The amount to add the the number of floating block cards
     */
     protected incPlayerSpringBlockCards(amt: number): void {
        GameLevel.springBlockCardCount += amt;
        this.coinCountLabel.text = "Coins: " + GameLevel.springBlockCardCount;
    }

    /**
     * Increments the number of floating block cards the player has
     * @param amt The amount to add the the number of floating block cards
     */
     protected incPlayerCircularRockCards(amt: number): void {
        GameLevel.circularRockCount += amt;
        this.coinCountLabel.text = "Coins: " + GameLevel.circularRockCount;
    }

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        this.player.position.copy(this.playerSpawn);
    }
}