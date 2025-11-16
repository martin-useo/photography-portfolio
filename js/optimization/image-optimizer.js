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
    thumbLoaded: 0,
    failed: 0
  };
  
  let observer = null;
  const loadingImages = new Map();
  
  function getImagePath(filename, version = 'original') {
    const depth = (window.location.pathname.match(/\//g) || []).length;
    let basePath = '';
    
    if (depth > 1) {
      basePath = '../'.repeat(depth - 1);
    }
    
    const ext = filename.match(/\.[^.]+$/)?.[0] || '.jpg';
    const baseName = filename.replace(ext, '');
    
    switch(version) {
      case 'lqip':
        return `${basePath}assets/images-optimized/${baseName}-lqip${ext}`;
      case 'thumb':
        return `${basePath}assets/images-optimized/${baseName}-thumb${ext}`;
      case 'fullres':
        return `${basePath}assets/images/${filename}`;
      default:
        return `${basePath}assets/images/${filename}`;
    }
  }
  
  function initObserver() {
    if (observer) return observer;
    
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, falling back to immediate loading');
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
    
    const filename = img.dataset.filename;
    if (!filename) {
      console.warn('No filename found for image', img);
      return;
    }
    
    loadingImages.set(img, true);
    img.classList.add('loading');
    stats.total++;
    
    const lqipUrl = getImagePath(filename, 'lqip');
    const thumbUrl = getImagePath(filename, 'thumb');
    
    // Charger LQIP immédiatement
    img.src = lqipUrl;
    img.style.opacity = '1';
    img.style.filter = 'blur(10px)';
    stats.lqipLoaded++;
    
    // Précharger le thumbnail
    const thumbImg = new Image();
    thumbImg.onload = () => {
      img.src = thumbUrl;
      img.style.filter = 'blur(0)';
      img.style.transition = `filter ${config.blurTransition}ms ease-in-out`;
      img.classList.remove('loading');
      img.classList.add('thumb-loaded');
      img.dataset.loaded = 'true';
      stats.thumbLoaded++;
      loadingImages.delete(img);
      
      img.dispatchEvent(new CustomEvent('imageLoaded', {
        bubbles: true,
        detail: { src: thumbUrl, filename }
      }));
    };
    
    thumbImg.onerror = () => {
      console.warn('Thumb failed, trying fallback:', filename);
      const fallbackUrl = getImagePath(filename, 'original');
      img.src = fallbackUrl;
      img.style.filter = 'blur(0)';
      img.classList.remove('loading');
      stats.failed++;
      loadingImages.delete(img);
    };
    
    thumbImg.src = thumbUrl;
  }
  
  function getFullResUrl(filename) {
    return getImagePath(filename, 'fullres');
  }
  
  function initLazyImages(container = document) {
    initObserver();
    
    const lazyImages = container.querySelectorAll('img.lazy-load[data-filename]:not([data-loaded])');
    
    lazyImages.forEach(img => {
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
      pending: stats.total - stats.thumbLoaded - stats.failed,
      successRate: stats.total > 0 ? (stats.thumbLoaded / stats.total * 100).toFixed(2) + '%' : '0%'
    };
  }
  
  function resetStats() {
    stats.total = 0;
    stats.lqipLoaded = 0;
    stats.thumbLoaded = 0;
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
    getFullResUrl,
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
