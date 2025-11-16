const ImageOptimizer = (function() {
  'use strict';
  
  const config = {
    rootMargin: '50px',
    threshold: 0.01,
    loadDelay: 0,
    fadeInDuration: 500,
    enableLQIP: true,
    preloadAdjacent: 2
  };
  
  const stats = {
    total: 0,
    loaded: 0,
    failed: 0,
    cached: 0
  };
  
  let observer = null;
  const loadingImages = new Map();
  
  function getLocalImageUrl(filename) {
    const depth = (window.location.pathname.match(/\//g) || []).length;
    let basePath = '';
    
    if (depth > 1) {
      basePath = '../'.repeat(depth - 1);
    }
    
    return `${basePath}assets/images/${filename}`;
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
    loadingImages.set(img, true);
    
    const filename = img.dataset.filename || img.dataset.src;
    if (!filename) {
      console.warn('No filename or data-src found for image', img);
      return;
    }
    
    const isLQIP = img.dataset.lqip === 'true';
    const targetUrl = img.dataset.src || getLocalImageUrl(filename);
    
    if (img.src === targetUrl) {
      markAsLoaded(img);
      return;
    }
    
    img.classList.add('loading');
    
    const loader = new Image();
    loader.onload = () => {
      setTimeout(() => {
        if (isLQIP) {
          img.style.transition = `opacity ${config.fadeInDuration}ms ease-in-out`;
          img.style.opacity = '0';
          
          setTimeout(() => {
            img.src = targetUrl;
            img.srcset = img.dataset.srcset || '';
            img.style.opacity = '1';
            markAsLoaded(img);
          }, 50);
        } else {
          img.src = targetUrl;
          img.srcset = img.dataset.srcset || '';
          img.style.opacity = '1';
          markAsLoaded(img);
        }
        
        img.classList.remove('loading');
        img.classList.add('loaded');
        
        if (img.dataset.preloadAdjacent === 'true') {
          preloadAdjacentImages(img);
        }
        
        stats.loaded++;
      }, config.loadDelay);
    };
    
    loader.onerror = () => {
      console.error('Failed to load image:', targetUrl);
      img.classList.remove('loading');
      img.classList.add('error');
      stats.failed++;
      loadingImages.delete(img);
    };
    
    loader.src = targetUrl;
  }
  
  function markAsLoaded(img) {
    img.dataset.loaded = 'true';
    img.removeAttribute('data-filename');
    loadingImages.delete(img);
    
    img.dispatchEvent(new CustomEvent('imageLoaded', {
      bubbles: true,
      detail: { src: img.src }
    }));
  }
  
  function preloadAdjacentImages(currentImg) {
    const container = currentImg.closest('[data-gallery]') || document;
    const allImages = Array.from(container.querySelectorAll('img[data-filename]'));
    const currentIndex = allImages.indexOf(currentImg);
    
    if (currentIndex === -1) return;
    
    const toPreload = [];
    
    for (let i = 1; i <= config.preloadAdjacent; i++) {
      const prevIndex = currentIndex - i;
      if (prevIndex >= 0) {
        toPreload.push(allImages[prevIndex]);
      }
    }
    
    for (let i = 1; i <= config.preloadAdjacent; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < allImages.length) {
        toPreload.push(allImages[nextIndex]);
      }
    }
    
    toPreload.forEach(img => {
      if (!img.dataset.loaded && !loadingImages.has(img)) {
        loadImage(img);
      }
    });
  }
  
  function setupImage(img, options = {}) {
    const {
      filename,
      size = 'medium',
      alt = '',
      enableLQIP = config.enableLQIP,
      preloadAdjacent = false,
      immediate = false
    } = options;
    
    stats.total++;
    
    img.dataset.filename = filename;
    img.dataset.size = size;
    img.alt = alt;
    
    if (preloadAdjacent) {
      img.dataset.preloadAdjacent = 'true';
    }
    
    img.style.opacity = '0';
    img.style.transition = `opacity ${config.fadeInDuration}ms ease-in-out`;
    
    if (immediate || !observer) {
      loadImage(img);
    } else {
      observer.observe(img);
    }
    
    return img;
  }
  
  function initLazyImages(container = document) {
    initObserver();
    
    const lazyImages = container.querySelectorAll('img[data-lazy]');
    
    lazyImages.forEach(img => {
      const filename = img.dataset.lazy;
      const size = img.dataset.size || 'medium';
      const alt = img.alt || '';
      const preloadAdjacent = img.dataset.preloadAdjacent === 'true';
      
      setupImage(img, { filename, size, alt, preloadAdjacent });
      img.removeAttribute('data-lazy');
    });
    
    return lazyImages.length;
  }
  
  function createOptimizedImage(options = {}) {
    const img = document.createElement('img');
    const {
      filename,
      size = 'medium',
      alt = '',
      className = '',
      preloadAdjacent = false,
      immediate = false
    } = options;
    
    if (className) {
      img.className = className;
    }
    
    setupImage(img, { filename, size, alt, preloadAdjacent, immediate });
    
    return img;
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
      pending: stats.total - stats.loaded - stats.failed,
      successRate: stats.total > 0 ? (stats.loaded / stats.total * 100).toFixed(2) + '%' : '0%'
    };
  }
  
  function resetStats() {
    stats.total = 0;
    stats.loaded = 0;
    stats.failed = 0;
    stats.cached = 0;
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
    setupImage,
    initLazyImages,
    createOptimizedImage,
    loadImage,
    loadAllPending,
    preloadAdjacentImages,
    destroy,
    getStats,
    resetStats,
    setConfig
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageOptimizer;
}
