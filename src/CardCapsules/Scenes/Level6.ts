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

export default class Level6 extends GameLevel {
    
    loadScene(): void {
        // Load resources
        super.loadScene();
        //this.load.image("background", "hw4_assets/sprites/2bitbackground.png");
        //this.load.image("coin", "hw4_assets/sprites/coin.png");
        this.load.image("background", "card-capsules_assets/sprites/IceBackground2.png");
        this.load.tilemap("level6", "card-capsules_assets/tilemaps/level6.json");
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
        this.addParallaxLayer("bg", new Vec2(0.25, 0.1), -100);
        let bg = this.add.sprite("background", "bg");
        bg.scale.set(16, 16);
        bg.position.set(bg.boundary.halfSize.x, bg.boundary.halfSize.y);

        // Add the level 4 tilemap
        this.add.tilemap("level6", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 45*32);

        this.playerSpawn = new Vec2(2*32, 2*32);

        // Do generic setup for a GameLevel
        super.startScene();

        this.addLevelEnd(new Vec2(55, 29), new Vec2(1, 1));

        this.updateUnlockedLevel(6);

        //this.nextLevel = Level2;

         //play the level start text.
         this.levelEndLabel.text = "Level 6: Cactus Cave";
         this.levelEndLabel.tweens.play("slideIn");
         new Timer(2200, () => {
             this.levelEndLabel.tweens.play("slideOut");
         }).start();
 

        //Add enemies of various types
        for(let pos of [new Vec2(15, 1)]){
            this.addEnemy("Rock_Monster", pos, {});
        }

        for(let pos of [new Vec2(42.5, 13), new Vec2(2.5,19), new Vec2(1.5,19), new Vec2(3.5,19), new Vec2(53.5,14), new Vec2(54.5,14), new Vec2(55.5,14), new Vec2(56.5,14), new Vec2(57.5,14)]){
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

        Debug.log("playerpos", this.player.position.toString());
    }

    protected restartlevel()
    {
        let sceneOptions = CC_GAME_CONST.SCENE_OPTIONS;
        this.sceneManager.changeToScene(Level6, {}, sceneOptions);
    }
}