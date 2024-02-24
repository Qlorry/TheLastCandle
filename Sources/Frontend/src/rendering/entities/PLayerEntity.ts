import { PlayerComponent } from '../components/PlayerComponent';
import { Entity } from './Entity';
import { PlayerControllerComponent } from '../components/PlayerControllerComponent';
import { GridPositionComponent } from '../components/GridPosiotionComponent';
import { PlayerSpriteComponent } from '../components/PlayerSpriteComponent';
import * as THREE from 'three';
import type { GridComponent } from '../components/GridComponent';

export class PlayerEntity extends Entity {
    public constructor(camera: THREE.Camera, 
        grid: GridComponent) {
        super();

        const icon = new PlayerSpriteComponent();
        const group = new THREE.Group();
        group.add(icon.sprite);
        group.position.x = 30;
        group.position.y = 30;

        this.addComponents(
            new GridPositionComponent(0,0, grid),
            new PlayerComponent("1"),
            new PlayerControllerComponent({camera}),
            icon,
            group
        );
    }
}