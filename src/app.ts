import { Application } from "pixi.js";
import { Game } from "$views/Game";
import { Ground } from "$models/Ground";
import { Viewport } from "$core/Viewport";
import { app } from "$modules/app";
import { awaitAllTasksSignal } from "$library/loaders";
import { dom } from "$library/dom";

const loader = document.getElementById('loader')!;
const container = document.getElementById('container')!;
const progress: HTMLElement = container.querySelector('#progress')!;
const layer = progress?.querySelector<HTMLDivElement>('[data-layer]')!;

Promise.resolve()
  .then(() => awaitAllTasksSignal((a, b) => layer.style.width = `${(a / b) * 100}%`))
  .then(() => new Promise(resolve => setTimeout(resolve, 300)))
  .then(() => app)
  .then((app) => {
    return new Promise<Application>((resolve) => {
      container.replaceWith(
        dom('button', {
          innerHTML: 'Continue',
          onclick: resolve.bind(null, app)
        })
      );
    });
  })
  .then(app => {
    const viewport = app.stage.add(Viewport);
    viewport.scene.add(Ground, app, { seed: 11 });
    viewport.scene.add(Game, viewport);
    loader.style.opacity = '0';
    app.canvas.style.opacity = '1';
  });