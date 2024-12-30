export const or = (...args: any[]) => {
  return args.findIndex(e => e) !== -1;
};

export const and = (...args: any[]) => {
  return args.findIndex(e => !e) === -1;
};