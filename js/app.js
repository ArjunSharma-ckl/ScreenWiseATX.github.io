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
  const nav = document.querySelector('.tabs');
  
  if (nav) {
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
});

// Chatbot functionality
class Chatbot {
  constructor() {
    this.lang = document.documentElement.lang || 'en';
    this.pageKey = document.body.dataset.page || (location.pathname.split('/').pop() || 'index.html');
    this.pageSummaries = this.buildPageSummaries();
    this.summarySent = false;

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
      if (this.isOpen) {
        this.summarySent = false;
        this.sharePageSummary();
      }
    });
    
    // Initial message placeholder
    this.addBotMessage(this.getLocalizedString('intro'));
  }
  
  toggleChat() {
    this.isOpen = !this.isOpen;
    this.chatContainer.style.transform = this.isOpen ? 'translateY(0)' : 'translateY(100%)';
    this.toggleButton.style.display = this.isOpen ? 'none' : 'flex';
    
    if (this.isOpen) {
      this.chatContainer.querySelector('input').focus();
      this.sharePageSummary();
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

  sharePageSummary() {
    if (this.summarySent) return;
    this.summarySent = true;
    this.addBotMessage(this.getLocalizedSummary());
  }

  getLocalizedSummary() {
    const summary = this.pageSummaries[this.pageKey] || this.pageSummaries.default;
    const text = summary?.[this.lang] || summary?.en;
    return `${text}\n\n${this.getLocalizedString('highlightTip')}`;
  }

  getLocalizedString(key, interpolation) {
    const strings = {
      intro: {
        en: 'Hello! I\'m your Cancer Screening Assistant. Ask me anything about screenings, resources, or the content on this page.',
        es: '¡Hola! Soy tu Asistente de Detección de Cáncer. Pregúntame cualquier cosa sobre exámenes, recursos o el contenido de esta página.'
      },
      highlightTip: {
        en: 'Tip: highlight any text on this page before asking and I\'ll include it in my answer.',
        es: 'Consejo: resalta cualquier texto de esta página antes de preguntar y lo incluiré en mi respuesta.'
      },
      contextNote: {
        en: (snippet) => `I noticed you highlighted: "${snippet}". Here\'s a quick explanation:`,
        es: (snippet) => `Noté que seleccionaste: "${snippet}". Aquí tienes una explicación rápida:`
      },
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

  buildPageSummaries() {
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

  async sendMessage() {
    const input = this.chatContainer.querySelector('input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    this.addMessage(message, true);
    input.value = '';
    const highlighted = this.getHighlightedText();
    const response = this.getResponse(message.toLowerCase(), highlighted);
    
    setTimeout(() => {
      if (highlighted) {
        const snippet = highlighted.length > 200 ? `${highlighted.slice(0, 200)}…` : highlighted;
        this.addBotMessage(this.getLocalizedString('contextNote', snippet));
      }
      this.addBotMessage(response);
    }, 600);
  }

  getResponse(message, highlighted) {
    const knowledgeBase = [
      {
        keywords: ['hello', 'hola', 'hi'],
        responses: {
          en: 'Hi there! I can explain screenings, scheduling tips, or connect you to programs. What would you like to know?',
          es: '¡Hola! Puedo explicar exámenes, dar consejos de programación o conectarte con programas. ¿Qué te gustaría saber?'
        }
      },
      {
        keywords: ['what is cancer', 'que es el cancer', 'qué es el cáncer', 'cancer definition', 'definición de cáncer'],
        responses: {
          en: 'Cancer is a group of diseases where cells grow and divide abnormally, forming tumors or spreading (metastasis). Screening looks for cancer before symptoms appear so treatment can be more effective.',
          es: 'El cáncer es un grupo de enfermedades en el que las células crecen y se dividen de forma anormal, formando tumores o propagándose (metástasis). La detección busca el cáncer antes de que haya síntomas para que el tratamiento sea más eficaz.'
        }
      },
      {
        keywords: ['mammogram', 'mamografía'],
        responses: {
          en: 'A mammogram is an X-ray of the breast. For average-risk patients, annual screenings are recommended starting at 40. High-risk patients may start earlier and pair mammograms with MRI.',
          es: 'Una mamografía es una radiografía del seno. Para pacientes de riesgo promedio se recomienda un examen anual a partir de los 40 años. Los pacientes de alto riesgo pueden comenzar antes y combinarla con una resonancia magnética.'
        }
      },
      {
        keywords: ['mri', 'resonancia'],
        responses: {
          en: 'Breast MRI provides 3D images and is reserved for higher-risk patients, usually alongside a mammogram starting around age 30.',
          es: 'La resonancia magnética de mama ofrece imágenes en 3D y se reserva para pacientes de mayor riesgo, normalmente junto con una mamografía a partir de los 30 años.'
        }
      },
      {
        keywords: ['clinical', 'examen clínico'],
        responses: {
          en: 'A clinical breast exam is a physical exam performed by a healthcare professional when symptoms or changes are noticed.',
          es: 'Un examen clínico de los senos es un examen físico realizado por un profesional de la salud cuando se notan síntomas o cambios.'
        }
      },
      {
        keywords: ['pap', 'hpv'],
        responses: {
          en: 'Cervical screening generally starts at age 21 with Pap tests every 3 years. HPV testing can be combined starting at age 30 for a 5-year interval.',
          es: 'La detección cervical generalmente comienza a los 21 años con pruebas de Papanicolaou cada 3 años. A partir de los 30 años se puede combinar con la prueba de VPH para un intervalo de 5 años.'
        }
      },
      {
        keywords: ['colonoscopy', 'colonoscopía', 'fit'],
        responses: {
          en: 'Colonoscopies are typically done every 10 years starting at age 45 for average-risk adults. FIT stool tests are a yearly, non-invasive option.',
          es: 'Las colonoscopías se realizan generalmente cada 10 años a partir de los 45 años para adultos de riesgo promedio. Las pruebas FIT de heces son una opción anual no invasiva.'
        }
      },
      {
        keywords: ['lung', 'pulmón', 'ldct'],
        responses: {
          en: 'Low-dose CT (LDCT) scans are recommended for adults 50-80 with a 20 pack-year smoking history who currently smoke or quit within 15 years.',
          es: 'Las tomografías computarizadas de baja dosis (LDCT) se recomiendan para adultos de 50 a 80 años con un historial de 20 paquetes-año que aún fuman o dejaron de fumar en los últimos 15 años.'
        }
      },
      {
        keywords: ['cost', 'free', 'gratuito', 'program'],
        responses: {
          en: 'Check our Free and Low Cost Screening page for CommUnityCare, People’s Community Clinic, Texas HHS, and American Cancer Society resources.',
          es: 'Consulta nuestra página de Detección Gratuita y de Bajo Costo para recursos de CommUnityCare, People’s Community Clinic, Texas HHS y la American Cancer Society.'
        }
      },
      {
        keywords: ['schedule', 'when', 'cuándo', 'how often', 'frecuencia'],
        responses: {
          en: 'Screening frequency depends on cancer type and risk. Use the page you are on for the exact timelines or let me know which test you are curious about.',
          es: 'La frecuencia de los exámenes depende del tipo de cáncer y del riesgo. Usa la página en la que estás para ver los cronogramas exactos o dime qué prueba te interesa.'
        }
      }
    ];

    const match = knowledgeBase.find(item => item.keywords.some(kw => message.includes(kw)));
    if (match) {
      return match.responses[this.lang] || match.responses.en;
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

    const summary = this.pageSummaries[this.pageKey]?.[this.lang];
    if (summary) {
      return `${summary} ${this.lang === 'es' ? '¿Hay algo específico que quieras profundizar?' : 'Is there anything specific you want to dive into?'}`;
    }

    return this.getLocalizedString('fallback');
  }
}

// Initialize the chatbot when the page loads
window.addEventListener('load', () => {
  setTimeout(() => {
    const chatbot = new Chatbot();
  }, 1500);
});