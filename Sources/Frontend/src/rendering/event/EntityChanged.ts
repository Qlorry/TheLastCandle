import { Entity } from '@/rendering/entities/Entity';

export class EntityChanged {
    public constructor(
        public readonly entity: Entity
    ) {}
}
