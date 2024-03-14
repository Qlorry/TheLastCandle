import type { IActionData } from "@/rendering/components/models/ActionData/IActionData";
import type { BoardState } from "@/rendering/util/BoardState";
import type { IAction } from "./IAction";
import type { PlayerUpdateData } from "@/rendering/components/models/ActionData/PlayerUpdateData";
import { PassageEntity } from "@/rendering/entities/PassageEntity";
import { PassageComponent } from "@/rendering/components/PassageComponent";
import type { TilePlacementData } from "@/rendering/components/models/ActionData/TilePlacementData";
import { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import { Object3D } from "three";
import { GamePresenter } from "@/rendering/services/GamePresenter";
import { EntityAdded } from "../EntityAdded";

export class NextTileSelection implements IAction {
    constructor(private data: TilePlacementData) { }

    validate(state: BoardState): boolean {
        throw new Error("Method not implemented.");
    }
    do(state: BoardState, firstTime: boolean, lastTime: boolean): boolean {
        state.tempTile = new PassageEntity(new PassageComponent(this.data.type, this.data.rotation));
        const pos = state.tempTile.getComponent(GridPositionComponent);
        state.tempTile.getComponent(Object3D).userData = { shouldDisplay: false };
        pos.col = this.data.to.col;
        pos.row = this.data.to.row;
        GamePresenter.get().eventBus.emit(new EntityAdded(state.tempTile))
        return true;
    }
    undo(state: BoardState, firstTime: boolean, lastTime: boolean): boolean {
        throw new Error("Method not implemented.");
    }
    getData(): IActionData {
        return this.data;
    }
    setSessionId(id: string): void {
        this.data.sessionId = id;
    }
}