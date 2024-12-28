// TODO: СДЕЛЯЙ!!!
// const controllerMap = {
//   'move_up': {
//     keyboard: [],
//     gamepad: [],
//     buttons: []
//   }
// } as const;

import { Vec2, vec2 } from "@vicimpa/lib-vec2";

import { nextTick } from "./utils";

const pressed = new Set<string>();
const checked = new Set<string>();

addEventListener('keydown', ({ code, ctrlKey, altKey, metaKey }) => {
  if (ctrlKey || altKey || metaKey) return;
  pressed.add(code);
});

addEventListener('keyup', ({ code }) => {
  pressed.delete(code);
});

addEventListener('blur', () => {
  pressed.clear();
});

addEventListener('contextmenu', () => {
  pressed.clear();
});

export function isKeyDown(key: string) {
  return pressed.has(key);
}

export function isKeyUp(key: string) {
  return !isKeyDown(key);
}

export function isKeyPress(key: string) {
  if (isKeyDown(key)) {
    nextTick(() => checked.add(key));
    return !checked.has(key);
  }
  checked.delete(key);
  return false;
}

export function getAxis(negative: string, positive: string) {
  return +isKeyDown(negative) * -1 + +isKeyDown(positive);
}

export function updateAxisVec2(
  target: Vec2,
  left: string,
  right: string,
  up: string,
  down: string,
  flipX = false,
  flipY = false
) {
  return target.set(
    getAxis(left, right) * (flipX ? -1 : 1),
    getAxis(up, down) * (flipY ? -1 : 1),
  ).normalize();
}

export function getAxisVec2(
  left: string,
  right: string,
  up: string,
  down: string,
  flipX = false,
  flipY = false
) {
  return updateAxisVec2(vec2(), left, right, up, down, flipX, flipY);
}