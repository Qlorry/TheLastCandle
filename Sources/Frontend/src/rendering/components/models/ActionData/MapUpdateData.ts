import type { BoardCellModel } from "../BoardData";
import { IActionData } from "./IActionData";

export class MapUpdateData extends IActionData {
   constructor(
      public map: Array<Array<BoardCellModel>>
   ) {
      super();
   }
}

