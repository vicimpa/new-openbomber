import { Game } from "$views/Game";
import { Ground } from "$models/Ground";
import { Viewport } from "$core/Viewport";
import { app } from "$modules/app";
import { awaitAllTasks } from "$library/loaders";

const loader = document.getElementById('loader')!;

awaitAllTasks()
  .then(() => app)
  .then(app => {
    const viewport = app.stage.add(Viewport);
    viewport.scene.add(Ground, app, { seed: 11 });
    viewport.scene.add(Game, viewport);
    loader.style.opacity = '0';
    app.canvas.style.opacity = '1';
  });