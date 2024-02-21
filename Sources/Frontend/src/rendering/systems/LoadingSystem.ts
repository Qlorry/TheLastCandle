import { System } from './System';
import { Entity } from '../entities/Entity';
import { Game } from '../game/Game';
import { LoadingComponent } from '../components/LoadingComponent';
import { Object3D } from 'three';

export class LoadingSystem extends System {
    public constructor() {
        super();
    }

    public appliesTo(entity: Entity): boolean { // Should return true if system applies to that entity.
        return entity.hasComponents(LoadingComponent); // Checks if entity has a component of type ExampleComponent.
    }

    public update(dt: number, game: Game): void { // Runs every update of the game.
        for (const entity of this.filteredEntities) { // Loops through all entities that system applies to.

            // DO STUFF

            const object  = entity.getComponent(Object3D); // Get entity object.
            const value = entity.getComponent(LoadingComponent).value; // Get entity data.

            object.rotation.x += value; // Rotate object based on the entity's data.
            object.rotation.y += value;
        }
    }
}