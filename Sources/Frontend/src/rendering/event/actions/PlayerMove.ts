import { BoardState, Tile } from "@/models/BoardState";
import type { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import type { IAction } from "./IAction";

export class PlayerMove implements IAction {
    constructor(public from: GridPositionComponent, public to: [number, number]) {

    }

    validate(state: BoardState): boolean {
        if (this.from.row == this.to[0] && this.from.col == this.to[1])
            return false;
        if (state.height <= this.to[0] || this.to[0] < 0)
            return false;
        if (state.width <= this.to[1] || this.to[1] < 0)
            return false;
        if (Math.abs(this.from.row - this.to[0]) > 1)
            return false;
        if (Math.abs(this.from.col - this.to[1]) > 1)
            return false;

        if (state.map[this.to[0]][this.to[1]] != Tile.None)
            return false;

        return true;
    }

    do(state: BoardState): boolean {
        this.from.col = this.to[1];
        this.from.row = this.to[0];

        return true;
    }

}