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
    
    // Initial message
    this.addBotMessage('Hello! I\'m here to help you with information about cancer screening. How can I assist you today?');
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
  
  async sendMessage() {
    const input = this.chatContainer.querySelector('input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    this.addMessage(message, true);
    input.value = '';
    
    // Simple response logic (in a real app, this would call an API)
    const responses = {
      'hello': 'Hello! How can I help you with cancer screening today?',
      'hi': 'Hi there! What would you like to know about cancer screening?',
      'breast cancer': 'Breast cancer screening typically involves mammograms, clinical breast exams, and self-exams. Women aged 40-44 should have the choice to start annual screenings, 45-54 should get mammograms every year, and 55+ can switch to every 2 years or continue yearly.',
      'colon cancer': 'Colon cancer screening is recommended starting at age 45 for most adults. Common screening methods include colonoscopy (every 10 years), FIT test (annually), and stool DNA test (every 3 years).',
      'lung cancer': 'Lung cancer screening with low-dose CT scan is recommended for adults aged 50-80 who have a 20 pack-year smoking history and currently smoke or have quit within the past 15 years.',
      'prostate cancer': 'The decision to be screened for prostate cancer with a PSA test should be an individual one. Men should discuss the potential benefits and risks with their doctor starting at age 50, or earlier for those at higher risk.',
      'cervical cancer': 'Cervical cancer screening includes Pap tests and HPV tests. Women should start at age 21 with Pap tests every 3 years. From 30-65, you can continue with Pap tests every 3 years or switch to co-testing (Pap + HPV) every 5 years.'
    };
    
    // Find a matching response or provide a default
    let response = 'I\'m here to help with cancer screening information. Could you be more specific about what you\'d like to know?';
    
    for (const [key, value] of Object.entries(responses)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        response = value;
        break;
      }
    }
    
    // Add a small delay before the bot responds
    setTimeout(() => {
      this.addBotMessage(response);
    }, 1000);
  }
}

// Initialize the chatbot when the page loads
window.addEventListener('load', () => {
  // Small delay before showing the chatbot button
  setTimeout(() => {
    const chatbot = new Chatbot();
  }, 3000);
});