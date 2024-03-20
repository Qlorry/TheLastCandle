import * as THREE from 'three';

import { Entity } from '@/rendering/entities/Entity';
import { Game } from '@/rendering/game/Game';
import { System } from './System';

import { GridComponent } from '@/rendering/components/GridComponent';
import { GridPositionComponent } from '@/rendering/components/GridPosiotionComponent';
import type { GridEntity } from '../entities/GridEntity';
import { WORLD } from '../constants';

export class GridRenderingSystem extends System {
    mainGrid?: GridEntity;
    public constructor() {
        super();
    }

    public appliesTo(entity: Entity): boolean {
        return (entity.hasComponent(GridComponent) || entity.hasComponent(GridPositionComponent))
            && entity.hasComponent(THREE.Group);
    }

    public override addEntity(entity: Entity): void {
        if (entity.hasComponent(GridComponent))
            this.mainGrid = entity as GridEntity;
        super.addEntity(entity);
    }

    public override async update(dt: number, game: Game) {
        if(!this.mainGrid) return;

        const gridProps = this.mainGrid.getComponent(GridComponent);
        // Select for rendering
        for (const entity of this.filteredEntities) {
            const object = entity.getComponent(THREE.Group);

            const xStart = (WORLD.WIDTH - gridProps.width) / 2;
            const yStart = (WORLD.HEIGHT - gridProps.height) / 2;
            object.position.set(xStart, yStart, 0);
        }
    }
}
