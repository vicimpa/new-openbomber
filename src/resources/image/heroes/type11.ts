import DATA from "./type11.json";
import SPRITE from "./type11.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');