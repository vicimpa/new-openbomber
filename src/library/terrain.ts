import { Texture } from "pixi.js";
import { vec2 } from "@vicimpa/lib-vec2";

export enum ETerrain {
  FREE = 0,
  CENTER = 1 << 0,
  TOP = 1 << 1,
  LEFT = 1 << 2,
  RIGHT = 1 << 3,
  BOTTOM = 1 << 4,
  TOP_LEFT = 1 << 5,
  TOP_RIGHT = 1 << 6,
  BOTTOM_LEFT = 1 << 7,
  BOTTOM_RIGHT = 1 << 8,
}

export const TerrainDirs = {
  [ETerrain.CENTER]: vec2(),
  [ETerrain.TOP]: vec2(0, -1),
  [ETerrain.LEFT]: vec2(-1, 0),
  [ETerrain.RIGHT]: vec2(1, 0),
  [ETerrain.BOTTOM]: vec2(0, 1),
  [ETerrain.TOP_LEFT]: vec2(-1, -1),
  [ETerrain.TOP_RIGHT]: vec2(1, -1),
  [ETerrain.BOTTOM_LEFT]: vec2(-1, 1),
  [ETerrain.BOTTOM_RIGHT]: vec2(1, 1),
};

export const join = (...args: ETerrain[]): number => {
  return args.reduce((a, b) => a | b, 0);
};

export const register = (textures: Texture[], flags: (ETerrain[] | number)[]) => {
  return textures.map((texture, index) => (
    [texture, (
      typeof flags[index] !== 'number' ? (
        join(...flags[index] ?? [0])
      ) : flags[index]
    )]
  )) as [texture: Texture, flags: number][];
};