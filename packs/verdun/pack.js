'use strict';
// Verdun 1916 — identity of the campaign: everything the interface shows that is not a card,
// a terrain or a battle. Load order: pack.js, cards.js, terrains.js, battles.js.
(globalThis.PACKS = globalThis.PACKS || {}).verdun = Object.assign(globalThis.PACKS.verdun || {}, {
  id: 'verdun',
  title: { fr: 'Verdun', en: 'Verdun' },
  sub: { fr: 'Verdun · 1916', en: 'Verdun · 1916' },
  dates: { fr: 'février – décembre 1916', en: 'February – December 1916' },
  finale: { fr: 'Verdun a tenu', en: 'Verdun held' },
  // Era: groups campaigns in the menu and picks the quick battle's cards and terrains.
  era: { key: 'ww1', fr: 'Grande Guerre', en: 'Great War', years: '1914 – 1918' },
  attrs: { fr: ['Artillerie', 'Infanterie', 'Génie', 'Moral'], en: ['Artillery', 'Infantry', 'Engineering', 'Morale'] },
  short: { fr: ['Art', 'Inf', 'Gén', 'Mor'], en: ['Art', 'Inf', 'Eng', 'Mor'] },
  icons: ['art', 'inf', 'gen', 'moral'],
  types: {
    Artillerie: { fr: 'Artillerie', en: 'Artillery', main: 0, sound: 'whistle' },
    Infanterie: { fr: 'Infanterie', en: 'Infantry', main: 1, sound: 'boots' },
    Genie: { fr: 'Génie', en: 'Engineers', main: 2, sound: 'dig' },
    Commandement: { fr: 'Commandement', en: 'Command', main: 3, sound: 'boots' },
    Aviation: { fr: 'Aviation', en: 'Aviation', main: 3, sound: 'plane' },
    Ordre: { fr: 'Ordre', en: 'Order' },
  },
  malusAttr: 1,                 // attribute lowered by g.malus() (shelling, gas, attrition)
  art: 'packs/verdun/out/',
  cover: 'fort_douaumont',
  map: { image: 'map_verdun', lon: [5.18, 5.56], lat: [49.29, 49.15] },
  // Look of the era in the interface (CSS variables) and title lettering ('serif' or the default stencil).
  theme: { olive: '#4e5d74', btn: '#333a45', btnHi: '#434c5a', edge: '#6b7486', bg1: '#3a3d40', bg2: '#22252a', bg3: '#121418' },
  font: 'serif',
  startSound: 'assault',        // played when a battle starts: the officer's whistle
});
if (typeof module !== 'undefined') module.exports = globalThis.PACKS.verdun;
