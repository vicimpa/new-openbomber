import { Vec2, vec2 } from "@vicimpa/lib-vec2";

import { clamp } from "@vicimpa/math";

export const vec2filter = (length: number) => {
  const data: Vec2[] = [];

  return (vec: Vec2) => {
    data.push(vec);
    data.splice(0, clamp(data.length - length, 0, length));
    return data.reduce((acc, e) => acc.plus(e), vec2()).div(data.length);
  };
};