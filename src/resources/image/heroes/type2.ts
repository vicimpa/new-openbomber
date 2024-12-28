import DATA from "./type2.json";
import SPRITE from "./type2.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');