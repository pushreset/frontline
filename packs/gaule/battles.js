'use strict';
// Gallic Wars 58–51 BC — campaign battles. In 58–57 Caesar stops the Helvetii, throws Ariovistus back over the Rhine
// and survives the Nervii's surprise attack on the Sambre. Then two roads: the Ocean (the Veneti's fleet, the two
// landings in Britain) or the Rhine (the Aduatuci, the bridge, the camp at Atuatuca). In 52 all Gaul rises behind
// Vercingetorix: Avaricum, Gergovia or Lutetia, Alesia. Uxellodunum, in 51, is the last stronghold.
(globalThis.PACKS = globalThis.PACKS || {}).gaule = globalThis.PACKS.gaule || {};
{ // block: in the browser every <script> shares one global scope, keep helpers local
// Each battle: id, name, date, day (days since 1 March 58 BC), pos [longitude, latitude] (nudged a little where labels
// would overlap in central Gaul and Belgium), next, pool (4 terrains,
// 3 drawn), brief, first (0 the player, 1 the AI, absent = coin toss), defend (the player keeps the ground at
// nightfall), aiCards (extra cards in the AI's deck: Vercingetorix in 52, the war chariots in Britain).
const B = (id, name, date, day, pos, next, pool, brief, first, defend, aiCards) => ({ id, name, date, day, pos, next, pool, brief, first, defend, aiCards });
const ROME = 0, GAULS = 1, HOLD = true, V = ['vercingetorix'];
PACKS.gaule.battles = [
  B("bibracte", { fr: "Bibracte", en: "Bibracte" }, { fr: "juin 58 av. J.-C.", en: "June 58 BC" }, 115, [4.0,46.6], ["vosges"],
    ["bibracte","plaine","camp","village"],
    { fr: "Les Helvètes ont brûlé leurs villages pour migrer vers l'ouest. César a rangé ses légions à flanc de colline : ils attaquent.", en: "The Helvetii have burnt their villages to move west. Caesar has drawn up his legions on a hillside: they attack." }, GAULS, HOLD),
  B("vosges", { fr: "Vosges", en: "Vosges" }, { fr: "septembre 58 av. J.-C.", en: "September 58 BC" }, 190, [7.4,48.1], ["sambre"],
    ["alsace","foret","riviere","camp"],
    { fr: "Arioviste et ses Suèves occupent la plaine d'Alsace. Les devins leur interdisent de combattre avant la nouvelle lune : attaquer maintenant.", en: "Ariovistus and his Suebi hold the Alsace plain. Their seers forbid battle before the new moon: attack now." }, ROME),
  B("sambre", { fr: "Sambre", en: "Sambre" }, { fr: "juillet 57 av. J.-C.", en: "July 57 BC" }, 495, [3.0,50.0], ["venetes","aduatuques"],
    ["sambre","foret","camp","gue"],
    { fr: "Les Nerviens jaillissent de la forêt pendant que les légions montent le camp. César saisit un bouclier et court en première ligne.", en: "The Nervii burst out of the forest while the legions pitch camp. Caesar grabs a shield and runs to the front line." }, GAULS, HOLD),
  // The Ocean road.
  B("venetes", { fr: "Vénètes", en: "Veneti" }, { fr: "été 56 av. J.-C.", en: "Summer 56 BC" }, 880, [-2.9,47.5], ["bretagne"],
    ["morbihan","cote","oppidum","village"],
    { fr: "Leurs navires de chêne aux voiles de cuir sont trop hauts pour l'éperon. Des faux au bout de perches couperont leurs cordages.", en: "Their oak ships with leather sails stand too high for the ram. Sickles on long poles will cut their rigging." }, ROME, false, ['sagittaires', 'sagittaires', 'frondeurs']),
  B("bretagne", { fr: "Bretagne", en: "Britain" }, { fr: "août 55 av. J.-C.", en: "August 55 BC" }, 1273, [1.3,51.1], ["tamise"],
    ["kent","cote","foret","plaine"],
    { fr: "Les navires touchent le fond loin de la plage. L'aquilifère de la Xe saute le premier dans l'eau : « Sautez, soldats, si vous ne voulez pas livrer l'aigle ! »", en: "The ships ground far from the beach. The Tenth's eagle-bearer leaps first into the water: \"Jump, soldiers, unless you want to betray the eagle!\"" }, ROME, false, ['char_guerre', 'char_guerre']),
  B("tamise", { fr: "Tamise", en: "Thames" }, { fr: "juillet 54 av. J.-C.", en: "July 54 BC" }, 1600, [-0.6,51.5], ["avaricum"],
    ["tamise","foret","oppidum","marais"],
    { fr: "Cassivellaunos a planté des pieux aiguisés dans le seul gué. Ses chars harcèlent les colonnes dans la forêt.", en: "Cassivellaunus has driven sharpened stakes into the only ford. His chariots harry the columns in the forest." }, ROME, false, ['char_guerre']),
  // The Rhine road.
  B("aduatuques", { fr: "Aduatuques", en: "Aduatuci" }, { fr: "septembre 57 av. J.-C.", en: "September 57 BC" }, 555, [4.8,50.2], ["rhin"],
    ["aduatuca","murus","camp","riviere"],
    { fr: "Retranchés dans leur oppidum, les Aduatuques se moquent de la tour de siège : « Comment des hommes si petits la porteront-ils ? »", en: "Dug into their oppidum, the Aduatuci laugh at the siege tower: \"How will such small men ever move it?\"" }, ROME, false, ['legionnaire']),
  B("rhin", { fr: "Rhin", en: "Rhine" }, { fr: "juin 55 av. J.-C.", en: "June 55 BC" }, 1195, [7.6,50.4], ["atuatuca"],
    ["pont_rhin","foret","plaine","camp"],
    { fr: "Dix jours pour jeter un pont de bois sur le Rhin. Les Sugambres attendent dans leurs forêts de l'autre rive.", en: "Ten days to throw a timber bridge across the Rhine. The Sugambri wait in their forests on the far bank." }, ROME),
  B("atuatuca", { fr: "Atuatuca", en: "Atuatuca" }, { fr: "automne 53 av. J.-C.", en: "Autumn 53 BC" }, 2025, [6.0,51.2], ["avaricum"],
    ["atuatuca","foret","village","marais"],
    { fr: "Quintus Cicéron garde les bagages au camp où quinze cohortes ont péri l'an passé. Deux mille cavaliers sugambres surgissent.", en: "Quintus Cicero guards the baggage at the camp where fifteen cohorts died last year. Two thousand Sugambri horsemen appear." }, GAULS, HOLD),
  // 52: the great revolt.
  B("avaricum", { fr: "Avaricum", en: "Avaricum" }, { fr: "avril 52 av. J.-C.", en: "April 52 BC" }, 2250, [2.4,47.1], ["gergovie","lutece"],
    ["avaricum","marais","village","camp"],
    { fr: "Vercingétorix brûle tout autour, mais les Bituriges l'ont supplié d'épargner leur plus belle ville. Une rampe monte vers le murus gallicus.", en: "Vercingetorix burns everything around, but the Bituriges begged him to spare their finest town. A ramp climbs towards the murus gallicus." }, ROME, false, V),
  B("gergovie", { fr: "Gergovie", en: "Gergovia" }, { fr: "juin 52 av. J.-C.", en: "June 52 BC" }, 2290, [2.9,45.6], ["alesia"],
    ["gergovie","murus","camp","foret"],
    { fr: "Le plateau des Arvernes, une seule pente praticable. Les légions vont trop loin : la retraite ne sonne pas assez tôt.", en: "The plateau of the Arverni, a single climbable slope. The legions push too far: the retreat sounds too late." }, ROME, false, [...V, 'soldurii']),
  B("lutece", { fr: "Lutèce", en: "Lutetia" }, { fr: "juin 52 av. J.-C.", en: "June 52 BC" }, 2295, [2.3,48.75], ["alesia"],
    ["lutece","riviere","foret","plaine"],
    { fr: "Labienus et quatre légions face au vieux Camulogène, retranché derrière les marais de la Seine. Il faut traverser de nuit.", en: "Labienus and four legions against old Camulogenus, dug in behind the Seine marshes. The river must be crossed by night." }, ROME),
  B("alesia", { fr: "Alésia", en: "Alesia" }, { fr: "septembre 52 av. J.-C.", en: "September 52 BC" }, 2400, [4.8,48.0], ["uxellodunum"],
    ["alesia","lignes","mont_rea","laumes"],
    { fr: "Vercingétorix enfermé dans l'oppidum, l'armée de secours de toute la Gaule dehors. Entre les deux, les légions tiennent leurs deux lignes de siège.", en: "Vercingetorix shut in the oppidum, the relief army of all Gaul outside. Between them, the legions hold their two siege lines." }, GAULS, HOLD),
  B("uxellodunum", { fr: "Uxellodunum", en: "Uxellodunum" }, { fr: "été 51 av. J.-C.", en: "Summer 51 BC" }, 2705, [1.6,44.9], [],
    ["uxellodunum","riviere","murus","foret"],
    { fr: "Le dernier oppidum rebelle domine la Dordogne. Les sapeurs creusent vers la source qui l'abreuve.", en: "The last rebel oppidum looms over the Dordogne. The sappers dig towards the spring that keeps it alive." }, ROME, false, ['soldurii']),
];
}
if (typeof module !== 'undefined') module.exports = PACKS.gaule;
