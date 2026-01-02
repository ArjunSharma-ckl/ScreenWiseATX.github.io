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

  // Hide header on scroll down (mobile only)
  let lastScroll = 0;
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 768) {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('hide-on-scroll');
      } else {
        header.classList.remove('hide-on-scroll');
      }
      
      lastScroll = currentScroll;
    }
  });
});