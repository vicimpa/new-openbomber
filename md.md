Привет. Ты очень умный помощник на базе ИИ. Твоя задача реализовать простейший движок колизий, основаня задача которого будет в том, чтобы находить коллизии, и расчитывать вектор выталкивания объектов друг из друга. Что из себя представляют объекты:

```ts
type RigitBody = {
  pos: {
    x: number;
    y: number;
  };
  shapes: (
    {
      type: 'rect',
      params: [x: number, y: number, w: number, h: number];
    } |
    {
      type: 'circle',
      params: [x: number, y: number, r: number];
    } |
    {
      type: '"roundRect"',
      params: [x: number, y: number, w: number, h: number];
    }
  );
};
```

