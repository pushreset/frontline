// GDD "prochaines étapes" #2: AI vs AI, measure first-player advantage, length, timeout rate.
// Usage: node sim.cjs [battles=1000] [fixed] [pack]    ("fixed" = the pack's 3 default terrains)
//        node sim.cjs 200 niveaux [pack]             duels between difficulty levels + behaviour profile
//        node sim.cjs 1 partie easy hard [pack]      one battle, told move by move
//        node sim.cjs 300 campagne [pack]            balance of each campaign battle, runs with vs without rewards
//        node sim.cjs 300 empreinte                  fingerprint: one hash of 350 seeded battles (refactor safety net)
// [pack] defaults to normandie.
const assert = require('assert');
const PACKS = require('./packs/index.cjs');
const E = require('./engine.js'), C = require('./campaign.js'), I = require('./i18n.js');
const PACK = Object.keys(PACKS).find(id => process.argv.includes(id)) || 'normandie';

// Every pack: texts in FR and EN, terrains/cards/powers referenced exist, a campaign graph where every
// battle is reachable from a start and leads to an end, time moving forward on every link.
assert.deepEqual(Object.keys(I.UI.en).sort(), Object.keys(I.UI.fr).sort(), 'same UI keys in FR and EN');
assert.deepEqual(Object.keys(I.LOG.en).sort(), Object.keys(I.LOG.fr).sort(), 'same log events in FR and EN');
for (const [id, P] of Object.entries(PACKS)) {
  const both = (o, what) => assert(o && o.fr && o.en, `${id}: FR and EN for ${what}`);
  E.use(id); C.use(id);
  for (const k of ['title', 'sub', 'dates', 'finale']) both(P[k], k);
  if (!P.hidden) { both(P.era, 'era'); assert(P.era.key && P.era.years, `${id}: era key and years`); }
  assert(P.attrs.fr.length === 4 && P.attrs.en.length === 4 && P.icons.length === 4, `${id}: 4 attributes`);
  for (const [k, ty] of Object.entries(P.types)) both(ty, `type ${k}`);
  for (const [k, c] of Object.entries(P.cards)) { both(c.name, k); if (c.text) both(c.text, `${k} text`); assert(P.types[c.type], `${id}: type of ${k}`); assert(c.v.length === 4, `${id}: values of ${k}`); }
  for (const [k, t] of Object.entries(P.terrains)) { both(t.name, k); both(t.text, `${k} text`); assert(P.traits[t.trait], `${id}: trait ${t.trait} of ${k}`); }
  for (const [k, w] of Object.entries(P.powers || {})) { both(w.name, k); both(w.text, `${k} text`); }
  for (const d of P.decks) d.forEach(k => assert(P.cards[k], `${id}: deck card ${k}`));
  P.quick.forEach(k => assert(P.terrains[k], `${id}: quick terrain ${k}`));
  for (const k of [...C.VETS, ...C.CARDS]) assert(P.cards[k], `${id}: reward card ${k}`);
  for (const k of C.POWERS) assert(P.powers[k], `${id}: power ${k}`);
  for (const b of C.BATTLES) {
    b.pool.forEach(k => assert(P.terrains[k], `${id}/${b.id}: unknown terrain ${k}`));
    for (const k of ['name', 'date', 'brief']) both(b[k], `${b.id} ${k}`);
    for (const n of b.next) assert(C.byId[n] && C.byId[n].day >= b.day, `${id}: ${b.id} -> ${n} goes back in time`);
    assert([0, 1, undefined].includes(b.first), `${id}/${b.id}: first is 0 (player), 1 (AI) or absent (coin toss)`);
    (b.aiCards || []).forEach(k => assert(P.cards[k], `${id}/${b.id}: unknown AI card ${k}`));
  }
  assert.equal(C.BATTLES.filter(b => C.status(b.id, []) === 'gone').length, 0, `${id}: every battle reachable at the start`);
}
{ // Total victory (newGame's third argument): the player plays on after two captures, the AI never does.
  E.use('normandie');
  const at = (total, caps, turn) => { // a battle with these terrains captured, as judged at the start of `turn`'s turn
    const s = E.newGame(undefined, {}, { total });
    s.terrains.forEach((T, t) => { T.captured = caps[t]; });
    s.turn = 1 - turn; E.play(s, { kind: 'pass' }); // the pass hands the turn over
    return s.winner;
  };
  assert.equal(at(false, [0, 0, null], 0), 0, 'old rule: two terrains end the battle');
  assert.equal(at(true, [0, 0, null], 0), null, 'total: two terrains, the battle goes on');
  assert.equal(at(true, [0, 0, null], 1), null, 'total: the AI plays on too');
  assert.equal(at(true, [0, 0, 0], 0), 0, 'total: third terrain to the player');
  assert.equal(at(true, [0, 0, 1], 1), 0, 'total: third terrain to the AI, the player still wins');
  assert.equal(at(true, [1, 1, null], 1), 1, 'total: the AI wins on two');
  // Who starts (newGame's `first`): that side takes the first turn, night falls after E.TURNS turns each either way.
  for (const first of [0, 1]) {
    const s = E.newGame(undefined, {}, { first });
    assert.equal(s.turn, first, 'the first player takes the first turn');
    for (let i = 0; i < 2 * E.TURNS; i++) { assert.equal(s.winner, null, 'no night before the last turn'); E.play(s, { kind: 'pass' }); }
    assert(s.timeout && s.players.every(P => P.turns === E.TURNS), 'night after the last turn');
  }
}
{ // Normandy map: 3 beaches, runs of 8-10 battles ending in Paris, sibling branches closed on victory.
  E.use('normandie'); C.use('normandie');
  assert.deepEqual([...C.roots].sort(), ['omaha', 'sword', 'utah']);
  const lens = new Set(), walk = (id, n) => C.byId[id].next.length ? C.byId[id].next.forEach(x => walk(x, n + 1)) : (assert.equal(id, 'paris'), lens.add(n));
  C.roots.forEach(r => walk(r, 1));
  assert(Math.min(...lens) >= 8 && Math.max(...lens) <= 10, `run length ${[...lens]}`);
  const path = ['omaha', 'bayeux'];
  assert.equal(C.status('pointe_hoc', path), 'gone', 'sibling branch closed on victory');
  assert.equal(C.status('epsom', path), 'open');
  assert.equal(C.status('cote_112', path), 'fog');
}

