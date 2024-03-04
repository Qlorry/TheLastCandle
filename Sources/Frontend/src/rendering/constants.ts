import { getProportionateHeight } from './util/proportions'

const WIDTH_RATIO = 16;
const HEIGHT_RATIO = 9;
const WORLD_WIDTH = 500;
const WORLD_HEIGHT = getProportionateHeight(WIDTH_RATIO, HEIGHT_RATIO, WORLD_WIDTH);
const PLAYER_LEVEL = 2;
const TILE_LEVEL = 1;

const GRID_WIDTH = 6;
const GRID_HEIGHT = 6;

export {
    WIDTH_RATIO,
    HEIGHT_RATIO,
    WORLD_WIDTH,
    WORLD_HEIGHT,

    PLAYER_LEVEL,
    TILE_LEVEL,

    GRID_WIDTH,
    GRID_HEIGHT,
}