import DATA from "./type7.json";
import SPRITE from "./type7.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');