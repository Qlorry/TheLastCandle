import { Game } from './game/Game'
import type { System } from './systems/System';
import type { Entity } from './entities/Entity';

import { RenderSystem } from './systems/RenderSystem';
import { GridRenderingSystem } from './systems/GridRenderingSystem';
import { LoadingEntity } from './entities/LoadingEntity';
import { LoadingSystem } from './systems/LoadingSystem';
import { PlayerRenderingSystem } from './systems/PlayerRenderSystem';
import { GamePresenter } from './services/GamePresenter';
import { TileRenderingSystem } from './systems/TileRenderSystem';
import { PendingActionsSystem } from './systems/PendingActionsSystem';

export class GameBoard {
  private canvas: HTMLCanvasElement;
  private systems: Array<System>;
  private entities: Array<Entity>;

  constructor(canvas: HTMLCanvasElement) {
    this.entities = [ // Add more entities here.
      new LoadingEntity(),
    ];

    this.canvas = canvas;
    const renderSystem = new RenderSystem(canvas);
    const game = new Game(renderSystem.renderer, undefined);

    this.systems = [ // Add more systems here.
      new PendingActionsSystem(true),
      new GridRenderingSystem(),
      new TileRenderingSystem(),
      new PlayerRenderingSystem(),
      new LoadingSystem(),
      renderSystem,
      new PendingActionsSystem(false)
    ];

    for (const system of this.systems) {
      game.addSystem(system);
    }

    for (const entity of this.entities) {
      game.addEntity(entity)
    }

    (async () => { await GamePresenter.get().setup(game, "0399c91e-653a-47c9-af69-b50575d3b1a2"); })();

    game.start();
  }
}
