# Gîte Robinson

Site vitrine des gîtes **La Bouchardière** et **La Bouteillerie** (Gizeux).
Site statique (HTML / CSS / un peu de JavaScript), sans framework ni étape de build.

**Version actuelle : V1.4**

## Pages

| Fichier | Contenu |
| --- | --- |
| `index.html` | Accueil : photo, accès aux deux gîtes |
| `bouchardiere.html` | Gîte de la Bouchardière (description, visite 360, planning, vidéo YouTube) |
| `bouteillerie.html` | Gîte de la Bouteillerie : la maison et le studio (description, visite 360, planning) |
| `planning.html` | Choix du planning |
| `planning-bouchardiere.html` | Calendrier et tarifs de la Bouchardière |
| `planning-bouteillerie.html` | Calendriers et tarifs de la Bouteillerie |
| `docs/guide-du-site.pdf` | Guide complet du site (fonctionnement, modification, mise en ligne) |

## Structure

```
.
├── *.html              pages du site
├── assets/
│   ├── style.css       styles (couleurs, typographie, animations, transitions)
│   ├── main.js         animations d'apparition et logo réduit au défilement
│   ├── logo-contour.png  logo détouré avec contour crème
│   ├── bouchardiere.jpg / bouteillerie.jpg / studio.jpg   photos principales
└── designs/            anciennes propositions de design (archives)
```

## Design

- Charte reprise du panneau de signalisation : vert profond `#18452c`, crème `#f9f3e3`, olive `#9aab5a`.
- Polices : Barlow Condensed (titres) et Barlow (texte), chargées depuis Google Fonts.
- Les couleurs et dimensions sont des variables CSS en haut de `assets/style.css`.
- Animations désactivées automatiquement si l'appareil est réglé sur « réduire les animations ».
- Transitions entre pages : View Transitions (Chrome, Edge, Safari récents ; sans effet ailleurs).

## Contenus externes

- **Visites 360** : `https://visite360gite.fr/v1/Bou/` et `https://visite360gite.fr/v1/Bouteillerie/` (hébergées sur le serveur existant).
- **Plannings et tarifs** : intégrés depuis `planning-planning.com`.
- **Vidéo** : YouTube (Bouchardière), intégrée en `youtube-nocookie.com`.

## Prévisualiser en local

Les vidéos YouTube refusent de se lancer depuis un fichier ouvert directement : passer par un petit serveur local.

```bash
python3 -m http.server 8000
```

Puis ouvrir <http://localhost:8000>.

## Publier

Le site est statique : il suffit de déposer les fichiers (pages `.html` et dossier `assets/`) sur un hébergement, ou d'activer **GitHub Pages** sur la branche `main` (Settings → Pages → Deploy from a branch → `main` / root).

## Numéro de version

Règle : **à chaque nouvelle version, on ajoute 0,1** (V1.1 → V1.2 → V1.3 → V1.4 …).

Le numéro est écrit dans le pied de page de chaque page (`<span>V1.4</span>`). Pour le modifier :

```bash
sed -i 's#<span>V1.4</span>#<span>V1.5</span>#' *.html
```

Puis mettre à jour la ligne « Version actuelle » en haut de ce README.

## Contact

gizeux.robin@wanadoo.fr
