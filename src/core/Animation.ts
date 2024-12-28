import { Sprite, SpriteOptions, Texture, Ticker } from "pixi.js";

import { assign } from "$library/object";
import { floor } from "@vicimpa/math";

export type AnimationOptions = {
  speed?: number;
  start?: number;
  afterEmpty?: number;
} & Omit<SpriteOptions, 'texture'>;

export class Animation extends Sprite {
  speed!: number;
  start!: number;
  frame!: number;
  afterEmpty!: number;

  #time: number;
  #start: number;

  constructor(
    public textures: Texture[],
    {
      speed = 1,
      start = 0,
      afterEmpty = 0,
      ...other
    }: AnimationOptions = {}
  ) {
    super(other);
    this.#time = 0;
    this.#start = 0;
    assign(this, { speed, start, afterEmpty, frame: 0 });
  }

  onTick({ deltaTime }: Ticker): void {
    if (!this.visible) {
      this.#time = 0;
      return;
    }

    this.#time += deltaTime * this.speed;

    if (this.#start !== this.start) {
      this.#start = this.start;
      this.#time = this.#start;
    }

    this.frame = this.textures ? floor(this.#time) % (this.textures.length + this.afterEmpty) : 0;
    this.texture = this.textures?.[this.frame] ?? Texture.EMPTY;
  }
}