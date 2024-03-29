import * as THREE from 'three';

import { Entity } from './Entity';

import { GridComponent } from '@/rendering/components/GridComponent'

export class GridEntity extends Entity {
    private grid: GridComponent;

    public constructor(size: number, rows: number) {
        super();
        const group = new THREE.Group();
        this.grid = new GridComponent(rows, rows, size, size)

        const backMaterial = new THREE.MeshBasicMaterial({ color: 0xfafafa, side: THREE.DoubleSide });
        const frontMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });

        const main = new THREE.PlaneGeometry(this.grid.width, this.grid.height);
        const plane = new THREE.Mesh(main, backMaterial);
        plane.position.x = this.grid.width / 2;
        plane.position.y = this.grid.height / 2;

        const tileGeometry = this.RoundedRectangle(this.grid.blockSize, this.grid.blockSize, 2, 10);
        for (let row = 0; row < this.grid.rows; row++) {
            for (let col = 0; col < this.grid.cols; col++) {
                const tile = new THREE.Mesh(tileGeometry, frontMaterial);
                const pos = this.getPositionForTile(row, col);
                tile.position.x = pos.x;
                tile.position.y = pos.y
                group.add(tile);
            }
        }

        group.add(plane);

        this.addComponents( // Add components to adjust which systems applies to this entity.
            group,
            this.grid
        );
    }


    // indexed BufferGeometry

    RoundedRectangle(w: number, h: number, r: number, s: number) { // width, height, radius corner, smoothness

        // helper const's
        const wi = w / 2 - r;		// inner width
        const hi = h / 2 - r;		// inner height
        const ul = r / w;			// u left
        const ur = (w - r) / w;	// u right
        const vl = r / h;			// v low
        const vh = (h - r) / h;	// v high	

        const positions = [

            wi, hi, 0, -wi, hi, 0, -wi, -hi, 0, wi, -hi, 0

        ];

        const uvs = [

            ur, vh, ul, vh, ul, vl, ur, vl

        ];

        const n = [

            3 * (s + 1) + 3, 3 * (s + 1) + 4, s + 4, s + 5,
            2 * (s + 1) + 4, 2, 1, 2 * (s + 1) + 3,
            3, 4 * (s + 1) + 3, 4, 0

        ];

        const indices = [

            n[0], n[1], n[2], n[0], n[2], n[3],
            n[4], n[5], n[6], n[4], n[6], n[7],
            n[8], n[9], n[10], n[8], n[10], n[11]

        ];

        let phi, cos, sin, xc, yc, uc, vc, idx;

        for (let i = 0; i < 4; i++) {

            xc = i < 1 || i > 2 ? wi : -wi;
            yc = i < 2 ? hi : -hi;

            uc = i < 1 || i > 2 ? ur : ul;
            vc = i < 2 ? vh : vl;

            for (let j = 0; j <= s; j++) {

                phi = Math.PI / 2 * (i + j / s);
                cos = Math.cos(phi);
                sin = Math.sin(phi);

                positions.push(xc + r * cos, yc + r * sin, 0);

                uvs.push(uc + ul * cos, vc + vl * sin);

                if (j < s) {

                    idx = (s + 1) * i + j + 4;
                    indices.push(i, idx, idx + 1);

                }

            }

        }

        const geometry = new THREE.BufferGeometry();
        geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));

        return geometry;

    }


    public getPositionForTile(row: number, col: number) {
        return new THREE.Vector3(
            col * this.grid.blockSize + this.grid.lineWidth * (col + 1) + this.grid.blockSize / 2,
            row * this.grid.blockSize + this.grid.lineWidth * (row + 1) + this.grid.blockSize / 2,
            0
        )
    }
}
