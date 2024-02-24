import { GridPositionComponent } from "../components/GridPosiotionComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { PlayerControllerComponent } from "../components/PlayerControllerComponent";
import { PlayerSpriteComponent } from "../components/PlayerSpriteComponent";
import type { Entity } from "../entities/Entity";
import type { GridEntity } from "../entities/GridEntity";
import { PlayerMove } from "../event/actions/PlayerMove";
import type { Game } from "../game/Game";
import { GamePresenter } from "../services/GamePresenter";
import { System } from "./System";

// TODO: move grid positioning logic elsewhere
export class PlayerRenderingSystem extends System {
    private _grid: GridEntity | undefined;

    public constructor() {
        super();
    }

    public setGrid(grid: GridEntity)
    {
        this._grid = grid;
    }

    public appliesTo(entity: Entity): boolean {
        return entity.hasComponent(GridPositionComponent) && entity.hasComponent(PlayerControllerComponent) && entity.hasComponent(PlayerSpriteComponent);
    }

    public update(dt: number, game: Game): void {
        if(!this._grid) return;

        // Select for rendering
        for (const entity of this.filteredEntities) {
            const player = entity.getComponent(GridPositionComponent);
            const actions = entity.getComponent(PlayerControllerComponent);
            const sprite = entity.getComponent(PlayerSpriteComponent);

            if(actions.keys.left)
            {
                GamePresenter.get().doMove(new PlayerMove(
                    player,
                    [player.row, player.col-1]
                ))
                actions.keys.left = false;
            }
            else if(actions.keys.right)
            {
                GamePresenter.get().doMove(new PlayerMove(
                    player,
                    [player.row, player.col+1]
                ))
                actions.keys.right = false;
            }
            else if(actions.keys.forward)
            {
                GamePresenter.get().doMove(new PlayerMove(
                    player,
                    [player.row+1, player.col]
                ))
                actions.keys.forward = false;
            }
            else if(actions.keys.backward)
            {
                GamePresenter.get().doMove(new PlayerMove(
                    player,
                    [player.row-1, player.col]
                ))
                actions.keys.backward = false;
            }

            const newPos = this._grid.getPositionForTile(player.row, player.col);
            sprite.sprite.position.set(newPos.x, newPos.y, 1);
        }
    }
}
