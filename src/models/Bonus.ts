import { Container, ContainerOptions, Sprite, Texture, Ticker } from "pixi.js";
import { assign, keys } from "$library/object";
import { random, round, sin } from "@vicimpa/math";

import { Animation } from "$core/Animation";
import { bonuses } from "$resources/image";
import { bounce } from "$library/math";
import { from } from "$library/array";

const { blink, ...bonus } = bonuses;
const blinkFrames = [
  ...bonuses.blink,
  ...from(5, Texture.EMPTY)
];

export type BonusType = keyof typeof bonus;

export type BonusOptions = {
  type?: BonusType;
} & ContainerOptions;

export class Bonus extends Container {
  type!: BonusType;
  #type?: BonusType;

  #body: Container;
  view: Sprite;
  blink: Animation;

  #time = 0;
  #speed = 0;

  constructor({
    type = keys(bonus)[0],
    ...other
  }: BonusOptions = {}) {
    super(other);
    assign(this, { type });
    this.#body = this.add(Container);
    this.view = this.#body.add(Sprite, {
      anchor: .5
    });
    this.blink = this.#body.add(Animation, blinkFrames, {
      anchor: .5,
      afterEmpty: 5
    });
  }

  onTick({ deltaTime }: Ticker): void {
    if (this.#type !== this.type) {
      this.#time = 0;
      this.#type = this.type;
      this.#speed = .05 + random() * .2;
      this.blink.speed = .05 + random() * .2;
    }

    this.#time += deltaTime;
    this.view.texture = bonus[this.#type][0];

    var _btime = this.#time * .03;
    var _stime = this.#time * .12;
    var _sin = sin(this.#time * this.#speed);
    var _bounce = _btime < 1 ? bounce(_btime) : 1;

    this.#body.scale = _stime < 1 ? _stime : 1;
    this.#body.y = round(_sin * _bounce - (1 - _bounce) * 24);
  }
}