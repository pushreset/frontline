'use strict';
// War of the Ring — cards, decks, campaign powers and rewards. Plain data plus hooks (functions receiving `g`, the engine helper: see README).
// You lead the Free Peoples: Gondor's shield walls, the Riders of Rohan, elven archers, rangers, dwarves, hobbits
// and Gandalf. The Shadow answers with orcs and warg riders, cave trolls that nothing can bring down, the Nazgûl
// whose terror turns your units face down, the drums of the deep and the Eye. The mûmakil, the fire of Orthanc and
// the Witch-king join its deck in some battles (see `aiCards` in battles.js).
// Values: [Sword, Cavalry, Bow, Magic].
(globalThis.PACKS = globalThis.PACKS || {}).terre_milieu = globalThis.PACKS.terre_milieu || {};
{ // block: in the browser every <script> shares one global scope, keep helpers local
const where = (g, u) => g.find(u.id);
const up = e => !e.down;
const foot = (g, u) => g.type(u) === 'Fantassin';
// A unit that an effect can destroy: face up, not indestructible, not on a terrain where nothing can be destroyed.
const killable = (g, e, t) => up(e) && !g.safe(t) && !g.tough(e);
const kill = (g, me, m) => { if (m.u != null) g.destroy(m.u); };
// Move one of your units to an adjacent terrain.
const moveTargets = (g, t) => {
  const out = [];
  for (const x of g.mine()) for (const to of g.live())
    if (g.canMove(x.u, x.t, to) && (to !== t || g.count(t) + 1 < g.cap(t))) out.push({ args: { u: x.u.id, t2: to }, steps: [g.U(x.u.id), g.T(to)] });
  return out;
};
// Charge: push an enemy unit of this terrain to a neighbouring one. Nowhere to fall back to: it is destroyed
// (unless it can't be: indestructible, or on a terrain where nothing is destroyed).
const pushTargets = (g, t) => {
  const out = [];
  for (const e of g.foes(t)) {
    const to = g.live().filter(x => g.canMove(e, t, x));
    for (const x of to) out.push({ args: { u: e.id, t2: x }, steps: [g.U(e.id), g.T(x)] });
    if (!to.length && !g.safe(t) && !g.tough(e)) out.push({ args: { u: e.id, t2: null }, steps: [g.U(e.id)] });
  }
  return out;
};
const push = (g, me, m) => { if (m.u == null) return; m.t2 == null ? g.destroy(m.u) : g.move(m.u, m.t2); };
// Arrows: an enemy unit here with Sword left loses 1.
const shoot = (g, t) => g.hit(g.foes(t).filter(e => up(e) && g.vals(e, t)[0] > 0));
const wound = (g, me, m) => { if (m.u != null) g.malus(m.u); };
// Flip every enemy face-down card on terrain t (a bluffed order is lost).
const unmask = (g, t, by) => [...g.foes(t)].forEach(u => { if (u.down) g.flip(u.id, by); });
const strongest = (g, us, t) => us.reduce((a, b) => g.sum(g.vals(b, t)) > g.sum(g.vals(a, t)) ? b : a);

PACKS.terre_milieu.cards = {
  soldats: {
    name: { fr: "Soldats du Gondor", en: "Soldiers of Gondor" }, enemy: { fr: "Orques du Mordor", en: "Orcs of Mordor" },
    // ponytail: no power. A +1 shield wall was tried: 30 % of battles reached nightfall instead of 19 %.
    type: "Fantassin", v: [3,0,0,0],
  },
  cavaliers: {
    name: { fr: "Cavaliers du Rohan", en: "Riders of Rohan" }, enemy: { fr: "Chevaucheurs de wargs", en: "Warg Riders" },
    type: "Cavalerie", v: [0,3,0,0],
    text: { fr: "Charge : à la pose, repousse une unité adverse de ce terrain vers un terrain voisin. Si elle n'a nulle part où aller, elle est détruite.", en: "Charge: on deploy, push an enemy unit from this terrain to a neighbouring one. With nowhere to go, it is destroyed." },
    targets: pushTargets, onPlay: push,
  },
  archers: {
    name: { fr: "Archers elfes", en: "Elven Archers" }, enemy: { fr: "Archers orques", en: "Orc Archers" },
    type: "Archer", v: [0,0,2,0],
    text: { fr: "Volée : à la pose, une unité adverse sur ce terrain perd 1 Épée.", en: "Volley: on deploy, an enemy unit on this terrain loses 1 Sword." },
    targets: shoot, onPlay: wound,
  },
  rodeurs: {
    name: { fr: "Rôdeurs du Nord", en: "Rangers of the North" }, enemy: { fr: "Espions dunlendings", en: "Dunlending Spies" },
    type: "Archer", v: [1,0,1,1],
    text: { fr: "Pisteurs : à la pose, détruit une carte face cachée adverse sur ce terrain, ou retourne face cachée une unité adverse de valeur totale 2 ou moins si l'adversaire ne tient pas ce terrain.", en: "Trackers: on deploy, destroy an enemy face-down card on this terrain, or turn face down an enemy unit worth 2 or less in total if the enemy does not hold this terrain." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => g.huntable(e, t, 2))), onPlay: (g, me, m) => { if (m.u != null) g.hunt(m.u); },
  },
  capitaine: {
    name: { fr: "Capitaine du Gondor", en: "Captain of Gondor" }, enemy: { fr: "Capitaine uruk", en: "Uruk Captain" },
    type: "Fantassin", v: [2,0,0,1],
    text: { fr: "Ralliement : ton surplus sur ce terrain compte +2 en cas de contestation.", en: "Rally: your surplus on this terrain counts +2 in a contest." },
    surplus: 2,
  },
  elfes: {
    name: { fr: "Elfes de Fondcombe", en: "Elves of Rivendell" }, enemy: { fr: "Númenóréens noirs", en: "Black Númenóreans" },
    type: "Magie", v: [0,0,1,2],
    text: { fr: "Savoir ancien : à la pose, pioche 1 carte.", en: "Ancient lore: on deploy, draw 1 card." },
    onPlay: g => g.draw(1),
  },
  // Free Peoples only.
  nains: {
    name: { fr: "Nains d'Erebor", en: "Dwarves of Erebor" }, enemy: { fr: "Nains", en: "Dwarves" },
    type: "Fantassin", v: [3,0,0,0],
    text: { fr: "Têtus : indestructibles tant qu'une autre unité alliée face visible est sur ce terrain.", en: "Stubborn: cannot be destroyed while another face-up friendly unit stands on this terrain." },
    immune: (g, u) => { const f = where(g, u); return !!f && g.side(f.t, f.p).some(x => x !== u && up(x)); },
  },
  hobbits: {
    name: { fr: "Hobbits", en: "Hobbits" }, enemy: { fr: "Hobbits", en: "Hobbits" },
    type: "Fantassin", v: [1,0,1,1],
    text: { fr: "On ne les voit pas venir : quand ils sont retournés face visible, par toi ou l'adversaire, ils détruisent l'unité de Magie adverse la plus forte sur ce terrain, même indestructible.", en: "Nobody sees them coming: when they are turned face up, by you or the enemy, they destroy the strongest enemy Magic unit on this terrain, even an indestructible one." },
    onFlipped: (g, me) => {
      const f = where(g, me);
      if (!f || g.safe(f.t)) return;
      const foes = g.foes(f.t).filter(e => up(e) && g.type(e) === 'Magie');
      if (foes.length) g.destroy(strongest(g, foes, f.t).id);
    },
  },
  gandalf: {
    name: { fr: "Gandalf", en: "Gandalf" }, enemy: { fr: "Saroumane", en: "Saruman" },
    type: "Magie", v: [1,1,0,3],
    text: { fr: "Tu ne passeras pas ! : à la pose, retourne toutes les cartes face cachée adverses sur ce terrain et renvoie une unité adverse de valeur totale 2 ou moins dans la main de son propriétaire.", en: "You shall not pass!: on deploy, flip every enemy face-down card on this terrain and send an enemy unit worth 2 or less in total back to its owner's hand." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => up(e) && g.sum(g.vals(e, t)) <= 2)),
    onPlay: (g, me, m) => { unmask(g, where(g, me).t, me.id); if (m.u != null && g.find(m.u)) g.toHand(m.u); },
  },
  cor_helm: {
    name: { fr: "Cor de Helm", en: "Horn of Helm" }, enemy: { fr: "Cor de Helm", en: "Horn of Helm" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Le cor sonne dans le Gouffre : retourne toutes tes cartes face cachée d'un terrain.", en: "The horn sounds in the Deep: flip all your face-down cards on one terrain." },
    targets: g => g.live().filter(t => g.allies(t).some(u => u.down)).map(t => ({ args: { t }, steps: [g.T(t)] })),
    onPlay: (g, me, m) => [...g.allies(m.t)].forEach(u => { if (u.down) g.flip(u.id, null); }),
  },
  // The Shadow only.
  nazgul: {
    name: { fr: "Nazgûl", en: "Nazgûl" }, enemy: { fr: "Nazgûl", en: "Nazgûl" },
    type: "Magie", v: [0,1,0,2],
    text: { fr: "Souffle noir : à la pose, une unité adverse face visible sur ce terrain est retournée face cachée (elle vaut 0 jusqu'à ce qu'on la révèle).", en: "Black breath: on deploy, a face-up enemy unit on this terrain is turned face down (worth 0 until it is revealed)." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => up(e) && g.type(e) !== 'Magie')),
    onPlay: (g, me, m) => { if (m.u != null) g.conceal(m.u); },
  },
  trolls: {
    name: { fr: "Trolls des cavernes", en: "Cave Trolls" }, enemy: { fr: "Trolls des cavernes", en: "Cave Trolls" },
    type: "Fantassin", v: [3,0,0,0],
    text: { fr: "Peau de pierre : ne peuvent pas être détruits.", en: "Hide like stone: cannot be destroyed." },
    immune: true,
  },
  tambours: {
    name: { fr: "Tambours des profondeurs", en: "Drums in the Deep" }, enemy: { fr: "Tambours des profondeurs", en: "Drums in the Deep" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Les tambours battent : retourne toutes tes cartes face cachée d'un terrain.", en: "The drums beat: flip all your face-down cards on one terrain." },
    targets: g => g.live().filter(t => g.allies(t).some(u => u.down)).map(t => ({ args: { t }, steps: [g.T(t)] })),
    onPlay: (g, me, m) => [...g.allies(m.t)].forEach(u => { if (u.down) g.flip(u.id, null); }),
  },
  oeil: {
    name: { fr: "L'Œil", en: "The Eye" }, enemy: { fr: "L'Œil", en: "The Eye" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "L'Œil sans paupière se pose sur un terrain : retourne toutes les cartes face cachée adverses qui s'y trouvent.", en: "The lidless Eye falls on one terrain: flip every enemy face-down card there." },
    targets: g => g.live().filter(t => g.foes(t).some(u => u.down)).map(t => ({ args: { t }, steps: [g.T(t)] })),
    onPlay: (g, me, m) => unmask(g, m.t, null),
  },
  // Join the Shadow's deck in some battles (aiCards).
  mumak: {
    name: { fr: "Mûmak", en: "Mûmak" }, enemy: { fr: "Mûmak du Harad", en: "Mûmak of Harad" },
    type: "Cavalerie", v: [2,3,0,0],
    text: { fr: "Piétinement : à la pose, détruit une unité adverse face visible de valeur totale 2 ou moins sur ce terrain.", en: "Trample: on deploy, destroy a face-up enemy unit worth 2 or less in total on this terrain." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => killable(g, e, t) && g.sum(g.vals(e, t)) <= 2)), onPlay: kill,
  },
  balrog: {
    name: { fr: "Balrog", en: "Balrog" }, enemy: { fr: "Balrog de Morgoth", en: "Balrog of Morgoth" },
    type: "Magie", v: [2,0,0,2],
    text: { fr: "Fouet de flammes : à la pose, détruit une unité adverse face visible de valeur totale 3 ou moins sur ce terrain.", en: "Whip of flame: on deploy, destroy a face-up enemy unit worth 3 or less in total on this terrain." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => killable(g, e, t) && g.sum(g.vals(e, t)) <= 3)), onPlay: kill,
  },
  roi_sorcier: {
    name: { fr: "Roi-Sorcier d'Angmar", en: "Witch-king of Angmar" }, enemy: { fr: "Roi-Sorcier d'Angmar", en: "Witch-king of Angmar" },
    type: "Magie", v: [0,1,0,2],
    text: { fr: "Nul homme ne peut le tuer : indestructible. Face visible, chaque unité de Fantassin adverse sur ce terrain perd 1 Épée.", en: "No living man can slay him: cannot be destroyed. Face up, each enemy Foot unit on this terrain loses 1 Sword." },
    immune: true,
    aura: (g, u, t, v) => { if (v[0] && foot(g, u) && g.side(t, 1 - u.owner).some(e => up(e) && e.key === 'roi_sorcier')) v[0]--; },
  },
  feu_orthanc: {
    name: { fr: "Feu d'Orthanc", en: "Fire of Orthanc" }, enemy: { fr: "Feu d'Orthanc", en: "Fire of Orthanc" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "La poudre de Saroumane ouvre la muraille : détruit une unité adverse de valeur totale 3 ou moins.", en: "Saruman's blasting fire breaks the wall: destroy an enemy unit worth 3 or less in total." },
    targets: g => g.hits(g.theirs().filter(x => killable(g, x.u, x.t) && g.sum(g.vals(x.u, x.t)) <= 3)),
    onPlay: kill,
  },
  // Both sides.
  fleches: {
    name: { fr: "Pluie de flèches", en: "Rain of Arrows" }, enemy: { fr: "Flèches noires", en: "Black Arrows" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Détruit une unité adverse de valeur totale 2 ou moins.", en: "Destroy an enemy unit worth 2 or less in total." },
    targets: g => g.hits(g.theirs().filter(x => killable(g, x.u, x.t) && g.sum(g.vals(x.u, x.t)) <= 2)),
    onPlay: kill,
  },
  lembas: {
    name: { fr: "Lembas", en: "Lembas" }, enemy: { fr: "Pillage", en: "Plunder" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Pioche 2 cartes.", en: "Draw 2 cards." },
    targets: () => [{ args: {}, steps: ['play'] }],
    onPlay: g => g.draw(2),
  },
  marche: {
    name: { fr: "Chevauchée", en: "Swift Ride" }, enemy: { fr: "Marche forcée", en: "Forced March" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Déplace une de tes unités vers un terrain adjacent.", en: "Move one of your units to an adjacent terrain." },
    targets: g => moveTargets(g, -1),
    onPlay: (g, me, m) => g.move(m.u, m.t2),
  },
  palantir: {
    name: { fr: "Palantír", en: "Palantír" }, enemy: { fr: "Palantír", en: "Palantír" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Une pierre de vision : retourne une carte, une des tiennes face cachée ou une adverse dans un sens ou dans l'autre (pour la mettre face cachée : valeur totale 2 ou moins, sur un terrain que l'adversaire ne tient pas). Pioche 1.", en: "A seeing-stone: flip a card, one of your face-down ones or an enemy one either way (to turn it face down: worth 2 or less in total, on a terrain the enemy does not hold). Draw 1." },
    targets: g => g.hits([...g.mine().filter(x => x.u.down), ...g.theirs().filter(x => g.turnable(x.u, x.t, 2))]),
    onPlay: (g, me, m) => { g.turnOver(m.u, null); g.draw(1); },
  },
  // Campaign rewards (Free Peoples only).
  aragorn: {
    name: { fr: "Aragorn", en: "Aragorn" }, enemy: { fr: "Aragorn", en: "Aragorn" },
    type: "Fantassin", v: [2,1,0,1],
    text: { fr: "Andúril : à la pose, détruit une unité adverse face visible de valeur totale 2 ou moins sur ce terrain.", en: "Andúril: on deploy, destroy a face-up enemy unit worth 2 or less in total on this terrain." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => killable(g, e, t) && g.sum(g.vals(e, t)) <= 2)), onPlay: kill,
  },
  armee_morts: {
    name: { fr: "Armée des Morts", en: "Army of the Dead" }, enemy: { fr: "Armée des Morts", en: "Army of the Dead" },
    type: "Fantassin", v: [3,0,0,0],
    text: { fr: "Liés par leur serment : ne peuvent pas être détruits.", en: "Bound by their oath: cannot be destroyed." },
    immune: true,
  },
  ents: {
    name: { fr: "Ents de Fangorn", en: "Ents of Fangorn" }, enemy: { fr: "Ents", en: "Ents" },
    type: "Fantassin", v: [3,0,0,1],
    text: { fr: "Colère des Ents : à la pose, chaque unité de Fantassin adverse sur ce terrain perd 1 Épée.", en: "Wrath of the Ents: on deploy, each enemy Foot unit on this terrain loses 1 Sword." },
    onPlay: (g, me) => { const t = where(g, me).t; g.foes(t).forEach(e => { if (up(e) && foot(g, e) && g.vals(e, t)[0] > 0) g.malus(e.id); }); },
  },
  aigles: {
    name: { fr: "Grands Aigles", en: "Great Eagles" }, enemy: { fr: "Bêtes ailées", en: "Fell Beasts" },
    type: "Cavalerie", v: [0,1,0,1],
    text: { fr: "Les Aigles arrivent : à la pose, détruit une unité de Magie adverse face visible, sur n'importe quel terrain.", en: "The Eagles are coming: on deploy, destroy a face-up enemy Magic unit, on any terrain." },
    targets: g => g.hits(g.theirs().filter(x => killable(g, x.u, x.t) && g.type(x.u) === 'Magie')), onPlay: kill,
  },
};
const UNITS = ['soldats', 'soldats', 'soldats', 'cavaliers', 'cavaliers', 'archers', 'archers', 'rodeurs', 'capitaine', 'elfes', 'elfes'];
const ORDERS = ['fleches', 'lembas', 'marche', 'palantir'];
// Asymmetric: dwarves, hobbits, Gandalf and the horn of Helm against Nazgûl, cave trolls, drums and the Eye.
PACKS.terre_milieu.decks = [
  [...UNITS, 'nains', 'hobbits', 'gandalf', 'soldats', ...ORDERS, 'cor_helm'],
  [...UNITS, 'nazgul', 'trolls', 'cavaliers', ...ORDERS, 'tambours', 'oeil'],
];
// Campaign powers: once per battle, free (they do not use up the turn's action). targets(g) + onPlay(g, null, move).
PACKS.terre_milieu.powers = {
  feux: {
    name: { fr: "Feux d'alarme", en: "The Beacons" },
    text: { fr: "Les feux d'alarme sont allumés, le Rohan répond : pioche 2 cartes.", en: "The beacons are lit, Rohan answers: draw 2 cards." },
    targets: () => [{ args: {}, steps: [] }],
    onPlay: g => g.draw(2),
  },
  gripoil: {
    name: { fr: "Gripoil", en: "Shadowfax" },
    text: { fr: "Le seigneur des chevaux : déplace une de tes unités vers n'importe quel terrain.", en: "Lord of horses: move one of your units to any terrain." },
    targets: g => {
      const out = [];
      for (const x of g.mine()) for (const to of g.live())
        if (to !== x.t && g.count(to) < g.cap(to) && !g.blocks(x.u, x.t, to)) out.push({ args: { u: x.u.id, t2: to }, steps: [g.U(x.u.id), g.T(to)] });
      return out;
    },
    onPlay: (g, me, m) => g.move(m.u, m.t2),
  },
  fiole: {
    name: { fr: "Fiole de Galadriel", en: "Phial of Galadriel" },
    text: { fr: "Une lumière dans les ténèbres : jusqu'à ton prochain tour, l'adversaire ne peut pas te prendre un terrain que tu tiens.", en: "A light in dark places: until your next turn, the enemy can't take a terrain you hold." },
    targets: g => g.smoked() ? [] : [{ args: {}, steps: [] }],
    onPlay: g => g.smoke(),
  },
  fleche_noire: {
    name: { fr: "Flèche noire", en: "The Black Arrow" },
    text: { fr: "La flèche de Bard trouve le défaut de la cuirasse : une unité adverse perd 2 Épée.", en: "Bard's arrow finds the gap in the armour: an enemy unit loses 2 Sword." },
    targets: g => g.hits(g.theirs().filter(x => up(x.u) && g.vals(x.u, x.t)[0] > 0)),
    onPlay: (g, me, m) => g.malus(m.u, 2),
  },
  miroir: {
    name: { fr: "Miroir de Galadriel", en: "Mirror of Galadriel" },
    text: { fr: "Ce qui fut, ce qui est, ce qui sera : retourne toutes les cartes face cachée adverses, puis retourne face cachée une unité adverse au choix, sur un terrain qu'il ne tient pas.", en: "Things that were, that are, that yet may be: flip every enemy face-down card, then turn an enemy unit of your choice face down, on a terrain the enemy does not hold." },
    targets: g => g.hits(g.theirs().filter(x => x.u.down || g.concealable(x.u))),
    onPlay: (g, me, m) => { g.revealAll(); const f = g.find(m.u); if (f && g.concealable(f.u)) g.conceal(m.u); },
  },
};
// Campaign rewards rolled as battles open: 30 % veteran, 25 % new card, 25 % power, 20 % nothing.
PACKS.terre_milieu.rewards = {
  vets: ['soldats', 'cavaliers', 'archers', 'capitaine', 'rodeurs'],
  cards: ['aragorn', 'armee_morts', 'ents', 'aigles'],
  powers: ['feux', 'gripoil', 'fiole', 'fleche_noire', 'miroir'],
};
}
if (typeof module !== 'undefined') module.exports = PACKS.terre_milieu;
