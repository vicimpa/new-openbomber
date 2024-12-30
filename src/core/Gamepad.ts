import { abs, clamp } from "@vicimpa/math";

import { entries } from "$library/object";
import { frames } from "$library/frames";
import { nextTick } from "$library/utils";

type GamepadOption = `axis:${number}:${'+' | '-'}` | `button:${number}`;

export class Gamepad<T extends { [key: string]: GamepadOption[]; }> extends EventTarget {
  _base!: T;
  _custom: { [key: string]: T; } = {};
  _gamepadsState = new Map<string, Record<string, number>>();
  _collect = new Map<keyof T, () => number>();
  _checked = new Set<keyof T>();
  _resolve?: (key: string) => void;
  _destroy = [
    frames(() => {
      this.process();
    })
  ];

  down(key: keyof T) {
    var val = (this._collect.get(key)?.() ?? 0);
    return abs(val) > this.acc ? val : 0;
  }

  axis(neg: keyof T, pos: keyof T) {
    return this.down(neg) * -1 + this.down(pos);
  }

  press(key: keyof T) {
    if (this.down(key)) {
      nextTick(() => this._checked.add(key));
      return !this._checked.has(key);
    }
    this._checked.delete(key);
    return false;
  }

  nt = nextTick(() => { });
  _remap() {
    this.nt();
    this.nt = nextTick(() => {
      this._collect.clear();
      entries(this._base)
        .forEach(([name, keys]) => {
          const cfg = [...this._gamepadsState]
            .map(([id, state]): () => number => {
              const current = this._custom[id]?.[name] ?? keys;
              const codes = current.map(e => `($[${JSON.stringify(e)}] ?? 0)`);
              return new Function('$', `return ${codes.join(' + ')};`).bind(null, state);
            });

          const code = cfg.map((_, i) => `($[${JSON.stringify(i)}]?.() ?? 0)`);

          this._collect.set(
            name,
            new Function('$', `return ${code.join(' + ')};`).bind(null, cfg)
          );
        });
    });
  }

  constructor(base: T, public acc = .5) {
    super();
    this._base = base;
    this._remap();
  }

  resolve() {
    if (this._resolve)
      return Promise.resolve(null);

    return new Promise<string>((resolve) => {
      this._resolve = resolve;
    }).finally(() => {
      delete this._resolve;
    });
  }

  config(id: string) {
    return this._custom[id] ?? this._base;
  }

  configure(id: string, config: T) {
    this._custom[id] = config;
    this._remap();
  }

  reset(id: string) {
    delete this._custom[id];
    this._remap();
  }

  destroy() {
    this._destroy.forEach(call => call());
  }

  process() {
    const gps = new Set<string>();

    navigator.getGamepads()
      .forEach((gp) => {
        if (!gp) return;
        const state = this._gamepadsState.get(gp.id) ?? (
          this._remap(),
          this._gamepadsState.set(gp.id, {}),
          this._gamepadsState.get(gp.id)
        );

        if (!state) return;

        gps.add(gp.id);

        gp.axes.forEach((val, i) => {
          const lvk = `axis:${i}:-`;
          const rvk = `axis:${i}:+`;
          const lv = clamp(val, -1, 0) * -1;
          const rv = clamp(val, 0, 1);

          if (this._resolve) {
            if (lv > .5) this._resolve(lvk);
            if (rv > .5) this._resolve(rvk);
            return;
          }

          state[lvk] = lv;
          state[rvk] = rv;
        });

        gp.buttons.forEach(({ value }, i) => {
          const btk = `button:${i}`;

          if (this._resolve) {
            if (value) this._resolve(btk);
            return;
          }

          state[btk] = clamp(value, 1, 0);
        });
      });

    this._gamepadsState.forEach((_, id) => {
      if (gps.has(id)) return;
      this._remap();
      this._gamepadsState.delete(id);
    });
  }
}