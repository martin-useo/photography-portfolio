#!/bin/bash

# Script de déploiement local
# Génère les images optimisées et les commit

set -e

IMAGES_DIR="assets/images"
OPTIMIZED_DIR="assets/images-optimized"

check_images_optimized() {
  if [ ! -d "$OPTIMIZED_DIR" ]; then
    return 1
  fi

  local missing=0
  local outdated=0

  shopt -s nullglob
  for img in "$IMAGES_DIR"/*.jpg "$IMAGES_DIR"/*.jpeg "$IMAGES_DIR"/*.png "$IMAGES_DIR"/*.JPG "$IMAGES_DIR"/*.JPEG "$IMAGES_DIR"/*.PNG; do
    [ -f "$img" ] || continue
    
    basename=$(basename "$img" | sed 's/\.[^.]*$//')
    
    lqip="${OPTIMIZED_DIR}/${basename}-lqip.webp"
    display="${OPTIMIZED_DIR}/${basename}-display.webp"
    lightbox="${OPTIMIZED_DIR}/${basename}-lightbox.webp"
    
    if [ ! -f "$lqip" ] || [ ! -f "$display" ] || [ ! -f "$lightbox" ]; then
      missing=$((missing + 1))
      continue
    fi
    
    if [ "$img" -nt "$lqip" ] || [ "$img" -nt "$display" ] || [ "$img" -nt "$lightbox" ]; then
      outdated=$((outdated + 1))
    fi
  done
  shopt -u nullglob

  if [ $missing -gt 0 ] || [ $outdated -gt 0 ]; then
    if [ $missing -gt 0 ]; then
      echo "⚠️  $missing image(s) manquante(s) dans les optimisées"
    fi
    if [ $outdated -gt 0 ]; then
      echo "⚠️  $outdated image(s) obsolète(s) (source plus récente)"
    fi
    return 1
  fi

  return 0
}

echo "🖼️ Mise à jour de la configuration des images dans images-config.js"
npm run update:images

echo "🔍 Vérification des images optimisées..."
if check_images_optimized; then
  echo "✅ Toutes les images sont déjà optimisées et à jour"
else
  echo "🖼️  Génération des images optimisées..."
  npm run generate:thumbs
fi

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

