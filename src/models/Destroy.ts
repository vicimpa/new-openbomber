import { Container, Sprite, Texture, Ticker } from "pixi.js";
import { Vec2, vec2 } from "@vicimpa/lib-vec2";
import { clamp, random } from "@vicimpa/math";

import { bounce } from "$library/math";
import { from } from "$library/array";

const getPoints = (texture: Texture, dir: Vec2) => {
  return new Set(
    from(30, () => {
      return {
        time: 0,
        speed: .03 + random() * .04,
        x: random() * 16 - 8,
        y: 8,
        scale: random() * .3 + .1,
        dir: dir.cplus(random() * .5 - .25, random() * .1 - .05),
        move: (random() * 64 + 64) * 2,
        up: (random() * 32 + 32),
        object: new Sprite({ texture, anchor: .5 })
      };
    })
  );
};

export class Destroy extends Container {
  private _points: ReturnType<typeof getPoints>;

  constructor(
    texture: Texture,
    position: Vec2,
    dir = vec2(0, 0)
  ) {
    super({ ...position });
    this._points = getPoints(texture, dir);
    this._points.forEach(({ object }) => {
      this.addChild(object);
    });
  }

  onTick({ deltaTime }: Ticker): void {
    if (!this._points?.size) {
      this.destroy();
      return;
    }

    this._points.forEach(point => {
      if (!point.object.parent) return;
      point.object.alpha = 1 - point.time / 2;
      if (point.time > 2) {
        point.object.destroy();
        this._points.delete(point);
        return;
      }

      point.time += deltaTime * point.speed;
      point.object.scale = point.scale * (point.time < 1 ? 1 : clamp(2 - point.time, 0, 1));

      vec2(0, (point.time < 1 ? (bounce(point.time) - 1) : 0) * point.up)
        .plus(point)
        .plus(
          point.dir
            .ctimes(1, .4)
            .times(point.time * point.move)
        )
        .round()
        .toObject(point.object);
    });
  }
}