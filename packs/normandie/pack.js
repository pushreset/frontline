'use strict';
// Normandie 1944 — identity of the campaign: everything the interface shows that is not a card,
// a terrain or a battle. Load order: pack.js, cards.js, terrains.js, battles.js.
(globalThis.PACKS = globalThis.PACKS || {}).normandie = Object.assign(globalThis.PACKS.normandie || {}, {
  id: 'normandie',
  title: { fr: 'Normandie', en: 'Normandy' },
  sub: { fr: 'Normandie · été 1944', en: 'Normandy · summer 1944' },
  dates: { fr: 'juin – août 1944', en: 'June – August 1944' },
  finale: { fr: 'Paris libéré', en: 'Paris liberated' },         // title of the last victory screen
  // The 4 attributes, in threshold order, with their icon (out/sprites/i_<icon>.png).
  attrs: { fr: ['Char', 'Infanterie', 'Air', 'Stratégie'], en: ['Armour', 'Infantry', 'Air', 'Strategy'] },
  icons: ['char', 'inf', 'air', 'strat'],
  // Card types: name, main attribute (+1 for a veteran), sound when deployed. 'Ordre' is the engine's order type.
  types: {
    Char: { fr: 'Char', en: 'Tank', main: 0, sound: 'tank' },
    Infanterie: { fr: 'Infanterie', en: 'Infantry', main: 1, sound: 'boots' },
    Air: { fr: 'Air', en: 'Air', main: 2, sound: 'plane' },
    Soutien: { fr: 'Soutien', en: 'Support', main: 3, sound: 'boots' },
    Ordre: { fr: 'Ordre', en: 'Order' },
  },
  malusAttr: 1,                 // attribute lowered by g.malus() (Mortars, Barrage)
  // Art: <art>scenes/c_<card>.png (enemy: c_<card>_x.png), t_<terrain>.png, <map>.png, <art>sprites/i_<icon>.png
  art: 'packs/normandie/out/',
  cover: 'omaha_dog',           // terrain picture behind the main menu
  map: { image: 'map_normandie', lon: [-2.0, 2.5], lat: [49.8, 48.5] },
});
if (typeof module !== 'undefined') module.exports = globalThis.PACKS.normandie;
