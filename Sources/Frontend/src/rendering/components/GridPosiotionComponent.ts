import type { GridComponent } from "./GridComponent";

export class GridPositionComponent {
    public constructor(
        public row: number,
        public col: number,
        public parentGrid: GridComponent
    ) {
    }
}