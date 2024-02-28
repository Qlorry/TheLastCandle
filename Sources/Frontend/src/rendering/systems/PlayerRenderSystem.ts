import { System } from "./System";
import type { Entity } from "@/rendering/entities/Entity";
import type { Game } from "@/rendering/game/Game";

import { PLAYER_LEVEL } from "@/rendering/constants";
import { Direction } from "@/rendering/util/Direction";

import { GridComponent } from "@/rendering/components/GridComponent";
import { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import { PlayerComponent } from "@/rendering/components/PlayerComponent";
import { PlayerControllerComponent } from "@/rendering/components/PlayerControllerComponent";
import { PlayerSpriteComponent } from "@/rendering/components/PlayerSpriteComponent";
import type { GridEntity } from "@/rendering/entities/GridEntity";
import { ThisPlayerMove } from "@/rendering/event/actions/PlayerMove";
import { GamePresenter } from "@/rendering/services/GamePresenter";

export class PlayerRenderingSystem extends System {
    private _grid: GridEntity | undefined;

    public constructor() {
        super();
    }

    public override addEntity(entity: Entity) {
        if(entity.hasComponent(GridComponent))
            this._grid = entity as GridEntity;
        else
            super.addEntity(entity);
    }

    public removeEntity(entity: Entity) {
        if(entity.hasComponent(GridComponent))
            this._grid = undefined;
        else
            super.removeEntity(entity);
    }

    public appliesTo(entity: Entity): boolean {
        return entity.hasComponents(
            GridPositionComponent,
            PlayerControllerComponent,
            PlayerSpriteComponent,
            PlayerComponent)
            || entity.hasComponent(GridComponent);
    }

    public update(dt: number, game: Game): void {
        if (!this._grid) return;

        // Select for rendering
        for (const entity of this.filteredEntities) {
            const playerPos = entity.getComponent(GridPositionComponent);
            const actions = entity.getComponent(PlayerControllerComponent);
            const sprite = entity.getComponent(PlayerSpriteComponent);
            const player = entity.getComponent(PlayerComponent);

            if (actions.keys.left) {
                GamePresenter.doMove(new ThisPlayerMove(
                    player.uuid,
                    playerPos,
                    Direction.left
                ))
                actions.keys.left = false;
            }
            else if (actions.keys.right) {
                GamePresenter.doMove(new ThisPlayerMove(
                    player.uuid,
                    playerPos,
                    Direction.right
                ))
                actions.keys.right = false;
            }
            else if (actions.keys.forward) {
                GamePresenter.doMove(new ThisPlayerMove(
                    player.uuid,
                    playerPos,
                    Direction.forward
                ))
                actions.keys.forward = false;
            }
            else if (actions.keys.backward) {
                GamePresenter.doMove(new ThisPlayerMove(
                    player.uuid,
                    playerPos,
                    Direction.back
                ))
                actions.keys.backward = false;
            }

            const newPos = this._grid.getPositionForTile(playerPos.row, playerPos.col);
            sprite.sprite.position.set(newPos.x, newPos.y, PLAYER_LEVEL);
        }
    }
}
