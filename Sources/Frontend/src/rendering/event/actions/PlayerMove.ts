import { BoardState, Tile } from "@/rendering/util/BoardState";
import { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import type { IAction } from "./IAction";
import { Direction, getOpositDirection } from "@/rendering/util/Direction";
import { PassageComponent } from "@/rendering/components/PassageComponent";

class PlayerMove implements IAction {
    constructor(public player: string, public direction: Direction) { }

    getFrom(state: BoardState) {
        return state.players.get(this.player)?.getComponent(GridPositionComponent);
    }

    getNewPosition(state: BoardState, current: GridPositionComponent) {
        const newPos: [number, number] = [current.row, current.col];
        switch (this.direction) {
            case Direction.left:
                newPos[1]--;
                if (newPos[1] < 0)
                    newPos[1] = state.width - 1;
                break;
            case Direction.right:
                newPos[1]++;
                if (state.width <= newPos[1])
                    newPos[1] = 0;
                break;
            case Direction.forward:
                newPos[0]++;
                if (state.height <= newPos[0])
                    newPos[0] = 0;
                break;
            case Direction.back:
                newPos[0]--;
                if (newPos[0] < 0)
                    newPos[0] = state.height - 1;
                break;
        }
        return newPos;
    }

    validate(state: BoardState): boolean {
        debugger
        const from = this.getFrom(state);
        if (!from)
            return false;

        const srcTile = state.map[from.row][from.col];
        if (!srcTile)
            return false;

        if (!srcTile.getComponent(PassageComponent).connections.includes(this.direction))
            return false;

        const pos = this.getNewPosition(state, from);
        const destTile = state.map[pos[0]][pos[1]];
        if (!destTile)
            return false;

        if (!destTile.getComponent(PassageComponent).connections.includes(
            getOpositDirection(this.direction)))
            return false;

        return true;
    }

    do(state: BoardState): boolean {
        const from = this.getFrom(state);
        if (!from)
            return false;

        const to = this.getNewPosition(state, from);

        from.col = to[1];
        from.row = to[0];

        return true;
    }

}

class ThisPlayerMove extends PlayerMove {
    constructor(player: string, public from: GridPositionComponent, to: Direction) {
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