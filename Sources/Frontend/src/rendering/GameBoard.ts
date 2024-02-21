import * as THREE from 'three';
import { Game } from './game/Game'
import { RenderSystem } from './systems/RenderSystem';
import { GridRenderingSystem } from './systems/GridRenderingSystem';
import type { System } from './systems/System';
import type { Entity } from './entities/Entity';
import { ExampleEntity } from './entities/ExampleEntity';
import { ExampleSystem } from './systems/ExampleSystem';
import { GridEntity } from './entities/GridEntity';
import { WORLD_WIDTH } from './constants';

export class GameBoard {
  private canvas: HTMLCanvasElement;
  private systems: Array<System>;
  private entities: Array<Entity>;

  constructor(canvas: HTMLCanvasElement) {
    this.systems = [ // Add more systems here.
      new GridRenderingSystem(),
    ];

    this.entities = [ // Add more entities here.
      new ExampleEntity(),
      // TODO: move to consts (6/12 is screen proportion for this element, 10 tiles width)
      new GridEntity(6 * WORLD_WIDTH / 12, 6)
    ];

    this.canvas = canvas;
    const renderSystem = new RenderSystem(canvas);
    const game = new Game(renderSystem.renderer, undefined);

    for (const system of this.systems) {
      game.addSystem(system);
    }

    for (const entity of this.entities) {
      game.addEntity(entity)
    }

    game.addSystem(renderSystem);

    game.start();
  }
}
