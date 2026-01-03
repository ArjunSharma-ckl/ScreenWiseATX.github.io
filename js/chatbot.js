// ChatWise - AI Assistant for ScreenWiseATX
class Chatbot {
  constructor() {
    this.isOpen = false;
    this.isMinimized = false;
    this.messages = [];
    this.lang = document.documentElement.lang || 'en';
    // ⚠️ SECURITY WARNING: API KEY EXPOSED IN CLIENT-SIDE CODE ⚠️
    // For production, move to backend endpoint
    this.apiKey = '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';
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    
    this.init();
  }

  init() {
    this.createChatInterface();
    this.attachEventListeners();
    this.addWelcomeMessage();
    
    // Listen for language changes
    document.addEventListener('langchange', (e) => {
      this.lang = e.detail.lang;
      this.updateLanguage();
    });
  }

  createChatInterface() {
    // Create chat container
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chatbot-container';
    chatContainer.style.display = 'none';
    
    chatContainer.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-header-content">
          <div class="chatbot-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h3 class="chatbot-title" data-en="ChatWise" data-es="ChatWise">ChatWise</h3>
            <p class="chatbot-subtitle" data-en="Cancer Screening Assistant" data-es="Asistente de Detección de Cáncer">Cancer Screening Assistant</p>
          </div>
        </div>
        <button class="chatbot-close" aria-label="Close chat">×</button>
      </div>
      <div class="chatbot-messages" id="chatbot-messages"></div>
      <div class="chatbot-input-container">
        <div class="chatbot-quick-replies" id="quick-replies"></div>
        <div class="chatbot-input-wrapper">
          <input 
            type="text" 
            class="chatbot-input" 
            id="chatbot-input" 
            placeholder="Ask about cancer screening..."
            data-en="Ask about cancer screening..."
            data-es="Pregunta sobre detección de cáncer..."
            aria-label="Chat message input"
          />
          <button class="chatbot-send" id="chatbot-send" aria-label="Send message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(chatContainer);
    this.container = chatContainer;
    this.messagesContainer = document.getElementById('chatbot-messages');
    this.input = document.getElementById('chatbot-input');
    this.sendBtn = document.getElementById('chatbot-send');
    this.quickRepliesContainer = document.getElementById('quick-replies');
    this.header = chatContainer.querySelector('.chatbot-header');
  }

