import * as THREE from 'three';

import { Entity } from './Entity';

import { PlayerComponent } from '@/rendering/components/PlayerComponent';
import { PlayerControllerComponent } from '@/rendering/components/PlayerControllerComponent';
import { GridPositionComponent } from '@/rendering/components/GridPosiotionComponent';
import { PlayerSpriteComponent } from '@/rendering/components/PlayerSpriteComponent';

export class PlayerEntity extends Entity {
    public constructor(player: PlayerComponent) {
        super();

        const icon = new PlayerSpriteComponent();
        const group = new THREE.Group();
        group.add(icon.sprite);

        this.addComponents(
            new GridPositionComponent(0, 0),
            PlayerComponent.From(player),
            new PlayerControllerComponent({ }),
            icon,
            group,
        );
    }
}