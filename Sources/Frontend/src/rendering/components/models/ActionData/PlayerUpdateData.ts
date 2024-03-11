import { IActionData } from "./IActionData";
import type { PlayerComponent } from "../../PlayerComponent";

export class PlayerUpdateData extends IActionData {
   constructor(
      public player: PlayerComponent
   ) {
      super();
      this.playerId = player.id;
   }

}

