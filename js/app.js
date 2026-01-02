
document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.querySelector('.tab2-wrap');
  const menu = document.querySelector('.cancer-menu');
  if (!wrap || !menu) return;

  const show = () => {
    menu.style.display = 'grid';
  };

  const hide = () => {
    menu.style.display = 'none';
  };

  wrap.addEventListener('mouseenter', show);
  wrap.addEventListener('mouseleave', (e) => {
    if (!menu.contains(e.relatedTarget)) hide();
  });

  menu.addEventListener('mouseenter', show);
  menu.addEventListener('mouseleave', (e) => {
    if (!wrap.contains(e.relatedTarget)) hide();
  });
});
