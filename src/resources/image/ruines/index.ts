import DATA from "./ruines.json";
import SPRITE from "./ruines.png";
import { loadSpritesheetFromArra } from "$library/loaders";
export default loadSpritesheetFromArra(DATA, SPRITE);