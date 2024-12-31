import { entries } from "$library/object";
import { nextTick } from "$library/utils";
import { windowEvents } from "@vicimpa/events";

export class Keyboard<T extends { [key: string]: string[]; }> {
  private _isresolved = false;
  private _base!: T;
  private _config?: T;
  private _keys = new Map<string, keyof T>();
  private _state = new Set<string>();
  private _checked = new Set<keyof T>();
  private _collect = new Map<keyof T, () => boolean>();
  private _remap() {
    entries(this._config ?? this._base)
      .map(([name, keys]) => {
        const codes = keys.map(key => (
          `$.has(${JSON.stringify(key)})`
        ));

        this._collect.set(
          name,
          new Function(
            '$',
            `return ${codes.join(' || ')};`
          ).bind(null, this._state)
        );

        keys.map(key => {
          this._keys.set(key, name);
        });
      });
  }
  private _destroy = [
    windowEvents('keydown', ({ code, ctrlKey, altKey, metaKey }) => {
      if (this._isresolved) return;
      if (ctrlKey || altKey || metaKey) return;
      if (!this._keys.has(code)) return;
      this._state.add(code);
    }),
    windowEvents('keyup', ({ code }) => {
      this._state.delete(code);
    }),
    windowEvents('blur', () => {
      this._state.clear();
    })
  ];

  get config(): Readonly<T> {
    return this._base;
  }

  down(key: keyof T) {
    return this._collect.get(key)?.() ?? false;
  }

  axis(neg: keyof T, pos: keyof T) {
    return +this.down(neg) * -1 + +this.down(pos);
  }

  press(key: keyof T) {
    if (this.down(key)) {
      nextTick(() => this._checked.add(key));
      return !this._checked.has(key);
    }
    this._checked.delete(key);
    return false;
  }

  reset() {
    this.configure(this._base);
  }

  configure(config: T) {
    this._config = config;
    this._keys.clear();
    this._remap();
  }

  destroy() {
    this._destroy.forEach(call => call());
  }

  constructor(config: T) {
    this._base = config;
    this.configure(config);
  }
}