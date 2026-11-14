// Balance study: which knob brings the game back on target once face-down cards are worth 0?
// Usage: node balance.cjs [battles per config = 500]
require('./packs/index.cjs');
const E = require('./engine.js');
E.use('normandie'); // the balance study sweeps Normandy's rules
const N = +process.argv[2] || 500;
const UNITS = ['sherman', 'sherman', 'section', 'section', 'firefly', 'rangers', 'mortiers', 'paras', 'p47', 'spitfire', 'genie', 'officier', 'resistance', 'observateur'];
const set = r => Object.assign(E.RULES, { turns: 12, thrDelta: 0, slots: 4, replace: true }, r);

// 1. Static feasibility, no AI involved: how many hands of <= cap deck units fill each terrain?
function feasibility() {
  const out = {};
  for (const key of Object.keys(E.TERRAINS)) {
    const s = E.newGame([key, 'bocage', 'colline'].filter((k, i, a) => a.indexOf(k) === i).concat('marais').slice(0, 3));
    const T = s.terrains[0], cap = E.cap(s, 0) + (key === 'foret' ? 0 : 0);
    let n = 0, min = 99;
    const rec = (i, picked) => {
      if (picked.length) {
        T.side[0] = picked.map((k, j) => ({ id: 900 + j, key: k, owner: 0, down: false, malus: 0 }));
        if (E.fills(s, 0, 0)) { n++; min = Math.min(min, picked.length); return; } // supersets not counted twice
      }
      if (picked.length === cap) return;
      for (let j = i; j < UNITS.length; j++) rec(j + 1, [...picked, UNITS[j]]);
    };
    rec(0, []);
    out[key] = { n, min: n ? min : '-' };
  }
  return out;
}

// 2. AI vs AI under one rule set.
function run(r, keys) {
  set(r);
  const wins = [0, 0], kinds = {}, capt = {}, seen = {};
  let timeouts = 0, turns = 0;
  for (let i = 0; i < N; i++) {
    const s = E.newGame(keys || E.randomTerrains());
    while (s.winner === null) { const m = E.aiMove(s); const k = m.rep != null ? 'replace' : m.kind; kinds[k] = (kinds[k] || 0) + 1; E.play(s, m); }
    wins[s.winner]++; turns += s.players[0].turns; if (s.timeout) timeouts++;
    // captures before nightfall only: the timeout hands out terrains by percentage
    s.terrains.forEach(T => { seen[T.key] = (seen[T.key] || 0) + 1; if (s.log.some(l => l.e === 'capture' && l.t === T.key)) capt[T.key] = (capt[T.key] || 0) + 1; });
  }
  const tot = Object.values(kinds).reduce((a, b) => a + b, 0), pc = k => Math.round(100 * (kinds[k] || 0) / tot);
  return { to: 100 * timeouts / N, att: 100 * wins[0] / N, len: turns / N, hid: pc('hidden'), rev: pc('reveal'), rep: pc('replace'),
    capt: Object.fromEntries(Object.keys(seen).map(k => [k, Math.round(100 * (capt[k] || 0) / seen[k])])) };
}
// Distance to targets: timeouts 15-30 %, attacker 45-55 %, 8-10 turns.
const off = (x, lo, hi) => Math.max(0, lo - x, x - hi);
const gap = r => off(r.to, 15, 30) + off(r.att, 45, 55) + 5 * off(r.len, 8, 10);

console.log('== Faisabilité : mains de <= cap unités du deck qui remplissent le seuil ==');
for (const d of [1, 0, -1]) for (const slots of [4, 5]) {
  set({ thrDelta: d, slots });
  console.log(`seuils ${d || ' 0'}, ${slots} emplacements : ` + Object.entries(feasibility()).map(([k, v]) => `${k} ${v.n}`).join(', '));
}

console.log(`\n== Balayage : ${N} batailles par configuration, terrains aléatoires ==`);
console.log('seuils slots rempl tours | temps% attaq% durée | caché% retourné% remplacé% | écart');
const res = [];
for (const thrDelta of [1, 0, -1]) for (const slots of [4, 5]) for (const replace of [false, true]) for (const turns of [12, 14]) {
  const r = { thrDelta, slots, replace, turns }, x = run(r);
  res.push({ r, x, g: gap(x) });
  console.log(`${String(thrDelta).padStart(5)} ${String(slots).padStart(5)} ${replace ? ' oui ' : ' non '} ${String(turns).padStart(5)} | ${x.to.toFixed(0).padStart(5)} ${x.att.toFixed(0).padStart(6)} ${x.len.toFixed(1).padStart(6)} | ${String(x.hid).padStart(5)} ${String(x.rev).padStart(8)} ${String(x.rep).padStart(9)} | ${gap(x).toFixed(0).padStart(4)}`);
}
console.log('\n== 3 meilleures : % de batailles où le terrain est capturé avant la nuit ==');
for (const { r, x } of res.sort((a, b) => a.g - b.g).slice(0, 3)) console.log(JSON.stringify(r), JSON.stringify(x.capt));
const d = run({});
console.log(`\n== Règles par défaut : temps ${d.to.toFixed(0)} %, attaquant ${d.att.toFixed(0)} %, ${d.len.toFixed(1)} tours ==\n` + JSON.stringify(d.capt));
set({});
