import { Container, Sprite } from "pixi.js";
import { Vec2, Vec2ArgsReq, Vec2Map, Vec2Set } from "@vicimpa/lib-vec2";
import { entries, values } from "$library/object";

import { TerrainDirs } from "$library/terrain";
import { nextTick } from "$library/utils";
import { randitem } from "$library/array";
import { ruines } from "$resources/terrains";

export class Ruines extends Container {
  #cache = new Vec2Map<Sprite>();
  #data = new Vec2Set();
  #changes = new Vec2Set();
  #hasChange = false;
  #tick = nextTick(() => { });

  constructor(points: Vec2[] = []) {
    super();
    points.forEach((point) => this.set(point));
    this.cacheAsTexture(true);
  }

  has(...args: Vec2ArgsReq) {
    return this.#data.has(...args);
  }

  set(...args: Vec2ArgsReq) {
    if (!this.#data.has(...args))
      this.#changes.add(...args);

    this.#data.add(...args);
    this.quieUpdate();
  }

  del(...args: Vec2ArgsReq) {
    if (this.#data.has(...args))
      this.#changes.add(...args);

    this.#data.delete(...args);
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
    const quie = new Vec2Set();
    this.#changes.forEach(change => {
      values(TerrainDirs).forEach(([_x, _y]) => {
        quie.add(change.cplus(_x, _y));
      });
    });

    quie.forEach((vec) => {
      let flags = 0;

      entries(TerrainDirs).forEach(([e, [_x, _y]]) => {
        if (this.#data.has(vec.cplus(_x, _y)))
          flags = flags | e;
      });

      const textures = ruines
        .filter(e => flags && (flags === e[1] || (flags & 0b11111) == e[1]))
        .map(e => e[0]);


      if (this.#cache.has(vec) && (!flags || !textures.length)) {
        this.#cache.get(vec)?.destroy();
        this.#cache.delete(vec);
        this.#hasChange = true;
        return;
      }

      const texture = randitem(textures);
      const sprite = this.#cache.get(vec) ?? (
        this.#cache.set(vec, (
          this.#hasChange = true,
          this.add(Sprite, {
            ...vec.ctimes(32),
            texture,
            anchor: .5
          })
        )),
        this.#cache.get(vec)!
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