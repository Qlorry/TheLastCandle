export class GridComponent {
    public  blockSize: number;
    public constructor(
        public rows: number,
        public cols: number,
        public width: number,
        public height: number,
        public lineWidth: number = 2
    ) {
        this.blockSize = (width - this.lineWidth * (rows + 1)) / rows;
    }
}