import * as THREE from 'three';
import { Entity } from '../entities/Entity';
import { EntityRemoved } from '../event/EntityRemoved';
import { Game } from '../game/Game';
import { System } from './System';
import { GridComponent } from '../components/GridComponent';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../constants';

export class GridRenderingSystem extends System {

    public constructor() {
        super();
    }

    public appliesTo(entity: Entity): boolean {
        return entity.hasComponent(GridComponent) || entity.hasComponent(THREE.Group);
    }

    public update(dt: number, game: Game): void {
        // Select for rendering
        for (const entity of this.filteredEntities) {
            const object = entity.getComponent(THREE.Group);
            const grid = entity.getComponent(GridComponent);

            object.add(grid.plane)
 
            let xStart = (WORLD_WIDTH - grid.width) / 2;
            let yStart = (WORLD_HEIGHT - grid.height) / 2;
            object.position.set(xStart, yStart, 0);

        }
    }
}
