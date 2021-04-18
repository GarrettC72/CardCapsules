import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Layer from "../../Wolfie2D/Scene/Layer";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import LevelSelect from "./LevelSelect";
import Level1 from "./Level1";


//import Level2 from "./Level2";

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
        playBtn.setBackgroundColor(Color.TRANSPARENT);
        playBtn.borderColor = Color.WHITE;
        playBtn.setPadding(new Vec2(50, 10));
        //playBtn.font = "PixelSimple";
        playBtn.onClickEventId = "play";
        playBtn.onEnter = () => {
            playBtn.borderColor = Color.BLACK;
            playBtn.setBackgroundColor(Color.WHITE);
            playBtn.setTextColor(Color.BLACK);
        }
        playBtn.onLeave = () => {
            playBtn.borderColor = Color.WHITE;
            playBtn.setBackgroundColor(Color.TRANSPARENT);
            playBtn.setTextColor(Color.WHITE);
        }

        //Create a level select button
        const levelBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y - 50), text: "Level Select"});
        levelBtn.size.set(250, 50);
        levelBtn.setBackgroundColor(Color.TRANSPARENT);
        levelBtn.borderColor = Color.WHITE;
        levelBtn.setPadding(new Vec2(50, 10));
        //levelBtn.font = "PixelSimple";
        levelBtn.onClickEventId = "level";
        levelBtn.onEnter = () => {
            levelBtn.borderColor = Color.BLACK;
            levelBtn.setBackgroundColor(Color.WHITE);
            levelBtn.setTextColor(Color.BLACK);
        }
        levelBtn.onLeave = () => {
            levelBtn.borderColor = Color.WHITE;
            levelBtn.setBackgroundColor(Color.TRANSPARENT);
            levelBtn.setTextColor(Color.WHITE);
        }

        //Create a controls button
        const controlsBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 50), text: "Controls"});
        controlsBtn.size.set(250, 50);
        controlsBtn.setBackgroundColor(Color.TRANSPARENT);
        controlsBtn.borderColor = Color.WHITE;
        controlsBtn.setPadding(new Vec2(50, 10));
        //controlsBtn.font = "PixelSimple";
        controlsBtn.onClickEventId = "controls";
        controlsBtn.onEnter = () => {
            controlsBtn.borderColor = Color.BLACK;
            controlsBtn.setBackgroundColor(Color.WHITE);
            controlsBtn.setTextColor(Color.BLACK);
        }
        controlsBtn.onLeave = () => {
            controlsBtn.borderColor = Color.WHITE;
            controlsBtn.setBackgroundColor(Color.TRANSPARENT);
            controlsBtn.setTextColor(Color.WHITE);
        }

        //Create a help button
        const helpBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 150), text: "Help"});
        helpBtn.size.set(250, 50);
        helpBtn.setBackgroundColor(Color.TRANSPARENT);
        helpBtn.borderColor = Color.WHITE;
        helpBtn.setPadding(new Vec2(50, 10));
        //helpBtn.font = "PixelSimple";
        helpBtn.onClickEventId = "help";
        helpBtn.onEnter = () => {
            helpBtn.borderColor = Color.BLACK;
            helpBtn.setBackgroundColor(Color.WHITE);
            helpBtn.setTextColor(Color.BLACK);
        }
        helpBtn.onLeave = () => {
            helpBtn.borderColor = Color.WHITE;
            helpBtn.setBackgroundColor(Color.TRANSPARENT);
            helpBtn.setTextColor(Color.WHITE);
        }

        //Create a controls screen
        this.controls = this.addUILayer("Controls");
        this.controls.setHidden(true);

        const controlsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 250), text: "Controls"});
        controlsHeader.setTextColor(Color.WHITE);
        controlsHeader.fontSize = 60;

        const controlsText1 = "Press A to move left.";
        const controlsText2 = "Press D to move right.";
        const controlsText3 = "Press W or Space to jump.";
        const controlsText4 = "Press R to restart a level.";
        const controlsText5 = "Press M to return to the main menu.";
        const controlsText6 = "Click on a card to start placing it. Then";
        const controlsText7 = "click to place. Press E to cancel.";

        const controlsLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 150), text: controlsText1});
        const controlsLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 100), text: controlsText2});
        const controlsLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 50), text: controlsText3});
        const controlsLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y), text: controlsText4});
        const controlsLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y + 50), text: controlsText5});
        const controlsLine6 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y + 100), text: controlsText6});
        const controlsLine7 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y + 150), text: controlsText7});

        controlsLine1.setTextColor(Color.WHITE);
        controlsLine2.setTextColor(Color.WHITE);
        controlsLine3.setTextColor(Color.WHITE);
        controlsLine4.setTextColor(Color.WHITE);
        controlsLine5.setTextColor(Color.WHITE);
        controlsLine6.setTextColor(Color.WHITE);
        controlsLine7.setTextColor(Color.WHITE);

        const controlsBack = <Button>this.add.uiElement(UIElementType.BUTTON, "Controls", {position: new Vec2(size.x, size.y + 250), text: "Back"});
        controlsBack.size.set(200, 50);
        controlsBack.borderWidth = 2;
        controlsBack.borderColor = Color.WHITE;
        controlsBack.setBackgroundColor(Color.TRANSPARENT);
        controlsBack.onClickEventId = "menu";
        controlsBack.onEnter = () => {
            controlsBack.borderColor = Color.BLACK;
            controlsBack.setBackgroundColor(Color.WHITE);
            controlsBack.setTextColor(Color.BLACK);
        }
        controlsBack.onLeave = () => {
            controlsBack.borderColor = Color.WHITE;
            controlsBack.setBackgroundColor(Color.TRANSPARENT);
            controlsBack.setTextColor(Color.WHITE);
        }

        //Create a help screen
        this.help = this.addUILayer("Help");
        this.help.setHidden(true);

        const helpHeader = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 325), text: "Help"});
        helpHeader.setTextColor(Color.WHITE);
        helpHeader.fontSize = 60;

        const helpText1 = "Game developed by Sheng Wei Zhu, John Buckley, and Garrett Chen";
        const helpText2 = "After a terraforming operation went awry due to a space pirate";
        const helpText3 = "assault, our protaganist must crash land on the inhospitable";
        const helpText4 = "world that they were trying to rebuild. The player's newfound";
        const helpText5 = "objective is to reach the wreckage of their ship and to repair";
        const helpText6 = "it with the card capsules that they find from the remnants that";
        const helpText7 = "scattered the planet when the ship crash landed.";
        const helpText8 = "Cheat Code: Press K to add 10 floating blocks and 10 spring blocks"

        const helpLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 250), text: helpText1});
        const helpLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 175), text: helpText2});
        const helpLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 125), text: helpText3});
        const helpLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 75), text: helpText4});
        const helpLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 25), text: helpText5});
        const helpLine6 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y + 25), text: helpText6});
        const helpLine7 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y + 75), text: helpText7});
        const helpLine8 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y + 150), text: helpText8});

        helpLine1.setTextColor(Color.WHITE);
        helpLine2.setTextColor(Color.WHITE);
        helpLine3.setTextColor(Color.WHITE);
        helpLine4.setTextColor(Color.WHITE);
        helpLine5.setTextColor(Color.WHITE);
        helpLine6.setTextColor(Color.WHITE);
        helpLine7.setTextColor(Color.WHITE);
        helpLine8.setTextColor(Color.WHITE);

        const helpBack = <Button>this.add.uiElement(UIElementType.BUTTON, "Help", {position: new Vec2(size.x, size.y + 250), text: "Back"});
        helpBack.size.set(200, 50);
        helpBack.borderWidth = 2;
        helpBack.borderColor = Color.WHITE;
        helpBack.setBackgroundColor(Color.TRANSPARENT);
        helpBack.onClickEventId = "menu";
        helpBack.onEnter = () => {
            helpBack.borderColor = Color.BLACK;
            helpBack.setBackgroundColor(Color.WHITE);
            helpBack.setTextColor(Color.BLACK);
        }
        helpBack.onLeave = () => {
            helpBack.borderColor = Color.WHITE;
            helpBack.setBackgroundColor(Color.TRANSPARENT);
            helpBack.setTextColor(Color.WHITE);
        }

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
                        circularRocks: 0
                    }
                }
                this.sceneManager.changeToScene(Level1, {}, sceneOptions);
            }

            if(event.type === "level" ){
                this.sceneManager.changeToScene(LevelSelect);
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
                this.controls.setHidden(true);
                this.help.setHidden(true);
            }
        }
    }
}

