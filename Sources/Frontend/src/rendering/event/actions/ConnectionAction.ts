import type { IActionData } from "@/rendering/components/models/ActionData/IActionData";
import type { BoardState } from "@/rendering/util/BoardState";
import type { IAction } from "./IAction";

export class ConnectionAction implements IAction {
    constructor(public data: IActionData)
    {}

    validate(state: BoardState): boolean {
        return true;
    }

    do(state: BoardState, firstTime: boolean): boolean {
        return true;
    }

    undo(state: BoardState, firstTime: boolean): boolean {
        return true;
    }
    
    getData(): IActionData {
        return this.data;
    }
    
    setSessionId(id: string): void {
        this.data.sessionId = id;
    }
}