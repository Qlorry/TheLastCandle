import { GRID } from "../constants";

export class GridComponent {
    public blockSize: number = GRID.BLOCK_SIZE;;
    public rows: number = GRID.ROWS;
    public cols: number = GRID.COLS;
    public width: number = GRID.WIDTH;
    public height: number = GRID.HEIGHT;
    public lineWidth: number = GRID.LINE_WIDTH;
}