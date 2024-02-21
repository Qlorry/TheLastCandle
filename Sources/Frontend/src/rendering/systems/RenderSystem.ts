import {
    Object3D,
    Scene,
    WebGLRenderer,
    VSMShadowMap,
} from 'three';
import { Entity } from '../entities/Entity';    
import { EntityRemoved } from '../event/EntityRemoved';
import { Game } from '../game/Game';
import { System } from './System';

export class RenderSystem extends System {
    public readonly renderer: WebGLRenderer;

    private readonly scene: Scene;

    public constructor(canvas: HTMLCanvasElement) {
        super();

        const { innerHeight, innerWidth } = window;

        const scene = new Scene();

        const renderer = new WebGLRenderer({canvas: canvas, antialias: false});
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = VSMShadowMap;
        renderer.setClearColor(0x000000);
        renderer.setSize(innerWidth, innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        this.scene = scene;
        this.renderer = renderer;
    }

    public appliesTo(entity: Entity): boolean {
        return entity.hasComponent(Object3D);
    }

    public override removeEntity(entity: Entity): void {
        super.removeEntity(entity)
        const object = entity.getComponent(Object3D);
        this.scene.remove(object);
    }

    public update(dt: number, game: Game): void {
        // Select for rendering
        for (const entity of this.filteredEntities) {
            const object = entity.getComponent(Object3D);

            this.scene.add(object);
        }
        // render
        this.renderer.render(this.scene, game.camera);
    }
}
