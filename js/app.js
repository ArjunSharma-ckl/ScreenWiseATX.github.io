// Build page summaries for the chatbot
function buildPageSummaries() {
  return {
    'index.html': {
      en: 'Home page with information about cancer screening and prevention.',
      es: 'Página de inicio con información sobre detección y prevención del cáncer.'
    },
    'breast-learn.html': {
      en: 'Information about breast cancer, including risk factors and screening recommendations.',
      es: 'Información sobre el cáncer de mama, incluyendo factores de riesgo y recomendaciones de detección.'
    },
    'cervical-learn.html': {
      en: 'Information about cervical cancer, including risk factors and screening recommendations.',
      es: 'Información sobre el cáncer de cuello uterino, incluyendo factores de riesgo y recomendaciones de detección.'
    },
    'colon-learn.html': {
      en: 'Information about colon cancer, including risk factors and screening recommendations.',
      es: 'Información sobre el cáncer de colon, incluyendo factores de riesgo y recomendaciones de detección.'
    },
    'lung-learn.html': {
      en: 'Information about lung cancer, including risk factors and screening recommendations.',
      es: 'Información sobre el cáncer de pulmón, incluyendo factores de riesgo y recomendaciones de detección.'
    },
    'prostate-learn.html': {
      en: 'Information about prostate cancer, including risk factors and screening recommendations.',
      es: 'Información sobre el cáncer de próstata, incluyendo factores de riesgo y recomendaciones de detección.'
    },
    'screening-info.html': {
      en: 'Information about different types of cancer screening methods and routines.',
      es: 'Información sobre diferentes tipos de métodos y rutinas de detección de cáncer.'
    },
    'free-screening.html': {
      en: 'Information about free and low-cost cancer screening options.',
      es: 'Información sobre opciones de detección de cáncer gratuitas y de bajo costo.'
    },
    'default': {
      en: 'Key details about screening options, timing, and prevention.',
      es: 'Detalles clave sobre opciones, tiempos y prevención de detección.'
    }
  };
}

const pageSummaries = buildPageSummaries();

