import DATA from "./shield.json";
import SPRITE from "./shield.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');