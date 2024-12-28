import DATA from "./explode.json";
import SPRITE from "./explode.png";
import { loadSpritesheetSplited } from "$library/loaders";
export default await loadSpritesheetSplited(DATA, SPRITE, ':');