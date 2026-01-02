document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.querySelector('.tab2-wrap');
  const menu = document.querySelector('.cancer-menu');
  if (!wrap || !menu) return;

  let timeout;

  const openMenu = () => {
    clearTimeout(timeout);
    menu.style.display = 'grid';
  };

  const closeMenu = () => {
    timeout = setTimeout(() => {
      menu.style.display = 'none';
    }, 5000);
  };

  wrap.addEventListener('mouseenter', openMenu);
  wrap.addEventListener('mouseleave', closeMenu);
  menu.addEventListener('mouseenter', openMenu);
  menu.addEventListener('mouseleave', closeMenu);
});