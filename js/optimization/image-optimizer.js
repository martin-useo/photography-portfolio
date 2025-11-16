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
    // Calculer le basePath de manière fiable basé sur le chemin actuel
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(p => p && p !== 'index.html');
    let basePath = '';
    
    // Déterminer le nombre de niveaux à remonter
    // index.html ou / -> 0 niveaux (basePath = '')
    // pages/*.html -> 1 niveau (basePath = '../')
    // pages/portfolio/*.html -> 2 niveaux (basePath = '../../')
    
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      const secondLastPart = pathParts.length >= 2 ? pathParts[pathParts.length - 2] : null;
      
      // Si on est dans pages/portfolio/
      if (secondLastPart === 'portfolio' || (lastPart === 'portfolio' && pathParts.length >= 2)) {
        basePath = '../../';
      } 
      // Si on est dans pages/ mais pas dans portfolio/
      else if (secondLastPart === 'pages' || lastPart === 'pages') {
        basePath = '../';
      }
      // Sinon on est à la racine, basePath reste vide
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
    if (img.dataset.loading === 'true') return; // Éviter les doubles chargements
    
    const filename = img.dataset.filename;
    if (!filename) {
      console.warn('No filename found for image', img);
      return;
    }
    
    loadingImages.set(img, true);
    img.dataset.loading = 'true';
    img.classList.add('loading');
    stats.total++;
    
    const lqipUrl = getImagePath(filename, 'lqip');
    const thumbUrl = getImagePath(filename, 'thumb');
    const fullResUrl = getImagePath(filename, 'fullres');
    
    // Log de diagnostic au début du chargement
    console.log('[ImageOptimizer] Loading image:', {
      filename,
      pathname: window.location.pathname,
      paths: {
        lqip: lqipUrl,
        thumb: thumbUrl,
        fullres: fullResUrl
      }
    });
    
    const state = { thumbAttempted: false };
    
    // Charger LQIP immédiatement
    const lqipImg = new Image();
    lqipImg.onload = () => {
      console.log('[ImageOptimizer] ✓ LQIP loaded successfully:', {
        filename,
        url: lqipUrl
      });
      img.src = lqipUrl;
      img.style.opacity = '1';
      img.style.filter = 'blur(10px)';
      stats.lqipLoaded++;
      
      // Une fois LQIP chargé, charger le thumbnail
      if (!state.thumbAttempted) {
        loadThumbnail(img, thumbUrl, filename, state);
      }
    };
    
    lqipImg.onerror = () => {
      // Si LQIP échoue, essayer directement le thumbnail
      console.warn('[ImageOptimizer] ✗ LQIP failed:', {
        filename,
        url: lqipUrl,
        pathname: window.location.pathname,
        reason: 'File may not exist or path incorrect',
        nextAction: 'Trying thumbnail directly'
      });
      if (!state.thumbAttempted) {
        loadThumbnail(img, thumbUrl, filename, state);
      }
    };
    
    lqipImg.src = lqipUrl;
    
    // Fonction helper pour charger le thumbnail
    function loadThumbnail(imgElement, thumbUrl, imgFilename, imgState) {
      if (imgState.thumbAttempted) return;
      imgState.thumbAttempted = true;
      
      const thumbImg = new Image();
      thumbImg.onload = () => {
        console.log('[ImageOptimizer] ✓ Thumbnail loaded successfully:', {
          filename: imgFilename,
          url: thumbUrl
        });
        imgElement.src = thumbUrl;
        imgElement.style.filter = 'blur(0)';
        imgElement.style.transition = `filter ${config.blurTransition}ms ease-in-out`;
        imgElement.classList.remove('loading');
        imgElement.classList.add('thumb-loaded');
        imgElement.dataset.loaded = 'true';
        imgElement.dataset.loading = 'false';
        stats.thumbLoaded++;
        loadingImages.delete(imgElement);
        
        imgElement.dispatchEvent(new CustomEvent('imageLoaded', {
          bubbles: true,
          detail: { src: thumbUrl, filename: imgFilename }
        }));
      };
      
      thumbImg.onerror = () => {
        // Si thumbnail échoue, essayer l'image originale
        const fallbackUrl = getImagePath(imgFilename, 'fullres');
        console.warn('[ImageOptimizer] ✗ Thumbnail failed:', {
          filename: imgFilename,
          url: thumbUrl,
          pathname: window.location.pathname,
          reason: 'File may not exist or path incorrect',
          nextAction: 'Trying full-res fallback',
          fallbackUrl: fallbackUrl
        });
        
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          console.log('[ImageOptimizer] ✓ Fallback (full-res) loaded:', {
            filename: imgFilename,
            url: fallbackUrl
          });
          imgElement.src = fallbackUrl;
          imgElement.style.filter = 'blur(0)';
          imgElement.classList.remove('loading');
          imgElement.dataset.loaded = 'true';
          imgElement.dataset.loading = 'false';
          stats.failed++;
          loadingImages.delete(imgElement);
        };
        fallbackImg.onerror = () => {
          // Dernier recours : garder LQIP ou afficher une erreur
          console.error('[ImageOptimizer] ✗ All image versions failed:', {
            filename: imgFilename,
            attemptedUrls: {
              lqip: getImagePath(imgFilename, 'lqip'),
              thumb: thumbUrl,
              fullres: fallbackUrl
            },
            pathname: window.location.pathname
          });
          imgElement.style.filter = 'blur(0)';
          imgElement.classList.remove('loading');
          imgElement.dataset.loaded = 'true';
          imgElement.dataset.loading = 'false';
          stats.failed++;
          loadingImages.delete(imgElement);
        };
        fallbackImg.src = fallbackUrl;
      };
      
      thumbImg.src = thumbUrl;
    }
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
