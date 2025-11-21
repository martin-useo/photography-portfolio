#!/bin/bash

# Script de déploiement local
# Génère les images optimisées et les commit

set -e

echo "🖼️  Génération des images optimisées..."
npm run generate:thumbs

echo "📦 Vérification des changements..."
if [ -n "$(git status --porcelain assets/images-optimized/)" ]; then
  echo "✅ Nouvelles images optimisées détectées"
  git add assets/images-optimized/
  git commit -m "chore: regenerate optimized images"
  echo "✅ Images optimisées commitées"
else
  echo "ℹ️  Aucun changement dans les images optimisées"
fi

echo "🚀 Push vers GitHub..."
git push

echo "✅ Déploiement lancé ! GitHub Actions va déployer sur Pages."

