import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";

//import Level2 from "./Level2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import GameLevel from "./GameLevel";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";
import Level4 from "./Level4";
import Level6 from "./Level6";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Color from "../../Wolfie2D/Utils/Color";

export default class Level5 extends GameLevel {
    
    loadScene(): void {
        // Load resources
        super.loadScene();
        //this.load.image("background", "hw4_assets/sprites/2bitbackground.png");
        //this.load.image("coin", "hw4_assets/sprites/coin.png");
        this.load.image("background", "card-capsules_assets/sprites/IceBackground1.png");
        this.load.tilemap("level5", "card-capsules_assets/tilemaps/level5.json");
        this.load.spritesheet("player", "card-capsules_assets/spritesheets/Spaceman.json");
        this.load.spritesheet("floating_block", "card-capsules_assets/spritesheets/floating_block.json");
        this.load.spritesheet("spring_block", "card-capsules_assets/spritesheets/spring_block.json");
        this.load.spritesheet("drill_block", "card-capsules_assets/spritesheets/drill_block.json");
        this.load.spritesheet("goal_card", "card-capsules_assets/spritesheets/goal_card.json");
        this.load.spritesheet("Rock_Monster", "card-capsules_assets/spritesheets/Rock_Monster.json");
        this.load.spritesheet("Cactus", "card-capsules_assets/spritesheets/Cactus.json");
        this.load.image("floating_block_ui", "card-capsules_assets/sprites/floating_block_ui.png");
        
        this.load.image("spring_block_ui", "card-capsules_assets/sprites/spring_block_ui.png");
        this.load.image("drill_block_ui", "card-capsules_assets/sprites/drill_block_ui.png");
        this.load.image("pause_button", "card-capsules_assets/sprites/pause_button.png");
        //this.load.spritesheet("hopper", "hw4_assets/spritesheets/hopper.json");
        //this.load.spritesheet("bunny", "hw4_assets/spritesheets/ghostBunny.json");
        //this.load.audio("jump", "hw4_assets/sounds/jump.wav");
        //this.load.audio("coin", "hw4_assets/sounds/coin.wav");
        //this.load.audio("player_death", "hw4_assets/sounds/player_death.wav");
        //this.load.audio("bunny_death", "hw4_assets/sounds/bunny_death.wav");
        //this.load.audio("hopper_death", "hw4_assets/sounds/hopper_death.wav");
        this.load.audio("level_music", "card-capsules_assets/Music/ice_level.mp3");
        this.load.audio("jump", "card-capsules_assets/Sounds/jump.mp3");
        this.load.audio("spin", "card-capsules_assets/Sounds/spin.mp3");
        this.load.audio("block_placement", "card-capsules_assets/Sounds/block_placement.mp3");
        this.load.audio("Rock_Death", "card-capsules_assets/Sounds/Rock_Death.mp3");
        this.load.audio("Card_Pickup", "card-capsules_assets/Sounds/Card_Pickup.mp3");
    }

    // HOMEWORK 4 - TODO
    /**
     * Decide which resource to keep and which to cull.
     * 
     * Check out the resource manager class.
     * 
     * Figure out how to save resources from being unloaded, and save the ones that are needed
     * for level 2.
     * 
     * This will let us cut down on load time for the game (although there is admittedly
     * not a lot of load time for such a small project).
     */
    unloadScene(){
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.load.keepAudio("button_click_sfx");
    }

