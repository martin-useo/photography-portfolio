#!/usr/bin/env node

/**
 * Script de test de la configuration
 * Vérifie que tous les modules sont correctement installés et configurés
 * 
 * Usage: node scripts/test-setup.js
 */

const fs = require('fs');
const path = require('path');

// Couleurs
const c = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${c.cyan}${c.bright}
╔═══════════════════════════════════════════════╗
║   Configuration Test                          ║
║   Photography Portfolio                       ║
╚═══════════════════════════════════════════════╝
${c.reset}\n`);

let errors = 0;
let warnings = 0;

/**
 * Vérifie l'existence d'un fichier
 */
function checkFile(filePath, required = true) {
  const exists = fs.existsSync(filePath);
  const fileName = path.basename(filePath);
  
  if (exists) {
    console.log(`${c.green}✓${c.reset} ${fileName}`);
    return true;
  } else {
    if (required) {
      console.log(`${c.red}✗${c.reset} ${fileName} ${c.red}(manquant - requis)${c.reset}`);
      errors++;
    } else {
      console.log(`${c.yellow}⚠${c.reset} ${fileName} ${c.yellow}(manquant - optionnel)${c.reset}`);
      warnings++;
    }
    return false;
  }
}

/**
 * Vérifie le contenu d'un fichier
 */
function checkFileContent(filePath, pattern, errorMsg) {
  if (!fs.existsSync(filePath)) return false;
  
  const content = fs.readFileSync(filePath, 'utf8');
  if (!pattern.test(content)) {
    console.log(`  ${c.yellow}⚠${c.reset} ${errorMsg}`);
    warnings++;
    return false;
  }
  return true;
}

// Vérification des fichiers principaux
console.log(`${c.bright}📄 Fichiers principaux :${c.reset}`);
checkFile('index.html');
checkFile('service-worker.js');
checkFile('README.md');
checkFile('STRUCTURE.md');

console.log(`\n${c.bright}📁 Modules JavaScript :${c.reset}`);
checkFile('js/optimization/image-optimizer.js');
checkFile('js/optimization/lightbox-optimizer.js');
checkFile('js/optimization/sw-register.js');
checkFile('js/images-config.js');

console.log(`\n${c.bright}⚙️  Configuration :${c.reset}`);
const hasEmailConfig = checkFile('config/emailjs.config.js', false);
checkFile('config/emailjs.config.example.js');

// Vérifie les dossiers
console.log(`\n${c.bright}📂 Dossiers :${c.reset}`);
['assets/images', 'css', 'js', 'js/optimization', 'config', 'pages', 'components', 'scripts'].forEach(dir => {
  const exists = fs.existsSync(dir);
  if (exists) {
    console.log(`${c.green}✓${c.reset} ${dir}/`);
  } else {
    console.log(`${c.red}✗${c.reset} ${dir}/ ${c.red}(manquant)${c.reset}`);
    errors++;
  }
});

// Compte les images
console.log(`\n${c.bright}🖼️  Images :${c.reset}`);
const imagesDir = 'assets/images';
if (fs.existsSync(imagesDir)) {
  const images = fs.readdirSync(imagesDir).filter(f => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
  );
  console.log(`${c.green}✓${c.reset} ${images.length} image(s) trouvée(s)`);
  
  if (images.length === 0) {
    console.log(`  ${c.yellow}⚠${c.reset} Aucune image dans le dossier`);
    warnings++;
  }
} else {
  console.log(`${c.red}✗${c.reset} Dossier images/ manquant`);
  errors++;
}

// Vérifie les dépendances Node.js
console.log(`\n${c.bright}📦 Dépendances Node.js :${c.reset}`);
const hasPackageJson = checkFile('package.json', false);
const hasNodeModules = fs.existsSync('node_modules');

if (hasPackageJson) {
  if (hasNodeModules) {
    console.log(`${c.green}✓${c.reset} node_modules/ (installé)`);
  } else {
    console.log(`${c.yellow}⚠${c.reset} node_modules/ (non installé)`);
    console.log(`  ${c.cyan}→ Exécutez: npm install${c.reset}`);
    warnings++;
  }
}

// Tests de compatibilité navigateur
console.log(`\n${c.bright}🌐 Compatibilité navigateur requise :${c.reset}`);
console.log(`${c.green}✓${c.reset} Intersection Observer API`);
console.log(`${c.green}✓${c.reset} Service Workers`);
console.log(`${c.green}✓${c.reset} Fetch API`);
console.log(`${c.green}✓${c.reset} Promises`);
console.log(`${c.green}✓${c.reset} ES6+ features`);

// Résumé
console.log(`\n${c.bright}═══════════════════════════════════════════════${c.reset}`);
console.log(`${c.bright}📊 Résumé :${c.reset}\n`);

if (errors === 0 && warnings === 0) {
  console.log(`${c.green}${c.bright}✨ Tout est OK ! Le site est prêt.${c.reset}\n`);
  console.log(`${c.bright}Prochaines étapes :${c.reset}`);
  console.log(`  1. ${c.cyan}npm start${c.reset} - Lancer le serveur local (ou LiveServer, Python, etc.)`);
  console.log(`  2. Ouvrir http://localhost:8000 dans votre navigateur`);
  console.log(`  3. Tester les fonctionnalités`);
} else {
  if (errors > 0) {
    console.log(`${c.red}✗ ${errors} erreur(s) critique(s)${c.reset}`);
  }
  if (warnings > 0) {
    console.log(`${c.yellow}⚠ ${warnings} avertissement(s)${c.reset}`);
  }
  
  console.log(`\n${c.bright}Actions recommandées :${c.reset}`);
  
  if (!hasEmailConfig) {
    console.log(`  1. Créer le fichier de configuration manquant`);
    console.log(`     ${c.cyan}cp config/emailjs.config.example.js config/emailjs.config.js${c.reset}`);
  }
  
  if (hasPackageJson && !hasNodeModules) {
    console.log(`  2. Installer les dépendances`);
    console.log(`     ${c.cyan}npm install${c.reset}`);
  }
  
  console.log(`\n${c.yellow}Note :${c.reset} Le site fonctionne en mode local par défaut`);
}

console.log();

// Code de sortie
process.exit(errors > 0 ? 1 : 0);

