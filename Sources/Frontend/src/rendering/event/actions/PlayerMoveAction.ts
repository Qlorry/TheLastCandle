import type { IAction } from "./IAction";

import { BoardState } from "@/rendering/util/BoardState";

import { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import { getOpositDirection } from "@/rendering/util/Direction";
import { PassageComponent } from "@/rendering/components/PassageComponent";
import { PlayerComponent } from "@/rendering/components/PlayerComponent";
import { PlayerMoveData } from "@/rendering/components/models/ActionData/PlayerMove";
import { Direction } from "@/rendering/components/models/Direction";
import type { IActionData } from "@/rendering/components/models/ActionData/IActionData";

export class PlayerMove implements IAction {
    private data?: PlayerMoveData;
    constructor(public playerId: string, public direction: Direction) { }
    
    static From(data: PlayerMoveData)
    {
        //TODO: Set actual direction?
        const action = new PlayerMove(
            data.playerId,
            Direction.forward
        );
        action.data = data;
        return action;
    }

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

        const srcTile = state.map[from.row][from.col];
        if (!srcTile.passage)
            return false;

        if (!srcTile.passage.getComponent(PassageComponent).connections.includes(this.direction))
            return false;

        const pos = this.getNewPosition(state, from);
        const destTile = state.map[pos[0]][pos[1]];
        if (!destTile.passage)
            return false;

        if (!destTile.passage.getComponent(PassageComponent).connections.includes(
            getOpositDirection(this.direction)))
            return false;

        this.data = new PlayerMoveData(
            new GridPositionComponent(from.row, from.col),
            new GridPositionComponent(pos[0], pos[1]),
            this.playerId
        )

        return true;
    }

    do(state: BoardState, firstTime: boolean, lastTime: boolean): boolean {
        const from = this.getPositionObject(state);
        if (!from || !this.data)
            return false;

        from.col = this.data.to.col;
        from.row = this.data.to.row;

        return true;
    }

    undo(state: BoardState, firstTime: boolean, lastTime: boolean): boolean {
        const from = this.getPositionObject(state);
        if (!from || !this.data)
            return false;

        from.col = this.data.from.col;
        from.row = this.data.from.row;

        return true;
    }

}
