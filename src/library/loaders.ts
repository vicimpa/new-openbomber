import { assign, entries, values } from "$library/object";
import { Assets, Rectangle, Spritesheet, SpritesheetData, SpritesheetFrameData, Texture } from "pixi.js";

export type Frames<D extends SpritesheetData> = keyof D['frames'];
export type SplitFrame<F, S extends string> = F extends `${infer T}${S}${string}` ? T : never;

const tasks: Promise<any>[] = [];

type SpritesheetDataArray = Omit<SpritesheetData, 'frames'> & {
  frames: (SpritesheetFrameData & { filename: string; })[];
};

export const awaitAllTasks = () => Promise.all(tasks);

export const awaitAllTasksSignal = (callback: (count: number, ammount: number) => void) => {
  let i = 0;
  return Promise.all(tasks.map(e => e.then(() => { callback(++i, tasks.length); })));
};

export function loadSpritesheet<const D extends SpritesheetData>(
  data: D, image: string
) {
  const output = entries(data.frames)
    .reduce((acc, [key]) => {
      return assign(acc, {
        [key]: new Texture()
      });
    }, {} as Record<Frames<D>, Texture>);

  tasks.push(
    Assets.load<Texture>(image)
      .then(texture => new Spritesheet(texture, data))
      .then(sprites => sprites.parse())
      .then(parsedData => {
        entries(parsedData)
          .forEach(([key, value]) => {
            assign(output[key], value);
            output[key].update();
          });
      })
  );

  return output;
}

export function loadSpritesheetArray<const D extends SpritesheetData>(
  data: D, image: string
) {
  return values(loadSpritesheet(data, image));
}

export function loadSpritesheetFromArra<const D extends SpritesheetDataArray>(
  data: D, image: string
) {
  const output = data.frames.map(() => {
    return new Texture();
  });

  tasks.push(
    Assets.load<Texture>(image)
      .then(texture => {
        output.map((item, index) => {
          const { frame } = data.frames[index];
          assign(item, new Texture({
            source: texture.source,
            frame: new Rectangle(frame.x, frame.y, frame.w, frame.h)
          }));
          item.update();
        });
      })
  );

  return output;
}

export function loadSpritesheetSplited<
  const D extends SpritesheetData,
  const S extends string
>(data: D, image: string, sep: S) {
  const loaded = loadSpritesheet(data, image);
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