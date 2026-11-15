'use strict';
// Gallic Wars 58–51 BC — identity of the campaign: everything the interface shows that is not a card,
// a terrain or a battle. Load order: pack.js, cards.js, terrains.js, battles.js.
(globalThis.PACKS = globalThis.PACKS || {}).gaule = Object.assign(globalThis.PACKS.gaule || {}, {
  id: 'gaule',
  title: { fr: 'Guerre des Gaules', en: 'Gallic Wars' },
  sub: { fr: 'Gaule · 58–51 av. J.-C.', en: 'Gaul · 58–51 BC' },
  dates: { fr: '58 – 51 av. J.-C.', en: '58 – 51 BC' },
  finale: { fr: 'La Gaule est soumise', en: 'Gaul is conquered' },
  // ponytail: the menu sorts eras by parseInt(years); 58 (BC) < 1914 puts Antiquity first, as it should be.
  era: { key: 'antiquite', fr: 'Antiquité', en: 'Antiquity', years: '58 – 51 av. J.-C.' },
  attrs: { fr: ['Infanterie', 'Cavalerie', 'Tir', 'Génie'], en: ['Infantry', 'Cavalry', 'Missile', 'Engineering'] },
  short: { fr: ['Inf', 'Cav', 'Tir', 'Gén'], en: ['Inf', 'Cav', 'Mis', 'Eng'] },
  icons: ['glaive', 'cheval', 'arc', 'dolabra'],
  types: {
    Legion: { fr: 'Infanterie', en: 'Infantry', main: 0, sound: 'boots' },
    Cavalerie: { fr: 'Cavalerie', en: 'Cavalry', main: 1, sound: 'hooves' },
    Tir: { fr: 'Tir', en: 'Missile', main: 2, sound: 'boots' },
    Soutien: { fr: 'Soutien', en: 'Support', main: 3, sound: 'dig' },
    Ordre: { fr: 'Ordre', en: 'Order' },
  },
  malusAttr: 0,                 // attribute lowered by g.malus() (arrows, sling stones, marsh fever)
  art: 'packs/gaule/out/',
  artScale: 2,                  // pictures drawn at twice the resolution of the other packs (cards 128x80)
  cover: 'alesia',
  // Gaul, the south of Britain, the Rhine and Cisalpine Gaul. Linear lon/lat frame (campaign.js).
  map: { image: 'map_gaule', lon: [-7, 15], lat: [53, 42.5] },
  theme: { olive: '#7a2e22', btn: '#4a2a20', btnHi: '#643a2c', edge: '#b08a4a', bg1: '#4a3326', bg2: '#2e2019', bg3: '#1a120e',
           panel: '#261a14', panelEdge: '#6b4c30', tile1: '#5a4a32', tile2: '#3a2f20' },
  font: 'roman',                // Roman capitals (Cinzel) for the titles
  startSound: 'cornu',          // played when a battle starts: a Roman horn
});
if (typeof module !== 'undefined') module.exports = globalThis.PACKS.gaule;
