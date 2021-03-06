export enum CC_EVENTS {
    TIME_SLOW = "time_slow",
    TIME_RESUME = "time_resume",
    SHOW_PLACEMENT_GRID = "show_placement_grid",
    HIDE_PLACEMENT_GRID = "hide_placement_grid",
    PLACE_BLOCK = "place_block",
    PLAYER_ENTERED_LEVEL_END = "PlayerEnteredLevelEnd",
    LEVEL_START = "level_start",
    LEVEL_END = "level_end",
    PLAYER_HIT_FLOATING_BLOCK_CARD = "PlayerHitFloatingBlockCard",
    PLAYER_HIT_SPRING_BLOCK_CARD = "PlayerHitSpringBlockCard",
    PLAYER_HIT_CIRCULAR_ROCK_CARD = "PlayerHitCircularRockCard",
    PLAYER_HIT_DRILL_BLOCK_CARD = "PlayerHitDrillBlockCard",
    SPRING_TRIGGERED = "spring_triggered",
    CARD_CLICKED = "card_clicked",
    SPRING_TRIGGERED_TOP = "spring_triggered_top",
    SPRING_TRIGGERED_DOWN = "spring_triggered_down",
    SPRING_TRIGGERED_LEFT = "spring_triggered_left",
    SPRING_TRIGGERED_RIGHT = "spring_triggered_right",
    PLAYER_JUMP = "PlayerJump",
    PLAYER_MOVE = "PlayerMove",
    PLAYER_DIED = "PlayerDied",
    ENEMY_DIED = "EnemyDied",
    PLAYER_HIT_ENEMY = "PlayerHitEnemy",
    PLAYER_RESPAWN = "PlayerRespawn",
    PAUSE_GAME = "Pause_game",
    UNPAUSE_GAME = "Unpause_game",
    DRILL_BLOCK = "drill_block",
    DESTROY_BLOCK = "destroy_block",
    ACTIVATE_BINOCULARS = "activate_binoculars",
    DEACTIVATE_BINOCULARS = "deactivate_binoculars",
    TOGGLE_BINOCULARS = "toggle_binoculars",
    PLACE_LAVA = "place_lava",
    PLAYER_HIT_LAVA = "player_hit_lava",
    ENEMY_HIT_LAVA = "enemy_hit_lava",
    
}

export class CC_GAME_CONST {
    public static SCENE_OPTIONS = {
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
}