import { Container, Sprite, Texture } from "pixi.js";
import { Vec2, vec2 } from "@vicimpa/lib-vec2";

import { circle2square } from "$library/collides";
import { max } from "@vicimpa/math";
import { nextTick } from "$library/utils";
import { world } from "$resources/image";

export type Tile = (keyof typeof world) | '';
export type HashVec2 = `${number}:${number}`;

export class World extends Container {
  #data = new Map<HashVec2, Tile>();
  #tick = nextTick(() => { });
  #hasChange = false;
  #cache = new Map<HashVec2, Sprite | null>();
  #width = 0;
  #height = 0;

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  constructor(data: Tile[][]) {
    super();
    this.#width = 0;
    this.#height = data.length;

    data.forEach((row, y) => {
      this.#width = max(this.#width, row.length);
      row.forEach((cell, x) => {
        this.setTile(vec2(x, y), cell);
      });
    });

    for (let x = 0; x < this.#width; x++) {
      this.setTile(vec2(x, -1), 'wall');
      this.setTile(vec2(x, this.#height), 'wall');
    }

    for (let y = -1; y <= this.#height; y++) {
      this.setTile(vec2(-1, y), 'wall');
      this.setTile(vec2(this.#width, y), 'wall');
    }

    this.cacheAsTexture(true);
  }

  onUnmount(): void {
    this.#tick();
  }

  update() {
    this.#cache.forEach((sprite, hash) => {
      if (!this.#data.has(hash)) {
        sprite?.destroy();
        this.#hasChange = true;
      }
    });

    this.#data.forEach((tile, hash) => {
      const vec = Vec2.fromHash(hash);
      const texture = tile === '' ? Texture.EMPTY : world[tile];
      const sprite = this.#cache.get(hash) ?? (
        this.#hasChange = true,
        this.#cache.set(hash, this.add(Sprite, {
          texture,
          x: vec.x * 32 - 16,
          y: vec.y * 32 - 16,
        })),
        this.#cache.get(hash)!
      );

      if (sprite.texture !== texture) {
        this.#hasChange = true;
        sprite.texture = texture;
      }
    });
  }

  quieUpdate() {
    this.#tick();
    this.#tick = nextTick(() => {
      this.update();
      if (!this.#hasChange) return;
      this.#hasChange = false;
      this.updateCacheTexture();
    });
  }

  getTile(vec: Vec2) {
    return this.#data.get(vec.hash) ?? '';
  }

  delTile(vec: Vec2) {
    if (this.#data.delete(vec.hash))
      this.quieUpdate();
  }

  setTile(vec: Vec2, tile: Tile) {
    if (this.#data.get(vec.hash) !== tile)
      this.quieUpdate();
    this.#data.set(vec.hash, tile);
  }

  clearTile() {
    this.#data.clear();
    this.quieUpdate();
  }

  getCorrect(pos: Vec2) {
    const correct = vec2();

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const tpos = pos.cround().plus(x, y);
        const tile = this.getTile(tpos);
        if (!tile || tile === 'grass' || tile === 'grass2')
          continue;
        const cor = circle2square(pos, .25, tpos, 1);
        correct.plus(cor);
      }
    }

    return correct.times(32);
  }
}