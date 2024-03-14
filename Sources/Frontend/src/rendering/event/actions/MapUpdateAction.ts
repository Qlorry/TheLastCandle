import type { MapUpdateData } from "@/rendering/components/models/ActionData/MapUpdateData";
import type { IAction } from "./IAction";
import type { BoardState } from "@/rendering/util/BoardState";
import type { IActionData } from "@/rendering/components/models/ActionData/IActionData";

export class MapUpdateAction implements IAction {
    constructor(private data: MapUpdateData) { }

    validate(state: BoardState): boolean {
        throw new Error("Method not implemented.");
    }
    do(state: BoardState, firstTime: boolean, lastTime: boolean): boolean {
        state.map
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