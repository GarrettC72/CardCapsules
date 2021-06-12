import Vec2 from "../../Wolfie2D/DataTypes/Vec2";

/**
 * Used to store the position of objects. Mainly used to check for collisions.
 */
export default class ObjectStorage 
{
    private static singleton: ObjectStorage;
    /**
     * Keeps track of the size of the storage.
     */
    private bounds: Vec2;
    private storage: Record<string, any>[][];

    private constructor()
    {
        this.bounds = new Vec2(70, 70);
        //initializing 2D array.
        this.storage = new Array(this.bounds.x);
        for(let i = 0; i < this.bounds.y; i++)
            this.storage[i] = new Array(this.bounds.y);
        this.clearAll();
    }

    public static getObjectStorage(): ObjectStorage
    {
        if(!this.singleton)
            this.singleton = new ObjectStorage();
        return this.singleton;
    }

    public setBounds(bounds: Vec2): void
    {
        this.bounds.x = bounds.x;
        this.bounds.y = bounds.y;
    }

    public setItem(location: Vec2, data: Record<string, any>): void
    {
        if(location.x > this.bounds.x - 1 || location.x < 0 || location.y > this.bounds.y - 1 || location.y < 0)
            return;
        this.storage[location.x][location.y] = data;
    }

    public clearItem(location: Vec2): void
    {
        if(location.x > this.bounds.x - 1 || location.x < 0 || location.y > this.bounds.y - 1 || location.y < 0)
            return;
        this.storage[location.x][location.y] = null;
    }

    public getItem(location: Vec2): Record<string,any>
    {
        if(location.x > this.bounds.x - 1 || location.x < 0 || location.y > this.bounds.y - 1 || location.y < 0)
            return null;
        return this.storage[location.x][location.y];
    }

    public clearAll(): void
    {
        for(let i = 0; i < this.bounds.x; i++)
        {
            for(let j = 0; j < this.bounds.y; j++)
            {
                this.storage[i][j] = null;
                //console.log(this.storage[i][j]);
            }
        }
    }
}