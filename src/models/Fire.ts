import { Container, Sprite, Texture, Ticker } from "pixi.js";

import { Animation } from "$core/Animation";
import { Vec2 } from "@vicimpa/lib-vec2";
import { fire } from "$resources/image";

export class Fire extends Container {
  private __container: Container;
  private __sprite: Sprite;
  private __view: Animation;

  private __time = 0;
  private __speed = .2;

  constructor(
    texture: Texture,
    position: Vec2,
    flipX = false
  ) {
    super(position.p);
    this.__container = this.add(Container);

    this.__sprite = this.__container.add(Sprite, {
      texture: texture,
      anchor: .5,
      tint: 0x991111,
      scale: { x: flipX ? -1 : 1, y: 1 }
    });

    this.__view = this.__container.add(Animation, fire.base, {
      anchor: .5,
      scale: 1.25,
      y: -4,
      speed: this.__speed,
      zIndex: 1
    });
  }

  onTick({ deltaTime }: Ticker): void {
    if (this.__sprite.alpha <= 0 && !this.__view.speed)
      this.destroy();

    this.__time += deltaTime * .1;

    this.__sprite.y = -(this.__time ** 2);
    this.__sprite.alpha -= deltaTime * .02;
    if (this.__view.frame >= this.__view.textures.length - 1) {
      this.__view.speed = 0;
      this.__view.texture = Texture.EMPTY;
    }
  }
}