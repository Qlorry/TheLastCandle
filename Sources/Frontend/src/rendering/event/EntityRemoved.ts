import { Entity } from '@/rendering/entities/Entity';

export class EntityRemoved {
    public constructor(
        public readonly entity: Entity
    ) {}
}
