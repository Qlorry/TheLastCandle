import { GeometryUtils, Line2, LineGeometry, LineMaterial } from 'three/addons/Addons';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../constants';
import * as THREE from 'three';

export class GridComponent {
    private backMaterial: THREE.MeshBasicMaterial;
    private frontMaterial: THREE.MeshBasicMaterial;
    public plane: THREE.Mesh;

    private blockSize: number;
    

    public constructor(
        public rows: number,
        public cols: number,
        public width: number,
        public height: number,
        public lineWidth: number = 2
    ) {
        this.blockSize = (width - this.lineWidth * (rows + 1))/ rows;

        this.backMaterial = new THREE.MeshBasicMaterial({ color: 0xfafafa, side: THREE.DoubleSide });
        this.frontMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });

        const main = new THREE.PlaneGeometry(width, height);
        this.plane = new THREE.Mesh(main, this.backMaterial);
        this.plane.position.x = width / 2;
        this.plane.position.y = height / 2;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const tileGeometry = new THREE.PlaneGeometry(this.blockSize, this.blockSize);
                const tile = new THREE.Mesh(tileGeometry, this.frontMaterial);
                tile.position.x = row * this.blockSize + this.lineWidth * (row + 1) - width / 2 + this.blockSize / 2;
                tile.position.y = col * this.blockSize + this.lineWidth * (col + 1) - height / 2 + this.blockSize / 2;
                this.plane.add(tile);
            }
        }
    }
}
