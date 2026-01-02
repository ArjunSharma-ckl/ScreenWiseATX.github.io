
(() => {
  const lang = document.getElementById('langToggle');
  if(lang){
    lang.addEventListener('change',()=>{
      const es = lang.checked;
      document.querySelectorAll('[data-en]').forEach(el=>{
        el.textContent = es ? el.dataset.es : el.dataset.en;
      });
    });
  }
})();
