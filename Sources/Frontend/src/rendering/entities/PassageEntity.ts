import * as THREE from 'three';

import { Entity } from './Entity';

import { GridPositionComponent } from '@/rendering/components/GridPosiotionComponent';
import { PassageSpriteComponent } from '@/rendering/components/PassageSpriteComponent';
import { PassageComponent } from '@/rendering/components/PassageComponent';

export class PassageEntity extends Entity {
    public constructor(model: PassageComponent) {
        super();

        const icon = new PassageSpriteComponent(model.type);
        const group = new THREE.Group();
        group.add(icon.sprite);

        this.addComponents(
            new GridPositionComponent(0, 0),
            PassageComponent.From(model),
            icon,
            group
        );
    }
}