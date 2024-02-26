import * as THREE from 'three';
import type { GridComponent } from '../components/GridComponent';
import { Entity } from './Entity';
import { GridPositionComponent } from '../components/GridPosiotionComponent';
import { PassageType } from '@/models/PassageType';
import { PassageSpriteComponent } from '../components/PassageSpriteComponent';
import { PassageComponent } from '../components/PassageComponent';

export class PassageEntity extends Entity {
    public constructor(grid: GridComponent, type: PassageType) {
        super();

        const icon = new PassageSpriteComponent(type);
        const group = new THREE.Group();
        group.add(icon.sprite);

        this.addComponents(
            new GridPositionComponent(0,0, grid),
            new PassageComponent(type),
            icon,
            group
        );
    }
}