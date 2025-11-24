# Scripts

## update-images-config.js

Met à jour automatiquement la liste des images dans `js/core/images-config.js`.

### Usage

```bash
npm run update:images
```

### Fonctionnement

- Scanne le dossier `assets/images/` pour tous les fichiers `.jpg`
- Extrait automatiquement la catégorie depuis le nom du fichier (ex: `Animals-1.jpg` → catégorie `animaux`)
- Met à jour la section `imageFiles` et `imageMetadata` dans `js/core/images-config.js`
- Affiche les statistiques par catégorie

### Notes

- À exécuter après chaque ajout/suppression d'images
- Les images doivent suivre le format: `Categorie-Numero.jpg`
- Catégories supportées: Animals, Events, Nature, Personal, Portraits, Sports

---

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

