import type { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import { IActionData } from "./IActionData";

export class PlayerMoveData extends IActionData {
   constructor(
      public from: GridPositionComponent,
      public to: GridPositionComponent,
      player: string
   ) {
      super();
      this.playerId = player;
   }

}

