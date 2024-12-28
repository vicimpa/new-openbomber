import DATA from "./dust.json";
import SPRITE from "./dust.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');