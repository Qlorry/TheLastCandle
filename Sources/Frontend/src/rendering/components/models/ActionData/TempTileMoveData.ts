import type { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import { IActionData } from "./IActionData";

export class TempTileMoveData extends IActionData {
    constructor(
        public to: GridPositionComponent,
        player: string
    ) {
        super();
        this.playerId = player;
    }
}
