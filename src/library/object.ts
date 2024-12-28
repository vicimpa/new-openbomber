type Assign<T extends object[]> = T extends [infer F, ...infer R]
  ? F & Assign<R extends object[] ? R : []> : {};

export const { keys, values, entries, assign } = Object as {
  keys<T extends object>(obj: T): (keyof T)[];
  values<T extends object>(obj: T): T[keyof T][];
  entries<T extends object>(obj: T): [key: keyof T, value: T[keyof T]][];
  assign<T extends object[]>(...obj: T): Assign<T>;
};

export function* flat<T>(tree: T, children: (tree: T) => T[]) {
  const stack = [[tree][Symbol.iterator]()];

  while (stack.length) {
    var next = stack.at(-1)?.next();

    if (!next || next.done) {
      stack.pop();
      continue;
    }

    yield next.value;

    const child = children(next.value);

    if (child.length)
      stack.push(child[Symbol.iterator]());
  }
}