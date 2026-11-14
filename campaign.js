'use strict';
// Campaign runs, for any pack: the battles graph comes from packs/<id>/battles.js, the reward pools
// from packs/<id>/cards.js. A campaign is a run: winning a battle commits you to it, the battles you can
// launch next are its `next` (the sibling branches are gone for good). No game over: a lost battle can be
// replayed, or swapped for another open one. Battles nobody points to are the starting choices; a battle
// with no `next` ends the campaign.
// Shared by index.html (global CAMPAIGN) and sim.cjs (require).
const CAMPAIGN = (() => {
  const C = {};
  let PACK, byId, roots;
  // Loads a pack's battles. C.BATTLES / C.byId / C.roots / C.VETS / C.CARDS / C.POWERS follow the active pack.
  function use(id) {
    PACK = globalThis.PACKS[id];
    byId = Object.fromEntries(PACK.battles.map(b => [b.id, b]));
    roots = PACK.battles.filter(b => !PACK.battles.some(x => x.next.includes(b.id))).map(b => b.id);
    const R = PACK.rewards || {};
    Object.assign(C, { BATTLES: PACK.battles, byId, roots, VETS: R.vets || [], CARDS: R.cards || [], POWERS: R.powers || [] });
    return PACK;
  }
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const draw = b => shuffle(b.pool.slice()).slice(0, 3);
  const last = id => !byId[id].next.length;

  // ---- run: rewards re-rolled each campaign, choices final on victory -------------------------
  // Rewards are rolled when a battle becomes visible (open), never earlier: the fog of war hides nothing
  // that exists yet. 30 % veteran, 25 % new card, 25 % power, 20 % nothing. A new card or a power already
  // owned, or on offer at the same time, is not offered again (a veteran replaces it).
  function pick(run, taken) {
    const r = Math.random(), vet = { t: 'vet', key: C.VETS[Math.floor(Math.random() * C.VETS.length)] };
    const left = (t, all) => all.filter(k => !taken.some(x => x.t === t && x.key === k));
    const one = a => a[Math.floor(Math.random() * a.length)];
    if (r < 0.3) return vet;
    if (r < 0.55) { const a = left('card', C.CARDS); return a.length ? { t: 'card', key: one(a) } : vet; }
    if (r < 0.8) { const a = left('power', C.POWERS); return a.length ? { t: 'power', key: one(a) } : vet; }
    return { t: 'none' };
  }
  // What the run already has or is being offered: never rolled again.
  const taken = run => [...run.cards.map(c => ({ t: c.vet ? 'vet' : 'card', key: c.key })), ...run.powers.map(key => ({ t: 'power', key })),
    ...open(run.path).map(x => run.rewards[x]).filter(Boolean)];
  function reveal(run) {
    for (const id of open(run.path)) if (byId[id].next.length && !run.rewards[id]) run.rewards[id] = pick(run, taken(run));
    return run;
  }
  const newRun = () => reveal({ rewards: {}, path: [], cards: [], powers: [] });
  // What a reward adds to the run (to the deck or to the powers).
  function gain(run, r) {
    if (!r) return;
    if (r.t === 'vet') run.cards.push({ key: r.key, vet: true });
    else if (r.t === 'card') run.cards.push({ key: r.key });
    else if (r.t === 'power') run.powers.push(r.key);
  }
  // Victory in a campaign battle: commit to it, collect its reward, reveal what lies just ahead.
  // total (all three terrains captured): one more reinforcement, rolled now and never "nothing" (run.bonus[id]).
  // Not on the last battle: nothing left to reinforce.
  function win(run, id, total) {
    if (run.path.includes(id)) return null;
    run.path.push(id); gain(run, run.rewards[id]); reveal(run);
    if (total && !last(id)) {
      let r; do r = pick(run, taken(run)); while (r.t === 'none');
      (run.bonus = run.bonus || {})[id] = r; gain(run, r);
    }
    return run.rewards[id] || null;
  }
  const open = path => path.length ? byId[path[path.length - 1]].next : roots;
  const done = run => run.path.some(last);
  // won (on the path) · open (launchable now) · fog (reachable later) · gone (branch abandoned).
  function status(id, path) {
    if (path.includes(id)) return 'won';
    const now = open(path);
    if (now.includes(id)) return 'open';
    const seen = new Set(now), todo = [...now];
    while (todo.length) for (const n of byId[todo.pop()].next) if (!seen.has(n)) { seen.add(n); todo.push(n); }
    return seen.has(id) ? 'fog' : 'gone';
  }

  // Map frame of the pack's map picture: [longitude, latitude] -> [x, y] in 0..1.
  const project = ([lon, lat]) => { const { lon: [w, e], lat: [n, s] } = PACK.map; return [(lon - w) / (e - w), (n - lat) / (n - s)]; };
  return Object.assign(C, { use, draw, last, newRun, win, open, done, status, project });
})();
if (typeof module !== 'undefined') module.exports = CAMPAIGN;
