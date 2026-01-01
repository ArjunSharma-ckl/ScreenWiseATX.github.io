
(() => {
  // Scroll reveal
  const els = Array.from(document.querySelectorAll('.reveal'));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
  els.forEach(el => io.observe(el));

  // Active tab highlight
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.tab[data-href]').forEach(a => {
    const href = (a.getAttribute('data-href') || '').toLowerCase();
    if (href === path) a.classList.add('is-active');
  });

  // Dark mode (persist)
  const darkToggle = document.getElementById('darkToggle');
  const savedDark = localStorage.getItem('darkMode') === 'true';
  if (savedDark) document.body.classList.add('dark');
  if (darkToggle) darkToggle.checked = savedDark;

  if (darkToggle) {
    darkToggle.addEventListener('change', () => {
      const enabled = darkToggle.checked;
      document.body.classList.toggle('dark', enabled);
      localStorage.setItem('darkMode', String(enabled));
    });
  }

  // Language (persist) using data-en/data-es attributes
  const langToggle = document.getElementById('langToggle');
  const savedLang = localStorage.getItem('lang') || 'en';

  const applyLang = (lang) => {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en]').forEach(el => {
      const en = el.getAttribute('data-en') || '';
      const es = el.getAttribute('data-es') || en;
      el.textContent = (lang === 'es') ? es : en;
    });
  };

  applyLang(savedLang);
  if (langToggle) langToggle.checked = savedLang === 'es';

  if (langToggle) {
    langToggle.addEventListener('change', () => {
      const lang = langToggle.checked ? 'es' : 'en';
      localStorage.setItem('lang', lang);
      applyLang(lang);
    });
  }
})();
