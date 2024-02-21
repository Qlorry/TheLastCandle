import { Entity } from '../entities/Entity';

export class EntityRemoved {
    public constructor(
        public readonly entity: Entity
    ) {}
}
