
(() => {
  // reveal animations
  const els=document.querySelectorAll('.reveal');
  const io=new IntersectionObserver(e=>{
    e.forEach(x=>{
      if(x.isIntersecting){x.target.classList.add('show');io.unobserve(x.target);}
    })
  },{threshold:.15});
  els.forEach(el=>io.observe(el));

  // dark mode
  const d=document.getElementById('darkToggle');
  if(d){
    d.addEventListener('change',()=>{
      document.body.classList.toggle('dark',d.checked);
    });
  }

  // language
  const l=document.getElementById('langToggle');
  if(l){
    l.addEventListener('change',()=>{
      const lang=l.checked?'es':'en';
      document.querySelectorAll('[data-en]').forEach(el=>{
        el.textContent=lang==='es'?el.dataset.es:el.dataset.en;
      });
    });
  }
})();
