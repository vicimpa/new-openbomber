import { Vec2, vec2 } from "@vicimpa/lib-vec2";

import { Bomb } from "$models/Bomb";
import { Container } from "pixi.js";
import { Game } from "./Game";
import { cir2cir } from "$library/collides";

export class Bombs extends Container {
  constructor(public game: Game) {
    super();
  }

  get(pos: Vec2) {
    return this.children.find(e => e instanceof Bomb && pos.equal(e)) as Bomb | null;
  }

  spawn(pos: Vec2, pow = 1) {
    pos = pos.cdiv(32).round().times(32);
    if (this.children.find(e => pos.equal(e)))
      return;

    const tile = this.game.world.getTile(pos.cdiv(32));

    if (tile == 'box' || tile == 'wall')
      return;

    this.add(Bomb, {
      ...pos.p,
      time: 2000,
      onDelete: () => {
        this.game.fx.explode(pos, pow);
      }
    });
  }

  updateIgnore(pos: Vec2) {
    this.children.forEach(node => {
      if (node instanceof Bomb) {
        if (!node.ignore) return;
        if (!cir2cir(vec2(node), 10, pos, 10))
          node.ignore = false;
      }
    });
  }

  getCorrect(pos: Vec2) {
    const correct = vec2();

    this.children.forEach(node => {
      if (node instanceof Bomb) {
        if (node.ignore) return;
        const cor = cir2cir(pos, 8, vec2(node), 12);
        cor && correct.plus(cor);
      }
    });

    return correct;
  }
}