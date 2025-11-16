(function() {
  'use strict';
  
  function protectImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Bloquer le clic droit
      img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
      
      // Bloquer le drag & drop
      img.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
      });
      
      // Empêcher la sélection
      img.style.userSelect = 'none';
      img.style.webkitUserSelect = 'none';
      img.style.mozUserSelect = 'none';
      img.style.msUserSelect = 'none';
      
      // Attribut pour empêcher le drag natif
      img.setAttribute('draggable', 'false');
      
      // Empêcher le pointer-events temporairement pour F12
      img.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Clic gauche uniquement
          img.style.pointerEvents = 'none';
          setTimeout(() => {
            img.style.pointerEvents = 'auto';
          }, 100);
        }
      });
    });
  }
  
  // Bloquer les raccourcis clavier d'inspection sur les images
  document.addEventListener('keydown', (e) => {
    const target = e.target;
    
    // Vérifier si on est sur une image ou dans un conteneur d'image
    if (target.tagName === 'IMG' || target.querySelector('img')) {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (Windows/Linux)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Cmd+Option+I (Mac)
      if (e.metaKey && e.altKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C (inspect element)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      
      // Cmd+Option+C (Mac)
      if (e.metaKey && e.altKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (view source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      
      // Cmd+U (Mac)
      if (e.metaKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
    }
  });
  
  // Bloquer le clic droit sur tout le document (fallback)
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('a[data-fancybox]')) {
      e.preventDefault();
      return false;
    }
  });
  
  // Appliquer les protections au chargement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', protectImages);
  } else {
    protectImages();
  }
  
  // Observer pour les images ajoutées dynamiquement
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.tagName === 'IMG') {
            protectImages();
          } else if (node.querySelector && node.querySelector('img')) {
            protectImages();
          }
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

