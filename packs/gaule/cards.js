'use strict';
// Gallic Wars 58–51 BC — cards, decks, campaign powers and rewards. Plain data plus hooks (functions receiving `g`, the engine helper: see README).
// You are Caesar. Legions that lock shields, Germanic horsemen, archers and slingers, and the engineers who bridge
// the Rhine and ring Alesia with walls. The Gauls answer with sworn bodyguards, druids, war horns and scorched
// earth; Vercingetorix joins their deck in 52 and the British war chariots in Britain (see `aiCards` in battles.js).
// Values: [Infantry, Cavalry, Missile, Engineering].
(globalThis.PACKS = globalThis.PACKS || {}).gaule = globalThis.PACKS.gaule || {};
{ // block: in the browser every <script> shares one global scope, keep helpers local
const where = (g, u) => g.find(u.id);
const up = e => !e.down;
const foot = (g, u) => g.type(u) === 'Legion';
// A unit that an effect can destroy: face up, not indestructible, not on a terrain where nothing can be destroyed.
const killable = (g, e, t) => up(e) && !g.safe(t) && !g.tough(e);
// Move one of your units to an adjacent terrain (engineers, forced march).
const moveTargets = (g, t) => {
  const out = [];
  for (const x of g.mine()) for (const to of g.live())
    if (g.canMove(x.u, x.t, to) && (to !== t || g.count(t) + 1 < g.cap(t))) out.push({ args: { u: x.u.id, t2: to }, steps: [g.U(x.u.id), g.T(to)] });
  return out;
};
// Charge: push an enemy unit of this terrain to a neighbouring one (the test pack's prototype).
const pushTargets = (g, t) => {
  const out = [];
  for (const e of g.foes(t)) for (const to of g.live()) if (g.canMove(e, t, to)) out.push({ args: { u: e.id, t2: to }, steps: [g.U(e.id), g.T(to)] });
  return out;
};
const push = (g, me, m) => { if (m.u != null) g.move(m.u, m.t2); };
// Arrows and stones: an enemy unit here with Infantry left loses 1.
const shoot = (g, t) => g.hit(g.foes(t).filter(e => up(e) && g.vals(e, t)[0] > 0));
const wound = (g, me, m) => { if (m.u != null) g.malus(m.u); };
// Vercingetorix face up on a terrain: his side's other infantry there gets +1.
const chiefUp = (g, u, t) => g.side(t, u.owner).some(e => up(e) && e.key === 'vercingetorix' && e !== u);

PACKS.gaule.cards = {
  legionnaire: {
    name: { fr: "Légionnaires", en: "Legionaries" }, enemy: { fr: "Guerriers arvernes", en: "Arverni Warriors" },
    type: "Legion", v: [3,0,1,0],
    text: { fr: "Pilum et tortue : indestructible tant qu'une autre unité d'Infanterie alliée face visible est sur ce terrain.", en: "Pilum and testudo: cannot be destroyed while another face-up friendly Infantry unit stands on this terrain." },
    immune: (g, u) => { const f = where(g, u); return !!f && g.side(f.t, f.p).some(x => x !== u && up(x) && foot(g, x)); },
  },
  cavaliers: {
    name: { fr: "Cavaliers germains", en: "Germanic Horsemen" }, enemy: { fr: "Cavaliers éduens", en: "Aedui Horsemen" },
    type: "Cavalerie", v: [0,3,0,1],
    text: { fr: "Charge : à la pose, repousse une unité adverse de ce terrain vers un terrain voisin.", en: "Charge: on deploy, push an enemy unit from this terrain to a neighbouring one." },
    targets: pushTargets, onPlay: push,
  },
  sagittaires: {
    name: { fr: "Sagittaires crétois", en: "Cretan Archers" }, enemy: { fr: "Archers", en: "Archers" },
    type: "Tir", v: [0,0,2,0],
    text: { fr: "Volée : à la pose, une unité adverse sur ce terrain perd 1 Infanterie.", en: "Volley: on deploy, an enemy unit on this terrain loses 1 Infantry." },
    targets: shoot, onPlay: wound,
  },
  frondeurs: {
    name: { fr: "Frondeurs baléares", en: "Balearic Slingers" }, enemy: { fr: "Frondeurs", en: "Slingers" },
    type: "Tir", v: [0,0,1,1],
    text: { fr: "Balles de plomb : à la pose, détruit une carte face cachée adverse sur ce terrain.", en: "Lead shot: on deploy, destroy an enemy face-down card on this terrain." },
    targets: (g, t) => g.safe(t) ? [] : g.hit(g.foes(t).filter(e => e.down)),
    onPlay: (g, me, m) => { if (m.u != null) g.destroy(m.u); },
  },
  centurion: {
    name: { fr: "Centurion", en: "Centurion" }, enemy: { fr: "Chef de guerre", en: "War Chief" },
    type: "Legion", v: [2,0,0,1],
    text: { fr: "Primus pilus : ton surplus sur ce terrain compte +2 en cas de contestation.", en: "Primus pilus: your surplus on this terrain counts +2 in a contest." },
    surplus: 2,
  },
  fabri: {
    name: { fr: "Fabri", en: "Fabri" }, enemy: { fr: "Mineurs bituriges", en: "Bituriges Miners" },
    type: "Soutien", v: [1,0,0,2],
    text: { fr: "Génie : à la pose, déplace une de tes unités vers un terrain adjacent.", en: "Engineers: on deploy, move one of your units to an adjacent terrain." },
    targets: moveTargets,
    onPlay: (g, me, m) => { if (m.u != null) g.move(m.u, m.t2); },
  },
  convoi: {
    name: { fr: "Convoi de blé", en: "Grain Convoy" }, enemy: { fr: "Greniers", en: "Granaries" },
    type: "Soutien", v: [0,0,0,2],
    text: { fr: "À la pose : pioche 1 carte.", en: "On deploy: draw 1 card." },
    onPlay: g => g.draw(1),
  },
  // Rome only.
  scorpion: {
    name: { fr: "Scorpion", en: "Scorpion" }, enemy: { fr: "Scorpion", en: "Scorpion" },
    type: "Tir", v: [0,0,2,1],
    text: { fr: "Longue portée : à la pose, une unité adverse sur un terrain adjacent perd 1 Infanterie.", en: "Long range: on deploy, an enemy unit on an adjacent terrain loses 1 Infantry." },
    targets: (g, t) => g.hits(g.theirs().filter(x => g.adjacent(t, x.t) && up(x.u) && g.vals(x.u, x.t)[0] > 0)),
    onPlay: wound,
  },
  aquilifere: {
    name: { fr: "Aquilifère", en: "Aquilifer" }, enemy: { fr: "Porte-enseigne", en: "Standard-Bearer" },
    type: "Legion", v: [1,0,0,2],
    text: { fr: "L'aigle de la légion : ton surplus sur ce terrain compte +3 en cas de contestation.", en: "The legion's eagle: your surplus on this terrain counts +3 in a contest." },
    surplus: 3,
  },
  circonvallation: {
    name: { fr: "Circonvallation", en: "Circumvallation" }, enemy: { fr: "Retranchements", en: "Entrenchments" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Jusqu'à ton prochain tour, l'adversaire ne peut pas te prendre un terrain que tu tiens.", en: "Until your next turn, the enemy can't take a terrain you hold." },
    targets: g => g.smoked() ? [] : [{ args: {}, steps: ['play'] }],
    onPlay: g => g.smoke(),
  },
  // Gauls only.
  druide: {
    name: { fr: "Druide", en: "Druid" }, enemy: { fr: "Druide", en: "Druid" },
    type: "Soutien", v: [0,0,0,2],
    text: { fr: "Face visible : pioche 1 carte de plus au début de ton tour.", en: "Face up: draw 1 extra card at the start of your turn." },
    onTurnStart: (g, me) => { if (up(me)) g.draw(1); },
  },
  soldurii: {
    name: { fr: "Soldurii", en: "Soldurii" }, enemy: { fr: "Soldurii", en: "Soldurii" },
    type: "Legion", v: [3,0,0,0],
    text: { fr: "Liés par serment à leur chef : ne peuvent pas être détruits.", en: "Sworn to their chief: cannot be destroyed." },
    immune: true,
  },
  carnyx: {
    name: { fr: "Carnyx", en: "Carnyx" }, enemy: { fr: "Carnyx", en: "Carnyx" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Les trompes de guerre sonnent : retourne toutes tes cartes face cachée d'un terrain.", en: "The war horns sound: flip all your face-down cards on one terrain." },
    targets: g => g.live().filter(t => g.allies(t).some(u => u.down)).map(t => ({ args: { t }, steps: [g.T(t)] })),
    onPlay: (g, me, m) => [...g.allies(m.t)].forEach(u => { if (u.down) g.flip(u.id, null); }),
  },
  terre_brulee: {
    name: { fr: "Terre brûlée", en: "Scorched Earth" }, enemy: { fr: "Terre brûlée", en: "Scorched Earth" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "On brûle les fermes et les greniers : détruit une unité de Soutien adverse.", en: "Farms and granaries burn: destroy an enemy Support unit." },
    targets: g => g.hits(g.theirs().filter(x => killable(g, x.u, x.t) && g.type(x.u) === 'Soutien')),
    onPlay: (g, me, m) => g.destroy(m.u),
  },
  // Joins the AI's deck in some battles (aiCards).
  vercingetorix: {
    name: { fr: "Vercingétorix", en: "Vercingetorix" }, enemy: { fr: "Vercingétorix", en: "Vercingetorix" },
    type: "Legion", v: [1,1,0,1],
    text: { fr: "Roi des Arvernes : face visible, tes autres unités d'Infanterie sur ce terrain gagnent +1 Infanterie.", en: "King of the Arverni: face up, your other Infantry units on this terrain get +1 Infantry." },
    aura: (g, u, t, v) => { if (foot(g, u) && chiefUp(g, u, t)) v[0]++; },
  },
  char_guerre: {
    name: { fr: "Char de guerre", en: "War Chariot" }, enemy: { fr: "Char de guerre breton", en: "British War Chariot" },
    type: "Cavalerie", v: [0,2,1,0],
    text: { fr: "Essedarii : à la pose, une unité adverse sur ce terrain perd 1 Infanterie.", en: "Essedarii: on deploy, an enemy unit on this terrain loses 1 Infantry." },
    targets: shoot, onPlay: wound,
  },
  // Both sides.
  pluie_traits: {
    name: { fr: "Pluie de pila", en: "Pila Volley" }, enemy: { fr: "Pluie de javelots", en: "Javelin Storm" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Détruit une unité adverse de valeur totale 2 ou moins.", en: "Destroy an enemy unit worth 2 or less in total." },
    targets: g => g.hits(g.theirs().filter(x => killable(g, x.u, x.t) && g.sum(g.vals(x.u, x.t)) <= 2)),
    onPlay: (g, me, m) => g.destroy(m.u),
  },
  ravitaillement: {
    name: { fr: "Ravitaillement éduen", en: "Aedui Supplies" }, enemy: { fr: "Ravitaillement", en: "Supplies" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Pioche 2 cartes.", en: "Draw 2 cards." },
    targets: () => [{ args: {}, steps: ['play'] }],
    onPlay: g => g.draw(2),
  },
  marche_forcee: {
    name: { fr: "Marche forcée", en: "Forced March" }, enemy: { fr: "Marche forcée", en: "Forced March" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Déplace une de tes unités vers un terrain adjacent.", en: "Move one of your units to an adjacent terrain." },
    targets: g => moveTargets(g, -1),
    onPlay: (g, me, m) => g.move(m.u, m.t2),
  },
  espions: {
    name: { fr: "Éclaireurs", en: "Scouts" }, enemy: { fr: "Espions", en: "Spies" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Retourne une carte face cachée. Pioche 1.", en: "Flip a face-down card. Draw 1." },
    targets: g => g.hits([...g.mine(), ...g.theirs()].filter(x => x.u.down)),
    onPlay: (g, me, m) => { g.flip(m.u, null); g.draw(1); },
  },
  // Campaign rewards (player only).
  decima: {
    name: { fr: "Dixième légion", en: "Tenth Legion" }, enemy: { fr: "Vétérans", en: "Veterans" },
    type: "Legion", v: [4,0,0,1],
  },
  tour: {
    name: { fr: "Tour de siège", en: "Siege Tower" }, enemy: { fr: "Tour de siège", en: "Siege Tower" },
    type: "Soutien", v: [1,0,1,2],
    text: { fr: "Assaut : à la pose, retourne toutes les cartes face cachée adverses sur ce terrain.", en: "Assault: on deploy, flip every enemy face-down card on this terrain." },
    onPlay: (g, me) => { const f = where(g, me); [...g.foes(f.t)].forEach(u => { if (u.down) g.flip(u.id, me.id); }); },
  },
};
const UNITS = ['legionnaire', 'legionnaire', 'legionnaire', 'cavaliers', 'cavaliers', 'sagittaires', 'sagittaires', 'frondeurs', 'centurion', 'fabri', 'convoi'];
const ORDERS = ['pluie_traits', 'ravitaillement', 'marche_forcee', 'espions'];
// Asymmetric: artillery, eagles and earthworks against oath-bound warriors, druids, war horns and scorched earth.
PACKS.gaule.decks = [
  [...UNITS, 'scorpion', 'aquilifere', 'fabri', 'legionnaire', ...ORDERS, 'circonvallation'],
  [...UNITS, 'druide', 'soldurii', 'cavaliers', ...ORDERS, 'carnyx', 'terre_brulee'],
];
// Campaign powers: once per battle, free (they do not use up the turn's action). targets(g) + onPlay(g, null, move).
PACKS.gaule.powers = {
  commentarii: {
    name: { fr: "Commentaires", en: "Commentaries" },
    text: { fr: "Pioche 2 cartes.", en: "Draw 2 cards." },
    targets: () => [{ args: {}, steps: [] }],
    onPlay: g => g.draw(2),
  },
  celeritas: {
    name: { fr: "Celeritas", en: "Celeritas" },
    text: { fr: "La vitesse de César : déplace une de tes unités vers n'importe quel terrain.", en: "Caesar's speed: move one of your units to any terrain." },
    targets: g => {
      const out = [];
      for (const x of g.mine()) for (const to of g.live())
        if (to !== x.t && g.count(to) < g.cap(to) && !g.blocks(x.u, x.t, to)) out.push({ args: { u: x.u.id, t2: to }, steps: [g.U(x.u.id), g.T(to)] });
      return out;
    },
    onPlay: (g, me, m) => g.move(m.u, m.t2),
  },
  vallum: {
    name: { fr: "Vallum", en: "Vallum" },
    text: { fr: "Jusqu'à ton prochain tour, l'adversaire ne peut pas te prendre un terrain que tu tiens.", en: "Until your next turn, the opponent can't take a terrain you hold." },
    targets: g => g.smoked() ? [] : [{ args: {}, steps: [] }],
    onPlay: g => g.smoke(),
  },
  balistes: {
    name: { fr: "Balistes", en: "Ballistae" },
    text: { fr: "Détruit une unité adverse de valeur totale 4 ou moins.", en: "Destroy an enemy unit worth 4 or less in total." },
    targets: g => g.hits(g.theirs().filter(x => killable(g, x.u, x.t) && g.sum(g.vals(x.u, x.t)) <= 4)),
    onPlay: (g, me, m) => g.destroy(m.u),
  },
  clementia: {
    name: { fr: "Clémence de César", en: "Caesar's Clemency" },
    text: { fr: "Des otages parlent : retourne toutes les cartes face cachée adverses.", en: "Hostages talk: flip every enemy face-down card." },
    targets: g => g.theirs().some(x => x.u.down) ? [{ args: {}, steps: [] }] : [],
    onPlay: g => g.terrains().forEach(X => [...X.side[1 - g.p]].forEach(u => { if (u.down) g.flip(u.id, null); })),
  },
};
// Campaign rewards rolled as battles open: 30 % veteran, 25 % new card, 25 % power, 20 % nothing.
PACKS.gaule.rewards = {
  vets: ['legionnaire', 'cavaliers', 'sagittaires', 'centurion', 'frondeurs'],
  cards: ['decima', 'tour', 'aquilifere', 'scorpion'],
  powers: ['commentarii', 'celeritas', 'vallum', 'balistes', 'clementia'],
};
}
if (typeof module !== 'undefined') module.exports = PACKS.gaule;
