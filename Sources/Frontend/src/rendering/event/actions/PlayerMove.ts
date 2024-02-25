import { BoardState, Tile } from "@/models/BoardState";
import { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import type { IAction } from "./IAction";

class PlayerMove implements IAction {
    constructor(public player: string, public to: [number, number]) { }

    getFrom(state: BoardState) {
        return state.players.get(this.player)?.getComponent(GridPositionComponent);
    }

    validate(state: BoardState): boolean {
        const from = this.getFrom(state);
        if (!from)
            return false;
        if (from.row == this.to[0] && from.col == this.to[1])
            return false;
        if (state.height <= this.to[0] || this.to[0] < 0)
            return false;
        if (state.width <= this.to[1] || this.to[1] < 0)
            return false;

        if (state.map[this.to[0]][this.to[1]] != Tile.None)
            return false;

        return true;
    }

    do(state: BoardState): boolean {
        const from = this.getFrom(state);
        if (!from)
            return false;

        from.col = this.to[1];
        from.row = this.to[0];

        return true;
    }

}

class ThisPlayerMove extends PlayerMove {
    constructor(player: string, public from: GridPositionComponent, to: [number, number]) {
        super(player, to);
    }

    override getFrom(state: BoardState) {
        return this.from;
    }
}

export {
    PlayerMove,
    ThisPlayerMove
}