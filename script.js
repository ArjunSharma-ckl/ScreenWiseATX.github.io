// Language toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const langToggle = document.getElementById('langToggle');
  const elementsWithLang = document.querySelectorAll('[data-en][data-es]');
  
  // Check saved language preference
  const savedLang = localStorage.getItem('language') || 'en';
  if (savedLang === 'es') {
    langToggle.checked = true;
    setLanguage('es');
  }
  
  // Toggle language on checkbox change
  langToggle.addEventListener('change', function() {
    const lang = this.checked ? 'es' : 'en';
    setLanguage(lang);
    localStorage.setItem('language', lang);
  });
  
  function setLanguage(lang) {
    elementsWithLang.forEach(element => {
      const text = element.getAttribute(`data-${lang}`);
      if (text) {
        // Check if element is an input
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.value = text;
        } else {
          element.textContent = text;
        }
      }
    });
  }
});