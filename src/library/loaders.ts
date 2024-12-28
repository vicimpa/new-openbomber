import { entries, values } from "$library/object";
import { Assets, Spritesheet, SpritesheetData, Texture } from "pixi.js";

export type Frames<D extends SpritesheetData> = keyof D['frames'];
export type SplitFrame<F, S extends string> = F extends `${infer T}${S}${string}` ? T : never;

export async function loadSpritesheet<const D extends SpritesheetData>(
  data: D, image: string
) {
  const sprites = await new Spritesheet(
    await Assets.load(image),
    data
  ).parse();

  return sprites as Record<Frames<D>, Texture>;
}

export async function loadSpritesheetArray<const D extends SpritesheetData>(
  data: D, image: string
) {
  const sprites = await new Spritesheet(
    await Assets.load(image),
    data
  ).parse();

  return values(sprites);
}

export async function loadSpritesheetSplited<
  const D extends SpritesheetData,
  const S extends string
>(data: D, image: string, sep: S) {
  const loaded = await loadSpritesheet(data, image);
  const output: Record<string, Texture[]> = {};

  entries(loaded)
    .forEach(([key, value]) => {
      const [tag] = String(key).split(sep);
      Object.assign(output, {
        [tag]: (
          output[tag] ?? []
        ).concat(value)
      });
    });

  return output as Record<SplitFrame<Frames<D>, S>, Texture[]>;
}