export const nextTick = (callback: () => any) => {
  var itsWork = true;
  Promise.resolve().then(() => itsWork && callback());
  return () => { itsWork = false; };
};