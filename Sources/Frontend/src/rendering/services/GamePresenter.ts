import type { IAction } from "@/rendering/event/actions/IAction";
import type { Game } from "@/rendering/game/Game";
import type { EventBus } from "@/rendering/event/EventBus";

import { WORLD_WIDTH } from "@/rendering/constants";

import { BoardState } from "@/rendering/util/BoardState";
import { GridEntity } from "@/rendering/entities/GridEntity";
import { ServerConnector } from "./ServerConnector";
import { BoardUpdate } from "../components/models/ActionData/BoardUpdate";

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
    private eventBus!: EventBus;
    private sessionId!: string;

    public async setup(game: Game, sessionId: string) {
        this.eventBus = game.events;

        const mainGrid = new GridEntity(6 * WORLD_WIDTH / 12, 6);
        game.addEntity(mainGrid);

        this.state = new BoardState(mainGrid);

        this.eventBus.register(BoardUpdate, GamePresenter.onBoardUpdate)

        await ServerConnector.setup(game, "", sessionId);
    }

    public async doAction(action: IAction) {
        if (!this.validateMove(action)) {
            return false;
        }

        action.setSessionId(this.sessionId);

        if (!await ServerConnector.sendMessage(action)) {
            return false;
        }

        action.do(this.state, true);
        return true;
    }

    public async repeatAction(action: IAction)
    {
        action.do(this.state, false);
    }

    public async undoAction(action: IAction)
    {
        action.undo(this.state, false);
    }

    validateMove(action: IAction): boolean {
        return action.validate(this.state);
    }

    private static onBoardUpdate(update: BoardUpdate) {
        const instance = GamePresenter.get();
        update.do(instance.state, instance.eventBus);
    }
}
