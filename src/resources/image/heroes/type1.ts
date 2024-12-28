import DATA from "./type1.json";
import SPRITE from "./type1.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');