import { Container, Sprite } from "pixi.js";
import { VHash, vhash, vparse } from "$library/vhash";
import { entries, values } from "$library/object";

import { TerrainDirs } from "$library/terrain";
import { Vec2 } from "@vicimpa/lib-vec2";
import { randitem } from "$library/array";
import { ruines } from "$resources/terrains";

export class Ruines extends Container {
  #cache = new Map<VHash, Sprite>();
  #data = new Set<VHash>();
  #changes = new Set<VHash>();
  #hasChange = false;
  #raf = requestAnimationFrame(() => { });

  constructor(points: Vec2[] = []) {
    super();
    points.forEach(({ x, y }) => this.set(x, y));
    this.cacheAsTexture(true);
  }

  has(x: number, y: number) {
    return this.#data.has(vhash(x, y));
  }

  set(x: number, y: number) {
    const _hash = vhash(x, y);

    if (!this.#data.has(_hash))
      this.#changes.add(_hash);

    this.#data.add(_hash);
    this.quieUpdate();
  }

  del(x: number, y: number) {
    const _hash = vhash(x, y);
    if (this.#data.has(_hash))
      this.#changes.add(_hash);

    this.#data.delete(_hash);
    this.quieUpdate();
  }

  clear() {
    [...this.#data]
      .forEach(change => {
        this.#changes.add(change);
      });

    this.#data.clear();
    this.quieUpdate();
  }

  update() {
    const quie = new Set<VHash>();
    this.#changes.forEach(change => {
      const { x, y } = vparse(change);
      values(TerrainDirs).forEach(([_x, _y]) => {
        quie.add(vhash(x + _x, y + _y));
      });
    });

    quie.forEach((raw) => {
      const { x, y } = vparse(raw);
      let flags = 0;

      entries(TerrainDirs).forEach(([e, [_x, _y]]) => {
        if (this.#data.has(vhash(x + _x, y + _y)))
          flags = flags | e;
      });

      const textures = ruines
        .filter(e => flags && (flags === e[1] || (flags & 0b11111) == e[1]))
        .map(e => e[0]);


      if (this.#cache.has(raw) && (!flags || !textures.length)) {
        this.#cache.get(raw)?.destroy();
        this.#cache.delete(raw);
        this.#hasChange = true;
        return;
      }

      const texture = randitem(textures);
      const sprite = this.#cache.get(raw) ?? (
        this.#cache.set(raw, (
          this.#hasChange = true,
          this.add(Sprite, {
            x: x * 32,
            y: y * 32,
            texture,
            anchor: .5
          })
        )),
        this.#cache.get(raw)!
      );

      if (texture !== sprite.texture) {
        sprite.texture = texture;
        this.#hasChange = true;
      }
    });
  }

  quieUpdate() {
    cancelAnimationFrame(this.#raf);
    this.#raf = requestAnimationFrame(() => {
      this.update();
      this.#changes.clear();
      if (!this.#hasChange) return;
      this.#hasChange = false;
      this.updateCacheTexture();
    });
  }
}