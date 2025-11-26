#!/bin/bash

# Script de déploiement local
# Génère les images optimisées et les commit

set -e
echo "🖼️ Mise à jour de la configuration des images dans images-config.js"
npm run update:images

echo "🖼️  Génération des images optimisées..."
npm run generate:thumbs

echo "📦 Vérification des changements..."
if [ -n "$(git status --porcelain assets/images-optimized/)" ]; then
  echo "✅ Nouvelles images optimisées détectées"
  git add assets/images-optimized/
  git add js/core/images-config.js
  git commit -m "chore: regenerate optimized images and update images-config.js"
  echo "✅ Images optimisées commitées"
else
  echo "ℹ️  Aucun changement dans les images optimisées"
fi

echo "🚀 Push vers GitHub..."
git push

echo "✅ Déploiement lancé ! GitHub Actions va déployer sur Pages."

