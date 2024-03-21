import * as THREE from 'three';
import { GRID } from '../constants';

export class PlayerSpriteComponent {
    // public sprite: THREE.Sprite
    public sprite: THREE.Object3D
    public constructor(
    ) {
        const map = new THREE.TextureLoader().load('textures/candle.png');
        const material = new THREE.SpriteMaterial({ map: map });

        this.sprite = new THREE.Sprite(material);
        this.sprite.scale.set(GRID.TILE_SIZE - 10, GRID.TILE_SIZE - 10, GRID.TILE_SIZE - 10);
    }
}