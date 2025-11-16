# Scripts

## generate-thumbnails.js

Génère thumbnails optimisés pour le web.

### Usage

```bash
npm run generate:thumbs
```

### Sortie

Génère dans `assets/images-optimized/` :
- `image-lqip.jpg` : 40% résolution originale, qualité 30%
- `image-thumb.jpg` : 70% résolution originale, qualité 70%

### Notes

- Les thumbnails sont trackés dans Git
- Régénérer après chaque ajout d'images
- Requiert `sharp` (installé via `npm install`)

