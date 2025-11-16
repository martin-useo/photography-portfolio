# Scripts

## generate-thumbnails.js

Génère thumbnails optimisés pour le web.

### Usage

```bash
npm run generate:thumbs
```

### Sortie

Génère dans `assets/images-optimized/` :
- `image-thumb.jpg` : 70% résolution originale, qualité 70%
- `image.jpg` : copie full-res pour lightbox

### Notes

- Le dossier de sortie est dans `.gitignore`
- Régénérer après chaque ajout d'images
- Requiert `sharp` (installé via `npm install`)

