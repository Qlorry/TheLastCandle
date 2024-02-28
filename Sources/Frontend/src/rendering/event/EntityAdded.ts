import { Entity } from '@/rendering/entities/Entity';

export class EntityAdded {
    public constructor(
        public readonly entity: Entity
    ) {}
}
