'use strict';
// Normandy campaign, June-August 1944: a DAG of battles from Omaha to Paris.
// No game over: a lost battle is replayed (new draw from the same pool). Winning a battle
// unlocks every battle in `next`; branches not taken stay playable.
// Shared by index.html (global CAMPAIGN) and sim.cjs (require).
const CAMPAIGN = (() => {
  // pos = [longitude, latitude], nudged where real places would overlap on the map.
  const B = (id, name, date, pos, next, pool, brief) => ({ id, name, date, pos, next, pool, brief });
  const BATTLES = [
    B('omaha', 'Omaha Beach', '6 juin 1944', [-0.87, 49.31], ['sainte_mere', 'pegasus'],
      ['omaha_dog', 'omaha_easy', 'pointe_hoc', 'wn62'],
      "Jour J. Les barges touchent le sable sous le feu des points d'appui. Prends pied sur la plage, les Rangers grimpent la falaise."),
    B('sainte_mere', 'Sainte-Mère-Église', '6 juin 1944', [-1.45, 49.48], ['carentan'],
      ['sainte_mere', 'marais', 'bocage', 'carrefour'],
      'Les parachutistes ont sauté de nuit, dispersés dans les marais. Tiens le carrefour de la N13 avant la contre-attaque.'),
    B('pegasus', 'Pegasus Bridge', '6 juin 1944', [-0.12, 49.32], ['caen'],
      ['pegasus', 'pont_mine', 'village', 'marais'],
      "Les planeurs se posent à quelques mètres du pont de Bénouville. Prends les ponts intacts sur l'Orne et le canal."),
    B('carentan', 'Carentan', '12 juin 1944', [-1.18, 49.24], ['cherbourg', 'saint_lo'],
      ['chaussee', 'marais', 'village', 'bocage_dense'],
      'La jonction entre Utah et Omaha passe par Carentan. Une seule chaussée traverse les marais inondés.'),
    B('caen', 'Caen', 'juillet 1944', [-0.42, 49.13], ['cobra'],
      ['caen', 'carpiquet', 'cote_112', 'village'],
      "Caen devait tomber le premier jour. Un mois plus tard, la ville n'est que ruines, l'aérodrome de Carpiquet et la Cote 112 tiennent toujours."),
    B('cherbourg', 'Cherbourg', '26 juin 1944', [-1.62, 49.62], ['cobra'],
      ['port_cherbourg', 'fort_roule', 'colline', 'village'],
      'Il faut un port en eau profonde. Le Fort du Roule domine la rade : prends-le avant que les quais ne sautent.'),
    B('saint_lo', 'Saint-Lô', '18 juillet 1944', [-1.0, 49.08], ['cobra'],
      ['saint_lo', 'bocage_dense', 'chemin_creux', 'colline'],
      'Le bocage avance haie par haie. Saint-Lô, capitale des ruines, ouvre la route du sud.'),
    B('cobra', 'Opération Cobra', '25 juillet 1944', [-1.38, 48.92], ['mortain', 'falaise'],
      ['carrefour', 'bocage', 'chemin_creux', 'cerisy'],
      'Après le tapis de bombes, les blindés foncent par les carrefours. Perce le front, la Bretagne et la Loire sont au bout.'),
    B('mortain', 'Mortain', '7 août 1944', [-0.94, 48.65], ['seine'],
      ['colline', 'cerisy', 'carrefour', 'village'],
      'Les Panzer contre-attaquent vers Avranches. Un bataillon encerclé tient la colline 317.'),
    B('falaise', 'Poche de Falaise', '19 août 1944', [-0.12, 48.86], ['seine'],
      ['mont_ormel', 'carrefour', 'village', 'bocage'],
      "Deux armées allemandes fuient par un couloir de quelques kilomètres. Les Polonais tiennent le Mont-Ormel : ferme la poche."),
    B('seine', 'Passage de la Seine', '25 août 1944', [1.48, 49.09], ['paris'],
      ['pont_vernon', 'pont_mine', 'village', 'colline'],
      'Les ponts sont coupés. À Vernon, il faut traverser le fleuve sous le feu et lancer un pont de fortune.'),
    B('paris', 'Libération de Paris', '25 août 1944', [2.35, 48.86], [],
      ['paris', 'pont', 'carrefour', 'village'],
      "La Résistance s'est soulevée. La 2e DB entre dans Paris : prends l'Hôtel de Ville et les ponts de la Seine."),
  ];
  const byId = Object.fromEntries(BATTLES.map(b => [b.id, b]));
  const unlocked = (id, won) => id === 'omaha' || BATTLES.some(b => b.next.includes(id) && won.includes(b.id));
  const draw = b => b.pool.slice().sort(() => Math.random() - 0.5).slice(0, 3); // ponytail: biased shuffle, fine for 4-5 items
  // Map frame shared with art.px.js map_normandie (320x140 px): lon -2.0..2.5, lat 49.8..48.5.
  const project = ([lon, lat]) => [(lon + 2) / 4.5, (49.8 - lat) / 1.3];
  return { BATTLES, byId, unlocked, draw, project };
})();
if (typeof module !== 'undefined') module.exports = CAMPAIGN;
