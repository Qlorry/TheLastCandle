import { Object3D } from 'three';

import { System } from './System';
import { Entity } from '@/rendering/entities/Entity';
import { Game } from '@/rendering/game/Game';

import { LoadingComponent } from '@/rendering/components/LoadingComponent';

export class LoadingSystem extends System {
    public constructor() {
        super();
    }

    public appliesTo(entity: Entity): boolean { // Should return true if system applies to that entity.
        return entity.hasComponents(LoadingComponent); // Checks if entity has a component of type ExampleComponent.
    }

    public override async update(dt: number, game: Game) { // Runs every update of the game.
        for (const entity of this.filteredEntities) { // Loops through all entities that system applies to.

            // DO STUFF

            const object  = entity.getComponent(Object3D); // Get entity object.
            const value = entity.getComponent(LoadingComponent).value; // Get entity data.

            object.rotation.x += value; // Rotate object based on the entity's data.
            object.rotation.y += value;
        }
    }
}
