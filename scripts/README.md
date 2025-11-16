# Scripts Utilitaires

Ce dossier contient les scripts utilitaires pour le projet.

## Scripts Disponibles

### test-setup.js

Vérifie que la configuration du projet est correcte.

**Usage** :
```bash
node scripts/test-setup.js
```

**Ce qu'il vérifie** :
- ✅ Présence des fichiers principaux (index.html, service-worker.js, etc.)
- ✅ Modules JavaScript (image-optimizer.js, lightbox-optimizer.js, etc.)
- ✅ Configuration EmailJS
- ✅ Présence des dossiers requis
- ✅ Dépendances Node.js (si applicable)

**Exemple de sortie** :

```
╔═══════════════════════════════════════════════╗
║  📋 Vérification de la configuration          ║
╚═══════════════════════════════════════════════╝

📄 Fichiers principaux :
✓ index.html
✓ service-worker.js
✓ README.md

📁 Modules JavaScript :
✓ js/optimization/image-optimizer.js
✓ js/optimization/lightbox-optimizer.js
✓ js/optimization/sw-register.js

⚙️  Configuration :
⚠ config/emailjs.config.js (optionnel - créer depuis .example)
✓ config/emailjs.config.example.js

📁 Structure :
✓ assets/
✓ assets/images/
✓ js/
✓ css/
✓ pages/
✓ components/
✓ docs/

✨ Tout est OK ! Le site est prêt.

Prochaines étapes :
  1. npm start - Lancer le serveur local (ou LiveServer, Python, etc.)
  2. Ouvrir http://localhost:8000 dans votre navigateur
  3. Tester les fonctionnalités
```

## Actions recommandées après le test

Si le fichier de configuration EmailJS est manquant :

```bash
# Créer le fichier de configuration
cp config/emailjs.config.example.js config/emailjs.config.js

# Éditer avec vos identifiants EmailJS
```

Si les dépendances Node.js ne sont pas installées (optionnel) :

```bash
npm install
```

**Note** : Le site peut fonctionner sans npm (avec LiveServer, Python, etc.)

## Dépannage

### Erreur : "Module not found"

Si vous utilisez Node.js et que des dépendances manquent :

```bash
npm install
```

### Erreur : "File not found"

Vérifiez que vous êtes bien à la racine du projet :

```bash
# Vous devriez voir :
ls -la
# → index.html, service-worker.js, package.json, etc.
```

### Plusieurs avertissements

C'est normal si certains fichiers optionnels manquent :
- `config/emailjs.config.js` → À créer depuis `.example`
- `node_modules/` → Pas nécessaire si vous n'utilisez pas npm

Le site reste fonctionnel !

---

## Ressources

- **[../README.md](../README.md)** - Documentation principale
- **[../docs/QUICKSTART.md](../docs/QUICKSTART.md)** - Guide de démarrage rapide
- **[../STRUCTURE.md](../STRUCTURE.md)** - Structure du projet
