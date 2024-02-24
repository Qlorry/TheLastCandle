import { BoardState } from "@/models/BoardState";
import type { IAction } from "../event/actions/IAction";
import type { Game } from "../game/Game";

export class GamePresenter {
    private state = new BoardState();
    private constructor() {

    }

    static get() {
        var me = new GamePresenter();
        return me;
    }

    setup() {

    }

    validateMove(action: IAction): boolean {
        return action.validate(this.state);
    }

    doMove(action: IAction) {
        debugger
        if (!this.validateMove(action)) {
            return false;
        }

        // send to backend
        if (false) {
            return false;
        }

        action.do(this.state);
        return true;
    }
}