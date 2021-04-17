import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Layer from "../../Wolfie2D/Scene/Layer";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Level1 from "./Level1";
import MainMenu from "./MainMenu";

export default class LevelSelect extends Scene {

    animatedSprite: AnimatedSprite;
    private levelSelect: Layer;

    loadScene(): void {
        // Load the menu song
        //this.load.audio("menu", "card-capsules_assets/music/menu.mp3");
    }

    startScene(): void {

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        //Create a level select screen
        this.levelSelect = this.addUILayer("LevelSelect");

        const levelHeader = <Label>this.add.uiElement(UIElementType.LABEL, "LevelSelect", {position: new Vec2(size.x, size.y - 250), text: "Level Select"});
        levelHeader.setTextColor(Color.WHITE);

        const level1Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x - 300, size.y - 100), text: "1"});
        level1Btn.size.set(100, 100);
        level1Btn.borderWidth = 2;
        level1Btn.borderColor = Color.WHITE;
        level1Btn.setBackgroundColor(Color.TRANSPARENT);
        level1Btn.onEnter = () => {
            level1Btn.borderColor = Color.BLACK;
            level1Btn.setBackgroundColor(Color.WHITE);
            level1Btn.setTextColor(Color.BLACK);
        }
        level1Btn.onLeave = () => {
            level1Btn.borderColor = Color.WHITE;
            level1Btn.setBackgroundColor(Color.TRANSPARENT);
            level1Btn.setTextColor(Color.WHITE);
        }
        level1Btn.onClickEventId = "level1";

        const level2Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x, size.y - 100), text: "2"});
        level2Btn.size.set(100, 100);
        level2Btn.borderWidth = 2;
        level2Btn.borderColor = Color.RED;
        level2Btn.setTextColor(Color.RED);
        level2Btn.setBackgroundColor(Color.TRANSPARENT);

        const level3Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x + 300, size.y - 100), text: "3"});
        level3Btn.size.set(100, 100);
        level3Btn.borderWidth = 2;
        level3Btn.borderColor = Color.RED;
        level3Btn.setTextColor(Color.RED);
        level3Btn.setBackgroundColor(Color.TRANSPARENT);

        const level4Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x - 300, size.y + 100), text: "4"});
        level4Btn.size.set(100, 100);
        level4Btn.borderWidth = 2;
        level4Btn.borderColor = Color.RED;
        level4Btn.setTextColor(Color.RED);
        level4Btn.setBackgroundColor(Color.TRANSPARENT);

        const level5Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x, size.y + 100), text: "5"});
        level5Btn.size.set(100, 100);
        level5Btn.borderWidth = 2;
        level5Btn.borderColor = Color.RED;
        level5Btn.setTextColor(Color.RED);
        level5Btn.setBackgroundColor(Color.TRANSPARENT);

        const level6Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x + 300, size.y + 100), text: "6"});
        level6Btn.size.set(100, 100);
        level6Btn.borderWidth = 2;
        level6Btn.borderColor = Color.RED;
        level6Btn.setTextColor(Color.RED);
        level6Btn.setBackgroundColor(Color.TRANSPARENT);

        const levelBack = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x, size.y + 250), text: "Back"});
        levelBack.size.set(200, 50);
        levelBack.borderWidth = 2;
        levelBack.borderColor = Color.WHITE;
        levelBack.setBackgroundColor(Color.TRANSPARENT);
        levelBack.onClickEventId = "menu";
        levelBack.onEnter = () => {
            levelBack.borderColor = Color.BLACK;
            levelBack.setBackgroundColor(Color.WHITE);
            levelBack.setTextColor(Color.BLACK);
        }
        levelBack.onLeave = () => {
            levelBack.borderColor = Color.WHITE;
            levelBack.setBackgroundColor(Color.TRANSPARENT);
            levelBack.setTextColor(Color.WHITE);
        }

        //Subscribe to button events
        this.receiver.subscribe("level1");
        this.receiver.subscribe("menu");

        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
    }

    unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu"});
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
                        lives: 3, 
                        floatingBlocks: 0, 
                        springBlocks: 0, 
                        circularRocks: 0
                    }
                }
                this.sceneManager.changeToScene(Level1, {}, sceneOptions);
            }

            if(event.type === "menu"){
                this.sceneManager.changeToScene(MainMenu);
            }
        }
    }
}
