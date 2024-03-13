import { System } from "./System";
import type { Entity } from "@/rendering/entities/Entity";
import type { Game } from "@/rendering/game/Game";

import { PLAYER_LEVEL } from "@/rendering/constants";

import { GridComponent } from "@/rendering/components/GridComponent";
import { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import { PlayerComponent } from "@/rendering/components/PlayerComponent";
import { PlayerControllerComponent } from "@/rendering/components/PlayerControllerComponent";
import { PlayerSpriteComponent } from "@/rendering/components/PlayerSpriteComponent";
import type { GridEntity } from "@/rendering/entities/GridEntity";
import { GamePresenter } from "@/rendering/services/GamePresenter";
import { PlayerMove } from "../event/actions/PlayerMove";
import { Direction } from "../components/models/Direction";
import { TempTileMoveAction } from "../event/actions/TempTileMoveAction";
import { PlayerState } from "../components/models/PlayerState";
import { TilePlacementAction } from "../event/actions/TilePlacementAction";
import { TilePlacementData } from "../components/models/ActionData/TilePlacementData";
import { PassageType } from "../components/models/PassageType";

export class PlayerRenderingSystem extends System {
    private _grid: GridEntity | undefined;

    public constructor() {
        super();
    }

    public override addEntity(entity: Entity) {
        if (entity.hasComponent(GridComponent))
            this._grid = entity as GridEntity;
        else
            super.addEntity(entity);
    }

    public removeEntity(entity: Entity) {
        if (entity.hasComponent(GridComponent))
            this._grid = undefined;
        else
            super.removeEntity(entity);
    }

    public appliesTo(entity: Entity): boolean {
        return entity.hasComponents(
            GridPositionComponent,
            PlayerControllerComponent,
            PlayerSpriteComponent,
            PlayerComponent)
            || entity.hasComponent(GridComponent);
    }

    public override async update(dt: number, game: Game) {
        if (!this._grid) return;

        // Select for rendering
        for (const entity of this.filteredEntities) {
            const playerPos = entity.getComponent(GridPositionComponent);
            const actions = entity.getComponent(PlayerControllerComponent);
            const sprite = entity.getComponent(PlayerSpriteComponent);
            const player = entity.getComponent(PlayerComponent);

            switch (player.state) {
                case PlayerState.Await:
                    break;
                case PlayerState.Move:
                    this.createMoveAction(actions, player);
                    break;
                case PlayerState.PlaceTile:
                    this.createPlaceTileAction(actions, player);
                    break;
            }

            const newPos = this._grid.getPositionForTile(playerPos.row, playerPos.col);
            sprite.sprite.position.set(newPos.x, newPos.y, PLAYER_LEVEL);
        }
    }

    private createMoveAction(actions: PlayerControllerComponent, player: PlayerComponent) {
        let createAction = false;
        let direction = Direction.forward;
        if (actions.keys.left) {
            createAction = true;
            direction = Direction.left;
            actions.keys.left = false;
        }
        else if (actions.keys.right) {
            createAction = true;
            direction = Direction.right;
            actions.keys.right = false;
        }
        else if (actions.keys.forward) {
            createAction = true;
            direction = Direction.forward;
            actions.keys.forward = false;
        }
        else if (actions.keys.backward) {
            createAction = true;
            direction = Direction.back;
            actions.keys.backward = false;
        }

        if (!createAction) return;

        GamePresenter.get().doAction(new PlayerMove(
            player.id,
            direction
        ));
    }

    private createPlaceTileAction(actions: PlayerControllerComponent, player: PlayerComponent) {
        // Temp tile is already created
        let createAction = false;
        let direction = Direction.forward;
        if (actions.keys.left) {
            createAction = true;
            direction = Direction.left;
            actions.keys.left = false;
        }
        else if (actions.keys.right) {
            createAction = true;
            direction = Direction.right;
            actions.keys.right = false;
        }
        else if (actions.keys.forward) {
            createAction = true;
            direction = Direction.forward;
            actions.keys.forward = false;
        }
        else if (actions.keys.backward) {
            createAction = true;
            direction = Direction.back;
            actions.keys.backward = false;
        }

        if (actions.keys.enter) {
            console.log("Triggering place tile");
            actions.keys.enter = false;

            GamePresenter.get().doAction(
                new TilePlacementAction( new TilePlacementData(player.id)));
            return;
        }
        if (!createAction) return;

        GamePresenter.get().doAction(new TempTileMoveAction(
            player.id,
            direction
        ), false);
    }
}
