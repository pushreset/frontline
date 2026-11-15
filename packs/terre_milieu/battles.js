'use strict';
// War of the Ring — campaign battles. In 3018 the Nazgûl hunt the Ring-bearer to Weathertop and the Ford of Bruinen;
// in January 3019 the Fellowship crosses Moria, and at Amon Hen it breaks. Then two roads: Rohan (the Fords of Isen,
// Helm's Deep, Isengard) or Gondor (Ithilien, Osgiliath, Pelargir). Both meet on the Pelennor Fields. After the siege,
// the North holds at Dale or the host marches to the Cross-roads, and everything is staked before the Black Gate.
(globalThis.PACKS = globalThis.PACKS || {}).terre_milieu = globalThis.PACKS.terre_milieu || {};
{ // block: in the browser every <script> shares one global scope, keep helpers local
// Each battle: id, name, date, day (days since 1 January 3018), pos [x, y] in map units (see pack.js; nudged where
// labels would overlap in Rohan and Gondor), next, pool (4 terrains, 3 drawn), brief, first (0 the player, 1 the AI,
// absent = coin toss), defend (the player keeps the ground at nightfall), aiCards (extra cards in the AI's deck).
const B = (id, name, date, day, pos, next, pool, brief, first, defend, aiCards) => ({ id, name, date, day, pos, next, pool, brief, first, defend, aiCards });
const FREE = 0, SHADOW = 1, HOLD = true;
PACKS.terre_milieu.battles = [
  B("amon_sul", { fr: "Amon Sûl", en: "Weathertop" }, { fr: "6 octobre 3018", en: "6 October 3018" }, 278, [21,12], ["bruinen"],
    ["amon_sul","plaine","foret","montagne"],
    { fr: "Un petit feu dans le cercle de pierres de la vieille tour de guet. Cinq ombres montent la colline au clair de lune.", en: "A small fire inside the stone ring of the old watchtower. Five shadows climb the hill in the moonlight." }, SHADOW, HOLD, ['nazgul', 'nazgul']),
  B("bruinen", { fr: "Bruinen", en: "Bruinen" }, { fr: "20 octobre 3018", en: "20 October 3018" }, 292, [31,11], ["moria"],
    ["bruinen","foret","riviere","montagne"],
    { fr: "Le Porteur a passé le gué, les Neuf entrent dans l'eau derrière lui. Elrond commande à la rivière : qu'elle se lève.", en: "The Ring-bearer has crossed the ford, the Nine ride into the water behind him. Elrond commands the river: let it rise." }, FREE, false, ['nazgul']),
  B("moria", { fr: "Moria", en: "Moria" }, { fr: "15 janvier 3019", en: "15 January 3019" }, 379, [33,19], ["amon_hen"],
    ["moria","khazad","ruines","montagne"],
    { fr: "Des tambours dans les profondeurs. Les orques et un troll des cavernes enfoncent la porte de la chambre de Mazarbul. Derrière eux vient une ombre de flamme.", en: "Drums in the deep. Orcs and a cave troll batter at the door of the Chamber of Mazarbul. Behind them comes a shadow of flame." }, SHADOW, HOLD, ['trolls', 'balrog']),
  B("amon_hen", { fr: "Amon Hen", en: "Amon Hen" }, { fr: "26 février 3019", en: "26 February 3019" }, 421, [45,27], ["gues_isen","ithilien"],
    ["amon_hen","rauros","foret","riviere"],
    { fr: "Les Uruk-hai à la Main Blanche surgissent des bois au-dessus du Rauros. Le cor de Boromir sonne. La Communauté se brise ici.", en: "The Uruk-hai of the White Hand burst from the woods above Rauros. Boromir's horn sounds. The Fellowship breaks here." }, undefined, false, ['capitaine']),
  // The Rohan road.
  B("gues_isen", { fr: "Gués de l'Isen", en: "Fords of Isen" }, { fr: "2 mars 3019", en: "2 March 3019" }, 425, [28,32.5], ["gouffre"],
    ["isen","plaine","riviere","village"],
    { fr: "Les hommes d'Erkenbrand tiennent l'îlot au milieu des gués. Toute l'armée d'Isengard descend sur eux à la nuit tombante, wargs en tête.", en: "Erkenbrand's men hold the islet in the middle of the fords. All of Isengard's host comes down on them at nightfall, wargs in front." }, SHADOW, HOLD),
  B("gouffre", { fr: "Gouffre de Helm", en: "Helm's Deep" }, { fr: "3 mars 3019", en: "3 March 3019" }, 426, [37,30], ["isengard"],
    ["gouffre","fort_le_cor","montagne","plaine"],
    { fr: "Dix mille Uruk-hai sous la pluie devant le mur du Gouffre. Saroumane leur a donné un feu qui fait sauter la pierre. Tenir jusqu'à l'aube.", en: "Ten thousand Uruk-hai in the rain before the Deeping Wall. Saruman has given them a fire that blasts stone. Hold until dawn." }, SHADOW, HOLD, ['feu_orthanc', 'capitaine']),
  B("isengard", { fr: "Isengard", en: "Isengard" }, { fr: "5 mars 3019", en: "5 March 3019" }, 428, [32.5,26], ["pelennor"],
    ["orthanc","fangorn","riviere","plaine"],
    { fr: "Les Ents ont brisé les digues et noyé le cercle d'Isengard. Saroumane s'est enfermé dans Orthanc avec ce qui lui reste. Il faut le faire taire.", en: "The Ents have broken the dams and drowned the Ring of Isengard. Saruman has shut himself in Orthanc with what he has left. He must be silenced." }),
  // The Gondor road.
  B("ithilien", { fr: "Ithilien", en: "Ithilien" }, { fr: "7 mars 3019", en: "7 March 3019" }, 430, [57,30], ["osgiliath"],
    ["ithilien","foret","riviere","plaine"],
    { fr: "Les rôdeurs de Faramir guettent la route du sud sous les fougères. Une colonne d'Haradrim monte vers le Morannon, un mûmak en tête.", en: "Faramir's rangers watch the southern road from the ferns. A column of Haradrim marches towards the Morannon, a mûmak in front." }, FREE, false, ['mumak']),
  B("osgiliath", { fr: "Osgiliath", en: "Osgiliath" }, { fr: "12 mars 3019", en: "12 March 3019" }, 435, [55,36.5], ["pelargir"],
    ["osgiliath","riviere","plaine","ithilien"],
    { fr: "L'armée de Minas Morgul passe l'Anduin sur des radeaux. Faramir défend les ruines de la vieille capitale aussi longtemps qu'il le peut.", en: "The host of Minas Morgul crosses the Anduin on rafts. Faramir holds the ruins of the old capital as long as he can." }, SHADOW, HOLD, ['nazgul']),
  B("pelargir", { fr: "Pelargir", en: "Pelargir" }, { fr: "13 mars 3019", en: "13 March 3019" }, 436, [53,42.5], ["pelennor"],
    ["pelargir","foret","village","riviere"],
    { fr: "Les noirs navires des corsaires d'Umbar mouillent devant Pelargir. Aragorn arrive par les chemins des Morts : il faut prendre la flotte.", en: "The black ships of the Corsairs of Umbar lie off Pelargir. Aragorn comes by the Paths of the Dead: the fleet must be taken." }, FREE),
  // Both roads meet.
  B("pelennor", { fr: "Pelennor", en: "Pelennor" }, { fr: "15 mars 3019", en: "15 March 3019" }, 438, [49,39.5], ["dale","carrefour"],
    ["minas_tirith","pelennor","ruines","plaine"],
    { fr: "La Grande Porte a cédé sous Grond. Le Roi-Sorcier entre à cheval. Au loin, dans l'aube grise, on entend les cors du Rohan.", en: "The Great Gate has given way to Grond. The Witch-king rides in. Far off, in the grey dawn, the horns of Rohan are heard." }, SHADOW, HOLD, ['roi_sorcier']),
  // After the siege.
  B("dale", { fr: "Dale", en: "Dale" }, { fr: "17 mars 3019", en: "17 March 3019" }, 440, [50,5], ["morannon"],
    ["dale","erebor","village","plaine"],
    { fr: "Pendant ce temps au nord, les Orientaux passent la Rivière Courante. Le roi Brand et le roi Dáin tiennent devant la porte d'Erebor.", en: "Meanwhile in the North, the Easterlings cross the Running River. King Brand and King Dáin stand before the gate of Erebor." }, SHADOW, HOLD, ['trolls']),
  B("carrefour", { fr: "Croisée des Chemins", en: "Cross-roads" }, { fr: "22 mars 3019", en: "22 March 3019" }, 445, [61.5,33], ["morannon"],
    ["carrefour","ithilien","foret","ombre"],
    { fr: "Les Capitaines de l'Ouest marchent sur le Mordor. Au carrefour, la statue du vieux roi a retrouvé sa tête ; Minas Morgul garde la vallée.", en: "The Captains of the West march on Mordor. At the cross-roads the old king's statue has its head again; Minas Morgul guards the valley." }),
  B("morannon", { fr: "Morannon", en: "Black Gate" }, { fr: "25 mars 3019", en: "25 March 3019" }, 448, [59,25], [],
    ["morannon","dagorlad","ombre","plaine"],
    { fr: "Sept mille hommes devant la Porte Noire, pour attirer l'Œil loin de la Montagne du Destin. Il ne faut pas vaincre : il faut tenir assez longtemps.", en: "Seven thousand men before the Black Gate, to draw the Eye away from Mount Doom. Victory is not the aim: holding long enough is." }, SHADOW, HOLD, ['nazgul', 'nazgul', 'trolls', 'trolls', 'mumak']),
];
}
if (typeof module !== 'undefined') module.exports = PACKS.terre_milieu;
