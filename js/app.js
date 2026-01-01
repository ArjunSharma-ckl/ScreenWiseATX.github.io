
(() => {
  /* ---------- Scroll reveal ---------- */
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));

  /* ---------- Home tab always animated ---------- */
  document.querySelectorAll('.tab[data-href="index.html"]').forEach(tab => {
    tab.classList.add('is-active');
  });

  /* ---------- Dark mode button ---------- */
  const darkBtn = document.getElementById('darkBtn');
  const darkSaved = localStorage.getItem('darkMode') === 'true';

  if (darkSaved) document.body.classList.add('dark');
  if (darkBtn) darkBtn.classList.toggle('active', darkSaved);

  if (darkBtn) {
    darkBtn.addEventListener('click', () => {
      const enabled = !document.body.classList.contains('dark');
      document.body.classList.toggle('dark', enabled);
      localStorage.setItem('darkMode', enabled);
      darkBtn.classList.toggle('active', enabled);
    });
  }

  /* ---------- Language button ---------- */
  const langBtn = document.getElementById('langBtn');
  const savedLang = localStorage.getItem('lang') || 'en';

  const applyLang = (lang) => {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = lang === 'es' ? el.dataset.es : el.dataset.en;
    });
  };

  applyLang(savedLang);
  if (langBtn) langBtn.classList.toggle('active', savedLang === 'es');

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const nextLang = document.documentElement.lang === 'en' ? 'es' : 'en';
      localStorage.setItem('lang', nextLang);
      applyLang(nextLang);
      langBtn.classList.toggle('active', nextLang === 'es');
    });
  }
})();
