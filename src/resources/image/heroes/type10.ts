import DATA from "./type10.json";
import SPRITE from "./type10.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');