import { Vec2, vec2 } from "@vicimpa/lib-vec2";

import { Bonus } from "$models/Bonus";
import { Container } from "pixi.js";
import { Game } from "./Game";
import { Hero } from "$models/Hero";
import { cir2sqr } from "$library/collides";
import { randitem } from "$library/array";

export class Bonuses extends Container {

  constructor(public game: Game) {
    super();
  }

  get(vec: Vec2) {
    vec = vec.cdiv(32).round().times(32);
    return this.children.find(e => vec.equal(e));
  }

  give(player: Hero) {
    const pos = vec2(player);
    const find = this.children.find(e => e instanceof Bonus && cir2sqr(pos, 8, vec2(e), 12));
    if (find instanceof Bonus) {
      this.game.fx.give(find, player);
      find.destroy();
      return find;
    }
  }

  spawn(pos: Vec2) {
    this.add(Bonus, {
      ...pos.p,
      type: randitem(['append', 'radius', 'speed', 'fire', 'shield'] as const)
    });
  }
}