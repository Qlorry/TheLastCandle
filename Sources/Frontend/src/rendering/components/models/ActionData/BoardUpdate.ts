import type { EventBus } from "@/rendering/event/EventBus";
import type { BoardData } from "../BoardData";
import type { EventStatus } from "./IActionData";
import { EntityRemoved } from "@/rendering/event/EntityRemoved";
import type { BoardState } from "@/rendering/util/BoardState";
import { PassageComponent } from "@/rendering/components/PassageComponent";
import { EntityAdded } from "@/rendering/event/EntityAdded";
import { PassageEntity } from "@/rendering/entities/PassageEntity";
import { PlayerEntity } from "@/rendering/entities/PlayerEntity";
import { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import type { PlayerComponent } from "@/rendering/components/PlayerComponent";
import { PlayerState } from "../PlayerState";
import { Object3D } from "three";
import { MapUpdateAction } from "@/rendering/event/actions/MapUpdateAction";
import { MapUpdateData } from "./MapUpdateData";

export class BoardUpdate {
    public id!: string;
    public sessionId!: string;
    public status!: EventStatus;
    public board!: BoardData

    public do(state: BoardState, eventBus: EventBus) {

        this.board.players.forEach((value: PlayerComponent, key: string) => {
            const current = state.players.get(key);
            if (current !== undefined) {
                //current.getComponent(PlayerComponent);
            }
            else {
                const pl = new PlayerEntity(value);
                eventBus.emit(new EntityAdded(pl));
                state.players.set(key, pl);
            }
        });

        state.currentGameState = this.board.currentGameState;
        state.nextPassages = this.board.nextPassages;
        state.usedPassages = this.board.usedPassages;
        if (this.board.currentGameState == PlayerState.PlaceTile && state.tempTile === undefined) {
            state.tempTile = new PassageEntity(
                this.board.nextPassages[0]
            );
            state.tempTile.getComponent(Object3D).userData = { shouldDisplay: false };
            eventBus.emit(new EntityAdded(state.tempTile));
        }

        new MapUpdateAction(new MapUpdateData(this.board.map)).do(state, true, true);

        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                const player = this.board.map[i][j].player;
                if (player) {
                    state.map[i][j].player = player;
                    const current = state.players.get(player);
                    const pos = current?.getComponent(GridPositionComponent);
                    if (pos) {
                        pos.col = j;
                        pos.row = i;
                    }
                }
                else {
                    state.map[i][j].player = undefined;
                }
            }
        }
    }
}

