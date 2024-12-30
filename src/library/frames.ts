export const frames = (callback: (dt: number, t: number) => any) => {
  var time = -1, raf = requestAnimationFrame(loop);

  function loop(_time: number) {
    raf = requestAnimationFrame(loop);
    callback(_time - time, time = _time);
  }

  return () => {
    cancelAnimationFrame(raf);
  };
};