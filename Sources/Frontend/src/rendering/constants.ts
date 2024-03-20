import { getProportionateHeight } from './util/proportions'

const PLAYER_LEVEL = 2;
const TILE_LEVEL = 1;


export {
    PLAYER_LEVEL,
    TILE_LEVEL,
}

export namespace WORLD {
    export const WIDTH_RATIO = 16;
    export const HEIGHT_RATIO = (WIDTH_RATIO/100) * 80;
    export const WIDTH = 500;
    export const HEIGHT = getProportionateHeight(WIDTH_RATIO, HEIGHT_RATIO, WIDTH);
}
export namespace GRID {
    export const COLS = 6;
    export const ROWS = 6;
    export const LINE_WIDTH = 2;
    export const MARGINS = (WORLD.WIDTH / 100) * 10; // 10%
    export const WIDTH = WORLD.WIDTH - 2 * GRID.MARGINS;
    export const HEIGHT = WORLD.HEIGHT;
    export const BLOCK_SIZE = (WIDTH - LINE_WIDTH * (ROWS + 1)) / ROWS;
}