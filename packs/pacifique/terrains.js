'use strict';
// Pacific 1942–1945 — terrains. Plain data plus hooks (functions receiving `g`, the engine helper: see README).
(globalThis.PACKS = globalThis.PACKS || {}).pacifique = globalThis.PACKS.pacifique || {};
{ // block: in the browser every <script> shares one global scope, keep helpers local
// Traits = how a terrain plays (hooks), shared by the terrains that name them in `trait`:
//   modify(g, unit, t, v) · fieldAura · slotDelta · downValue · drawBonus · hub · fog · blocksMove · immune · tags
//   onTurnStart(g, t)  at the start of each turn of side g.p, while the terrain is open
const held = (X, p) => X.captured === p || (X.captured === null && X.holder === p);
PACKS.pacifique.traits = {
  // Open sea: infantry is worth nothing here, only ships, aircraft and supply count.
  haute_mer: { modify: (g, u, t, v) => { if (g.type(u) === 'Infanterie') v.fill(0); } },
  // Coral reef: landing craft run aground, a unit counts 1 Infantry less until the start of its side's next turn
  // (the turn start marks every unit already here as ashore). Amphibious units cross it.
  recif: {
    onTurnStart: (g, t) => g.allies(t).forEach(u => { u.ashore = true; }),
    modify: (g, u, t, v) => { if (!u.ashore && !g.has(u, 'amphibious') && v[1]) v[1]--; },
  },
  jungle: { fog: true },
  grottes: { immune: true },
  blockhaus: { downValue: [0, 2, 0, 0] },
  // Airstrip: while you hold it, your aircraft on the other terrains get +1 Air.
  piste: { fieldAura: (g, u, t, v) => { if (g.type(u) === 'Aviation' && g.trait(t) !== 'piste' && g.terrains().some((X, i) => g.trait(i) === 'piste' && held(X, u.owner))) v[2]++; } },
  port: { drawBonus: 1 },
  volcan: { tags: ['highGround'] },
  lagon: { hub: true },
  atoll: { slotDelta: -1 },
  // Malaria: at the start of your turn, your unit with the most Infantry here loses 1.
  marecage: { onTurnStart: (g, t) => {
    const us = g.allies(t).filter(u => !u.down && g.vals(u, t)[1] > 0);
    if (us.length) g.malus(us.reduce((a, b) => g.vals(b, t)[1] > g.vals(a, t)[1] ? b : a).id);
  } },
};
const T = {
  haute_mer: { fr: "Haute mer : les unités d'Infanterie ne valent rien ici.", en: "Open sea: Infantry units are worth nothing here." },
  recif: { fr: "Récif : une unité posée ici a 1 Infanterie de moins jusqu'au début de ton tour suivant (sauf amphibie).", en: "Reef: a unit played here has 1 Infantry less until the start of your next turn (except amphibious)." },
  jungle: { fr: "Jungle : toute unité posée ici l'est face cachée mais garde ses valeurs. Pouvoirs inactifs.", en: "Jungle: units played here are face down but keep their values. Powers inactive." },
  grottes: { fr: "Grottes : aucune unité ici ne peut être détruite.", en: "Caves: no unit here can be destroyed." },
  blockhaus: { fr: "Blockhaus : les cartes face cachée valent 2 en Infanterie.", en: "Pillboxes: face-down cards are worth 2 Infantry." },
  piste: { fr: "Piste : tant que tu la tiens, tes unités Aviation sur les autres terrains gagnent +1 Air.", en: "Airstrip: while you hold it, your Aviation units on the other terrains get +1 Air." },
  port: { fr: "Port : une fois capturé, tu pioches 1 carte de plus par tour.", en: "Harbour: once captured, you draw 1 extra card per turn." },
  volcan: { fr: "Volcan : tant que tu le tiens, tes Bombardements navals visent n'importe quel terrain.", en: "Volcano: while you hold it, your Naval Bombardments can target any terrain." },
  lagon: { fr: "Lagon : adjacent aux deux autres terrains.", en: "Lagoon: adjacent to both other terrains." },
  atoll: { fr: "Atoll : 3 emplacements.", en: "Atoll: 3 slots." },
  marecage: { fr: "Paludisme : au début de ton tour, ton unité la plus forte en Infanterie ici perd 1 Infanterie.", en: "Malaria: at the start of your turn, your unit with the most Infantry here loses 1 Infantry." },
};
const t = (fr, en, thr, trait, more = {}) => ({ name: { fr, en }, thr, trait, text: T[trait], ...more });
// Terrains: name, threshold [Navy, Infantry, Air, Logistics], trait (+ art borrowed from another terrain).
PACKS.pacifique.terrains = {
  haute_mer: t("Haute mer", "Open Sea", [3,0,2,1], "haute_mer"),
  recif: t("Récif corallien", "Coral Reef", [1,3,0,1], "recif"),
  jungle: t("Jungle", "Jungle", [0,3,1,1], "jungle"),
  grottes: t("Réseau de grottes", "Cave Network", [0,3,1,1], "grottes"),
  blockhaus: t("Blockhaus de cocotiers", "Coconut-Log Pillboxes", [1,2,0,1], "blockhaus"),
  piste: t("Piste d'aviation", "Airstrip", [0,2,2,1], "piste"),
  port: t("Port", "Harbour", [2,1,0,2], "port"),
  volcan: t("Volcan", "Volcano", [1,2,1,1], "volcan"),
  lagon: t("Lagon", "Lagoon", [2,1,1,1], "lagon"),
  atoll: t("Atoll", "Atoll", [1,2,1,1], "atoll"),
  marecage: t("Mangrove", "Mangrove Swamp", [0,2,1,1], "marecage"),
  // Campaign variants: same trait as their base terrain, own threshold.
  wake: t("Île de Wake", "Wake Island", [1,2,0,1], "atoll", { art: 'atoll' }),
  mer_corail: t("Mer de Corail", "Coral Sea", [3,0,2,1], "haute_mer", { art: 'haute_mer' }),
  mer_midway: t("Au large de Midway", "Off Midway", [2,0,3,0], "haute_mer", { art: 'haute_mer' }),
  midway: t("Atoll de Midway", "Midway Atoll", [1,1,2,1], "piste", { art: 'piste' }),
  lunga: t("Plage de Lunga", "Lunga Beach", [1,3,0,1], "recif", { art: 'plage' }),
  henderson: t("Henderson Field", "Henderson Field", [0,2,2,1], "piste", { art: 'piste' }),
  bloody_ridge: t("Crête sanglante", "Bloody Ridge", [0,2,1,1], "volcan", { art: 'volcan' }),
  betio: t("Betio, plage rouge", "Betio, Red Beach", [1,2,0,1], "recif"),
  kwajalein: t("Kwajalein", "Kwajalein", [1,1,1,1], "atoll", { art: 'atoll' }),
  saipan: t("Plages de Saipan", "Saipan Beaches", [1,2,0,1], "recif", { art: 'plage' }),
  tapotchau: t("Mont Tapotchau", "Mount Tapotchau", [0,2,1,1], "volcan", { art: 'volcan' }),
  mer_philippines: t("Mer des Philippines", "Philippine Sea", [2,0,2,1], "haute_mer", { art: 'haute_mer' }),
  guam: t("Plages de Guam", "Guam Beaches", [1,2,0,1], "recif", { art: 'plage' }),
  bougainville: t("Baie de l'Impératrice-Augusta", "Empress Augusta Bay", [1,2,1,1], "marecage", { art: 'marecage' }),
  hollandia: t("Hollandia", "Hollandia", [2,2,1,2], "port", { art: 'port' }),
  umurbrogol: t("Umurbrogol", "Umurbrogol", [0,2,0,1], "grottes", { art: 'grottes' }),
  leyte: t("Plages de Leyte", "Leyte Beaches", [1,2,0,1], "recif", { art: 'plage' }),
  surigao: t("Détroit de Surigao", "Surigao Strait", [3,0,1,1], "haute_mer", { art: 'haute_mer' }),
  suribachi: t("Mont Suribachi", "Mount Suribachi", [1,1,1,1], "volcan"),
  sable_noir: t("Plages de sable noir", "Black Sand Beaches", [1,2,0,1], "recif"),
  shuri: t("Ligne Shuri", "Shuri Line", [0,2,1,1], "grottes", { art: 'grottes' }),
  piquets: t("Piquets radar", "Radar Pickets", [2,0,2,1], "haute_mer", { art: 'haute_mer' }),
};
// Quick battle draws 3 of these (the first three are the default battle).
PACKS.pacifique.quick = ['haute_mer', 'recif', 'jungle', 'grottes', 'blockhaus', 'piste', 'port', 'volcan', 'lagon', 'atoll', 'marecage'];
}
if (typeof module !== 'undefined') module.exports = PACKS.pacifique;
