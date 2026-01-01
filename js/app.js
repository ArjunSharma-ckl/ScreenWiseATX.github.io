
(() => {
  const darkToggle = document.getElementById('darkToggle');
  const langToggle = document.getElementById('langToggle');

  if(darkToggle){
    darkToggle.checked = false;
    darkToggle.addEventListener('change', () => {
      document.body.classList.toggle('dark', darkToggle.checked);
    });
  }

  if(langToggle){
    langToggle.checked = false;
    langToggle.addEventListener('change', () => {
      const lang = langToggle.checked ? 'es' : 'en';
      document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = lang === 'es' ? el.dataset.es : el.dataset.en;
      });
    });
  }
})();
