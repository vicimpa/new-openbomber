import DATA from "./type4.json";
import SPRITE from "./type4.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');