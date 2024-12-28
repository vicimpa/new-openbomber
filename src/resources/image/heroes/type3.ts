import DATA from "./type3.json";
import SPRITE from "./type3.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');