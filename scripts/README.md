# Scripts d'optimisation

## generate-thumbnails.js

Script de génération automatique de thumbnails pour optimiser le chargement des images.

### Installation

```bash
npm install
```

### Utilisation

```bash
npm run generate:thumbs
```

### Ce qu'il fait

Le script génère 3 versions de chaque image dans `assets/images/` :

1. **LQIP (Low Quality Image Placeholder)** - 50px, ~5-10 Ko
   - Se charge immédiatement
   - Affichée avec un flou pendant le chargement
   
2. **Thumbnail** - 70% de la résolution originale, qualité 70%
   - Utilisée dans les galeries
   - Chargement avec lazy loading
   - Exemple : 4000x6000px → 2800x4200px (~800 Ko - 2 Mo selon l'image)
   
3. **Full-res** - Taille originale
   - Réservée exclusivement pour la lightbox
   - Préchargement des images adjacentes

### Sortie

Toutes les images optimisées sont générées dans `assets/images-optimized/` :

```
assets/images-optimized/
  ├── image-lqip.jpg      (50px, ~5-10 Ko)
  ├── image-thumb.jpg     (70% de l'originale, ~800 Ko - 2 Mo)
  └── image.jpg           (full-res)
```

### Stratégie de chargement

**Page d'accueil & Galeries :**
- LQIP s'affiche instantanément (floue)
- Thumb se charge avec lazy loading
- Transition smooth du flou → net

**Lightbox :**
- Full-res exclusivement
- Préchargement des 2 images adjacentes
- Navigation instantanée

### Exemple

```bash
# Ajouter de nouvelles images
cp mes-photos/*.jpg assets/images/

# Générer les thumbnails
npm run generate:thumbs

# Les images sont prêtes !
```

### Note

Le dossier `assets/images-optimized/` est dans `.gitignore`. Il faut régénérer les thumbnails après chaque ajout/modification d'images.

