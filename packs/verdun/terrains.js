'use strict';
// Verdun 1916 — terrains. Plain data plus hooks (functions receiving `g`, the engine helper: see README).
(globalThis.PACKS = globalThis.PACKS || {}).verdun = globalThis.PACKS.verdun || {};
{ // block: in the browser every <script> shares one global scope, keep helpers local
// Traits = how a terrain plays (hooks), shared by the terrains that name them in `trait`:
//   modify(g, unit, t, v) · fieldAura · slotDelta · downValue · drawBonus · hub · fog · blocksMove · immune · tags
//   onTurnStart(g, t)  at the start of each turn of side g.p, while the terrain is open
PACKS.verdun.traits = {
  // Deep dugouts: the first Infantry loss of each unit does not count here (modify runs before the malus).
  tranchee: { modify: (g, u, t, v) => { if (u.malus) v[1]++; } },
  // Worn-out ground: at the start of your turn, your unit with the most Infantry here loses 1.
  no_mans_land: { slotDelta: -1, onTurnStart: (g, t) => {
    const us = g.allies(t).filter(u => !u.down && g.vals(u, t)[1] > 0);
    if (us.length) g.malus(us.reduce((a, b) => g.vals(b, t)[1] > g.vals(a, t)[1] ? b : a).id);
  } },
  barbeles: { blocksMove: () => true },
  crateres: { fog: true },
  fort: { immune: true },
  cote: { tags: ['highGround'] },
  ruines: { downValue: [0, 2, 0, 0] },
  bois: { tags: ['cover'] },
  boyau: { hub: true },
  depot: { drawBonus: 1 },
};
const T = {
  tranchee: { fr: "Abris profonds : la première perte d'Infanterie de chaque unité ne compte pas ici.", en: "Deep dugouts: each unit's first Infantry loss does not count here." },
  no_mans_land: { fr: "Terre usée : 3 emplacements. Au début de ton tour, ton unité la plus forte en Infanterie ici perd 1 Infanterie.", en: "Worn-out ground: 3 slots. At the start of your turn, your unit with the most Infantry here loses 1 Infantry." },
  barbeles: { fr: "Barbelés : aucune unité n'y entre ni n'en sort par déplacement.", en: "Barbed wire: no unit can move in or out." },
  crateres: { fr: "Trous d'obus : toute unité posée ici l'est face cachée mais garde ses valeurs. Pouvoirs inactifs.", en: "Shell holes: units played here are face down but keep their values. Powers inactive." },
  fort: { fr: "Béton : aucune unité ici ne peut être détruite.", en: "Concrete: no unit here can be destroyed." },
  fort3: { fr: "Béton, couloirs étroits : 3 emplacements, aucune unité ici ne peut être détruite.", en: "Concrete, narrow tunnels: 3 slots, no unit here can be destroyed." },
  cote: { fr: "Point haut : tant que tu la tiens, tes Pilonnages et Barrages visent n'importe quel terrain.", en: "High ground: while you hold it, your Shellings and Barrages can target any terrain." },
  ruines: { fr: "Village rasé : les cartes face cachée valent 2 en Infanterie.", en: "Razed village: face-down cards are worth 2 Infantry." },
  bois: { fr: "Bois déchiqueté : le Pilonnage ne peut pas viser les unités ici.", en: "Shattered woods: Shelling cannot target units here." },
  boyau: { fr: "Boyau de communication : adjacent aux deux autres terrains.", en: "Communication trench: adjacent to both other terrains." },
  depot: { fr: "Dépôt : une fois capturé, tu pioches 1 carte de plus par tour.", en: "Depot: once captured, you draw 1 extra card per turn." },
};
const t = (fr, en, thr, trait, more = {}) => ({ name: { fr, en }, thr, trait, text: T[more.slots === 3 && trait === 'fort' ? 'fort3' : trait], ...more });
// Terrains: name, threshold [Artillery, Infantry, Engineering, Morale], trait (+ slots, art borrowed from another terrain).
PACKS.verdun.terrains = {
  tranchee: t("Tranchée", "Trench", [1,3,0,1], "tranchee"),
  no_mans_land: t("No man's land", "No Man's Land", [1,2,1,1], "no_mans_land"),
  barbeles: t("Réseau de barbelés", "Wire Entanglement", [1,2,1,1], "barbeles"),
  crateres: t("Champ de cratères", "Crater Field", [1,3,0,2], "crateres"),
  fort: t("Ouvrage bétonné", "Concrete Redoubt", [2,2,0,2], "fort"),
  cote: t("Crête", "Ridge", [1,1,1,2], "cote"),
  ruines: t("Village rasé", "Razed Village", [1,3,0,2], "ruines"),
  bois: t("Bois déchiqueté", "Shattered Wood", [1,2,1,1], "bois"),
  boyau: t("Boyau", "Communication Trench", [2,1,1,1], "boyau"),
  depot: t("Dépôt de munitions", "Ammunition Depot", [1,1,2,1], "depot"),
  // Campaign variants: same trait as their base terrain, own threshold.
  bois_caures: t("Bois des Caures", "Bois des Caures", [1,3,0,2], "bois"),
  herbebois: t("Bois d'Herbebois", "Herbebois Wood", [2,3,1,1], "bois", { art: 'bois' }),
  samogneux: t("Samogneux", "Samogneux", [1,3,0,1], "ruines", { art: 'ruines' }),
  cote_poivre: t("Côte du Poivre", "Pepper Hill", [1,1,1,2], "cote", { art: 'cote' }),
  village_douaumont: t("Village de Douaumont", "Douaumont Village", [1,2,0,2], "ruines", { art: 'ruines' }),
  fort_douaumont: t("Fort de Douaumont", "Fort Douaumont", [1,2,0,2], "fort", { slots: 3 }),
  mort_homme: t("Le Mort-Homme", "Le Mort-Homme", [1,2,1,1], "cote"),
  cote_304: t("Cote 304", "Hill 304", [2,1,1,2], "cote", { art: 'mort_homme' }),
  vaux: t("Village de Vaux", "Vaux Village", [1,2,1,2], "ruines", { art: 'fleury' }),
  fort_vaux: t("Fort de Vaux", "Fort Vaux", [1,3,0,2], "fort", { slots: 3 }),
  ravin_mort: t("Ravin de la Mort", "Ravine of Death", [1,2,0,1], "no_mans_land", { art: 'no_mans_land' }),
  thiaumont: t("Ouvrage de Thiaumont", "Thiaumont Redoubt", [1,2,0,1], "fort", { slots: 3, art: 'fort' }),
  fleury: t("Fleury-devant-Douaumont", "Fleury-devant-Douaumont", [1,3,0,2], "ruines"),
  fort_souville: t("Fort de Souville", "Fort Souville", [1,2,1,2], "fort", { art: 'fort_vaux' }),
  haudromont: t("Carrières d'Haudromont", "Haudromont Quarries", [1,3,0,2], "crateres", { art: 'crateres' }),
  louvemont: t("Louvemont", "Louvemont", [1,2,0,2], "ruines", { art: 'ruines' }),
};
// Quick battle draws 3 of these (the first three are the default battle).
PACKS.verdun.quick = ['tranchee', 'no_mans_land', 'barbeles', 'crateres', 'fort', 'cote', 'ruines', 'bois', 'boyau', 'depot'];
}
if (typeof module !== 'undefined') module.exports = PACKS.verdun;
