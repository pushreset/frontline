'use strict';
// Verdun 1916 — campaign battles. One long battle in one sector, from the German offensive (21 February) to the
// French counter-offensives of the autumn. Until July you defend: the enemy has the initiative, and at nightfall
// without a majority, you hold your ground and win (defend). From October you attack.
(globalThis.PACKS = globalThis.PACKS || {}).verdun = globalThis.PACKS.verdun || {};
{ // block: in the browser every <script> shares one global scope, keep helpers local
// Each battle: id, name, date, day (days since 21 February 1916), pos [longitude, latitude], next, pool (4 terrains,
// 3 drawn), brief, first (0 the player, 1 the AI, absent = coin toss), defend (the player keeps the ground at nightfall).
const B = (id, name, date, day, pos, next, pool, brief, first, defend) => ({ id, name, date, day, pos, next, pool, brief, first, defend });
const FR = 0, DE = 1, HOLD = true;
PACKS.verdun.battles = [
  B("bois_caures", { fr: "Bois des Caures", en: "Bois des Caures" }, { fr: "21 février 1916", en: "21 February 1916" }, 0, [5.395,49.268], ["samogneux","cote_poivre"],
    ["bois_caures","tranchee","crateres","no_mans_land"],
    { fr: "7 h 15 : un million d'obus s'abattent sur le front. Dans le bois pulvérisé, les chasseurs du colonel Driant doivent tenir deux jours face à tout un corps d'armée.", en: "7:15 am: a million shells fall on the front. In the pulverised wood, Colonel Driant's chasseurs must hold for two days against a whole army corps." }, DE, HOLD),
  B("herbebois", { fr: "Bois d'Herbebois", en: "Herbebois Wood" }, { fr: "22 février 1916", en: "22 February 1916" }, 1, [5.475,49.262], ["cote_poivre","village_douaumont"],
    ["herbebois","tranchee","barbeles","crateres"],
    { fr: "À l'est du front, la 51e division se cramponne aux lisières du bois. Chaque heure gagnée laisse aux renforts le temps d'arriver.", en: "On the eastern flank, the 51st Division clings to the edge of the wood. Every hour gained lets reinforcements come up." }, DE, HOLD),
  B("samogneux", { fr: "Samogneux", en: "Samogneux" }, { fr: "24 février 1916", en: "24 February 1916" }, 3, [5.34,49.252], ["mort_homme"],
    ["samogneux","tranchee","no_mans_land","cote"],
    { fr: "Le village tient le bord de la Meuse. Encerclé, pilonné par erreur par sa propre artillerie, il doit tenir jusqu'à la nuit.", en: "The village holds the bank of the Meuse. Surrounded, shelled by mistake by its own artillery, it must hold until nightfall." }, DE, HOLD),
  B("cote_poivre", { fr: "Côte du Poivre", en: "Pepper Hill" }, { fr: "25 février 1916", en: "25 February 1916" }, 4, [5.375,49.232], ["mort_homme","village_douaumont"],
    ["cote_poivre","tranchee","barbeles","ravin_mort"],
    { fr: "Le fort de Douaumont vient de tomber presque sans combat. La dernière crête avant Verdun doit tenir : Pétain prend le commandement.", en: "Fort Douaumont has just fallen almost without a fight. The last ridge before Verdun must hold: Pétain takes command." }, DE, HOLD),
  B("village_douaumont", { fr: "Village de Douaumont", en: "Douaumont Village" }, { fr: "2 mars 1916", en: "2 March 1916" }, 10, [5.418,49.228], ["vaux","fort_vaux"],
    ["village_douaumont","fort_douaumont","ravin_mort","crateres"],
    { fr: "Au pied du fort perdu, le 33e RI défend les ruines maison par maison. Le capitaine de Gaulle y est blessé et fait prisonnier.", en: "Below the lost fort, the 33rd Infantry defends the ruins house by house. Captain de Gaulle is wounded and taken prisoner there." }, DE, HOLD),
  B("mort_homme", { fr: "Le Mort-Homme", en: "Le Mort-Homme" }, { fr: "6 mars 1916", en: "6 March 1916" }, 14, [5.268,49.245], ["cote_304"],
    ["mort_homme","no_mans_land","tranchee","boyau"],
    { fr: "L'offensive passe sur la rive gauche. Sur cette colline au nom sinistre, chaque mètre change de main dix fois.", en: "The offensive moves to the left bank. On this hill with its grim name, every yard changes hands ten times." }, DE, HOLD),
  B("vaux", { fr: "Village de Vaux", en: "Vaux Village" }, { fr: "9 mars 1916", en: "9 March 1916" }, 17, [5.495,49.21], ["fort_vaux"],
    ["vaux","ravin_mort","barbeles","tranchee"],
    { fr: "Le village au pied du fort de Vaux est pris et repris treize fois en un mois. Il n'en reste que des pierres.", en: "The village below Fort Vaux is taken and retaken thirteen times in a month. Nothing is left but stones." }, DE, HOLD),
  B("cote_304", { fr: "Cote 304", en: "Hill 304" }, { fr: "3 mai 1916", en: "3 May 1916" }, 72, [5.225,49.222], ["fleury"],
    ["cote_304","crateres","no_mans_land","depot"],
    { fr: "Cinq cents canons écrasent la colline jumelle du Mort-Homme. Le sommet perd plusieurs mètres de hauteur sous les obus.", en: "Five hundred guns pound the twin of Le Mort-Homme. The summit loses several metres of height under the shells." }, DE, HOLD),
  B("fort_vaux", { fr: "Fort de Vaux", en: "Fort Vaux" }, { fr: "2 juin 1916", en: "2 June 1916" }, 102, [5.468,49.197], ["thiaumont","fleury"],
    ["fort_vaux","crateres","tranchee","boyau"],
    { fr: "Le commandant Raynal et ses hommes se battent dans les couloirs du fort, sans eau. Le dernier pigeon, le Vaillant, emporte leur appel au secours.", en: "Major Raynal and his men fight in the fort's tunnels, without water. The last pigeon, Le Vaillant, carries their call for help." }, DE, HOLD),
  B("thiaumont", { fr: "Ouvrage de Thiaumont", en: "Thiaumont Redoubt" }, { fr: "23 juin 1916", en: "23 June 1916" }, 123, [5.432,49.207], ["souville"],
    ["thiaumont","crateres","ravin_mort","ruines"],
    { fr: "Les obus au phosgène noient les batteries françaises. Le petit ouvrage change de mains seize fois.", en: "Phosgene shells smother the French batteries. The small redoubt changes hands sixteen times." }, DE, HOLD),
  B("fleury", { fr: "Fleury-devant-Douaumont", en: "Fleury-devant-Douaumont" }, { fr: "23 juin 1916", en: "23 June 1916" }, 123, [5.4,49.195], ["souville"],
    ["fleury","depot","crateres","barbeles"],
    { fr: "Le village rayé de la carte est la dernière marche avant la ville. Il sera « mort pour la France ».", en: "The village wiped off the map is the last step before the town. It will be declared \"died for France\"." }, DE, HOLD),
  B("souville", { fr: "Fort de Souville", en: "Fort Souville" }, { fr: "11 juillet 1916", en: "11 July 1916" }, 141, [5.432,49.18], ["reprise_douaumont","haudromont"],
    ["fort_souville","fleury","crateres","ravin_mort"],
    { fr: "Le dernier assaut allemand atteint les superstructures du fort. Au-delà, Verdun est à portée de vue : ils ne passeront pas.", en: "The last German assault reaches the top of the fort. Beyond it, Verdun is in sight: they shall not pass." }, DE, HOLD),
  B("reprise_douaumont", { fr: "Reprise de Douaumont", en: "Douaumont Retaken" }, { fr: "24 octobre 1916", en: "24 October 1916" }, 246, [5.448,49.218], ["louvemont"],
    ["fort_douaumont","depot","crateres","boyau"],
    { fr: "Le canon de 400 a percé le fort. Dans le brouillard, le RICM et les tirailleurs suivent le barrage roulant jusqu'au sommet.", en: "The 400 mm gun has pierced the fort. In the fog, the Moroccan Colonial Infantry and the tirailleurs follow the creeping barrage to the top." }, FR),
  B("haudromont", { fr: "Carrières d'Haudromont", en: "Haudromont Quarries" }, { fr: "24 octobre 1916", en: "24 October 1916" }, 246, [5.385,49.214], ["louvemont"],
    ["haudromont","ravin_mort","tranchee","cote"],
    { fr: "À l'ouest du fort, la division Mangin nettoie les carrières et les abris creusés dans la roche.", en: "West of the fort, Mangin's division clears the quarries and the dugouts cut into the rock." }, FR),
  B("louvemont", { fr: "Louvemont – Bezonvaux", en: "Louvemont – Bezonvaux" }, { fr: "15 décembre 1916", en: "15 December 1916" }, 298, [5.42,49.25], [],
    ["louvemont","cote_poivre","crateres","barbeles"],
    { fr: "Dernière offensive de l'année : reprendre la Côte du Poivre et les villages perdus en février. Après dix mois, rendre Verdun hors d'atteinte.", en: "The year's last offensive: retake Pepper Hill and the villages lost in February. After ten months, put Verdun out of reach." }, FR),
];
}
if (typeof module !== 'undefined') module.exports = PACKS.verdun;
