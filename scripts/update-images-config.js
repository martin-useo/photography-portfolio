#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const exifr = require('exifr');

const imagesDir = path.join(__dirname, '..', 'assets', 'images');
const configPath = path.join(__dirname, '..', 'js', 'images-config.js');

const imageFiles = fs.readdirSync(imagesDir)
  .filter(file => file.endsWith('.jpg'))
  .sort((a, b) => {
    const getNumber = (str) => {
      const match = str.match(/-(\d+)\.jpg$/);
      return match ? parseInt(match[1], 10) : 0;
    };
    const getPrefix = (str) => str.split('-')[0];
    
    const prefixA = getPrefix(a);
    const prefixB = getPrefix(b);
    
    if (prefixA === prefixB) {
      return getNumber(a) - getNumber(b);
    }
    return prefixA.localeCompare(prefixB);
  });

console.log(`📷 Trouvé ${imageFiles.length} images`);
console.log('📐 Calcul des aspect ratios et extraction des ratings...');

const imageMetadata = {};
let processed = 0;

async function processImages() {
  for (const file of imageFiles) {
    try {
      const imagePath = path.join(imagesDir, file);
      const metadata = await sharp(imagePath).metadata();
      const aspectRatio = metadata.width / metadata.height;
      
      let rating = null;
      try {
        const exifData = await exifr.parse(imagePath, {
          xmp: true,
          iptc: true
        });
        rating = exifData?.Rating || exifData?.rating || null;
        if (rating !== null && typeof rating === 'number') {
          rating = Math.round(rating);
        } else if (rating !== null && typeof rating === 'string') {
          const numRating = parseInt(rating, 10);
          rating = isNaN(numRating) ? null : numRating;
        }
      } catch (exifError) {
        // Si l'extraction EXIF échoue, on continue sans rating
      }
      
      imageMetadata[file] = {
        aspectRatio: aspectRatio,
        rating: rating
      };
      processed++;
      if (processed % 20 === 0) {
        process.stdout.write(`\r   ${processed}/${imageFiles.length} images traitées...`);
      }
    } catch (error) {
      console.warn(`\n⚠️  Erreur lors du traitement de ${file}:`, error.message);
      imageMetadata[file] = {
        aspectRatio: 4/3,
        rating: null
      };
    }
  }
  process.stdout.write(`\r   ${processed}/${imageFiles.length} images traitées ✓\n\n`);
}

