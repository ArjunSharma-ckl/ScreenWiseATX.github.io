
(() => {
  const darkToggle = document.getElementById('darkToggle');
  const langToggle = document.getElementById('langToggle');

  if(darkToggle){
    darkToggle.addEventListener('change', () => {
      document.body.classList.toggle('dark', darkToggle.checked);
    });
  }

  if(langToggle){
    langToggle.addEventListener('change', () => {
      const lang = langToggle.checked ? 'es' : 'en';
      document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = lang === 'es'
          ? el.getAttribute('data-es')
          : el.getAttribute('data-en');
      });
    });
  }
})();
