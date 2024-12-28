import { Vec2Args, vec2, vec2run } from "@vicimpa/lib-vec2";

export type VHash = `${number}:${number}`;

export const vhash = (...args: Vec2Args) => (
  vec2run(args, (x, y) => {
    return `${x}:${y}` as VHash;
  })
);

export const vparse = (input: VHash) => (
  vec2(
    ...input
      .split(':')
      .map(Number) as [number, number]
  )
);