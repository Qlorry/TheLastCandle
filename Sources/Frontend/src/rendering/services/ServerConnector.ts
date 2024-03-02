import type { EventBus } from "../event/EventBus";
import type { Game } from "../game/Game";
import * as signalR from '@microsoft/signalr'
import { PlayerComponent } from "../components/PlayerComponent";
import type { BoardData } from "../components/models/BoardData";
import { IActionData, EventStatus } from "../components/models/ActionData/IActionData";
import { BoardUpdate } from "../components/models/ActionData/BoardUpdate";
import { PlayerMoveData } from "../components/models/ActionData/PlayerMove";
import { ConnectionAction } from "../event/actions/ConnectionAction";
import type { IAction } from "../event/actions/IAction";
import { PendingActionsSystem } from "../systems/PendingActionsSystem";

export class ServerConnector {
    private static connection: signalR.HubConnection;
    private static events: EventBus;
    private static sessionId: string = "0-0-0-0";

    static async setup(game: Game, loginToken: string, sessionId: string) {
        this.sessionId = sessionId;
        this.events = game.events;

        this.connection = new signalR.HubConnectionBuilder()
            // .withUrl("api/hubs/game", { accessTokenFactory: () => loginToken })
            .withUrl("api/hubs/game")
            .configureLogging(signalR.LogLevel.Debug)
            .build()

        this.connection.on("BoardUpdate", (action: BoardData, result: EventStatus) => ServerConnector.onBoardUpdate(action, result));
        this.connection.on("PlayerMove", (action: PlayerMoveData, result: EventStatus) => ServerConnector.onPlayerMove(action, result));
        this.connection.on("ServerMessage", ServerConnector.onBoardUpdate);

        await this.connection.start();

        const connectionEvent = new IActionData();
        connectionEvent.playerId = "a8ba1aa6-5307-44a0-b3bb-74670aaea08b";
        connectionEvent.sessionId = sessionId;

        try {
            connectionEvent.id = await this.connection
                .invoke("ConnectToSession", connectionEvent);

            const connectionAction = new ConnectionAction(connectionEvent);
            PendingActionsSystem.Add(connectionAction);
        } catch (err) {
            console.error(err);
        }
    }

    private static onBoardUpdate(action: BoardData, result: EventStatus) {
        if (action.id)
            PendingActionsSystem.Remove(action.id, result)
    // DO actions

        // Black magic because C# converts Dictionary like a dumbass
        const temp: any = action.players;
        action.players = new Map<string, PlayerComponent>();
        Object.keys(temp).forEach(key => {
            action.players.set(key, temp[key]);
        });
        // Black magic end
        const BoardUpdat = new BoardUpdate();
        BoardUpdat.board = action;

        this.events.emit(BoardUpdat);
    }

    private static onPlayerMove(action: PlayerMoveData, result: EventStatus) {
        if (action.id && PendingActionsSystem.Remove(action.id, result))
            return;
        // DO actions
    }

    private static getEndpoint(action: IActionData) {
        if (action instanceof PlayerMoveData)
            return "Move";
        return "";
    }

    public static async sendMessage(action: IAction) {
        const actionData = action.getData();
        actionData.sessionId = this.sessionId;
        try {
            actionData.id = await this.connection.invoke(this.getEndpoint(actionData), actionData);
            PendingActionsSystem.Add(action);
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }
}
