export enum EventStatus {
    Commited,
    Rejected
}

export interface IData {
    id?: string;
    sessionId: string;
}

export class IActionData {
    public id = undefined;
    public sessionId = "";
    public playerId: string = "";
}
