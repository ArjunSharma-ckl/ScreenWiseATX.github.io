
(() => {
  // Dark mode
  const darkToggle = document.getElementById('darkToggle');
  if (darkToggle) {
    const saved = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark', saved);
    darkToggle.checked = saved;

    darkToggle.addEventListener('change', () => {
      localStorage.setItem('darkMode', darkToggle.checked);
      document.body.classList.toggle('dark', darkToggle.checked);
    });
  }

  // Language toggle (simple framework)
  const langToggle = document.getElementById('langToggle');
  const applyLang = (lang) => {
    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = lang === 'es' ? el.dataset.es : el.dataset.en;
    });
  };

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
})();
