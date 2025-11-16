# 🚀 Modules d'optimisation

Ce dossier contient les modules JavaScript pour l'optimisation des images et des performances.

## 📦 Modules

### image-optimizer.js
**Lazy loading avec Intersection Observer**

Fonctionnalités :
- Lazy loading automatique avec Intersection Observer API
- Transitions smooth sur le chargement
- Préchargement des images adjacentes
- Statistiques de chargement
- Configuration flexible

Usage :
```javascript
// Initialiser le lazy loading sur une page
ImageOptimizer.initLazyImages()

// Créer une image optimisée
const img = ImageOptimizer.createOptimizedImage({
  filename: 'photo.jpg',
  alt: 'Ma photo',
  preloadAdjacent: true
})

// Obtenir les statistiques
ImageOptimizer.getStats()
```

---

### lightbox-optimizer.js
**Optimisation de la lightbox avec préchargement**

Fonctionnalités :
- Préchargement intelligent (2 images de chaque côté)
- Cache des images préchargées
- Intégration Fancybox optimisée
- Support de galeries multiples

Usage :
```javascript
// Initialiser une galerie optimisée
LightboxOptimizer.initGallery('[data-fancybox="gallery"]', {
  galleryId: 'my-gallery'
})

// Créer un lien de galerie
const link = LightboxOptimizer.createGalleryLink({
  filename: 'photo.jpg',
  alt: 'Ma photo',
  galleryName: 'gallery'
})
```

---

### sw-register.js
**Enregistrement et gestion du Service Worker**

Fonctionnalités :
- Enregistrement automatique du SW
- Notifications de mise à jour
- Contrôle du cache
- Indicateurs online/offline

Usage :
```javascript
// Ces fonctions sont disponibles globalement :

// Vérifier la taille du cache
await window.swCache.getSize()

// Vider le cache
await window.swCache.clear()

// Forcer une mise à jour
await window.swCache.checkForUpdates()
```

---

## 🔗 Dépendances

Ces modules dépendent de :
- **Service Worker** : `service-worker.js` (racine)
- **Fancybox** : Pour la lightbox (CDN)

## 💡 Conseils d'utilisation

1. **Toujours charger dans cet ordre** :
   ```html
   <script src="js/optimization/image-optimizer.js"></script>
   <script src="js/optimization/lightbox-optimizer.js"></script>
   <script src="js/optimization/sw-register.js"></script>
   ```

2. **Initialiser après le DOM** :
   ```javascript
   document.addEventListener('DOMContentLoaded', () => {
     ImageOptimizer.initLazyImages()
     LightboxOptimizer.initGallery('[data-fancybox="gallery"]')
   })
   ```

---

**Version** : 2.0.0  
**Date** : 15 novembre 2025
