// GDD "prochaines étapes" #2: AI vs AI, measure first-player advantage, length, timeout rate.
// Usage: node sim.cjs [battles=1000] [fixed]   ("fixed" = Bocage/Pont/Village only)
//        node sim.cjs 200 niveaux               duels between difficulty levels + behaviour profile
//        node sim.cjs 1 partie easy hard        one battle, told move by move
//        node sim.cjs 300 campagne              balance of each campaign battle
const assert = require('assert');
const E = require('./engine.js');

// Translation check: every card, terrain, battle, UI string and log event exists in English.
{
  const I = require('./i18n.js'), C = require('./campaign.js');
  for (const k of Object.keys(E.CARDS)) if (k !== 'inconnu') assert(I.EN.cards[k], `EN card ${k}`);
  for (const k of Object.keys(E.TERRAINS)) assert(I.EN.terrains[k], `EN terrain ${k}`);
  for (const b of C.BATTLES) assert(I.EN.battles[b.id], `EN battle ${b.id}`);
  assert.deepEqual(Object.keys(I.UI.en).sort(), Object.keys(I.UI.fr).sort(), 'same UI keys in FR and EN');
  assert.deepEqual(Object.keys(I.LOG.en).sort(), Object.keys(I.LOG.fr).sort(), 'same log events in FR and EN');
  for (const k of Object.keys(E.CARDS)) if (E.CARDS[k].text) { I.lang = 'en'; assert(I.cardText(k) !== E.CARDS[k].text, `EN text for ${k}`); }
  I.lang = 'fr';
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

// Campaign map: every battle reachable from a beach and leading to Paris, time moves forward on every
// link, a run lasts 8-10 battles, every terrain exists, every battle has its English text.
{
  const C = require('./campaign.js'), I = require('./i18n.js');
  for (const b of C.BATTLES) {
    b.pool.forEach(k => assert(E.TERRAINS[k], `${b.id}: unknown terrain ${k}`));
    assert(I.EN.battles[b.id], `EN battle ${b.id}`);
    for (const n of b.next) assert(C.byId[n] && C.byId[n].day >= b.day, `${b.id} -> ${n}: goes back in time`);
  }
  assert.deepEqual(C.roots.sort(), ['omaha', 'sword', 'utah']);
  const lens = new Set(), walk = (id, n) => C.byId[id].next.length ? C.byId[id].next.forEach(x => walk(x, n + 1)) : (assert.equal(id, 'paris'), lens.add(n));
  C.roots.forEach(r => walk(r, 1));
  assert(Math.min(...lens) >= 8 && Math.max(...lens) <= 10, `run length ${[...lens]}`);
  assert.equal(C.BATTLES.filter(b => C.status(b.id, []) === 'gone').length, 0, 'every battle reachable at the start');
  const path = ['omaha', 'bayeux'];
  assert.equal(C.status('pointe_hoc', path), 'gone', 'sibling branch closed on victory');
  assert.equal(C.status('epsom', path), 'open');
  assert.equal(C.status('cote_112', path), 'fog');
  for (const k of [...C.CARDS]) assert(E.CARDS[k] && I.EN.cards[k], `reward card ${k}`);
  for (const k of C.POWERS) assert(E.POWERS[k] && I.EN.powers[k], `power ${k}`);
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
  const I = require('./i18n.js'), lv = [process.argv[4] || 'normal', process.argv[5] || 'normal'];
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
  const C = require('./campaign.js');
  const N = +process.argv[2] || 500;
  const game = (keys, bonus) => { const s = E.newGame(keys, bonus); while (s.winner === null) E.play(s, E.aiMove(s)); return s; };
  console.log(`Campagne, ${N} batailles IA contre IA par étape, sans renfort (cible : joueur 45-60 %, temps <= 30 %)`);
  for (const b of C.BATTLES) {
    let w = 0, to = 0, len = 0;
    for (let i = 0; i < N; i++) { const s = game(C.draw(b)); if (s.winner === 0) w++; if (s.timeout) to++; len += s.players[0].turns; }
    const pw = 100 * w / N, pt = 100 * to / N, ok = pw >= 45 && pw <= 60 && pt <= 30;
    console.log(`${ok ? ' ' : '!'} ${b.name.padEnd(24)} joueur ${pw.toFixed(0).padStart(3)} %  temps ${pt.toFixed(0).padStart(3)} %  ${(len / N).toFixed(1)} tours`);
  }
  // Runs: random route, every battle won eventually (its reward is collected), the player is a Régulier.
  // Same battle played with the run's rewards and without, to measure what the rewards are worth.
  const R = Math.max(20, N / 5), by = [], kinds = {};
  let lens = 0;
  for (let r = 0; r < R; r++) {
    const run = C.newRun();
    for (let k = 0; ; k++) {
      const now = C.open(run.path), id = now[Math.floor(Math.random() * now.length)], keys = C.draw(C.byId[id]);
      const x = by[k] || (by[k] = { w: 0, w0: 0, n: 0 });
      x.n++; if (game(keys, run).winner === 0) x.w++; if (game(keys).winner === 0) x.w0++;
      const got = C.win(run, id), t = got ? got.t : 'paris'; kinds[t] = (kinds[t] || 0) + 1;
      if (id === 'paris') break;
    }
    lens += run.path.length;
  }
  console.log(`\n${R} campagnes complètes (route au hasard), ${(lens / R).toFixed(1)} batailles en moyenne. Récompenses : ` + Object.entries(kinds).filter(([k]) => k !== 'paris').map(([k, v]) => `${k} ${v}`).join(', '));
  console.log('Étapes        avec renforts   sans   écart (cible en fin de campagne : +5 à +15 pts)');
  for (const [name, lo, hi] of [['début 1-3', 0, 3], ['milieu 4-6', 3, 6], ['fin 7-10', 6, 10]]) {
    const x = by.slice(lo, hi).reduce((a, y) => ({ w: a.w + y.w, w0: a.w0 + y.w0, n: a.n + y.n }), { w: 0, w0: 0, n: 0 });
    console.log(`${name.padEnd(12)} ${(100 * x.w / x.n).toFixed(0).padStart(10)} %  ${(100 * x.w0 / x.n).toFixed(0).padStart(5)} %  ${(100 * (x.w - x.w0) / x.n).toFixed(0).padStart(5)} pts`);
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
