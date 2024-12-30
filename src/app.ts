import { Game } from "$views/Game";
import { Ground } from "$models/Ground";
import { Viewport } from "$core/Viewport";
import { app } from "$modules/app";
import { awaitAllTasksSignal } from "$library/loaders";

const loader = document.getElementById('loader')!;
const layer: HTMLElement = document.getElementById('progress')?.querySelector('[data-layer]')!;

awaitAllTasksSignal((a, b) => layer.style.width = `${(a / b) * 100}%`)
  .then(() => new Promise(resolve => setTimeout(resolve, 300)))
  .then(() => app)
  .then(app => {
    const viewport = app.stage.add(Viewport);
    viewport.scene.add(Ground, app, { seed: 11 });
    viewport.scene.add(Game, viewport);
    loader.style.opacity = '0';
    app.canvas.style.opacity = '1';
  });