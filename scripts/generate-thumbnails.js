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
const os = require('os');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '../assets/images');
const OUTPUT_DIR = path.join(__dirname, '../assets/images-optimized');

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

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`${colors.green}✓${colors.reset} Dossier créé: ${OUTPUT_DIR}\n`);
}

async function generateVersion(inputPath, outputPath, config, metadata) {
  const { maxWidth, quality } = config;
  
  let width, height;
  if (metadata.width > metadata.height) {
    width = Math.min(maxWidth, metadata.width);
    height = Math.round((width / metadata.width) * metadata.height);
  } else {
    height = Math.min(maxWidth, metadata.height);
    width = Math.round((height / metadata.height) * metadata.width);
  }
  
  await sharp(inputPath)
    .resize(width, height, { 
      fit: 'inside',
      withoutEnlargement: true 
    })
    .webp({ 
      quality: quality,
      effort: 6
    })
    .toFile(outputPath);
  
  return { width, height, size: fs.statSync(outputPath).size };
}

async function processImage(filename, verbose = false) {
  const inputPath = path.join(IMAGES_DIR, filename);
  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext);
  
  if (verbose) {
    console.log(`\n${colors.cyan}📷 ${filename}${colors.reset}`);
  }
  
  try {
    const metadata = await sharp(inputPath).metadata();
    const originalSize = fs.statSync(inputPath).size;
    
    if (verbose) {
      console.log(`   Original: ${metadata.width}x${metadata.height} (${(originalSize / 1024 / 1024).toFixed(2)} Mo)`);
      console.log(`   ${colors.yellow}→${colors.reset} Génération des 3 versions en parallèle...`);
    }
    
    const lqipPath = path.join(OUTPUT_DIR, `${baseName}${SIZES.lqip.suffix}.webp`);
    const displayPath = path.join(OUTPUT_DIR, `${baseName}${SIZES.display.suffix}.webp`);
    const lightboxPath = path.join(OUTPUT_DIR, `${baseName}${SIZES.lightbox.suffix}.webp`);
    
    const [lqipResult, displayResult, lightboxResult] = await Promise.all([
      generateVersion(inputPath, lqipPath, SIZES.lqip, metadata),
      generateVersion(inputPath, displayPath, SIZES.display, metadata),
      generateVersion(inputPath, lightboxPath, SIZES.lightbox, metadata)
    ]);
    
    const results = {
      lqip: lqipResult,
      display: displayResult,
      lightbox: lightboxResult
    };
    
    if (verbose) {
      const lqipSize = (results.lqip.size / 1024).toFixed(2);
      const displaySize = (results.display.size / 1024).toFixed(2);
      const lightboxSize = (results.lightbox.size / 1024).toFixed(2);
      
      console.log(`   ${colors.green}✓${colors.reset} LQIP: ${results.lqip.width}x${results.lqip.height}px (${lqipSize} Ko)`);
      console.log(`   ${colors.green}✓${colors.reset} Display: ${results.display.width}x${results.display.height}px (${displaySize} Ko)`);
      console.log(`   ${colors.green}✓${colors.reset} Lightbox: ${results.lightbox.width}x${results.lightbox.height}px (${lightboxSize} Ko)`);
      
      const totalOptimized = results.lqip.size + results.display.size + results.lightbox.size;
      const economy = ((1 - totalOptimized / originalSize) * 100).toFixed(1);
      console.log(`   ${colors.cyan}📊${colors.reset} Économie: ${economy}%\n`);
    }
    
    return { success: true, filename, results };
    
  } catch (error) {
    if (verbose) {
      console.log(`\n   ${colors.red}✗ Erreur: ${error.message}${colors.reset}\n`);
    }
    return { success: false, filename, error: error.message };
  }
}

function updateProgressBar(current, total, barLength = 40) {
  const percentage = (current / total) * 100;
  const filled = Math.round((current / total) * barLength);
  const empty = barLength - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  process.stdout.write(`\r${colors.cyan}[${bar}]${colors.reset} ${current}/${total} (${percentage.toFixed(1)}%)`);
}

async function processBatch(images, concurrency = 20) {
  const results = {
    success: [],
    failed: [],
    totalOriginalSize: 0,
    totalOptimizedSize: 0
  };

  let processedCount = 0;
  updateProgressBar(0, images.length);

  for (let i = 0; i < images.length; i += concurrency) {
    const batch = images.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(file => processImage(file, false))
    );

    for (const result of batchResults) {
      if (result.status === 'fulfilled' && result.value.success) {
        results.success.push(result.value.filename);
        const originalSize = fs.statSync(path.join(IMAGES_DIR, result.value.filename)).size;
        results.totalOriginalSize += originalSize;
        results.totalOptimizedSize += 
          result.value.results.lqip.size + 
          result.value.results.display.size + 
          result.value.results.lightbox.size;
      } else if (result.status === 'fulfilled' && !result.value.success) {
        results.failed.push(result.value);
      } else {
        results.failed.push({ filename: 'unknown', error: result.reason?.message || 'Unknown error' });
      }
      processedCount++;
      updateProgressBar(processedCount, images.length);
    }
  }

  console.log('\n');
  return results;
}

async function main() {
  try {
    const files = fs.readdirSync(IMAGES_DIR)
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
      .sort();
    
    if (files.length === 0) {
      console.log(`${colors.yellow}⚠ Aucune image trouvée dans ${IMAGES_DIR}${colors.reset}`);
      return;
    }
    
    console.log(`${colors.bright}Traitement de ${files.length} image(s) en parallèle...${colors.reset}\n`);
    
    const cpuCount = os.cpus().length;
    const concurrency = Math.min(40, Math.max(16, cpuCount * 2));
    
    console.log(`${colors.cyan}⚡ CPU détectés: ${cpuCount} cœurs${colors.reset}`);
    console.log(`${colors.cyan}⚡ Concurrence: ${concurrency} images en parallèle${colors.reset}\n`);
    
    const startTime = Date.now();
    const results = await processBatch(files, concurrency);
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    
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
    
    console.log(`\n${colors.cyan}⏱️  Temps de traitement: ${duration}s${colors.reset}`);
    console.log(`   ${colors.cyan}Vitesse: ${(results.success.length / duration).toFixed(1)} images/seconde${colors.reset}`);
    
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

try {
  require.resolve('sharp');
  main();
} catch (e) {
  console.log(`${colors.red}✗ Le package "sharp" n'est pas installé${colors.reset}`);
  console.log(`\n${colors.bright}Installation :${colors.reset}`);
  console.log(`   npm install sharp\n`);
  process.exit(1);
}
