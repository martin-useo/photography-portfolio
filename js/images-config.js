// Configuration centralisée des images du portfolio
// Ce fichier contient toutes les images disponibles avec leurs métadonnées

const IMAGES_CONFIG = {
  // Toutes les images disponibles
  // format: 'portrait' (vertical) ou 'landscape' (horizontal)
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

  // Fonction pour obtenir le chemin relatif selon la page
  getImagePath: function(filename, basePath = '') {
    // Le basePath est maintenant relatif à la racine du projet
    return `${basePath}assets/images/${filename}`;
  },

  // Fonction pour obtenir toutes les images
  getAllImages: function(basePath = '') {
    return this.all.map(img => ({
      ...img,
      src: this.getImagePath(img.filename, basePath)
    }));
  },

  // Fonction pour obtenir les images par catégorie
  getImagesByCategory: function(category, basePath = '') {
    return this.all
      .filter(img => img.category === category)
      .map(img => ({
        ...img,
        src: this.getImagePath(img.filename, basePath)
      }));
  },

  // Fonction pour obtenir les images de nature
  getNatureImages: function(basePath = '') {
    return this.getImagesByCategory('nature', basePath);
  },

  // Fonction pour obtenir les images de portraits
  getPortraitImages: function(basePath = '') {
    return this.getImagesByCategory('portraits', basePath);
  },

  // Fonction pour ajouter une nouvelle image (utile pour l'extension future)
  addImage: function(imageData) {
    this.all.push(imageData);
  },

  // Fonction pour obtenir le nombre total d'images
  getTotalCount: function() {
    return this.all.length;
  },

  // Fonction pour détecter automatiquement le format et les dimensions d'une image
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
        // En cas d'erreur, fallback sur landscape avec ratio 16:9
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

  // Fonction pour enrichir les images avec leur format et dimensions réels
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

