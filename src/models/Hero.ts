import { Container, ContainerOptions, Sprite, Texture, Ticker } from "pixi.js";
import { dust, effects, heroes } from "$resources/image";

import { Animation } from "$core/Animation";
import { TagAnimation } from "$core/TagAnimation";
import { abs } from "@vicimpa/math";
import { assign } from "$library/object";
import { vec2 } from "@vicimpa/lib-vec2";

export type HeroDir = 'Up' | 'Left' | 'Right' | 'Down';

export type HeroOptions = {
  type?: keyof typeof heroes;
  hasBomb?: boolean;
  hasFire?: boolean;
  hasSpeed?: boolean;
  hasCrazy?: boolean;
  hasKicking?: boolean;
  hasShield?: boolean;
} & ContainerOptions;

export class Hero extends Container {
  type!: keyof typeof heroes;
  hasBomb!: boolean;
  hasFire!: boolean;
  hasSpeed!: boolean;
  hasShield!: boolean;
  hasCrazy!: boolean;
  hasKicking!: boolean;

  axis = vec2();

  #dir: HeroDir = 'Down';

  get dir() {
    if (!this.isRun)
      return this.#dir;

    if (abs(this.axis.x) >= abs(this.axis.y))
      return this.#dir = this.axis.x < 0 ? 'Left' : 'Right';

    return this.#dir = this.axis.y < 0 ? 'Up' : 'Down';
  }

  get isRun() {
    return !this.axis.equal(0);
  }

  get speedMulty() {
    return (1
      * (this.hasSpeed ? 1.3 : 1)
      * (this.hasFire ? .5 : 1)
    );
  }

  upper = this.add(Container, { y: -8 });
  shieldBack = this.upper.add(Animation, effects.shield.back, { anchor: .5, speed: .5 });
  fireBack = this.upper.add(Animation, effects.fire.back, { anchor: .5, speed: .3 });
  dustBack = this.upper.add(Sprite, { anchor: .5 });
  hero = this.upper.addChild(new TagAnimation(heroes.type1, { anchor: .5 }));
  dustFront = this.upper.add(Sprite, { anchor: .5 });
  fireFront = this.upper.add(Animation, effects.fire.front, { anchor: .5, speed: .3 });
  shieldFront = this.upper.add(Animation, effects.shield.front, { anchor: .5, speed: .5 });
  crazy = this.upper.add(Animation, effects.crazy, { anchor: .5, speed: .2, scale: 2 });
  kicking = this.upper.add(Animation, effects.kicking, { anchor: .5, speed: .1, scale: 2 });

  constructor(props: HeroOptions = {}) {
    const {
      type = 'type1',
      hasBomb = false,
      hasCrazy = false,
      hasFire = false,
      hasKicking = false,
      hasSpeed = false,
      hasShield = false,
      ...other
    } = props;
    super(other);
    assign(this, {
      type,
      hasBomb,
      hasCrazy,
      hasFire,
      hasSpeed,
      hasKicking,
      hasShield
    });
  }

  onTick(_: Ticker): void {
    const { isRun, dir, hasBomb, type, hasSpeed } = this;
    const a = isRun ? 'Run' : 'Idle';
    const b = dir === 'Left' ? 'Right' : dir;
    const c = hasBomb ? 'Bomb' : '';

    this.zIndex = this.y * .00001;
    this.fireBack.visible = this.hasFire;
    this.fireFront.visible = this.hasFire;
    this.shieldBack.visible = this.hasShield;
    this.shieldFront.visible = this.hasShield;
    this.crazy.visible = this.hasCrazy;
    this.kicking.visible = this.hasKicking;

    this.hero.source = heroes[type];
    this.hero.animation = `${a}${b}${c}`;
    this.hero.start = isRun ? 1 : 0;
    this.hero.scale.x = dir === 'Left' ? -1 : 1;
    this.hero.speed = isRun ? 0.20 * this.speedMulty : .05;
    this.dustBack.scale.x = dir === 'Left' ? -1 : 1;
    this.dustFront.scale.x = dir === 'Left' ? -1 : 1;
    this.dustBack.texture = hasSpeed ? dust[`back${this.hero.animation}`][this.hero.frame] : Texture.EMPTY;
    this.dustFront.texture = hasSpeed ? dust[`front${this.hero.animation}`][this.hero.frame] : Texture.EMPTY;
  }
}