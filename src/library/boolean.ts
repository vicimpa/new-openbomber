export const or = (...args: any[]): boolean => args.some(Boolean);
export const and = (...args: any[]): boolean => args.every(Boolean);
