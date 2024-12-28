addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS')
    e.preventDefault();
});

addEventListener('contextmenu', (e) => {
  e.preventDefault();
});