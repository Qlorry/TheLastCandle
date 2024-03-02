import * as THREE from 'three';

import { TILE_LEVEL } from "@/rendering/constants";

import type { Entity } from "@/rendering/entities/Entity";
import type { Game } from "@/rendering/game/Game";
import { System } from "./System";

import { GridComponent } from "@/rendering/components/GridComponent";
import { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import { PassageComponent } from "@/rendering/components/PassageComponent";
import { PassageSpriteComponent } from "@/rendering/components/PassageSpriteComponent";
import type { GridEntity } from "@/rendering/entities/GridEntity";


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

    public override async update(dt: number, game: Game) {
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
