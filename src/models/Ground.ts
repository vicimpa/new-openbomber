import { Container, ContainerOptions, Sprite, Ticker, TilingSprite } from "pixi.js";

import { Vec2 } from "@vicimpa/lib-vec2";
import { app } from "$modules/app";
import { generatePerlinNoise } from "@vicimpa/perlin-noise";
import { world } from "$resources/image";

export type GroundOptions = {
  width?: number;
  height?: number;
  seed?: number;
} & ContainerOptions;

const generateBack = (width = 64, height = 64, seed = 1) => {
  const helper = new Container();
  const noise = generatePerlinNoise(width, height, { seed });
  helper.width = width * 32;
  helper.height = height * 32;

  noise.forEach((value, index) => {
    var x = index % width, y = index / width | 0;
    helper.add(Sprite, {
      x: x * 32,
      y: y * 32,
      anchor: .5,
      texture: value > .7 ? world.grass2 : world.grass
    });
  });
  const texture = app.renderer.generateTexture(helper);
  helper.destroy();
  return texture;
};

export class Ground extends Container {
  private __view: TilingSprite = this.addChild(new TilingSprite());

  constructor({
    width = 64,
    height = 64,
    seed = 1,
    ...other
  }: GroundOptions = {}) {
    super(other);
    this.__view.texture = generateBack(width, height, seed);
  }

  onTick(_: Ticker): void {
    const size = Vec2.fromSize(app.canvas);
    const start = this.toLocal(size.times(-1));
    const end = this.toLocal(size.times(-1));
    this.__view.x = start.x;
    this.__view.y = start.y;
    this.__view.tilePosition.x = -start.x - 16;
    this.__view.tilePosition.y = -start.y - 16;
    this.__view.width = end.x - start.x;
    this.__view.height = end.y - start.y;
  }
}