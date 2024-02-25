import { GridComponent } from "../components/GridComponent";
import { GridPositionComponent } from "../components/GridPosiotionComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { PlayerControllerComponent } from "../components/PlayerControllerComponent";
import { PlayerSpriteComponent } from "../components/PlayerSpriteComponent";
import type { Entity } from "../entities/Entity";
import type { GridEntity } from "../entities/GridEntity";
import { PlayerMove, ThisPlayerMove } from "../event/actions/PlayerMove";
import type { Game } from "../game/Game";
import { GamePresenter } from "../services/GamePresenter";
import { System } from "./System";

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
                    [playerPos.row, playerPos.col - 1]
                ))
                actions.keys.left = false;
            }
            else if (actions.keys.right) {
                GamePresenter.doMove(new ThisPlayerMove(
                    player.uuid,
                    playerPos,
                    [playerPos.row, playerPos.col + 1]
                ))
                actions.keys.right = false;
            }
            else if (actions.keys.forward) {
                GamePresenter.doMove(new ThisPlayerMove(
                    player.uuid,
                    playerPos,
                    [playerPos.row + 1, playerPos.col]
                ))
                actions.keys.forward = false;
            }
            else if (actions.keys.backward) {
                GamePresenter.doMove(new ThisPlayerMove(
                    player.uuid,
                    playerPos,
                    [playerPos.row - 1, playerPos.col]
                ))
                actions.keys.backward = false;
            }

            const newPos = this._grid.getPositionForTile(playerPos.row, playerPos.col);
            sprite.sprite.position.set(newPos.x, newPos.y, 1);
        }
    }
}
