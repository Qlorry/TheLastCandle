import type { PlayerComponent } from "@/rendering/components/PlayerComponent";
import type { PassageComponent } from "../PassageComponent";
import type { IActionData } from "./ActionData/IActionData";
import type { PlayerState } from "./PlayerState";

export interface BoardCell {
    passage?: PassageComponent;
    player?: string;
    hasKey: boolean;
    //public Monster? monster { get; set; }
}

export interface BoardData extends IActionData {
    map: Array<Array<BoardCell>>;
    players: Map<string, PlayerComponent>;
    width: number;
    height: number;
    currentGameState: PlayerState;
    nextPassages: Array<PassageComponent>;
    usedPassages: Array<PassageComponent>;
}