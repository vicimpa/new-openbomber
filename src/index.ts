import { Application } from "pixi.js";
import { Controller } from "$core/Controller";
import { Game } from "$view/Game";
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
      const click = () => {
        dispose.forEach(call => call());
        loader.style.pointerEvents = 'none';
        resolve(app);
      };

      const dispose = [
        windowEvents('keydown', (e) => {
          if (e.code === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            click();
          }
        }),
        windowEvents('gpad:button', (e) => {
          if (e.button === 0 && e.down) {
            e.preventDefault();
            e.stopPropagation();
            click();
          }
        })
      ];

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