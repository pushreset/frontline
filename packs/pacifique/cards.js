'use strict';
// Pacific 1942–1945 — cards, decks, campaign powers and rewards. Plain data plus hooks (functions receiving `g`, the engine helper: see README).
// A naval and amphibious war: ships and aircraft fight for the sea, infantry lands on reefs and digs out defenders
// who will not surrender. The US bring carriers and logistics, Japan dug-in garrisons, banzai charges and, from
// Leyte on, kamikazes (added to the AI's deck by the battle: see `aiCards` in battles.js).
// Values: [Navy, Infantry, Air, Logistics].
(globalThis.PACKS = globalThis.PACKS || {}).pacifique = globalThis.PACKS.pacifique || {};
{ // block: in the browser every <script> shares one global scope, keep helpers local
const where = (g, u) => g.find(u.id);
const ship = (g, u) => g.type(u) === 'Navire';
const up = e => !e.down;
// A unit that a power can destroy: face up, not indestructible, not on a terrain where nothing can be destroyed.
const killable = (g, e, t) => up(e) && !g.safe(t) && !g.tough(e);
// Move one of your units to an adjacent terrain (Seabees): the Normandy engineers' targets.
const moveTargets = (g, t) => {
  const out = [];
  for (const x of g.mine()) for (const to of g.live())
    if (g.canMove(x.u, x.t, to) && (to !== t || g.count(t) + 1 < g.cap(t))) out.push({ args: { u: x.u.id, t2: to }, steps: [g.U(x.u.id), g.T(to)] });
  return out;
};
// Naval gunfire reaches a terrain where you have a face-up ship, or next to one; anywhere while you hold a volcano.
const inRange = (g, t) => g.terrains().some((X, i) => g.traitHas(i, 'highGround') && (X.holder === g.p || X.captured === g.p))
  || g.mine().some(m => up(m.u) && ship(g, m.u) && (m.t === t || g.adjacent(m.t, t)));
const carrierUp = (g, p) => g.terrains().some(X => X.side[p].some(e => up(e) && e.key === 'porte_avions'));

PACKS.pacifique.cards = {
  cuirasse: {
    name: { fr: "Cuirassé", en: "Battleship" }, enemy: { fr: "Cuirassé Kongō", en: "Battleship Kongō" },
    type: "Navire", v: [3,0,0,1],
  },
  destroyer: {
    name: { fr: "Destroyer", en: "Destroyer" }, enemy: { fr: "Destroyer", en: "Destroyer" },
    type: "Navire", v: [2,0,1,0],
    text: { fr: "Grenades sous-marines : à la pose, détruit une carte face cachée adverse sur ce terrain.", en: "Depth charges: on deploy, destroy an enemy face-down card on this terrain." },
    targets: (g, t) => g.safe(t) ? [] : g.hit(g.foes(t).filter(e => e.down), t),
    onPlay: (g, me, m) => { if (m.u != null) g.destroy(m.u); },
  },
  sous_marin: {
    name: { fr: "Sous-marin", en: "Submarine" }, enemy: { fr: "Sous-marin I-168", en: "Submarine I-168" },
    type: "Navire", v: [2,0,0,0],
    text: { fr: "Torpilles : à la pose, détruit un Navire adverse de valeur totale 3 ou moins sur ce terrain.", en: "Torpedoes: on deploy, destroy an enemy Ship worth 3 or less in total on this terrain." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => killable(g, e, t) && ship(g, e) && g.sum(g.vals(e, t)) <= 3), t),
    onPlay: (g, me, m) => { if (m.u != null) g.destroy(m.u); },
  },
  dauntless: {
    name: { fr: "SBD Dauntless", en: "SBD Dauntless" }, enemy: { fr: "Aichi D3A « Val »", en: "Aichi D3A \"Val\"" },
    type: "Aviation", v: [1,0,2,0],
    text: { fr: "Bombardement en piqué : à la pose, une unité adverse sur ce terrain perd 1 Infanterie.", en: "Dive bombing: on deploy, an enemy unit on this terrain loses 1 Infantry." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => up(e) && g.vals(e, t)[1] > 0), t),
    onPlay: (g, me, m) => { if (m.u != null) g.malus(m.u); },
  },
  hellcat: {
    name: { fr: "F6F Hellcat", en: "F6F Hellcat" }, enemy: { fr: "Mitsubishi A6M Zero", en: "Mitsubishi A6M Zero" },
    type: "Aviation", v: [0,0,3,0],
    tags: ['fighter'],
  },
  marines: {
    name: { fr: "Marines", en: "Marines" }, enemy: { fr: "Rikusentai", en: "Rikusentai" },
    type: "Infanterie", v: [0,3,0,1],
  },
  lance_flammes: {
    name: { fr: "Lance-flammes", en: "Flamethrower" }, enemy: { fr: "Lance-flammes", en: "Flamethrower" },
    type: "Infanterie", v: [0,2,0,0],
    text: { fr: "À la pose : une unité adverse sur ce terrain perd 1 Infanterie, même face cachée ou dans une grotte.", en: "On deploy: an enemy unit on this terrain loses 1 Infantry, even face down or in a cave." },
    targets: (g, t) => g.hit(g.foes(t), t),
    onPlay: (g, me, m) => { if (m.u != null) g.malus(m.u); },
  },
  seabees: {
    name: { fr: "Seabees", en: "Seabees" }, enemy: { fr: "Génie de la Marine", en: "Naval Construction Unit" },
    type: "Logistique", v: [0,1,0,2],
    text: { fr: "Bulldozers : à la pose, déplace une de tes unités vers un terrain adjacent.", en: "Bulldozers: on deploy, move one of your units to an adjacent terrain." },
    targets: moveTargets,
    onPlay: (g, me, m) => { if (m.u != null) g.move(m.u, m.t2); },
  },
  cargo: {
    name: { fr: "Liberty ship", en: "Liberty Ship" }, enemy: { fr: "Cargo Maru", en: "Maru Freighter" },
    type: "Logistique", v: [1,0,0,2],
    text: { fr: "À la pose : pioche 1 carte.", en: "On deploy: draw 1 card." },
    onPlay: g => g.draw(1),
  },
  // United States only.
  porte_avions: {
    name: { fr: "Porte-avions", en: "Aircraft Carrier" }, enemy: { fr: "Porte-avions Akagi", en: "Carrier Akagi" },
    type: "Navire", v: [2,0,1,1],
    text: { fr: "Groupe aérien : face visible, tes unités Aviation gagnent +1 Air sur tous les terrains.", en: "Air group: face up, your Aviation units get +1 Air on every terrain." },
    aura: (g, u, t, v) => { if (g.type(u) === 'Aviation' && carrierUp(g, u.owner)) v[2]++; },
  },
  corsair: {
    name: { fr: "F4U Corsair", en: "F4U Corsair" }, enemy: { fr: "Kawanishi N1K", en: "Kawanishi N1K" },
    type: "Aviation", v: [0,1,2,0],
    text: { fr: "Appui rapproché : à la pose, retourne une carte face cachée adverse sur ce terrain.", en: "Close support: on deploy, flip an enemy face-down card on this terrain." },
    tags: ['fighter'],
    targets: (g, t) => g.hit(g.foes(t).filter(e => e.down), t),
    onPlay: (g, me, m) => { if (m.u != null) g.flip(m.u, me.id); },
  },
  lvt: {
    name: { fr: "LVT amphibie", en: "LVT Amtrac" }, enemy: { fr: "Péniche Daihatsu", en: "Daihatsu Landing Craft" },
    type: "Infanterie", v: [1,2,0,0],
    text: { fr: "Amphibie : franchit le récif sans perte.", en: "Amphibious: crosses the reef without loss." },
    tags: ['amphibious'],
  },
  code_talkers: {
    name: { fr: "Code Talkers navajos", en: "Navajo Code Talkers" }, enemy: { fr: "Transmissions", en: "Signals" },
    type: "Logistique", v: [0,1,0,2],
    text: { fr: "Code indéchiffrable : ton surplus sur ce terrain compte +2 en cas de contestation.", en: "Unbreakable code: your surplus on this terrain counts +2 in a contest." },
    surplus: 2,
  },
  turkey_shoot: {
    name: { fr: "Tir aux pigeons", en: "Turkey Shoot" }, enemy: { fr: "Tir aux pigeons", en: "Turkey Shoot" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Sur chaque terrain où tu as un chasseur face visible, détruit l'unité Aviation adverse la plus forte.", en: "On each terrain where you have a face-up fighter, destroy the strongest enemy Aviation unit." },
    targets: g => g.live().some(t => prey(g, t)) ? [{ args: {}, steps: ['play'] }] : [],
    onPlay: g => g.live().forEach(t => { const e = prey(g, t); if (e) g.destroy(e.id); }),
  },
  // Japan only.
  yamato: {
    name: { fr: "Cuirassé Yamato", en: "Battleship Yamato" }, enemy: { fr: "Cuirassé Yamato", en: "Battleship Yamato" },
    type: "Navire", v: [4,0,0,1],
  },
  garnison: {
    name: { fr: "Garnison retranchée", en: "Dug-in Garrison" }, enemy: { fr: "Garnison retranchée", en: "Dug-in Garrison" },
    type: "Infanterie", v: [0,3,0,0],
    text: { fr: "Jusqu'au dernier : ne peut pas être détruite.", en: "To the last man: cannot be destroyed." },
    immune: true,
  },
  tireurs: {
    name: { fr: "Tireurs embusqués", en: "Snipers" }, enemy: { fr: "Tireurs embusqués", en: "Snipers" },
    type: "Infanterie", v: [0,2,0,1],
    text: { fr: "À la pose : une unité adverse sur ce terrain perd 1 Infanterie.", en: "On deploy: an enemy unit on this terrain loses 1 Infantry." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => up(e) && g.vals(e, t)[1] > 0), t),
    onPlay: (g, me, m) => { if (m.u != null) g.malus(m.u); },
  },
  kamikaze: {
    name: { fr: "Kamikaze", en: "Kamikaze" }, enemy: { fr: "Kamikaze", en: "Kamikaze" },
    type: "Aviation", v: [0,0,2,0],
    text: { fr: "À la pose : s'écrase sur un Navire adverse de ce terrain et le détruit. Le Kamikaze est détruit aussi.", en: "On deploy: crashes into an enemy Ship on this terrain and destroys it. The Kamikaze is destroyed too." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => killable(g, e, t) && ship(g, e)), t),
    onPlay: (g, me, m) => { if (m.u != null) { g.destroy(m.u); g.destroy(me.id); } },
  },
  banzai: {
    name: { fr: "Charge banzaï", en: "Banzai Charge" }, enemy: { fr: "Charge banzaï", en: "Banzai Charge" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Sur un terrain, ton unité d'Infanterie la plus faible et l'unité d'Infanterie adverse la plus forte sont détruites.", en: "On one terrain, your weakest Infantry unit and the strongest enemy Infantry unit are destroyed." },
    targets: g => g.live().filter(t => charge(g, t)).map(t => ({ args: { t }, steps: [g.T(t)] })),
    onPlay: (g, me, m) => { const c = charge(g, m.t); if (c) { g.destroy(c[1].id); g.destroy(c[0].id); } },
  },
  // Both sides.
  bombardement: {
    name: { fr: "Bombardement naval", en: "Naval Bombardment" }, enemy: { fr: "Bombardement naval", en: "Naval Bombardment" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Chaque unité adverse d'un terrain perd 1 Infanterie. Portée : un terrain où tu as un Navire face visible, ou adjacent ; partout si tu tiens un volcan.", en: "Every enemy unit on one terrain loses 1 Infantry. Range: a terrain where you have a face-up Ship, or adjacent; anywhere while you hold a volcano." },
    targets: g => g.live().filter(t => g.foes(t).length && inRange(g, t)).map(t => ({ args: { t }, steps: [g.T(t)] })),
    onPlay: (g, me, m) => g.foes(m.t).forEach(u => g.malus(u.id)),
  },
  ravitaillement: {
    name: { fr: "Convoi de nuit", en: "Night Convoy" }, enemy: { fr: "Tokyo Express", en: "Tokyo Express" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Pioche 2 cartes.", en: "Draw 2 cards." },
    targets: () => [{ args: {}, steps: ['play'] }],
    onPlay: g => g.draw(2),
  },
  guetteurs: {
    name: { fr: "Guetteurs côtiers", en: "Coastwatchers" }, enemy: { fr: "Guetteurs", en: "Lookouts" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Retourne une carte face cachée. Pioche 1.", en: "Flip a face-down card. Draw 1." },
    targets: g => g.hits([...g.mine(), ...g.theirs()].filter(x => x.u.down)),
    onPlay: (g, me, m) => { g.flip(m.u, null); g.draw(1); },
  },
  fumee: {
    name: { fr: "Écran de fumée", en: "Smoke Screen" }, enemy: { fr: "Écran de fumée", en: "Smoke Screen" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Jusqu'à ton prochain tour, l'adversaire ne peut pas te prendre un terrain que tu tiens.", en: "Until your next turn, the enemy can't take a terrain you hold." },
    targets: () => [{ args: {}, steps: ['play'] }],
    onPlay: g => g.smoke(),
  },
  // Campaign rewards (player only).
  avenger: {
    name: { fr: "TBF Avenger", en: "TBF Avenger" }, enemy: { fr: "Nakajima B5N « Kate »", en: "Nakajima B5N \"Kate\"" },
    type: "Aviation", v: [1,0,2,0],
    text: { fr: "Torpille aérienne : à la pose, détruit un Navire adverse de valeur totale 4 ou moins sur ce terrain.", en: "Aerial torpedo: on deploy, destroy an enemy Ship worth 4 or less in total on this terrain." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => killable(g, e, t) && ship(g, e) && g.sum(g.vals(e, t)) <= 4), t),
    onPlay: (g, me, m) => { if (m.u != null) g.destroy(m.u); },
  },
  corpsman: {
    name: { fr: "Infirmiers de la Navy", en: "Navy Corpsmen" }, enemy: { fr: "Infirmiers", en: "Medics" },
    type: "Logistique", v: [0,1,0,1],
    text: { fr: "À la pose : efface les pertes de tes unités sur ce terrain.", en: "On deploy: wipe out the losses of your units on this terrain." },
    onPlay: (g, me) => { const f = where(g, me); g.allies(f.t).forEach(u => { u.malus = 0; }); },
  },
};
// Turkey Shoot: the strongest face-up enemy aircraft on a terrain where you have a face-up fighter.
function prey(g, t) {
  if (!g.allies(t).some(u => up(u) && g.has(u, 'fighter'))) return null;
  const es = g.foes(t).filter(e => killable(g, e, t) && g.type(e) === 'Aviation');
  return es.sort((a, b) => g.sum(g.vals(b, t)) - g.sum(g.vals(a, t)))[0] || null;
}
// Banzai: [your weakest face-up infantry, their strongest face-up infantry], both destructible.
function charge(g, t) {
  const inf = (us) => us.filter(u => killable(g, u, t) && g.type(u) === 'Infanterie').sort((a, b) => g.vals(a, t)[1] - g.vals(b, t)[1]);
  const mine = inf(g.allies(t)), theirs = inf(g.foes(t));
  return mine.length && theirs.length ? [mine[0], theirs[theirs.length - 1]] : null;
}
const UNITS = ['cuirasse', 'destroyer', 'destroyer', 'sous_marin', 'dauntless', 'hellcat', 'marines', 'marines', 'lance_flammes', 'seabees', 'cargo'];
const ORDERS = ['bombardement', 'ravitaillement', 'guetteurs', 'fumee'];
// Asymmetric: carriers, amtracs and code talkers against battleships, garrisons that never surrender and banzai charges.
PACKS.pacifique.decks = [
  [...UNITS, 'porte_avions', 'corsair', 'lvt', 'code_talkers', ...ORDERS, 'turkey_shoot'],
  [...UNITS, 'yamato', 'garnison', 'garnison', 'tireurs', ...ORDERS, 'banzai'],
];
// Campaign powers: once per battle, free (they do not use up the turn's action). targets(g) + onPlay(g, null, move).
PACKS.pacifique.powers = {
  hypo: {
    name: { fr: "Station Hypo", en: "Station Hypo" },
    text: { fr: "Codes japonais percés : retourne toutes les cartes face cachée adverses.", en: "Japanese codes broken: flip every enemy face-down card." },
    targets: g => g.theirs().some(x => x.u.down) ? [{ args: {}, steps: [] }] : [],
    onPlay: g => g.terrains().forEach(X => [...X.side[1 - g.p]].forEach(u => { if (u.down) g.flip(u.id, null); })),
  },
  tf58: {
    name: { fr: "Task Force 58", en: "Task Force 58" },
    text: { fr: "Pioche 2 cartes.", en: "Draw 2 cards." },
    targets: () => [{ args: {}, steps: [] }],
    onPlay: g => g.draw(2),
  },
  flotte: {
    name: { fr: "Feu de la flotte", en: "Fleet Gunfire" },
    text: { fr: "Détruit une unité adverse de valeur totale 4 ou moins (pas dans les grottes).", en: "Destroy an enemy unit worth 4 or less in total (not in caves)." },
    targets: g => g.hits(g.theirs().filter(x => killable(g, x.u, x.t) && g.sum(g.vals(x.u, x.t)) <= 4)),
    onPlay: (g, me, m) => g.destroy(m.u),
  },
  contournement: {
    name: { fr: "Saute-mouton", en: "Leapfrogging" },
    text: { fr: "On contourne la place forte : déplace une de tes unités vers n'importe quel terrain.", en: "Bypass the stronghold: move one of your units to any terrain." },
    targets: g => {
      const out = [];
      for (const x of g.mine()) for (const to of g.live())
        if (to !== x.t && g.count(to) < g.cap(to) && !g.blocks(x.u, x.t, to)) out.push({ args: { u: x.u.id, t2: to }, steps: [g.U(x.u.id), g.T(to)] });
      return out;
    },
    onPlay: (g, me, m) => g.move(m.u, m.t2),
  },
  tenir: {
    name: { fr: "Tenir à tout prix", en: "Hold at All Costs" },
    text: { fr: "Jusqu'à ton prochain tour, l'adversaire ne peut pas te prendre un terrain que tu tiens.", en: "Until your next turn, the opponent can't take a terrain you hold." },
    targets: g => g.smoked() ? [] : [{ args: {}, steps: [] }],
    onPlay: g => g.smoke(),
  },
};
// Campaign rewards rolled as battles open: 30 % veteran, 25 % new card, 25 % power, 20 % nothing.
PACKS.pacifique.rewards = {
  vets: ['marines', 'hellcat', 'dauntless', 'destroyer', 'cuirasse', 'lance_flammes'],
  cards: ['avenger', 'corpsman', 'corsair', 'code_talkers'],
  powers: ['hypo', 'tf58', 'flotte', 'contournement', 'tenir'],
};
}
if (typeof module !== 'undefined') module.exports = PACKS.pacifique;
