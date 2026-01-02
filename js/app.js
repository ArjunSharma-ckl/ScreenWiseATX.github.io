
document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('langToggle');
  const wrap = document.querySelector('.tab2-wrap');
  const menu = document.querySelector('.cancer-menu');

  function applyLang(lang) {
    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = lang === 'es' ? el.dataset.es : el.dataset.en;
    });
  }

  // Apply saved language on EVERY page
  const savedLang = localStorage.getItem('lang') || 'en';
  applyLang(savedLang);
  if (langToggle) langToggle.checked = savedLang === 'es';

  if (langToggle) {
    langToggle.addEventListener('change', () => {
      const lang = langToggle.checked ? 'es' : 'en';
      localStorage.setItem('lang', lang);
      applyLang(lang);
    });
  }

  // Desktop hover behavior
  if (wrap && menu) {
    wrap.addEventListener('mouseenter', () => {
      if (window.innerWidth > 900) menu.style.display = 'grid';
    });
    wrap.addEventListener('mouseleave', (e) => {
      if (window.innerWidth > 900 && !menu.contains(e.relatedTarget)) {
        menu.style.display = 'none';
      }
    });

    // Mobile tap-to-open
    wrap.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        menu.style.display = menu.style.display === 'grid' ? 'none' : 'grid';
      }
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 900 && !wrap.contains(e.target)) {
        menu.style.display = 'none';
      }
    });
  }
});
