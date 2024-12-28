import "$modules";
import "$resources";

import { Game } from "$views/Game";
import { Ground } from "$models/Ground";
import { scene } from "$modules/viewport";

scene.add(Ground, { seed: 11 });
scene.add(Game);