// Rule check: a filled terrain is only Tenu, and falls at the holder's NEXT turn start.
{
  const s = E.newGame();
  const P = s.players[0];
  s.terrains[0].side[0] = ['sherman', 'sherman', 'section'].map((key, i) => ({ id: 100 + i, key, owner: 0, down: false, malus: 0 }));
  P.hand = [{ id: 200, key: 'rangers' }];
  E.play(s, E.moves(s).find(m => m.kind === 'deploy' && m.t === 0));
  assert.equal(s.terrains[0].holder, 0);
  assert.equal(s.terrains[0].captured, null, 'no immediate capture');
  s.players[1].hand = [{ id: 201, key: 'fumee' }]; // AI can only waste its grace turn
  E.play(s, E.moves(s).find(m => m.kind === 'supply'));
  assert.equal(s.terrains[0].captured, 0, 'captured at start of next turn');
}

// Rule check: a face-down card is worth 0 until its owner spends an action to reveal it.
{
  const s = E.newGame();
  s.players[0].hand = [{ id: 300, key: 'sherman' }];
  E.play(s, E.moves(s).find(m => m.kind === 'hidden' && m.t === 1));
  assert.deepEqual(E.totals(s, 1, 0), [0, 0, 0, 0], 'face-down is worth nothing');
  s.players[1].hand = [{ id: 301, key: 'fumee' }];
  E.play(s, E.moves(s).find(m => m.kind === 'supply'));
  E.play(s, E.moves(s).find(m => m.kind === 'reveal' && m.u === 300));
  assert.deepEqual(E.totals(s, 1, 0), [3, 0, 0, 1], 'revealed card gets its values back');
  assert.equal(s.turn, 1, 'revealing costs the action');
}

// "Missing" rows of the battle screen: E.lack is what the UI shows and what decides fills (so the capture).
{
  const mk = (key, owner, id) => ({ id, key, owner, down: false, malus: 0 });
  const s = E.newGame(['aerodrome', 'pont', 'bocage']);
  assert.deepEqual(E.lack(s, 0, 0), E.thr(s, 0), 'empty terrain: every threshold is missing');
  assert.equal(E.lack(s, 2, 1)[2], 0, 'a threshold of 0 is never missing');
  s.terrains[1].side = [[mk('sherman', 0, 700)], [mk('section', 1, 701)]];
  s.terrains[2].side[0] = [mk('p47', 0, 702)];
  assert.deepEqual(E.lack(s, 1, 1), [3, 0, 1, 0], 'Pont, Grenadiers: the AI misses Char 3, Air 1');
  assert.deepEqual(E.lack(s, 1, 0), [0, 1, 1, 0], 'Pont, Sherman: you miss Inf 1, Air 1');
  assert.deepEqual(E.lack(s, 2, 0), [1, 3, 0, 1], 'Bocage, P-47: hedgerows only cut Tank units, its Char 1 counts');
  s.terrains[2].side[1] = [mk('sherman', 1, 703)];
  assert.deepEqual(E.lack(s, 2, 1), [0, 3, 0, 0], 'Bocage, Panzer IV: 3 Char - 1 behind the hedgerows');
  assert.deepEqual(E.totals(s, 2, 1, true), [3, 0, 0, 1], 'noTrait: totals without the terrain modifier');
  // Preview of a pending power (what index.html does): play it on the blind copy, the game itself does not move.
  s.players[0].hand = [{ id: 710, key: 'mortiers' }];
  const before = JSON.stringify(s), c = E.blind(s, 0);
  E.play(c, E.moves(c).find(m => m.kind === 'deploy' && m.t === 1 && m.u === 701));
  assert.deepEqual(E.lack(c, 1, 0), [0, 0, 1, 0], 'preview: Mortiers fill the Infantry of the Pont');
  assert.equal(JSON.stringify(s), before, 'preview leaves the game untouched');
}

// Rule check: on a full side, a unit can be deployed by discarding one of your own.
{
  const s = E.newGame();
  s.terrains[1].side[0] = ['spitfire', 'observateur', 'sherman'].map((key, i) => ({ id: 400 + i, key, owner: 0, down: false, malus: 0 }));
  s.players[0].hand = [{ id: 410, key: 'section' }];
  const m = E.moves(s).find(m => m.kind === 'deploy' && m.t === 1 && m.rep === 401);
  assert(m, 'replace move offered on a full side');
  E.play(s, m);
  assert.deepEqual(s.terrains[1].side[0].map(u => u.key), ['spitfire', 'sherman', 'section']);
  assert(s.players[0].discard.some(c => c.id === 401), 'replaced unit is discarded');
  assert.equal(s.terrains[1].holder, 0, 'Pont 3/1/1/1 now filled');
}

