
document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('langToggle');

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
});
