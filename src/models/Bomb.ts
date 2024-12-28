import { Container, ContainerOptions, Ticker } from "pixi.js";

import { TagAnimation } from "$core/TagAnimation";
import { bombs } from "$resources/image";

export type BombOptions = {
  type?: keyof typeof bombs;
  time?: number;
  onDelete?: () => void;
} & ContainerOptions;

export class Bomb extends Container {
  time = -1;
  ignore = true;
  #hasRun = false;
  #onDelete: () => void;

  constructor(
    {
      type = 'normal',
      time = -1,
      onDelete = () => { },
      ...other
    }: BombOptions = {}
  ) {
    super(other);
    this.time = time;
    this.#hasRun = time >= 0;
    this.#onDelete = onDelete;

    this.add(TagAnimation, bombs, {
      animation: type,
      anchor: .5,
      speed: .1,
      y: -3
    });
  }

  onTick(ticker: Ticker): void {
    if (!this.#hasRun) return;
    this.time -= ticker.deltaMS;
    if (this.time < 0) {
      this.#onDelete();
      this.destroy();
    }
  }
}