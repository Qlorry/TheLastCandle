import { IcosahedronGeometry, Mesh, MeshBasicMaterial} from 'three';

import { Entity } from './Entity';

import { LoadingComponent } from '@/rendering/components/LoadingComponent'

export class LoadingEntity extends Entity {
    public constructor() {
        super();

        // Creating an object with three.js.

        const geometry = new IcosahedronGeometry(10, 0);
        const material = new MeshBasicMaterial({color: 0xff00ff, wireframe: true});

        const mesh = new Mesh(geometry, material); // Mesh extends object3D, which is needed if it's gonna be added to the scene.

        mesh.position.set(15, 15, 0);

        this.addComponents( // Add components to adjust which systems applies to this entity.
            mesh,
            new LoadingComponent(0.007)
        );
    }
}
