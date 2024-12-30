import { random } from "@vicimpa/math";

export const from = <T>(length: number, calc: T | ((index: number) => T)) => {
  return Array.from({ length }, (_, i) => calc instanceof Function ? calc(i) : calc);
};

type SizedCollection<T> = {
  size: number;
  [Symbol.iterator](): Iterator<T>;
};

export const randcitem = <T>(collection: SizedCollection<T>) => {
  let item = random() * collection.size | 0;
  let iterator = collection[Symbol.iterator]();
  while (--item > 0) iterator.next();
  return iterator.next().value!;
};

export const randitem = <T>(array: T[]): T => {
  return array[random() * array.length | 0];
};