import DATA from "./world.json";
import SPRITE from "./world.png";
import { loadSpritesheet } from "$library/loaders";

const world = await loadSpritesheet(DATA, SPRITE);
export type WorldTile = keyof typeof world;
export default world;