// Rewards: veteran +1, Jumbo indestructible, Typhoon, free single-use power.
{
  const mk = (keys, owner, base, extra = {}) => keys.map((key, i) => ({ id: base + i, key, owner, down: false, malus: 0, ...extra }));
  let s = E.newGame(undefined, { cards: [{ key: 'sherman', vet: true }], powers: ['renforts', 'naval'] });
  s.terrains[0].side[0] = mk(['sherman'], 0, 1000, { vet: true });
  assert.deepEqual(E.totals(s, 0, 0), [3, 0, 0, 1], 'veteran Sherman: 4 Char, -1 in the Bocage');
  s.terrains[1].side[0] = mk(['sherman'], 0, 1001, { vet: true });
  assert.equal(E.totals(s, 1, 0)[0], 4, 'veteran Sherman: 4 Char');
  s.players[0].hand.length = 3; // hand cap is 7
  const hand = s.players[0].hand.length;
  E.play(s, E.moves(s).find(m => m.kind === 'power' && m.w === 'renforts'));
  assert.equal(s.turn, 0, 'a power does not use the turn');
  assert.equal(s.players[0].hand.length, hand + 2, 'Renforts draws 2');
  assert(!E.moves(s).some(m => m.w === 'renforts'), 'a power is used once per battle');
  s = E.newGame();
  s.terrains[1].side[0] = mk(['jumbo'], 0, 1100);
  s.terrains[1].side[1] = mk(['spitfire', 'spitfire'], 1, 1110);
  s.turn = 1; s.players[1].hand = [{ id: 1120, key: 'bombardement' }, { id: 1121, key: 'firefly' }];
  assert(!E.moves(s).some(m => m.u === 1100), 'Jumbo cannot be destroyed');
  s = E.newGame();
  s.terrains[1].side[1] = mk(['sherman', 'firefly'], 1, 1200);
  s.players[0].hand = [{ id: 1210, key: 'typhoon' }];
  const ty = E.moves(s).filter(m => m.kind === 'deploy' && m.t === 1 && m.u != null).map(m => m.u);
  assert.deepEqual(ty, [1201], 'Typhoon: StuG (2) yes, Panzer IV (4) no');
}

// Test pack: mechanics Normandy does not have work through the same hooks, with no engine change.
{
  E.use('test');
  const mk = (keys, owner, base) => keys.map((key, i) => ({ id: base + i, key, owner, down: false, malus: 0 }));
  const s = E.newGame(['plaine', 'hauteur', 'gue']);
  s.terrains[0].side[1] = mk(['sagittarii'], 1, 500);
  s.players[0].hand = [{ id: 510, key: 'equites' }];
  const push = E.moves(s).find(m => m.kind === 'deploy' && m.t === 0 && m.u === 500);
  assert(push && push.t2 === 1, 'Charge pushes an enemy unit to a neighbouring terrain');
  E.play(s, push);
  assert.equal(s.terrains[1].side[1][0].id, 500, 'pushed');
  const t = E.newGame(['plaine', 'hauteur', 'gue']);
  t.terrains[0].side[1] = mk(['legionnaire', 'legionnaire'], 1, 600);
  t.terrains[1].side[1] = mk(['legionnaire'], 1, 610);
  for (const T of t.terrains) for (const u of T.side[1]) u.malus = 2; // worth 2: in Arrow Storm range
  t.players[0].hand = [{ id: 620, key: 'fleches' }];
  const targets = E.moves(t).filter(m => m.kind === 'order').map(m => m.u);
  assert.deepEqual(targets, [610], 'Testudo: legionaries side by side are immune, the lone one is not');
  E.use('normandie');
}

// Verdun: a defensive campaign then a counter-offensive, attrition (malus), mines, gas, deep dugouts.
{
  E.use('verdun'); C.use('verdun');
  assert.deepEqual([...C.roots].sort(), ['bois_caures', 'herbebois']);
  const lens = new Set(), walk = (id, n) => C.byId[id].next.length ? C.byId[id].next.forEach(x => walk(x, n + 1)) : (assert.equal(id, 'louvemont'), lens.add(n));
  C.roots.forEach(r => walk(r, 1));
  assert(Math.min(...lens) >= 7 && Math.max(...lens) <= 9, `Verdun run length ${[...lens]}`);
  assert(C.BATTLES.every(b => !!b.defend === (b.day < 200)), 'defend until the summer, attack in the autumn');
  const mk = (keys, owner, base, down = false) => keys.map((key, i) => ({ id: base + i, key, owner, down, malus: 0 }));
  const inf = (s, t, u) => E.vals(s, u, t)[1];
  // Mine: revealing the tunnellers destroys the strongest enemy unit there.
  let s = E.newGame(['boyau', 'cote', 'depot']);
  s.terrains[0].side[0] = mk(['sapeurs'], 0, 700, true);
  s.terrains[0].side[1] = mk(['poilus', 'officier'], 1, 710);
  s.terrains[0].side[1][0].malus = 1; // worn poilus: worth 3, in range, and more Infantry than the captain
  s.turn = 0; E.play(s, { kind: 'reveal', u: 700 });
  assert.deepEqual(s.terrains[0].side[1].map(u => u.key), ['officier'], 'the mine blows the strongest enemy unit');
  // Gas: every face-up unit on both sides loses 1 Infantry, engineers excepted.
  s = E.newGame(['boyau', 'cote', 'depot']);
  s.terrains[0].side[0] = mk(['poilus', 'terrassiers'], 0, 720);
  s.terrains[0].side[1] = mk(['poilus'], 1, 730);
  s.turn = 0; s.players[0].hand = [{ id: 740, key: 'gaz' }];
  E.play(s, { kind: 'order', c: 740, t: 0 });
  assert.deepEqual([...s.terrains[0].side[0], ...s.terrains[0].side[1]].map(u => u.malus), [1, 0, 1], 'gas hits both sides, not the engineers');
  // Deep dugouts: the first loss does not count in a trench.
  s = E.newGame(['tranchee', 'boyau', 'cote']);
  s.terrains[0].side[0] = mk(['poilus'], 0, 750);
  s.terrains[0].side[0][0].malus = 1; assert.equal(inf(s, 0, s.terrains[0].side[0][0]), 3, 'trench: first loss ignored');
  s.terrains[0].side[0][0].malus = 2; assert.equal(inf(s, 0, s.terrains[0].side[0][0]), 2, 'trench: second loss counts');
  // No man's land: at the start of a side's turn, its strongest infantry there wears down (trait onTurnStart).
  s = E.newGame(['no_mans_land', 'boyau', 'cote'], {}, { first: 0 });
  s.terrains[0].side[1] = mk(['poilus', 'officier'], 1, 760);
  E.play(s, { kind: 'pass' });
  assert.deepEqual(s.terrains[0].side[1].map(u => u.malus), [1, 0], 'attrition at the start of the AI turn, on its strongest infantry');
  // Defence: without a majority at nightfall, the defender wins; the player when the scenario says so.
  for (const defender of [0, 1]) {
    s = E.newGame(['fort', 'boyau', 'cote'], {}, { defender });
    while (s.winner === null) E.play(s, { kind: 'pass' });
    assert(s.timeout && s.winner === defender, `nightfall without a majority: defender ${defender} wins`);
  }
  E.use('normandie'); C.use('normandie');
}

