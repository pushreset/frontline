'use strict';
// War of the Ring, Third Age 3018–3019 — identity of the campaign: everything the interface shows that is not a
// card, a terrain or a battle. Load order: pack.js, cards.js, terrains.js, battles.js.
(globalThis.PACKS = globalThis.PACKS || {}).terre_milieu = Object.assign(globalThis.PACKS.terre_milieu || {}, {
  id: 'terre_milieu',
  title: { fr: "Guerre de l'Anneau", en: 'War of the Ring' },
  sub: { fr: 'Terre du Milieu · 3018–3019 T.A.', en: 'Middle-earth · TA 3018–3019' },
  dates: { fr: '3018 – 3019 T.A.', en: 'TA 3018 – 3019' },
  finale: { fr: "L'Anneau est détruit", en: 'The Ring is destroyed' },
  // ponytail: the menu sorts eras by parseInt(years); 3018 puts the legendary age after every historical one.
  era: { key: 'legende', fr: 'Légende', en: 'Legend', years: '3018 – 3019 T.A.' },
  attrs: { fr: ['Épée', 'Cavalerie', 'Arc', 'Magie'], en: ['Sword', 'Cavalry', 'Bow', 'Magic'] },
  short: { fr: ['Épé', 'Cav', 'Arc', 'Mag'], en: ['Swd', 'Cav', 'Bow', 'Mag'] },
  icons: ['epee', 'cheval', 'arc', 'baton'],
  types: {
    Fantassin: { fr: 'Fantassin', en: 'Foot', main: 0, sound: 'boots' },
    Cavalerie: { fr: 'Cavalerie', en: 'Cavalry', main: 1, sound: 'hooves' },
    Archer: { fr: 'Archer', en: 'Archer', main: 2, sound: 'boots' },
    Magie: { fr: 'Magie', en: 'Magic', main: 3, sound: 'spell' },
    Ordre: { fr: 'Ordre', en: 'Order' },
  },
  malusAttr: 0,                 // attribute lowered by g.malus() (arrows, the Dead Marshes, the Huorns)
  art: 'packs/terre_milieu/out/',
  artScale: 2,                  // pictures drawn at twice the base sizes (cards 128x80)
  cover: 'minas_tirith',
  // Middle-earth from the Shire to Mordor. Not a real globe: pos is [x, y] in map units, x 0-100 west to east,
  // y 0-44 north to south (campaign.js projects it linearly like a lon/lat frame).
  map: { image: 'map_terre_milieu', lon: [0, 100], lat: [0, 44] },
  theme: { olive: '#2f5a3a', btn: '#22402c', btnHi: '#30573c', edge: '#c2a25a', bg1: '#2c3b2c', bg2: '#1c271d', bg3: '#0f1610',
           panel: '#18221a', panelEdge: '#4f6a45', tile1: '#3e5238', tile2: '#283727' },
  font: 'roman',                // carved capitals (Cinzel) for the titles
  startSound: 'warhorn',        // played when a battle starts: a great horn of Gondor
});
if (typeof module !== 'undefined') module.exports = globalThis.PACKS.terre_milieu;
