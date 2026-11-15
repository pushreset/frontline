'use strict';
// Verdun 1916 — cards, decks, campaign powers and rewards. Plain data plus hooks (functions receiving `g`, the engine helper: see README).
// No tanks, no air superiority: the war here is shells, mud and attrition. Infantry malus (shelling, gas,
// worn-out ground) piles up over a battle; relief, stretcher-bearers and deep dugouts take it back.
(globalThis.PACKS = globalThis.PACKS || {}).verdun = globalThis.PACKS.verdun || {};
{ // block: in the browser every <script> shares one global scope, keep helpers local
const where = (g, u) => g.find(u.id);
// The enemy unit a shell or a mine hits first: the strongest one (most Infantry, then most in total).
const strongest = (g, us, t) => us.slice().sort((a, b) => (g.vals(b, t)[1] - g.vals(a, t)[1]) || (g.sum(g.vals(b, t)) - g.sum(g.vals(a, t))))[0];
// Shelling orders (Pilonnage, Barrage): a terrain where you have a unit, or adjacent; a spotter or the high ground reaches anywhere.
const inRange = (g, t) => g.mine().some(x => !x.u.down && g.has(x.u, 'spotter')) || g.terrains().some((X, i) => g.traitHas(i, 'highGround') && (X.holder === g.p || X.captured === g.p))
  || g.mine().some(m => m.t === t || g.adjacent(m.t, t));
const shelled = (g, t) => g.foes(t).forEach(u => g.malus(u.id));

PACKS.verdun.cards = {
  canon75: {
    name: { fr: "Canon de 75", en: "75 mm Field Gun" }, enemy: { fr: "Canon de 77", en: "77 mm Field Gun" },
    type: "Artillerie", v: [3,0,0,1],
  },
  obusier155: {
    name: { fr: "Obusier de 155", en: "155 mm Howitzer" }, enemy: { fr: "Mortier de 21 cm", en: "21 cm Mörser" },
    type: "Artillerie", v: [2,0,0,0],
    text: { fr: "Pilonnage continu : face visible, au début de ton tour, l'unité adverse la plus forte de ce terrain perd 1 Infanterie.", en: "Steady shelling: face up, at the start of your turn, the strongest enemy unit on this terrain loses 1 Infantry." },
    onTurnStart: (g, me) => {
      if (me.down) return;
      const f = where(g, me), foes = g.foes(f.t).filter(e => !e.down && g.vals(e, f.t)[1] > 0);
      if (foes.length) g.malus(strongest(g, foes, f.t).id);
    },
  },
  crapouillot: {
    name: { fr: "Crapouillot", en: "Trench Mortar" }, enemy: { fr: "Minenwerfer", en: "Minenwerfer" },
    type: "Artillerie", v: [1,1,0,0],
    text: { fr: "À la pose : une unité adverse sur ce terrain perd 1 Infanterie.", en: "On deploy: an enemy unit on this terrain loses 1 Infantry." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => !e.down), t),
    onPlay: (g, me, m) => { if (m.u != null) g.malus(m.u); },
  },
  poilus: {
    name: { fr: "Section de poilus", en: "Poilu Section" }, enemy: { fr: "Grenadiere", en: "Grenadiers" },
    type: "Infanterie", v: [0,3,0,1],
  },
  chasseurs: {
    name: { fr: "Chasseurs à pied", en: "Chasseurs" }, enemy: { fr: "Jäger", en: "Jäger" },
    type: "Infanterie", v: [0,2,0,2],
    text: { fr: "Tenaces : ne peuvent pas être détruits tant que tu tiens ce terrain.", en: "Stubborn: cannot be destroyed while you hold this terrain." },
    immune: (g, u) => { const f = where(g, u); return !!f && g.terrains()[f.t].holder === u.owner; },
  },
  mitrailleuse: {
    name: { fr: "Mitrailleuse Hotchkiss", en: "Hotchkiss Machine Gun" }, enemy: { fr: "MG 08", en: "MG 08" },
    type: "Infanterie", v: [0,2,0,1],
    text: { fr: "Les unités Infanterie adverses sur ce terrain perdent 1 Infanterie.", en: "Enemy Infantry units on this terrain lose 1 Infantry." },
    aura: (g, u, t, v) => { if (g.type(u) === 'Infanterie' && g.side(t, 1 - u.owner).some(e => !e.down && e.key === 'mitrailleuse')) v[1] = Math.max(0, v[1] - 1); },
  },
  nettoyeurs: {
    name: { fr: "Nettoyeurs de tranchées", en: "Trench Cleaners" }, enemy: { fr: "Stoßtrupp", en: "Stormtroopers" },
    type: "Infanterie", v: [0,2,0,1],
    text: { fr: "À la pose : détruit une carte face cachée adverse sur ce terrain, ou retourne face cachée une unité adverse de valeur totale 2 ou moins si l'adversaire ne tient pas ce terrain.", en: "On deploy: destroy an enemy face-down card on this terrain, or turn face down an enemy unit worth 2 or less in total if the enemy does not hold this terrain." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => g.huntable(e, t, 2))),
    onPlay: (g, me, m) => { if (m.u != null) g.hunt(m.u); },
  },
  lance_flammes: {
    name: { fr: "Lance-flammes Schilt", en: "Schilt Flamethrower" }, enemy: { fr: "Flammenwerfer", en: "Flammenwerfer" },
    type: "Infanterie", v: [0,2,0,0],
    text: { fr: "À la pose : détruit une unité adverse de valeur totale 2 ou moins sur ce terrain.", en: "On deploy: destroy an enemy unit worth 2 or less in total on this terrain." },
    targets: (g, t) => g.safe(t) ? [] : g.hit(g.foes(t).filter(e => !e.down && !g.tough(e) && g.sum(g.vals(e, t)) <= 2), t),
    onPlay: (g, me, m) => { if (m.u != null) g.destroy(m.u); },
  },
  sapeurs: {
    name: { fr: "Sapeurs mineurs", en: "Tunnellers" }, enemy: { fr: "Mineure", en: "Mineure" },
    type: "Genie", v: [0,1,2,0],
    text: { fr: "Mine : quand cette carte est retournée face visible, par toi ou par l'adversaire, elle détruit l'unité adverse la plus forte du terrain (valeur totale 3 ou moins).", en: "Mine: when this card is turned face up, by you or by the enemy, it destroys the strongest enemy unit on the terrain (worth 3 or less in total)." },
    onFlipped: (g, me) => {
      const f = where(g, me);
      if (!f || g.safe(f.t)) return;
      const foes = g.foes(f.t).filter(e => !e.down && !g.tough(e) && g.sum(g.vals(e, f.t)) <= 3);
      if (foes.length) g.destroy(strongest(g, foes, f.t).id);
    },
  },
  terrassiers: {
    name: { fr: "Terrassiers", en: "Diggers" }, enemy: { fr: "Pioniere", en: "Pioniere" },
    type: "Genie", v: [1,0,2,1],
    text: { fr: "Boyaux : à la pose, déplace une de tes unités vers un terrain adjacent.", en: "Saps: on deploy, move one of your units to an adjacent terrain." },
    targets: (g, t) => {
      const out = [];
      for (const x of g.mine()) for (const to of g.live())
        if (g.canMove(x.u, x.t, to) && (to !== t || g.count(t) + 1 < g.cap(t))) out.push({ args: { u: x.u.id, t2: to }, steps: [g.U(x.u.id), g.T(to)] });
      return out;
    },
    onPlay: (g, me, m) => { if (m.u != null) g.move(m.u, m.t2); },
  },
  telephonistes: {
    name: { fr: "Téléphonistes", en: "Signallers" }, enemy: { fr: "Fernsprecher", en: "Fernsprecher" },
    type: "Genie", v: [0,0,2,1],
    text: { fr: "Ligne de campagne : tes Pilonnages visent n'importe quel terrain.", en: "Field line: your Shellings can target any terrain." },
    tags: ['spotter'],
  },
  officier: {
    name: { fr: "Capitaine", en: "Captain" }, enemy: { fr: "Hauptmann", en: "Hauptmann" },
    type: "Commandement", v: [0,1,0,2],
    text: { fr: "Ton surplus sur ce terrain compte +2 en cas de contestation.", en: "Your surplus on this terrain counts +2 in a contest." },
    surplus: 2,
  },
  escadrille: {
    name: { fr: "Escadrille N.124", en: "Escadrille N.124" }, enemy: { fr: "Fokker Eindecker", en: "Fokker Eindecker" },
    type: "Aviation", v: [0,0,1,2],
    text: { fr: "Observation : à la pose, retourne une carte adverse sur ce terrain, dans un sens ou dans l'autre (pour la mettre face cachée : valeur totale 2 ou moins, sur un terrain que l'adversaire ne tient pas).", en: "Spotting: on deploy, flip an enemy card on this terrain, either way (to turn it face down: worth 2 or less in total, on a terrain the enemy does not hold)." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => g.turnable(e, t, 2))),
    onPlay: (g, me, m) => { if (m.u != null) g.turnOver(m.u, me.id); },
  },
  pilonnage: {
    name: { fr: "Pilonnage", en: "Shelling" }, enemy: { fr: "Pilonnage", en: "Shelling" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Détruit une unité adverse non Artillerie de valeur totale 3 ou moins (terrain où tu as une unité, ou adjacent). Pas dans les bois.", en: "Destroy an enemy non-Artillery unit worth 3 or less in total (terrain where you have a unit, or adjacent). Not in woods." },
    targets: g => g.hits(g.theirs().filter(x => !g.safe(x.t) && !g.traitHas(x.t, 'cover') && !x.u.down && !g.tough(x.u) && g.type(x.u) !== 'Artillerie' && g.sum(g.vals(x.u, x.t)) <= 3 && inRange(g, x.t))),
    onPlay: (g, me, m) => g.destroy(m.u),
  },
  barrage_roulant: {
    name: { fr: "Barrage roulant", en: "Creeping Barrage" }, enemy: { fr: "Barrage roulant", en: "Creeping Barrage" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Chaque unité adverse d'un terrain à portée perd 1 Infanterie. Puis une de tes unités d'un terrain adjacent peut avancer derrière le barrage.", en: "Every enemy unit on a terrain in range loses 1 Infantry. Then one of your units on an adjacent terrain may advance behind the barrage." },
    targets: g => {
      const out = [];
      for (const t of g.live()) if (g.foes(t).length && inRange(g, t)) {
        out.push({ args: { t }, steps: [g.T(t)] });
        for (const x of g.mine()) if (x.t !== t && g.canMove(x.u, x.t, t)) out.push({ args: { t, u: x.u.id }, steps: [g.T(t), g.U(x.u.id)] });
      }
      return out;
    },
    onPlay: (g, me, m) => { shelled(g, m.t); if (m.u != null) g.move(m.u, m.t); },
  },
  trommelfeuer: {
    name: { fr: "Trommelfeuer", en: "Drumfire" }, enemy: { fr: "Trommelfeuer", en: "Drumfire" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Feu roulant : chaque unité adverse d'un terrain à portée perd 1 Infanterie.", en: "Drumfire: every enemy unit on a terrain in range loses 1 Infantry." },
    targets: g => g.live().filter(t => g.foes(t).length && inRange(g, t)).map(t => ({ args: { t }, steps: [g.T(t)] })),
    onPlay: (g, me, m) => shelled(g, m.t),
  },
  gaz: {
    name: { fr: "Attaque au gaz", en: "Gas Attack" }, enemy: { fr: "Attaque au gaz", en: "Gas Attack" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Sur un terrain, chaque unité face visible des deux camps perd 1 Infanterie, sauf le Génie (masques).", en: "On one terrain, every face-up unit on both sides loses 1 Infantry, except Engineers (masks)." },
    targets: g => g.live().filter(t => g.foes(t).some(e => !e.down)).map(t => ({ args: { t }, steps: [g.T(t)] })),
    onPlay: (g, me, m) => [0, 1].forEach(p => g.side(m.t, p).forEach(u => { if (!u.down && g.type(u) !== 'Genie') g.malus(u.id); })),
  },
  coup_de_main: {
    name: { fr: "Coup de main", en: "Trench Raid" }, enemy: { fr: "Coup de main", en: "Trench Raid" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Retourne une carte, une des tiennes face cachée ou une adverse dans un sens ou dans l'autre (pour la mettre face cachée : valeur totale 2 ou moins, sur un terrain que l'adversaire ne tient pas). Pioche 1.", en: "Flip a card, one of your face-down ones or an enemy one either way (to turn it face down: worth 2 or less in total, on a terrain the enemy does not hold). Draw 1." },
    targets: g => g.hits([...g.mine().filter(x => x.u.down), ...g.theirs().filter(x => g.turnable(x.u, x.t, 2))]),
    onPlay: (g, me, m) => { g.turnOver(m.u, null); g.draw(1); },
  },
  releve: {
    name: { fr: "Relève", en: "Relief" }, enemy: { fr: "Relève", en: "Relief" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Reprends en main une de tes unités (ses pertes sont effacées). Pioche 1.", en: "Take one of your units back to your hand (its losses are wiped out). Draw 1." },
    targets: g => g.hits(g.mine()),
    onPlay: (g, me, m) => { g.toHand(m.u); g.draw(1); },
  },
  tenir: {
    name: { fr: "Ils ne passeront pas", en: "They Shall Not Pass" }, enemy: { fr: "Halten!", en: "Halten!" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Jusqu'à ton prochain tour, l'adversaire ne peut pas te prendre un terrain que tu tiens.", en: "Until your next turn, the enemy can't take a terrain you hold." },
    targets: () => [{ args: {}, steps: ['play'] }],
    onPlay: g => g.smoke(),
  },
  // Campaign rewards: player-only cards (lance_flammes is also in the AI's deck).
  brancardiers: {
    name: { fr: "Brancardiers", en: "Stretcher-Bearers" }, enemy: { fr: "Sanitäter", en: "Sanitäter" },
    type: "Commandement", v: [0,1,0,1],
    text: { fr: "À la pose : efface les pertes de tes unités sur ce terrain.", en: "On deploy: wipe out the losses of your units on this terrain." },
    onPlay: (g, me) => { const f = where(g, me); g.allies(f.t).forEach(u => { u.malus = 0; }); },
  },
  ricm: {
    name: { fr: "RICM", en: "RICM" }, enemy: { fr: "RICM", en: "RICM" },
    type: "Infanterie", v: [0,3,0,2],
    text: { fr: "Régiment d'infanterie coloniale du Maroc : ne peut pas être détruit.", en: "Moroccan Colonial Infantry Regiment: cannot be destroyed." },
    immune: true,
  },
  pigeon: {
    name: { fr: "Pigeon voyageur", en: "Carrier Pigeon" }, enemy: { fr: "Brieftaube", en: "Carrier Pigeon" },
    type: "Commandement", v: [0,0,1,1],
    text: { fr: "À la pose : pioche 2 cartes.", en: "On deploy: draw 2 cards." },
    onPlay: g => g.draw(2),
  },
};
const UNITS = ['canon75', 'canon75', 'obusier155', 'crapouillot', 'poilus', 'poilus', 'chasseurs', 'mitrailleuse', 'sapeurs', 'terrassiers', 'telephonistes', 'officier', 'escadrille'];
const ORDERS = ['pilonnage', 'gaz', 'coup_de_main', 'releve', 'tenir'];
// Asymmetric: the French perfect the creeping barrage and clean the trenches, the Germans bring drumfire and flamethrowers.
PACKS.verdun.decks = [
  [...UNITS, 'nettoyeurs', ...ORDERS, 'barrage_roulant'],
  [...UNITS, 'lance_flammes', ...ORDERS, 'trommelfeuer'],
];
// Campaign powers: once per battle, free (they do not use up the turn's action). targets(g) + onPlay(g, null, move).
PACKS.verdun.powers = {
  voie_sacree: {
    name: { fr: "Voie sacrée", en: "Sacred Way" },
    text: { fr: "Pioche 2 cartes.", en: "Draw 2 cards." },
    targets: () => [{ args: {}, steps: [] }],
    onPlay: g => g.draw(2),
  },
  noria: {
    name: { fr: "Noria", en: "Rotation" },
    text: { fr: "La relève de Pétain : efface les pertes de toutes tes unités.", en: "Pétain's rotation: wipe out the losses of all your units." },
    targets: g => g.mine().some(x => x.u.malus) ? [{ args: {}, steps: [] }] : [],
    onPlay: g => g.mine().forEach(x => { x.u.malus = 0; }),
  },
  canon400: {
    name: { fr: "Canon de 400", en: "400 mm Railway Gun" },
    text: { fr: "Détruit une unité adverse de valeur totale 4 ou moins (pas dans un fort).", en: "Destroy an enemy unit worth 4 or less in total (not in a fort)." },
    targets: g => g.hits(g.theirs().filter(x => !g.safe(x.t) && !g.tough(x.u) && g.sum(g.vals(x.u, x.t)) <= 4)),
    onPlay: (g, me, m) => g.destroy(m.u),
  },
  reco_aerienne: {
    name: { fr: "Reconnaissance aérienne", en: "Aerial Reconnaissance" },
    text: { fr: "Retourne toutes les cartes face cachée adverses, puis retourne face cachée une unité adverse au choix, sur un terrain qu'il ne tient pas.", en: "Flip every enemy face-down card, then turn an enemy unit of your choice face down, on a terrain the enemy does not hold." },
    targets: g => g.hits(g.theirs().filter(x => x.u.down || g.concealable(x.u))),
    onPlay: (g, me, m) => { g.revealAll(); const f = g.find(m.u); if (f && g.concealable(f.u)) g.conceal(m.u); },
  },
  nivelle: {
    name: { fr: "On ne passe pas", en: "None Shall Pass" },
    text: { fr: "Jusqu'à ton prochain tour, l'adversaire ne peut pas te prendre un terrain que tu tiens.", en: "Until your next turn, the opponent can't take a terrain you hold." },
    targets: g => g.smoked() ? [] : [{ args: {}, steps: [] }],
    onPlay: g => g.smoke(),
  },
};
// Campaign rewards rolled as battles open: 30 % veteran, 25 % new card, 25 % power, 20 % nothing.
PACKS.verdun.rewards = {
  vets: ['canon75', 'poilus', 'mitrailleuse', 'chasseurs', 'sapeurs', 'crapouillot'],
  cards: ['brancardiers', 'lance_flammes', 'ricm', 'pigeon'],
  powers: ['voie_sacree', 'noria', 'canon400', 'reco_aerienne', 'nivelle'],
};
}
if (typeof module !== 'undefined') module.exports = PACKS.verdun;
