# 📂 Structure du projet

## 🎯 Organisation (v2.0.0)

```
photography-portfolio/
│
├── 📄 index.html                       # Page d'accueil
├── 📄 service-worker.js                # Cache et mode offline
├── 📄 package.json                     # Dépendances npm
├── 📄 README.md                        # Documentation principale
├── 📄 STRUCTURE.md                     # Ce fichier
│
├── 📁 config/                          # Configuration
│   ├── emailjs.config.js              # Config EmailJS (gitignored)
│   ├── emailjs.config.example.js      # Template EmailJS
│   └── README.md                       # Doc config
│
├── 📁 docs/                            # Documentation
│   ├── README.md                       # Index de la doc
│   ├── NEXT_STEPS.md                  # Prochaines étapes
│   └── QUICKSTART.md                  # Démarrage rapide
│
├── 📁 js/                              # Scripts JavaScript
│   │
│   ├── 📁 optimization/                # Modules d'optimisation
│   │   ├── image-optimizer.js         # Lazy loading
│   │   ├── lightbox-optimizer.js      # Préchargement lightbox
│   │   ├── sw-register.js             # Enregistrement SW
│   │   └── README.md                   # Doc modules
│   │
│   ├── 📁 components/                  # Composants UI
│   │   ├── loader.js                   # Chargement composants
│   │   └── dropdown.js                 # Menu dropdown
│   │
│   ├── images-config.js                # Config centralisée images
│   ├── portfolio-layout.js             # Layouts galeries
│   ├── i18n.js                         # Internationalisation
│   ├── fade_in.js                      # Animations
│   ├── menu.js                         # Menu mobile
│   └── scroll-to-top.js                # Bouton scroll top
│
├── 📁 scripts/                         # Scripts utilitaires
│   ├── test-setup.js                  # Test configuration
│   └── README.md                       # Doc scripts
│
├── 📁 .github/workflows/               # CI/CD
│   └── deploy.yml                      # Déploiement GitHub Pages
│
├── 📁 assets/                          # Ressources statiques
│   ├── 📁 images/                      # Images du portfolio
│   ├── Avatar.png                      # Photo de profil
│   └── favicon.ico                     # Favicon
│
├── 📁 pages/                           # Pages du site
│   ├── about_me.html                   # À propos
│   ├── contact.html                    # Contact
│   └── 📁 portfolio/                   # Pages galeries
│       ├── showcase.html               # Vitrine
│       ├── nature.html                 # Galerie nature
│       ├── portraits.html              # Galerie portraits
│       └── ...                         # Autres galeries
│
├── 📁 components/                      # Composants HTML
│   ├── navbar.html                     # Navigation
│   ├── footer.html                     # Pied de page
│   └── scroll-to-top.html              # Bouton scroll
│
└── 📁 css/                             # Styles
    ├── input.css                       # CSS source (Tailwind)
    └── output.css                      # CSS compilé
```

---

## 📋 Points d'entrée

### Pour démarrer
📖 **[docs/NEXT_STEPS.md](./docs/NEXT_STEPS.md)**

### Pour comprendre
📖 **[README.md](./README.md)**

### Pour configurer
📖 **[config/README.md](./config/README.md)**

### Pour développer
📖 **[js/optimization/README.md](./js/optimization/README.md)**  
📖 **[scripts/README.md](./scripts/README.md)**

---

## 🎨 Chemins à utiliser dans les pages

### Dans les pages HTML

**Racine (index.html)** :
```html
<script src="config/emailjs.config.js"></script>
<script src="js/optimization/image-optimizer.js"></script>
<script src="js/optimization/lightbox-optimizer.js"></script>
<script src="js/optimization/sw-register.js"></script>
```

**Pages niveau 1 (about_me.html)** :
```html
<script src="../config/emailjs.config.js"></script>
<script src="../js/optimization/image-optimizer.js"></script>
<script src="../js/optimization/lightbox-optimizer.js"></script>
<script src="../js/optimization/sw-register.js"></script>
```

**Pages niveau 2 (portfolio/nature.html)** :
```html
<script src="../../config/emailjs.config.js"></script>
<script src="../../js/optimization/image-optimizer.js"></script>
<script src="../../js/optimization/lightbox-optimizer.js"></script>
<script src="../../js/optimization/sw-register.js"></script>
```

---

## ⚙️ Configuration

### EmailJS

1. Copier le template :
   ```bash
   cp config/emailjs.config.example.js config/emailjs.config.js
   ```

2. Éditer avec vos identifiants EmailJS

3. Le fichier est gitignored ✅

---

## 🔐 Fichiers gitignored

Ces fichiers NE SONT PAS versionnés (pour protéger vos clés API) :

- `config/emailjs.config.js`
- `node_modules/`
- `.DS_Store`

En production (GitHub Pages), `emailjs.config.js` est généré automatiquement depuis les **GitHub Secrets**.

---

## 🧪 Vérifier la structure

```bash
node scripts/test-setup.js
```

Ce script vérifie que tous les fichiers sont présents et bien configurés.

---

## 📚 Documentation

Chaque dossier important contient un `README.md` :

- `config/README.md` - Configuration
- `docs/README.md` - Index documentation
- `js/optimization/README.md` - Modules d'optimisation
- `scripts/README.md` - Scripts utilitaires

---

## 💡 Avantages de cette structure

1. **Clarté** : Chaque type de fichier a son dossier
2. **Sécurité** : Configurations séparées et gitignored
3. **Documentation** : Tout regroupé dans `docs/`
4. **Maintenance** : Facile de trouver ce qu'on cherche
5. **Scalabilité** : Peut accueillir de nouveaux modules facilement

---

## 🚀 Optimisations actives

- ✅ **Lazy loading** avec Intersection Observer
- ✅ **Service Worker** pour cache (30 jours)
- ✅ **Préchargement** des images adjacentes
- ✅ **Mode offline** complet
- ✅ **Transitions smooth**

---

**Version** : 2.0.0  
**Date** : 15 novembre 2025  
**Statut** : ✅ Simplifié et optimisé
