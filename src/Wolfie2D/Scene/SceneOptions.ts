import ArrayUtils from "../Utils/ArrayUtils";

// @ignorePage

/**
 * The options to give a @reference[Scene] for initialization
 */
export default class SceneOptions {
    physics: {
        groups: Array<string>,
        collisions: Array<Array<number>>;
    }

    inventory: {
        floatingBlocks: number,
        springBlocks: number,
        drillBlocks: number;
    }

    static parse(options: Record<string, any>): SceneOptions{
        let sOpt = new SceneOptions();

        if(options.physics === undefined){
            sOpt.physics = {groups: undefined, collisions: undefined};
        } else {
            sOpt.physics = options.physics;
        }

        if(options.inventory === undefined){
            sOpt.inventory = {floatingBlocks: 0, springBlocks: 0, drillBlocks: 0};
        }else{
            sOpt.inventory = options.inventory;
        }

        return sOpt;
    }
}