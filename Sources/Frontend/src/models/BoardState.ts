enum Tile {
    None,
    Passage,
}

class BoardState {
    public map: Array<Array<Tile>>;
    public readonly width = 6;  
    public readonly height = 6;  
    constructor() {
        //TODO change to constants
        this.map = []
        for (let i = 0; i < 6; i++) {
            this.map.push([Tile.None, Tile.None, Tile.None, Tile.None, Tile.None, Tile.None]);
        }
    }
}

export {BoardState, Tile};