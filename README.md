# Martin USEO - Photography Portfolio

Portfolio photographique de Martin USEO, photographe freelance basé à Paris, France.

🔗 **Site en ligne** : [https://martin-useo.github.io/photography-portfolio/](https://martin-useo.github.io/photography-portfolio/)

## Structure du projet

```
photography-portfolio/
│
├── 📄 index.html                    # Page d'accueil avec canvas d'images animé
│
├── 📁 assets/                       # Ressources statiques
│   ├── 📁 images/                   # Images du portfolio (7 photos)
│   │   ├── ThéoNoJitensha-1.jpg
│   │   ├── ThéoNoJitensha-2.jpg
│   │   └── ...
│   ├── Avatar.png                   # Photo de profil (partage social)
│   └── favicon.ico                  # Favicon
│
├── 📁 css/                          # Feuilles de style
│   ├── input.css                    # CSS source (Tailwind)
│   └── output.css                   # CSS compilé
│
├── 📁 js/                           # Scripts JavaScript
│   ├── 📁 components/               # Scripts de composants
│   │   ├── loader.js                # Chargement dynamique de composants
│   │   └── dropdown.js              # Gestion du menu dropdown
│   ├── images-config.js             # Configuration centralisée des images
│   ├── fade_in.js                   # Animations de fade-in
│   ├── menu.js                      # Gestion du menu mobile
│   ├── scroll-to-top.js             # Bouton retour en haut
│   ├── config.js                    # Configuration EmailJS (gitignored)
│   └── config.example.js            # Exemple de configuration
│
├── 📁 components/                   # Composants HTML réutilisables
│   ├── navbar.html                  # Barre de navigation
│   ├── footer.html                  # Pied de page
│   └── scroll-to-top.html           # Bouton scroll to top
│
├── 📁 pages/                        # Pages du site
│   ├── about_me.html                # À propos
│   ├── contact.html                 # Formulaire de contact
│   └── 📁 portfolio/                # Catégories de portfolio (6 catégories)
│       ├── nature.html
│       ├── portraits.html
│       ├── sport.html
│       ├── evenements.html
│       ├── animaux.html
│       └── personnel.html
│
├── .gitignore                       # Fichiers ignorés par Git
├── LICENSE                          # Licence du projet
└── README.md                        # Documentation du projet
```

## Fonctionnalités

### 🚀 Optimisations de performance
- **LQIP (Low Quality Image Placeholder)** : chargement instantané d'une version 50px (~5-10 Ko)
- **Thumbnails** : 70% de la résolution originale (~800 Ko - 2 Mo selon l'image) pour les galeries
- **Full-res** : réservée exclusivement pour la lightbox
- **Lazy loading** avec Intersection Observer API
- **Service Worker** pour cache agressif (30 jours)
- **Préchargement intelligent** des 2 images adjacentes dans la lightbox
- **Transitions smooth** (flou → net) pour un chargement progressif
- **Mode offline** avec fallback cache

### Page d'accueil
- Canvas d'images en arrière-plan avec layouts aléatoires
- Cycle automatique des images (2.5s par image)
- Bouton central avec changement de langue FR/EN
- Images optimisées localement avec lazy loading

### Pages Portfolio
- Galeries d'images par catégorie
- Lightbox optimisée avec préchargement des images adjacentes
- Lazy loading pour économiser la bande passante
- Chargement progressif avec placeholders floutés
- Bouton flottant retour en haut
- Design responsive

### Système de navigation
- Menu dropdown pour les catégories
- Chargement dynamique des composants
- Adaptation automatique des chemins selon la page

## Technologies utilisées

- **HTML5** / **CSS3** / **JavaScript**
- **Tailwind CSS** - Framework CSS utilitaire
- **Alpine.js** - Framework JS léger
- **Fancybox** - Lightbox pour galeries d'images
- **EmailJS** - Formulaire de contact
- **Service Workers** - Cache et mode offline
- **Intersection Observer API** - Lazy loading performant

## Configuration

1. Créer un fichier `config/emailjs.config.js` basé sur `config/emailjs.config.example.js`
2. Configurer EmailJS pour le formulaire de contact
3. Ajouter vos images dans `assets/images/`
4. Mettre à jour `js/images-config.js` avec vos images

## Déploiement

Le site est déployé automatiquement sur GitHub Pages via GitHub Actions.

## Gestion des images

Les images sont gérées de manière centralisée dans `js/images-config.js`.

1. Ajouter l'image dans `assets/images/`
2. Générer les thumbnails : `npm run generate:thumbs`
3. Ajouter sa configuration dans `js/images-config.js`
4. Spécifier sa catégorie et son format (portrait/landscape)

### Génération des thumbnails

```bash
npm install        # Si ce n'est pas déjà fait
npm run generate:thumbs
```

Cela génère automatiquement 3 versions de chaque image :
- **LQIP** (50px, ~5-10 Ko) : chargement instantané avec flou
- **Thumbnail** (70% de la résolution originale, ~800 Ko - 2 Mo) : affichage dans les galeries
- **Full-res** (originale) : exclusivement pour la lightbox

Les images optimisées sont générées dans `assets/images-optimized/` (dans `.gitignore`).

### Système d'optimisation

**Galeries :**
1. LQIP s'affiche instantanément (floue)
2. Thumbnail se charge avec lazy loading (Intersection Observer)
3. Transition smooth du flou vers net

**Lightbox :**
1. Full-res exclusivement
2. Préchargement des 2 images adjacentes
3. Navigation instantanée

**Cache :**
- Service Worker : 30 jours
- Mode offline complet

## Développement

Pour compiler le CSS Tailwind :
```bash
npx tailwindcss -i ./css/input.css -o ./css/output.css --watch
```

### Commandes utiles

```bash
# Installation
npm install

# Générer les thumbnails optimisés
npm run generate:thumbs

# Compiler Tailwind CSS
npm run build:css
npm run watch:css

# Serveur local
npm start                    # http-server (port 8000)
npm run serve               # Python alternatif

# Vider le cache du Service Worker (dans la console du navigateur)
await window.swCache.clear()

# Vérifier la taille du cache
await window.swCache.getSize()

# Statistiques d'optimisation (dans la console)
ImageOptimizer.getStats()   # Stats lazy loading
LightboxOptimizer.getCacheStats()  # Stats lightbox
```

## 📚 Documentation

- **[scripts/README.md](./scripts/README.md)** - Scripts d'optimisation (génération de thumbnails)
- **[LICENSE](./LICENSE)** - Licence du projet

## 🎯 Optimisations

- **Lazy loading** : Les images se chargent uniquement quand visibles
- **Cache 30 jours** : Via Service Worker pour chargement instantané
- **Préchargement** : Images adjacentes pour navigation fluide
- **Mode offline** : Le site fonctionne sans connexion après 1ère visite

## 🛠️ Architecture des modules

```
config/
├── emailjs.config.js            # Configuration EmailJS
└── emailjs.config.example.js    # Template de configuration

js/optimization/
├── image-optimizer.js           # Lazy loading + Intersection Observer
├── lightbox-optimizer.js        # Préchargement images adjacentes
└── sw-register.js               # Enregistrement du Service Worker

js/
├── images-config.js             # Configuration centralisée des images
├── portfolio-layout.js          # Layouts des galeries
└── ...                          # Autres modules existants

docs/
├── QUICKSTART.md                # Démarrage rapide
├── NEXT_STEPS.md                # Prochaines étapes
└── README.md                    # Index documentation

service-worker.js                # Cache agressif (30 jours)
```

## Licence

Voir le fichier [LICENSE](LICENSE)
