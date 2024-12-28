import DATA from "./type5.json";
import SPRITE from "./type5.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');