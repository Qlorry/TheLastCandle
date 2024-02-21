import * as THREE from 'three';
import { Entity } from './Entity';
import { GridComponent } from '../components/GridComponent'

export class GridEntity extends Entity {
    public constructor(size: number, rows: number) {
        super();

        const group = new THREE.Group();

        this.addComponents( // Add components to adjust which systems applies to this entity.
            group,
            new GridComponent(rows, rows, size, size)
        );
    }
}
