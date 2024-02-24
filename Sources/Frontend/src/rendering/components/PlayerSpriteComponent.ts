import * as THREE from 'three';

export class PlayerSpriteComponent {
    // public sprite: THREE.Sprite
    public sprite: THREE.Object3D
    public constructor(
    ) {
        const map = new THREE.TextureLoader().load( 'textures/candle.png' );
        const material = new THREE.SpriteMaterial( { map: map } );

        this.sprite = new THREE.Sprite( material );
        this.sprite.scale.set(10,10,10);
        // const geometry = new THREE.PlaneGeometry( 10, 10 );
        // const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        // this.sprite = new THREE.Mesh( geometry, material );
    }
}