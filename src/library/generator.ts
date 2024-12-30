import { Vec2, Vec2Set } from "@vicimpa/lib-vec2";
import { from, randcitem } from "./array";

import { Tile } from "$models/World";

export const generator3000 = (width: number, height: number, positions: Vec2[]) => {
  const free = new Vec2Set();

  const map = from(height, (y) => (
    from<Tile>(width, (x) => {
      if (x < 0 || y < 0 || x == width || y == height)
        return 'wall';

      if (x & 1 && y & 1)
        return 'wall';

      free.add(x, y);

      return '';
    })
  ));

  positions.forEach(dir => {
    free.delete(dir);
    for (let i = 1; i <= 2; i++) {
      free.delete(dir.cplus(i, 0));
      free.delete(dir.cplus(-i, 0));
      free.delete(dir.cplus(0, i));
      free.delete(dir.cplus(0, -i));
    }
  });

  const size = free.size * .7 | 0;

  for (let i = 0; i < size; i++) {
    const vec = randcitem(free);
    free.delete(vec);
    map[vec.y][vec.x] = 'box';
  }

  return map;
};