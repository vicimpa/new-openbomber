import { Container, Ticker } from "pixi.js";

import { app } from "./app";
import { flat } from "$library/object";

declare global {
  namespace PixiMixins {
    interface Container extends MountedContainer { }
  }
}
const $MOUNTED = Symbol('mounted');

interface MountedContainer {
  [$MOUNTED]: boolean;
  readonly isMounted: boolean;
  onMount?(): void;
  onUnmount?(): void;
  onTick?(ticker: Ticker): void;
}

var oldChilds = new Set<Container>();

Object.defineProperty(Container.prototype, 'isMounted', {
  get(this: Container) {
    return this[$MOUNTED];
  }
});

app.then(app => {
  app.ticker.add((ticker) => {
    var childs = new Set<Container>();

    for (const child of flat(app.stage, (e) => e.children)) {
      childs.add(child);

      if (!child[$MOUNTED]) {
        child[$MOUNTED] = true;
        child.onMount?.();
      }
    }

    for (const child of oldChilds) {
      if (!childs.has(child)) {
        child[$MOUNTED] = false;
        child.onUnmount?.();
      }
    }

    for (const child of childs) {
      child.onTick?.(ticker);
    }

    oldChilds = childs;
  });
});