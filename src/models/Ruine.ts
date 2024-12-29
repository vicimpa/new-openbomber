import { Container, Sprite } from "pixi.js";
import { Vec2, Vec2Args, Vec2Hash, vec2 } from "@vicimpa/lib-vec2";
import { entries, values } from "$library/object";

import { TerrainDirs } from "$library/terrain";
import { nextTick } from "$library/utils";
import { randitem } from "$library/array";
import { ruines } from "$resources/terrains";

export class Ruines extends Container {
  #cache = new Map<Vec2Hash, Sprite>();
  #data = new Set<Vec2Hash>();
  #changes = new Set<Vec2Hash>();
  #hasChange = false;
  #tick = nextTick(() => { });

  constructor(points: Vec2[] = []) {
    super();
    points.forEach((point) => this.set(point));
    this.cacheAsTexture(true);
  }

  has(...args: Vec2Args) {
    return this.#data.has(vec2(...args).hash);
  }

  set(...args: Vec2Args) {
    const _hash = vec2(...args).hash;

    if (!this.#data.has(_hash))
      this.#changes.add(_hash);

    this.#data.add(_hash);
    this.quieUpdate();
  }

  del(...args: Vec2Args) {
    const _hash = vec2(...args).hash;
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
    const quie = new Set<Vec2Hash>();
    this.#changes.forEach(change => {
      const vec = Vec2.fromHash(change);
      values(TerrainDirs).forEach(([_x, _y]) => {
        quie.add(vec.cplus(_x, _y).hash);
      });
    });

    quie.forEach((raw) => {
      const vec = Vec2.fromHash(raw);
      let flags = 0;

      entries(TerrainDirs).forEach(([e, [_x, _y]]) => {
        if (this.#data.has(vec.cplus(_x, _y).hash))
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
            ...vec.ctimes(32),
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
    this.#tick();
    this.#tick = nextTick(() => {
      this.update();
      this.#changes.clear();
      if (!this.#hasChange) return;
      this.#hasChange = false;
      this.updateCacheTexture();
    });
  }
}