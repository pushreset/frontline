'use strict';
// Normandie 1944 — terrains. Plain data plus hooks (functions receiving `g`, the engine helper: see README).
(globalThis.PACKS = globalThis.PACKS || {}).normandie = globalThis.PACKS.normandie || {};
// Traits = how a terrain plays (hooks), shared by the terrains that name them in `trait`:
//   modify(g, unit, t, v)    values of the units on this terrain   · fieldAura(g, unit, t, v)  values everywhere
//   slotDelta · downValue (worth of a face-down card) · drawBonus (once captured) · hub (adjacent to all)
//   fog (units land face down, keep their values) · blocksMove(g, unit) · immune (nothing destroyed here) · tags
PACKS.normandie.traits = {
  bocage: { modify: (g, u, t, v) => { if (g.type(u) === 'Char') v[0] = Math.max(0, v[0] - 1); }, },
  pont: { slotDelta: -1, },
  village: { downValue: [0, 2, 0, 0], },
  plage: { drawBonus: 1, },
  colline: { tags: ['highGround'], },
  aerodrome: { fieldAura: (g, u, t, v) => { if (g.type(u) === 'Air' && g.trait(t) !== 'aerodrome' && g.terrains().some((X, i) => g.trait(i) === 'aerodrome' && X.captured === u.owner)) v[2]++; }, },
  carrefour: { hub: true, },
  foret: { fog: true, },
  marais: { blocksMove: (g, u) => g.type(u) === 'Char', },
  bunker: { immune: true, },
};
// Terrains: name, threshold [4 attributes], text, trait (+ slots to override the slot count).
PACKS.normandie.terrains = {
  bocage: { name: { fr: "Bocage", en: "Bocage" }, thr: [2,3,0,1], trait: "bocage",
    text: { fr: "Haies : chaque Char posé ici vaut 1 Char de moins.", en: "Hedgerows: each Tank here is worth 1 Armour less." } },
  pont: { name: { fr: "Le Pont", en: "The Bridge" }, thr: [3,1,1,1], trait: "pont",
    text: { fr: "Goulet : 3 emplacements par camp au lieu de 4.", en: "Bottleneck: 3 slots per side instead of 4." } },
  village: { name: { fr: "Village en ruines", en: "Ruined Village" }, thr: [1,3,0,2], trait: "village",
    text: { fr: "Combat de rue : les cartes face cachée valent 2 en Infanterie.", en: "Street fighting: face-down cards are worth 2 Infantry." } },
  plage: { name: { fr: "Plage", en: "Beach" }, thr: [1,3,1,1], trait: "plage",
    text: { fr: "Tête de pont : une fois capturée, tu pioches 1 carte de plus par tour.", en: "Beachhead: once captured, you draw 1 extra card per turn." } },
  colline: { name: { fr: "Colline", en: "Hill" }, thr: [1,1,1,2], trait: "colline",
    text: { fr: "Point haut : tant que tu la tiens, ton Artillerie vise n'importe quel terrain.", en: "High ground: while you hold it, your Artillery can target any terrain." } },
  aerodrome: { name: { fr: "Aérodrome", en: "Airfield" }, thr: [1,1,2,1], trait: "aerodrome",
    text: { fr: "Piste : une fois capturé, tes unités Air valent +1 Air ailleurs.", en: "Runway: once captured, your Air units get +1 Air elsewhere." } },
  carrefour: { name: { fr: "Carrefour", en: "Crossroads" }, thr: [2,1,1,1], trait: "carrefour",
    text: { fr: "Nœud routier : adjacent aux deux autres terrains.", en: "Road hub: adjacent to both other terrains." } },
  foret: { name: { fr: "Forêt enneigée", en: "Snowy Forest" }, thr: [1,3,0,2], trait: "foret",
    text: { fr: "Brouillard : toute unité posée ici l'est face cachée mais garde ses valeurs. Pouvoirs inactifs.", en: "Fog: units played here are face down but keep their values. Powers inactive." } },
  marais: { name: { fr: "Marais", en: "Marsh" }, thr: [1,2,1,1], trait: "marais",
    text: { fr: "Enlisement : aucun Char n'y entre ni n'en sort par déplacement.", en: "Bogged down: no Tank can move in or out." } },
  // Campaign variants: same trait as their base terrain, own threshold.
  omaha_dog: { name: { fr: "Omaha – Dog Green", en: "Omaha – Dog Green" }, thr: [1,3,1,1], trait: "plage",
    text: { fr: "Tête de pont : une fois capturée, tu pioches 1 carte de plus par tour.", en: "Beachhead: once captured, you draw 1 extra card per turn." } },
  omaha_easy: { name: { fr: "Omaha – Easy Red", en: "Omaha – Easy Red" }, thr: [2,2,1,1], trait: "plage",
    text: { fr: "Tête de pont : une fois capturée, tu pioches 1 carte de plus par tour.", en: "Beachhead: once captured, you draw 1 extra card per turn." } },
  port_cherbourg: { name: { fr: "Port de Cherbourg", en: "Port of Cherbourg" }, thr: [2,2,1,2], trait: "plage",
    text: { fr: "Port : une fois capturé, tu pioches 1 carte de plus par tour.", en: "Harbour: once captured, you draw 1 extra card per turn." } },
  wn62: { name: { fr: "Point d'appui WN62", en: "Strongpoint WN62" }, thr: [1,3,0,2], trait: "bunker",
    text: { fr: "Béton : aucune unité ici ne peut être détruite.", en: "Concrete: no unit here can be destroyed." } },
  fort_roule: { name: { fr: "Fort du Roule", en: "Fort du Roule" }, thr: [2,2,0,2], trait: "bunker",
    text: { fr: "Béton : aucune unité ici ne peut être détruite.", en: "Concrete: no unit here can be destroyed." } },
  pointe_hoc: { name: { fr: "Pointe du Hoc", en: "Pointe du Hoc" }, thr: [1,3,0,2], trait: "colline", slots: 3,
    text: { fr: "Falaise : 3 emplacements. Tant que tu la tiens, ton Artillerie vise n'importe quel terrain.", en: "Cliff: 3 slots. While you hold it, your Artillery can target any terrain." } },
  cote_112: { name: { fr: "Cote 112", en: "Hill 112" }, thr: [2,1,1,2], trait: "colline",
    text: { fr: "Point haut : tant que tu la tiens, ton Artillerie vise n'importe quel terrain.", en: "High ground: while you hold it, your Artillery can target any terrain." } },
  mont_ormel: { name: { fr: "Mont-Ormel", en: "Mont-Ormel" }, thr: [1,2,1,2], trait: "colline",
    text: { fr: "Point haut : tant que tu la tiens, ton Artillerie vise n'importe quel terrain.", en: "High ground: while you hold it, your Artillery can target any terrain." } },
  bocage_dense: { name: { fr: "Bocage dense", en: "Dense Bocage" }, thr: [1,4,0,1], trait: "bocage",
    text: { fr: "Haies : chaque Char posé ici vaut 1 Char de moins.", en: "Hedgerows: each Tank here is worth 1 Armour less." } },
  chemin_creux: { name: { fr: "Chemin creux", en: "Sunken Lane" }, thr: [2,2,0,2], trait: "bocage", slots: 3,
    text: { fr: "Haies, goulet : 3 emplacements, chaque Char posé ici vaut 1 Char de moins.", en: "Hedgerows, narrow: 3 slots, each Tank here is worth 1 Armour less." } },
  pegasus: { name: { fr: "Pegasus Bridge", en: "Pegasus Bridge" }, thr: [1,2,0,1], trait: "pont", slots: 2,
    text: { fr: "Coup de main : 2 emplacements par camp.", en: "Coup de main: 2 slots per side." } },
  pont_mine: { name: { fr: "Pont miné", en: "Mined Bridge" }, thr: [2,1,0,2], trait: "pont",
    text: { fr: "Goulet : 3 emplacements par camp au lieu de 4.", en: "Bottleneck: 3 slots per side instead of 4." } },
  chaussee: { name: { fr: "Chaussée de Carentan", en: "Carentan Causeway" }, thr: [2,2,0,1], trait: "pont",
    text: { fr: "Goulet : 3 emplacements par camp au lieu de 4.", en: "Bottleneck: 3 slots per side instead of 4." } },
  pont_vernon: { name: { fr: "Pont de Vernon", en: "Vernon Bridge" }, thr: [3,2,1,2], trait: "pont", slots: 4,
    text: { fr: "Large fleuve : 4 emplacements, gros seuil.", en: "Wide river: 4 slots, high threshold." } },
  sainte_mere: { name: { fr: "Sainte-Mère-Église", en: "Sainte-Mère-Église" }, thr: [1,3,1,1], trait: "village",
    text: { fr: "Combat de rue : les cartes face cachée valent 2 en Infanterie.", en: "Street fighting: face-down cards are worth 2 Infantry." } },
  caen: { name: { fr: "Caen en ruines", en: "Caen in Ruins" }, thr: [2,3,0,2], trait: "village",
    text: { fr: "Combat de rue : les cartes face cachée valent 2 en Infanterie.", en: "Street fighting: face-down cards are worth 2 Infantry." } },
  saint_lo: { name: { fr: "Saint-Lô", en: "Saint-Lô" }, thr: [1,3,0,3], trait: "village",
    text: { fr: "Combat de rue : les cartes face cachée valent 2 en Infanterie.", en: "Street fighting: face-down cards are worth 2 Infantry." } },
  paris: { name: { fr: "Paris – Hôtel de Ville", en: "Paris – Hôtel de Ville" }, thr: [1,3,0,3], trait: "village",
    text: { fr: "Combat de rue : les cartes face cachée valent 2 en Infanterie.", en: "Street fighting: face-down cards are worth 2 Infantry." } },
  carpiquet: { name: { fr: "Carpiquet", en: "Carpiquet" }, thr: [1,2,2,1], trait: "aerodrome",
    text: { fr: "Piste : une fois capturé, tes unités Air valent +1 Air ailleurs.", en: "Runway: once captured, your Air units get +1 Air elsewhere." } },
  cerisy: { name: { fr: "Forêt de Cerisy", en: "Cerisy Forest" }, thr: [1,3,0,2], trait: "foret",
    text: { fr: "Brouillard : toute unité posée ici l'est face cachée mais garde ses valeurs. Pouvoirs inactifs.", en: "Fog: units played here are face down but keep their values. Powers inactive." } },
};
// Quick battle draws 3 of these (the first three are the default battle).
PACKS.normandie.quick = ['bocage', 'pont', 'village', 'plage', 'colline', 'aerodrome', 'carrefour', 'foret', 'marais'];
if (typeof module !== 'undefined') module.exports = PACKS.normandie;
