const translations = {
  fr: {
    home: 'ACCUEIL',
    portfolio: 'PORTFOLIO',
    aboutMe: 'À PROPOS',
    contact: 'CONTACT',
    nature: 'Nature',
    portraits: 'Portraits',
    sport: 'Sport',
    evenements: 'Événements',
    animaux: 'Animaux',
    personnel: 'Personnel',
    showcase: {
      title: 'Découvrir les catégories',
      heroAlt: 'Vitrine du portfolio'
    },
    about: {
      title: 'À PROPOS',
      greeting: 'Bonjour, je suis Martin'
    },
    contactPage: {
      title: 'CONTACT',
      heading: 'Contactez-moi',
      emailLabel: 'Votre email',
      emailPlaceholder: 'exemple@gmail.com',
      subjectLabel: 'Sujet',
      subjectPlaceholder: 'Dites-moi comment je peux vous aider',
      messageLabel: 'Votre message',
      messagePlaceholder: 'Donnez moi les détails de votre projet',
      submitButton: 'Envoyer le message',
      submitting: 'Envoi en cours...',
      success: 'Message envoyé avec succès ! Je vous répondrai bientôt.',
      error: 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou me contacter directement à martin.useo@gmail.com',
      notConfigured: 'Le formulaire n\'est pas encore configuré. Contactez-moi directement à martin.useo@gmail.com',
      emailjsNotConfigured: 'EmailJS n\'est pas configuré. Veuillez configurer vos clés EmailJS dans le code. Contactez-moi directement à martin.useo@gmail.com en attendant.',
      invalidService: 'Service ID invalide. Vérifiez votre configuration EmailJS.',
      invalidTemplate: 'Template ID invalide. Vérifiez votre configuration EmailJS.'
    },
    scrollToTop: 'Retour en haut de la page'
  },
  en: {
    home: 'HOME',
    portfolio: 'PORTFOLIO',
    aboutMe: 'ABOUT ME',
    contact: 'CONTACT',
    nature: 'Nature',
    portraits: 'Portraits',
    sport: 'Sport',
    evenements: 'Events',
    animaux: 'Animals',
    personnel: 'Personal',
    showcase: {
      title: 'Explore Categories',
      heroAlt: 'Portfolio showcase'
    },
    about: {
      title: 'ABOUT ME',
      greeting: 'Hello there, I\'m Martin'
    },
    contactPage: {
      title: 'CONTACT',
      heading: 'Get in touch',
      emailLabel: 'Your email',
      emailPlaceholder: 'example@gmail.com',
      subjectLabel: 'Subject',
      subjectPlaceholder: 'Let me know how I can help you',
      messageLabel: 'Your message',
      messagePlaceholder: 'Leave a comment...',
      submitButton: 'Send message',
      submitting: 'Sending...',
      success: 'Message sent successfully! I will get back to you soon.',
      error: 'An error occurred while sending. Please try again or contact me directly at martin.useo@gmail.com',
      notConfigured: 'The form is not yet configured. Contact me directly at martin.useo@gmail.com',
      emailjsNotConfigured: 'EmailJS is not configured. Please configure your EmailJS keys in the code. Contact me directly at martin.useo@gmail.com in the meantime.',
      invalidService: 'Invalid Service ID. Check your EmailJS configuration.',
      invalidTemplate: 'Invalid Template ID. Check your EmailJS configuration.'
    },
    scrollToTop: 'Back to top'
  }
};

const LanguageManager = {
  currentLang: 'fr',
  isInitialized: false,
  
  getStoredLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage');
    return (savedLang === 'fr' || savedLang === 'en') ? savedLang : 'fr';
  },
  
  init() {
    if (this.isInitialized) return;
    
    this.currentLang = this.getStoredLanguage();
    
    if (!localStorage.getItem('preferredLanguage')) {
      localStorage.setItem('preferredLanguage', 'fr');
    }
    
    if (document.documentElement) {
      document.documentElement.lang = this.currentLang;
    }
    
    this.isInitialized = true;
  },
  
  setLanguage(lang) {
    if (lang === 'fr' || lang === 'en') {
      this.currentLang = lang;
      localStorage.setItem('preferredLanguage', lang);
      window.location.reload();
    }
  },
  
  get(key) {
    const keys = key.split('.');
    let value = translations[this.currentLang];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value !== undefined ? value : key;
  },
  
  applyLanguage() {
    if (!this.isInitialized) {
      this.init();
    }
    
    document.documentElement.lang = this.currentLang;
    
    document.querySelectorAll('#language-toggle-text').forEach(toggleText => {
      toggleText.textContent = this.currentLang.toUpperCase();
    });
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.get(key);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.hasAttribute('placeholder')) {
          element.placeholder = translation;
        } else if (element.type === 'submit' || element.type === 'button') {
          element.value = translation;
        }
      } else {
        const hasHTML = element.innerHTML !== element.textContent && element.innerHTML.includes('<');
        
        if (hasHTML) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = element.innerHTML;
          const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null, false);
          let node;
          while (node = walker.nextNode()) {
            if (node.textContent.trim() && !node.textContent.includes('👋')) {
              node.textContent = translation;
            }
          }
          element.innerHTML = tempDiv.innerHTML;
        } else {
          element.textContent = translation;
        }
      }
    });
    
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
      const key = element.getAttribute('data-i18n-alt');
      element.alt = this.get(key);
    });
    
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: this.currentLang } 
    }));
  },
  
  toggleLanguage() {
    const newLang = this.currentLang === 'fr' ? 'en' : 'fr';
    this.setLanguage(newLang);
  }
};

window.LanguageManager = LanguageManager;
window.translations = translations;

window.applyTranslationsBeforeRender = function() {
  LanguageManager.init();
  
  if (document.body) {
    LanguageManager.applyLanguage();
    return;
  }
  
  const observer = new MutationObserver(function(mutations, obs) {
    if (document.body) {
      LanguageManager.applyLanguage();
      obs.disconnect();
    }
  });
  
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  setTimeout(function() {
    if (document.body) {
      LanguageManager.applyLanguage();
    }
    observer.disconnect();
  }, 100);
};
