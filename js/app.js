
(() => {
  const darkToggle = document.getElementById('darkToggle');
  const langToggle = document.getElementById('langToggle');

  // Dark mode toggle
  if(darkToggle){
    darkToggle.addEventListener('change', () => {
      document.body.classList.toggle('dark', darkToggle.checked);
    });
  }

  // Language toggle
  if(langToggle){
    langToggle.addEventListener('change', () => {
      const lang = langToggle.checked ? 'es' : 'en';
      document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = lang === 'es' ? el.dataset.es : el.dataset.en;
      });
    });
  }
})();
