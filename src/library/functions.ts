export const once = <T extends (...args: any[]) => void>(fn: T) => {
  let call = false;
  return (...args: Parameters<T>) => {
    !(call || (call = true, fn(...args), call));
  };
};