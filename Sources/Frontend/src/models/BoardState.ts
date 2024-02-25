import { PlayerComponent } from "@/rendering/components/PlayerComponent";
import type { GridEntity } from "@/rendering/entities/GridEntity";
import type { PlayerEntity } from "@/rendering/entities/PlayerEntity";

enum Tile {
    None,
    Passage,
}

class BoardState {
    public map: Array<Array<Tile>>;
    public players = new Map<string, PlayerEntity>();
    public readonly width = 6;  
    public readonly height = 6;  
    constructor(
        public grid: GridEntity
    ) {
        //TODO change to constants
        this.map = []
        for (let i = 0; i < 6; i++) {
            this.map.push([Tile.None, Tile.None, Tile.None, Tile.None, Tile.None, Tile.None]);
        }
    }
}

export {BoardState, Tile};