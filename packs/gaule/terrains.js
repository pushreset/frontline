'use strict';
// Gallic Wars 58–51 BC — terrains. Plain data plus hooks (functions receiving `g`, the engine helper: see README).
(globalThis.PACKS = globalThis.PACKS || {}).gaule = globalThis.PACKS.gaule || {};
{ // block: in the browser every <script> shares one global scope, keep helpers local
// Traits = how a terrain plays (hooks), shared by the terrains that name them in `trait`:
//   modify(g, unit, t, v) · fieldAura · slotDelta · downValue · drawBonus · hub · fog · blocksMove · immune · tags
//   onTurnStart(g, t)  at the start of each turn of side g.p, while the terrain is open
PACKS.gaule.traits = {
  plaine: {},
  // Ford: horsemen are worth 1 Cavalry less and cannot move in or out.
  gue: { modify: (g, u, t, v) => { if (g.type(u) === 'Cavalerie' && v[1]) v[1]--; }, blocksMove: (g, u) => g.type(u) === 'Cavalerie' },
  foret: { fog: true },
  oppidum: { tags: ['highGround'], slotDelta: -1 },
  // Fortified camp: once captured, your infantry gets +1 on the other terrains.
  camp: { fieldAura: (g, u, t, v) => { if (g.type(u) === 'Legion' && g.trait(t) !== 'camp' && g.terrains().some((X, i) => g.trait(i) === 'camp' && X.captured === u.owner)) v[0]++; } },
  murus: { downValue: [2, 0, 0, 0] },
  riviere: { hub: true },
  // Marsh fever: at the start of your turn, your unit with the most Infantry here loses 1.
  marais: { onTurnStart: (g, t) => {
    const us = g.allies(t).filter(u => !u.down && g.vals(u, t)[0] > 0);
    if (us.length) g.malus(us.reduce((a, b) => g.vals(b, t)[0] > g.vals(a, t)[0] ? b : a).id);
  } },
  // Coast: a fight between ships, Infantry and Cavalry units count for nothing (only missiles and engineers fight).
  cote: { modify: (g, u, t, v) => { const ty = g.type(u); if (ty === 'Legion' || ty === 'Cavalerie') v.fill(0); } },
  village: { drawBonus: 1 },
  lignes: { immune: true },
};
const T = {
  plaine: { fr: "Terrain découvert.", en: "Open ground." },
  gue: { fr: "Gué : chaque unité de Cavalerie vaut 1 Cavalerie de moins ici et ne peut ni entrer ni sortir par déplacement.", en: "Ford: each Cavalry unit is worth 1 Cavalry less here and cannot move in or out." },
  foret: { fr: "Forêt : toute unité posée ici l'est face cachée mais garde ses valeurs. Pouvoirs inactifs.", en: "Forest: units played here are face down but keep their values. Powers inactive." },
  oppidum: { fr: "Oppidum : 3 emplacements.", en: "Oppidum: 3 slots." },
  camp: { fr: "Camp : une fois capturé, tes unités d'Infanterie gagnent +1 Infanterie sur les autres terrains.", en: "Camp: once captured, your Infantry units get +1 Infantry on the other terrains." },
  murus: { fr: "Murus gallicus : les cartes face cachée valent 2 en Infanterie.", en: "Murus gallicus: face-down cards are worth 2 Infantry." },
  riviere: { fr: "Rivière : adjacente aux deux autres terrains.", en: "River: adjacent to both other terrains." },
  marais: { fr: "Fièvre des marais : au début de ton tour, ton unité la plus forte en Infanterie ici perd 1 Infanterie.", en: "Marsh fever: at the start of your turn, your unit with the most Infantry here loses 1 Infantry." },
  cote: { fr: "Côte : bataille navale, les unités d'Infanterie et de Cavalerie ne valent rien ici.", en: "Coast: a sea fight, Infantry and Cavalry units are worth nothing here." },
  village: { fr: "Village : une fois capturé, tu pioches 1 carte de plus par tour.", en: "Village: once captured, you draw 1 extra card per turn." },
  lignes: { fr: "Lignes de siège : aucune unité ici ne peut être détruite.", en: "Siege lines: no unit here can be destroyed." },
};
const t = (fr, en, thr, trait, more = {}) => ({ name: { fr, en }, thr, trait, text: T[trait], ...more });
// Terrains: name, threshold [Infantry, Cavalry, Missile, Engineering], trait (+ art borrowed from another terrain).
PACKS.gaule.terrains = {
  plaine: t("Plaine", "Plain", [2,2,1,1], "plaine"),
  gue: t("Gué", "Ford", [3,1,1,1], "gue"),
  foret: t("Forêt", "Forest", [3,1,0,1], "foret"),
  oppidum: t("Oppidum", "Oppidum", [2,0,1,2], "oppidum"),
  camp: t("Camp retranché", "Fortified Camp", [2,1,1,1], "camp"),
  murus: t("Murus gallicus", "Murus Gallicus", [2,0,1,2], "murus"),
  riviere: t("Rivière", "River", [2,1,1,1], "riviere"),
  marais: t("Marais", "Marsh", [2,0,1,1], "marais"),
  cote: t("Côte", "Coast", [0,0,3,2], "cote"),
  village: t("Village", "Village", [2,1,0,1], "village"),
  lignes: t("Lignes de siège", "Siege Lines", [2,1,1,2], "lignes"),
  // Campaign variants: same trait as their base terrain, own threshold.
  bibracte: t("Colline de Bibracte", "Bibracte Hill", [3,0,1,2], "oppidum", { art: 'oppidum' }),
  alsace: t("Plaine d'Alsace", "Alsace Plain", [2,0,1,1], "plaine", { art: 'plaine' }),
  sambre: t("Rives de la Sambre", "Banks of the Sambre", [2,1,1,2], "riviere", { art: 'riviere' }),
  morbihan: t("Golfe du Morbihan", "Gulf of Morbihan", [0,0,4,2], "cote"),
  kent: t("Plage du Kent", "Kent Beach", [3,1,1,1], "gue"),
  tamise: t("Gué de la Tamise", "Thames Ford", [3,1,1,1], "gue", { art: 'gue' }),
  aduatuca: t("Oppidum des Aduatuques", "Aduatuci Oppidum", [2,0,1,1], "murus", { art: 'murus' }),
  pont_rhin: t("Pont sur le Rhin", "Rhine Bridge", [2,0,1,1], "riviere"),
  atuatuca: t("Camp d'Atuatuca", "Atuatuca Camp", [2,1,1,1], "camp", { art: 'camp' }),
  avaricum: t("Avaricum", "Avaricum", [2,0,1,2], "murus"),
  gergovie: t("Plateau de Gergovie", "Gergovia Plateau", [2,1,1,2], "oppidum"),
  lutece: t("Marais de Lutèce", "Lutetia Marshes", [2,0,0,1], "marais", { art: 'marais' }),
  alesia: t("Alésia", "Alesia", [2,1,1,2], "lignes"),
  mont_rea: t("Camp du mont Réa", "Mont Réa Camp", [3,1,1,2], "camp", { art: 'camp' }),
  laumes: t("Plaine des Laumes", "Plain of Les Laumes", [2,3,1,1], "plaine", { art: 'plaine' }),
  uxellodunum: t("Falaises d'Uxellodunum", "Cliffs of Uxellodunum", [2,1,1,2], "oppidum"),
};
// Quick battle draws 3 of these (the first three are the default battle).
PACKS.gaule.quick = ['plaine', 'gue', 'foret', 'oppidum', 'camp', 'murus', 'riviere', 'marais', 'cote', 'village', 'lignes'];
}
if (typeof module !== 'undefined') module.exports = PACKS.gaule;
