// GDD "prochaines étapes" #2: AI vs AI, measure first-player advantage, length, timeout rate.
// Usage: node sim.cjs [battles=1000] [fixed]   ("fixed" = Bocage/Pont/Village only)
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

// Campaign mode: per-battle balance, draws from each battle's pool.
if (process.argv[3] === 'campagne') {
  const C = require('./campaign.js');
  for (const b of C.BATTLES) b.pool.forEach(k => assert(E.TERRAINS[k], `${b.id}: unknown terrain ${k}`));
  const seen = new Set(['omaha']), todo = ['omaha'];
  while (todo.length) for (const n of C.byId[todo.pop()].next) if (!seen.has(n)) { seen.add(n); todo.push(n); }
  assert.equal(seen.size, C.BATTLES.length, 'every battle reachable from Omaha');
  const N = +process.argv[2] || 500;
  console.log(`Campagne, ${N} batailles IA contre IA par étape (cible : joueur 45-60 %, temps <= 30 %)`);
  for (const b of C.BATTLES) {
    let w = 0, to = 0, len = 0;
    for (let i = 0; i < N; i++) {
      const s = E.newGame(C.draw(b));
      while (s.winner === null) E.play(s, E.aiMove(s));
      if (s.winner === 0) w++; if (s.timeout) to++; len += s.players[0].turns;
    }
    const pw = 100 * w / N, pt = 100 * to / N, ok = pw >= 45 && pw <= 60 && pt <= 30;
    console.log(`${ok ? ' ' : '!'} ${b.name.padEnd(22)} joueur ${pw.toFixed(0).padStart(3)} %  temps ${pt.toFixed(0).padStart(3)} %  ${(len / N).toFixed(1)} tours`);
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
    assert.equal(cards, 40, 'no card created or lost');
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