  attachEventListeners() {
    // Toggle button
    const toggleBtn = document.querySelector('.chat-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }

    // Close button - minimizes instead of closing
    const closeBtn = this.container.querySelector('.chatbot-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.minimize();
    });

    // Click on minimized header to expand
    this.header.addEventListener('click', () => {
      if (this.isMinimized) {
        this.expand();
      }
    });

    // Send message
    this.sendBtn.addEventListener('click', () => this.handleSend());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSend();
    });
  }

  toggle() {
    if (this.isMinimized) {
      this.expand();
    } else if (this.isOpen) {
      this.minimize();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.isMinimized = false;
    this.container.style.display = 'flex';
    this.container.classList.remove('minimized');
    this.input.focus();
  }

  minimize() {
    this.isOpen = false;
    this.isMinimized = true;
    this.container.classList.add('minimized');
    this.container.style.display = 'flex';
  }

  expand() {
    this.isOpen = true;
    this.isMinimized = false;
    this.container.classList.remove('minimized');
    this.input.focus();
  }

  updateLanguage() {
    // Update input placeholder
    const placeholder = this.input.getAttribute(`data-${this.lang}`) || 
                       this.input.getAttribute('data-en');
    this.input.placeholder = placeholder;

    // Update header text
    const title = this.container.querySelector('.chatbot-title');
    const subtitle = this.container.querySelector('.chatbot-subtitle');
    if (title) {
      const titleText = title.getAttribute(`data-${this.lang}`) || 
                       title.getAttribute('data-en');
      title.textContent = titleText;
    }
    if (subtitle) {
      const subtitleText = subtitle.getAttribute(`data-${this.lang}`) || 
                           subtitle.getAttribute('data-en');
      subtitle.textContent = subtitleText;
    }
  }

  addWelcomeMessage() {
    const welcomeText = this.lang === 'es' 
      ? `¡Hola! Soy ChatWise, tu asistente de detección de cáncer. Puedo ayudarte con:

• Información sobre diferentes tipos de cáncer
• Programas y recomendaciones de detección
• Encontrar opciones de detección gratuitas o de bajo costo
• Preguntas generales sobre prevención del cáncer

¿Cómo puedo ayudarte hoy?`
      : `Hello! I'm ChatWise, your cancer screening assistant. I can help you with:

• Information about different cancer types
• Screening schedules and recommendations
• Finding free or low-cost screening options
• General questions about cancer prevention

How can I help you today?`;

    this.addMessage(welcomeText, 'bot');
    this.showQuickReplies(
      this.lang === 'es'
        ? ['¿Qué pruebas necesito?', 'Cuéntame sobre cáncer de mama', 'Encuentra detección gratuita cerca de mí', '¿Cuándo debo comenzar las pruebas?']
        : ['What screenings do I need?', 'Tell me about breast cancer', 'Find free screening near me', 'When should I start screening?']
    );
  }

  showQuickReplies(replies) {
    this.quickRepliesContainer.innerHTML = '';
    replies.forEach(reply => {
      const btn = document.createElement('button');
      btn.className = 'quick-reply-btn';
      btn.textContent = reply;
      btn.addEventListener('click', () => {
        this.input.value = reply;
        this.handleSend();
      });
      this.quickRepliesContainer.appendChild(btn);
    });
  }

  addMessage(text, sender = 'user') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message chatbot-message-${sender}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-message-bubble';
    bubble.textContent = text;
    
    messageDiv.appendChild(bubble);
    this.messagesContainer.appendChild(messageDiv);
    
    // Store message for conversation history
    this.messages.push({ text, sender });
    
    // Scroll to bottom
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    
    return messageDiv;
  }

  addTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'chatbot-message chatbot-message-bot';
    indicator.id = 'typing-indicator';
    
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-message-bubble';
    bubble.innerHTML = `
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    
    indicator.appendChild(bubble);
    this.messagesContainer.appendChild(indicator);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    
    return indicator;
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  async handleSend() {
    const message = this.input.value.trim();
    if (!message) return;

    // Add user message
    this.addMessage(message, 'user');
    this.input.value = '';
    this.quickRepliesContainer.innerHTML = '';

    // Add typing indicator
    const typingIndicator = this.addTypingIndicator();

    try {
      const response = await this.sendToAPI(message);
      this.removeTypingIndicator();
      this.addMessage(response, 'bot');
    } catch (error) {
      this.removeTypingIndicator();
      const errorMsg = this.lang === 'es'
        ? 'Lo siento, encontré un error. Por favor intenta de nuevo.'
        : 'Sorry, I encountered an error. Please try again.';
      this.addMessage(errorMsg, 'bot');
      console.error('Chat error:', error);
    }
  }

  buildWebsiteContext() {
    const pageKey = document.body.dataset.page || (location.pathname.split('/').pop() || 'index.html');
    const pageSummaries = window.buildPageSummaries ? window.buildPageSummaries() : {};
    const currentPageSummary = pageSummaries[pageKey]?.[this.lang] || pageSummaries.default?.[this.lang] || '';
    
    const context = {
      en: `You are ChatWise, the ScreenWiseATX Cancer Screening Assistant. ScreenWiseATX is a youth-led initiative in Austin, TX founded by Aarya Sharma and Kiara Mallen (LASA students) focused on early cancer detection and public health equity. Contact: screenwiseatx@gmail.com

Your role: Provide concise, helpful answers about cancer screening that feel natural and specific to ScreenWiseATX. Always reference information from our website when relevant.

Current page context: ${currentPageSummary}

