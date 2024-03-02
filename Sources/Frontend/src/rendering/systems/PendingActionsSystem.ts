import { System } from './System';
import { Entity } from '@/rendering/entities/Entity';
import { Game } from '@/rendering/game/Game';

import type { IAction } from '../event/actions/IAction';
import { GamePresenter } from '../services/GamePresenter';
import { EventStatus } from '../components/models/ActionData/IActionData';

class Storage {
    private static instance: Storage;
    public pendingActions: Array<IAction> = []
    public doLastTime: Array<IAction> = []

    static get() {
        if (!Storage.instance) {
            Storage.instance = new Storage();
        }

        return Storage.instance;
    }
}


export class PendingActionsSystem extends System {
    public constructor(private apply: boolean) {
        super();
    }

    public static Add(action: IAction) {
        Storage.get().pendingActions.push(action);
    }

    public static Remove(actionId: string, status: EventStatus): boolean {
        const pending = Storage.get();

        const result = pending.pendingActions.findIndex((action: IAction) => {
            return action.getData().id == actionId;
        })

        if (result === -1) return false;

        const selected = pending.pendingActions.splice(result, 1);

        if (status == EventStatus.Rejected) return true;

        if (status == EventStatus.Commited) {
            pending.doLastTime.push(...selected);
        }
        return true;
    }

    public appliesTo(entity: Entity): boolean {
        return false;
    }

    public override async update(dt: number, game: Game) {
        const pending = Storage.get();
        const presenter = GamePresenter.get();
        if (this.apply) {
            for (let action of pending.doLastTime) {
                presenter.repeatAction(action);
            }
        }

        pending.doLastTime = [];
        for (let action of pending.pendingActions) {
            if (this.apply) {
                presenter.repeatAction(action);
            }
            else {
                presenter.undoAction(action);
            }
        }
    }
}
