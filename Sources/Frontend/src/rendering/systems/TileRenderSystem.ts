import { GridComponent } from "../components/GridComponent";
import { GridPositionComponent } from "../components/GridPosiotionComponent";
import { PassageComponent } from "../components/PassageComponent";
import { PassageSpriteComponent } from "../components/PassageSpriteComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { PlayerControllerComponent } from "../components/PlayerControllerComponent";
import { PlayerSpriteComponent } from "../components/PlayerSpriteComponent";
import { TILE_LEVEL } from "../constants";
import type { Entity } from "../entities/Entity";
import type { GridEntity } from "../entities/GridEntity";
import { PlayerMove, ThisPlayerMove } from "../event/actions/PlayerMove";
import type { Game } from "../game/Game";
import { GamePresenter } from "../services/GamePresenter";
import { Direction } from "../util/Direction";
import { System } from "./System";
import * as THREE from 'three';

export class TileRenderingSystem extends System {
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
            PassageSpriteComponent,
            PassageComponent)
            || entity.hasComponent(GridComponent);
    }

    public update(dt: number, game: Game): void {
        if (!this._grid) return;
        // Select for rendering
        for (const entity of this.filteredEntities) {
            const playerPos = entity.getComponent(GridPositionComponent);
            const sprite = entity.getComponent(PassageSpriteComponent);
            const passage = entity.getComponent(PassageComponent);

            const newPos = this._grid.getPositionForTile(playerPos.row, playerPos.col);
            sprite.sprite.position.set(newPos.x, newPos.y, TILE_LEVEL);
            sprite.sprite.material.rotation = THREE.MathUtils.degToRad(passage.rotation);
        }
    }
}
