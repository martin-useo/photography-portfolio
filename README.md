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
│   └── 📁 portfolio/                # Catégories de portfolio (8 catégories)
│       ├── nature.html
│       ├── portraits.html
│       ├── animaux.html
│       ├── interieur.html
│       ├── nourriture.html
│       ├── travaux.html
│       ├── urbain.html
│       └── vehicules.html
│
├── .gitignore                       # Fichiers ignorés par Git
├── LICENSE                          # Licence du projet
└── README.md                        # Documentation du projet
```

## Fonctionnalités

### Page d'accueil
- Canvas d'images en arrière-plan avec layouts aléatoires
- Cycle automatique des images (2.5s par image)
- Bouton central avec changement de langue FR/EN

### Pages Portfolio
- Galeries d'images par catégorie
- Lightbox avec Fancybox
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

## Configuration

1. Créer un fichier `js/config.js` basé sur `js/config.example.js`
2. Configurer EmailJS pour le formulaire de contact
3. Ajouter vos images dans `assets/images/`
4. Mettre à jour `js/images-config.js` avec vos images

## Déploiement

Le site est déployé automatiquement sur GitHub Pages via GitHub Actions.

## Gestion des images

Les images sont gérées de manière centralisée dans `js/images-config.js`. Pour ajouter une nouvelle image :

1. Ajouter l'image dans `assets/images/`
2. Ajouter sa configuration dans `js/images-config.js`
3. Spécifier sa catégorie et son format (portrait/landscape)

## Développement

Pour compiler le CSS Tailwind :
```bash
npx tailwindcss -i ./css/input.css -o ./css/output.css --watch
```

## Licence

Voir le fichier [LICENSE](LICENSE)
