import * as THREE from 'three';
import { PassageType } from './models/PassageType';
import { GRID } from '../constants';

export class PassageSpriteComponent {
    public sprite: THREE.Sprite
    public constructor(type: PassageType) {
        let textureName = "";
        switch (type) {
            case PassageType.T:
                textureName = "passage_t"
                break;
            case PassageType.Straight:
                textureName = "passage_straight"
                break;
            case PassageType.FourWay:
                textureName = "passage_four_way"
                break;
            case PassageType.Corner:
                textureName = "passage_corner"
                break;
        }
        const map = new THREE.TextureLoader().load(`textures/${textureName}.png`);
        const material = new THREE.SpriteMaterial({ map: map });

        this.sprite = new THREE.Sprite(material);
        this.sprite.scale.set(GRID.TILE_SIZE, GRID.TILE_SIZE, GRID.TILE_SIZE);
    }
}