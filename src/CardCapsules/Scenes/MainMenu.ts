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

export default class MainMenu extends Scene {

    animatedSprite: AnimatedSprite;
    private mainMenu: Layer;
    private levelSelect: Layer;
    private controls: Layer;
    private help: Layer;

    loadScene(): void {
        // Load the menu song
        //this.load.audio("menu", "card-capsules_assets/music/menu.mp3");
    }

    startScene(): void {
        this.mainMenu = this.addUILayer("Main");

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        // Create a play button
        const playBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y - 150), text: "Play Game"});
        playBtn.size.set(250, 50);
        playBtn.backgroundColor = Color.TRANSPARENT;
        playBtn.borderColor = Color.WHITE;
        playBtn.setPadding(new Vec2(50, 10));
        //playBtn.font = "PixelSimple";
        playBtn.onClickEventId = "play";

        //Create a level select button
        const levelBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y - 50), text: "Level Select"});
        levelBtn.size.set(250, 50);
        levelBtn.backgroundColor = Color.TRANSPARENT;
        levelBtn.borderColor = Color.WHITE;
        levelBtn.setPadding(new Vec2(50, 10));
        //levelBtn.font = "PixelSimple";
        levelBtn.onClickEventId = "level";

        //Create a controls button
        const controlsBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 50), text: "Controls"});
        controlsBtn.size.set(250, 50);
        controlsBtn.backgroundColor = Color.TRANSPARENT;
        controlsBtn.borderColor = Color.WHITE;
        controlsBtn.setPadding(new Vec2(50, 10));
        //controlsBtn.font = "PixelSimple";
        controlsBtn.onClickEventId = "controls";

        //Create a help button
        const helpBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 150), text: "Help"});
        helpBtn.size.set(250, 50);
        helpBtn.backgroundColor = Color.TRANSPARENT;
        helpBtn.borderColor = Color.WHITE;
        helpBtn.setPadding(new Vec2(50, 10));
        //helpBtn.font = "PixelSimple";
        helpBtn.onClickEventId = "help";

        //Create a level select screen
        this.levelSelect = this.addUILayer("LevelSelect");
        this.levelSelect.setHidden(true);

        const levelHeader = <Label>this.add.uiElement(UIElementType.LABEL, "LevelSelect", {position: new Vec2(size.x, size.y - 250), text: "Level Select"});
        levelHeader.textColor = Color.WHITE;

        const level1Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x - 300, size.y - 100), text: "1"});
        level1Btn.size.set(100, 100);
        level1Btn.borderWidth = 2;
        level1Btn.borderColor = Color.WHITE;
        level1Btn.backgroundColor = Color.TRANSPARENT;
        level1Btn.onEnter = () => {
            level1Btn.borderColor = Color.BLACK;
            level1Btn.backgroundColor = Color.WHITE;
            level1Btn.textColor = Color.BLACK;
        }
        level1Btn.onLeave = () => {
            level1Btn.borderColor = Color.WHITE;
            level1Btn.backgroundColor = Color.TRANSPARENT;
            level1Btn.textColor = Color.WHITE;
        }

        const level2Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x, size.y - 100), text: "2"});
        level2Btn.size.set(100, 100);
        level2Btn.borderWidth = 2;
        level2Btn.borderColor = Color.WHITE;
        level2Btn.backgroundColor = Color.TRANSPARENT;

        const level3Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x + 300, size.y - 100), text: "3"});
        level3Btn.size.set(100, 100);
        level3Btn.borderWidth = 2;
        level3Btn.borderColor = Color.WHITE;
        level3Btn.backgroundColor = Color.TRANSPARENT;

        const level4Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x - 300, size.y + 100), text: "4"});
        level4Btn.size.set(100, 100);
        level4Btn.borderWidth = 2;
        level4Btn.borderColor = Color.WHITE;
        level4Btn.backgroundColor = Color.TRANSPARENT;

        const level5Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x, size.y + 100), text: "5"});
        level5Btn.size.set(100, 100);
        level5Btn.borderWidth = 2;
        level5Btn.borderColor = Color.WHITE;
        level5Btn.backgroundColor = Color.TRANSPARENT;

        const level6Btn = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x + 300, size.y + 100), text: "6"});
        level6Btn.size.set(100, 100);
        level6Btn.borderWidth = 2;
        level6Btn.borderColor = Color.WHITE;
        level6Btn.backgroundColor = Color.TRANSPARENT;

        const levelBack = <Button>this.add.uiElement(UIElementType.BUTTON, "LevelSelect", {position: new Vec2(size.x, size.y + 250), text: "Back"});
        levelBack.size.set(200, 50);
        levelBack.borderWidth = 2;
        levelBack.borderColor = Color.WHITE;
        levelBack.backgroundColor = Color.TRANSPARENT;
        levelBack.onClickEventId = "menu";

        //Create a controls screen
        this.controls = this.addUILayer("Controls");
        this.controls.setHidden(true);

        const controlsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 250), text: "Controls"});
        controlsHeader.textColor = Color.WHITE;

        const controlsText1 = "Press A to move left";
        const controlsText2 = "Press D to move right";
        const controlsText3 = "Press W or Space to jump";
        const controlsText4 = "Press S to duck";
        const controlsText5 = "Hold R to restart a level";
        const controlsText6 = "Click on a card to start placing it. Left click";
        const controlsText7 = "to place. Right click to cancel.";

        const controlsLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 150), text: controlsText1});
        const controlsLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 100), text: controlsText2});
        const controlsLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 50), text: controlsText3});
        const controlsLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y), text: controlsText4});
        const controlsLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y + 50), text: controlsText5});
        const controlsLine6 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y + 100), text: controlsText6});
        const controlsLine7 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y + 150), text: controlsText7});

        controlsLine1.textColor = Color.WHITE;
        controlsLine2.textColor = Color.WHITE;
        controlsLine3.textColor = Color.WHITE;
        controlsLine4.textColor = Color.WHITE;
        controlsLine5.textColor = Color.WHITE;
        controlsLine6.textColor = Color.WHITE;
        controlsLine7.textColor = Color.WHITE;

        const controlsBack = <Button>this.add.uiElement(UIElementType.BUTTON, "Controls", {position: new Vec2(size.x, size.y + 250), text: "Back"});
        controlsBack.size.set(200, 50);
        controlsBack.borderWidth = 2;
        controlsBack.borderColor = Color.WHITE;
        controlsBack.backgroundColor = Color.TRANSPARENT;
        controlsBack.onClickEventId = "menu";

        //Create a help screen
        this.help = this.addUILayer("Help");
        this.help.setHidden(true);

        const helpHeader = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 250), text: "Help"});
        helpHeader.textColor = Color.WHITE;

        const helpText1 = "Game developed by Sheng Wei Zhu, John Buckley, and Garrett Chen";
        const helpText2 = "After a terraforming operation went awry due to a space pirate";
        const helpText3 = "assault, our protaganist must crash land on the inhospitable";
        const helpText4 = "world that they were trying to rebuild. The player's newfound";
        const helpText5 = "objective is to reach the wreckage of their ship and to repair";
        const helpText6 = "it with the card capsules that they find from the remnants that";
        const helpText7 = "scattered the planet when the ship crash landed.";

        const helpLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 175), text: helpText1});
        const helpLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 100), text: helpText2});
        const helpLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 50), text: helpText3});
        const helpLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y), text: helpText4});
        const helpLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y + 50), text: helpText5});
        const helpLine6 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y + 100), text: helpText6});
        const helpLine7 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y + 150), text: helpText7});

        helpLine1.textColor = Color.WHITE;
        helpLine2.textColor = Color.WHITE;
        helpLine3.textColor = Color.WHITE;
        helpLine4.textColor = Color.WHITE;
        helpLine5.textColor = Color.WHITE;
        helpLine6.textColor = Color.WHITE;
        helpLine7.textColor = Color.WHITE;

        const helpBack = <Button>this.add.uiElement(UIElementType.BUTTON, "Help", {position: new Vec2(size.x, size.y + 250), text: "Back"});
        helpBack.size.set(200, 50);
        helpBack.borderWidth = 2;
        helpBack.borderColor = Color.WHITE;
        helpBack.backgroundColor = Color.TRANSPARENT;
        helpBack.onClickEventId = "menu";

        //Subscribe to button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("level");
        this.receiver.subscribe("controls");
        this.receiver.subscribe("help");
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

            if(event.type === "play"){
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
                this.sceneManager.changeToScene(Level1, {}, sceneOptions);
            }

            if(event.type === "level"){
                this.levelSelect.setHidden(false);
                this.mainMenu.setHidden(true);
            }

            if(event.type == "controls"){
                this.controls.setHidden(false);
                this.mainMenu.setHidden(true);
            }

            if(event.type === "help"){
                this.help.setHidden(false);
                this.mainMenu.setHidden(true);
            }

            if(event.type === "menu"){
                this.mainMenu.setHidden(false);
                this.levelSelect.setHidden(true);
                this.controls.setHidden(true);
                this.help.setHidden(true);
            }
        }
    }
}

