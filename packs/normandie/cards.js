'use strict';
// Normandie 1944 — cards, decks, campaign powers and rewards. Plain data plus hooks (functions receiving `g`, the engine helper: see README).
(globalThis.PACKS = globalThis.PACKS || {}).normandie = globalThis.PACKS.normandie || {};
{ // block: in the browser every <script> shares one global scope, keep helpers local
// A card: name / enemy name (the AI side) / type / values [4 attributes] / text, plus optional hooks:
//   targets(g, t, card) + onPlay(g, me, move)  power when played on terrain t (units) — orders: targets(g, card)
//   aura(g, unit, t, v)    changes the values of any unit on the board (called for every unit)
//   extraSlot · onTurnStart(g, me) · surplus · onFlipped(g, me, by) · immune · tags
PACKS.normandie.cards = {
  sherman: {
    name: { fr: "Sherman M4", en: "Sherman M4" }, enemy: { fr: "Panzer IV", en: "Panzer IV" },
    type: "Char", v: [3,0,0,1],
  },
  firefly: {
    name: { fr: "Sherman Firefly", en: "Sherman Firefly" }, enemy: { fr: "StuG III", en: "StuG III" },
    type: "Char", v: [2,0,0,0],
    text: { fr: "À la pose : détruit un Char adverse de valeur Char 2 ou moins sur ce terrain.", en: "On deploy: destroy an enemy Tank with Armour 2 or less on this terrain." },
    targets: (g, t) => g.safe(t) ? [] : g.hit(g.foes(t).filter(e => !e.down && !g.tough(e) && g.type(e) === 'Char' && g.vals(e, t)[0] <= 2), t),
    onPlay: (g, me, m) => { if (m.u != null) g.destroy(m.u); },
  },
  section: {
    name: { fr: "Section d'infanterie", en: "Rifle Squad" }, enemy: { fr: "Grenadiers", en: "Grenadiers" },
    type: "Infanterie", v: [0,3,0,1],
  },
  rangers: {
    name: { fr: "Rangers", en: "Rangers" }, enemy: { fr: "Gebirgsjäger", en: "Gebirgsjäger" },
    type: "Infanterie", v: [0,2,0,1],
    text: { fr: "Peut occuper un 5e emplacement quand le terrain est plein.", en: "Can take a 5th slot when the terrain is full." },
    extraSlot: true,
  },
  mortiers: {
    name: { fr: "Mortiers", en: "Mortars" }, enemy: { fr: "Granatwerfer", en: "Granatwerfer" },
    type: "Infanterie", v: [0,2,0,0],
    text: { fr: "À la pose : une unité adverse sur ce terrain perd 1 Infanterie.", en: "On deploy: an enemy unit on this terrain loses 1 Infantry." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => !e.down), t),
    onPlay: (g, me, m) => { if (m.u != null) g.malus(m.u); },
  },
  paras: {
    name: { fr: "Parachutistes", en: "Paratroopers" }, enemy: { fr: "Fallschirmjäger", en: "Fallschirmjäger" },
    type: "Infanterie", v: [0,2,1,0],
    text: { fr: "Posés face cachée, ils se retournent seuls au début de ton tour suivant.", en: "Played face down, they flip themselves at the start of your next turn." },
    onTurnStart: (g, me) => { if (me.down) g.flip(me.id, null); },
  },
  p47: {
    name: { fr: "P-47 Thunderbolt", en: "P-47 Thunderbolt" }, enemy: { fr: "Fw 190", en: "Fw 190" },
    type: "Air", v: [1,0,2,0],
    text: { fr: "À la pose : retourne une carte adverse sur ce terrain, dans un sens ou dans l'autre (pour la mettre face cachée : valeur totale 2 ou moins, sur un terrain que l'adversaire ne tient pas).", en: "On deploy: flip an enemy card on this terrain, either way (to turn it face down: worth 2 or less in total, on a terrain the enemy does not hold)." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => g.turnable(e, t, 2))),
    onPlay: (g, me, m) => { if (m.u != null) g.turnOver(m.u, me.id); },
  },
  spitfire: {
    name: { fr: "Spitfire", en: "Spitfire" }, enemy: { fr: "Bf 109", en: "Bf 109" },
    type: "Air", v: [0,0,3,0],
    text: { fr: "Les unités Air adverses sur ce terrain perdent 1 Air.", en: "Enemy Air units on this terrain lose 1 Air." },
    aura: (g, u, t, v) => { if (g.type(u) === 'Air' && g.side(t, 1 - u.owner).some(e => !e.down && e.key === 'spitfire')) v[2] = Math.max(0, v[2] - 1); },
  },
  genie: {
    name: { fr: "Génie militaire", en: "Combat Engineers" }, enemy: { fr: "Pionniers", en: "Pioniere" },
    type: "Soutien", v: [1,1,0,1],
    text: { fr: "À la pose : déplace une de tes unités vers un terrain adjacent.", en: "On deploy: move one of your units to an adjacent terrain." },
    targets: (g, t) => {
      const out = [];
      for (const x of g.mine()) for (const to of g.live())
        if (g.canMove(x.u, x.t, to) && (to !== t || g.count(t) + 1 < g.cap(t))) out.push({ args: { u: x.u.id, t2: to }, steps: [g.U(x.u.id), g.T(to)] });
      return out;
    },
    onPlay: (g, me, m) => { if (m.u != null) g.move(m.u, m.t2); },
  },
  officier: {
    name: { fr: "Officier de liaison", en: "Liaison Officer" }, enemy: { fr: "Officier de liaison", en: "Verbindungsoffizier" },
    type: "Soutien", v: [0,1,0,2],
    text: { fr: "Ton surplus sur ce terrain compte +2 en cas de contestation.", en: "Your surplus on this terrain counts +2 in a contest." },
    surplus: 2,
  },
  resistance: {
    name: { fr: "Résistance", en: "Resistance" }, enemy: { fr: "Contre-espions", en: "Abwehr Agents" },
    type: "Soutien", v: [0,1,0,2],
    text: { fr: "Retournée par une unité adverse : détruit cette unité.", en: "Flipped by an enemy unit: destroy that unit." },
    onFlipped: (g, me, by) => { if (by == null) return; const b = g.find(by); if (b && b.p !== me.owner) g.destroy(by); },
  },
  observateur: {
    name: { fr: "Observateur", en: "Forward Observer" }, enemy: { fr: "Observateur", en: "Artilleriebeobachter" },
    type: "Soutien", v: [0,0,0,2],
    text: { fr: "Tes Artilleries peuvent viser un terrain non adjacent à tes unités.", en: "Your Artillery can target a terrain not adjacent to your units." },
    tags: ['spotter'],
  },
  artillerie: {
    name: { fr: "Artillerie lourde", en: "Heavy Artillery" }, enemy: { fr: "Artillerie lourde", en: "Heavy Artillery" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Détruit une unité adverse non Char de valeur totale 3 ou moins (terrain où tu as une unité, ou adjacent).", en: "Destroy an enemy non-Tank unit worth 3 or less in total (terrain where you have a unit, or adjacent)." },
    targets: g => {
      const far = g.mine().some(x => !x.u.down && g.has(x.u, 'spotter')) || g.terrains().some((X, i) => g.traitHas(i, 'highGround') && (X.holder === g.p || X.captured === g.p));
      return g.hits(g.theirs().filter(x => !g.safe(x.t) && !x.u.down && g.type(x.u) !== 'Char' && g.sum(g.vals(x.u, x.t)) <= 3 && (far || g.mine().some(m => m.t === x.t || g.adjacent(m.t, x.t)))));
    },
    onPlay: (g, me, m) => g.destroy(m.u),
  },
  bombardement: {
    name: { fr: "Bombardement aérien", en: "Air Strike" }, enemy: { fr: "Bombardement aérien", en: "Air Strike" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Si tu as 2 Air devant un terrain : détruit une unité adverse sur ce terrain.", en: "If you have 2 Air on a terrain: destroy an enemy unit there." },
    targets: g => g.hits(g.theirs().filter(x => !g.safe(x.t) && !g.tough(x.u) && g.totals(x.t)[2] >= 2)),
    onPlay: (g, me, m) => g.destroy(m.u),
  },
  recon: {
    name: { fr: "Reconnaissance", en: "Reconnaissance" }, enemy: { fr: "Reconnaissance", en: "Reconnaissance" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Retourne une carte, une des tiennes face cachée ou une adverse dans un sens ou dans l'autre (pour la mettre face cachée : valeur totale 2 ou moins, sur un terrain que l'adversaire ne tient pas). Pioche 1.", en: "Flip a card, one of your face-down ones or an enemy one either way (to turn it face down: worth 2 or less in total, on a terrain the enemy does not hold). Draw 1." },
    targets: g => g.hits([...g.mine().filter(x => x.u.down), ...g.theirs().filter(x => g.turnable(x.u, x.t, 2))]),
    onPlay: (g, me, m) => { g.turnOver(m.u, null); g.draw(1); },
  },
  opsecrete: {
    name: { fr: "Opération secrète", en: "Covert Operation" }, enemy: { fr: "Opération secrète", en: "Covert Operation" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Pose 2 cartes face cachée sur deux terrains différents.", en: "Play 2 cards face down on two different terrains." },
    targets: (g, c) => {
      const H = g.hand(), T = g.live(), out = [];
      for (const a of H) for (const b of H) if (a !== b && a !== c && b !== c)
        for (const t1 of T) for (const t2 of T) if (t1 !== t2 && g.count(t1) < g.cap(t1) && g.count(t2) < g.cap(t2))
          out.push({ args: { a: a.id, t1, b: b.id, t2 }, steps: [g.H(a.id), g.T(t1), g.H(b.id), g.T(t2)] });
      return out;
    },
    onPlay: (g, me, m) => { g.putDown(m.a, m.t1); g.putDown(m.b, m.t2); },
  },
  sabotage: {
    name: { fr: "Sabotage", en: "Sabotage" }, enemy: { fr: "Sabotage", en: "Sabotage" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Renvoie dans la main de son propriétaire une carte adverse face cachée, ou une unité adverse de valeur totale 2 ou moins.", en: "Return to its owner's hand an enemy face-down card, or an enemy unit worth 2 or less in total." },
    targets: g => g.hits(g.theirs().filter(x => x.u.down || g.sum(g.vals(x.u, x.t)) <= 2)),
    onPlay: (g, me, m) => g.toHand(m.u),
  },
  echange: {
    name: { fr: "Échange de front", en: "Front Swap" }, enemy: { fr: "Échange de front", en: "Front Swap" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Échange deux de tes unités situées sur deux terrains différents.", en: "Swap two of your units on two different terrains." },
    targets: g => {
      const mine = g.mine(), out = [];
      for (const x of mine) for (const y of mine) if (x.t !== y.t && !g.blocks(x.u, x.t, y.t) && !g.blocks(y.u, x.t, y.t))
        out.push({ args: { a: x.u.id, b: y.u.id }, steps: [g.U(x.u.id), g.U(y.u.id)] });
      return out;
    },
    onPlay: (g, me, m) => g.swap(m.a, m.b),
  },
  redeploy: {
    name: { fr: "Redéploiement", en: "Redeployment" }, enemy: { fr: "Redéploiement", en: "Redeployment" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Déplace jusqu'à 2 de tes unités vers un même terrain adjacent.", en: "Move up to 2 of your units to the same adjacent terrain." },
    targets: g => {
      const mine = g.mine(), out = [];
      for (const d of g.live()) {
        const cand = mine.filter(x => g.canMove(x.u, x.t, d));
        for (const x of cand) {
          out.push({ args: { us: [x.u.id], t: d }, steps: [g.U(x.u.id), g.T(d)] });
          if (g.cap(d) - g.count(d) >= 2) for (const y of cand) if (x !== y) out.push({ args: { us: [x.u.id, y.u.id], t: d }, steps: [g.U(x.u.id), g.U(y.u.id), g.T(d)] });
        }
      }
      return out;
    },
    onPlay: (g, me, m) => m.us.forEach(id => g.move(id, m.t)),
  },
  fumee: {
    name: { fr: "Écran de fumée", en: "Smoke Screen" }, enemy: { fr: "Écran de fumée", en: "Smoke Screen" },
    type: "Ordre", v: [0,0,0,0],
    text: { fr: "Jusqu'à ton prochain tour, l'adversaire ne peut pas te prendre un terrain que tu tiens.", en: "Until your next turn, the enemy can't take a terrain you hold." },
    targets: () => [{ args: {}, steps: ['play'] }],
    onPlay: g => g.smoke(),
  },
  // Campaign rewards: player-only cards, never in the AI's deck.
  jumbo: {
    name: { fr: "Sherman Jumbo", en: "Sherman Jumbo" }, enemy: { fr: "Sherman Jumbo", en: "Sherman Jumbo" },
    type: "Char", v: [4,0,0,1],
    text: { fr: "Blindage renforcé : ne peut pas être détruit.", en: "Up-armoured: cannot be destroyed." },
    immune: true,
  },
  typhoon: {
    name: { fr: "Hawker Typhoon", en: "Hawker Typhoon" }, enemy: { fr: "Hawker Typhoon", en: "Hawker Typhoon" },
    type: "Air", v: [0,0,2,0],
    text: { fr: "À la pose : détruit un Char adverse de valeur totale 3 ou moins sur ce terrain.", en: "On deploy: destroy an enemy Tank worth 3 or less in total on this terrain." },
    targets: (g, t) => g.safe(t) ? [] : g.hit(g.foes(t).filter(e => !e.down && !g.tough(e) && g.type(e) === 'Char' && g.sum(g.vals(e, t)) <= 3), t),
    onPlay: (g, me, m) => { if (m.u != null) g.destroy(m.u); },
  },
  commandos: {
    name: { fr: "Commandos", en: "Commandos" }, enemy: { fr: "Commandos", en: "Commandos" },
    type: "Infanterie", v: [0,2,0,1],
    text: { fr: "À la pose : détruit une carte face cachée adverse sur ce terrain, ou retourne face cachée une unité adverse de valeur totale 2 ou moins si l'adversaire ne tient pas ce terrain.", en: "On deploy: destroy an enemy face-down card on this terrain, or turn face down an enemy unit worth 2 or less in total if the enemy does not hold this terrain." },
    targets: (g, t) => g.hit(g.foes(t).filter(e => g.huntable(e, t, 2))),
    onPlay: (g, me, m) => { if (m.u != null) g.hunt(m.u); },
  },
  ambulance: {
    name: { fr: "Ambulance", en: "Ambulance" }, enemy: { fr: "Ambulance", en: "Ambulance" },
    type: "Soutien", v: [0,1,0,1],
    text: { fr: "À la pose : pioche 2 cartes.", en: "On deploy: draw 2 cards." },
    onPlay: g => g.draw(2),
  },
};
const UNITS14 = ['sherman', 'sherman', 'section', 'section', 'firefly', 'rangers', 'mortiers', 'paras', 'p47', 'spitfire', 'genie', 'officier', 'resistance', 'observateur'];
PACKS.normandie.decks = [
  [...UNITS14, 'artillerie', 'bombardement', 'recon', 'opsecrete', 'redeploy', 'fumee'],
  [...UNITS14, 'artillerie', 'bombardement', 'recon', 'sabotage', 'echange', 'fumee'],
];
// Campaign powers: once per battle, free (they do not use up the turn's action). targets(g) + onPlay(g, null, move).
PACKS.normandie.powers = {
  naval: {
    name: { fr: "Appui naval", en: "Naval Support" },
    text: { fr: "Détruit une unité adverse de valeur totale 4 ou moins (pas sur un bunker).", en: "Destroy an enemy unit worth 4 or less in total (not on a bunker)." },
    targets: g => g.hits(g.theirs().filter(x => !g.safe(x.t) && !g.tough(x.u) && g.sum(g.vals(x.u, x.t)) <= 4)),
    onPlay: (g, me, m) => g.destroy(m.u),
  },
  renforts: {
    name: { fr: "Renforts", en: "Reinforcements" },
    text: { fr: "Pioche 2 cartes.", en: "Draw 2 cards." },
    targets: () => [{ args: {}, steps: [] }],
    onPlay: g => g.draw(2),
  },
  renseignement: {
    name: { fr: "Renseignement", en: "Intelligence" },
    text: { fr: "Retourne toutes les cartes face cachée adverses, puis retourne face cachée une unité adverse au choix, sur un terrain qu'il ne tient pas.", en: "Flip every enemy face-down card, then turn an enemy unit of your choice face down, on a terrain the enemy does not hold." },
    targets: g => g.hits(g.theirs().filter(x => x.u.down || g.concealable(x.u))),
    onPlay: (g, me, m) => { g.revealAll(); const f = g.find(m.u); if (f && g.concealable(f.u)) g.conceal(m.u); },
  },
  barrage: {
    name: { fr: "Tir de barrage", en: "Barrage" },
    text: { fr: "Chaque unité adverse sur un terrain perd 1 Infanterie.", en: "Every enemy unit on a terrain loses 1 Infantry." },
    targets: g => g.live().filter(t => g.foes(t).length).map(t => ({ args: { t }, steps: [g.T(t)] })),
    onPlay: (g, me, m) => g.foes(m.t).forEach(u => g.malus(u.id)),
  },
  couverture: {
    name: { fr: "Couverture aérienne", en: "Air Cover" },
    text: { fr: "Jusqu'à ton prochain tour, l'adversaire ne peut pas te prendre un terrain que tu tiens.", en: "Until your next turn, the opponent can't take a terrain you hold." },
    targets: g => g.smoked() ? [] : [{ args: {}, steps: [] }],
    onPlay: g => g.smoke(),
  },
};
// Campaign rewards rolled as battles open: 30 % veteran, 25 % new card, 25 % power, 20 % nothing.
PACKS.normandie.rewards = {
  vets: ['sherman', 'section', 'spitfire', 'p47', 'rangers', 'mortiers'],
  cards: ['jumbo', 'typhoon', 'commandos', 'ambulance'],
  powers: ['naval', 'renforts', 'renseignement', 'barrage', 'couverture'],
};
}
if (typeof module !== 'undefined') module.exports = PACKS.normandie;
