// Prevent multiple instances
if (window.__SCREENWISE_CHATBOT_LOADED__) {
  console.warn("Chatbot already loaded");
} else {
  window.__SCREENWISE_CHATBOT_LOADED__ = true;

  class Chatbot {
    constructor() {
      this.lang = document.documentElement.lang || 'en';
      this.isOpen = false;
      this.isTyping = false;
      this.isMinimized = false;
      this.conversation = [];
      
      // Initialize the chat UI
      this.initChatUI();
      this.setupEventListeners();
      
      // Add welcome message
      this.addBotMessage(this.getLocalizedString('welcome'));
      
      // Initialize UI state
      this.updateUI();
    }
  
  initChatUI() {
    // Create chat container with safe DOM insertion
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
    
    // Create toggle button with safe DOM insertion
    this.toggleButton = document.createElement('button');
    this.toggleButton.className = 'chatbot-toggle';
    this.toggleButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `;
    
    // Safe DOM insertion that works with any page structure
    const mount = document.body || document.documentElement;
    mount.appendChild(this.chatContainer);
    mount.appendChild(this.toggleButton);
    
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
    try {
      console.log('Sending request to Groq API...');
      
      // Prepare the conversation history with system prompt
      const messages = [
        {
          role: 'system',
          content: `You are a helpful assistant for ScreenWise ATX, providing information about cancer screening and prevention. 
                   Keep responses concise and focused on the user's question. 
                   Current language: ${this.lang === 'es' ? 'Spanish' : 'English'}`
        },
        ...this.conversation
          .filter(msg => msg.text && msg.text.trim() !== '') // Filter out empty messages
          .map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          })),
        {
          role: 'user',
          content: message
        }
      ];
      
      // Filter out any messages with empty content
      const filteredMessages = messages.filter(msg => msg.content && msg.content.trim() !== '');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversation: filteredMessages,
          lang: this.lang
        })
      });
      
      console.log('Received response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      return data.reply || data.choices?.[0]?.message?.content || this.getLocalizedString('error');
    } catch (error) {
      console.error('Error in getGroqResponse:', error);
      return this.getLocalizedString('error');
    }
  }
}

// Initialize the chatbot when the DOM is fully loaded
const initChatbot = () => {
  if (!window.chatbot) {
    window.chatbot = new Chatbot();
  }
};

// Handle both DOMContentLoaded and load events for maximum compatibility
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  // DOMContentLoaded has already fired
  setTimeout(initChatbot, 0);
}
}
