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
import { PlayerEntity } from './entities/PlayerEntity';
import { GridPositionComponent } from './components/GridPosiotionComponent';
import { PlayerRenderingSystem } from './systems/PlayerRenderSystem';
import { GridComponent } from './components/GridComponent';
import { GamePresenter } from './services/GamePresenter';

export class GameBoard {
  private canvas: HTMLCanvasElement;
  private systems: Array<System>;
  private entities: Array<Entity>;

  constructor(canvas: HTMLCanvasElement) {    
    this.systems = [ // Add more systems here.
      new GridRenderingSystem(),
      new PlayerRenderingSystem(),
      new LoadingSystem()
    ];

    this.entities = [ // Add more entities here.
      new LoadingEntity(),
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

    GamePresenter.setup(game);
    game.start();
  }
}