    startScene(): void {
        // Add a background layer and set the background image on it
        this.addParallaxLayer("bg", new Vec2(0.25, 0.1), -100);
        let bg = this.add.sprite("background", "bg");
        bg.scale.set(16, 16);
        bg.position.set(bg.boundary.halfSize.x, bg.boundary.halfSize.y);

        // Add the level 4 tilemap
        this.add.tilemap("level5", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 45*32);

        this.playerSpawn = new Vec2(4*32, 37*32);

        // Do generic setup for a GameLevel
        super.startScene();

        this.addLevelEnd(new Vec2(36, 4), new Vec2(1, 1));
        //this.addLevelEnd(new Vec2(58, 15), new Vec2(1, 1));

        this.updateUnlockedLevel(5);

        this.nextLevel = Level6;

        //Add enemies of various types
        //Add enemies of various types
        for(let pos of [new Vec2(29, 39), new Vec2(47,20), new Vec2(57,32)]){
            this.addEnemy("Rock_Monster", pos, {});
        }

        for(let pos of [new Vec2(14.5, 29), new Vec2(8.5,29), new Vec2(29.5,21), new Vec2(30.5,17), new Vec2(35.5,15), new Vec2(46.5,20)]){
            this.addEnemy("Cactus", pos, {spiky: true});
        }

        this.addPropertiesToLabel(<Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(2.5*32, 27.5*32), text: "The drill can destroy"}));
        this.addPropertiesToLabel(<Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(2.5*32, 28.5*32), text: "any block in your path."}));
        this.addPropertiesToLabel(<Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(42*32, 28.5*32), text: "Which path will you take?"}));

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    private addPropertiesToLabel(label: Label):void
    {
        label.textColor = Color.WHITE;
        label.font = "PixelSimple";
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);

        if(Input.isJustPressed("restart"))
        {
            this.restartlevel();
        }

        if(Input.isJustPressed("changeLevel1"))
        {
            let sceneOptions = {
                physics: {
                    groupNames: ["ground", "player", "enemy", "card"],
                    collisions:
                    [
                        [0, 1, 1, 0],
                        [1, 0, 0, 1],
                        [1, 0, 0, 0],
                        [0, 1, 0, 0]
                    ]
                },
                inventory: {
                    floatingBlocks: 0, 
                    springBlocks: 0, 
                    drillBlocks: 0
                }
            }
            this.sceneManager.changeToScene(Level1, {}, sceneOptions);
        }

        if(Input.isJustPressed("changeLevel2"))
        {
            let sceneOptions = {
                physics: {
                    groupNames: ["ground", "player", "enemy", "card"],
                    collisions:
                    [
                        [0, 1, 1, 0],
                        [1, 0, 0, 1],
                        [1, 0, 0, 0],
                        [0, 1, 0, 0]
                    ]
                },
                inventory: {
                    floatingBlocks: 0, 
                    springBlocks: 0, 
                    drillBlocks: 0
                }
            }
            this.sceneManager.changeToScene(Level2, {}, sceneOptions);
        }

        if(Input.isJustPressed("changeLevel3"))
        {
            let sceneOptions = {
                physics: {
                    groupNames: ["ground", "player", "enemy", "card"],
                    collisions:
                    [
                        [0, 1, 1, 0],
                        [1, 0, 0, 1],
                        [1, 0, 0, 0],
                        [0, 1, 0, 0]
                    ]
                },
                inventory: {
                    floatingBlocks: 0, 
                    springBlocks: 0, 
                    drillBlocks: 0
                }
            }
            this.sceneManager.changeToScene(Level3, {}, sceneOptions);
        }

        if(Input.isJustPressed("changeLevel4"))
        {
            let sceneOptions = {
                physics: {
                    groupNames: ["ground", "player", "enemy", "card"],
                    collisions:
                    [
                        [0, 1, 1, 0],
                        [1, 0, 0, 1],
                        [1, 0, 0, 0],
                        [0, 1, 0, 0]
                    ]
                },
                inventory: {
                    floatingBlocks: 0, 
                    springBlocks: 0, 
                    drillBlocks: 0
                }
            }
            this.sceneManager.changeToScene(Level4, {}, sceneOptions);
        }

        if(Input.isJustPressed("changeLevel5"))
        {
            let sceneOptions = {
                physics: {
                    groupNames: ["ground", "player", "enemy", "card"],
                    collisions:
                    [
                        [0, 1, 1, 0],
                        [1, 0, 0, 1],
                        [1, 0, 0, 0],
                        [0, 1, 0, 0]
                    ]
                },
                inventory: {
                    floatingBlocks: 0, 
                    springBlocks: 0, 
                    drillBlocks: 0
                }
            }
            this.sceneManager.changeToScene(Level5, {}, sceneOptions);
        }

        if(Input.isJustPressed("changeLevel6"))
        {
            let sceneOptions = {
                physics: {
                    groupNames: ["ground", "player", "enemy", "card"],
                    collisions:
                    [
                        [0, 1, 1, 0],
                        [1, 0, 0, 1],
                        [1, 0, 0, 0],
                        [0, 1, 0, 0]
                    ]
                },
                inventory: {
                    floatingBlocks: 0, 
                    springBlocks: 0, 
                    drillBlocks: 0
                }
            }
            this.sceneManager.changeToScene(Level6, {}, sceneOptions);
        }

        Debug.log("playerpos", this.player.position.toString());
    }

    protected restartlevel()
    {
        let sceneOptions = {
            physics: {
                groupNames: ["ground", "player", "enemy", "card"],
                collisions:
                [
                    [0, 1, 1, 0],
                    [1, 0, 0, 1],
                    [1, 0, 0, 0],
                    [0, 1, 0, 0]
                ]
            },
            inventory: {
                floatingBlocks: 0, 
                springBlocks: 0, 
                drillBlocks: 0
            }
        }
        this.sceneManager.changeToScene(Level5, {}, sceneOptions);
    }
}