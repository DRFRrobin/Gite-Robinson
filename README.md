# Gîte Robinson

Site vitrine des gîtes **La Bouchardière** et **La Bouteillerie** (Gizeux).
Site statique (HTML / CSS / un peu de JavaScript), sans framework ni étape de build.

**Version actuelle : V1.7**

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
│   ├── noel.css / noel.js / noel/   thème de Noël (activable par un bouton)
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

## Thème de Noël

Thème saisonnier d'après la charte graphique « Thème Noël » : ciel de nuit étoilé et lune, guirlande qui scintille, neige qui tombe, neige épaisse avec décor de confiserie au-dessus du pied de page, bonnet de Père Noël sur le logo, traîneau qui traverse le ciel de temps en temps.

- **Automatique en décembre** : le thème est actif par défaut **du 1er au 26 décembre inclus**, chaque année (selon la date du visiteur). Le 27 décembre, il se désactive tout seul.
- **Bouton** : petit bouton arbre à côté du numéro de version, en bas de chaque page, pour l'activer ou le désactiver à la main à tout moment.
- **Mémoire du choix** (`localStorage`, clé `gite-theme`, avec un cookie de secours si le navigateur bloque le stockage) : activé à la main = `noel` (reste actif tant qu'on ne le désactive pas) ; désactivé à la main = `off-ANNÉE` (le thème reste coupé pour le reste de cette année, puis revient automatiquement l'année suivante en décembre). Le choix suit d'une page à l'autre.
- **Fichiers** : `assets/noel.css` (apparence, tout est limité à `html.noel`), `assets/noel.js` (bouton, guirlande, neige, traîneau, décor) et `assets/noel/*.svg` (illustrations).
- **Palette** : nuit `#0a1b3d`, sapin `#0b3b2a`, rouge Noël `#e53935` (actions et grands titres), or `#ffd54f` (détails), crème `#fff8e1` (texte). Titres en Playfair Display, texte en Inter (chargées seulement quand le thème est actif).
- **Accessibilité** : si l'appareil réduit les animations, la neige est figée, la guirlande fixe et le traîneau n'apparaît pas. La neige s'arrête quand l'onglet est caché.
- **Retirer le thème** : supprimer le bouton (`.noel-btn`) et les deux lignes `noel.css` / `noel.js` dans chaque page.

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

Règle : **à chaque nouvelle version, on ajoute 0,1** (V1.1 → V1.2 → V1.3 → V1.4 → V1.5 → V1.6 → V1.7 …).

Le numéro est écrit dans le pied de page de chaque page (`<span>V1.7</span>`). Pour le modifier :

```bash
sed -i 's#<span>V1.7</span>#<span>V1.8</span>#' *.html
```

Puis mettre à jour la ligne « Version actuelle » en haut de ce README.

## Contact

gizeux.robin@wanadoo.fr
