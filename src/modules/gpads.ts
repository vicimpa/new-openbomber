import { clamp } from "@vicimpa/math";
import { keys } from "../library/object";

const data: { [K: string]: { axis: number[], button: number[]; }; } = {};
const vibrate = navigator.vibrate?.bind(navigator) ?? (() => false);

navigator.vibrate = (arg: number[]) => {
  const value = vibrate(arg);

  if (typeof arg === 'number')
    arg = [arg];

  const gamepads = navigator.getGamepads();

  // Проходим по каждому геймпаду
  for (let i = 0; i < gamepads.length; i++) {
    const gamepad = gamepads[i];

    if (gamepad && gamepad.vibrationActuator) {
      // Проходим по каждому элементу в паттерне вибрации
      arg.forEach((duration, index) => {
        // Используем setTimeout для управления временем вибрации
        setTimeout(() => {
          // Включаем вибрацию
          gamepad.vibrationActuator.playEffect("dual-rumble", {
            startDelay: 0,
            duration: duration,
            weakMagnitude: 1.0,
            strongMagnitude: 1.0
          });
        }, arg.slice(0, index).reduce((a, b) => a + b, 0));
      });
    }
  }
  return value;
};

class GpadEvent extends Event {
  constructor(
    public id: string,
    connected: boolean,
  ) { super('gpad:' + connected ? 'connect' : 'dsiconnect'); }
}

class GpadAxisEvent extends Event {
  readonly low: number;
  readonly high: number;

  constructor(
    public id: string,
    public axis: number,
    public value: number,
    public previewValue: number,
  ) {
    super('gpad:axis');
    this.low = clamp(value, -1, 0) * -1;
    this.high = clamp(value, 0, 1);
  }
}

class GpadButtonEvent extends Event {
  readonly down: boolean;

  constructor(
    public id: string,
    public button: number,
    public value: number,
    public previewValue: number,
  ) {
    super('gpad:button');
    this.down = this.value > this.previewValue;
  }
}

interface GpadEventsMap {
  'gpad:axis': GpadAxisEvent;
  'gpad:button': GpadButtonEvent;
  'gpad:connect': GpadEvent;
  'gpad:disconnect': GpadEvent;
}

declare global {
  interface WindowEventMap extends GpadEventsMap { }
}

export default {
  ids() {
    return keys(data) as string[];
  }
};

setInterval(() => {
  const active = new Set<string>();
  const gpads = navigator.getGamepads();

  for (const gpad of gpads) {
    if (!gpad) continue;
    active.add(gpad.id);
  }

  for (const id of active) {
    if (id in data) continue;
    data[id] = { axis: [], button: [] };
    dispatchEvent(new GpadEvent(id, true));
  }

  for (const id in data) {
    if (active.has(id)) continue;
    delete data[id];
    dispatchEvent(new GpadEvent(id, false));
  }

  gpads.forEach((gpad) => {
    if (!gpad) return;

    gpad.axes.forEach((value, index) => {
      const preview = data[gpad.id]['axis'][index] ?? 0;
      data[gpad.id]['axis'][index] = value;
      if (preview !== value)
        dispatchEvent(new GpadAxisEvent(gpad.id, index, value, preview));
    });

    gpad.buttons.forEach(({ value }, index) => {
      const preview = data[gpad.id]['button'][index] ?? 0;
      data[gpad.id]['button'][index] = value;
      if (preview !== value)
        dispatchEvent(new GpadButtonEvent(gpad.id, index, value, preview));
    });
  });
}, 30);