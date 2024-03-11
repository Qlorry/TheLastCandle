import { System } from './System';
import { Entity } from '@/rendering/entities/Entity';
import { Game } from '@/rendering/game/Game';

import type { IAction } from '../event/actions/IAction';
import { GamePresenter } from '../services/GamePresenter';
import { EventStatus } from '../components/models/ActionData/IActionData';

class Storage {
    private static instance: Storage;
    public pendingActions: Array<IAction> = []
    public doLastTime: Array<{action: IAction, status: EventStatus}> = []

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

        if (status == EventStatus.Commited) {
            pending.doLastTime.push(...selected.map(el => {return {action: el, status: status};}));
        }
        return true;
    }

    public appliesTo(entity: Entity): boolean {
        return false;
    }

    public override async update(dt: number, game: Game) {
        const pending = Storage.get();
        const presenter = GamePresenter.get();

        // Last time -- validated by server 
        for (let action of pending.doLastTime) {
            // Runs in aplly mode and event was Commited => can repeat last time(no undo)
            if (this.apply && action.status == EventStatus.Commited) {
                presenter.repeatAction(action.action, true);
            }
            // Runs in undo mode and event was Rejected => must undo last time(clean up)
            else if (!this.apply && action.status == EventStatus.Rejected){
                presenter.undoAction(action.action, true);
            }
        }

        // Runs in undo mode => all last apply and undo were done by now
        if(!this.apply) pending.doLastTime = [];
  
        // Aplly or undo other actions
        if (this.apply) {
            for (let action of pending.pendingActions) {
                presenter.repeatAction(action, false);
            }
        }
        else {
            for (let action of pending.pendingActions.reverse()) {
                presenter.undoAction(action, false);
            }
            pending.pendingActions.reverse();
        }
    }
}
