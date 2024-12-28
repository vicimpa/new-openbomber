export function bounce(v: number) {
  const n1 = 7.5625;
  const d1 = 2.75;

  v *= d1 / 2;
  v += - 1 / d1;

  if (v < 1 / d1) {
    return n1 * v * v;
  } else if (v < 2 / d1) {
    return n1 * (v -= 1.5 / d1) * v + 0.75;
  } else if (v < 2.5 / d1) {
    return n1 * (v -= 2.25 / d1) * v + 0.9375;
  } else {
    return n1 * (v -= 2.625 / d1) * v + 0.984375;
  }
}