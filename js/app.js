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
  mobileMenuToggle.innerHTML = '☰';
  mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
  
  const header = document.querySelector('header');
  const nav = header ? header.querySelector('.tabs') : null;
  
  if (header && nav) {
    header.insertBefore(mobileMenuToggle, nav);
    
    mobileMenuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && e.target !== mobileMenuToggle) {
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
        <h3>${lang === 'es' ? 'Resumen rápido' : 'Quick Summary'}</h3>
        <p>${text}</p>
      </div>
      <button class="chatgpt-btn" type="button">${lang === 'es' ? 'Ampliar en el chat' : 'Open Assistant'}</button>
    `;

    // Button toggles chatbot open
    card.querySelector('.chatgpt-btn').addEventListener('click', () => {
      const evt = new Event('click');
      document.querySelector('.chatbot-toggle')?.dispatchEvent(evt);
    });

    // Insert before footer if possible
    const parent = container.parentElement || document.body;
    parent.insertBefore(card, document.querySelector('footer'));
  }
});

// Chatbot functionality
class Chatbot {
  constructor() {
    this.lang = document.documentElement.lang || 'en';
    this.pageKey = document.body.dataset.page || (location.pathname.split('/').pop() || 'index.html');
    this.pageSummaries = pageSummaries;
    this.currentContext = 'idle';
    this.hasGreeted = false;

    this.chatContainer = document.createElement('div');
    this.chatContainer.className = 'chatbot-container';
    this.chatContainer.innerHTML = `
      <div class="chatbot-header">
        <span data-en="Cancer Screening Assistant" data-es="Asistente de Detección de Cáncer">Cancer Screening Assistant</span>
        <button class="chatbot-close">×</button>
      </div>
      <div class="chatbot-messages"></div>
      <div class="chatbot-input">
        <input type="text" placeholder="Ask me about cancer screening..." data-en="Ask me about cancer screening..." data-es="Pregúntame sobre detección de cáncer...">
        <button class="chatbot-send">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    `;
    
    this.messages = [];
    this.isOpen = false;
    this.init();
  }
  
  init() {
    // Add chatbot to the page
    document.body.appendChild(this.chatContainer);
    
    // Add toggle button
    this.toggleButton = document.createElement('button');
    this.toggleButton.className = 'chatbot-toggle';
    this.toggleButton.innerHTML = '💬';
    this.toggleButton.setAttribute('aria-label', 'Open chat');
    document.body.appendChild(this.toggleButton);
    
    // Event listeners
    this.toggleButton.addEventListener('click', () => this.toggleChat());
    this.chatContainer.querySelector('.chatbot-close').addEventListener('click', () => this.toggleChat());
    this.chatContainer.querySelector('.chatbot-send').addEventListener('click', () => this.sendMessage());
    this.chatContainer.querySelector('input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    
    document.addEventListener('langchange', (event) => {
      this.lang = event.detail.lang;
    });
    
    // No auto-greeting; wait for user input
  }
  
  toggleChat() {
    this.isOpen = !this.isOpen;
    this.chatContainer.style.transform = this.isOpen ? 'translateY(0)' : 'translateY(100%)';
    this.toggleButton.style.display = this.isOpen ? 'none' : 'flex';
    
    if (this.isOpen) {
      this.chatContainer.querySelector('input').focus();
    }
  }
  
  addMessage(text, isUser = false) {
    const message = document.createElement('div');
    message.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    message.textContent = text;
    
    const messagesContainer = this.chatContainer.querySelector('.chatbot-messages');
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return message;
  }
  
  addBotMessage(text) {
    const message = this.addMessage(text, false);
    
    // Add typing indicator
    message.textContent = '';
    message.style.opacity = '0.7';
    
    let i = 0;
    const speed = 20; // milliseconds per character
    
    const typeWriter = () => {
      if (i < text.length) {
        message.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      } else {
        message.style.opacity = '1';
      }
    };
    
    setTimeout(typeWriter, 500); // Small delay before starting to type
  }
  
  getHighlightedText() {
    const selection = window.getSelection();
    if (!selection) return '';
    return selection.toString().trim();
  }

  getLocalizedString(key, interpolation) {
    const strings = {
      fallback: {
        en: 'I\'m here to help with cancer screening questions. Could you share a bit more detail?',
        es: 'Estoy aquí para ayudarte con preguntas sobre detección de cáncer. ¿Puedes compartir un poco más de detalle?'
      }
    };
    const value = strings[key];
    if (!value) return '';
    const localized = value[this.lang] || value.en;
    return typeof localized === 'function' ? localized(interpolation) : localized;
  }

  getContextLabel(intent) {
    const labels = {
      breast: this.lang === 'es' ? 'detección de mama' : 'breast screening',
      cervical: this.lang === 'es' ? 'detección cervical' : 'cervical screening',
      colon: this.lang === 'es' ? 'detección de colon' : 'colon screening',
      'lung-prostate': this.lang === 'es' ? 'detección de pulmón/prostata' : 'lung/prostate screening',
      financial: this.lang === 'es' ? 'programas financieros' : 'financial programs',
      clinic: this.lang === 'es' ? 'clínicas locales' : 'local clinics'
    };
    return labels[intent] || (this.lang === 'es' ? 'detección' : 'screening');
  }

  async sendMessage() {
    const input = this.chatContainer.querySelector('input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    this.addMessage(message, true);
    input.value = '';
    const highlighted = this.getHighlightedText();
    const lower = message.toLowerCase();
    const immediate = this.getResponse(lower, highlighted);
    
    // Post a quick typing delay then answer; if cross-page info is relevant, augment
    setTimeout(async () => {
      if (highlighted) {
        const snippet = highlighted.length > 200 ? `${highlighted.slice(0, 200)}…` : highlighted;
        this.addBotMessage(this.getLocalizedString('contextNote', snippet));
      }
      let answer = immediate;
      const needsClinics = /(clinic|clinics|near me|resources|recursos|centros|centro)/i.test(lower);
      if (needsClinics) {
        const extra = await this.crossPageClinics();
        if (extra) {
          answer += `\n\n${extra}`;
        }
      }
      this.addBotMessage(answer);
    }, 600);
  }

  async crossPageClinics() {
    try {
      const resp = await fetch('free-screening.html', { credentials: 'same-origin' });
      const html = await resp.text();
      const names = [];
      // Simple extraction of known programs/domains
      if (/communitycaretx\.org/i.test(html)) names.push(this.lang === 'es' ? 'CommUnityCare (communitycaretx.org)' : 'CommUnityCare (communitycaretx.org)');
      if (/austinpcc\.org/i.test(html)) names.push(this.lang === 'es' ? 'People’s Community Clinic (austinpcc.org)' : 'People’s Community Clinic (austinpcc.org)');
      if (/hhs\.texas\.gov/i.test(html)) names.push(this.lang === 'es' ? 'Texas HHS (hhs.texas.gov)' : 'Texas HHS (hhs.texas.gov)');
      if (/cancer\.org/i.test(html)) names.push(this.lang === 'es' ? 'American Cancer Society (cancer.org)' : 'American Cancer Society (cancer.org)');
      const intro = this.lang === 'es' ? 'Opciones cercanas y recursos:' : 'Nearby options and resources:';
      const tail = this.lang === 'es' ? 'También puedes marcar 211 para recursos comunitarios.' : 'You can also dial 211 for community resources.';
      return names.length ? `${intro} ${names.join(' • ')}. ${tail}` : '';
    } catch (_) {
      return '';
    }
  }

  async crossPageClinics() {
    try {
      const resp = await fetch('free-screening.html', { credentials: 'same-origin' });
      const html = await resp.text();
      const names = [];
      if (/communitycaretx\.org/i.test(html)) names.push(this.lang === 'es' ? 'CommUnityCare (communitycaretx.org)' : 'CommUnityCare (communitycaretx.org)');
      if (/austinpcc\.org/i.test(html)) names.push(this.lang === 'es' ? 'People’s Community Clinic (austinpcc.org)' : 'People’s Community Clinic (austinpcc.org)');
      if (/hhs\.texas\.gov/i.test(html)) names.push(this.lang === 'es' ? 'Texas HHS (hhs.texas.gov)' : 'Texas HHS (hhs.texas.gov)');
      if (/cancer\.org/i.test(html)) names.push(this.lang === 'es' ? 'American Cancer Society (cancer.org)' : 'American Cancer Society (cancer.org)');
      const intro = this.lang === 'es' ? 'Opciones cercanas y recursos:' : 'Nearby options and resources:';
      const tail = this.lang === 'es' ? 'También puedes marcar 211 para recursos comunitarios.' : 'You can also dial 211 for community resources.';
      return names.length ? `${intro} ${names.join(' • ')}. ${tail}` : '';
    } catch (_) {
      return '';
    }
  }

  getResponse(message, highlighted) {
    const normalizedMessage = normalizeIntentText(message);
    const knowledgeBase = [
      {
        intent: 'greeting',
        keywords: ['hello', 'hola', 'hi'],
        responses: {
          en: 'Hi there! I can explain screenings, scheduling tips, or connect you to programs. What would you like to know?',
          es: '¡Hola! Puedo explicar exámenes, dar consejos de programación o conectarte con programas. ¿Qué te gustaría saber?'
        }
      },
      {
        intent: 'identity',
        keywords: ['screenwise', 'who are you', 'who is this', 'website purpose', 'what is this place'],
        responses: {
          en: 'ScreenWiseATX is a youth-led initiative in Austin, TX focused on early cancer detection and public health equity.',
          es: 'ScreenWiseATX es una iniciativa dirigida por jóvenes en Austin, TX enfocada en la detección temprana del cáncer y la equidad en salud pública.'
        },
        followUp: {
          en: 'Would you like to see our Free and Low Cost Screening resources?',
          es: '¿Quieres ver nuestros recursos de Detección Gratuita y de Bajo Costo?'
        }
      },
      {
        intent: 'identity-contact',
        keywords: ['contact', 'email', 'aarya', 'kiara', 'arjun'],
        responses: {
          en: 'Founded by Aarya Sharma and Kiara Mallen (LASA students). Reach us at screenwiseatx@gmail.com or explore the Who We Are section.',
          es: 'Fundada por Aarya Sharma y Kiara Mallen (estudiantes de LASA). Escríbenos a screenwiseatx@gmail.com o visita la sección ¿Quiénes Somos?.'
        }
      },
      {
        intent: 'education',
        keywords: ['what is cancer', 'que es el cancer', 'qué es el cáncer', 'cancer definition', 'definición de cáncer'],
        responses: {
          en: 'Cancer is a group of diseases where cells grow and divide abnormally, forming tumors or spreading (metastasis). Screening looks for cancer before symptoms appear so treatment can be more effective.',
          es: 'El cáncer es un grupo de enfermedades en el que las células crecen y se dividen de forma anormal, formando tumores o propagándose (metástasis). La detección busca el cáncer antes de que haya síntomas para que el tratamiento sea más eficaz.'
        }
      },
      {
        intent: 'breast',
        keywords: ['mammogram', 'mamografia', 'mamografía', 'breast', 'mri', 'resonancia', 'clinical exam', 'examen clinico', 'examen clínico'],
        responses: {
          en: 'Early detection has a 90%+ survival rate. Breast screenings include mammograms, MRIs for higher-risk patients, and clinical exams when changes are noticed.',
          es: 'La detección temprana tiene una tasa de supervivencia superior al 90 %. Las pruebas para mama incluyen mamografías, resonancias magnéticas para mayor riesgo y exámenes clínicos cuando se observan cambios.'
        },
        followUp: {
          en: 'Want a quick comparison between mammograms and MRI?',
          es: '¿Quieres una comparación rápida entre mamografías y resonancias?'
        }
      },
      {
        intent: 'cervical',
        keywords: ['pap', 'papanicolaou', 'hpv', 'cervical', 'cervix'],
        responses: {
          en: 'Cervical cancer is highly preventable with Pap smears starting at 21 and HPV co-testing around 30 for five-year intervals.',
          es: 'El cáncer cervical es altamente prevenible con pruebas de Papanicolaou desde los 21 y co-pruebas de VPH alrededor de los 30 cada cinco años.'
        },
        followUp: {
          en: 'Need guidance on when to schedule your next Pap smear?',
          es: '¿Necesitas guía sobre cuándo programar tu próxima prueba de Papanicolaou?'
        }
      },
      {
        intent: 'colon',
        keywords: ['colonoscopy', 'colonoscopia', 'colonoscopía', 'fit', 'stool test'],
        responses: {
          en: 'Screening can prevent colon cancer by removing polyps. Colonoscopies start around 45 every 10 years, while FIT stool tests are a yearly at-home option.',
          es: 'La detección puede prevenir el cáncer de colon al eliminar pólipos. Las colonoscopías comienzan alrededor de los 45 cada 10 años, mientras que las pruebas FIT de heces son una opción anual en casa.'
        },
        followUp: {
          en: 'Want me to explain how a FIT test works?',
          es: '¿Quieres que explique cómo funciona una prueba FIT?'
        }
      },
      {
        intent: 'lung-prostate',
        keywords: ['lung', 'pulmon', 'pulmón', 'ldct', 'prostate', 'prostata', 'próstata', 'psa', 'dre'],
        responses: {
          en: 'We share info on LDCT scans for eligible smokers plus PSA blood tests or DRE exams for prostate health.',
          es: 'Compartimos información sobre tomografías LDCT para fumadores elegibles y pruebas de PSA o exámenes DRE para la salud de la próstata.'
        },
        followUp: {
          en: 'Need screening eligibility guidelines?',
          es: '¿Necesitas las pautas de elegibilidad para la detección?'
        }
      },
      {
        intent: 'financial',
        keywords: ['cost', 'free', 'gratuito', 'insurance', 'money'],
        responses: {
          en: 'Many Austin programs offer free or low-cost screenings. You don’t always need insurance—start with our Free and Low Cost Screening page.',
          es: 'Muchos programas en Austin ofrecen exámenes gratuitos o de bajo costo. No siempre necesitas seguro; comienza con nuestra página de Detección Gratuita y de Bajo Costo.'
        },
        followUp: {
          en: 'Want me to list nearby clinics?',
          es: '¿Quieres que enumere clínicas cercanas?'
        }
      },
      {
        intent: 'clinic',
        keywords: ['clinic', 'clinics', 'near me', 'cerca de mi', 'cerca de mí', 'resources', 'recursos'],
        responses: {
          en: 'Find local options on our Free and Low Cost Screening page (free-screening.html) or dial 211 for 24/7 assistance.',
          es: 'Encuentra opciones locales en nuestra página de Detección Gratuita y de Bajo Costo (free-screening.html) o marca 211 para asistencia 24/7.'
        }
      },
      {
        intent: 'schedule',
        keywords: ['schedule', 'when', 'cuándo', 'how often', 'frecuencia', 'routine'],
        responses: {
          en: 'Screening frequency depends on cancer type and risk. Tell me which test you are considering and I can share the timing basics.',
          es: 'La frecuencia depende del tipo de cáncer y del riesgo. Dime qué prueba estás considerando y puedo compartir los tiempos básicos.'
        }
      }
    ];

    const match = knowledgeBase.find(item => item.keywords.some(kw => matchesKeyword(normalizedMessage, kw)));
    if (match) {
      if (match.intent === 'greeting') {
        if (this.hasGreeted) {
          return this.lang === 'es'
            ? 'Aquí sigo para ayudarte con preguntas sobre detección o clínicas.'
            : 'Still here to help with screening questions or clinics whenever you need.';
        }
        this.hasGreeted = true;
      }
      if (match.intent && match.intent !== 'greeting') {
        this.currentContext = match.intent;
      }
      let response = match.responses[this.lang] || match.responses.en;
      if (match.followUp) {
        response += `\n\n${match.followUp[this.lang] || match.followUp.en}`;
      }
      return response;
    }

    const vagueRegex = /(help|ayuda|tell me more|dime mas|dime más)/i;
    if (vagueRegex.test(message)) {
      return this.pageKey === 'index.html'
        ? this.lang === 'es'
          ? 'Puedo guiarte por los tipos de cáncer, programas gratuitos o información de detección. ¿Quieres aprender sobre mama, cérvix, colon, pulmón o próstata?'
          : 'I can guide you through cancer types, free programs, or screening info. Want to learn about breast, cervical, colon, lung, or prostate?'
        : this.lang === 'es'
          ? 'Puedo resumir esta página o conectarte con clínicas cercanas. ¿Qué parte te gustaría aclarar?'
          : 'I can summarize this page or connect you to nearby clinics. Which part would you like clarified?';
    }

    if (/(do i have|tengo yo|my symptoms|mis sintomas|tengo cancer|tengo cáncer)/i.test(message)) {
      return this.lang === 'es'
        ? 'Soy un asistente educativo y no puedo diagnosticar síntomas. Por favor visita nuestra página de Detección Gratuita y de Bajo Costo o marca 211 para hablar con un profesional.'
        : 'I am an educational assistant and cannot diagnose symptoms. Please visit our Free and Low Cost Screening page or dial 211 to speak with a professional.';
    }

    if (/\b(donde|dónde|where)\b/.test(normalizedMessage) && this.currentContext && this.currentContext !== 'idle') {
      const contextLabel = this.getContextLabel(this.currentContext);
      return this.lang === 'es'
        ? `Para ${contextLabel}, revisa free-screening.html para clínicas de bajo costo o marca 211 para ubicar centros cercanos.`
        : `For ${contextLabel}, check free-screening.html for low-cost clinics or dial 211 to locate nearby centers.`;
    }

    // Handle generic confusion and highlighted context questions
    const askingWhatIsThis = /(what\s+is\s+(this|that)|qué\s+es\s+(esto|eso))/i.test(message);
    if (highlighted && askingWhatIsThis) {
      return this.lang === 'es'
        ? 'Eso es un recurso/tema resaltado en esta página. Si quieres, puedo explicar para qué sirve y cómo usarlo, o darte enlaces para más información.'
        : 'That is a highlighted resource/topic on this page. I can explain what it is used for, how to use it, or point you to more info links.';
    }
    if (/^(huh\?|huh|what\?|what)$/i.test(message.trim())) {
      return this.lang === 'es'
        ? '¿Qué parte no quedó clara? ¿Quieres que explique un término, una prueba específica o los próximos pasos?'
        : 'What part wasn’t clear? Want me to explain a term, a specific test, or next steps?';
    }
    if (highlighted) {
      return this.lang === 'es'
        ? 'Aquí tienes algunos detalles adicionales basados en lo que seleccionaste. Si necesitas más contexto, dime qué parte no está clara.'
        : 'Here are some extra details based on what you highlighted. If you need more context, tell me which part is unclear.';
    }

    // Off-topic fallback (e.g., moon question)
    if (/(moon|luna)/i.test(message)) {
      return this.lang === 'es'
        ? 'Puedo ayudar con detección de cáncer, programas y próximos pasos. ¿Quieres información sobre pruebas, elegibilidad o clínicas locales?'
        : 'I can help with cancer screening, programs, and next steps. Want info on tests, eligibility, or local clinics?';
    }

    const summary = this.pageSummaries[this.pageKey]?.[this.lang];
    if (summary) {
      return `${summary} ${this.lang === 'es' ? '¿Hay algo específico que quieras profundizar?' : 'Is there anything specific you want to dive into?'}`;
    }

    return this.getLocalizedString('fallback');
  }
}

function normalizeIntentText(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesKeyword(normalizedMessage, keyword) {
  const normalizedKeyword = normalizeIntentText(keyword);
  if (!normalizedKeyword) return false;
  const haystack = ` ${normalizedMessage} `;
  const needle = ` ${normalizedKeyword} `;
  return haystack.includes(needle);
}

function buildPageSummaries() {
  return {
    'index.html': {
      en: 'You are on the ScreenWiseATX homepage where we outline our mission, key statistics about early detection, and links to every major section.',
      es: 'Estás en la página principal de ScreenWiseATX donde describimos nuestra misión, estadísticas clave sobre la detección temprana y enlaces a cada sección principal.'
    },
    'cancer-types.html': {
      en: 'This page points you to the full set of cancer education cards now hosted on the homepage.',
      es: 'Esta página te dirige al conjunto completo de tarjetas educativas sobre el cáncer ahora alojadas en la página principal.'
    },
    'breast.html': {
      en: 'You are reviewing breast cancer screening options like mammograms, breast MRI, and clinical exams.',
      es: 'Estás revisando las opciones de detección del cáncer de mama como mamografías, resonancias magnéticas y exámenes clínicos.'
    },
    'cervical.html': {
      en: 'This page covers cervical cancer screenings such as Pap smears and HPV tests.',
      es: 'Esta página cubre los exámenes de cáncer cervical como las pruebas de Papanicolaou y de VPH.'
    },
    'colon.html': {
      en: 'You are looking at colon cancer screening information including colonoscopies and FIT tests.',
      es: 'Estás viendo información sobre detección de cáncer de colon, incluidas las colonoscopías y las pruebas FIT.'
    },
    'lung.html': {
      en: 'This section explains low-dose CT scans and eligibility for lung cancer screening.',
      es: 'Esta sección explica las tomografías computarizadas de baja dosis y la elegibilidad para la detección del cáncer de pulmón.'
    },
    'prostate.html': {
      en: 'You are reading about prostate cancer screening, PSA tests, and digital rectal exams.',
      es: 'Estás leyendo sobre la detección del cáncer de próstata, las pruebas de PSA y los exámenes rectales digitales.'
    },
    'free-screening.html': {
      en: 'This page lists free and low-cost screening programs along with state and local resources.',
      es: 'Esta página enumera programas de detección gratuitos o de bajo costo junto con recursos estatales y locales.'
    },
    'screening-info.html': {
      en: 'You are viewing general information about screening types, recommended routines, and timelines.',
      es: 'Estás viendo información general sobre los tipos de detección, rutinas recomendadas y cronogramas.'
    },
    default: {
      en: 'You are browsing a ScreenWiseATX education page with detailed screening information.',
      es: 'Estás explorando una página educativa de ScreenWiseATX con información detallada sobre detección.'
    }
  };
}

// Initialize the chatbot when the page loads
window.addEventListener('load', () => {
  setTimeout(() => {
    const chatbot = new Chatbot();
  }, 1500);
});