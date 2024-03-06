import type { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import { IActionData } from "./IActionData";
import type { PassageType } from "../PassageType";

export class TilePlacementData extends IActionData {
   constructor(
      public type: PassageType,
      public to: GridPositionComponent,
      public rotation: number,
      player: string
   ) {
      super();
      this.playerId = player;
   }

}

