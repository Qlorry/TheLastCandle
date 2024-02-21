import { Entity } from '../entities/Entity';

export class EntityAdded {
    public constructor(
        public readonly entity: Entity
    ) {}
}
