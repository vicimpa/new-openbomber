import DATA from "./type6.json";
import SPRITE from "./type6.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');