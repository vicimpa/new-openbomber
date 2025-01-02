import { Container, Sprite, Texture, Ticker } from "pixi.js";
import { PI, clamp, cos } from "@vicimpa/math";

import { Vec2 } from "@vicimpa/lib-vec2";

export class Give extends Container {
  private __view: Sprite;

  private __time = 0;
  private __speed = .02;

  constructor(texture: Texture, position: Vec2) {
    super(position.p);

    this.__view = this.add(Sprite, {
      texture,
      anchor: .5
    });
  }

  onTick({ deltaTime }: Ticker): void {
    if (this.__time > 1)
      return this.destroy();

    this.__time += deltaTime * this.__speed;

    let _time = this.__time * 4;
    let rotate = clamp(_time - 1, 0, 2) / 2;
    let fly1 = clamp(_time, 0, 1) ** 3;
    let fly2 = clamp(_time - 3, 0, 1) ** 3;
    let fly = fly1 + fly2;
    let scale = 1 - clamp(_time - 3, 0, 1);

    scale *= 1 - clamp(_time, 0, .3);

    this.__view.alpha = .2 + scale;
    this.__view.scale.y = scale;
    this.__view.scale.x = cos(rotate * PI * 3) * scale;
    this.__view.y = -fly * 32;
  }
}