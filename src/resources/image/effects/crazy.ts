import DATA from "./crazy.json";
import SPRITE from "./crazy.png";
import { loadSpritesheetArray } from "$library/loaders";
export default await loadSpritesheetArray(DATA, SPRITE);