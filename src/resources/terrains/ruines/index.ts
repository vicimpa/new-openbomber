import { ETerrain, join, register } from "$library/terrain";

import { ruines } from "$resources/image";

// Tileset res://images/ruines/ruines.png
// 5x4 (32x32)
export default register(ruines, [
  // Row 1 [
  join(ETerrain.FREE),
  join(ETerrain.CENTER, ETerrain.BOTTOM),
  join(ETerrain.TOP, ETerrain.CENTER, ETerrain.BOTTOM),
  join(ETerrain.CENTER, ETerrain.RIGHT),
  join(ETerrain.LEFT, ETerrain.CENTER, ETerrain.RIGHT),
  // ]

  // Row 2 [
  join(ETerrain.LEFT, ETerrain.CENTER, ETerrain.RIGHT),
  join(ETerrain.LEFT, ETerrain.CENTER),
  join(ETerrain.TOP, ETerrain.CENTER, ETerrain.BOTTOM),
  join(ETerrain.TOP, ETerrain.CENTER),
  join(ETerrain.CENTER),
  // ]

  // Row 3 [
  join(ETerrain.TOP, ETerrain.LEFT, ETerrain.RIGHT, ETerrain.BOTTOM, ETerrain.CENTER),
  join(ETerrain.TOP, ETerrain.LEFT, ETerrain.BOTTOM, ETerrain.CENTER),
  join(ETerrain.TOP, ETerrain.RIGHT, ETerrain.BOTTOM, ETerrain.CENTER),
  join(ETerrain.TOP, ETerrain.LEFT, ETerrain.CENTER),
  join(ETerrain.TOP, ETerrain.RIGHT, ETerrain.CENTER),
  // ]

  // Row 4 [
  join(ETerrain.LEFT, ETerrain.BOTTOM, ETerrain.CENTER),
  join(ETerrain.RIGHT, ETerrain.BOTTOM, ETerrain.CENTER),
  join(ETerrain.TOP, ETerrain.LEFT, ETerrain.RIGHT, ETerrain.CENTER),
  join(ETerrain.LEFT, ETerrain.RIGHT, ETerrain.BOTTOM, ETerrain.CENTER),
  join(ETerrain.FREE),
  // ]
]);