document.addEventListener('DOMContentLoaded', () => {
  // Language Toggle Functionality
  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en]').forEach(el => {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = lang === 'es' ? (el.dataset.es || '') : (el.dataset.en || '');
      } else {
        el.textContent = lang === 'es' ? (el.dataset.es || el.textContent) : (el.dataset.en || el.textContent);
      }
    });
    
    // Update toggle button text
    const toggleLabel = document.querySelector('.toggle span:first-child');
    if (toggleLabel) {
      toggleLabel.textContent = lang === 'es' ? 'English' : 'Español';
    }

    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  // Initialize language from localStorage or browser language
  const userLang = localStorage.getItem('lang') || 
                  (navigator.language.startsWith('es') ? 'es' : 'en');
  
  // Apply language
  applyLang(userLang);

  // Language toggle event listener
  const toggle = document.getElementById('langToggle');
  if (toggle) {
    toggle.checked = userLang === 'es';
    toggle.addEventListener('change', () => {
      const newLang = toggle.checked ? 'es' : 'en';
      localStorage.setItem('lang', newLang);
      applyLang(newLang);
      
      // Add animation class to show language change
      document.body.classList.add('lang-change');
      setTimeout(() => document.body.classList.remove('lang-change'), 300);
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Add animation on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.cancer-card, .stat-item, .team-member');
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (elementPosition < screenPosition) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  // Initialize animation states
  window.addEventListener('load', () => {
    document.querySelectorAll('.cancer-card, .stat-item, .team-member').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Trigger initial animation
    setTimeout(animateOnScroll, 100);
  });

  // Animate on scroll
  window.addEventListener('scroll', animateOnScroll);

  // Mobile menu toggle
  const mobileMenuToggle = document.createElement('button');
  mobileMenuToggle.className = 'mobile-menu-toggle';
  mobileMenuToggle.innerHTML = '';
  mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
  
  const header = document.querySelector('header');
  const nav = header ? header.querySelector('.tabs') : null;
  
  if (header && nav) {
    // Create a container for the mobile menu button
    const menuContainer = document.createElement('div');
    menuContainer.className = 'mobile-menu-container';
    menuContainer.appendChild(mobileMenuToggle);
    
    // Insert the container before the nav (safely check if nav is a child)
    if (nav && nav.parentNode === header) {
      header.insertBefore(menuContainer, nav);
    } else if (header) {
      // Fallback: append to header if nav doesn't exist or isn't a child
      header.appendChild(menuContainer);
    }
    
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('active') && !nav.contains(e.target) && e.target !== mobileMenuToggle) {
        nav.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      }
    });
  }

  // Add hover effect to buttons
  document.querySelectorAll('a, button').forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });
  });

  // Initialize tooltips
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  tooltipElements.forEach(el => {
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = el.getAttribute('data-tooltip');
    el.appendChild(tooltip);
    
    el.addEventListener('mouseenter', () => {
      tooltip.style.visibility = 'visible';
      tooltip.style.opacity = '1';
    });
    
    el.addEventListener('mouseleave', () => {
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity = '0';
    });
  });

  // Add loading animation
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'loading-overlay';
  document.body.appendChild(loadingOverlay);
  
  window.addEventListener('load', () => {
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 300);
  });

  // Page-level UI enhancements (DOM-based so we don't need to edit HTML/CSS files directly)
  const page = document.body.dataset.page || (location.pathname.split('/').pop() || '');
  try { if (page === 'index.html') { injectHomeStyles(); relocateCardsUnderWhy(); } } catch (e) {}
  try { if (page === 'free-screening.html') { enhanceFreeScreening(); } } catch (e) {}
  try { renderMiniSummaryCard(); } catch (e) {}

  function injectHomeStyles() {
    if (document.getElementById('home-scoped-styles')) return;
    const style = document.createElement('style');
    style.id = 'home-scoped-styles';
    style.textContent = `
      .cancer-type-cards {display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;margin-top:1.5rem}
      .cancer-card{display:block;padding:1.25rem 1.25rem 1rem;background:linear-gradient(180deg,#fff 0%,#f8fafc 100%);border-radius:16px;border:1px solid #e5e7eb;box-shadow:0 8px 20px rgba(15,23,42,.06);text-decoration:none;transition:transform .2s ease,box-shadow .2s ease}
      .cancer-card h3{margin:0 0 .25rem 0;color:#0f172a}
      .cancer-card p{margin:0 0 .75rem 0;color:#475569}
      .cancer-card:hover{transform:translateY(-4px);box-shadow:0 14px 30px rgba(15,23,42,.12)}
      .cancer-tags{display:flex;flex-wrap:wrap;gap:.5rem}
      .tag{display:inline-block;padding:.35rem .6rem;font-size:.8rem;background:#eef2ff;color:#1e40af;border-radius:999px;border:1px solid #e5e7eb}
      .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem;margin-top:1.25rem}
      .stat-item{background:linear-gradient(180deg,rgba(255,255,255,.75),rgba(255,255,255,.55));backdrop-filter:blur(6px);border:1px solid rgba(226,232,240,.9);border-radius:16px;padding:1rem 1.25rem;box-shadow:0 8px 20px rgba(15,23,42,.08)}
      .stat-number{display:block;font-size:2rem;font-weight:800;color:#0f172a}
      .stat-label{display:block;margin-top:.35rem;color:#334155}
    `;
    document.head.appendChild(style);
  }

  function relocateCardsUnderWhy() {
    const hero = document.querySelector('.hero.hero-home');
    if (!hero) return;
    const container = hero.querySelector('.container');
    if (!container) return;
    const title = container.querySelector('h1');
    const intro = container.querySelector('p');
    const cardGrid = container.querySelector('.cancer-type-cards');

    // Remove hero title
    if (title) title.remove();
    // Keep intro text to show near the grid under Why It Matters
    const why = document.querySelector('.why-it-matters .container');
    if (!why || !cardGrid) return;

    if (intro) {
      const introClone = intro.cloneNode(true);
      why.appendChild(introClone);
      intro.remove();
    }
    why.appendChild(cardGrid);
  }

  function enhanceFreeScreening() {
    document.querySelectorAll('p').forEach(p => {
      let html = p.innerHTML;
      html = html.replace(/\bcommunitycaretx\.org\b/g, '<a href="https://communitycaretx.org" target="_blank" rel="noopener">communitycaretx.org<\/a>');
      html = html.replace(/\baustinpcc\.org\b/g, '<a href="https://austinpcc.org" target="_blank" rel="noopener">austinpcc.org<\/a>');
      html = html.replace(/\bhhs\.texas\.gov\b/g, '<a href="https://www.hhs.texas.gov" target="_blank" rel="noopener">hhs.texas.gov<\/a>');
      html = html.replace(/\bcancer\.org\b/g, '<a href="https://www.cancer.org" target="_blank" rel="noopener">cancer.org<\/a>');
      p.innerHTML = html;
    });
  }

  function renderMiniSummaryCard() {
    const container = document.querySelector('.chatgpt-section .container') || document.querySelector('footer')?.previousElementSibling || document.body;
    const key = document.body.dataset.page || 'default';
    const summary = pageSummaries[key] || pageSummaries.default;
    const lang = document.documentElement.lang || 'en';
    const text = summary?.[lang] || summary?.en || '';
    if (!container || !text) return;

    // If an existing helper card is present, skip
    if (document.querySelector('.mini-summary-card')) return;

    const card = document.createElement('div');
    card.className = 'chatgpt-card mini-summary-card';
    card.style.marginTop = '1.5rem';
    card.innerHTML = `
      <div>
        <h3>${lang === 'es' ? 'En pocas palabras' : 'Quick snapshot'}</h3>
        <p>${text}</p>
      </div>
      <button class="chatgpt-btn" type="button">${lang === 'es' ? 'Ampliar en el chat' : 'Open ChatWise'}</button>
    `;

    // Button toggles chatbot open
    card.querySelector('.chatgpt-btn').addEventListener('click', () => {
      const evt = new Event('click');
      (document.querySelector('.chat-toggle') || document.querySelector('.chatbot-toggle'))?.dispatchEvent(evt);
    });

    // Insert before footer if possible
    const parent = container.parentElement || document.body;
    parent.insertBefore(card, document.querySelector('footer'));
  }

  // Make buildPageSummaries available globally
  if (!window.buildPageSummaries) {
    window.buildPageSummaries = buildPageSummaries;
  }
});
