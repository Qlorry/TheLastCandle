import type { GridEntity } from "@/rendering/entities/GridEntity";
import type { PassageEntity } from "@/rendering/entities/PassageEntity";
import type { PlayerEntity } from "@/rendering/entities/PlayerEntity";

enum Tile {
    None,
    Passage,
}

class BoardState {
    public map: Array<Array<PassageEntity | undefined>>;
    public players = new Map<string, PlayerEntity>();
    public readonly width = 6;  
    public readonly height = 6;  
    constructor(
        public grid: GridEntity
    ) {
        //TODO change to constants
        this.map = []
        for (let i = 0; i < 6; i++) {
            this.map.push([]);
            for(let j = 0; j < 6; j++)
            {
                this.map[i].push(undefined);
            }
        }
    }
}

export {BoardState, Tile};