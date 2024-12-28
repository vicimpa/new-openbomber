import DATA from "./bombs.json";
import SPRITE from "./bombs.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');