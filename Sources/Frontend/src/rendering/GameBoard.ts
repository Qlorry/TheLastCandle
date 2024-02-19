import * as THREE from 'three';

export class GameBoard {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private boardSize: number = 6;
    private tileSize: number = 1;
    private boardOffset: number = -(this.tileSize * this.boardSize) / 2 + this.tileSize / 2; // To center the board
    private canvas: HTMLCanvasElement;

    constructor(container: HTMLElement, canvas: HTMLCanvasElement) {
      this.canvas = canvas;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(this.renderer.domElement);

      this.initializeBoard();
      this.setupCamera();
      this.animate();
    }

    private initializeBoard(): void {

      const tileTexture = this.createTileTexture(); // Call this outside your loop to reuse the texture

      for (let x = 0; x < this.boardSize; x++) {
        for (let y = 0; y < this.boardSize; y++) {
          const geometry = new THREE.PlaneGeometry(this.tileSize, this.tileSize);
          const material = new THREE.MeshBasicMaterial({
            map: tileTexture,
          });
          const tile = new THREE.Mesh(geometry, material);
          tile.position.set(x + this.boardOffset, y + this.boardOffset, 0);
          this.scene.add(tile);
        }
      }

    }

    private setupCamera(): void {
      const centerOffset = this.boardSize / 2 - 0.5;
      this.camera.position.x = centerOffset + this.boardOffset;
      this.camera.position.y = centerOffset + this.boardOffset;
      this.camera.position.z = 5;
      this.camera.lookAt(centerOffset + this.boardOffset, centerOffset + this.boardOffset, 0);
    }

    private animate(): void {
      requestAnimationFrame(() => this.animate());
      this.renderer.render(this.scene, this.camera);
    }

    private createTileTexture(padding: number = 2): THREE.Texture {
      // Create a canvas
      const canvas = this.canvas;
      const size = 256; // Size of the texture
      const innerSize = size - padding * 2;
      const context = canvas.getContext('2d');
      if (!context) throw new Error("Failed to get canvas context");

      // Fill background
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for redraw
      context.fillStyle = '#020103';
      context.fillRect(0, 0, size, size);

      // Draw blurred white stroke
      const strokeSize = 10;
      const blurSize = 15;
      context.strokeStyle = '#d9d5d4';
      context.lineWidth = strokeSize;
      context.shadowColor = '#d9d5d4';
      context.shadowBlur = blurSize;
      // Adjust the rectangle drawing to include padding
      context.strokeRect(padding + strokeSize / 2, padding + strokeSize / 2, innerSize - strokeSize, innerSize - strokeSize);


      // Use the canvas as a texture
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true; // Update the texture

      return texture;
    }
  }
  