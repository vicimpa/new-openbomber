import { Game } from "$views/Game";
import { Ground } from "$models/Ground";
import { Viewport } from "$core/Viewport";
import { app } from "$modules/app";

const loader = document.getElementById('loader')!;

app.then(app => {
  const viewport = app.stage.add(Viewport);
  viewport.scene.add(Ground, app, { seed: 11 });
  viewport.scene.add(Game, viewport);
  loader.style.opacity = '0';
  app.canvas.style.opacity = '1';
});