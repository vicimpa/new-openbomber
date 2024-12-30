import { Application } from "pixi.js";
import { Controller } from "$core/Controller";
import { Game } from "$views/Game";
import { Ground } from "$models/Ground";
import { Viewport } from "$core/Viewport";
import { app } from "$modules/app";
import { awaitAllTasksSignal } from "$library/loaders";
import { dom } from "$library/dom";
import { windowEvents } from "@vicimpa/events";

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
      const dispose = windowEvents('keydown', ({ code }) => {
        if (code === 'Enter')
          click();
      });

      const click = () => {
        resolve(app);
        dispose();
        loader.style.pointerEvents = 'none';
      };


      container.replaceWith(
        dom('button', {
          innerHTML: 'Continue',
          onclick: click
        })
      );
    });
  })
  .then(app => {
    const controller = app.stage.add(Controller);
    const viewport = controller.add(Viewport);
    viewport.scene.add(Ground, app, { seed: 11 });
    viewport.scene.add(Game, viewport);
    loader.style.opacity = '0';
    app.canvas.style.opacity = '1';
  });