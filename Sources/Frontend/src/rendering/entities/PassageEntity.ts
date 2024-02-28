import * as THREE from 'three';

import { Entity } from './Entity';

import type { GridComponent } from '@/rendering/components/GridComponent';
import { GridPositionComponent } from '@/rendering/components/GridPosiotionComponent';
import { PassageType } from '@/models/PassageType';
import { PassageSpriteComponent } from '@/rendering/components/PassageSpriteComponent';
import { PassageComponent } from '@/rendering/components/PassageComponent';

export class PassageEntity extends Entity {
    public constructor(grid: GridComponent, type: PassageType) {
        super();

        const icon = new PassageSpriteComponent(type);
        const group = new THREE.Group();
        group.add(icon.sprite);

        this.addComponents(
            new GridPositionComponent(0, 0, grid),
            new PassageComponent(type),
            icon,
            group
        );
    }
}