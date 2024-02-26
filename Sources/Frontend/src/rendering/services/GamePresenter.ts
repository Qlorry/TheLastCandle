import { BoardState } from "@/rendering/util/BoardState";
import type { IAction } from "../event/actions/IAction";
import type { Game } from "../game/Game";
import type { EventBus } from "../event/EventBus";
import { PlayerEntity } from "../entities/PlayerEntity";
import { PassageEntity } from "../entities/PassageEntity";
import { GridEntity } from "../entities/GridEntity";
import { WORLD_WIDTH } from "../constants";
import { GridComponent } from "../components/GridComponent";
import { PassageComponent } from "../components/PassageComponent";
import { GridPositionComponent } from "../components/GridPosiotionComponent";
import { PassageType } from "@/models/PassageType";

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
        const pass1 = new PassageEntity(mainGrid.getComponent(GridComponent), PassageType.Corner);
        pass1.getComponent(PassageComponent).rotateRight().rotateRight();
        game.addEntity(pass1);
        this.state.map[0][0] = pass1;
        const pass2 = new PassageEntity(mainGrid.getComponent(GridComponent), PassageType.Straight);
        pass2.getComponent(GridPositionComponent).row = 1;
        game.addEntity(pass2);
        this.state.map[1][0] = pass2;

        const pass3 = new PassageEntity(mainGrid.getComponent(GridComponent), PassageType.Straight);
        pass3.getComponent(GridPositionComponent).col = 1;
        pass3.getComponent(PassageComponent).rotateRight();
        game.addEntity(pass3);
        this.state.map[0][1] = pass3;
    }

    validateMove(action: IAction): boolean {
        return action.validate(this.state);
    }

    doMove(action: IAction) {
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