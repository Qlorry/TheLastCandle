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
  private systems: Array<System>;
  private entities: Array<Entity>;

  constructor(canvas: HTMLCanvasElement) {
    this.entities = [ // Add more entities here.
      new LoadingEntity(),
    ];

    const renderSystem = new RenderSystem(canvas);
    
    let resizingEl = canvas.parentElement;
    if(resizingEl == null)
      resizingEl = canvas;
    const game = new Game(renderSystem.renderer, undefined, resizingEl);

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

    (async () => { await GamePresenter.get().setup(game, "9a12a34c-993a-4463-8167-d65e5ea45848"); })();

    game.start();
  }
}
