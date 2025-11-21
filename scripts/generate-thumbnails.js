#!/usr/bin/env node

/**
 * Script de génération d'images optimisées
 * Génère 3 versions de chaque image en WebP uniquement :
 * - LQIP (400px max, qualité 50)
 * - Display (1920px max, qualité 85)
 * - Lightbox (2800px max, qualité 90)
 * 
 * Toutes les métadonnées EXIF sont supprimées (GPS, appareil photo, date, etc.)
 * pour protéger la vie privée et réduire la taille des fichiers.
 * 
 * Usage: node scripts/generate-thumbnails.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '../assets/images');
const OUTPUT_DIR = path.join(__dirname, '../assets/images-optimized');

// Configuration optimisée (WebP uniquement)
const SIZES = {
  lqip: {
    maxWidth: 400,
    quality: 50,
    suffix: '-lqip'
  },
  display: {
    maxWidth: 1920,
    quality: 85,
    suffix: '-display'
  },
  lightbox: {
    maxWidth: 2800,
    quality: 90,
    suffix: '-lightbox'
  }
};

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

console.log(`${colors.cyan}${colors.bright}
╔═══════════════════════════════════════════════╗
║   📸 Génération d'Images Optimisées          ║
╚═══════════════════════════════════════════════╝
${colors.reset}\n`);

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`${colors.green}✓${colors.reset} Dossier créé: ${OUTPUT_DIR}\n`);
}

// Fonction pour générer une version d'image (WebP uniquement, métadonnées EXIF supprimées)
async function generateVersion(inputPath, outputPath, config, metadata) {
  const { maxWidth, quality } = config;
  
  // Calculer les dimensions en gardant l'aspect ratio
  let width, height;
  if (metadata.width > metadata.height) {
    // Paysage
    width = Math.min(maxWidth, metadata.width);
    height = Math.round((width / metadata.width) * metadata.height);
  } else {
    // Portrait
    height = Math.min(maxWidth, metadata.height);
    width = Math.round((height / metadata.height) * metadata.width);
  }
  
  // Supprimer toutes les métadonnées EXIF (GPS, appareil photo, date, etc.)
  // Sharp supprime automatiquement les métadonnées lors de la conversion en WebP
  // Pas besoin de withMetadata() - c'est le comportement par défaut
  await sharp(inputPath)
    .resize(width, height, { 
      fit: 'inside',
      withoutEnlargement: true 
    })
    .webp({ 
      quality: quality,
      effort: 6 // Compression effort (0-6, 6 = meilleure compression)
    })
    .toFile(outputPath);
  
  return { width, height, size: fs.statSync(outputPath).size };
}

// Fonction pour traiter une image
async function processImage(filename) {
  const inputPath = path.join(IMAGES_DIR, filename);
  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext);
  
  console.log(`${colors.cyan}📷 ${filename}${colors.reset}`);
  
  try {
    const metadata = await sharp(inputPath).metadata();
    const originalSize = fs.statSync(inputPath).size;
    
    console.log(`   Original: ${metadata.width}x${metadata.height} (${(originalSize / 1024 / 1024).toFixed(2)} Mo)`);
    
    const results = {};
    
    // Générer LQIP (WebP uniquement, métadonnées EXIF supprimées)
    console.log(`   ${colors.yellow}→${colors.reset} Génération LQIP...`);
    const lqipPath = path.join(OUTPUT_DIR, `${baseName}${SIZES.lqip.suffix}.webp`);
    
    results.lqip = await generateVersion(inputPath, lqipPath, SIZES.lqip, metadata);
    
    const lqipSize = (results.lqip.size / 1024).toFixed(2);
    console.log(`   ${colors.green}✓${colors.reset} LQIP: ${results.lqip.width}x${results.lqip.height}px (${lqipSize} Ko) [WebP, EXIF supprimé]`);
    
    // Générer Display (WebP uniquement, métadonnées EXIF supprimées)
    console.log(`   ${colors.yellow}→${colors.reset} Génération Display...`);
    const displayPath = path.join(OUTPUT_DIR, `${baseName}${SIZES.display.suffix}.webp`);
    
    results.display = await generateVersion(inputPath, displayPath, SIZES.display, metadata);
    
    const displaySize = (results.display.size / 1024).toFixed(2);
    console.log(`   ${colors.green}✓${colors.reset} Display: ${results.display.width}x${results.display.height}px (${displaySize} Ko) [WebP, EXIF supprimé]`);
    
    // Générer Lightbox (WebP uniquement, métadonnées EXIF supprimées)
    console.log(`   ${colors.yellow}→${colors.reset} Génération Lightbox...`);
    const lightboxPath = path.join(OUTPUT_DIR, `${baseName}${SIZES.lightbox.suffix}.webp`);
    
    results.lightbox = await generateVersion(inputPath, lightboxPath, SIZES.lightbox, metadata);
    
    const lightboxSize = (results.lightbox.size / 1024).toFixed(2);
    console.log(`   ${colors.green}✓${colors.reset} Lightbox: ${results.lightbox.width}x${results.lightbox.height}px (${lightboxSize} Ko) [WebP, EXIF supprimé]`);
    
    // Calculer l'économie
    const totalOptimized = results.lqip.size + results.display.size + results.lightbox.size;
    const economy = ((1 - totalOptimized / originalSize) * 100).toFixed(1);
    console.log(`   ${colors.cyan}📊${colors.reset} Économie: ${economy}% (${(totalOptimized / 1024 / 1024).toFixed(2)} Mo vs ${(originalSize / 1024 / 1024).toFixed(2)} Mo)\n`);
    
    return { success: true, filename, results };
    
  } catch (error) {
    console.log(`   ${colors.red}✗ Erreur: ${error.message}${colors.reset}\n`);
    return { success: false, filename, error: error.message };
  }
}

// Fonction principale
async function main() {
  try {
    const files = fs.readdirSync(IMAGES_DIR)
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
      .sort();
    
    if (files.length === 0) {
      console.log(`${colors.yellow}⚠ Aucune image trouvée dans ${IMAGES_DIR}${colors.reset}`);
      return;
    }
    
    console.log(`${colors.bright}Traitement de ${files.length} image(s)...${colors.reset}\n`);
    
    const results = {
      success: [],
      failed: [],
      totalOriginalSize: 0,
      totalOptimizedSize: 0
    };
    
    for (const file of files) {
      const result = await processImage(file);
      if (result.success) {
        results.success.push(result.filename);
        const originalSize = fs.statSync(path.join(IMAGES_DIR, file)).size;
        results.totalOriginalSize += originalSize;
        results.totalOptimizedSize += result.results.lqip.size + result.results.display.size + result.results.lightbox.size;
      } else {
        results.failed.push(result);
      }
    }
    
    // Résumé final
    console.log(`${colors.bright}═══════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}📊 Résumé Final :${colors.reset}\n`);
    console.log(`${colors.green}✓ ${results.success.length} image(s) traitée(s) avec succès${colors.reset}`);
    
    if (results.failed.length > 0) {
      console.log(`${colors.red}✗ ${results.failed.length} image(s) en erreur${colors.reset}`);
    }
    
    const totalEconomy = ((1 - results.totalOptimizedSize / results.totalOriginalSize) * 100).toFixed(1);
    console.log(`\n${colors.cyan}💾 Taille totale :${colors.reset}`);
    console.log(`   Original: ${(results.totalOriginalSize / 1024 / 1024).toFixed(2)} Mo`);
    console.log(`   Optimisé: ${(results.totalOptimizedSize / 1024 / 1024).toFixed(2)} Mo`);
    console.log(`   ${colors.green}Économie: ${totalEconomy}%${colors.reset}`);
    
    console.log(`\n${colors.bright}📁 Dossier de sortie :${colors.reset}`);
    console.log(`   ${OUTPUT_DIR}`);
    
    console.log(`\n${colors.bright}💡 Utilisation :${colors.reset}`);
    console.log(`   - LQIP: chargement immédiat (400px, ~30 Ko)`);
    console.log(`   - Display: galeries (1920px, ~300 Ko)`);
    console.log(`   - Lightbox: zoom (2800px, ~700 Ko)`);
    console.log(`   - Format: WebP uniquement (support 97%+ navigateurs)`);
    console.log(`   - Métadonnées: Toutes les métadonnées EXIF supprimées (GPS, appareil, date, etc.)`);
    
  } catch (error) {
    console.error(`${colors.red}Erreur fatale: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Vérifier si sharp est installé
try {
  require.resolve('sharp');
  main();
} catch (e) {
  console.log(`${colors.red}✗ Le package "sharp" n'est pas installé${colors.reset}`);
  console.log(`\n${colors.bright}Installation :${colors.reset}`);
  console.log(`   npm install sharp\n`);
  process.exit(1);
}
