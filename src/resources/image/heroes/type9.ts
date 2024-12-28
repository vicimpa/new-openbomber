import DATA from "./type9.json";
import SPRITE from "./type9.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');