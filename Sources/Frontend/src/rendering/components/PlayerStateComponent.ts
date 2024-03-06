export enum PlayerState {
    Await,
    Move,
    PlaceTile
}

export class PlayerStateComponent {
    constructor(public state: PlayerState) { }
}