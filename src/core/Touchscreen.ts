import { body, dom } from "$library/dom";
import { createElement, render } from "preact";

import { GamePad } from "$ui/gamepad";
import { nextTick } from "$library/utils";
import { signal } from "@preact/signals";
import { vec2 } from "@vicimpa/lib-vec2";

const buttons = ['a', 'b', 'x', 'y'] as const;
type button = typeof buttons[number];

export class Touchscreen {
  private _buttons: { a?: boolean, b?: boolean, x?: boolean, y?: boolean; } = {};
  private _axis = vec2();
  private _checked = new Set<string>();

  constructor(public acc = .3) { }

  axis() {
    return this._axis.clone();
  }

  down(key: button) {
    return !!this._buttons[key];
  }

  press(key: button) {
    if (this.down(key)) {
      nextTick(() => this._checked.add(key));
      return !this._checked.has(key);
    }
    this._checked.delete(key);
    return false;
  }

  _controlls = dom('div', {
    style: { display: 'contents' },
    appendTo: body(),
    ref: elem => {
      render(
        createElement(GamePad, {
          show: signal(true),
          buttons: buttons.length,
          onAxisChange: (vec) => {
            this._axis.set(vec);
          },
          onButtonChange: (button, value) => {
            this._buttons[buttons[button]] = value;
          }
        }),
        elem
      );
    }
  });

  destroy() {
    render(null, this._controlls);
    this._controlls.remove();
  }
}