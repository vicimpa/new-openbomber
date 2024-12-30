import { entries } from "$library/object";

type KEYCODE = "AltLeft" | "AltRight" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "Backquote" | "Backslash" | "Backspace" | "BracketLeft" | "BracketRight" | "CapsLock" | "Comma" | "ControlLeft" | "Digit0" | "Digit1" | "Digit2" | "Digit3" | "Digit4" | "Digit5" | "Digit6" | "Digit7" | "Digit8" | "Digit9" | "Enter" | "Equal" | "Escape" | "F1" | "F10" | "F12" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "IntlBackslash" | "KeyA" | "KeyB" | "KeyC" | "KeyD" | "KeyE" | "KeyF" | "KeyG" | "KeyH" | "KeyI" | "KeyJ" | "KeyK" | "KeyL" | "KeyM" | "KeyN" | "KeyO" | "KeyP" | "KeyQ" | "KeyR" | "KeyS" | "KeyT" | "KeyU" | "KeyV" | "KeyW" | "KeyX" | "KeyY" | "KeyZ" | "MetaLeft" | "MetaRight" | "Minus" | "Period" | "Quote" | "Semicolon" | "ShiftLeft" | "ShiftRight" | "Slash" | "Space" | "Tab";
type GAMEPAD = `gaxis:${number}${'' | `:${'r' | 'l'}`}` | `gbutton:${number}`;
type TOUCHPAD = `taxis:${'t' | 'b'}${'l' | 'r'}` | `tbutton:${'t' | 'b'}${'l' | 'r'}`;
type Action = KEYCODE | GAMEPAD | TOUCHPAD;


export class Controller<T extends { [key: string]: Action[]; }> {
  state = new Map<Action, number>();
  collectStates = new Map<keyof T, () => number>();

  constructor(actions: T) {
    entries(actions)
      .forEach(([name, actions]) => {
        this.collectStates.set(
          name,
          new Function('$', `return ${actions.map(e => `($[${JSON.stringify(e)}] ?? 0)`).join('+')};`)
            .bind(null, this.state)
        );
      });
  }
}