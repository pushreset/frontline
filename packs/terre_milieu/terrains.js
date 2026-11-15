'use strict';
// War of the Ring — terrains. Plain data plus hooks (functions receiving `g`, the engine helper: see README).
(globalThis.PACKS = globalThis.PACKS || {}).terre_milieu = globalThis.PACKS.terre_milieu || {};
{ // block: in the browser every <script> shares one global scope, keep helpers local
// Traits = how a terrain plays (hooks), shared by the terrains that name them in `trait`:
//   modify(g, unit, t, v) · fieldAura · slotDelta · downValue · drawBonus · hub · fog · blocksMove · immune · tags
//   onTurnStart(g, t)  at the start of each turn of side g.p, while the terrain is open
PACKS.terre_milieu.traits = {
  plaine: {},
  // Ford: riders are worth 1 Cavalry less and cannot move in or out.
  gue: { modify: (g, u, t, v) => { if (g.type(u) === 'Cavalerie' && v[1]) v[1]--; }, blocksMove: (g, u) => g.type(u) === 'Cavalerie' },
  foret: { fog: true },
  forteresse: { slotDelta: -1 },
  riviere: { hub: true },
  // Dead Marshes: at the start of your turn, your unit with the most Sword here loses 1.
  marais: { onTurnStart: (g, t) => {
    const us = g.allies(t).filter(u => !u.down && g.vals(u, t)[0] > 0);
    if (us.length) g.malus(us.reduce((a, b) => g.vals(b, t)[0] > g.vals(a, t)[0] ? b : a).id);
  } },
  ruines: { downValue: [2, 0, 0, 0] },
  village: { drawBonus: 1 },
  // The Shadow: no sun to aim by, each Archer unit is worth 1 Bow less.
  ombre: { modify: (g, u, t, v) => { if (g.type(u) === 'Archer' && v[2]) v[2]--; } },
  // Mountain pass: no room for horses, Cavalry units are worth nothing here.
  montagne: { modify: (g, u, t, v) => { if (g.type(u) === 'Cavalerie') v.fill(0); } },
  // Wizard's tower: once captured, your Magic units get +1 Magic on the other terrains.
  tour: { fieldAura: (g, u, t, v) => { if (g.type(u) === 'Magie' && g.trait(t) !== 'tour' && g.terrains().some((X, i) => g.trait(i) === 'tour' && X.captured === u.owner)) v[3]++; } },
  // Harbour: a fight between ships, Foot and Cavalry units count for nothing (only bows and magic fight).
  port: { modify: (g, u, t, v) => { const ty = g.type(u); if (ty === 'Fantassin' || ty === 'Cavalerie') v.fill(0); } },
  muraille: { immune: true },
};
const T = {
  plaine: { fr: "Terrain découvert.", en: "Open ground." },
  gue: { fr: "Gué : chaque unité de Cavalerie vaut 1 Cavalerie de moins ici et ne peut ni entrer ni sortir par déplacement.", en: "Ford: each Cavalry unit is worth 1 Cavalry less here and cannot move in or out." },
  foret: { fr: "Forêt : toute unité posée ici l'est face cachée mais garde ses valeurs. Pouvoirs inactifs.", en: "Forest: units played here are face down but keep their values. Powers inactive." },
  forteresse: { fr: "Forteresse : 3 emplacements.", en: "Fortress: 3 slots." },
  riviere: { fr: "Fleuve : adjacent aux deux autres terrains.", en: "River: adjacent to both other terrains." },
  marais: { fr: "Marais des Morts : au début de ton tour, ton unité la plus forte en Épée ici perd 1 Épée.", en: "Dead Marshes: at the start of your turn, your unit with the most Sword here loses 1 Sword." },
  ruines: { fr: "Ruines : les cartes face cachée valent 2 en Épée.", en: "Ruins: face-down cards are worth 2 Sword." },
  village: { fr: "Village : une fois capturé, tu pioches 1 carte de plus par tour.", en: "Village: once captured, you draw 1 extra card per turn." },
  ombre: { fr: "Ombre : sous le ciel noir, chaque unité d'Archer vaut 1 Arc de moins ici.", en: "Shadow: under the black sky, each Archer unit is worth 1 Bow less here." },
  montagne: { fr: "Montagne : les unités de Cavalerie ne valent rien ici.", en: "Mountain: Cavalry units are worth nothing here." },
  tour: { fr: "Tour : une fois capturée, tes unités de Magie gagnent +1 Magie sur les autres terrains.", en: "Tower: once captured, your Magic units get +1 Magic on the other terrains." },
  port: { fr: "Port : bataille navale, les unités de Fantassin et de Cavalerie ne valent rien ici.", en: "Harbour: a fight between ships, Foot and Cavalry units are worth nothing here." },
  muraille: { fr: "Muraille : aucune unité ici ne peut être détruite.", en: "Walls: no unit here can be destroyed." },
};
const t = (fr, en, thr, trait, more = {}) => ({ name: { fr, en }, thr, trait, text: T[trait], ...more });
// Terrains: name, threshold [Sword, Cavalry, Bow, Magic], trait (+ art borrowed from another terrain).
PACKS.terre_milieu.terrains = {
  plaine: t("Plaine", "Plain", [2,1,1,1], "plaine"),
  gue: t("Gué", "Ford", [2,1,1,1], "gue"),
  foret: t("Forêt", "Forest", [2,0,2,1], "foret"),
  forteresse: t("Forteresse", "Fortress", [3,0,1,1], "forteresse"),
  riviere: t("Fleuve", "River", [2,1,1,1], "riviere"),
  marais: t("Marais", "Marshes", [2,0,1,1], "marais"),
  ruines: t("Ruines", "Ruins", [3,0,1,1], "ruines"),
  village: t("Village", "Village", [2,1,0,1], "village"),
  ombre: t("Terres de l'Ombre", "Shadow Lands", [2,1,1,1], "ombre"),
  montagne: t("Col de montagne", "Mountain Pass", [3,0,1,1], "montagne"),
  tour: t("Tour du sorcier", "Wizard's Tower", [2,0,1,2], "tour"),
  port: t("Port", "Harbour", [0,0,2,1], "port"),
  muraille: t("Muraille", "Walls", [2,1,1,1], "muraille"),
  // Campaign terrains: same trait as their base terrain, own threshold.
  amon_sul: t("Amon Sûl", "Weathertop", [2,0,1,2], "ruines", { art: 'ruines' }),
  bruinen: t("Gué de la Bruinen", "Ford of Bruinen", [1,1,1,2], "gue", { art: 'gue' }),
  moria: t("Mines de la Moria", "Mines of Moria", [3,0,1,2], "montagne"),
  khazad: t("Pont de Khazad-dûm", "Bridge of Khazad-dûm", [2,0,1,2], "riviere", { art: 'riviere' }),
  amon_hen: t("Amon Hen", "Amon Hen", [2,0,2,1], "foret", { art: 'foret' }),
  rauros: t("Chutes du Rauros", "Falls of Rauros", [2,1,1,1], "riviere", { art: 'riviere' }),
  isen: t("Gués de l'Isen", "Fords of Isen", [2,2,1,1], "gue", { art: 'gue' }),
  gouffre: t("Gouffre de Helm", "Helm's Deep", [3,0,2,1], "forteresse"),
  fort_le_cor: t("Fort-le-Cor", "The Hornburg", [2,1,1,1], "muraille", { art: 'muraille' }),
  orthanc: t("Orthanc", "Orthanc", [2,0,1,2], "tour", { art: 'tour' }),
  fangorn: t("Forêt de Fangorn", "Fangorn Forest", [3,0,1,1], "foret", { art: 'foret' }),
  ithilien: t("Ithilien", "Ithilien", [1,1,2,1], "foret", { art: 'foret' }),
  osgiliath: t("Osgiliath", "Osgiliath", [3,0,1,1], "ruines", { art: 'ruines' }),
  pelargir: t("Pelargir", "Pelargir", [0,0,3,1], "port", { art: 'port' }),
  minas_tirith: t("Minas Tirith", "Minas Tirith", [2,0,1,2], "muraille"),
  pelennor: t("Champs du Pelennor", "Pelennor Fields", [2,1,1,1], "plaine", { art: 'plaine' }),
  dale: t("Dale", "Dale", [2,0,1,1], "village", { art: 'village' }),
  erebor: t("Erebor", "Erebor", [3,0,1,1], "forteresse", { art: 'forteresse' }),
  carrefour: t("Croisée des Chemins", "The Cross-roads", [2,1,1,1], "plaine", { art: 'plaine' }),
  morannon: t("Morannon", "The Black Gate", [3,1,1,1], "ombre"),
  dagorlad: t("Dagorlad", "Dagorlad", [2,1,1,1], "plaine", { art: 'plaine' }),
};
// Quick battle draws 3 of these (the first three are the default battle).
PACKS.terre_milieu.quick = ['plaine', 'gue', 'foret', 'forteresse', 'riviere', 'marais', 'ruines', 'village', 'ombre', 'montagne', 'tour', 'port', 'muraille'];
}
if (typeof module !== 'undefined') module.exports = PACKS.terre_milieu;
