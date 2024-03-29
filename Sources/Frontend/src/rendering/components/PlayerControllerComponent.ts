import * as THREE from 'three';

interface Controls {
    forward: boolean,
    backward: boolean,
    left: boolean,
    right: boolean,
    rotateLeft: boolean,
    rotateRight: boolean,
    enter: boolean,
}

class PlayerControllerComponent {
    private raycaster = new THREE.Raycaster();
    public readonly keys: Controls;

    constructor(
        public params: { camera?: THREE.Camera, }
    ) {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
        } as Controls;

        this._Init();
    }

    _Init() {
        document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
        //document.addEventListener('mouseup', (e) => this._onMouseUp(e), false);
    }

    // _onMouseUp(event: any) {
    //     const rect = document.getElementById('threejs').getBoundingClientRect();
    //     const pos = {
    //         x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
    //         y: ((event.clientY - rect.top) / rect.height) * -2 + 1,
    //     };

    //     this.raycaster.setFromCamera(pos, this.params.camera);

    //     const pickables = this.Manager.Filter((e) => {
    //         const p = e.GetComponent('PickableComponent');
    //         if (!p) {
    //             return false;
    //         }
    //         return e._mesh;
    //     });

    //     const ray = new THREE.Ray();
    //     ray.origin.setFromMatrixPosition(this.params.camera.matrixWorld);
    //     ray.direction.set(pos.x, pos.y, 0.5).unproject(
    //         this.params.camera).sub(ray.origin).normalize();

    //     for (let p of pickables) {
    //         // GOOD ENOUGH
    //         const box = new THREE.Box3().setFromObject(p._mesh);

    //         if (ray.intersectsBox(box)) {
    //             p.Broadcast({
    //                 topic: 'input.picked'
    //             });
    //             break;
    //         }
    //     }
    // }

    _onKeyDown(event: KeyboardEvent) {
        if (!event || !event.currentTarget || (event.currentTarget as any).activeElement != document.body) {
            return;
        }
        switch (event.key) {
            case "w":
            case "ArrowUp":
                this.keys.forward = true;
                break;
            case "a":
            case "ArrowLeft":
                this.keys.left = true;
                break;
            case "s":
            case "ArrowDown":
                this.keys.backward = true;
                break;
            case "d":
            case "ArrowRight":
                this.keys.right = true;
                break;
            case "q":
                this.keys.rotateLeft = true;
                break;
            case "e":
                this.keys.rotateRight = true;
                break;
            case "Enter":
                this.keys.enter = true;
                break;
        }
        // if (event.shiftKey) // SHIFT
        // this.keys.shift = true;
    }

    _onKeyUp(event: KeyboardEvent) {
        if (!event || !event.currentTarget || (event.currentTarget as any).activeElement != document.body) {
            return;
        }
        switch (event.key) {
            case "w":
            case "ArrowUp":
                this.keys.forward = false;
                break;
            case "a":
            case "ArrowLeft":
                this.keys.left = false;
                break;
            case "s":
            case "ArrowDown":
                this.keys.backward = false;
                break;
            case "d":
            case "ArrowRight":
                this.keys.right = false;
                break;
            case "q":
                this.keys.rotateLeft = false;
                break;
            case "e":
                this.keys.rotateRight = false;
                break;
            case "Enter":
                this.keys.enter = false;
                break;
        }
        // this.keys.shift = event.shiftKey;
    }
}

export {
    PlayerControllerComponent,
    type Controls
}