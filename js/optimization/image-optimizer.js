const ImageOptimizer = (function() {
  'use strict';
  
  const config = {
    rootMargin: '100px',
    threshold: 0.01,
    fadeInDuration: 600,
    blurTransition: 800
  };
  
  const stats = {
    total: 0,
    lqipLoaded: 0,
    displayLoaded: 0, // Renommé de thumbLoaded
    failed: 0
  };
  
  let observer = null;
  const loadingImages = new Map();
  
  function getImagePath(filename, version = 'display') {
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(p => p && p !== 'index.html');
    let basePath = '';
    
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      const secondLastPart = pathParts.length >= 2 ? pathParts[pathParts.length - 2] : null;
      
      if (secondLastPart === 'portfolio' || (lastPart === 'portfolio' && pathParts.length >= 2)) {
        basePath = '../../';
      } else if (secondLastPart === 'pages' || lastPart === 'pages') {
        basePath = '../';
      }
    }
    
    const ext = filename.match(/\.[^.]+$/)?.[0] || '.jpg';
    const baseName = filename.replace(ext, '');
    
    // WebP uniquement (support 97%+ navigateurs)
    switch(version) {
      case 'lqip':
        return `${basePath}assets/images-optimized/${baseName}-lqip.webp`;
      case 'display':
      case 'thumb': // Rétrocompatibilité
        return `${basePath}assets/images-optimized/${baseName}-display.webp`;
      case 'lightbox':
        return `${basePath}assets/images-optimized/${baseName}-lightbox.webp`;
      default:
        // Par défaut, utiliser display (plus jamais full res)
        return `${basePath}assets/images-optimized/${baseName}-display.webp`;
    }
  }
  
  function initObserver() {
    if (observer) return observer;
    
    if (!('IntersectionObserver' in window)) {
      return null;
    }
    
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: config.rootMargin,
      threshold: config.threshold
    });
    
    return observer;
  }
  
  function loadImage(img) {
    if (loadingImages.has(img)) return;
    if (img.dataset.loaded === 'true') return;
    if (img.dataset.loading === 'true') return;
    
    const filename = img.dataset.filename;
    if (!filename) return;
    
    loadingImages.set(img, true);
    img.dataset.loading = 'true';
    img.classList.add('loading');
    stats.total++;
    
    const lqipUrl = getImagePath(filename, 'lqip');
    const displayUrl = getImagePath(filename, 'display');
    
    const state = { displayAttempted: false };
    
    const lqipImg = new Image();
    lqipImg.onload = () => {
      img.src = lqipUrl;
      img.style.opacity = '1';
      img.style.filter = 'blur(10px)';
      stats.lqipLoaded++;
      
      if (!state.displayAttempted) {
        loadDisplay(img, displayUrl, filename, state);
      }
    };
    
    lqipImg.onerror = () => {
      // Si LQIP échoue, essayer directement display
      if (!state.displayAttempted) {
        loadDisplay(img, displayUrl, filename, state);
      }
    };
    
    lqipImg.src = lqipUrl;
    
    function loadDisplay(imgElement, displayUrl, imgFilename, imgState) {
      if (imgState.displayAttempted) return;
      imgState.displayAttempted = true;
      
      const displayImg = new Image();
      displayImg.onload = () => {
        imgElement.src = displayUrl;
        imgElement.style.filter = 'blur(0)';
        imgElement.style.transition = `filter ${config.blurTransition}ms ease-in-out`;
        imgElement.classList.remove('loading');
        imgElement.classList.add('display-loaded');
        imgElement.dataset.loaded = 'true';
        imgElement.dataset.loading = 'false';
        stats.displayLoaded++;
        loadingImages.delete(imgElement);
        
        imgElement.dispatchEvent(new CustomEvent('imageLoaded', {
          bubbles: true,
          detail: { src: displayUrl, filename: imgFilename }
        }));
      };
      
      displayImg.onerror = () => {
        imgElement.style.filter = 'blur(0)';
        imgElement.classList.remove('loading');
        imgElement.dataset.loaded = 'true';
        imgElement.dataset.loading = 'false';
        stats.failed++;
        loadingImages.delete(imgElement);
      };
      
      displayImg.src = displayUrl;
    }
  }
  
  function getLightboxUrl(filename) {
    return getImagePath(filename, 'lightbox');
  }
  
  function initLazyImages(container = document) {
    if (!container) return;
    
    initObserver();
    
    const lazyImages = container.querySelectorAll('img.lazy-load[data-filename]:not([data-loaded])');
    
    lazyImages.forEach((img) => {
      img.style.opacity = '0';
      img.style.transition = `opacity ${config.fadeInDuration}ms ease-in-out`;
      
      if (observer) {
        observer.observe(img);
      } else {
        loadImage(img);
      }
    });
    
    return lazyImages.length;
  }
  
  function loadAllPending() {
    if (observer) {
      const pendingImages = document.querySelectorAll('img[data-filename]');
      pendingImages.forEach(img => {
        observer.unobserve(img);
        loadImage(img);
      });
    }
  }
  
  function destroy() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    loadingImages.clear();
  }
  
  function getStats() {
    return {
      ...stats,
      pending: stats.total - stats.displayLoaded - stats.failed,
      successRate: stats.total > 0 ? (stats.displayLoaded / stats.total * 100).toFixed(2) + '%' : '0%'
    };
  }
  
  function resetStats() {
    stats.total = 0;
    stats.lqipLoaded = 0;
    stats.displayLoaded = 0;
    stats.failed = 0;
  }
  
  function setConfig(newConfig) {
    Object.assign(config, newConfig);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initObserver();
    });
  } else {
    initObserver();
  }
  
  return {
    initLazyImages,
    loadImage,
    loadAllPending,
    getLightboxUrl, // Renommé de getFullResUrl
    getImagePath,
    destroy,
    getStats,
    resetStats,
    setConfig
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageOptimizer;
}
