import Game from "./Wolfie2D/Loop/Game";
import default_scene from "./default_scene";
import MainMenu from "./CardCapsules/Scenes/MainMenu";

// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 34, g: 32, b: 52},   // The color the game clears to
        inputs: [
            {name: "left", keys: ["a"]},
            {name: "right", keys: ["d"]},
            {name: "jump", keys: ["w", "space"]},
            {name: "restart", keys:["r"]},
            {name: "mainmenu", keys:["m"]},
            {name: "cancelPlacement", keys:["e"]},
            {name: "giveBlock", keys:["k"]},
            {name: "selectFirstCard", keys:["z"]},
            {name: "selectSecondCard", keys:["x"]},
            {name: "selectThirdCard", keys:["c"]},
            {name: "undo", keys:["v"]},
            {name: "changeLevel1", keys:["1"]},
            {name: "changeLevel2", keys:["2"]},
            {name: "changeLevel3", keys:["3"]},
            {name: "changeLevel4", keys:["4"]},
            {name: "changeLevel5", keys:["5"]},
            {name: "changeLevel6", keys:["6"]},
            {name: "changeLevel7", keys:["7"]},
            {name: "invincible", keys:["i"]},
            //{name: "run", keys: ["shift"]}
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Create a game with the options specified
    const game = new Game(options);

    game.GAME_CANVAS.style.cursor = "url(card-capsules_assets/sprites/mouse_cursor_rocket.png), default";
    
    // Start our game
    game.start(MainMenu, {});
})();

function runTests(){};