// Pacific: open sea, reef landings, carriers and airstrips, kamikazes, banzai, garrisons, two roads to Okinawa.
{
  E.use('pacifique'); C.use('pacifique');
  assert.deepEqual([...C.roots].sort(), ['mer_corail', 'wake']);
  const lens = new Set(), roads = new Set(), walk = (id, n, path) => C.byId[id].next.length ? C.byId[id].next.forEach(x => walk(x, n + 1, [...path, x])) : (assert.equal(id, 'okinawa'), lens.add(n), roads.add(path[4]));
  C.roots.forEach(r => walk(r, 1, [r]));
  assert.deepEqual([...lens], [10], `Pacific run length ${[...lens]}`);
  assert.deepEqual([...roads].sort(), ['bougainville', 'tarawa'], 'two roads after Henderson Field');
  assert(C.BATTLES.every(b => !b.defend || b.first === 1), 'a defensive battle: the enemy attacks first');
  assert(C.BATTLES.every(b => (b.aiCards || []).includes('kamikaze') === (b.day >= 1048)), 'kamikazes from Leyte on');
  const mk = (keys, owner, base, down = false) => keys.map((key, i) => ({ id: base + i, key, owner, down, malus: 0 }));
  const ids = (s, t, p) => s.terrains[t].side[p].map(u => u.key);
  // Open sea: infantry is worth nothing, ships count.
  let s = E.newGame(['haute_mer', 'lagon', 'port']);
  s.terrains[0].side[0] = mk(['marines', 'cuirasse'], 0, 800);
  assert.deepEqual(E.totals(s, 0, 0), [3, 0, 0, 1], 'open sea: the Marines count for nothing');
  // Reef: -1 Infantry until the start of the owner's next turn; the amtrac crosses it.
  s = E.newGame(['recif', 'lagon', 'port'], {}, { first: 0 });
  s.players[0].hand = [{ id: 810, key: 'marines' }, { id: 811, key: 'lvt' }];
  E.play(s, { kind: 'deploy', c: 810, t: 0 });
  assert.equal(E.totals(s, 0, 0)[1], 2, 'reef: the Marines land with 2 Infantry');
  E.play(s, { kind: 'pass' });
  assert.equal(E.totals(s, 0, 0)[1], 3, 'reef: ashore at the start of the next turn');
  E.play(s, { kind: 'deploy', c: 811, t: 0 });
  assert.equal(E.totals(s, 0, 0)[1], 5, 'reef: the amtrac crosses without loss');
  // Carrier: +1 Air to your aircraft everywhere while face up; airstrip held: +1 Air on the other terrains.
  s = E.newGame(['lagon', 'piste', 'port']);
  s.terrains[0].side[0] = mk(['hellcat'], 0, 820);
  s.terrains[2].side[0] = mk(['porte_avions'], 0, 821, true);
  assert.equal(E.totals(s, 0, 0)[2], 3, 'face-down carrier: no air group');
  s.terrains[2].side[0][0].down = false;
  assert.equal(E.totals(s, 0, 0)[2], 4, 'carrier: +1 Air on another terrain');
  s.terrains[1].captured = 0;
  assert.equal(E.totals(s, 0, 0)[2], 5, 'airstrip captured: +1 Air more');
  // Kamikaze: destroys an enemy ship and itself.
  s = E.newGame(['haute_mer', 'lagon', 'port'], {}, { first: 1, aiCards: ['kamikaze'] });
  assert(s.players[1].list.some(c => c.key === 'kamikaze'), 'aiCards join the AI deck');
  s.terrains[0].side[0] = mk(['cuirasse', 'destroyer'], 0, 830);
  s.players[1].hand = [{ id: 840, key: 'kamikaze' }];
  E.play(s, { kind: 'deploy', c: 840, t: 0, u: 830 });
  assert.deepEqual([ids(s, 0, 0), ids(s, 0, 1)], [['destroyer'], []], 'kamikaze: the battleship and the plane are gone');
  // Banzai: your weakest infantry and their strongest go down; the garrison never does.
  s = E.newGame(['lagon', 'piste', 'port'], {}, { first: 1 });
  s.terrains[0].side[0] = mk(['lance_flammes', 'marines'], 0, 850);
  s.terrains[0].side[1] = mk(['garnison', 'tireurs'], 1, 860);
  s.players[1].hand = [{ id: 870, key: 'banzai' }];
  E.play(s, { kind: 'order', c: 870, t: 0 });
  assert.deepEqual([ids(s, 0, 0), ids(s, 0, 1)], [['lance_flammes'], ['garnison']], 'banzai: snipers for Marines, the garrison stays');
  E.use('normandie'); C.use('normandie');
}

