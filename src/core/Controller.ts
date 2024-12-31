import { Container } from "pixi.js";
import { Gamepad } from "./Gamepad";
import { Keyboard } from "./Keyboard";
import { Touchscreen } from "./Touchscreen";
import { or } from "$library/boolean";
import { vec2 } from "@vicimpa/lib-vec2";

export class Controller extends Container {
  readonly move = vec2();

  keys = new Keyboard({
    up: ['ArrowUp', 'KeyW'],
    left: ['ArrowLeft', 'KeyA'],
    right: ['ArrowRight', 'KeyD'],
    down: ['ArrowDown', 'KeyS'],
    bomb: ['Space', 'Enter'],
    take: ['KeyE']
  });

  gpad = new Gamepad({
    up: ['axis:1:-'],
    left: ['axis:0:-'],
    right: ['axis:0:+'],
    down: ['axis:1:+'],
    bomb: ['button:0'],
    take: ['button:1']
  }, .5);

  tpad = new Touchscreen();

  isBomb() {
    const { keys, gpad, tpad } = this;
    return or(
      keys.press('bomb'),
      gpad.press('bomb'),
      tpad.press('a')
    );
  }

  hasBomb() {
    const { keys, gpad, tpad } = this;
    return or(
      keys.down('take'),
      gpad.down('take'),
      tpad.down('b')
    );
  }

  onTick() {
    const { move, keys, gpad, tpad } = this;

    move
      .set()
      .plus(
        keys.axis('left', 'right'),
        keys.axis('up', 'down')
      )
      .plus(
        gpad.axis('left', 'right'),
        gpad.axis('up', 'down')
      )
      .plus(
        tpad.axis()
      );

    const l = move.length();

    if (l > 1) move.normalize();
    if (l < .3) move.set(0);
  }

  static resolve(target: Container | null): Controller | undefined {
    if (!target) return;
    if (target instanceof Controller) return target;
    return this.resolve(target.parent);
  }
}