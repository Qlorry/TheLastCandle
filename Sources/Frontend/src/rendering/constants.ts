import { getProportionateHeight } from './util/proportions'

const WIDTH_RATIO = 16;
const HEIGHT_RATIO = 9;
const WORLD_WIDTH = 500;
const WORLD_HEIGHT = getProportionateHeight(WIDTH_RATIO, HEIGHT_RATIO, WORLD_WIDTH);


export {
    WIDTH_RATIO,
    HEIGHT_RATIO,
    WORLD_WIDTH,
    WORLD_HEIGHT,
}