import { Container, Ticker } from "pixi.js";
import { Vec2, vec2 } from "@vicimpa/lib-vec2";

import { Bombs } from "./Bombs";
import { Bonuses } from "./Bonuses";
import { Controller } from "$core/Controller";
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
  ctrl?: Controller;

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
    this.ctrl = Controller.resolve(this);

    const pos = size
      .cdiv(-2)
      .ceil()
      .times(32)
      .toObject(this.view)
      .times(-1);

    this.viewport.radius = (size.max() + 3) * 32;
    this.player = this.heroes.add(Hero, { type: 'type8', ...pos });

    this.viewport.focus = this.player;
    this.viewport.radius = 256;
  }

  onTick(ticker: Ticker): void {
    const { player, bombs, ctrl } = this;

    if (player && ctrl) {
      if (ctrl.isBomb()) {
        if (bombs.children.length < this.stats.append + 1)
          bombs.spawn(vec2(player), this.stats.radius + 1);
      }

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

      ctrl.move
        .toObject(player.axis)
        .times(ticker.deltaTime)
        .times(1.5)
        .times(player.speedMulty);

      this.bombs.updateIgnore(pos);

      pos
        .plus(ctrl.move)
        .plus(this.world.getCorrect(pos.cdiv(32)).times(32))
        .plus(this.bombs.getCorrect(pos))
        .toObject(player);
    }
  }
}