import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Layer from "../../Wolfie2D/Scene/Layer";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import LevelSelect from "./LevelSelect";
import Level1 from "./Level1";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import { CC_EVENTS } from "../CardCapsulesEnums";

export default class MainMenu extends Scene {

    animatedSprite: AnimatedSprite;
    private mainMenu: Layer;
    private controls: Layer;
    private help: Layer;
    private cheats: Layer;
    private splash: Layer;
    private static start: boolean = false;
    static onMainMenu: boolean = false;

    private versionNumber: string = "V 1.0";

    loadScene(): void {
        // Load the menu song
        this.load.audio("button_click_sfx", "card-capsules_assets/Sounds/button_press.mp3");
        this.load.image("splash_background", "card-capsules_assets/sprites/CardCapsuleSplashScreen.png");
        this.load.audio("menu", "card-capsules_assets/Music/TitleScreen.mp3");
    }

    startScene(): void {
        //Add a background layer and set the background image on it
        this.addParallaxLayer("bg", new Vec2(0, 0), -100);
        let bg = this.add.sprite("splash_background", "bg");
        bg.position.set(bg.boundary.halfSize.x, bg.boundary.halfSize.y);
        
        this.mainMenu = this.addUILayer("Main");
        this.mainMenu.setHidden(!MainMenu.start);
        

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        let buttonColor = new Color(157,85,17,1);
        const mainBackground = <Label>this.add.uiElement(UIElementType.LABEL, "Main", {position: new Vec2(size.x, size.y), text: ""});
        mainBackground.setBackgroundColor(new Color(247,222,146,0.8));
        mainBackground.borderColor = buttonColor;
        mainBackground.size.set(350,400);
        mainBackground.borderWidth = 5;

        // Create a play button
        const playBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y - 150), text: "Play Game"});
        playBtn.size.set(250, 50);
        playBtn.setBackgroundColor(buttonColor);
        playBtn.borderColor = Color.BLACK;
        playBtn.setPadding(new Vec2(50, 10));
        //playBtn.font = "PixelSimple";
        playBtn.onClickEventId = "play";

        //Create a level select button
        const levelBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y - 50), text: "Level Select"});
        levelBtn.size.set(250, 50);
        levelBtn.setBackgroundColor(buttonColor);
        levelBtn.borderColor = Color.BLACK;
        levelBtn.setPadding(new Vec2(50, 10));
        //levelBtn.font = "PixelSimple";
        levelBtn.onClickEventId = "level";

        //Create a controls button
        const controlsBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 50), text: "Controls"});
        controlsBtn.size.set(250, 50);
        controlsBtn.setBackgroundColor(buttonColor);
        controlsBtn.borderColor = Color.BLACK;
        controlsBtn.setPadding(new Vec2(50, 10));
        //controlsBtn.font = "PixelSimple";
        controlsBtn.onClickEventId = "controls";

        //Create a help button
        const helpBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y + 150), text: "Help"});
        helpBtn.size.set(250, 50);
        helpBtn.setBackgroundColor(buttonColor);
        helpBtn.borderColor = Color.BLACK;
        helpBtn.setPadding(new Vec2(50, 10));
        //helpBtn.font = "PixelSimple";
        helpBtn.onClickEventId = "help";

        const versionNumberLabel = <Label>this.add.uiElement(UIElementType.LABEL, "Main", {position: new Vec2(size.x + 500, size.y + 350), text: this.versionNumber});
        versionNumberLabel.setTextColor(Color.WHITE);
        versionNumberLabel.fontSize = 36;
        versionNumberLabel.backgroundColor = new Color(0, 0, 0, 1);

        //Create a controls screen
        this.controls = this.addUILayer("Controls");
        this.controls.setHidden(true);

        const controlsBackground = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y), text: ""});
        controlsBackground.setBackgroundColor(new Color(247,222,146,0.8));
        controlsBackground.borderColor = buttonColor;
        controlsBackground.size.set(700,700);
        controlsBackground.borderWidth = 5;

        const controlsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 300), text: "Controls"});
        controlsHeader.setTextColor(Color.BLACK);
        controlsHeader.fontSize = 60;

        const controlsText1 = "Press A to move left. Press D to move right.";
        const controlsText2 = "Press W or Space to jump.";
        const controlsText3 = "Press R to restart a level.";
        const controlsText4 = "Press M to return to the main menu.";
        const controlsText5 = "Click on a card to start placing it. Then";
        const controlsText6 = "click to place. Press E to cancel.";
        const controlsText7 = "Pressing Z, X, or C will also start placing the card.";
        const controlsText8 = "Press V to undo the last block placed.";
        const controlsText9 = "Click on the binoculars to move"
        const controlsText10 = "the camera with the mouse.";

        const controlsLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 225), text: controlsText1});
        const controlsLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 175), text: controlsText2});
        const controlsLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 125), text: controlsText3});
        const controlsLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 75), text: controlsText4});
        const controlsLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y - 25), text: controlsText5});
        const controlsLine6 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y + 25), text: controlsText6});
        const controlsLine7 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y + 75), text: controlsText7});
        const controlsLine8 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y + 125), text: controlsText8});
        const controlsLine9 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y + 175), text: controlsText9});
        const controlsLine10 = <Label>this.add.uiElement(UIElementType.LABEL, "Controls", {position: new Vec2(size.x, size.y + 225), text: controlsText10});

        controlsLine1.setTextColor(Color.BLACK);
        controlsLine2.setTextColor(Color.BLACK);
        controlsLine3.setTextColor(Color.BLACK);
        controlsLine4.setTextColor(Color.BLACK);
        controlsLine5.setTextColor(Color.BLACK);
        controlsLine6.setTextColor(Color.BLACK);
        controlsLine7.setTextColor(Color.BLACK);
        controlsLine8.setTextColor(Color.BLACK);
        controlsLine9.setTextColor(Color.BLACK);
        controlsLine10.setTextColor(Color.BLACK);

        const controlsBack = <Button>this.add.uiElement(UIElementType.BUTTON, "Controls", {position: new Vec2(size.x, size.y + 300), text: "Back"});
        controlsBack.size.set(200, 50);
        controlsBack.borderWidth = 2;
        controlsBack.borderColor = Color.BLACK;
        controlsBack.setBackgroundColor(buttonColor);
        controlsBack.onClickEventId = "menu";

        //Create a help screen
        this.help = this.addUILayer("Help");
        this.help.setHidden(true);

        const helpBackground = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 37), text: ""});
        helpBackground.setBackgroundColor(new Color(247,222,146,0.8));
        helpBackground.borderColor = buttonColor;
        helpBackground.size.set(950,675);
        helpBackground.borderWidth = 5;

        const helpHeader = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 325), text: "Help"});
        helpHeader.setTextColor(Color.BLACK);
        helpHeader.fontSize = 60;

        const helpText1 = "Game developed by Sheng Wei Zhu, John Buckley, and Garrett Chen";
        const helpText2 = "After a terraforming operation went awry due to a space pirate";
        const helpText3 = "assault, our protaganist must crash land on the inhospitable";
        const helpText4 = "world that they were trying to rebuild. The player's newfound";
        const helpText5 = "objective is to reach the wreckage of their ship and to repair";
        const helpText6 = "it with the card capsules that they find from the remnants that";
        const helpText7 = "scattered the planet when the ship crash landed.";

        const helpLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 250), text: helpText1});
        const helpLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 175), text: helpText2});
        const helpLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 125), text: helpText3});
        const helpLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 75), text: helpText4});
        const helpLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y - 25), text: helpText5});
        const helpLine6 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y + 25), text: helpText6});
        const helpLine7 = <Label>this.add.uiElement(UIElementType.LABEL, "Help", {position: new Vec2(size.x, size.y + 75), text: helpText7});

        helpLine1.setTextColor(Color.BLACK);
        helpLine2.setTextColor(Color.BLACK);
        helpLine3.setTextColor(Color.BLACK);
        helpLine4.setTextColor(Color.BLACK);
        helpLine5.setTextColor(Color.BLACK);
        helpLine6.setTextColor(Color.BLACK);
        helpLine7.setTextColor(Color.BLACK);

        const cheatsBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Help", {position: new Vec2(size.x, size.y + 150), text: "Cheat Codes"});
        cheatsBtn.size.set(200, 50);
        cheatsBtn.borderWidth = 2;
        cheatsBtn.borderColor = Color.BLACK;
        cheatsBtn.setBackgroundColor(buttonColor);
        cheatsBtn.onClickEventId = "cheats";

        const helpBack = <Button>this.add.uiElement(UIElementType.BUTTON, "Help", {position: new Vec2(size.x, size.y + 250), text: "Back"});
        helpBack.size.set(200, 50);
        helpBack.borderWidth = 2;
        helpBack.borderColor = Color.BLACK;
        helpBack.setBackgroundColor(buttonColor);
        helpBack.onClickEventId = "menu";

        //Create a help screen
        this.cheats = this.addUILayer("Cheats");
        this.cheats.setHidden(true);

        const cheatsBackground = <Label>this.add.uiElement(UIElementType.LABEL, "Cheats", {position: new Vec2(size.x, size.y), text: ""});
        cheatsBackground.setBackgroundColor(new Color(247,222,146,0.8));
        cheatsBackground.borderColor = buttonColor;
        cheatsBackground.size.set(550,500);
        cheatsBackground.borderWidth = 5;

        const cheatsHeader = <Label>this.add.uiElement(UIElementType.LABEL, "Cheats", {position: new Vec2(size.x, size.y - 200), text: "Cheat Codes"});
        cheatsHeader.setTextColor(Color.BLACK);
        cheatsHeader.fontSize = 60;

        const cheatsText1 = "Press K to add 10 floating blocks,";
        const cheatsText2 = "10 spring blocks, and 10 drill blocks.";
        const cheatsText3 = "Press I to make the player invincible.";
        const cheatsText4 = "In any level, press 1, 2, 3, 4, 5, or 6";
        const cheatsText5 = "to switch to that level.";

        const cheatsLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "Cheats", {position: new Vec2(size.x, size.y - 100), text: cheatsText1});
        const cheatsLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "Cheats", {position: new Vec2(size.x, size.y - 50), text: cheatsText2});
        const cheatsLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "Cheats", {position: new Vec2(size.x, size.y), text: cheatsText3});
        const cheatsLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "Cheats", {position: new Vec2(size.x, size.y + 50), text: cheatsText4});
        const cheatsLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "Cheats", {position: new Vec2(size.x, size.y + 100), text: cheatsText5});

        cheatsLine1.setTextColor(Color.BLACK);
        cheatsLine2.setTextColor(Color.BLACK);
        cheatsLine3.setTextColor(Color.BLACK);
        cheatsLine4.setTextColor(Color.BLACK);
        cheatsLine5.setTextColor(Color.BLACK);

        const cheatsBack = <Button>this.add.uiElement(UIElementType.BUTTON, "Cheats", {position: new Vec2(size.x, size.y + 200), text: "Help"});
        cheatsBack.size.set(200, 50);
        cheatsBack.borderWidth = 2;
        cheatsBack.borderColor = Color.BLACK;
        cheatsBack.setBackgroundColor(buttonColor);
        cheatsBack.onClickEventId = "help";

        //Set up splash screen
        this.splash = this.addUILayer("Splash");
        this.splash.setHidden(MainMenu.start);

        
        //TODO: whole screen clickable to get to the main menu.
        const splashEnter = <Button>this.add.uiElement(UIElementType.BUTTON, "Splash", {position: new Vec2(size.x, size.y), text: ""});
        splashEnter.size.set(1200, 800);
        splashEnter.borderWidth = 2;
        splashEnter.borderColor = Color.TRANSPARENT;
        splashEnter.setBackgroundColor(Color.TRANSPARENT);
        splashEnter.onClickEventId = "menu";

        //TODO: change the label of the splash screen.
        const splashLabel = <Label>this.add.uiElement(UIElementType.LABEL, "Splash", {position: new Vec2(size.x, size.y + 250), text: "Press Anywhere to Start"});
        splashLabel.size.set(600, 60);
        //splashLabel.borderColor = Color.BLACK;
        //splashLabel.borderWidth = 3;
        splashLabel.setBackgroundColor(new Color(0, 0, 0, 0.8));
        splashLabel.textColor = Color.WHITE;
        splashLabel.fontSize = 50;
        splashLabel.tweens.add("move", {
            startDelay: 0,
            duration: 1500,
            reverseOnComplete: true,
            effects: [
                {
                    property: TweenableProperties.posY,
                    start: size.y + 250,
                    end: size.y + 260,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
        });
        splashLabel.tweens.play("move", true);


        //Subscribe to button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("level");
        this.receiver.subscribe("controls");
        this.receiver.subscribe("help");
        this.receiver.subscribe("cheats");
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

            if(event.type === "level" ){
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button_click_sfx", loop:false});
                this.sceneManager.changeToScene(LevelSelect);
            }

            if(event.type == "controls"){
                this.controls.setHidden(false);
                this.mainMenu.setHidden(true);
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button_click_sfx", loop:false});
            }

            if(event.type === "help"){
                this.help.setHidden(false);
                this.mainMenu.setHidden(true);
                this.cheats.setHidden(true);
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button_click_sfx", loop:false});
            }

            if(event.type === "cheats"){
                this.cheats.setHidden(false);
                this.help.setHidden(true);
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button_click_sfx", loop:false});
            }

            if(event.type === "menu"){
                this.mainMenu.setHidden(false);
                this.controls.setHidden(true);
                this.help.setHidden(true);
                this.splash.setHidden(true);
                MainMenu.start = true;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button_click_sfx", loop:false});
            }
        }
    }
}

