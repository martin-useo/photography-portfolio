const IMAGES_CONFIG = {
  all: [
    { 
      filename: 'ThéoNoJitensha-1.jpg', 
      alt: 'a person standing in front of a rock formation', 
      category: 'portraits'
    },
    { 
      filename: 'ThéoNoJitensha-2.jpg', 
      alt: 'a cat laying on top of a sidewalk next to the ocean', 
      category: 'portraits'
    },
    { 
      filename: 'ThéoNoJitensha-3.jpg', 
      alt: 'a man standing on a beach next to the ocean', 
      category: 'nature'
    },
    { 
      filename: 'ThéoNoJitensha-4.jpg', 
      alt: 'a snow covered mountain with trees on the side', 
      category: 'nature'
    },
    { 
      filename: 'ThéoNoJitensha-5.jpg', 
      alt: 'a branch of a plant floating in a body of water', 
      category: 'nature'
    },
    { 
      filename: 'ThéoNoJitensha-6.jpg', 
      alt: 'a blue sky with a lot of red and orange clouds', 
      category: 'nature'
    },
    { 
      filename: 'ThéoNoJitensha-7.jpg', 
      alt: 'a view of the ocean from the top of a hill', 
      category: 'nature'
    }
  ],

  getImagePath: function(filename, basePath = '') {
    return `${basePath}assets/images/${filename}`;
  },

  getAllImages: function(basePath = '') {
    return this.all.map(img => ({
      ...img,
      src: this.getImagePath(img.filename, basePath)
    }));
  },

  getImagesByCategory: function(category, basePath = '') {
    return this.all
      .filter(img => img.category === category)
      .map(img => ({
        ...img,
        src: this.getImagePath(img.filename, basePath)
      }));
  },

  getNatureImages: function(basePath = '') {
    return this.getImagesByCategory('nature', basePath);
  },

  getPortraitImages: function(basePath = '') {
    return this.getImagesByCategory('portraits', basePath);
  },

  addImage: function(imageData) {
    this.all.push(imageData);
  },

  getTotalCount: function() {
    return this.all.length;
  },

  detectImageDimensions: function(imageSrc) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function() {
        const format = img.height > img.width ? 'portrait' : 'landscape';
        const aspectRatio = img.width / img.height;
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          format: format,
          aspectRatio: aspectRatio
        });
      };
      img.onerror = function() {
        resolve({
          width: 1920,
          height: 1080,
          format: 'landscape',
          aspectRatio: 16/9
        });
      };
      img.src = imageSrc;
    });
  },

  enrichImagesWithFormat: async function(images) {
    const enrichedImages = await Promise.all(
      images.map(async (img) => {
        const dimensions = await this.detectImageDimensions(img.src);
        return {
          ...img,
          width: dimensions.width,
          height: dimensions.height,
          aspectRatio: dimensions.aspectRatio,
          detectedFormat: dimensions.format,
          actualFormat: dimensions.format
        };
      })
    );
    return enrichedImages;
  }
};
