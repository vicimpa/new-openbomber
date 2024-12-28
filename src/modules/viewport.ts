import { Container, Ticker } from "pixi.js";
import { Vec2, vec2 } from "@vicimpa/lib-vec2";

import { app } from "./app";
import { clamp } from "@vicimpa/math";
import { vec2filter } from "$library/filters";

export class Viewport extends Container {
  #center = vec2();
  #scale = vec2(1);

  center = vec2(0, 0);
  radius = 256;
  focus?: Container;

  shakes = new Set<{ time: number, amp: number; }>();
  filterAmp = vec2filter(3);

  get needScale() {
    const size = Vec2.fromSize(app.canvas);
    return vec2((size.min() / this.radius));
  }

  constructor() {
    super({ isRenderGroup: true });
    this.needScale.toObject(this.#scale);
  }

  shake(target: Container, pos = vec2()) {
    const dis = vec2(target.toLocal(pos, scene)).distance(this.center);
    const sdis = clamp(dis, 24, Infinity) ** 2;
    this.shakes.add({
      time: 0,
      amp: 256 / sdis * 128
    });
    return target;
  }

  onTick({ deltaTime }: Ticker) {
    this.shakes.forEach((item) => {
      item.time += deltaTime * .3;
    });

    this.shakes.forEach((item) => {
      if (item.time > 1)
        this.shakes.delete(item);
    });

    const amp = this.filterAmp(
      [...this.shakes]
        .reduce((acc, item) => {
          return acc.plus(
            Vec2.fromRandom()
              .times(item.amp)
              .times((-(((item.time - .5) * 2) ** 2) + 1))
          );
        }, vec2())
    ).times(this.scale);

    if (this.focus) {
      if (!this.focus.parent) {
        this.focus = undefined;
      } else
        this.center.set(
          this.focus.toLocal(vec2(), scene)
        );
    }

    this.center
      .ctimes(1)
      .minus(this.#center)
      .times(deltaTime * .05)
      .plus(this.#center)
      .toObject(this.#center);

    this.needScale
      .minus(this.#scale)
      .times(deltaTime * .04)
      .plus(this.#scale)
      .toObject(this.#scale);

    Vec2.fromSize(app.canvas).times(.5).plus(amp).toObject(this);
    this.#scale.toObject(this.scale);
    this.#center.toObject(scene);
  }
}

export const viewport = app.stage.add(Viewport);
export const scene = viewport.add(Container);