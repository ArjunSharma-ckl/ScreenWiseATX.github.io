
document.addEventListener('DOMContentLoaded', () => {
  function applyLang(lang) {
    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = lang === 'es' ? el.dataset.es : el.dataset.en;
    });
  }

  const lang = localStorage.getItem('lang') || 'en';
  applyLang(lang);

  const toggle = document.getElementById('langToggle');
  if (toggle) {
    toggle.checked = lang === 'es';
    toggle.addEventListener('change', () => {
      const newLang = toggle.checked ? 'es' : 'en';
      localStorage.setItem('lang', newLang);
      applyLang(newLang);
    });
  }
});
