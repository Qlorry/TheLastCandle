import * as THREE from 'three';

import * as CONST from '@/rendering/constants';
import * as PROPORTIONS from '@/rendering/util/proportions';

import { Entity } from '@/rendering/entities/Entity';
import { EntityAdded } from '@/rendering/event/EntityAdded';
import { EntityRemoved } from '@/rendering/event/EntityRemoved';
import { EventBus } from '@/rendering/event/EventBus';
import { System } from '@/rendering/systems/System';


export class Game {
    private static readonly TIME_STEP = 1 / 144;
    private static readonly MAX_UPDATES_PER_FRAME = 10;
    private static readonly FPS_DECAY = 0.1;
    private static readonly FPS_CAP = 60; // -1 === uncapped

    public readonly events = new EventBus();
    public readonly camera: THREE.OrthographicCamera;
    public fps = 1 / Game.TIME_STEP;

    private readonly entities: Entity[] = [];
    private readonly systems: System[] = [];
    private animationFrameId: number | null = null;
    private running = false;
    private lastTimestamp = 0;

    public constructor(
        private readonly renderer: THREE.WebGLRenderer,
        public readonly io: any
    ) {
        const camera = new THREE.OrthographicCamera(0, CONST.WORLD_WIDTH, CONST.WORLD_HEIGHT, 0, 1, 1000);
        camera.position.z = 100

        addEventListener('visibilitychange', this.onVisibilityChange.bind(this));
        addEventListener('resize', this.onResize.bind(this));

        this.camera = camera;
        this.onResize()
    }

    public addSystem(system: System): void {
        this.systems.push(system);
        system.initialize(this);
    }

    public addEntity(entity: Entity): void {
        this.entities.push(entity);
        this.events.emit(new EntityAdded(entity));
    }

    public removeEntity(entity: Entity): void {
        const index = this.entities.indexOf(entity);

        if (index >= 0) {
            this.entities.splice(index, 1);
            this.events.emit(new EntityRemoved(entity));
        }
    }

    public start(): void {
        if (!this.running) {
            this.running = true;

            this.animationFrameId = requestAnimationFrame(this.update.bind(this));

            for (const system of this.systems) {
                const filteredEntities = this.entities.filter(system.appliesTo);
                for (const entity of filteredEntities) {
                    system.addEntity(entity);
                }
            }

            this.events.register(EntityRemoved, (event: EntityRemoved) => {
                for (const system of this.systems) {
                    if (system.appliesTo(event.entity)) {
                        system.removeEntity(event.entity)
                    }
                }
            });

            this.events.register(EntityAdded, (event: EntityAdded) => {
                for (const system of this.systems) {
                    if (system.appliesTo(event.entity)) {
                        system.addEntity(event.entity)
                    }
                }
            });
        }
    }

    public stop(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        this.fps = 1 / Game.TIME_STEP;
        this.lastTimestamp = 0;
        this.running = false;
    }

    public async update(currentTimestamp: number) {
        if (Game.FPS_CAP > 0 && currentTimestamp < this.lastTimestamp + 1 / Game.FPS_CAP * 1000) {
            this.animationFrameId = requestAnimationFrame(this.update.bind(this));
            return;
        }

        let updates = 0;
        let dt: number;

        if (this.lastTimestamp === 0) {
            // First frame, there's no delta time
            dt = Game.TIME_STEP;
            this.lastTimestamp = currentTimestamp;
        } else {
            dt = (currentTimestamp - this.lastTimestamp) / 1000;
        }

        if (dt < Game.TIME_STEP) {
            this.animationFrameId = requestAnimationFrame(this.update.bind(this));
            return;
        }

        this.fps = Game.FPS_DECAY * (1 / dt) + (1 - Game.FPS_DECAY) * this.fps;
        
        while (this.running && dt >= Game.TIME_STEP) {

            for (const system of this.systems) {
                await system.update(Game.TIME_STEP, this);
            }

            dt -= Game.TIME_STEP;
            updates++;

            if (updates >= Game.MAX_UPDATES_PER_FRAME) {
                console.error('Update loop can\'t keep up!');
                this.lastTimestamp = 0;
                break;
            }
        }

        this.lastTimestamp = currentTimestamp;

        if (this.running) {
            this.animationFrameId = requestAnimationFrame(this.update.bind(this));
        }
    }

    private onResize(): void {
        const { innerHeight, innerWidth } = window;

        this.renderer.setSize(innerWidth, innerHeight);
        // lets use 16:9 ratio as default and scale of WORLD_WIDTH (it is const)
        // this logic should allways display WORLD_WIDTH and WORLD_HEIGHT 
        // AAAND it is not really working)))))
        // hours spent: 2
        const displayProportionateHeight = PROPORTIONS.getProportionateHeight(innerWidth, innerHeight, CONST.WORLD_WIDTH);
        const heightDiff = displayProportionateHeight - CONST.WORLD_HEIGHT;

        if (heightDiff == 0) {
            this.camera.top = CONST.WORLD_HEIGHT;
            this.camera.right = CONST.WORLD_WIDTH;
            this.camera.left = 0;
            this.camera.bottom = 0;
        }
        else if (heightDiff > 0) {
            this.camera.top = CONST.WORLD_HEIGHT + heightDiff / 2;
            this.camera.bottom = -heightDiff / 2;
            this.camera.right = CONST.WORLD_WIDTH;
            this.camera.left = 0;
        }
        else if (heightDiff < 0) {
            const widthDiff = PROPORTIONS.getProportionateWidth(16, 9, -heightDiff);

            this.camera.right = CONST.WORLD_WIDTH + widthDiff / 2;
            this.camera.left = -widthDiff / 2;
            this.camera.top = CONST.WORLD_HEIGHT;
            this.camera.bottom = 0;
        }

        this.camera.updateProjectionMatrix()
    }

    private onVisibilityChange(): void {
        if (document.hidden) {
            console.warn('Stopping game due to visibility change');
            this.stop();
        } else {
            console.info('Starting game after visibility change');
            this.start();
        }
    }
}
