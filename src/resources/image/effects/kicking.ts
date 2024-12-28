import DATA from "./kicking.json";
import SPRITE from "./kicking.png";
import { loadSpritesheetArray } from "$library/loaders";
export default await loadSpritesheetArray(DATA, SPRITE);