import * as THREE from 'three';
import { Game } from './game/Game'
import { RenderSystem } from './systems/RenderSystem';
import { GridRenderingSystem } from './systems/GridRenderingSystem';
import type { System } from './systems/System';
import type { Entity } from './entities/Entity';
import { LoadingEntity } from './entities/LoadingEntity';
import { LoadingSystem } from './systems/LoadingSystem';
import { GridEntity } from './entities/GridEntity';
import { WORLD_WIDTH } from './constants';
import { PlayerEntity } from './entities/PLayerEntity';
import { GridPositionComponent } from './components/GridPosiotionComponent';
import { PlayerRenderingSystem } from './systems/PlayerRenderSystem';
import { GridComponent } from './components/GridComponent';

export class GameBoard {
  private canvas: HTMLCanvasElement;
  private systems: Array<System>;
  private entities: Array<Entity>;

  constructor(canvas: HTMLCanvasElement) {
    const mainGrid = new GridEntity(6 * WORLD_WIDTH / 12, 6);

    const playerRendering = new PlayerRenderingSystem();
    playerRendering.setGrid(mainGrid);
    
    this.systems = [ // Add more systems here.
      new GridRenderingSystem(),
      playerRendering,
      new LoadingSystem()
    ];

    this.entities = [ // Add more entities here.
      new LoadingEntity(),
      // TODO: move to consts (6/12 is screen proportion for this element, 6 tiles)
      mainGrid
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

    game.addEntity(new PlayerEntity(game.camera, mainGrid.getComponent(GridComponent)));

    game.start();
  }
}
