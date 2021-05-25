import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";

//import Level2 from "./Level2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import Timer from "../../Wolfie2D/Timing/Timer";
import { CC_GAME_CONST } from "../CardCapsulesEnums";
import GameLevel from "./GameLevel";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";
import Level4 from "./Level4";
import Level5 from "./Level5";
import Level6 from "./Level6";

export default class Level7 extends GameLevel {
    
    loadScene(): void {
        // Load resources
        super.loadScene();
        //this.load.image("background", "hw4_assets/sprites/2bitbackground.png");
        //this.load.image("coin", "hw4_assets/sprites/coin.png");
        this.load.image("background", "card-capsules_assets/sprites/IceBackground2.png");
        this.load.tilemap("level7", "card-capsules_assets/tilemaps/level7.json"); //CHANGE THIS-------------
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

    unloadScene(){
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.load.keepAudio("button_click_sfx");
    }

    startScene(): void {
        // Add a background layer and set the background image on it
        this.addParallaxLayer("bg", new Vec2(0.25, 0.1), -100); //CHANGE THIS-------------
        let bg = this.add.sprite("background", "bg");
        bg.scale.set(16, 16);
        bg.position.set(bg.boundary.halfSize.x, bg.boundary.halfSize.y);

        // Add the level 7 tilemap
        this.add.tilemap("level7", new Vec2(2, 2));//CHANGE THIS-------------
        this.viewport.setBounds(0, 0, 64*32, 48*32);//CHANGE THIS-------------

        this.playerSpawn = new Vec2(5*32, 9*32);//CHANGE THIS-------------

        // Do generic setup for a GameLevel
        super.startScene();

        this.addLevelEnd(new Vec2(16, 41), new Vec2(1, 1));//CHANGE THIS-------------

        this.updateUnlockedLevel(7);//CHANGE THIS-------------

        //this.nextLevel = Level2;

         //play the level start text.
         this.levelEndLabel.text = "Level 7: Heading Down"; //CHANGE THIS-------------
         this.levelEndLabel.tweens.play("slideIn");
         new Timer(2200, () => {
             this.levelEndLabel.tweens.play("slideOut");
         }).start();
 

        //CHANGE THIS-------------
        //Add enemies of various types
        for(let pos of [new Vec2(30.5, 9.5), new Vec2(59.5, 9.5), new Vec2(42.5, 30.5), new Vec2(6.5, 34.5), new Vec2(15.5, 34.5),
             new Vec2(60.5, 42.5)]){
            this.addEnemy("Rock_Monster", pos, {});
        }

        for(let pos of [new Vec2(18.5, 11.5), new Vec2(22.5, 11.5), new Vec2(45.5, 18.5), new Vec2(42.5, 23.5)
        ,new Vec2(45.5, 34.5), new Vec2(27.5, 39.5), new Vec2(29.5, 39.5), new Vec2(31.5, 39.5), new Vec2(33.5, 39.5),
        new Vec2(9.5, 24.5), new Vec2(18.5, 28.5), new Vec2(8.5, 41.5)]){
            this.addEnemy("Cactus", pos, {spiky: true});
        }

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);

        if(Input.isJustPressed("restart"))
        {
            this.restartlevel();
        }

        if(Input.isJustPressed("changeLevel1"))
            this.sceneManager.changeToScene(Level1, {}, CC_GAME_CONST.SCENE_OPTIONS);
        if(Input.isJustPressed("changeLevel2"))
            this.sceneManager.changeToScene(Level2, {}, CC_GAME_CONST.SCENE_OPTIONS);
        if(Input.isJustPressed("changeLevel3"))
            this.sceneManager.changeToScene(Level3, {}, CC_GAME_CONST.SCENE_OPTIONS);
        if(Input.isJustPressed("changeLevel4"))
            this.sceneManager.changeToScene(Level4, {}, CC_GAME_CONST.SCENE_OPTIONS);
        if(Input.isJustPressed("changeLevel5"))
            this.sceneManager.changeToScene(Level5, {}, CC_GAME_CONST.SCENE_OPTIONS);
        if(Input.isJustPressed("changeLevel6"))
            this.sceneManager.changeToScene(Level6, {}, CC_GAME_CONST.SCENE_OPTIONS);
        if(Input.isJustPressed("changeLevel7"))
            this.sceneManager.changeToScene(Level7, {}, CC_GAME_CONST.SCENE_OPTIONS);


        Debug.log("playerpos", this.player.position.toString());
    }

    protected restartlevel()
    {
        let sceneOptions = CC_GAME_CONST.SCENE_OPTIONS;
        this.sceneManager.changeToScene(Level7, {}, sceneOptions);//CHANGE THIS-------------
    }
}