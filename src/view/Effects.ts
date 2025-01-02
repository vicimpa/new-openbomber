import { Vec2, vec2 } from "@vicimpa/lib-vec2";

import { Bonus } from "$models/Bonus";
import { Container } from "pixi.js";
import { Destroy } from "$models/Destroy";
import { Explode } from "$models/Explode";
import { Fire } from "$models/Fire";
import { Game } from "./Game";
import { Give } from "$models/Give";
import { Hero } from "$models/Hero";
import { random } from "@vicimpa/math";
import { world } from "$resources/image";

const dirs = [
  vec2(0, -1),
  vec2(-1, 0),
  vec2(1, 0),
  vec2(0, 1),
];

export class Effects extends Container {
  constructor(public game: Game) {
    super();
  }

  explode(pos: Vec2, pow = 0) {
    const base = pos.cdiv(32).round();
    pos = base.ctimes(32);
    let top = 0, left = 0, right = 0, bottom = 0;

    const destroy: (() => void)[] = [];

    if (pow) {
      [top, left, right, bottom] = dirs.map(dir => {
        let i = 0;
        for (; i < pow; i++) {
          const ddir = dir.ctimes(i + 1);
          const tpos = ddir.cplus(base);
          const tile = this.game.world.getTile(tpos);

          if (tile === 'box') {
            i++;
            destroy.push(() => {
              this.add(Destroy, world.box, tpos.ctimes(32), ddir.normalize());
              if (random() > .8) {
                this.game.bonus.spawn(tpos.ctimes(32));
              }
              this.game.world.delTile(tpos);
            });
            break;
          }

          if (tile === 'wall')
            break;

          const bomb = this.game.bombs.get(tpos.ctimes(32));
          if (bomb) {
            i++;
            destroy.push(() => {
              if (bomb.time > .5) {
                bomb.time = .5;
              }
            });
            break;
          }

          const bonus = this.game.bonus.get(tpos.ctimes(32));
          if (bonus) {
            destroy.push(() => {
              if (bonus instanceof Bonus) {
                this.fire(bonus, tpos.ctimes(32));
              }
              bonus.destroy();
            });
          }
        }

        return i;
      });
    }

    this.add(Explode, {
      ...pos.p,
      top,
      left,
      right,
      bottom,
      onFire: (points, explode) => {
        destroy.forEach(e => e());
        points.forEach(point => {
          this.game.ruines.set(point.cdiv(32));

          if (this.game.player) {
            const pos = vec2(this.game.player).div(32);
            if (pos.distance(point.cdiv(32)) < .5) {
              this.game.death();
            }
          }
        });
        if (!pow) return;
        this.game.viewport.shake(explode);
      },
    });
  }

  give(bonus: Bonus, player: Hero) {
    player.add(Give, bonus.view.texture, vec2());
  }

  fire(target: Hero | Bonus, pos: Vec2) {
    this.add(Fire, target instanceof Hero ? target.hero.texture : target.view.texture, pos);
  }
}