async function updateConfig() {
  await processImages();

  const imageFilesArray = imageFiles.map(file => `    '${file}'`).join(',\n');
  
  const metadataEntries = Object.entries(imageMetadata)
    .map(([filename, data]) => {
      const ar = data.aspectRatio.toFixed(6);
      const rating = data.rating !== null ? data.rating : null;
      if (rating !== null) {
        return `    '${filename}': { aspectRatio: ${ar}, rating: ${rating} }`;
      } else {
        return `    '${filename}': { aspectRatio: ${ar}, rating: null }`;
      }
    })
    .join(',\n');
  
  const configContent = `const IMAGES_CONFIG = {
  categoryMap: {
    'Animals': 'animaux',
    'Events': 'evenements',
    'Nature': 'nature',
    'Miscellaneous': 'divers',
    'Portraits': 'portraits',
    'Sports': 'sport',
    'Urban': 'urban',
    'Vehicles': 'vehicules'
  },

  imageFiles: [
${imageFilesArray}
  ],

  imageMetadata: {
${metadataEntries}
  },

  getCategoryFromFilename: function(filename) {
    const match = filename.match(/^([A-Za-z]+)-/);
    if (match) {
      const englishCategory = match[1];
      return this.categoryMap[englishCategory] || 'home';
    }
    return 'home';
  },

  createImageObject: function(filename) {
    const metadata = this.imageMetadata[filename];
    const aspectRatio = metadata?.aspectRatio || (typeof metadata === 'number' ? metadata : 4/3);
    const rating = metadata?.rating !== undefined ? metadata.rating : (typeof metadata === 'number' ? null : null);
    
    return {
      filename: filename,
      alt: '',
      category: this.getCategoryFromFilename(filename),
      aspectRatio: aspectRatio,
      rating: rating
    };
  },

  get all() {
    return this.imageFiles.map(filename => this.createImageObject(filename));
  },

  getImagePath: function(filename, basePath = '') {
    return \`\${basePath}assets/images/\${filename}\`;
  },

  getAllImages: function(basePath = '') {
    return this.all.map(img => ({
      ...img,
      src: this.getImagePath(img.filename, basePath)
    }));
  },

  getImagesByCategory: function(category, basePath = '') {
    const images = this.all
      .filter(img => img.category === category)
      .map(img => ({
        ...img,
        src: this.getImagePath(img.filename, basePath)
      }));
    
    return images.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      
      if (ratingB !== ratingA) {
        return ratingB - ratingA;
      }
      
      const numA = parseInt(a.filename.match(/-(\d+)\\./)?.[1] || '0', 10);
      const numB = parseInt(b.filename.match(/-(\d+)\\./)?.[1] || '0', 10);
      return numA - numB;
    });
  },

  getNatureImages: function(basePath = '') {
    return this.getImagesByCategory('nature', basePath);
  },

  getPortraitImages: function(basePath = '') {
    return this.getImagesByCategory('portraits', basePath);
  },

  getAnimauxImages: function(basePath = '') {
    return this.getImagesByCategory('animaux', basePath);
  },

  getEvenementsImages: function(basePath = '') {
    return this.getImagesByCategory('evenements', basePath);
  },

  getDiversImages: function(basePath = '') {
    return this.getImagesByCategory('divers', basePath);
  },

  getUrbanImages: function(basePath = '') {
    return this.getImagesByCategory('urban', basePath);
  },

  getVehiculesImages: function(basePath = '') {
    return this.getImagesByCategory('vehicules', basePath);
  },

  getSportImages: function(basePath = '') {
    return this.getImagesByCategory('sport', basePath);
  },

  getShowcaseImages: function(basePath = '') {
    const images = this.getAllImages(basePath);
    
    return images.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      
      if (ratingB !== ratingA) {
        return ratingB - ratingA;
      }
      
      const numA = parseInt(a.filename.match(/-(\d+)\\./)?.[1] || '0', 10);
      const numB = parseInt(b.filename.match(/-(\d+)\\./)?.[1] || '0', 10);
      return numA - numB;
    });
  },

  addImage: function(imageData) {
    this.imageFiles.push(imageData.filename);
  },

  getTotalCount: function() {
    return this.imageFiles.length;
  }
};
`;
  
  fs.writeFileSync(configPath, configContent);
  console.log('✅ Fichier images-config.js régénéré avec succès!');
    
    const stats = {};
    imageFiles.forEach(file => {
      const category = file.split('-')[0];
      stats[category] = (stats[category] || 0) + 1;
    });
    
    const portraitCount = Object.values(imageMetadata).filter(data => data.aspectRatio < 1).length;
    const landscapeCount = Object.values(imageMetadata).filter(data => data.aspectRatio > 1).length;
    const squareCount = Object.values(imageMetadata).filter(data => data.aspectRatio === 1).length;
    
    const ratingStats = {};
    Object.values(imageMetadata).forEach(data => {
      const rating = data.rating || 0;
      ratingStats[rating] = (ratingStats[rating] || 0) + 1;
    });
    
    console.log('\n📊 Répartition par catégorie:');
    Object.entries(stats).sort().forEach(([cat, count]) => {
      console.log(`  - ${cat}: ${count} image${count > 1 ? 's' : ''}`);
    });
    
    console.log('\n📐 Répartition par format:');
    console.log(`  - Portrait (< 1.0): ${portraitCount} image${portraitCount > 1 ? 's' : ''}`);
    console.log(`  - Paysage (> 1.0): ${landscapeCount} image${landscapeCount > 1 ? 's' : ''}`);
    console.log(`  - Carré (= 1.0): ${squareCount} image${squareCount > 1 ? 's' : ''}`);
    
    console.log('\n⭐ Répartition par rating:');
    Object.entries(ratingStats).sort((a, b) => parseInt(b[0]) - parseInt(a[0])).forEach(([rating, count]) => {
      const stars = rating === '0' || rating === 'null' ? 'Non noté' : `${rating} étoile${rating > 1 ? 's' : ''}`;
      console.log(`  - ${stars}: ${count} image${count > 1 ? 's' : ''}`);
    });
}

updateConfig().catch(error => {
  console.error('❌ Erreur:', error);
  process.exit(1);
});

