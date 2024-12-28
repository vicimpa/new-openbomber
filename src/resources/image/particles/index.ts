import { Assets, Texture } from "pixi.js";

import smokeSprite from "./smoke.png";

export const smoke = await Assets.load<Texture>(smokeSprite);