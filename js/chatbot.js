class Chatbot {
  constructor() {
    this.lang = document.documentElement.lang || 'en';
    this.isOpen = false;
    this.isMinimized = false;
    this.isTyping = false;
    this.conversation = [];
    
    // Initialize the chat UI
    this.initChatUI();
    this.setupEventListeners();
    
    // Add welcome message
    this.addBotMessage(this.getLocalizedString('welcome'));
  }
  
  initChatUI() {
    // Create chat container
    this.chatContainer = document.createElement('div');
    this.chatContainer.className = 'chatbot-container';
    this.chatContainer.innerHTML = `
      <div class="chatbot-header">
        <span data-en="Cancer Screening Assistant" data-es="Asistente de Detección de Cáncer">Cancer Screening Assistant</span>
        <button class="chatbot-close">−</button>
      </div>
      <div class="chatbot-messages"></div>
      <div class="chatbot-input">
        <input type="text" placeholder="Ask me about cancer screening..." 
               data-en="Ask me about cancer screening..." 
               data-es="Pregúntame sobre detección de cáncer...">
        <button class="chatbot-send">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    `;
    
    // Get DOM elements
    this.messagesContainer = this.chatContainer.querySelector('.chatbot-messages');
    this.inputField = this.chatContainer.querySelector('input');
    this.sendButton = this.chatContainer.querySelector('.chatbot-send');
    this.closeButton = this.chatContainer.querySelector('.chatbot-close');
    
    // Create toggle button
    this.toggleButton = document.createElement('button');
    this.toggleButton.className = 'chatbot-toggle';
    this.toggleButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
    
    // Add to DOM
    document.body.appendChild(this.chatContainer);
    document.body.appendChild(this.toggleButton);
    
    // Update language
    this.updateLanguage();
  }
  
  setupEventListeners() {
    // Toggle chat
    this.toggleButton.addEventListener('click', () => this.toggleChat());
    
    // Close/minimize chat
    this.closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMinimize();
    });
    
    // Send message on button click
    this.sendButton.addEventListener('click', () => this.sendMessage());
    
    // Send message on Enter key
    this.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
    
    // Handle language changes
    document.addEventListener('langchange', (e) => {
      this.lang = e.detail.lang;
      this.updateLanguage();
    });
  }
  
  toggleChat() {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.chatContainer.classList.remove('minimized');
      this.isMinimized = false;
      this.inputField.focus();
    } else {
      this.toggleMinimize();
    }
  }
  
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    
    if (this.isMinimized) {
      this.chatContainer.classList.add('minimized');
      this.closeButton.textContent = '+';
    } else {
      this.chatContainer.classList.remove('minimized');
      this.closeButton.textContent = '−';
      this.inputField.focus();
    }
  }
  
  updateLanguage() {
    // Update input placeholder
    const placeholder = this.inputField.getAttribute(`data-${this.lang}`) || 
                       this.inputField.getAttribute('data-en');
    this.inputField.placeholder = placeholder;
    
    // Update header text
    const headerText = this.chatContainer.querySelector('.chatbot-header span');
    if (headerText) {
      const text = headerText.getAttribute(`data-${this.lang}`) || 
                  headerText.getAttribute('data-en');
      headerText.textContent = text;
    }
  }
  
  async sendMessage() {
    const message = this.inputField.value.trim();
    if (!message || this.isTyping) return;
    
    // Add user message to chat
    this.addMessage(message, 'user');
    this.inputField.value = '';
    
    // Show typing indicator
    this.showTypingIndicator();
    
    try {
      // Get response from Groq API
      const response = await this.getGroqResponse(message);
      
      // Remove typing indicator and add bot response
      this.hideTypingIndicator();
      this.addMessage(response, 'bot');
    } catch (error) {
      console.error('Error getting response:', error);
      this.hideTypingIndicator();
      this.addMessage(this.getLocalizedString('error'), 'bot');
    }
  }
  
  async getGroqResponse(message) {
    // Add context about ScreenWiseATX
    const context = this.getLocalizedString('assistant_context');
    
    try {
      console.log('Sending request to Groq API...');
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: this.getLocalizedString('system_prompt')
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });
      
      console.log('Received response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.choices?.[0]?.message?.content) {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from API');
      }
      
      return data.choices[0].message.content.trim();
      
    } catch (error) {
      console.error('Error in getGroqResponse:', error);
      return this.getLocalizedString('error');
    }
  }
  
  addMessage(text, sender) {
    if (!text) return;
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${sender}`;
    
    // Add links to any URLs in the message
    const textWithLinks = text.replace(
      /(https?:\/\/[^\s]+)/g, 
      url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
    
    messageEl.innerHTML = textWithLinks;
    
    // Add to messages container
    this.messagesContainer.appendChild(messageEl);
    
    // Scroll to bottom
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    
    // Add to conversation history
    this.conversation.push({ role: sender, content: text });
  }
  
  showTypingIndicator() {
    this.isTyping = true;
    this.sendButton.disabled = true;
    
    const typingEl = document.createElement('div');
    typingEl.className = 'message-typing';
    typingEl.id = 'typing-indicator';
    typingEl.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    
    this.messagesContainer.appendChild(typingEl);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }
  
  hideTypingIndicator() {
    this.isTyping = false;
    this.sendButton.disabled = false;
    
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) {
      typingEl.remove();
    }
  }
  
  addBotMessage(text) {
    this.addMessage(text, 'bot');
  }
  
  getLocalizedString(key) {
    const strings = {
      'welcome': {
        'en': 'Hello! I\'m your ScreenWiseATX assistant. How can I help you with cancer screening today?',
        'es': '¡Hola! Soy tu asistente de ScreenWiseATX. ¿Cómo puedo ayudarte con la detección de cáncer hoy?'
      },
      'error': {
        'en': 'Sorry, I\'m having trouble connecting to the server. Please try again later.',
        'es': 'Lo siento, estoy teniendo problemas para conectarme al servidor. Por favor, inténtalo de nuevo más tarde.'
      },
      'no_response': {
        'en': 'I\'m sorry, I couldn\'t generate a response. Could you please rephrase your question?',
        'es': 'Lo siento, no pude generar una respuesta. ¿Podrías reformular tu pregunta?'
      },
      'system_prompt': {
        'en': 'You are a helpful assistant for ScreenWiseATX, providing information about cancer screening. Be concise, accurate, and supportive. Focus on early detection, screening methods, and prevention. If you don\'t know something, say so. Keep responses under 3-4 sentences when possible.',
        'es': 'Eres un asistente útil de ScreenWiseATX que brinda información sobre detección de cáncer. Sé conciso, preciso y de apoyo. Enfócate en la detección temprana, métodos de detección y prevención. Si no sabes algo, dilo. Mantén las respuestas en 3-4 oraciones cuando sea posible.'
      },
      'assistant_context': {
        'en': 'You are speaking with a user of ScreenWiseATX, a platform dedicated to raising awareness about cancer screening and early detection. The user may ask about different types of cancer screening, recommendations, or general information about cancer prevention.',
        'es': 'Estás hablando con un usuario de ScreenWiseATX, una plataforma dedicada a crear conciencia sobre la detección temprana del cáncer. El usuario puede preguntar sobre diferentes tipos de detección de cáncer, recomendaciones o información general sobre la prevención del cáncer.'
      }
    };
    
    return strings[key]?.[this.lang] || strings[key]?.['en'] || key;
  }
}

// Initialize the chatbot when the page loads
window.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure everything is loaded
  setTimeout(() => {
    window.chatbot = new Chatbot();
  }, 1000);
});
