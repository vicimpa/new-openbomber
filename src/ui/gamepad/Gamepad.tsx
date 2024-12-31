import { Signal, useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { Vec2, vec2 } from "@vicimpa/lib-vec2";
import { useMemo, useRef } from "preact/hooks";

import { elementEvents } from "@vicimpa/events";
import { frames } from "$library/frames";
import { from } from "$library/array";
import { makeDrag } from "@vicimpa/easy-drag";
import s from "./Gamepad.module.css";

export type GamePadProps = {
  show: Signal<boolean>;
  buttons: number;
  onAxisChange?: (vec: Vec2) => any,
  onButtonChange?: (btn: number, pressed: boolean) => any;
};

export const GamePad = ({ show: _show, buttons, onAxisChange, onButtonChange }: GamePadProps) => {
  const touches = useSignal(false);
  const axis = useRef<HTMLDivElement>(null);
  const axisPoint = useRef<HTMLDivElement>(null);
  const btns = from(buttons, () => useRef<HTMLDivElement>(null));
  const preview = useMemo(() => vec2(), []);
  const axisUpdate = (pos: Vec2) => {
    if (!preview.equal(pos))
      onAxisChange?.(pos);
    preview.set(pos);
  };
  const show = useComputed(() => _show.value && touches.value);

  useSignalEffect(() => {
    if (!_show.value) return;
    return frames(() => {
      if (touches.peek() && !navigator.maxTouchPoints)
        touches.value = false;
      if (!touches.peek() && navigator.maxTouchPoints)
        touches.value = true;
    });
  });

  useSignalEffect(() => {
    if (!show.value) return;

    const dispose = [
      elementEvents(axis, 'touchstart',
        makeDrag<[element: HTMLDivElement]>((_, element) => {
          navigator.vibrate(10);
          return ({ current }) => {
            const rect = element.getBoundingClientRect();
            const size = Vec2.fromSize(rect).cdiv(2);
            const base = size.cplus(rect);
            const pos = current.minus(base);

            pos.div(size);
            pos.clamp(-1, 1);

            if (pos.length() > 1)
              pos.normalize();

            const abs = pos.cabs();

            if (abs.x < .5)
              pos.x = 0;

            if (abs.y < .5)
              pos.y = 0;

            pos.normalize();

            axisUpdate(pos);
            if (!axisPoint.current) return;
            element.dataset['down'] = '';
            axisPoint.current.style.transform = (''
              + `translateX(${pos.x * size.x}px) `
              + `translateY(${pos.y * size.y}px) `
            );
            return () => {
              navigator.vibrate(5);
              delete element.dataset['down'];
              axisUpdate(vec2());
              if (!axisPoint.current) return;
              element.style.boxShadow = '';
              axisPoint.current.style.transform = ``;
            };
          };
        })
      ),
      ...btns.map((ref, i) => (
        elementEvents(ref, 'touchstart',
          makeDrag<[element: HTMLDivElement]>((_, button) => {
            onButtonChange?.(i, true);
            navigator.vibrate(10);
            button.dataset['down'] = '';
            return () => {
              return () => {
                navigator.vibrate(5);
                onButtonChange?.(i, false);
                delete button.dataset['down'];
              };
            };
          })
        )
      ))
    ];

    return () => {
      dispose.forEach(call => call());
    };
  });

  return (
    <div class={s.controlls} data-show={show}>
      <div class={s.container}>
        <div class={s.axis} ref={axis}>
          <div ref={axisPoint} />
        </div>
      </div>
      <div class={s.container}>
        <div class={s.buttons}>
          {btns.map(ref => (<div ref={ref} />))}
        </div>
      </div>
    </div>
  );
};