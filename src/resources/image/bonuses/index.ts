import DATA from "./bonuses.json";
import SPRITE from "./bonuses.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');