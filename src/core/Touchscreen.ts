import { Vec2, vec2 } from "@vicimpa/lib-vec2";
import { abs, clamp } from "@vicimpa/math";
import { body, dom } from "$library/dom";
import { keys, values } from "$library/object";

import { frames } from "$library/frames";
import { nextTick } from "$library/utils";
import { windowEvents } from "@vicimpa/events";

export class Touchscreen {
  acc = .3;
  private _axis = vec2();
  private _buttons: { a?: number, b?: number, x?: number, y?: number; } = {};
  private _preview = 0;
  private _touch?: number;
  private _start = vec2();
  private _last = vec2();
  private _eaxis?: HTMLDivElement;
  private _eaxisPipka?: HTMLDivElement;
  private _ebuttons: {
    a?: HTMLDivElement,
    b?: HTMLDivElement,
    x?: HTMLDivElement,
    y?: HTMLDivElement,
  } = {};
  private _touches = false;
  private _checked = new Set<string>();

  private _axisTime = performance.now();
  private _buttonsTime = performance.now();

  axis() {
    this._axisTime = performance.now();
    return this._axis.clone();
  }

  down(key: 'a' | 'b' | 'x' | 'y') {
    this._buttonsTime = performance.now();
    return typeof this._buttons[key] === 'number';
  }

  press(key: 'a' | 'b' | 'x' | 'y') {
    if (this.down(key)) {
      nextTick(() => this._checked.add(key));
      return !this._checked.has(key);
    }
    this._checked.delete(key);
    return false;
  }

  _destroy = [
    frames(() => {
      this.process();
    }),
    windowEvents('touchend', (e) => {
      [...e.changedTouches]
        .forEach(touch => {
          if (touch.identifier === this._touch)
            delete this._touch;

          keys(this._buttons)
            .forEach(key => {
              if (this._buttons[key] === touch.identifier)
                delete this._buttons[key];
            });
        });
    }),
    windowEvents('blur', () => {
      delete this._touch;
    }),
    windowEvents('touchmove', (e) => {
      if (this._touch === undefined)
        return;

      [...e.touches].forEach(touch => {
        if (touch.identifier === this._touch) {
          Vec2.fromPageXY(touch, this._last);
        }
      });
    })
  ];

  _controlls = dom('div', { className: 'controlls', appendTo: body() },
    dom('div', { className: 'container' },
      dom('div', {
        className: 'axis',
        ref: el => { this._eaxis = el; },
        ontouchstart: e => {
          this.touchAxis(e);
        }
      },
        dom('div', {
          ref: el => { this._eaxisPipka = el; },
        })
      )
    ),
    dom('div', { className: 'container' },
      dom('div', {
        className: 'buttons',
        ontouchstart: e => {
          this.touchButton(e);
        }
      },
        dom('div', { id: '_a', ref: el => { this._ebuttons.a = el; } }),
        dom('div', { id: '_b', ref: el => { this._ebuttons.b = el; } }),
        dom('div', { id: '_x', ref: el => { this._ebuttons.x = el; } }),
        dom('div', { id: '_y', ref: el => { this._ebuttons.y = el; } }),
      )
    )
  );

  destroy() {
    this._controlls.remove();
    this._destroy.forEach(call => call());
  }

  processSize() {
    if (!this._touches) return;
    const size = clamp(innerWidth / 12, 30, 100);
    if (size !== this._preview) {
      this._preview = size;
      this._controlls.style.setProperty('--size', size + 'px');
    }
  }

  processAxis() {
    if (!this._touches || !this._eaxis || !this._eaxisPipka) return;

    if (this._touch === undefined) {
      this._axis.set(0);
      this._eaxisPipka.style.transform = ``;
      return;
    }

    const msize = this._preview * 1.5;
    this._axis.set(this._last)
      .minus(this._start)
      .clamp(-msize, msize)
      .div(msize);

    if (this._axis.length() > 1)
      this._axis.normalize();

    if (abs(this._axis.x) < this.acc)
      this._axis.x = 0;

    if (abs(this._axis.y) < this.acc)
      this._axis.y = 0;

    const tpos = this._axis.ctimes(msize);
    this._eaxisPipka.style.transform = `translateX(${tpos.x}px) translateY(${tpos.y}px)`;

  }

  touchAxis(e: TouchEvent) {
    if (!this._eaxis) return;
    const rect = this._eaxis.getBoundingClientRect();
    const pos = vec2();
    const need = Vec2.fromSize(rect).div(2).plus(rect);

    const touch = [...e.changedTouches]
      .find((touch) => {
        return Vec2.fromPageXY(touch, pos).distance(need) <= this._preview * 1.5;
      });

    if (!touch) return;
    e.preventDefault();
    this._start.set(need);
    this._touch = touch.identifier;
    Vec2.fromPageXY(touch, this._last);
  }

  touchButton(e: TouchEvent) {
    const btns = values(this._ebuttons);
    const touch = [...e.changedTouches]
      .find(() => btns.includes(e.target as any));

    if (!touch) return;
    e.preventDefault();

    keys(this._ebuttons)
      .forEach(key => {
        if (this._ebuttons[key] === touch?.target) {
          this._buttons[key] = touch.identifier;
        }
      });
  }

  processHidden() {
    const btns = this._ebuttons;
    const axis = this._eaxis;
    const time = performance.now() - 100;
    const axisShow = time < this._axisTime;
    const buttonShow = time < this._buttonsTime;

    if (axis) axis.className = this._touches && axisShow ? 'axis active' : 'axis';
    if (btns.a) btns.a.className = this._touches && buttonShow ? 'active' : '';
    if (btns.b) btns.b.className = this._touches && buttonShow ? 'active' : '';
    if (btns.x) btns.x.className = this._touches && buttonShow ? 'active' : '';
    if (btns.y) btns.y.className = this._touches && buttonShow ? 'active' : '';
  }

  process() {
    this._touches = navigator.maxTouchPoints > 0;
    this.processSize();
    this.processAxis();
    this.processHidden();
  }
}