import {
    Object3D,
    Scene,
    WebGLRenderer,
    VSMShadowMap,
} from 'three';

import { Entity } from '@/rendering/entities/Entity';    
import { Game } from '@/rendering/game/Game';
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

    public override async update(dt: number, game: Game) {
        // Select for rendering
        for (const entity of this.filteredEntities) {
            const object = entity.getComponent(Object3D);

            if(object.userData.shouldDisplay !== undefined)
            {
                if(object.userData.shouldDisplay)
                {
                    this.scene.add(object);
                }
                else
                this.scene.remove(object);
            }
            else
                this.scene.add(object);
        }
        // render
        this.renderer.render(this.scene, game.camera);
    }
}
