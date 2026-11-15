'use strict';
// Pacific 1942–1945 — identity of the campaign: everything the interface shows that is not a card,
// a terrain or a battle. Load order: pack.js, cards.js, terrains.js, battles.js.
(globalThis.PACKS = globalThis.PACKS || {}).pacifique = Object.assign(globalThis.PACKS.pacifique || {}, {
  id: 'pacifique',
  title: { fr: 'Pacifique', en: 'Pacific' },
  sub: { fr: 'Pacifique · 1942–1945', en: 'Pacific · 1942–1945' },
  dates: { fr: 'décembre 1941 – avril 1945', en: 'December 1941 – April 1945' },
  finale: { fr: 'Le drapeau flotte sur Okinawa', en: 'The flag flies over Okinawa' },
  // Era: same key as Normandy, the two campaigns share the Second World War.
  era: { key: 'ww2', fr: 'Seconde Guerre mondiale', en: 'Second World War', years: '1939 – 1945' },
  attrs: { fr: ['Marine', 'Infanterie', 'Air', 'Logistique'], en: ['Navy', 'Infantry', 'Air', 'Logistics'] },
  short: { fr: ['Mar', 'Inf', 'Air', 'Log'], en: ['Nav', 'Inf', 'Air', 'Log'] },
  icons: ['ancre', 'casque', 'avion', 'caisse'],
  types: {
    Navire: { fr: 'Navire', en: 'Ship', main: 0, sound: 'naval' },
    Infanterie: { fr: 'Infanterie', en: 'Infantry', main: 1, sound: 'boots' },
    Aviation: { fr: 'Aviation', en: 'Aviation', main: 2, sound: 'plane' },
    Logistique: { fr: 'Logistique', en: 'Logistics', main: 3, sound: 'dig' },
    Ordre: { fr: 'Ordre', en: 'Order' },
  },
  malusAttr: 1,                 // attribute lowered by g.malus() (shelling, strafing, malaria)
  art: 'packs/pacifique/out/',
  artScale: 2,                  // pictures drawn at twice the base sizes (cards 128x80)
  cover: 'suribachi',
  // Longitudes east of Greenwich, past 180°: Midway (177.4° W) is 182.6.
  map: { image: 'map_pacifique', lon: [118, 186], lat: [40, -16] },
  theme: { olive: '#2f5f6b', btn: '#2b4a52', btnHi: '#3a5f68', edge: '#6f9aa0', bg1: '#2e4a50', bg2: '#1c2f34', bg3: '#0f1a1d',
           panel: '#18282c', panelEdge: '#3f6168', tile1: '#4a4433', tile2: '#2e2a1f' },
  startSound: 'horn',           // played when a battle starts: a ship's horn
});
if (typeof module !== 'undefined') module.exports = globalThis.PACKS.pacifique;
