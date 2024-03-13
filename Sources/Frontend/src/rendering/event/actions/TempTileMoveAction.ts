import type { IAction } from "./IAction";

import { BoardState } from "@/rendering/util/BoardState";

import { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import { Direction } from "@/rendering/components/models/Direction";
import type { IActionData } from "@/rendering/components/models/ActionData/IActionData";
import { TempTileMoveData } from "@/rendering/components/models/ActionData/TempTileMoveData";
import { Object3D } from "three";

export class TempTileMoveAction implements IAction {
    private data?: TempTileMoveData;
    constructor(public playerId: string, public direction: Direction) { }

    setSessionId(id: string): void {
        if (this.data)
            this.data.sessionId = id;
    }

    getData(): IActionData {
        if (!this.data) throw new Error("Data was not set!");
        return this.data;
    }

    getPositionObject(state: BoardState) {
        return state.players.get(this.playerId)?.getComponent(GridPositionComponent);
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
        const from = this.getPositionObject(state);
        if (!from)
            return false;

        const pos = this.getNewPosition(state, from);
        const destTile = state.map[pos[0]][pos[1]];
        if (destTile.passage)
            return false;

        this.data = new TempTileMoveData(
            new GridPositionComponent(pos[0], pos[1]),
            this.playerId
        );

        return true;
    }

    do(state: BoardState, firstTime: boolean, lastTime: boolean): boolean {
        if (!state.tempTile || !this.data)
            return false;

        const from = state.tempTile.getComponent(GridPositionComponent);

        from.col = this.data.to.col;
        from.row = this.data.to.row;
        state.tempTile.getComponent(Object3D).userData.shouldDisplay = true;

        return true;
    }

    // will not be called
    undo(state: BoardState, firstTime: boolean, lastTime: boolean): boolean {
        throw new Error("Undo should not be called on this action!");
    }

}
