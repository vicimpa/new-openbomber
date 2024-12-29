import { body, dom } from "$library/dom";

import { Application } from "pixi.js";

const _app = new Application();

export const app = _app.init({
  canvas: dom('canvas', { appendTo: body() }),
  resizeTo: body(),
  backgroundAlpha: 0,
}).then(() => _app);