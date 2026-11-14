'use strict';
// Pacific 1942–1945 — campaign battles. In 1942 you hold the line (Wake or the Coral Sea, Midway, Henderson Field).
// From November 1943 two roads lead to Japan: Nimitz's island hopping across the Central Pacific (Tarawa, Kwajalein,
// Saipan) or MacArthur's march along New Guinea to the Philippines (Bougainville, Hollandia, Peleliu, Leyte).
// They meet at Iwo Jima, then Okinawa. The great naval battles of 1944 are Japanese counter-attacks: you defend.
(globalThis.PACKS = globalThis.PACKS || {}).pacifique = globalThis.PACKS.pacifique || {};
{ // block: in the browser every <script> shares one global scope, keep helpers local
// Each battle: id, name, date, day (days since 7 December 1941), pos [longitude, latitude] (east of Greenwich, past 180°
// for Midway), next, pool (4 terrains, 3 drawn), brief, first (0 the player, 1 the AI, absent = coin toss),
// defend (the player keeps the ground at nightfall), aiCards (extra cards in the AI's deck: Japan's carriers in 1942,
// the kamikazes from Leyte on).
const B = (id, name, date, day, pos, next, pool, brief, first, defend, aiCards) => ({ id, name, date, day, pos, next, pool, brief, first, defend, aiCards });
const US = 0, JP = 1, HOLD = true, K = n => Array(n).fill('kamikaze');
PACKS.pacifique.battles = [
  B("wake", { fr: "Île de Wake", en: "Wake Island" }, { fr: "23 décembre 1941", en: "23 December 1941" }, 16, [166.6,19.3], ["midway"],
    ["wake","atoll","haute_mer","piste"],
    { fr: "Seize jours après Pearl Harbor, quatre cents Marines et quatre Wildcat tiennent encore l'atoll. La flotte d'invasion revient, plus forte.", en: "Sixteen days after Pearl Harbor, four hundred Marines and four Wildcats still hold the atoll. The invasion fleet is back, stronger." }, JP, HOLD, ['marines', 'cuirasse']),
  B("mer_corail", { fr: "Mer de Corail", en: "Coral Sea" }, { fr: "7 mai 1942", en: "7 May 1942" }, 151, [155,-14], ["midway"],
    ["mer_corail","haute_mer","lagon","port"],
    { fr: "Première bataille entre porte-avions : les flottes ne se voient jamais. Il faut arrêter l'invasion de Port Moresby.", en: "The first battle between carriers: the fleets never see each other. The invasion of Port Moresby must be stopped." }, JP, HOLD, ['porte_avions']),
  B("midway", { fr: "Midway", en: "Midway" }, { fr: "4 juin 1942", en: "4 June 1942" }, 179, [182.6,28.2], ["guadalcanal"],
    ["mer_midway","midway","haute_mer","atoll"],
    { fr: "Les codes japonais sont percés : quatre porte-avions foncent vers l'atoll. Tenir Midway et trouver la flotte avant qu'elle ne vous trouve.", en: "The Japanese codes are broken: four carriers are heading for the atoll. Hold Midway and find their fleet before it finds you." }, JP, HOLD, ['porte_avions', 'hellcat']),
  B("guadalcanal", { fr: "Guadalcanal", en: "Guadalcanal" }, { fr: "7 août 1942", en: "7 August 1942" }, 243, [158.6,-10.6], ["henderson"],
    ["lunga","jungle","lagon","piste"],
    { fr: "Première offensive américaine : les Marines débarquent pour prendre la piste que les Japonais construisent dans la jungle.", en: "The first American offensive: the Marines land to seize the airstrip the Japanese are building in the jungle." }, US),
  B("henderson", { fr: "Henderson Field", en: "Henderson Field" }, { fr: "24 octobre 1942", en: "24 October 1942" }, 321, [163.6,-6.6], ["tarawa","bougainville"],
    ["henderson","bloody_ridge","jungle","marecage"],
    { fr: "Pilonnée la nuit par le Tokyo Express, rongée par le paludisme, la « Cactus Air Force » doit garder sa piste face à l'offensive d'octobre.", en: "Shelled every night by the Tokyo Express, worn down by malaria, the \"Cactus Air Force\" must keep its airstrip against the October offensive." }, JP, HOLD),
  // Nimitz: the Central Pacific.
  B("tarawa", { fr: "Tarawa", en: "Tarawa" }, { fr: "20 novembre 1943", en: "20 November 1943" }, 713, [173,1.4], ["kwajalein"],
    ["betio","blockhaus","lagon","atoll"],
    { fr: "La marée est trop basse : les péniches s'échouent sur le récif à 500 mètres de la plage. Les Marines avancent dans l'eau sous le feu des blockhaus.", en: "The tide is too low: the landing craft run aground on the reef 500 yards out. The Marines wade in under fire from the pillboxes." }, US),
  B("kwajalein", { fr: "Kwajalein", en: "Kwajalein" }, { fr: "31 janvier 1944", en: "31 January 1944" }, 785, [167.7,9], ["saipan"],
    ["kwajalein","lagon","blockhaus","recif"],
    { fr: "Les leçons de Tarawa sont apprises : bombardement massif, amphibies en tête. Le plus grand atoll du monde doit tomber en une semaine.", en: "The lessons of Tarawa are learnt: massive bombardment, amtracs first. The world's largest atoll must fall in a week." }, US),
  B("saipan", { fr: "Saipan", en: "Saipan" }, { fr: "15 juin 1944", en: "15 June 1944" }, 921, [145.8,15.2], ["mer_philippines","guam"],
    ["saipan","tapotchau","grottes","piste"],
    { fr: "Les Mariannes mettent Tokyo à portée des B-29. Trente mille défenseurs attendent dans les falaises et les grottes.", en: "The Marianas put Tokyo within reach of the B-29s. Thirty thousand defenders wait in the cliffs and caves." }, US),
  B("mer_philippines", { fr: "Mer des Philippines", en: "Philippine Sea" }, { fr: "19 juin 1944", en: "19 June 1944" }, 925, [137.5,17.5], ["iwo_jima"],
    ["mer_philippines","haute_mer","piste","atoll"],
    { fr: "La flotte japonaise lance tout ce qui vole contre la tête de pont de Saipan. Les pilotes de Hellcat parleront d'un « tir aux pigeons ».", en: "The Japanese fleet throws everything that flies at the Saipan beachhead. The Hellcat pilots will call it a \"turkey shoot\"." }, JP, HOLD, ['porte_avions', 'hellcat']),
  B("guam", { fr: "Guam", en: "Guam" }, { fr: "21 juillet 1944", en: "21 July 1944" }, 957, [142.6,10.4], ["iwo_jima"],
    ["guam","jungle","grottes","port"],
    { fr: "Reprendre la première terre américaine perdue en 1941. Au-delà des plages, la jungle et les grottes du nord.", en: "Retake the first American soil lost in 1941. Beyond the beaches, the jungle and the caves of the north." }, US),
  // MacArthur: the South-West Pacific.
  B("bougainville", { fr: "Bougainville", en: "Bougainville" }, { fr: "1er novembre 1943", en: "1 November 1943" }, 694, [155.2,-6.2], ["hollandia"],
    ["bougainville","jungle","piste","lagon"],
    { fr: "Débarquer dans la mangrove, loin des défenses, et bâtir une piste pour isoler Rabaul sans l'attaquer.", en: "Land in the mangroves, far from the defences, and build an airstrip to cut off Rabaul without attacking it." }, US),
  B("hollandia", { fr: "Hollandia", en: "Hollandia" }, { fr: "22 avril 1944", en: "22 April 1944" }, 867, [140.7,-2.5], ["peleliu"],
    ["hollandia","jungle","piste","marecage"],
    { fr: "Un bond de mille kilomètres le long de la Nouvelle-Guinée : MacArthur saute par-dessus les garnisons et prend le port par surprise.", en: "A six-hundred-mile leap along New Guinea: MacArthur jumps over the garrisons and takes the harbour by surprise." }, US),
  B("peleliu", { fr: "Peleliu", en: "Peleliu" }, { fr: "15 septembre 1944", en: "15 September 1944" }, 1013, [134.3,7], ["leyte","golfe_leyte"],
    ["umurbrogol","recif","piste","lagon"],
    { fr: "« Trois jours, peut-être quatre », promet le général. Mais les défenseurs ont changé de tactique : ils attendent dans les grottes de l'Umurbrogol.", en: "\"Three days, maybe four,\" the general promises. But the defenders have changed tactics: they wait in the caves of the Umurbrogol." }, US),
  B("leyte", { fr: "Leyte", en: "Leyte" }, { fr: "20 octobre 1944", en: "20 October 1944" }, 1048, [124.2,12.4], ["iwo_jima"],
    ["leyte","jungle","port","marecage"],
    { fr: "« Je suis revenu » : MacArthur débarque aux Philippines. Au-dessus de la flotte apparaissent les premiers avions-suicides.", en: "\"I have returned\": MacArthur lands in the Philippines. Over the fleet, the first suicide planes appear." }, US, false, K(1)),
  B("golfe_leyte", { fr: "Golfe de Leyte", en: "Leyte Gulf" }, { fr: "25 octobre 1944", en: "25 October 1944" }, 1053, [128.8,7.8], ["iwo_jima"],
    ["surigao","haute_mer","lagon","port"],
    { fr: "La plus grande bataille navale de l'histoire. Toute la flotte japonaise converge sur les transports de Leyte : destroyers contre cuirassés.", en: "The largest naval battle in history. The whole Japanese fleet converges on the Leyte transports: destroyers against battleships." }, JP, HOLD, K(2)),
  // Both roads meet.
  B("iwo_jima", { fr: "Iwo Jima", en: "Iwo Jima" }, { fr: "19 février 1945", en: "19 February 1945" }, 1170, [141.3,24.8], ["okinawa"],
    ["suribachi","sable_noir","grottes","blockhaus"],
    { fr: "Huit kilomètres de cendre volcanique et vingt mille défenseurs sous terre. Le drapeau doit flotter sur le Suribachi.", en: "Five miles of volcanic ash and twenty thousand defenders underground. The flag must fly over Suribachi." }, US, false, K(1)),
  B("okinawa", { fr: "Okinawa", en: "Okinawa" }, { fr: "1er avril 1945", en: "1 April 1945" }, 1211, [127.8,26.3], [],
    ["shuri","piquets","recif","port"],
    { fr: "Dernière marche avant le Japon. À terre, la ligne Shuri ; en mer, les destroyers des piquets radar sous des vagues de kamikazes.", en: "The last step before Japan. Ashore, the Shuri Line; at sea, the radar-picket destroyers under waves of kamikazes." }, US, false, K(3)),
];
}
if (typeof module !== 'undefined') module.exports = PACKS.pacifique;
