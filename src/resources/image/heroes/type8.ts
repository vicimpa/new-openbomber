import DATA from "./type8.json";
import SPRITE from "./type8.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');