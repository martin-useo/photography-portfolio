# Martin USEO - Photography Portfolio

Portfolio photographique de Martin USEO, photographe freelance basé à Paris, France.

🔗 **Site en ligne** : [https://martin-useo.github.io/photography-portfolio/](https://martin-useo.github.io/photography-portfolio/)

## Structure du projet

```
photography-portfolio/
│
├── 📄 index.html
│
├── 📁 assets/                       # Ressources statiques
│   ├── 📁 images/
│   │   └── ...
│   ├── Avatar.png
│   └── favicon.ico
│
├── 📁 css/
│   ├── input.css
│   └── output.css
│
├── 📁 js/
│   ├── 📁 components/
│   │   ├── loader.js
│   │   ├── dropdown.js
│   │   └── menu.js                  # Gestion du menu mobile
│   ├── 📁 core/
│   │   ├── i18n.js                 # Gestion de l'internationalisation
│   │   ├── images-config.js         # Configuration des images
│   │   └── 📁 utils/
│   │       └── webp-support.js     # Détection du support WebP
│   ├── 📁 responsive/
│   │   ├── breakpoints.js          # Constantes et fonctions de breakpoints
│   │   ├── breakpoints-global.js   # Export global des breakpoints
│   │   └── device-detector.js      # Détection des appareils
│   ├── 📁 config/
│   │   └── responsive-config.js    # Configuration responsive
│   ├── 📁 pages/
│   │   ├── 📁 home/
│   │   │   ├── hero-handler.js
│   │   │   ├── categories-handler.js
│   │   │   ├── categories-shared.js
│   │   │   ├── 📁 mobile/
│   │   │   │   ├── hero-handler.js
│   │   │   │   └── categories-grid.js
│   │   │   └── 📁 desktop/
│   │   │       ├── hero-handler.js
│   │   │       └── categories-grid.js
│   │   └── 📁 index/
│   │       ├── layout-handler.js
│   │       ├── 📁 mobile/
│   │       │   └── layouts.js
│   │       └── 📁 desktop/
│   │           └── layouts.js
│   ├── 📁 optimization/
│   │   ├── image-optimizer.js
│   │   ├── lightbox-optimizer.js
│   │   └── sw-register.js
│   ├── fade_in.js
│   ├── image-protection.js
│   ├── portfolio-layout.js
│   └── scroll-to-top.js
│
├── 📁 components/
│   ├── navbar.html
│   ├── footer.html
│   └── scroll-to-top.html
│
├── 📁 pages/
│   ├── about_me.html
│   ├── contact.html
│   └── 📁 portfolio/
│       ├── nature.html
│       ├── portraits.html
│       ├── sport.html
│       ├── evenements.html
│       ├── animaux.html
│       ├── divers.html
│       ├── urban.html
│       └── vehicules.html
│   ├── home.html
│   ├── about_me.html
│   └── contact.html
│
├── .gitignore
├── LICENSE
└── README.md
```

## Technologies utilisées

- **HTML5** / **CSS3** / **JavaScript**
- **Tailwind CSS** - Framework CSS utilitaire
- **Alpine.js** - Framework JS léger
- **Fancybox** - Lightbox pour galeries d'images
- **EmailJS** - Formulaire de contact
- **Service Workers** - Cache et mode offline
- **Intersection Observer API** - Lazy loading


## Licence

Voir le fichier [LICENSE](LICENSE)
