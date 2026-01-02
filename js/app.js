
document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('langToggle');
  const wrap = document.querySelector('.tab2-wrap');
  const menu = document.querySelector('.cancer-menu');

  function applyLang(lang) {
    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = lang === 'es' ? el.dataset.es : el.dataset.en;
    });
  }

  // Load saved language
  const savedLang = localStorage.getItem('lang') || 'en';
  applyLang(savedLang);

  if (langToggle) {
    langToggle.checked = savedLang === 'es';
    langToggle.addEventListener('change', () => {
      const lang = langToggle.checked ? 'es' : 'en';
      localStorage.setItem('lang', lang);
      applyLang(lang);
    });
  }

  // Dropdown behavior (stable hover)
  if (wrap && menu) {
    wrap.addEventListener('mouseenter', () => {
      menu.style.display = 'grid';
    });
    wrap.addEventListener('mouseleave', (e) => {
      if (!menu.contains(e.relatedTarget)) {
        menu.style.display = 'none';
      }
    });
    menu.addEventListener('mouseenter', () => {
      menu.style.display = 'grid';
    });
    menu.addEventListener('mouseleave', (e) => {
      if (!wrap.contains(e.relatedTarget)) {
        menu.style.display = 'none';
      }
    });
  }
});