// Gallic Wars: testudo, charge, ford, coast, Vercingetorix's aura, two roads to Uxellodunum.
{
  E.use('gaule'); C.use('gaule');
  assert.deepEqual([...C.roots], ['bibracte']);
  const lens = new Set(), roads = new Set(), walk = (id, n, path) => C.byId[id].next.length ? C.byId[id].next.forEach(x => walk(x, n + 1, [...path, x])) : (assert.equal(id, 'uxellodunum'), lens.add(n), roads.add(path[3]));
  C.roots.forEach(r => walk(r, 1, [r]));
  assert.deepEqual([...lens], [10], `Gaul run length ${[...lens]}`);
  assert.deepEqual([...roads].sort(), ['aduatuques', 'venetes'], 'two roads after the Sambre');
  assert(C.BATTLES.every(b => !b.defend || b.first === 1), 'a defensive battle: the enemy attacks first');
  assert(C.BATTLES.every(b => !(b.aiCards || []).includes('vercingetorix') || b.day >= 2190), 'Vercingetorix only in 52');
  const mk = (keys, owner, base, down = false) => keys.map((key, i) => ({ id: base + i, key, owner, down, malus: 0 }));
  const ids = (s, t, p) => s.terrains[t].side[p].map(u => u.key);
  // Testudo: two face-up legionaries side by side cannot be destroyed, a lone one can.
  let s = E.newGame(['plaine', 'village', 'camp'], {}, { first: 0 });
  s.terrains[0].side[1] = mk(['legionnaire', 'legionnaire'], 1, 900);
  s.terrains[1].side[1] = mk(['legionnaire'], 1, 910);
  for (const T of s.terrains) for (const u of T.side[1]) u.malus = 3; // worth 1: in Pila Volley range
  s.players[0].hand = [{ id: 920, key: 'pluie_traits' }];
  assert.deepEqual(E.moves(s).filter(m => m.kind === 'order').map(m => m.u), [910], 'testudo');
  // Charge: pushes an enemy unit to a neighbouring terrain.
  s = E.newGame(['plaine', 'village', 'camp'], {}, { first: 0 });
  s.terrains[0].side[1] = mk(['sagittaires'], 1, 930);
  s.players[0].hand = [{ id: 940, key: 'cavaliers' }];
  E.play(s, E.moves(s).find(m => m.kind === 'deploy' && m.t === 0 && m.u === 930));
  assert.deepEqual(ids(s, 1, 1), ['sagittaires'], 'charge pushes the archers to the village');
  // Ford: horsemen lose 1 Cavalry and cannot leave; coast: infantry and horsemen are worth nothing.
  s = E.newGame(['gue', 'cote', 'plaine']);
  s.terrains[0].side[0] = mk(['cavaliers'], 0, 950);
  s.terrains[1].side[0] = mk(['legionnaire', 'cavaliers', 'scorpion'], 0, 960);
  assert.deepEqual(E.totals(s, 0, 0), [0, 2, 0, 1], 'ford: -1 Cavalry');
  s.turn = 0; s.players[0].hand = [{ id: 965, key: 'marche_forcee' }];
  assert(!E.moves(s).some(m => m.kind === 'order' && m.u === 950), 'ford: horsemen stay');
  assert.deepEqual(E.totals(s, 1, 0), [0, 0, 2, 1], 'coast: only the scorpion counts');
  // Vercingetorix face up: his other infantry there gets +1, not the enemy's.
  s = E.newGame(['plaine', 'village', 'camp']);
  s.terrains[0].side[1] = mk(['vercingetorix', 'legionnaire'], 1, 970);
  s.terrains[0].side[0] = mk(['legionnaire'], 0, 980);
  assert.deepEqual([E.totals(s, 0, 1)[0], E.totals(s, 0, 0)[0]], [5, 3], 'Vercingetorix: +1 to the warriors');
  s.terrains[0].side[1][0].down = true;
  assert.equal(E.totals(s, 0, 1)[0], 3, 'face-down king: no aura');
  E.use('normandie'); C.use('normandie');
}

