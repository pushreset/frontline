# Ligne de Front · Front Line

Jeu de cartes tactique solo, Normandie 1944, en pixel art. Le navigateur suffit : pas de build, pas
de dépendance. Disponible en français et en anglais.

**Jouer** : https://pushreset.github.io/frontline/ (une fois GitHub Pages activé), ou ouvrir
`index.html` directement.

## Principe

Trois terrains, chacun avec un seuil à atteindre dans 4 attributs (Char, Infanterie, Air,
Stratégie). Pose tes unités, remplis un seuil pour **tenir** le terrain : s'il tient encore à ton
tour suivant, il est **capturé**. Deux terrains capturés gagnent la bataille ; à la nuit (12 tours),
le pourcentage de seuil rempli départage. Les cartes posées face cachée valent 0 : c'est du bluff,
les retourner coûte une action.

- **Campagne** : 12 batailles d'Omaha Beach à la libération de Paris, avec embranchements. Pas de
  game over, une bataille perdue se rejoue.
- **Bataille rapide** : 3 terrains au hasard.
- **Trois niveaux d'ennemi**, mêmes règles et mêmes terrains, seule la façon de décider change :
  *Recrue* (hésite, s'éparpille, ne bluffe pas, voit tard tes menaces), *Régulier*, *Vétéran*
  (agressif, joue chaque coup jusqu'au bout sur des mains devinées). Aucun ne triche.
- Sauvegarde automatique dans le navigateur, musique et sons générés en Web Audio.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | le jeu (interface, carte de campagne, sauvegarde) |
| `engine.js` | règles et IA, sans DOM |
| `campaign.js` | batailles de la campagne |
| `i18n.js` | textes anglais, phrases FR/EN |
| `audio.js` | musique et effets sonores |
| `assets.html` | galerie de toutes les illustrations |
| `art.px.js` → `out/` | source du pixel art (DSL pxl) ; les PNG construits sont versionnés dans `out/` |
| `sim.cjs`, `balance.cjs` | simulateur IA contre IA (`node sim.cjs 1000`, `node sim.cjs 500 campagne`, `node sim.cjs 200 niveaux`, `node sim.cjs 1 partie easy hard`) |

## Héberger sur GitHub Pages

Settings → Pages → *Deploy from a branch* → `main`, dossier `/ (root)`. Le fichier `.nojekyll` évite
le traitement Jekyll ; rien à construire.
