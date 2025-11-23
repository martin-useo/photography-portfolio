const PortfolioLayout = {
  createOptimizedImage(imageSrc, imageAlt, imageFilename) {
    const filename = imageFilename || imageSrc.split('/').pop();
    return `<img data-src="${imageSrc}" 
                 data-filename="${filename}"
                 alt="${imageAlt}" 
                 class="w-full h-full object-cover lazy-load opacity-0" />`;
  },
  
  async generatePortfolio(images, gridElement) {
    gridElement.innerHTML = '';
    
    const getColumnCount = () => {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    };
    
    let columnCount = getColumnCount();
    const gap = window.innerWidth >= 768 ? 24 : 16;
    
    gridElement.className = 'flex gap-4 md:gap-6';
    gridElement.style.display = 'flex';
    
    const columns = [];
    const columnHeights = [];
    for (let i = 0; i < columnCount; i++) {
      const column = document.createElement('div');
      column.className = 'flex-1 flex flex-col gap-4 md:gap-6';
      column.style.flex = '1';
      column.style.display = 'flex';
      column.style.flexDirection = 'column';
      gridElement.appendChild(column);
      columns.push(column);
      columnHeights.push(0);
    }
    
    const imagesInOrder = [];
    
    images.forEach((img, originalIndex) => {
      let shortestColumnIndex = 0;
      let shortestHeight = columnHeights[0];
      
      for (let i = 1; i < columnHeights.length; i++) {
        if (columnHeights[i] < shortestHeight) {
          shortestHeight = columnHeights[i];
          shortestColumnIndex = i;
        }
      }
      
      const item = document.createElement('div');
      item.className = 'relative overflow-hidden rounded-sm transition-all duration-300 hover:scale-105 hover:rounded-lg';
      item.style.width = '100%';
      item.style.aspectRatio = img.aspectRatio;
      item.dataset.originalIndex = originalIndex;
      
      item.innerHTML = `
        <a href="${img.src}" data-fancybox="gallery" data-original-index="${originalIndex}" class="block h-full w-full">
          ${this.createOptimizedImage(img.src, img.alt || '', img.filename)}
        </a>
      `;
      
      columns[shortestColumnIndex].appendChild(item);
      imagesInOrder.push({
        filename: img.filename,
        alt: img.alt || '',
        originalIndex: originalIndex
      });
    
      const estimatedHeight = (columns[shortestColumnIndex].offsetWidth || 300) / img.aspectRatio;
      columnHeights[shortestColumnIndex] += estimatedHeight + gap;
    });
      
    let resizeTimeout;
    let currentColumnCount = columnCount;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newColumnCount = getColumnCount();
        if (newColumnCount !== currentColumnCount) {
          currentColumnCount = newColumnCount;
          this.generatePortfolio(images, gridElement);
        }
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    if (typeof ImageOptimizer !== 'undefined') {
      ImageOptimizer.initLazyImages(gridElement);
    }
    
    if (typeof Fancybox !== 'undefined') {
      if (typeof LightboxOptimizer !== 'undefined') {
        const galleryItems = LightboxOptimizer.prepareGalleryItems(imagesInOrder, 'gallery');
        
        // Intercepter les clics pour utiliser l'ordre original
        const allLinks = Array.from(gridElement.querySelectorAll('[data-fancybox="gallery"]'));
        allLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            const clickedIndex = parseInt(link.dataset.originalIndex || '0', 10);
            
            // Ouvrir Fancybox avec les items dans l'ordre original
            Fancybox.show(galleryItems, {
              startIndex: clickedIndex,
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
                reveal: (fancybox, slide) => {
                  const currentIndex = slide.index;
                  // Preload des images adjacentes (2 avant, 2 après)
                  setTimeout(() => {
                    const preloadCount = 2;
                    for (let i = 1; i <= preloadCount; i++) {
                      const prevIndex = currentIndex - i;
                      if (prevIndex >= 0 && galleryItems[prevIndex]) {
                        const img = new Image();
                        img.src = galleryItems[prevIndex].highResUrl;
                      }
                      const nextIndex = currentIndex + i;
                      if (nextIndex < galleryItems.length && galleryItems[nextIndex]) {
                        const img = new Image();
                        img.src = galleryItems[nextIndex].highResUrl;
                      }
                    }
                  }, 100);
                },
                'Carousel.change': (fancybox, carousel, to, from) => {
                  if (to !== undefined) {
                    const preloadCount = 2;
                    for (let i = 1; i <= preloadCount; i++) {
                      const prevIndex = to - i;
                      if (prevIndex >= 0 && galleryItems[prevIndex]) {
                        const img = new Image();
                        img.src = galleryItems[prevIndex].highResUrl;
                      }
                      const nextIndex = to + i;
                      if (nextIndex < galleryItems.length && galleryItems[nextIndex]) {
                        const img = new Image();
                        img.src = galleryItems[nextIndex].highResUrl;
                      }
                    }
                  }
                }
              }
            });
          });
        });
      } else {
        // Fallback si LightboxOptimizer n'est pas disponible
        Fancybox.bind("[data-fancybox='gallery']", {
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
          }
        });
      }
    }
  }
};
