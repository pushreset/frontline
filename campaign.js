'use strict';
// Normandy campaign, June-August 1944: a DAG of 23 battles from the three D-Day beaches to Paris.
// A campaign is a run: winning a battle commits you to it, the battles you can launch next are its
// `next` (the sibling branches are gone for good). No game over: a lost battle can be replayed, or
// swapped for another open one. Three corridors with their own terrain character:
// west (marshes, dense bocage: infantry), centre (villages, hills), east (Caen plain: tanks, aircraft).
// Shared by index.html (global CAMPAIGN) and sim.cjs (require).
const CAMPAIGN = (() => {
  // day = days since 6 June 1944, only used to check that every path moves forward in time.
  // pos = [longitude, latitude], nudged where real places would overlap on the map.
  const B = (id, name, date, day, pos, next, pool, brief) => ({ id, name, date, day, pos, next, pool, brief });
  const BATTLES = [
    // ---- Jour J
    B('utah', 'Utah Beach', '6 juin 1944', 0, [-1.32, 49.5], ['sainte_mere', 'pointe_hoc'],
      ['plage', 'marais', 'chaussee', 'wn62'],
      "La plage la plus à l'ouest. Le courant a déporté les barges, mais derrière les dunes, les marais inondés ne laissent passer que quelques chaussées."),
    B('omaha', 'Omaha Beach', '6 juin 1944', 0, [-0.78, 49.37], ['pointe_hoc', 'bayeux'],
      ['omaha_dog', 'omaha_easy', 'wn62', 'plage'],
      "Jour J. Les barges touchent le sable sous le feu des points d'appui. Prends pied sur la plage la plus meurtrière du débarquement."),
    B('sword', 'Sword Beach', '6 juin 1944', 0, [-0.3, 49.37], ['bayeux', 'pegasus'],
      ['plage', 'wn62', 'pont_mine', 'village'],
      "À l'est, les Britanniques débarquent devant Ouistreham. Les commandos de Lord Lovat filent vers les ponts tenus par les parachutistes."),
    // ---- Tête de pont
    B('sainte_mere', 'Sainte-Mère-Église', '6 juin 1944', 0, [-1.55, 49.4], ['carentan'],
      ['sainte_mere', 'marais', 'bocage', 'carrefour'],
      'Les parachutistes ont sauté de nuit, dispersés dans les marais. Tiens le carrefour de la N13 avant la contre-attaque.'),
    B('pointe_hoc', 'Pointe du Hoc', '6 juin 1944', 0, [-0.99, 49.43], ['carentan', 'villers_bocage'],
      ['pointe_hoc', 'wn62', 'colline', 'plage'],
      "Les Rangers escaladent 30 mètres de falaise sous les grenades pour faire taire les canons qui menacent les deux plages."),
    B('bayeux', 'Bayeux', '7 juin 1944', 1, [-0.66, 49.23], ['villers_bocage', 'epsom'],
      ['village', 'carrefour', 'bocage', 'colline'],
      "Première ville libérée, presque intacte. Ses routes mènent au bocage vers le sud et à Caen vers l'est : choisis ta direction."),
    B('pegasus', 'Pegasus Bridge', '6 juin 1944', 0, [-0.06, 49.26], ['epsom', 'caen'],
      ['pegasus', 'pont_mine', 'village', 'marais'],
      "Les planeurs se posent à quelques mètres du pont de Bénouville. Prends les ponts intacts sur l'Orne et le canal."),
    // ---- Juin
    B('carentan', 'Carentan', '12 juin 1944', 6, [-1.26, 49.25], ['cherbourg', 'saint_lo'],
      ['chaussee', 'marais', 'village', 'bocage_dense'],
      'La jonction entre Utah et Omaha passe par Carentan. Une seule chaussée traverse les marais inondés.'),
    B('villers_bocage', 'Villers-Bocage', '13 juin 1944', 7, [-0.98, 49.13], ['saint_lo', 'cote_112'],
      ['village', 'bocage_dense', 'chemin_creux', 'carrefour'],
      "Une colonne blindée britannique entre dans le bourg… et tombe dans l'embuscade d'un Tigre. Ici, les chars sont des proies."),
    B('epsom', "Epsom – l'Odon", '26 juin 1944', 20, [-0.55, 49.05], ['cote_112', 'caen'],
      ['pont_mine', 'bocage_dense', 'colline', 'foret'],
      "Les Écossais franchissent l'Odon dans la pluie et la boue. Il faut tenir les ponts et les bois face aux Panzer SS."),
    B('caen', 'Caen', '8 juillet 1944', 32, [-0.33, 49.16], ['goodwood'],
      ['caen', 'carpiquet', 'aerodrome', 'carrefour'],
      "Caen devait tomber le premier jour. Un mois plus tard, la ville n'est que ruines et l'aérodrome de Carpiquet tient toujours."),
    // ---- Juillet
    B('cherbourg', 'Cherbourg', '26 juin 1944', 20, [-1.62, 49.62], ['cobra'],
      ['port_cherbourg', 'fort_roule', 'colline', 'village'],
      'Il faut un port en eau profonde. Le Fort du Roule domine la rade : prends-le avant que les quais ne sautent.'),
    B('saint_lo', 'Saint-Lô', '18 juillet 1944', 42, [-1.12, 49.0], ['cobra'],
      ['saint_lo', 'bocage_dense', 'chemin_creux', 'colline'],
      'Le bocage avance haie par haie. Saint-Lô, capitale des ruines, ouvre la route du sud.'),
    B('cote_112', 'Cote 112', '10 juillet 1944', 34, [-0.58, 48.95], ['cobra', 'goodwood'],
      ['cote_112', 'colline', 'bocage', 'cerisy'],
      "« Qui tient la Cote 112 tient la Normandie. » Une colline nue, labourée par les obus, que les deux camps se reprennent sans cesse."),
    B('goodwood', 'Opération Goodwood', '18 juillet 1944', 42, [-0.08, 49.09], ['totalize'],
      ['carrefour', 'cote_112', 'aerodrome', 'colline'],
      "Trois divisions blindées s'élancent dans la plaine au sud de Caen. Terrain ouvert, idéal pour les chars… et pour les canons de 88."),
    // ---- Fin juillet
    B('cobra', 'Opération Cobra', '25 juillet 1944', 49, [-1.38, 48.88], ['avranches', 'mortain'],
      ['carrefour', 'bocage', 'chemin_creux', 'cerisy'],
      'Après le tapis de bombes, les blindés foncent par les carrefours. Perce le front, la Bretagne et la Loire sont au bout.'),
    B('totalize', 'Opération Totalize', '8 août 1944', 63, [-0.18, 48.97], ['falaise', 'chambois'],
      ['foret', 'carrefour', 'pont', 'cote_112'],
      "Attaque de nuit : les Canadiens et les Polonais avancent en colonnes guidées par des projecteurs et des balles traçantes."),
    // ---- Août
    B('avranches', 'Avranches', '31 juillet 1944', 55, [-1.5, 48.7], ['seine'],
      ['pont', 'chaussee', 'carrefour', 'village'],
      "Le verrou de la Bretagne. Tout passe par le pont de Pontaubault : l'armée de Patton s'engouffre dans la brèche."),
    B('mortain', 'Mortain', '7 août 1944', 62, [-0.94, 48.65], ['falaise', 'seine'],
      ['colline', 'cerisy', 'carrefour', 'village'],
      'Les Panzer contre-attaquent vers Avranches. Un bataillon encerclé tient la colline 317.'),
    B('falaise', 'Poche de Falaise', '16 août 1944', 71, [-0.3, 48.82], ['chambois'],
      ['carrefour', 'village', 'bocage', 'marais'],
      'Deux armées allemandes refluent par un couloir de quelques kilomètres. Resserre la tenaille.'),
    B('chambois', 'Chambois – Mont-Ormel', '20 août 1944', 75, [0.15, 48.76], ['seine'],
      ['mont_ormel', 'carrefour', 'village', 'colline'],
      "Les Polonais tiennent le Mont-Ormel, encerclés, face à toute une armée qui veut sortir de la poche. Ferme la nasse."),
    B('seine', 'Passage de la Seine', '25 août 1944', 80, [1.48, 49.09], ['paris'],
      ['pont_vernon', 'pont_mine', 'village', 'colline'],
      'Les ponts sont coupés. À Vernon, il faut traverser le fleuve sous le feu et lancer un pont de fortune.'),
    B('paris', 'Libération de Paris', '25 août 1944', 80, [2.35, 48.86], [],
      ['paris', 'pont', 'carrefour', 'village'],
      "La Résistance s'est soulevée. La 2e DB entre dans Paris : prends l'Hôtel de Ville et les ponts de la Seine."),
  ];
  const byId = Object.fromEntries(BATTLES.map(b => [b.id, b]));
  const roots = BATTLES.filter(b => !BATTLES.some(x => x.next.includes(b.id))).map(b => b.id);
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const draw = b => shuffle(b.pool.slice()).slice(0, 3);

  // ---- run: rewards re-rolled each campaign, choices final on victory -------------------------
  const VETS = ['sherman', 'section', 'spitfire', 'p47', 'rangers', 'mortiers'];
  const CARDS = ['jumbo', 'typhoon', 'commandos', 'ambulance'];
  const POWERS = ['naval', 'renforts', 'renseignement', 'barrage', 'couverture'];
  // Rewards are rolled when a battle becomes visible (open), never earlier: the fog of war hides nothing
  // that exists yet. 30 % veteran, 25 % new card, 25 % power, 20 % nothing. A new card or a power already
  // owned, or on offer at the same time, is not offered again (a veteran replaces it).
  function pick(run, taken) {
    const r = Math.random(), vet = { t: 'vet', key: VETS[Math.floor(Math.random() * VETS.length)] };
    const left = (t, all) => all.filter(k => !taken.some(x => x.t === t && x.key === k));
    const one = a => a[Math.floor(Math.random() * a.length)];
    if (r < 0.3) return vet;
    if (r < 0.55) { const a = left('card', CARDS); return a.length ? { t: 'card', key: one(a) } : vet; }
    if (r < 0.8) { const a = left('power', POWERS); return a.length ? { t: 'power', key: one(a) } : vet; }
    return { t: 'none' };
  }
  function reveal(run) {
    const owned = [...run.cards.map(c => ({ t: c.vet ? 'vet' : 'card', key: c.key })), ...run.powers.map(key => ({ t: 'power', key }))];
    for (const id of open(run.path)) if (byId[id].next.length && !run.rewards[id]) {
      const offered = open(run.path).map(x => run.rewards[x]).filter(Boolean);
      run.rewards[id] = pick(run, [...owned, ...offered]);
    }
    return run;
  }
  const newRun = () => reveal({ rewards: {}, path: [], cards: [], powers: [] });
  // What a reward adds to the run (to the deck or to the powers).
  function gain(run, id) {
    const r = run.rewards[id];
    if (!r) return;
    if (r.t === 'vet') run.cards.push({ key: r.key, vet: true });
    else if (r.t === 'card') run.cards.push({ key: r.key });
    else if (r.t === 'power') run.powers.push(r.key);
  }
  // Victory in a campaign battle: commit to it, collect its reward, reveal what lies just ahead.
  function win(run, id) {
    if (run.path.includes(id)) return null;
    run.path.push(id); gain(run, id); reveal(run);
    return run.rewards[id] || null;
  }
  const open = path => path.length ? byId[path[path.length - 1]].next : roots;
  // won (on the path) · open (launchable now) · fog (reachable later) · gone (branch abandoned).
  function status(id, path) {
    if (path.includes(id)) return 'won';
    const now = open(path);
    if (now.includes(id)) return 'open';
    const seen = new Set(now), todo = [...now];
    while (todo.length) for (const n of byId[todo.pop()].next) if (!seen.has(n)) { seen.add(n); todo.push(n); }
    return seen.has(id) ? 'fog' : 'gone';
  }

  // Map frame shared with art.px.js map_normandie (320x140 px): lon -2.0..2.5, lat 49.8..48.5.
  const project = ([lon, lat]) => [(lon + 2) / 4.5, (49.8 - lat) / 1.3];
  return { BATTLES, byId, roots, draw, newRun, win, open, status, project, VETS, CARDS, POWERS };
})();
if (typeof module !== 'undefined') module.exports = CAMPAIGN;