// War of the Ring: Nazgûl terror, hobbits against the Witch-king, his aura, the wizard's tower, two roads to the Black Gate.
{
  E.use('terre_milieu'); C.use('terre_milieu');
  assert.deepEqual([...C.roots], ['amon_sul']);
  const lens = new Set(), roads = new Set(), walk = (id, n, path) => C.byId[id].next.length ? C.byId[id].next.forEach(x => walk(x, n + 1, [...path, x])) : (assert.equal(id, 'morannon'), lens.add(n), roads.add(path[4]));
  C.roots.forEach(r => walk(r, 1, [r]));
  assert.deepEqual([...lens], [10], `Middle-earth run length ${[...lens]}`);
  assert.deepEqual([...roads].sort(), ['gues_isen', 'ithilien'], 'two roads after Amon Hen');
  assert(C.BATTLES.every(b => !b.defend || b.first === 1), 'a defensive battle: the enemy attacks first');
  const mk = (keys, owner, base, down = false) => keys.map((key, i) => ({ id: base + i, key, owner, down, malus: 0 }));
  const ids = (s, t, p) => s.terrains[t].side[p].map(u => u.key);
  // Nazgûl: a face-up enemy unit goes face down (worth 0); its owner spends an action to reveal it.
  let s = E.newGame(['plaine', 'village', 'riviere'], {}, { first: 1 });
  s.terrains[0].side[0] = mk(['soldats'], 0, 1000);
  s.players[1].hand = [{ id: 1010, key: 'nazgul' }];
  E.play(s, { kind: 'deploy', c: 1010, t: 0, u: 1000 });
  assert.deepEqual(E.totals(s, 0, 0), [0, 0, 0, 0], 'black breath: the soldiers are face down');
  E.play(s, { kind: 'reveal', u: 1000 });
  assert.deepEqual(E.totals(s, 0, 0), [3, 0, 0, 0], 'revealed, they fight again');
  // Witch-king face up: enemy Foot units on his terrain lose 1 Sword, not the archers, not his own side.
  s = E.newGame(['plaine', 'village', 'riviere']);
  s.terrains[0].side[1] = mk(['roi_sorcier', 'soldats'], 1, 1020);
  s.terrains[0].side[0] = mk(['soldats', 'archers'], 0, 1030);
  assert.deepEqual([E.totals(s, 0, 0)[0], E.totals(s, 0, 1)[0]], [2, 3], 'Witch-king: -1 Sword to the enemy foot');
  // Hobbits turned face up: the strongest enemy Magic unit there falls, even the indestructible Witch-king.
  s.terrains[0].side[0].push(...mk(['hobbits'], 0, 1040, true));
  s.turn = 0; s.players[0].hand = [{ id: 1045, key: 'fleches' }];
  assert(!E.moves(s).some(m => m.kind === 'order' && m.u === 1020), 'no arrow can kill the Witch-king');
  E.play(s, { kind: 'reveal', u: 1040 });
  assert.deepEqual(ids(s, 0, 1), ['soldats'], 'hobbits: the Witch-king is gone');
  // Wizard's tower captured: your Magic units get +1 Magic elsewhere; cave trolls cannot be destroyed.
  s = E.newGame(['tour', 'plaine', 'riviere']);
  s.terrains[1].side[0] = mk(['elfes'], 0, 1050);
  assert.equal(E.totals(s, 1, 0)[3], 2, 'elves: 2 Magic');
  s.terrains[0].captured = 0;
  assert.equal(E.totals(s, 1, 0)[3], 3, 'tower held: +1 Magic');
  s.terrains[2].side[1] = mk(['trolls'], 1, 1060);
  s.turn = 0; s.players[0].hand = [{ id: 1065, key: 'fleches' }];
  for (const T of s.terrains) for (const u of T.side[1]) u.malus = 2; // worth 1: in arrow range
  assert(!E.moves(s).some(m => m.kind === 'order' && m.u === 1060), 'trolls: hide like stone');
  // Charge: the pushed unit goes to a neighbouring terrain; with nowhere to go it is destroyed, unless nothing can be destroyed there.
  s = E.newGame(['plaine', 'village', 'muraille']);
  s.turn = 0; s.players[0].hand = [{ id: 1070, key: 'cavaliers' }];
  s.terrains[0].side[1] = mk(['soldats'], 1, 1071);
  const pushes = u => E.moves(s).filter(m => m.kind === 'deploy' && m.c === 1070 && m.u === u);
  assert.deepEqual(pushes(1071).map(m => m.t2), [1], 'charge: pushed to the free neighbour');
  s.terrains[1].side[1] = mk(['soldats', 'soldats', 'soldats', 'soldats'], 1, 1072);
  assert.deepEqual(pushes(1071).map(m => m.t2), [null], 'charge: neighbour full, the push destroys');
  E.play(s, pushes(1071)[0]);
  assert.deepEqual(ids(s, 0, 1), [], 'charge: nowhere to go, destroyed');
  s.turn = 0; s.players[0].hand = [{ id: 1070, key: 'cavaliers' }];
  s.terrains[2].side[1] = mk(['soldats'], 1, 1076);
  assert.equal(E.moves(s).filter(m => m.kind === 'deploy' && m.c === 1070 && m.t === 2 && m.u === 1076).length, 0, 'charge: nothing is destroyed on the walls');
  // Rangers: destroy a face-down card, or turn a face-up unit worth 2 or less face down.
  s = E.newGame(['plaine', 'village', 'riviere']);
  s.turn = 0; s.players[0].hand = [{ id: 1080, key: 'rodeurs' }, { id: 1081, key: 'palantir' }];
  s.terrains[0].side[1] = [...mk(['archers', 'soldats'], 1, 1082), ...mk(['elfes'], 1, 1084, true)];
  s.terrains[1].side[1] = mk(['hobbits'], 1, 1085);
  const aims = c => E.moves(s).filter(m => m.c === c && m.u != null).map(m => m.u).sort();
  assert.deepEqual(aims(1080), [1082, 1084], 'rangers: the archers (2) or the face-down card, not the soldiers (3)');
  E.play(s, E.moves(s).find(m => m.c === 1080 && m.u === 1082));
  assert(s.terrains[0].side[1][0].down && s.log.some(l => l.e === 'conceal'), 'rangers: the archers are face down');
  s.turn = 0; s.players[0].hand = [{ id: 1081, key: 'palantir' }, { id: 1086, key: 'soldats' }];
  s.terrains[2].side[0] = mk(['soldats'], 0, 1087, true);
  assert.deepEqual(aims(1081), [1082, 1084, 1087], 'palantir: enemy face-down cards, your face-down card, never the soldiers (3) nor the hobbits');
  E.play(s, E.moves(s).find(m => m.c === 1081 && m.u === 1082));
  assert(!s.terrains[0].side[1][0].down, 'palantir: the archers are revealed');
  // A terrain its side holds is consolidated: no unit there can be turned face down, a face-down card can still be hunted.
  s.turn = 0; s.players[0].hand = [{ id: 1080, key: 'rodeurs' }];
  s.terrains[0].holder = 1;
  assert.deepEqual(aims(1080), [1084], 'held terrain: the rangers only hunt the face-down card');
  E.use('normandie'); C.use('normandie');
}

// The rule checks above test Normandy cards; the modes below run on the chosen pack.
if (PACK !== 'normandie') { E.use(PACK); C.use(PACK); }

