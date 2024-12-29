import { Vec2, Vec2Hash, vec2 } from "@vicimpa/lib-vec2";
import { from, randitem } from "./array";

import { Tile } from "$models/World";

export const generator3000 = (width: number, height: number, positions: Vec2[]) => {
  const free = new Set<Vec2Hash>();

  const map = from(height, (y) => (
    from<Tile>(width, (x) => {
      if (x < 0 || y < 0 || x == width || y == height)
        return 'wall';

      if (x & 1 && y & 1)
        return 'wall';

      free.add(vec2(x, y).hash);

      return '';
    })
  ));

  positions.forEach(dir => {
    free.delete(dir.hash);
    for (let i = 1; i < 3; i++) {
      free.delete(dir.cplus(i, 0).hash);
      free.delete(dir.cplus(-i, 0).hash);
      free.delete(dir.cplus(0, i).hash);
      free.delete(dir.cplus(0, -i).hash);
    }
  });

  const size = free.size * .7 | 0;

  for (let i = 0; i < size; i++) {
    const hash = randitem(free);
    const vec = Vec2.fromHash(hash);
    free.delete(hash);
    map[vec.y][vec.x] = 'box';
  }

  return map;
};