ScreenWiseATX Information:
- Breast Cancer: Mammograms, breast MRI for higher-risk patients, clinical exams. Early detection has 90%+ survival rate.
- Cervical Cancer: Pap smears starting at age 21, HPV co-testing around age 30 for five-year intervals. Highly preventable.
- Colon Cancer: Colonoscopies starting at age 45 every 10 years, FIT/FOBT stool tests annually, DNA stool tests every 3 years.
- Lung Cancer: LDCT scans for eligible smokers.
- Prostate Cancer: PSA blood tests and DRE exams.

Free and Low-Cost Resources in Austin:
- CommUnityCare (communitycaretx.org)
- People's Community Clinic (austinpcc.org)
- Texas HHS (hhs.texas.gov)
- American Cancer Society (cancer.org)
- Dial 211 for 24/7 community resources

Guidelines:
- Keep responses concise (2-4 sentences typically)
- Sound like a knowledgeable ScreenWiseATX team member, not a generic AI
- Reference our website content and resources
- If asked about symptoms or diagnosis, direct users to professional medical help
- Always respond in English
- Be conversational, supportive, and encouraging`,
      
      es: `Eres ChatWise, el Asistente de Detección de Cáncer de ScreenWiseATX. ScreenWiseATX es una iniciativa dirigida por jóvenes en Austin, TX fundada por Aarya Sharma y Kiara Mallen (estudiantes de LASA) enfocada en la detección temprana del cáncer y la equidad en salud pública. Contacto: screenwiseatx@gmail.com

Tu rol: Proporciona respuestas concisas y útiles sobre detección de cáncer que se sientan naturales y específicas de ScreenWiseATX. Siempre referencia información de nuestro sitio web cuando sea relevante.

Contexto de la página actual: ${currentPageSummary}

Información de ScreenWiseATX:
- Cáncer de Mama: Mamografías, resonancia magnética de mama para pacientes de mayor riesgo, exámenes clínicos. La detección temprana tiene una tasa de supervivencia superior al 90%.
- Cáncer Cervical: Pruebas de Papanicolaou desde los 21 años, co-pruebas de VPH alrededor de los 30 años cada cinco años. Altamente prevenible.
- Cáncer de Colon: Colonoscopías desde los 45 años cada 10 años, pruebas FIT/FOBT de heces anualmente, pruebas de ADN en heces cada 3 años.
- Cáncer de Pulmón: Tomografías LDCT para fumadores elegibles.
- Cáncer de Próstata: Pruebas de sangre PSA y exámenes DRE.

Recursos Gratuitos y de Bajo Costo en Austin:
- CommUnityCare (communitycaretx.org)
- People's Community Clinic (austinpcc.org)
- Texas HHS (hhs.texas.gov)
- American Cancer Society (cancer.org)
- Marca 211 para recursos comunitarios 24/7

Pautas:
- Mantén las respuestas concisas (típicamente 2-4 oraciones)
- Suena como un miembro del equipo de ScreenWiseATX conocedor, no como una IA genérica
- Referencia el contenido y recursos de nuestro sitio web
- Si se pregunta sobre síntomas o diagnóstico, dirige a los usuarios a ayuda médica profesional
- Siempre responde en español
- Sé conversacional, de apoyo y alentador`
    };
    
    return context[this.lang] || context.en;
  }

  async sendToAPI(userMessage) {
    const systemPrompt = this.buildWebsiteContext();
    
    // Build conversation history (last 8 messages)
    const conversationHistory = this.messages
      .filter(msg => msg.text && msg.text.trim() && msg.text !== '...')
      .slice(-8)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 300,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from API');
    }
    
    return data.choices[0].message.content.trim();
  }
}

// Initialize chatbot when DOM is ready
function initChatbot() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.chatbot) {
        window.chatbot = new Chatbot();
      }
    });
  } else {
    if (!window.chatbot) {
      window.chatbot = new Chatbot();
    }
  }
}

// Start initialization
initChatbot();