// Fingerprint: fixed seed, many battles (3 levels, campaign bonuses), one hash of every log.
// A refactor that must not change the game keeps it identical: node sim.cjs 300 empreinte
if (process.argv[3] === 'empreinte') {
  const h = require('crypto').createHash('sha1'), N = +process.argv[2] || 300;
  let seed = 12345; // mulberry32
  Math.random = () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const game = (keys, lv, bonus) => { const s = E.newGame(keys, bonus); while (s.winner === null) E.play(s, E.aiMove(s, lv[s.turn])); h.update(JSON.stringify([keys, s.log, s.winner])); };
  for (let i = 0; i < N; i++) game(E.randomTerrains(), [['easy', 'normal'], ['normal', 'easy'], ['normal', 'normal']][i % 3]);
  for (let i = 0; i < 6; i++) game(E.randomTerrains(), i % 2 ? ['hard', 'normal'] : ['normal', 'hard']);
  let run = C.newRun();
  for (let i = 0; i < 40; i++) {
    if (C.done(run)) run = C.newRun();
    const now = C.open(run.path), id = now[i % now.length];
    game(C.draw(C.byId[id]), ['normal', 'normal'], run);
    C.win(run, id);
  }
  console.log('empreinte', h.digest('hex'));
  process.exit(0);
}

// Difficulty levels: cross matches, sides alternated to cancel the first-player edge,
// plus a behaviour profile per level (does each AI really play its personality?).
if (process.argv[3] === 'niveaux') {
  const N = +process.argv[2] || 200;
  const prof = {}, P = L => prof[L] || (prof[L] = { games: 0, moves: 0, ms: 0, hidden: 0, supply: 0, spread: 0, kills: 0, breaks: 0 });
  const duel = (A, B) => {
    let w = 0;
    for (let i = 0; i < N; i++) {
      const lv = i % 2 ? [B, A] : [A, B], s = E.newGame(E.randomTerrains());
      while (s.winner === null) {
        const p = s.turn, x = P(lv[p]), t0 = Date.now(), m = E.aiMove(s, lv[p]);
        x.ms += Date.now() - t0; x.moves++;
        if (m.kind === 'hidden' || m.t1 != null) x.hidden++;
        if (m.kind === 'supply') x.supply++;
        const h0 = s.terrains.map(T => T.holder), n0 = s.log.length;
        E.play(s, m);
        x.kills += s.log.slice(n0).filter(l => l.e === 'destroy' && l.p !== p).length;
        x.breaks += s.terrains.filter((T, t) => h0[t] === 1 - p && T.holder !== 1 - p).length;
        x.spread += s.terrains.filter(T => T.captured === null && T.side[p].length).length;
      }
      lv.forEach(L => P(L).games++);
      if (lv[s.winner] === A) w++;
    }
    return 100 * w / N;
  };
  console.log(`Niveaux, ${N} batailles par duel (cibles : hard>normal >= 65 %, normal>easy 65-80 %)`);
  const hn = duel('hard', 'normal'), ne = duel('normal', 'easy'), he = duel('hard', 'easy');
  console.log(`${hn >= 65 ? ' ' : '!'} Vétéran bat Régulier ${hn.toFixed(0)} %`);
  console.log(`${ne >= 65 && ne <= 80 ? ' ' : '!'} Régulier bat Recrue ${ne.toFixed(0)} %  (Recrue gagne ${(100 - ne).toFixed(0)} %)`);
  console.log(`  Vétéran bat Recrue ${he.toFixed(0)} %`);
  console.log('\nProfil       ms/coup  caché%  ravit.%  terrains occupés  détruits/partie  Tenus cassés/partie');
  for (const L of ['easy', 'normal', 'hard']) {
    const x = prof[L], pc = k => (100 * x[k] / x.moves).toFixed(0).padStart(6), pg = k => (x[k] / x.games).toFixed(1).padStart(15);
    console.log(`${L.padEnd(10)} ${(x.ms / x.moves).toFixed(1).padStart(8)} ${pc('hidden')} ${pc('supply')}  ${(x.spread / x.moves).toFixed(2).padStart(16)} ${pg('kills')}  ${pg('breaks')}`);
  }
  process.exit(0);
}

// One battle told move by move: node sim.cjs 1 partie [niveau joueur 1] [niveau joueur 2]
if (process.argv[3] === 'partie') {
  const lv = [process.argv[4] || 'normal', process.argv[5] || 'normal'];
  I.lang = 'fr';
  const s = E.newGame(E.randomTerrains());
  console.log(`« Tu » = ${lv[0]} (joue en premier), « L'IA » = ${lv[1]}. Terrains : ${s.terrains.map(T => I.terrainName(T.key)).join(', ')}`);
  while (s.winner === null) {
    const p = s.turn, tour = s.players[p].turns + 1, n0 = s.log.length;
    E.play(s, E.aiMove(s, lv[p]));
    console.log(`${String(tour).padStart(2)}${p ? 'b' : 'a'}  ` + s.log.slice(n0).map(I.logLine).join('  '));
  }
  console.log(`Vainqueur : ${lv[s.winner]}${s.timeout ? ' (à la nuit)' : ''}`);
  process.exit(0);
}

