
(() => {
  const dark=document.getElementById('darkToggle');
  const lang=document.getElementById('langToggle');

  if(dark){
    dark.addEventListener('change',()=>{
      document.body.classList.toggle('dark',dark.checked);
    });
  }

  if(lang){
    lang.addEventListener('change',()=>{
      const es=lang.checked;
      document.querySelectorAll('[data-en]').forEach(el=>{
        el.textContent = es ? el.dataset.es : el.dataset.en;
      });
    });
  }
})();
