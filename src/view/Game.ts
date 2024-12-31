import { Container, Ticker } from "pixi.js";

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
import { heroes } from "$resources/image";
import { keys } from "$library/object";
import { nextTick } from "$library/utils";
import { randitem } from "$library/array";
import { vec2 } from "@vicimpa/lib-vec2";

const size = vec2(17);
const csize = size.cdiv(2).floor();

export class Game extends Container {
  ctrl?: Controller;

  view = this.add(Container);
  ruines = this.view.add(Ruines);
  world = this.view.add(World, generator3000(size.x, size.y, [csize]));
  bombs = this.view.add(Bombs, this);
  bonus = this.view.add(Bonuses, this);
  heroes = this.view.add(Container, { zIndex: 1 });
  fx = this.view.add(Effects, this);

  player?: Hero;

  move = vec2();

  stats = {
    append: 0,
    radius: 0,
    speed: 0,
    fire: 0,
    shield: 0,
  };

  constructor(public viewport: Viewport) {
    super();
  }

  death() {
    if (!this.player) return;
    if (this.stats.shield > 0) {
      this.stats.shield = 0;
      return;
    }
    const { player } = this;
    const pos = vec2(player);
    delete this.viewport.focus;
    delete this.player;
    this.viewport.center.set(0);
    nextTick(() => {
      this.fx.fire(player, pos);
      player.destroy();
    });

    navigator.vibrate([5, 5, 10, 5, 5, 10]);
    this.viewport.radius = (size.max() + 4) * 32;


    setTimeout(() => {
      this.parent.add(Game, this.viewport);
      this.destroy();
    }, 3000);
  }

  onMount(): void {
    this.ctrl = Controller.resolve(this);
    navigator.vibrate([5, 5]);
    const pos = size
      .cdiv(-2)
      .ceil()
      .times(32)
      .toObject(this.view)
      .times(-1);

    this.viewport.radius = (size.max() + 3) * 32;
    this.player = this.heroes.add(Hero, { type: randitem(keys(heroes)), ...pos });

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

      if (bonus?.type === 'shield') {
        this.stats.shield += 3500;
      }

      this.stats.speed = clamp(this.stats.speed - ticker.deltaTime, 0, Infinity);
      this.stats.fire = clamp(this.stats.fire - ticker.deltaTime, 0, Infinity);
      this.stats.shield = clamp(this.stats.shield - ticker.deltaTime, 0, Infinity);

      player.hasSpeed = this.stats.speed > 0;
      player.hasFire = this.stats.fire > 0;
      player.hasShield = this.stats.shield > 0;

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