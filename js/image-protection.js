(function() {
  'use strict';
  
  function protectImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
      
      img.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
      });
      
      img.style.userSelect = 'none';
      img.style.webkitUserSelect = 'none';
      img.style.mozUserSelect = 'none';
      img.style.msUserSelect = 'none';
      
      img.setAttribute('draggable', 'false');
      
      img.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
          img.style.pointerEvents = 'none';
          setTimeout(() => {
            img.style.pointerEvents = 'auto';
          }, 100);
        }
        // Empêcher le clic molette (bouton du milieu)
        if (e.button === 1) {
          e.preventDefault();
          return false;
        }
      });
      
      // Empêcher aussi auxclick (événement spécifique pour clic molette)
      img.addEventListener('auxclick', (e) => {
        if (e.button === 1) {
          e.preventDefault();
          return false;
        }
      });
    });
    
    // Empêcher le clic molette sur les liens qui entourent les images
    const imageLinks = document.querySelectorAll('a[data-fancybox], a[href*=".webp"], a[href*="images-optimized"]');
    imageLinks.forEach(link => {
      link.addEventListener('auxclick', (e) => {
        if (e.button === 1) {
          e.preventDefault();
          return false;
        }
      });
      
      link.addEventListener('mousedown', (e) => {
        if (e.button === 1) {
          e.preventDefault();
          return false;
        }
      });
    });
  }
  
  document.addEventListener('keydown', (e) => {
    const target = e.target;
    
    if (target.tagName === 'IMG' || target.querySelector('img')) {
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      if (e.metaKey && e.altKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      
      if (e.metaKey && e.altKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      
      if (e.metaKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
    }
  });
  
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('a[data-fancybox]')) {
      e.preventDefault();
      return false;
    }
  });
  
  // Empêcher le clic molette sur les liens de galerie (global)
  document.addEventListener('auxclick', (e) => {
    // Empêcher le clic molette sur les liens de galerie
    if (e.target.closest('a[data-fancybox]') || e.target.closest('a[href*=".webp"]') || e.target.closest('a[href*="images-optimized"]')) {
      if (e.button === 1) {
        e.preventDefault();
        return false;
      }
    }
  });
  
  document.addEventListener('mousedown', (e) => {
    // Empêcher le clic molette sur les liens de galerie
    if (e.target.closest('a[data-fancybox]') || e.target.closest('a[href*=".webp"]') || e.target.closest('a[href*="images-optimized"]')) {
      if (e.button === 1) {
        e.preventDefault();
        return false;
      }
    }
  });
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', protectImages);
  } else {
    protectImages();
  }
  
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

