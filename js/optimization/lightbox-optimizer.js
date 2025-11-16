const LightboxOptimizer = (function() {
  'use strict';
  
  const config = {
    preloadCount: 2,
    highResSize: 'full',
    thumbnailSize: 'medium',
    enablePreload: true,
    cachePreloaded: true
  };
  
  const preloadCache = new Map();
  const galleries = new Map();
  
  function preloadImage(url) {
    if (preloadCache.has(url)) {
      return Promise.resolve(preloadCache.get(url));
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (config.cachePreloaded) {
          preloadCache.set(url, img);
        }
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });
  }
  
  function preloadAdjacentImages(currentIndex, items) {
    if (!config.enablePreload) return;
    
    const toPreload = [];
    
    for (let i = 1; i <= config.preloadCount; i++) {
      const prevIndex = currentIndex - i;
      if (prevIndex >= 0 && items[prevIndex]) {
        toPreload.push(items[prevIndex].highResUrl);
      }
    }
    
    for (let i = 1; i <= config.preloadCount; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < items.length && items[nextIndex]) {
        toPreload.push(items[nextIndex].highResUrl);
      }
    }
    
    toPreload.forEach(url => {
      preloadImage(url).catch(err => {
        console.warn('Failed to preload image:', url, err);
      });
    });
  }
  
  function getLocalImageUrl(filename) {
    const depth = (window.location.pathname.match(/\//g) || []).length;
    let basePath = '';
    
    if (depth > 1) {
      basePath = '../'.repeat(depth - 1);
    }
    
    return `${basePath}assets/images/${filename}`;
  }
  
  function prepareGalleryItems(images, galleryId = 'gallery') {
    const items = images.map((img, index) => {
      const filename = img.filename || img.src?.split('/').pop();
      const imageUrl = getLocalImageUrl(filename);
      
      return {
        src: imageUrl,
        thumb: imageUrl,
        caption: img.alt || img.caption || '',
        filename: filename,
        highResUrl: imageUrl,
        index: index
      };
    });
    
    galleries.set(galleryId, items);
    return items;
  }
  
  function initGallery(selector = '[data-fancybox="gallery"]', options = {}) {
    if (typeof Fancybox === 'undefined') {
      console.error('Fancybox is not loaded');
      return;
    }
    
    const galleryId = options.galleryId || 'gallery';
    
    const elements = document.querySelectorAll(selector);
    const images = Array.from(elements).map(el => {
      const img = el.querySelector('img') || el;
      return {
        filename: img.dataset.filename || img.src?.split('/').pop(),
        alt: img.alt || '',
        element: el
      };
    });
    
    const items = prepareGalleryItems(images, galleryId);
    
    elements.forEach((el, index) => {
      if (items[index]) {
        el.href = items[index].highResUrl;
      }
    });
    
    const defaultOptions = {
      Hash: false,
      Thumbs: {
        autoStart: false,
      },
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [],
          right: ["slideshow", "thumbs", "close"],
        },
      },
      Images: {
        protected: true,
      },
      on: {
        init: (fancybox) => {
          console.log('Lightbox opened');
        },
        
        reveal: (fancybox, slide) => {
          const currentIndex = slide.index;
          
          if (config.enablePreload) {
            setTimeout(() => {
              preloadAdjacentImages(currentIndex, items);
            }, 100);
          }
        },
        
        'Carousel.change': (fancybox, carousel, to, from) => {
          if (config.enablePreload && to !== undefined) {
            preloadAdjacentImages(to, items);
          }
        },
        
        destroy: (fancybox) => {
          console.log('Lightbox closed');
        }
      }
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    Fancybox.bind(selector, finalOptions);
    
    return items;
  }
  
  function initMultipleGalleries(galleriesConfig) {
    return galleriesConfig.map(config => {
      return initGallery(config.selector, {
        ...config.options,
        galleryId: config.id
      });
    });
  }
  
  function openAtIndex(galleryId, index) {
    const items = galleries.get(galleryId);
    if (!items || !items[index]) {
      console.error('Gallery or image not found:', galleryId, index);
      return;
    }
    
    if (typeof Fancybox === 'undefined') {
      console.error('Fancybox is not loaded');
      return;
    }
    
    Fancybox.show(items, { startIndex: index });
  }
  
  function clearCache() {
    preloadCache.clear();
  }
  
  function getCacheStats() {
    return {
      preloadedImages: preloadCache.size,
      galleries: galleries.size,
      config: { ...config }
    };
  }
  
  function setConfig(newConfig) {
    Object.assign(config, newConfig);
  }
  
  function destroy() {
    if (typeof Fancybox !== 'undefined') {
      Fancybox.destroy();
    }
    galleries.clear();
    clearCache();
  }
  
  function createGalleryLink(imageData, container = null) {
    const {
      filename,
      alt = '',
      className = '',
      galleryName = 'gallery',
      imgClassName = ''
    } = imageData;
    
    const imageUrl = getLocalImageUrl(filename);
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.setAttribute('data-fancybox', galleryName);
    link.setAttribute('data-caption', alt);
    if (className) link.className = className;
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = alt;
    img.dataset.filename = filename;
    if (imgClassName) img.className = imgClassName;
    
    link.appendChild(img);
    
    if (container) {
      container.appendChild(link);
    }
    
    return link;
  }
  
  return {
    initGallery,
    initMultipleGalleries,
    prepareGalleryItems,
    openAtIndex,
    createGalleryLink,
    clearCache,
    getCacheStats,
    setConfig,
    destroy
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LightboxOptimizer;
}
