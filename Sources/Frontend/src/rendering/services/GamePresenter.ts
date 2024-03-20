import type { IAction } from "@/rendering/event/actions/IAction";
import type { Game } from "@/rendering/game/Game";
import type { EventBus } from "@/rendering/event/EventBus";

import { BoardState } from "@/rendering/util/BoardState";
import { GridEntity } from "@/rendering/entities/GridEntity";
import { ServerConnector } from "./ServerConnector";
import { BoardUpdate } from "../components/models/ActionData/BoardUpdate";
import { PassageEntity } from "../entities/PassageEntity";
import { PassageComponent } from "../components/PassageComponent";
import { PassageType } from "../components/models/PassageType";
import { EntityAdded } from "../event/EntityAdded";
import { GRID, WORLD } from "../constants";

export class GamePresenter {
    private static instance: GamePresenter;
    private constructor() { }

    public static get(): GamePresenter {
        if (!GamePresenter.instance) {
            GamePresenter.instance = new GamePresenter();
        }

        return GamePresenter.instance;
    }

    private state!: BoardState;
    public eventBus!: EventBus;
    private sessionId!: string;

    public async setup(game: Game, sessionId: string) {
        this.eventBus = game.events;

        const mainGrid = new GridEntity();
        game.addEntity(mainGrid);

        this.state = new BoardState(mainGrid);

        this.eventBus.register(BoardUpdate, GamePresenter.onBoardUpdate)

        await ServerConnector.setup(game, "", sessionId);
    }

    public async doAction(action: IAction, mustValidateOnServer = true) {
        if (!this.validateMove(action)) {
            return false;
        }

        action.setSessionId(this.sessionId);

        if (mustValidateOnServer && !await ServerConnector.sendMessage(action)) {
            return false;
        }

        action.do(this.state, true, false);
        return true;
    }

    public async doServerAction(action: IAction) {
        action.do(this.state, true, true);
    }

    public async repeatAction(action: IAction, lastTime: boolean) {
        action.do(this.state, false, lastTime);
    }

    public async undoAction(action: IAction, lastTime: boolean) {
        action.undo(this.state, false, lastTime);
    }

    validateMove(action: IAction): boolean {
        return action.validate(this.state);
    }

    private static onBoardUpdate(update: BoardUpdate) {
        const instance = GamePresenter.get();
        update.do(instance.state, instance.eventBus);
        if(instance.state.tempTile)
        instance.eventBus.emit(new EntityAdded(instance.state.tempTile));
    }
}
