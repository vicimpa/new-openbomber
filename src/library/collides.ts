import { Vec2, vec2 } from "@vicimpa/lib-vec2";

export function circle2circle(a: Vec2, ar: number, b: Vec2, br: number) {
  const delta = a.cminus(b);
  const distance = a.distance(b);

  if (distance > ar + br)
    return vec2();

  if (distance === 0)
    return vec2(.1, 0);

  const overlap = ar + br - distance;
  return delta.normalize().times(overlap);
}

export function circle2square(a: Vec2, ar: number, b: Vec2, br: number) {
  const closest = a.clone()
    .cropMin(b.cminus(br * .5))
    .cropMax(b.cplus(br * .5));

  if (a.distance(closest) >= ar)
    return vec2();

  const collision = a.cminus(closest);
  const length = collision.length();

  if (length === 0)
    return vec2(.1, 0);

  return collision.div(length).times(ar - length);
}