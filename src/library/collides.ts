import { Vec2, vec2 } from "@vicimpa/lib-vec2";

export function cir2cir(a: Vec2, ar: number, b: Vec2, br: number) {
  const delta = a.cminus(b);
  const distance = a.distance(b);

  if (distance > ar + br)
    return null;

  if (distance === 0)
    return vec2(.1);

  const overlap = ar + br - distance;
  return delta.normalize().times(overlap);
}

export function cir2sqr(a: Vec2, ar: number, b: Vec2, br: number) {
  const closest = a.cclamp(b.cminus(br * .5), b.cplus(br * .5));

  if (a.distance(closest) >= ar)
    return null;

  const collision = a.cminus(closest);
  const length = collision.length();

  if (length === 0)
    return vec2(.1);

  return collision.div(length).times(ar - length);
}