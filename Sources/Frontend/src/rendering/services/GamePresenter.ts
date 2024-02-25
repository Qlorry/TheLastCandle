import { BoardState } from "@/models/BoardState";
import type { IAction } from "../event/actions/IAction";
import type { Game } from "../game/Game";
import type { EventBus } from "../event/EventBus";
import { PlayerEntity } from "../entities/PlayerEntity";
import { GridEntity } from "../entities/GridEntity";
import { WORLD_WIDTH } from "../constants";
import { GridComponent } from "../components/GridComponent";

class GamePresenter {
    private state!: BoardState;
    private eventBus!: EventBus;

    setup(game: Game) {
        this.eventBus = game.events;

        const mainGrid = new GridEntity(6 * WORLD_WIDTH / 12, 6);
        game.addEntity(mainGrid);

        this.state = new BoardState(mainGrid);

        // init players
        const p1 = new PlayerEntity(
            game.camera, mainGrid.getComponent(GridComponent)
        )
        this.state.players.set("1", p1);
        game.addEntity(p1);
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

var presenterSingleton = new GamePresenter();
export {
    presenterSingleton as GamePresenter
}