import { Container, Sprite, Texture } from "pixi.js";
import { Vec2, Vec2Map, vec2 } from "@vicimpa/lib-vec2";

import { cir2sqr } from "$library/collides";
import { max } from "@vicimpa/math";
import { nextTick } from "$library/utils";
import { world } from "$resources/image";

export type Tile = (keyof typeof world) | '';

export class World extends Container {
  #data = new Vec2Map<Tile>();
  #tick = nextTick(() => { });
  #hasChange = false;
  #cache = new Vec2Map<Sprite | null>();
  #width = 0;
  #height = 0;

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }

  isClear() {
    for (const [_, tile] of this.#data) {
      if (tile === 'box')
        return false;
    }

    return true;
  }

  constructor(data: Tile[][]) {
    super();
    this.setData(data);
    this.cacheAsTexture(true);
  }

  setData(data: Tile[][]) {
    this.#width = 0;
    this.#height = data.length;

    data.forEach((row, y) => {
      this.#width = max(this.#width, row.length);
      row.forEach((cell, x) => {
        this.setTile(x, y, cell);
      });
    });

    for (let x = 0; x < this.#width; x++) {
      this.setTile(x, -1, 'wall');
      this.setTile(x, this.#height, 'wall');
    }

    for (let y = -1; y <= this.#height; y++) {
      this.setTile(-1, y, 'wall');
      this.setTile(this.#width, y, 'wall');
    }
  }

  onUnmount(): void {
    this.#tick();
  }

  update() {
    this.#cache.forEach((sprite, vec) => {
      if (!this.#data.has(vec)) {
        sprite?.destroy();
        this.#hasChange = true;
      }
    });

    this.#data.forEach((tile, vec) => {
      const texture = tile === '' ? Texture.EMPTY : world[tile];
      const sprite = this.#cache.get(vec) ?? (
        this.#hasChange = true,
        this.#cache.set(vec, this.add(Sprite, {
          texture,
          x: vec.x * 32 - 16,
          y: vec.y * 32 - 16,
        })),
        this.#cache.get(vec)!
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

  getTile(...args: Parameters<Vec2Map<Tile>['get']>) {
    return this.#data.get(...args) ?? '';
  }

  delTile(...args: Parameters<Vec2Map<Tile>['delete']>) {
    if (this.#data.delete(...args))
      this.quieUpdate();
  }

  setTile(...args: Parameters<Vec2Map<Tile>['set']>) {
    const vec = args.slice(0, -1) as Parameters<Vec2Map<Tile>['get']>;
    const tile = args.at(-1) as Tile;
    if (this.#data.get(...vec) !== tile)
      this.quieUpdate();
    this.#data.set(...args);
  }

  clearTile() {
    this.#data = new Vec2Map<Tile>();
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
        const cor = cir2sqr(pos, .25, tpos, 1);
        cor && correct.plus(cor);
      }
    }

    return correct;
  }
}