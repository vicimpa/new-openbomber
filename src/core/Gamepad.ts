import { abs } from "@vicimpa/math";
import { entries } from "$library/object";
import gpads from "$modules/gpads";
import { nextTick } from "$library/utils";
import { windowEvents } from "@vicimpa/events";

type GamepadOption = `axis:${number}:${'+' | '-'}` | `button:${number}`;

export class Gamepad<T extends { [key: string]: GamepadOption[]; }> {
  private _nt = nextTick(() => { });
  private _base!: T;
  private _custom: { [key: string]: T; } = {};
  private _gamepadsState = new Map<string, Record<GamepadOption, number>>();
  private _collect = new Map<keyof T, () => number>();
  private _checked = new Set<keyof T>();
  private _getctrl(id: string) {
    return this._gamepadsState.get(id) ?? (
      this._gamepadsState.set(id, {}),
      this._remap(),
      this._gamepadsState.get(id)!
    );
  }
  private _remap() {
    this._nt();
    this._nt = nextTick(() => {
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
  private _destroy: (() => void)[] = [
    windowEvents('gpad:axis', (e) => {
      const state = this._getctrl(e.id);
      state[`axis:${e.axis}:+`] = e.high;
      state[`axis:${e.axis}:-`] = e.low;
    }),
    windowEvents('gpad:button', (e) => {
      const state = this._getctrl(e.id);
      state[`button:${e.button}`] = e.value;
    }),
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

  constructor(base: T, public acc = .5) {
    this._base = base;
    gpads.ids().forEach(id => {
      this._gamepadsState.set(id, {});
    });
    this._remap();
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
}