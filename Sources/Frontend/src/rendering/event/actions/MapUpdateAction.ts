import type { MapUpdateData } from "@/rendering/components/models/ActionData/MapUpdateData";
import type { IAction } from "./IAction";
import type { BoardState, GridCell } from "@/rendering/util/BoardState";
import type { IActionData } from "@/rendering/components/models/ActionData/IActionData";
import { GamePresenter } from "@/rendering/services/GamePresenter";
import { EntityRemoved } from "../EntityRemoved";
import { PassageEntity } from "@/rendering/entities/PassageEntity";
import { EntityAdded } from "../EntityAdded";
import { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import { PassageComponent } from "@/rendering/components/PassageComponent";
import type { BoardCellModel } from "@/rendering/components/models/BoardData";

export class MapUpdateAction implements IAction {
    constructor(private data: MapUpdateData) { }

    validate(state: BoardState): boolean {
        throw new Error("Method not implemented.");
    }
    do(state: BoardState, firstTime: boolean, lastTime: boolean): boolean {
        for (let row = 0; row < this.data.map.length; row++) {
            for (let col = 0; col < this.data.map[row].length; col++) {
                const cell = this.data.map[row][col];
                const currentCell = state.map[row][col];
                if (!cell.passage) {
                    this.removePassage(currentCell);
                }
                else {
                    this.updatePassage(cell.passage, currentCell, row, col);
                }
            }
        }
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
    private removePassage(cell: GridCell) {
        if (cell.passage !== undefined)
            GamePresenter.get().eventBus.emit(new EntityRemoved(cell.passage));
        cell.passage = undefined;
    }
    private createNewPassage(passageModel: PassageComponent, row: number, col: number, cell: GridCell) {
        const passage = new PassageEntity(passageModel);
        const gridPos = passage.getComponent(GridPositionComponent);
        gridPos.row = row;
        gridPos.col = col;

        cell.passage = passage;
        GamePresenter.get().eventBus.emit(new EntityAdded(passage));
    }
    private updatePassage(passageModel: PassageComponent, cell: GridCell, row: number, col: number) {
        if (cell.passage === undefined) {
            this.createNewPassage(passageModel, row, col, cell);
        }
        else {
            const currentModel = cell.passage.getComponent(PassageComponent);
            if (currentModel.type != passageModel.type) {
                this.removePassage(cell);
                this.createNewPassage(passageModel, row, col, cell);
            }
            else if (currentModel.rotation != passageModel.rotation) {
                currentModel.rotation = passageModel.rotation;
            }
        }
    }
}