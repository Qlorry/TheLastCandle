import { GridPositionComponent } from "@/rendering/components/GridPosiotionComponent";
import { IActionData } from "./IActionData";
import { PassageType } from "../PassageType";

export class TilePlacementData extends IActionData {
   constructor(
      player: string,
      public type: PassageType = PassageType.FourWay,
      public to: GridPositionComponent = new GridPositionComponent(0,0),
      public rotation: number = 0
   ) {
      super();
      this.playerId = player;
   }
}