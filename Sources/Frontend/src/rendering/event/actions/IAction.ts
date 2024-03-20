import type { IActionData } from "@/rendering/components/models/ActionData/IActionData";
import type { BoardState } from "@/rendering/util/BoardState";

export interface IAction {
    validate(state: BoardState): boolean;
    do(state: BoardState, firstTime: boolean, lastTime: boolean): boolean;
    undo(state: BoardState, firstTime: boolean, lastTime: boolean): boolean;
    getData(): IActionData;

    setSessionId(id: string): void;
}

