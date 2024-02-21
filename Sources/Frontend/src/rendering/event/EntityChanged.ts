import { Entity } from '../entities/Entity';

export class EntityChanged {
    public constructor(
        public readonly entity: Entity
    ) {}
}
