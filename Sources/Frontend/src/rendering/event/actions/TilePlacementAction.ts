import type { IAction } from "./IAction";

import type { BoardState } from "@/rendering/util/BoardState";
import type { TilePlacementData } from "@/rendering/components/models/ActionData/TilePlacementData";
import { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import { PassageEntity } from "@/rendering/entities/PassageEntity";
import { PassageComponent } from "@/rendering/components/PassageComponent";
import { GamePresenter } from "@/rendering/services/GamePresenter";
import { EntityAdded } from "../EntityAdded";
import { Object3D } from "three";

export class TilePlacementAction implements IAction {
    private passage?: PassageEntity
    constructor(public data: TilePlacementData) { }

    validate(state: BoardState): boolean {
        const playerPos = this.getPlayerPosition(state);
        if (!playerPos)
            return false;

        const colDist = Math.abs(playerPos.col - this.data.to.col);
        const rowDist = Math.abs(playerPos.row - this.data.to.row);
        if (0 == rowDist && colDist == 0)
            return false;

        return true;
    }

    do(state: BoardState, firstTime: boolean, lastTime: boolean): boolean {
        if (firstTime) {
            this.passage = new PassageEntity(
                new PassageComponent(this.data.type, this.data.rotation));
            const pos = this.passage.getComponent(GridPositionComponent);
            pos.col = this.data.to.col;
            pos.row = this.data.to.row;
            this.passage.getComponent(Object3D).userData = {shouldDisplay: true};
        }
        if (this.passage) {
            const pos = this.passage.getComponent(GridPositionComponent);
            this.passage.getComponent(Object3D).userData.shouldDisplay = true;

            pos.col = this.data.to.col;
            pos.row = this.data.to.row;
        }
        else {
            return false;
        }

        return true;
    }

    undo(state: BoardState, firstTime: boolean, lastTime: boolean): boolean {
        if(lastTime)
        {
            //dispose
            //emit removed
        }
        if (this.passage) {
            this.passage.getComponent(Object3D).userData.shouldDisplay = false;
        }
        return true;
    }

    getData(): TilePlacementData {
        return this.data;
    }

    setSessionId(id: string): void {
        this.data.sessionId = id;
    }

    private getPlayerPosition(state: BoardState) {
        return state.players.get(this.data.playerId)?.getComponent(GridPositionComponent);
    }
}