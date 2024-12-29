import { body, dom } from "$library/dom";

import { Application } from "pixi.js";

const _app = new Application();

export const app = _app.init({
  canvas: dom('canvas', { appendTo: body() }),
  resizeTo: body(),
  backgroundColor: '#718F69',
}).then(() => _app);