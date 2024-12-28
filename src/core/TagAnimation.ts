import { Texture } from "pixi.js";
import { Animation, AnimationOptions } from "./Animation";
import { keys } from "$library/object";

export type TagAnimationOptions<T extends Record<string, Texture[]>> = {
  animation?: keyof T;
} & Omit<AnimationOptions, 'textures'>;

export class TagAnimation<const T extends Record<string, Texture[]>> extends Animation {
  #animation!: keyof T;

  get animation() {
    return this.#animation;
  }

  set animation(value) {
    this.#animation = value;
    this.textures = this.source[value] ?? [];
  }

  constructor(public source: T, {
    animation = keys(source)[0],
    ...other
  }: TagAnimationOptions<T>) {
    super([], other);
    this.animation = animation;
  };
}