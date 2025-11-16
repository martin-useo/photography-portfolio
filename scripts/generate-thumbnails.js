#!/usr/bin/env node

/**
 * Script de génération de thumbnails
 * Génère 2 versions de chaque image :
 * - Thumb (70% de la taille originale, ~1-2 Mo)
 * - Full-res (conservée telle quelle, pour lightbox)
 * 
 * Usage: node scripts/generate-thumbnails.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '../assets/images');
const OUTPUT_DIR = path.join(__dirname, '../assets/images-optimized');

// Configuration des tailles
const SIZES = {
  thumb: {
    scale: 0.70,  // 70% de la résolution originale
    quality: 70,
    suffix: '-thumb'
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
║   📸 Génération des Thumbnails                ║
╚═══════════════════════════════════════════════╝
${colors.reset}\n`);

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`${colors.green}✓${colors.reset} Dossier créé: ${OUTPUT_DIR}\n`);
}

// Fonction pour traiter une image
async function processImage(filename) {
  const inputPath = path.join(IMAGES_DIR, filename);
  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext);
  
  console.log(`${colors.cyan}📷 ${filename}${colors.reset}`);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`   Taille originale: ${metadata.width}x${metadata.height} (${(fs.statSync(inputPath).size / 1024 / 1024).toFixed(2)} Mo)`);
    
    // Générer thumbnail (70% de la résolution originale)
    const thumbWidth = Math.round(metadata.width * SIZES.thumb.scale);
    const thumbHeight = Math.round(metadata.height * SIZES.thumb.scale);
    const thumbPath = path.join(OUTPUT_DIR, `${baseName}${SIZES.thumb.suffix}${ext}`);
    await sharp(inputPath)
      .resize(thumbWidth, thumbHeight, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality: SIZES.thumb.quality, progressive: true })
      .toFile(thumbPath);
    
    const thumbSize = (fs.statSync(thumbPath).size / 1024).toFixed(2);
    console.log(`   ${colors.green}✓${colors.reset} Thumb: ${thumbWidth}x${thumbHeight}px (${thumbSize} Ko)`);
    
    // Copier la full-res dans le dossier optimized
    const fullresPath = path.join(OUTPUT_DIR, filename);
    if (!fs.existsSync(fullresPath)) {
      fs.copyFileSync(inputPath, fullresPath);
      const fullresSize = (fs.statSync(fullresPath).size / 1024 / 1024).toFixed(2);
      console.log(`   ${colors.green}✓${colors.reset} Full-res: ${metadata.width}x${metadata.height} (${fullresSize} Mo)`);
    }
    
    console.log('');
    return { success: true, filename };
    
  } catch (error) {
    console.log(`   ${colors.red}✗ Erreur: ${error.message}${colors.reset}\n`);
    return { success: false, filename, error: error.message };
  }
}

// Fonction principale
async function main() {
  try {
    // Lire tous les fichiers du dossier images
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
      failed: []
    };
    
    // Traiter chaque image
    for (const file of files) {
      const result = await processImage(file);
      if (result.success) {
        results.success.push(result.filename);
      } else {
        results.failed.push(result);
      }
    }
    
    // Résumé
    console.log(`${colors.bright}═══════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}📊 Résumé :${colors.reset}\n`);
    console.log(`${colors.green}✓ ${results.success.length} image(s) traitée(s) avec succès${colors.reset}`);
    
    if (results.failed.length > 0) {
      console.log(`${colors.red}✗ ${results.failed.length} image(s) en erreur${colors.reset}`);
      results.failed.forEach(item => {
        console.log(`   - ${item.filename}: ${item.error}`);
      });
    }
    
    console.log(`\n${colors.bright}📁 Dossier de sortie :${colors.reset}`);
    console.log(`   ${OUTPUT_DIR}`);
    
    console.log(`\n${colors.bright}💡 Prochaines étapes :${colors.reset}`);
    console.log(`   1. Vérifier les images générées dans ${OUTPUT_DIR}`);
    console.log(`   2. Le site utilisera automatiquement :`);
    console.log(`      - LQIP pour le chargement immédiat (flou)`);
    console.log(`      - Thumb pour les galeries (1200px)`);
    console.log(`      - Full-res pour la lightbox uniquement`);
    
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

