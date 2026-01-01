/* Scroll reveal + small UI polish */
(function () {
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

  // Active tab highlight (basic)
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.tab[data-href]').forEach(a => {
    const href = (a.getAttribute('data-href') || '').toLowerCase();
    if (href === path) a.classList.add('is-active');
  });

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });
})();


// Dark mode toggle
const toggle = document.getElementById('themeToggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    toggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  });
}

// Dark mode toggle (real)
const darkToggle = document.getElementById('darkToggle');
if(darkToggle){
  darkToggle.addEventListener('change',()=>{
    document.body.classList.toggle('dark', darkToggle.checked);
  });
}

// Language toggle (basic framework)
const langToggle = document.getElementById('langToggle');
if(langToggle){
  langToggle.addEventListener('change',()=>{
    document.documentElement.lang = langToggle.checked ? 'es' : 'en';
    document.querySelectorAll('[data-es]').forEach(el=>{
      el.textContent = langToggle.checked ? el.dataset.es : el.dataset.en;
    });
  });
}

// Persist dark mode
const darkToggle = document.getElementById('darkToggle');
if(darkToggle){
  const savedDark = localStorage.getItem('darkMode') === 'true';
  darkToggle.checked = savedDark;
  document.body.classList.toggle('dark', savedDark);
  darkToggle.addEventListener('change',()=>{
    localStorage.setItem('darkMode', darkToggle.checked);
    document.body.classList.toggle('dark', darkToggle.checked);
  });
}

// Persist language
const langToggle = document.getElementById('langToggle');
if(langToggle){
  const savedLang = localStorage.getItem('lang') || 'en';
  langToggle.checked = savedLang === 'es';
  document.documentElement.lang = savedLang;

  document.querySelectorAll('[data-en]').forEach(el=>{
    el.textContent = savedLang === 'es' ? el.dataset.es : el.dataset.en;
  });

  langToggle.addEventListener('change',()=>{
    const lang = langToggle.checked ? 'es' : 'en';
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en]').forEach(el=>{
      el.textContent = lang === 'es' ? el.dataset.es : el.dataset.en;
    });
  });
}
