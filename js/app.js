
(() => {
  const dark = document.getElementById('darkToggle');
  const lang = document.getElementById('langToggle');

  function applyLang(isES){
    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = isES ? el.dataset.es : el.dataset.en;
    });
  }

  if(dark){
    dark.addEventListener('change',()=>{
      document.body.classList.toggle('dark',dark.checked);
    });
  }

  if(lang){
    lang.addEventListener('change',()=>{
      applyLang(lang.checked);
    });
  }
})();
