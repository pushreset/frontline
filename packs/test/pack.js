'use strict';
// Test campaign — "Guerre des Gaules" in miniature. Not shown in the game (hidden): the simulator plays it
// to prove the engine knows nothing about Normandy. It uses other attribute names and mechanics Normandy
// does not have (pushing an enemy back, conditional immunity, a ford, a bonus every turn), and borrows the
// Normandy pictures through `art` keys. A whole campaign can live in one file like this one.
(globalThis.PACKS = globalThis.PACKS || {}).test = {
  id: 'test', hidden: true,
  title: { fr: 'Test – Guerre des Gaules', en: 'Test – Gallic Wars' },
  sub: { fr: 'Gaule · 52 av. J.-C.', en: 'Gaul · 52 BC' },
  dates: { fr: '52 av. J.-C.', en: '52 BC' },
  finale: { fr: 'Alésia est tombée', en: 'Alesia has fallen' },
  attrs: { fr: ['Cavalerie', 'Infanterie', 'Tir', 'Stratégie'], en: ['Cavalry', 'Infantry', 'Missile', 'Strategy'] },
  icons: ['char', 'inf', 'air', 'strat'],
  types: {
    Cavalier: { fr: 'Cavalier', en: 'Horseman', main: 0, sound: 'boots' },
    Fantassin: { fr: 'Fantassin', en: 'Footman', main: 1, sound: 'boots' },
    Archer: { fr: 'Archer', en: 'Archer', main: 2, sound: 'boots' },
    Chef: { fr: 'Chef', en: 'Leader', main: 3, sound: 'boots' },
    Ordre: { fr: 'Ordre', en: 'Order' },
  },
  malusAttr: 1,
  art: 'packs/normandie/out/', cover: 'colline',
  map: { image: 'map_normandie', lon: [-2.0, 2.5], lat: [49.8, 48.5] },

  cards: {
    equites: {
      name: { fr: 'Equites', en: 'Equites' }, enemy: { fr: 'Cavaliers éduens', en: 'Aedui Riders' }, art: 'sherman',
      type: 'Cavalier', v: [3, 0, 0, 1],
      text: { fr: 'Charge : à la pose, repousse une unité adverse de ce terrain vers un terrain voisin.', en: 'Charge: on deploy, push an enemy unit from this terrain to a neighbouring one.' },
      // New mechanic: moves an ENEMY unit (Normandy only ever moves your own).
      targets: (g, t) => {
        const out = [];
        for (const e of g.foes(t)) for (const to of g.live()) if (g.canMove(e, t, to)) out.push({ args: { u: e.id, t2: to }, steps: [g.U(e.id), g.T(to)] });
        return out;
      },
      onPlay: (g, me, m) => { if (m.u != null) g.move(m.u, m.t2); },
    },
    legionnaire: {
      name: { fr: 'Légionnaire', en: 'Legionary' }, enemy: { fr: 'Guerrier arverne', en: 'Arverni Warrior' }, art: 'section',
      type: 'Fantassin', v: [0, 3, 0, 1],
      text: { fr: "Tortue : indestructible tant qu'un autre Fantassin allié face visible est sur ce terrain.", en: 'Testudo: cannot be destroyed while another face-up friendly Footman stands on this terrain.' },
      // New mechanic: conditional immunity.
      immune: (g, u) => { const f = g.find(u.id); return !!f && g.side(f.t, f.p).some(x => x !== u && !x.down && g.type(x) === 'Fantassin'); },
    },
    sagittarii: {
      name: { fr: 'Sagittaires', en: 'Sagittarii' }, enemy: { fr: 'Frondeurs', en: 'Slingers' }, art: 'mortiers',
      type: 'Archer', v: [0, 0, 2, 0],
      text: { fr: 'À la pose : une unité adverse sur ce terrain perd 1 Infanterie.', en: 'On deploy: an enemy unit on this terrain loses 1 Infantry.' },
      targets: (g, t) => g.hit(g.foes(t).filter(e => !e.down)),
      onPlay: (g, me, m) => { if (m.u != null) g.malus(m.u); },
    },
    druide: {
      name: { fr: 'Augure', en: 'Augur' }, enemy: { fr: 'Druide', en: 'Druid' }, art: 'officier',
      type: 'Chef', v: [0, 1, 0, 2],
      text: { fr: 'Face visible : pioche 1 carte de plus au début de ton tour.', en: 'Face up: draw 1 extra card at the start of your turn.' },
      onTurnStart: (g, me) => { if (!me.down) g.draw(1); },
    },
    aquilifer: {
      name: { fr: 'Aquilifère', en: 'Aquilifer' }, enemy: { fr: 'Aquilifère', en: 'Aquilifer' }, art: 'observateur',
      type: 'Chef', v: [0, 1, 0, 3],
      text: { fr: 'Ton surplus sur ce terrain compte +3 en cas de contestation.', en: 'Your surplus on this terrain counts +3 in a contest.' },
      surplus: 3,
    },
    fleches: {
      name: { fr: 'Pluie de flèches', en: 'Arrow Storm' }, art: 'artillerie',
      type: 'Ordre', v: [0, 0, 0, 0],
      text: { fr: 'Détruit une unité adverse de valeur totale 2 ou moins.', en: 'Destroy an enemy unit worth 2 or less in total.' },
      targets: g => g.hits(g.theirs().filter(x => !g.safe(x.t) && !g.tough(x.u) && g.sum(g.vals(x.u, x.t)) <= 2)),
      onPlay: (g, me, m) => g.destroy(m.u),
    },
    ralliement: {
      name: { fr: 'Ralliement', en: 'Rally' }, art: 'recon',
      type: 'Ordre', v: [0, 0, 0, 0],
      text: { fr: 'Pioche 2 cartes.', en: 'Draw 2 cards.' },
      targets: () => [{ args: {}, steps: ['play'] }],
      onPlay: g => g.draw(2),
    },
  },
  decks: [
    ['equites', 'equites', 'equites', 'legionnaire', 'legionnaire', 'legionnaire', 'legionnaire', 'sagittarii', 'sagittarii', 'sagittarii', 'druide', 'druide', 'fleches', 'fleches', 'ralliement', 'ralliement'],
    ['equites', 'equites', 'equites', 'legionnaire', 'legionnaire', 'legionnaire', 'legionnaire', 'sagittarii', 'sagittarii', 'sagittarii', 'druide', 'druide', 'fleches', 'fleches', 'ralliement', 'ralliement'],
  ],
  powers: {
    renforts: {
      name: { fr: 'Renforts', en: 'Reinforcements' }, text: { fr: 'Pioche 2 cartes.', en: 'Draw 2 cards.' },
      targets: () => [{ args: {}, steps: [] }],
      onPlay: g => g.draw(2),
    },
  },
  rewards: { vets: ['equites', 'legionnaire'], cards: ['aquilifer'], powers: ['renforts'] },

  traits: {
    plaine: {},
    // New mechanic: a ford slows horsemen and holds them.
    gue: { modify: (g, u, t, v) => { if (g.type(u) === 'Cavalier') v[0] = Math.max(0, v[0] - 1); }, blocksMove: (g, u) => g.type(u) === 'Cavalier' },
    foret: { fog: true },
    hauteur: { tags: ['highGround'], slotDelta: -1 },
    // New mechanic: a captured camp makes your footmen stronger everywhere else.
    camp: { fieldAura: (g, u, t, v) => { if (g.type(u) === 'Fantassin' && g.trait(t) !== 'camp' && g.terrains().some((X, i) => g.trait(i) === 'camp' && X.captured === u.owner)) v[1]++; } },
  },
  terrains: {
    plaine: { name: { fr: 'Plaine', en: 'Plain' }, thr: [2, 2, 1, 1], trait: 'plaine', art: 'carrefour', text: { fr: 'Terrain découvert.', en: 'Open ground.' } },
    gue: { name: { fr: 'Gué', en: 'Ford' }, thr: [1, 3, 1, 1], trait: 'gue', art: 'marais', text: { fr: "Gué : chaque Cavalier vaut 1 de moins ici et ne peut ni entrer ni sortir par déplacement.", en: 'Ford: each Horseman is worth 1 less here and cannot move in or out.' } },
    foret: { name: { fr: 'Forêt des Carnutes', en: 'Carnutes Forest' }, thr: [1, 3, 0, 2], trait: 'foret', art: 'foret', text: { fr: 'Brouillard : les unités posées ici le sont face cachée mais gardent leurs valeurs.', en: 'Fog: units are played face down here but keep their values.' } },
    hauteur: { name: { fr: 'Hauteurs', en: 'Heights' }, thr: [1, 2, 1, 2], trait: 'hauteur', art: 'colline', text: { fr: 'Point haut : 3 emplacements.', en: 'High ground: 3 slots.' } },
    camp: { name: { fr: 'Camp retranché', en: 'Fortified Camp' }, thr: [1, 2, 1, 2], trait: 'camp', art: 'village', text: { fr: 'Une fois capturé, tes Fantassins valent +1 Infanterie ailleurs.', en: 'Once captured, your Footmen are worth +1 Infantry elsewhere.' } },
  },
  quick: ['plaine', 'gue', 'foret', 'hauteur', 'camp'],

  battles: [
    { id: 'bibracte', name: { fr: 'Bibracte', en: 'Bibracte' }, date: { fr: 'printemps', en: 'spring' }, day: 0, pos: [0, 49.2], next: ['avaricum', 'gergovie'],
      pool: ['plaine', 'gue', 'hauteur', 'camp'], brief: { fr: 'Premier engagement.', en: 'First engagement.' } },
    { id: 'avaricum', name: { fr: 'Avaricum', en: 'Avaricum' }, date: { fr: 'avril', en: 'April' }, day: 30, pos: [-0.5, 49], next: ['alesia'],
      pool: ['camp', 'plaine', 'foret', 'hauteur'], brief: { fr: 'Siège.', en: 'Siege.' } },
    { id: 'gergovie', name: { fr: 'Gergovie', en: 'Gergovia' }, date: { fr: 'juin', en: 'June' }, day: 90, pos: [0.5, 48.9], next: ['alesia'],
      pool: ['hauteur', 'foret', 'gue', 'plaine'], brief: { fr: 'Assaut des hauteurs.', en: 'Storming the heights.' } },
    { id: 'alesia', name: { fr: 'Alésia', en: 'Alesia' }, date: { fr: 'septembre', en: 'September' }, day: 180, pos: [1, 48.7], next: [],
      pool: ['camp', 'hauteur', 'plaine', 'gue'], brief: { fr: 'Double ligne de siège.', en: 'Double siege line.' } },
  ],
};
if (typeof module !== 'undefined') module.exports = globalThis.PACKS.test;
