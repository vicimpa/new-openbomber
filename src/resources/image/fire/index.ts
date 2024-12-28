import DATA from "./fire.json";
import SPRITE from "./fire.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');