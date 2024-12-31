import { Container, ContainerOptions, Rectangle, Sprite, Texture, Ticker } from "pixi.js";
import { Vec2, vec2 } from "@vicimpa/lib-vec2";

import { app } from "$modules/app";
import { awaitAllTasks } from "$library/loaders";
import { clamp } from "@vicimpa/math";
import { explode } from "$resources/image";
import { from } from "$library/array";

const maxframe = explode.normal.length - 1;
const helperSprite = new Sprite();

const explodeNormal = app.then(async app => {
  await awaitAllTasks();

  return explode.normal.map((texture) => {
    const { source, frame } = app.renderer.generateTexture((
      helperSprite.texture = texture, helperSprite
    ));
    const size = Vec2.fromSize(frame).div(5);

    return from(5, y => (
      from(5, x => (
        new Texture({
          source,
          frame: new Rectangle(
            x * size.x,
            y * size.y,
            size.x,
            size.y
          )
        })
      ))
    ));
  });
});

export type ExplodeOptions = {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  onFire?: (points: Vec2[], explode: Explode) => void;
} & ContainerOptions;

class ExplodeItem extends Sprite {
  private __explodeNormal?: Texture[][][];
  private __now: Vec2;
  private __l: number;
  private __frame = -1;

  get frame() {
    return this.__frame;
  }

  set frame(value: number) {
    const l = this.__l;
    const now = this.__now;
    this.__frame = value;
    this.texture = this.__explodeNormal?.[l > 1 && value < 3 ? 0 : value][now.y][now.x] ?? Texture.EMPTY;
  }

  constructor(
    public cx = 0,
    public cy = 0,
    public last = false
  ) {
    const now = vec2(cx, cy);
    const mult = last ? 2 : 1;

    super({ anchor: .5, x: cx * 32, y: cy * 32 });
    this.__l = now.length();
    this.__now = now.normalize().times(mult).plus(2);
    this.frame = 0;
  }

  onMount(): void {
    explodeNormal.then(sprites => {
      this.__explodeNormal = sprites;
    });
  }
}

export class Explode extends Container {
  private __isFake = false;

  private __main = this.add(ExplodeItem);
  private __time = 0;
  private __speed = .4;
  private __onFire?: () => any;

  constructor(
    {
      top = 1,
      left = 1,
      right = 1,
      bottom = 1,
      onFire = () => { },
      ...other
    }: ExplodeOptions = {}
  ) {
    super(other);

    const append: ExplodeItem[] = [];

    for (let i = 0; i < top; i++)
      append.push(new ExplodeItem(0, -(i + 1), top - 1 == i));

    for (let i = 0; i < left; i++)
      append.push(new ExplodeItem(-(i + 1), 0, left - 1 == i));

    for (let i = 0; i < right; i++)
      append.push(new ExplodeItem((i + 1), 0, right - 1 == i));

    for (let i = 0; i < bottom; i++)
      append.push(new ExplodeItem(0, (i + 1), bottom - 1 == i));

    append.forEach(node => this.addChild(node));

    this.__isFake = !append.length;

    const start = vec2();
    const points = [start, ...append.map(({ cx, cy }) => start.cplus(cx, cy))];
    points.forEach(point => point.times(32).plus(this));
    this.__onFire = () => {
      onFire(points, this);
      delete this.__onFire;
    };
  }

  onMount(): void {
    navigator.vibrate?.(10);
  }

  onTick({ deltaTime }: Ticker): void {
    this.__time += deltaTime * this.__speed;

    if (this.__time > maxframe) {
      this.destroy();
      return;
    }

    let frame = clamp(this.__time | 0, 0, maxframe);

    if (this.__isFake) {
      this.__main.texture = explode.fake[frame];
      return;
    }

    if (frame > 3) this.__onFire?.();

    this.children.forEach((node) => {
      if (node instanceof ExplodeItem)
        node.frame = frame;
    });
  }
}