// Campaign mode: balance of each battle, then whole runs with and without the rewards.
if (process.argv[3] === 'campagne') {
  const N = +process.argv[2] || 500;
  const game = (keys, bonus, opts) => { const s = E.newGame(keys, bonus, opts); while (s.winner === null) E.play(s, E.aiMove(s)); return s; };
  const sweep = s => s.winner === 0 && s.terrains.every(T => T.captured === 0);
  // Each battle in both orders (N battles each). The target is checked on the battle's scenario:
  // the player starts, the AI starts, or a coin toss (the mean of both).
  console.log(`Campagne, ${N} batailles IA contre IA par étape et par ordre, sans renfort (cible selon le scénario : joueur 45-60 %, temps <= 30 %)`);
  for (const b of C.BATTLES) {
    const w = [0, 0]; let to = 0, len = 0;
    for (let i = 0; i < 2 * N; i++) { const s = game(C.draw(b), {}, { first: i % 2, defender: b.defend ? 0 : 1, aiCards: b.aiCards }); if (s.winner === 0) w[i % 2]++; if (s.timeout) to++; len += s.players[0].turns; }
    const pw = w.map(x => 100 * x / N), pt = 50 * to / N, sc = b.first == null ? (pw[0] + pw[1]) / 2 : pw[b.first], ok = sc >= 45 && sc <= 60 && pt <= (b.defend ? 40 : 30); // defend: holding until night is the plan, a few more nightfalls are fine
    console.log(`${ok ? ' ' : '!'} ${I.battle(b).name.padEnd(24)} joueur d'abord ${pw[0].toFixed(0).padStart(3)} %  IA d'abord ${pw[1].toFixed(0).padStart(3)} %  scénario ${['joueur', 'IA    '][b.first] || 'jeton '} ${sc.toFixed(0).padStart(3)} %  temps ${pt.toFixed(0).padStart(3)} %  ${(len / N / 2).toFixed(1)} tours`);
  }
  // Runs: random route, every battle won eventually (its reward is collected), the player is a Régulier.
  // Same battle played with the run's rewards and without, to measure what the rewards are worth.
  // Total victory rule on: a battle won with all three terrains also brings its bonus reinforcement.
  // Who starts follows each battle's scenario.
  const R = Math.max(20, N / 5), by = [], kinds = {};
  let lens = 0;
  for (let r = 0; r < R; r++) {
    const run = C.newRun();
    for (let k = 0; ; k++) {
      const now = C.open(run.path), id = now[Math.floor(Math.random() * now.length)], keys = C.draw(C.byId[id]);
      const x = by[k] || (by[k] = { w: 0, w0: 0, n: 0, t: 0 });
      const opts = { total: true, first: C.byId[id].first ?? (Math.random() < 0.5 ? 0 : 1), defender: C.byId[id].defend ? 0 : 1, aiCards: C.byId[id].aiCards }, s = game(keys, run, opts), tot = sweep(s);
      x.n++; if (s.winner === 0) x.w++; if (tot) x.t++; if (game(keys, {}, opts).winner === 0) x.w0++;
      const got = C.win(run, id, tot), t = got ? got.t : 'paris'; kinds[t] = (kinds[t] || 0) + 1;
      if (C.last(id)) break;
    }
    lens += run.path.length;
  }
  console.log(`\n${R} campagnes complètes (route au hasard), ${(lens / R).toFixed(1)} batailles en moyenne. Récompenses : ` + Object.entries(kinds).filter(([k]) => k !== 'paris').map(([k, v]) => `${k} ${v}`).join(', '));
  console.log('Étapes        avec renforts   sans   écart (cible en fin de campagne : +5 à +15 pts)   victoires totales');
  for (const [name, lo, hi] of [['début 1-3', 0, 3], ['milieu 4-6', 3, 6], ['fin 7-10', 6, 10]]) {
    const x = by.slice(lo, hi).reduce((a, y) => ({ w: a.w + y.w, w0: a.w0 + y.w0, n: a.n + y.n, t: a.t + y.t }), { w: 0, w0: 0, n: 0, t: 0 });
    if (x.n) console.log(`${name.padEnd(12)} ${(100 * x.w / x.n).toFixed(0).padStart(10)} %  ${(100 * x.w0 / x.n).toFixed(0).padStart(5)} %  ${(100 * (x.w - x.w0) / x.n).toFixed(0).padStart(5)} pts ${(100 * x.t / x.n).toFixed(0).padStart(40)} %`);
  }
  process.exit(0);
}

const N = +process.argv[2] || 1000, fixed = process.argv[3] === 'fixed';
const wins = [0, 0], kinds = {};
let timeouts = 0, turns = 0, held = 0, flipped = 0;
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const s = E.newGame(fixed ? undefined : E.randomTerrains());
  let guard = 0;
  while (s.winner === null) {
    const m = E.aiMove(s);
    kinds[m.kind] = (kinds[m.kind] || 0) + 1;
    E.play(s, m);
    assert(++guard <= 2 * E.TURNS, 'battle must end by nightfall');
    for (let t = 0; t < 3; t++) for (const p of [0, 1]) assert.equal(E.lack(s, t, p).every(x => x === 0), E.fills(s, t, p), 'nothing missing <=> threshold filled');
    const cards = s.players.reduce((n, P) => n + P.deck.length + P.hand.length + P.discard.length, 0)
      + s.terrains.reduce((n, T) => n + T.side[0].length + T.side[1].length, 0);
    assert.equal(cards, s.players.reduce((n, P) => n + P.list.length, 0), 'no card created or lost');
  }
  wins[s.winner]++;
  if (s.timeout) timeouts++;
  turns += s.players[0].turns;
  held += s.log.filter(l => l.e === 'hold').length;
  flipped += s.log.filter(l => l.e === 'free' || l.e === 'destroy').length;
}
const pc = x => (100 * x / N).toFixed(1) + ' %';
const total = Object.values(kinds).reduce((a, b) => a + b, 0);
console.log(`${N} batailles (${fixed ? 'Bocage/Pont/Village' : 'terrains aléatoires'}) en ${((Date.now() - t0) / 1000).toFixed(1)} s`);
console.log(`Victoires attaquant (joue en premier) : ${pc(wins[0])}   défenseur : ${pc(wins[1])}`);
console.log(`Fins au temps : ${pc(timeouts)}   durée moyenne : ${(turns / N).toFixed(1)} tours par camp`);
console.log(`Par bataille : ${(held / N).toFixed(1)} prises de terrain (Tenu), ${(flipped / N).toFixed(1)} destructions/pertes de seuil`);
console.log('Actions : ' + Object.entries(kinds).map(([k, v]) => `${k} ${(100 * v / total).toFixed(0)} %`).join(', '));
