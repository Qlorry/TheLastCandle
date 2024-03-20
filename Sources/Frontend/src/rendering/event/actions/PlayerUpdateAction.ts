import type { IActionData } from "@/rendering/components/models/ActionData/IActionData";
import type { BoardState } from "@/rendering/util/BoardState";
import type { IAction } from "./IAction";
import type { PlayerUpdateData } from "@/rendering/components/models/ActionData/PlayerUpdateData";
import { PlayerComponent } from "@/rendering/components/PlayerComponent";

export class PlayerUpdateAction implements IAction {
    private prev?: PlayerComponent;
    constructor(private data: PlayerUpdateData) { }

    validate(state: BoardState): boolean {
        throw new Error("Method not implemented.");
    }
    do(state: BoardState, firstTime: boolean, lastTime: boolean): boolean {
        const player = state.players.get(this.data.player.id);
        if (!player)
            return false;

        this.prev = PlayerComponent.From(this.data.player);
        player.getComponent(PlayerComponent).Swap(this.prev);
        return true;
    }
    undo(state: BoardState, firstTime: boolean, lastTime: boolean): boolean {
        if (!this.prev)
            return false;

        const player = state.players.get(this.data.player.id);
        if (!player)
            return false;

        player.getComponent(PlayerComponent).Swap(this.prev);
        return true;
    }
    getData(): IActionData {
        return this.data;
    }
    setSessionId(id: string): void {
        this.data.sessionId = id;
    }
}