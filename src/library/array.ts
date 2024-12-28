import { random } from "@vicimpa/math";

export const from = <T>(length: number, calc: T | ((index: number) => T)) => {
  return Array.from({ length }, (_, i) => calc instanceof Function ? calc(i) : calc);
};

export const randitem = <T>(array: T[] | Set<T>): T => {
  if (array instanceof Set) {
    let item = random() * array.size | 0;
    let iterator = array[Symbol.iterator]();
    while (--item > 0) iterator.next();
    return iterator.next().value!;
  }

  return array[random() * array.length | 0];
};