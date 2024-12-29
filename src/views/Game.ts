import { Container, Ticker } from "pixi.js";
import { Vec2, vec2 } from "@vicimpa/lib-vec2";
import { isKeyDown, isKeyPress, updateAxisVec2 } from "$library/keyboard";

import { Bombs } from "./Bombs";
import { Bonuses } from "./Bonuses";
import { Effects } from "./Effects";
import { Hero } from "../models/Hero";
import { Ruines } from "../models/Ruine";
import { Viewport } from "$core/Viewport";
import { World } from "../models/World";
import { clamp } from "@vicimpa/math";
import { generator3000 } from "$library/generator";

const size = vec2(17);
const csize = size.cdiv(2).floor();

export class Game extends Container {
  view = this.add(Container);
  ruines = this.view.add(Ruines);
  world = this.view.add(World, generator3000(size.x, size.y, [csize]));
  bombs = this.view.add(Bombs, this);
  bonus = this.view.add(Bonuses, this);
  heroes = this.view.add(Container);
  fx = this.view.add(Effects, this);

  player?: Hero;

  move = vec2();

  stats = {
    append: 0,
    radius: 0,
    speed: 0,
    fire: 0,
  };

  constructor(public viewport: Viewport) {
    super();
  }

  onMount(): void {
    const size = Vec2.fromSize(this.world);

    this.viewport.radius = (size.max() + 3) * 32;
    this.player = this.heroes.add(Hero, { type: 'type8' });

    size
      .cdiv(-2)
      .ceil()
      .times(32)
      .toObject(this.view)
      .times(-1)
      .toObject(this.player);

    this.viewport.focus = this.player;
    this.viewport.radius = 256;
  }

  onTick(ticker: Ticker): void {
    const { player, move, bombs } = this;

    if (player) {
      updateAxisVec2(move, 'KeyA', 'KeyD', 'KeyW', 'KeyS');

      if (isKeyPress('Space')) {
        if (bombs.children.length < this.stats.append + 1)
          bombs.spawn(vec2(player), this.stats.radius + 1);
      }

      player.hasBomb = isKeyDown('KeyE');

      const pos = vec2(player);

      const bonus = this.bonus.give(player);

      if (bonus?.type === 'append') {
        this.stats.append += 1;
      }

      if (bonus?.type === 'radius') {
        this.stats.radius += 1;
      }

      if (bonus?.type === 'speed') {
        this.stats.speed += 3000;
      }

      if (bonus?.type === 'fire') {
        this.stats.fire += 2000;
      }

      this.stats.speed = clamp(this.stats.speed - ticker.deltaTime, 0, Infinity);
      this.stats.fire = clamp(this.stats.fire - ticker.deltaTime, 0, Infinity);

      player.hasSpeed = this.stats.speed > 0;
      player.hasFire = this.stats.fire > 0;

      move
        .toObject(player.axis)
        .times(ticker.deltaTime)
        .times(1.5)
        .times(player.speedMulty);

      this.bombs.updateIgnore(pos);

      pos
        .plus(move)
        .plus(this.world.getCorrect(pos.cdiv(32)).times(32))
        .plus(this.bombs.getCorrect(pos))
        .toObject(player);
    } else {
      move.set(0);
    }
  }
}