import { Assets, Rectangle, Texture } from "pixi.js";

import DATA from "./ruines.json";
import SPRITE from "./ruines.png";

const texture = await Assets.load<Texture>(SPRITE);

export default DATA.frames.map(({ frame }) => {
  return new Texture({
    source: texture.source,
    frame: new Rectangle(frame.x, frame.y, frame.w, frame.h)
  });
});