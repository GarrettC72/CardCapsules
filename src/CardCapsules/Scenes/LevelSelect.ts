import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Layer from "../../Wolfie2D/Scene/Layer";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";

import MainMenu from "./MainMenu";
import GameLevel from "./GameLevel";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";
import Level4 from "./Level4";
import Level5 from "./Level5";
import Level6 from "./Level6";

export default class LevelSelect extends Scene {

    animatedSprite: AnimatedSprite;
    private levelSelect: Layer;
    private lockedColor: Color = new Color(80, 80, 80);

    loadScene(): void {
        // Load the menu song
        this.load.audio("menu", "card-capsules_assets/Music/TitleScreen.mp3");
        this.load.image("levelSelectMap", "card-capsules_assets/sprites/levelSelectMap.png");
    }

    startScene(): void {
        //Add a background layer and set the background image on it
        this.addParallaxLayer("bg", new Vec2(0, 0), -100);
        let bg = this.add.sprite("levelSelectMap", "bg");
        bg.scale = new Vec2(4, 4);
        bg.position.set(bg.boundary.halfSize.x, bg.boundary.halfSize.y);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        //Create a level select screen
        this.levelSelect = this.addUILayer("LevelSelect");

        let buttonColor = new Color(157,85,17,1);

        const levelHeader = <Label>this.add.uiElement(UIElementType.LABEL, "LevelSelect", {position: new Vec2(size.x, size.y - 350), text: "Level Select"});
        levelHeader.setTextColor(Color.BLACK);
        levelHeader.fontSize = 60;

        const level1Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x - 496 + 44, size.y + 64 + 44), text: "1"});
        level1Btn.size.set(88, 88);
        level1Btn.borderWidth = 2;
        level1Btn.borderColor = Color.BLACK;
        level1Btn.setTextColor(Color.WHITE);
        level1Btn.setBackgroundColor(buttonColor);
        level1Btn.onClickEventId = "level1";

        const level2Btn = <Button>this.add.uiElement(GameLevel.unlockedLevel >= 2 ? UIElementType.BUTTON : UIElementType.LABEL, "LevelSelect", {position: new Vec2(size.x - 440 + 44, size.y + 220 + 44), text: "2"});
        level2Btn.size.set(88, 88);
        level2Btn.borderWidth = 2;
        level2Btn.borderColor = Color.BLACK;
        level2Btn.setTextColor(Color.WHITE);
        level2Btn.setBackgroundColor(GameLevel.unlockedLevel >= 2 ? buttonColor : this.lockedColor);
        level2Btn.onClickEventId = "level2";

        const level3Btn = <Button>this.add.uiElement(GameLevel.unlockedLevel >= 3 ? UIElementType.BUTTON : UIElementType.LABEL, "LevelSelect", {position: new Vec2(size.x + 148 + 44, size.y + 196 + 44), text: "3"});
        level3Btn.size.set(88, 88);
        level3Btn.borderWidth = 2;
        level3Btn.borderColor = Color.BLACK;
        level3Btn.setTextColor(Color.WHITE);
        level3Btn.setBackgroundColor(GameLevel.unlockedLevel >= 3 ? buttonColor : this.lockedColor);
        level3Btn.onClickEventId = "level3";

        const level4Btn = <Button>this.add.uiElement(GameLevel.unlockedLevel >= 4 ? UIElementType.BUTTON : UIElementType.LABEL, "LevelSelect", {position: new Vec2(size.x + 368 + 44, size.y - 8 + 44), text: "4"});
        level4Btn.size.set(88, 88);
        level4Btn.borderWidth = 2;
        level4Btn.borderColor = Color.BLACK;
        level4Btn.setTextColor(Color.WHITE);
        level4Btn.setBackgroundColor(GameLevel.unlockedLevel >= 4 ? buttonColor : this.lockedColor);
        level4Btn.onClickEventId = "level4";

        const level5Btn = <Button>this.add.uiElement(GameLevel.unlockedLevel >= 5 ? UIElementType.BUTTON : UIElementType.LABEL, "LevelSelect", {position: new Vec2(size.x + 332 + 44, size.y - 308 + 44), text: "5"});
        level5Btn.size.set(88, 88);
        level5Btn.borderWidth = 2;
        level5Btn.borderColor = Color.BLACK;
        level5Btn.setTextColor(Color.WHITE);
        level5Btn.setBackgroundColor(GameLevel.unlockedLevel >= 5 ? buttonColor : this.lockedColor);
        level5Btn.onClickEventId = "level5";

        const level6Btn = <Button>this.add.uiElement(GameLevel.unlockedLevel >= 6 ? UIElementType.BUTTON : UIElementType.LABEL, "LevelSelect", {position: new Vec2(size.x - 232 + 44, size.y - 328 + 44), text: "6"});
        level6Btn.size.set(88, 88);
        level6Btn.borderWidth = 2;
        level6Btn.borderColor = Color.BLACK;
        level6Btn.setTextColor(Color.WHITE);
        level6Btn.setBackgroundColor(GameLevel.unlockedLevel >= 6 ? buttonColor : this.lockedColor);
        level6Btn.onClickEventId = "level6";

        const levelBack = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x - 450, size.y - 350), text: "Main Menu"});
        levelBack.size.set(200, 50);
        levelBack.borderWidth = 2;
        levelBack.borderColor = Color.BLACK;
        levelBack.setBackgroundColor(buttonColor);
        levelBack.onClickEventId = "menu";

        //Subscribe to button events
        this.receiver.subscribe("level1");
        this.receiver.subscribe("level2");
        this.receiver.subscribe("level3");
        this.receiver.subscribe("level4");
        this.receiver.subscribe("level5");
        this.receiver.subscribe("level6");
        this.receiver.subscribe("menu");

        // Scene has started, so start playing music
        if(!MainMenu.onMainMenu){
            MainMenu.onMainMenu = true;
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
        }
    }

    unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        if(!MainMenu.onMainMenu){
            this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu"});
        }else{
            this.load.keepAudio("menu");
        }
        this.load.keepImage("splash_background");
        this.load.keepAudio("button_click_sfx");
    }

    updateScene(): void{
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "level1"){
                /*
                    Init the next scene with physics collisions:

                            ground  player  enemy   coin
                    ground    No      --      --     --
                    player   Yes      No      --     --
                    enemy    Yes      No      No     --
                    coin      No     Yes      No     No

                    Each layer becomes a number. In this case, 4 bits matter for each

                    ground: self - 0001, collisions - 0110
                    player: self - 0010, collisions - 1001
                    enemy:  self - 0100, collisions - 0001
                    coin:   self - 1000, collisions - 0010
                */
                MainMenu.onMainMenu = false;
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
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button_click_sfx", loop:false});
                this.sceneManager.changeToScene(Level1, {}, sceneOptions);
            }

            if(event.type === "level2" && GameLevel.unlockedLevel >= 2)
            {
                MainMenu.onMainMenu = false;
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
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button_click_sfx", loop:false});
                this.sceneManager.changeToScene(Level2, {}, sceneOptions);
            }

            if(event.type === "level3" && GameLevel.unlockedLevel >= 3)
            {
                MainMenu.onMainMenu = false;
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
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button_click_sfx", loop:false});
                this.sceneManager.changeToScene(Level3, {}, sceneOptions);
            }

            if(event.type === "level4" && GameLevel.unlockedLevel >= 4)
            {
                MainMenu.onMainMenu = false;
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
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button_click_sfx", loop:false});
                this.sceneManager.changeToScene(Level4, {}, sceneOptions);
            }

            if(event.type === "level5" && GameLevel.unlockedLevel >= 5)
            {
                MainMenu.onMainMenu = false;
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
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button_click_sfx", loop:false});
                this.sceneManager.changeToScene(Level5, {}, sceneOptions);
            }

            if(event.type === "level6" && GameLevel.unlockedLevel >= 6)
            {
                MainMenu.onMainMenu = false;
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
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button_click_sfx", loop:false});
                this.sceneManager.changeToScene(Level6, {}, sceneOptions);
            }


            if(event.type === "menu"){
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button_click_sfx", loop:false});
                this.sceneManager.changeToScene(MainMenu);
            }
        }
    }
}

