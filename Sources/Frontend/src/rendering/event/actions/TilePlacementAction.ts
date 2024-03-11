import type { IAction } from "./IAction";

import type { BoardState } from "@/rendering/util/BoardState";
import type { TilePlacementData } from "@/rendering/components/models/ActionData/TilePlacementData";
import { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import { PassageEntity } from "@/rendering/entities/PassageEntity";
import { PassageComponent } from "@/rendering/components/PassageComponent";
import { Object3D } from "three";
import { GamePresenter } from "@/rendering/services/GamePresenter";
import { EntityRemoved } from "../EntityRemoved";

export class TilePlacementAction implements IAction {
    private passage?: PassageEntity;
    private tempPassage?: PassageEntity;
    constructor(private data: TilePlacementData) { }

    validate(state: BoardState): boolean {
        if (!state.tempTile) return false;
        let newPos = state.tempTile.getComponent(GridPositionComponent);
        let model = state.tempTile.getComponent(PassageComponent);

        const playerPos = this.getPlayerPosition(state);
        if (!playerPos)
            return false;

        const colDist = Math.abs(playerPos.col - newPos.col);
        const rowDist = Math.abs(playerPos.row - newPos.row);
        if (0 == rowDist && colDist == 0)
            return false;

        this.data.to = newPos;
        this.data.type = model.type;
        this.data.rotation = model.rotation;
        return true;
    }

    do(state: BoardState, firstTime: boolean, lastTime: boolean): boolean {
        if (firstTime) {
            this.passage = new PassageEntity(
                new PassageComponent(this.data.type, this.data.rotation));
            this.passage.getComponent(Object3D).userData = { shouldDisplay: true };
        }

        this.tempPassage = state.tempTile;
        state.tempTile = undefined;

        if (lastTime) {
            if (this.tempPassage)
                GamePresenter.get().eventBus.emit(new EntityRemoved(this.tempPassage));
            this.tempPassage = undefined;
        }

        if (this.tempPassage)
            this.tempPassage.getComponent(Object3D).userData.shouldDisplay = false;

        if (this.passage) {
            this.passage.getComponent(Object3D).userData.shouldDisplay = true;

            const pos = this.passage.getComponent(GridPositionComponent);
            pos.col = this.data.to.col;
            pos.row = this.data.to.row;
        }
        else {
            return false;
        }

        return true;
    }

    undo(state: BoardState, firstTime: boolean, lastTime: boolean): boolean {
        if (lastTime) {
            //dispose
            if (state.tempTile) {
                GamePresenter.get().eventBus.emit(new EntityRemoved(state.tempTile));
                state.tempTile = undefined;
            }
        }
        if (this.tempPassage)
            this.tempPassage.getComponent(Object3D).userData.shouldDisplay = true;
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