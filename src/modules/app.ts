import { body, dom } from "$library/dom";

import { Application } from "pixi.js";

export const app = new Application();

await app.init({
  canvas: dom('canvas', { appendTo: body() }),
  autoStart: true,
  resizeTo: body(),
  backgroundColor: '#718F69',
});
