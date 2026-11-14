'use strict';
// Ligne de Front — rules engine + AI. Knows nothing about any campaign: cards, terrains, decks and
// powers come from a pack (packs/<id>/), whose behaviour lives in hooks receiving `g` (class G below).
// No DOM: shared by index.html (classic <script>) and sim.cjs (node).
const E = (() => {
  // Balance knobs, mutable so balance.cjs can sweep them. Defaults = the rules index.html plays.
  // thrDelta shifts every non-zero threshold (min 1); replace = deploy onto a full side by discarding one of your units.
  const RULES = { turns: 12, thrDelta: 0, slots: 4, replace: true };
  const ORDER = 'Ordre';   // the one card type the engine knows: orders are played, not deployed
  const ZERO = [0, 0, 0, 0];
  // What the AI (and the player's preview) sees instead of an enemy face-down card.
  const UNKNOWN = { type: '?', v: [0, 0, 0, 0] };

  // ---- active pack ------------------------------------------------------------------------------
  let PACK, CARDS, TERRAINS, TRAITS, DECKS, POWERS, MAIN, MALUS, AURAS, FIELDS;
  function use(id) {
    const P = (globalThis.PACKS || {})[id];
    if (!P) throw new Error(`unknown pack ${id}`);
    PACK = P;
    CARDS = { ...P.cards, inconnu: UNKNOWN };
    TERRAINS = P.terrains; TRAITS = P.traits || {}; DECKS = P.decks; POWERS = P.powers || {};
    MAIN = Object.fromEntries(Object.entries(P.types).filter(([, ty]) => ty.main != null).map(([k, ty]) => [k, ty.main]));
    MALUS = P.malusAttr ?? 1;
    AURAS = Object.values(CARDS).filter(C => C.aura).map(C => C.aura);
    FIELDS = Object.values(TRAITS).filter(T => T.fieldAura).map(T => T.fieldAura);
    return P;
  }

  const sum = a => a.reduce((x, y) => x + y, 0);
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const trait = T => TRAITS[TERRAINS[T.key].trait] || {};
  const live = (s, t) => s.terrains[t].captured === null;
  const cap = (s, t) => TERRAINS[s.terrains[t].key].slots || RULES.slots + (trait(s.terrains[t]).slotDelta || 0);
  const adjacent = (s, a, b) => a !== b && (Math.abs(a - b) === 1 || !!trait(s.terrains[a]).hub || !!trait(s.terrains[b]).hub);

  function find(s, id) {
    for (let t = 0; t < 3; t++) for (let p = 0; p < 2; p++) {
      const u = s.terrains[t].side[p].find(x => x.id === id);
      if (u) return { u, t, p };
    }
  }

  // noTrait: skip the terrain's own modifier (the UI names what the terrain changes).
  function vals(s, u, t, noTrait) {
    const T = s.terrains[t], tr = trait(T), C = CARDS[u.key];
    // Face-down = pure bluff: worth nothing until its owner spends an action to reveal it (unless the terrain
    // says otherwise). Fog hides units from the opponent but they still fight.
    const fog = tr.fog && C.type !== ORDER && u.key !== 'inconnu';
    if (u.down && !fog) return (tr.downValue || ZERO).slice();
    const v = C.v.slice();
    if (u.vet) v[MAIN[C.type]]++;
    const g = new G(s, u.owner);
    if (tr.modify && !noTrait) tr.modify(g, u, t, v);
    v[MALUS] = Math.max(0, v[MALUS] - u.malus);
    // ponytail: hot path of the AI (thousands of calls per decision), hence plain loops.
    for (let i = 0; i < AURAS.length; i++) AURAS[i](g, u, t, v);
    for (let i = 0; i < FIELDS.length; i++) FIELDS[i](g, u, t, v);
    return v;
  }
  function totals(s, t, p, noTrait) {
    const side = s.terrains[t].side[p], acc = [0, 0, 0, 0];
    for (let i = 0; i < side.length; i++) { const v = vals(s, side[i], t, noTrait); acc[0] += v[0]; acc[1] += v[1]; acc[2] += v[2]; acc[3] += v[3]; }
    return acc;
  }
  const thr = (s, t) => TERRAINS[s.terrains[t].key].thr.map(x => x && Math.max(1, x + RULES.thrDelta));
  // What side p still misses per attribute: the one function behind capture (fills) and the UI's "missing" rows.
  const lack = (s, t, p) => { const tot = totals(s, t, p); return thr(s, t).map((x, a) => Math.max(0, x - tot[a])); };
  const fills = (s, t, p) => !lack(s, t, p).some(Boolean);
  const surplus = (s, t, p) => sum(totals(s, t, p)) - sum(thr(s, t)) + sum(s.terrains[t].side[p].filter(u => !u.down).map(u => CARDS[u.key].surplus || 0));
  const pct = (s, t, p) => { const tot = totals(s, t, p), th = thr(s, t); return sum(th.map((x, a) => Math.min(x, tot[a]))) / sum(th); };

  // Battle log as events ({ e, p, card, t }); the UI turns them into sentences in the current language.
  const log = (s, ev) => s.log.push(ev);
  function draw(s, p, n) {
    const P = s.players[p];
    while (n-- > 0 && P.deck.length && P.hand.length < 7) P.hand.push(P.deck.pop());
  }
  function destroy(s, id) {
    const f = find(s, id);
    if (!f) return;
    const side = s.terrains[f.t].side[f.p];
    side.splice(side.indexOf(f.u), 1);
    s.players[f.p].discard.push(f.u.vet ? { id, key: f.u.key, vet: true } : { id, key: f.u.key }); // a veteran stays one
    log(s, { e: 'destroy', p: f.p, card: f.u.key, t: s.terrains[f.t].key });
  }
  function flip(s, id, by) {
    const f = find(s, id);
    if (!f || !f.u.down) return;
    f.u.down = false;
    log(s, { e: 'reveal', p: f.p, card: f.u.key, t: s.terrains[f.t].key });
    if (CARDS[f.u.key].type === ORDER) return destroy(s, id); // a bluffed order is worth nothing once seen
    // ponytail: powers on play do not re-trigger on flip (would need target prompts mid-effect). Passive hooks do.
    const C = CARDS[f.u.key];
    if (C.onFlipped) C.onFlipped(new G(s, f.p), f.u, by);
  }
  function moveUnit(s, id, to) {
    const f = find(s, id), side = s.terrains[f.t].side[f.p];
    side.splice(side.indexOf(f.u), 1);
    s.terrains[to].side[f.p].push(f.u);
  }
  const put = (s, p, card, t, down) => { const u = { ...card, owner: p, down, malus: 0 }; s.terrains[t].side[p].push(u); return u; };
  const take = (s, p, id) => { const H = s.players[p].hand; return H.splice(H.findIndex(c => c.id === id), 1)[0]; };
  const blocks = (s, u, a, b) => { const g = new G(s, u.owner), A = trait(s.terrains[a]), B = trait(s.terrains[b]); return !!(A.blocksMove && A.blocksMove(g, u)) || !!(B.blocksMove && B.blocksMove(g, u)); };
  const canMove = (s, u, from, to) => live(s, from) && live(s, to) && adjacent(s, from, to) && !blocks(s, u, from, to) && s.terrains[to].side[u.owner].length < cap(s, to);

  // ---- g: what a pack's hooks see. p = the side the hook acts for. -----------------------------
  // Units are board objects { id, key, owner, down, malus, vet }; t = terrain index 0-2.
  class G {
    constructor(s, p) { this.s = s; this.p = p; }
    // reading the board
    terrains() { return this.s.terrains; }
    live() { return [0, 1, 2].filter(t => live(this.s, t)); }
    side(t, p) { return this.s.terrains[t].side[p]; }
    foes(t) { return this.s.terrains[t].side[1 - this.p]; }
    allies(t) { return this.s.terrains[t].side[this.p]; }
    mine() { return this.units(this.p); }
    theirs() { return this.units(1 - this.p); }
    units(p) { const out = []; for (const t of this.live()) for (const u of this.s.terrains[t].side[p]) out.push({ u, t }); return out; }
    find(id) { return find(this.s, id); }
    hand() { return this.s.players[this.p].hand; }
    type(u) { return CARDS[u.key].type; }
    has(u, tag) { return (CARDS[u.key].tags || []).includes(tag); }
    vals(u, t) { return vals(this.s, u, t); }
    totals(t, p = this.p) { return totals(this.s, t, p); }
    sum(a) { return sum(a); }
    count(t, p = this.p) { return this.s.terrains[t].side[p].length; }
    cap(t) { return cap(this.s, t); }
    adjacent(a, b) { return adjacent(this.s, a, b); }
    trait(t) { return TERRAINS[this.s.terrains[t].key].trait; }
    traitHas(t, tag) { return (trait(this.s.terrains[t]).tags || []).includes(tag); }
    safe(t) { return !!trait(this.s.terrains[t]).immune; }     // nothing can be destroyed on this terrain
    tough(u) { const im = CARDS[u.key].immune; return typeof im === 'function' ? !!im(this, u) : !!im; } // this unit cannot be destroyed (immune: true or (g, unit) => bool)
    canMove(u, from, to) { return canMove(this.s, u, from, to); }
    blocks(u, a, b) { return blocks(this.s, u, a, b); }
    smoked() { return this.s.smoke[this.p]; }
    // changing the board
    destroy(id) { destroy(this.s, id); }
    flip(id, by) { flip(this.s, id, by); }
    move(id, to) { moveUnit(this.s, id, to); }
    swap(a, b) { const ta = find(this.s, a).t, tb = find(this.s, b).t; moveUnit(this.s, a, tb); moveUnit(this.s, b, ta); }
    malus(id, n = 1) { find(this.s, id).u.malus += n; }
    draw(n) { draw(this.s, this.p, n); }
    smoke() { this.s.smoke[this.p] = true; }
    putDown(handId, t) { put(this.s, this.p, take(this.s, this.p, handId), t, true); }
    toHand(id) { const f = find(this.s, id), side = this.s.terrains[f.t].side[f.p]; side.splice(side.indexOf(f.u), 1); this.s.players[f.p].hand.push(f.u.vet ? { id: f.u.id, key: f.u.key, vet: true } : { id: f.u.id, key: f.u.key }); }
    // building targets: { args, steps }, steps = the clicks the UI asks for (u<id> unit, t<n> terrain, h<id> hand card)
    U(id) { return 'u' + id; }
    T(t) { return 't' + t; }
    H(id) { return 'h' + id; }
    hit(units) { return units.map(u => ({ args: { u: u.id }, steps: ['u' + u.id] })); }
    hits(xs) { return xs.map(x => ({ args: { u: x.u.id }, steps: ['u' + x.u.id] })); }
  }

  // Tenu / Libre state machine (GDD "Tenir et capturer"). Runs after every action.
  function control(s, actor) {
    s.terrains.forEach((T, t) => {
      if (T.captured !== null) return;
      const f = [fills(s, t, 0), fills(s, t, 1)], sp = [surplus(s, t, 0), surplus(s, t, 1)];
      let h = T.holder;
      if (h !== null && !f[h]) h = null;
      if (h === null) {
        if (f[0] && f[1]) h = sp[0] === sp[1] ? actor : sp[0] > sp[1] ? 0 : 1;
        else if (f[0]) h = 0;
        else if (f[1]) h = 1;
      } else if (f[1 - h] && sp[1 - h] > sp[h] && !s.smoke[h]) h = 1 - h; // tie: first holder keeps
      if (h !== T.holder) {
        T.holder = h; T.ripe = false;
        log(s, h === null ? { e: 'free', t: T.key } : { e: 'hold', p: h, t: T.key });
      }
    });
  }

  function startTurn(s) {
    const p = s.turn;
    s.smoke[p] = false;
    s.terrains.forEach((T, t) => {
      // ripe = held since the end of p's previous turn: the opponent had a full turn to answer.
      if (T.captured === null && T.holder === p && T.ripe) { T.captured = p; log(s, { e: 'capture', p, t: T.key }); }
    });
    if (s.terrains.filter(T => T.captured === p).length >= 2) { s.winner = p; return; }
    const g = new G(s, p);
    for (let t = 0; t < 3; t++) if (live(s, t)) for (const u of [...s.terrains[t].side[p]]) { const C = CARDS[u.key]; if (C.onTurnStart) C.onTurnStart(g, u); }
    control(s, p);
    draw(s, p, 1 + sum(s.terrains.map(T => T.captured === p ? trait(T).drawBonus || 0 : 0)));
  }

  function timeout(s) {
    const n = [0, 0];
    s.terrains.forEach((T, t) => {
      if (T.captured === null) {
        const a = pct(s, t, 0), b = pct(s, t, 1);
        T.captured = a > b ? 0 : b > a ? 1 : null;
      }
      if (T.captured !== null) n[T.captured]++;
    });
    s.timeout = true;
    s.winner = n[0] >= 2 ? 0 : 1; // no majority: the defender wins, the attack failed
    log(s, { e: 'night' });
  }

  function endTurn(s) {
    const p = s.turn;
    control(s, p);
    s.terrains.forEach(T => { if (T.captured === null && T.holder === p) T.ripe = true; });
    if (++s.players[p].turns >= RULES.turns && p === 1) return timeout(s);
    s.turn = 1 - p;
    startTurn(s);
  }

  // Every legal action for the current player. `steps` is the click sequence the UI
  // walks through (h<id> hand card, t<n> terrain, u<id> unit); the AI just ignores it.
  function moves(s) {
    const p = s.turn, H = s.players[p].hand, out = [], g = new G(s, p);
    const T = [0, 1, 2].filter(t => live(s, t));
    const n = t => s.terrains[t].side[p].length;
    for (const t of T) for (const u of s.terrains[t].side[p]) if (u.down) out.push({ kind: 'reveal', u: u.id, steps: ['u' + u.id] });
    for (const c of H) {
      const C = CARDS[c.key];
      out.push({ kind: 'supply', c: c.id, steps: ['supply'] });
      for (const t of T) {
        const fog = !!trait(s.terrains[t]).fog, free = n(t) < cap(s, t);
        if (free) out.push({ kind: 'hidden', c: c.id, t, steps: ['t' + t] });
        if (C.type === ORDER) continue;
        // ponytail: a replacing unit does not trigger its targeted power (no second target prompt).
        if (!free && RULES.replace) for (const x of s.terrains[t].side[p]) out.push({ kind: 'deploy', c: c.id, t, rep: x.id, steps: ['t' + t, 'u' + x.id] });
        if (!free && !(C.extraSlot && !fog && n(t) === cap(s, t))) continue;
        const base = { kind: 'deploy', c: c.id, t }, st = ['t' + t];
        out.push({ ...base, steps: st });
        if (fog || !C.targets) continue; // in the fog it lands face down, power inactive
        for (const x of C.targets(g, t, c)) out.push({ ...base, ...x.args, steps: [...st, ...x.steps] });
      }
      if (C.type === ORDER && C.targets) for (const x of C.targets(g, c)) out.push({ kind: 'order', c: c.id, ...x.args, steps: x.steps });
    }
    // Powers: `steps` are only the targets, the UI selects the power with its own button.
    for (const w of s.players[p].powers || []) for (const x of POWERS[w].targets(g)) out.push({ kind: 'power', c: 'p:' + w, w, ...x.args, steps: x.steps });
    // Nothing but powers left (empty hand): passing must stay possible.
    if (!out.some(m => m.kind !== 'power')) out.unshift({ kind: 'pass', steps: ['pass'] });
    return out;
  }

  function play(s, m) {
    const p = s.turn, P = s.players[p], g = new G(s, p);
    if (m.kind === 'supply') { P.discard.push(take(s, p, m.c)); draw(s, p, 2); log(s, { e: 'supply', p }); }
    else if (m.kind === 'hidden') { put(s, p, take(s, p, m.c), m.t, true); log(s, { e: 'hidden', p, t: s.terrains[m.t].key }); }
    else if (m.kind === 'reveal') flip(s, m.u, null);
    else if (m.kind === 'deploy') {
      if (m.rep != null) destroy(s, m.rep);
      const down = !!trait(s.terrains[m.t]).fog, u = put(s, p, take(s, p, m.c), m.t, down), C = CARDS[u.key];
      log(s, { e: down ? 'fog' : 'deploy', p, card: u.key, t: s.terrains[m.t].key });
      if (!down && C.onPlay) C.onPlay(g, u, m);
    } else if (m.kind === 'order') {
      const c = take(s, p, m.c);
      P.discard.push(c);
      log(s, { e: 'order', p, card: c.key });
      if (CARDS[c.key].onPlay) CARDS[c.key].onPlay(g, null, m);
    } else if (m.kind === 'power') { // free: no endTurn, the player still has the turn's action
      P.powers = P.powers.filter(x => x !== m.w);
      log(s, { e: 'power', p, pw: m.w });
      POWERS[m.w].onPlay(g, null, m);
      return control(s, p);
    } else log(s, { e: 'pass', p });
    endTurn(s);
  }

  // bonus (campaign): { cards: [{ key, vet }], powers: [name] } for player 0.
  function newGame(keys = PACK.quick.slice(0, 3), bonus = {}) {
    let id = 0;
    const lists = [DECKS[0].map(key => ({ key })).concat(bonus.cards || []), DECKS[1].map(key => ({ key }))];
    const s = {
      pack: PACK.id,
      terrains: keys.map(key => ({ key, side: [[], []], holder: null, ripe: false, captured: null })),
      players: lists.map((list, p) => ({ list, powers: p ? [] : [...(bonus.powers || [])], deck: shuffle(list.map(c => ({ id: id++, ...c }))), hand: [], discard: [], turns: 0 })),
      turn: 0, winner: null, timeout: false, smoke: [false, false], log: [],
    };
    // ponytail: no mulligan — add when hand quality shows up as a problem in playtests.
    draw(s, 0, 5); draw(s, 1, 5);
    startTurn(s);
    return s;
  }
  const randomTerrains = () => shuffle(PACK.quick.slice()).slice(0, 3);

  // ---- AI: never cheats -------------------------------------------------------------------------
  // Hand/deck cards are immutable {id,key}, so only arrays and board units are copied.
  const clone = s => ({
    ...s, log: [], smoke: [...s.smoke],
    players: s.players.map(P => ({ ...P, deck: [...P.deck], hand: [...P.hand], discard: [...P.discard] })),
    terrains: s.terrains.map(T => ({ ...T, side: T.side.map(a => a.map(u => ({ ...u }))) })),
  });
  // State as seen by p: enemy face-down cards become anonymous (worth 0, like any face-down card).
  function blind(s, p) {
    const c = clone(s);
    for (const T of c.terrains) for (const u of T.side[1 - p]) if (u.down) { u.key = 'inconnu'; u.vet = false; }
    return c;
  }
  // Three AI personalities: same rules, same information, different judgement.
  // def: weight of the opponent's progress. hold: value of a Tenu terrain. late: nightfall sprint.
  // hand: value of a card in hand. spread: bonus per terrain occupied. bluff: bonus/malus on face-down plays.
  // margin: picks at random among moves this close to the best. aggro: bonus per enemy unit removed / Tenu broken.
  // roll/k/slack: plays its k best moves to the end `roll` times on guessed worlds; among the moves within
  // `slack` wins of the best, takes the most aggressive.
  // Tuned with `node sim.cjs 200 niveaux` (win rates + behaviour profile): margin is Recrue's strength knob, roll Vétéran's.
  const LEVELS = {
    easy: { def: 0.5, hold: 30, late: 0, hand: 0.3, spread: 12, bluff: -20, margin: 12 },
    normal: { def: 1, hold: 30, late: 15, hand: 0.3, spread: 0, bluff: 0 },
    hard: { def: 1.4, hold: 40, late: 15, hand: 0.15, spread: 0, bluff: 0, aggro: 10, roll: 24, k: 6, slack: 2 },
  };
  function score(s, p, w = LEVELS.normal) {
    if (s.winner !== null) return s.winner === p ? 1e4 : -1e4;
    const o = 1 - p, caps = s.terrains.filter(T => T.captured !== null).length;
    const late = RULES.turns - s.players[p].turns <= 2; // night is close: percentages decide
    let v = w.hand * s.players[p].hand.length + w.spread * s.terrains.filter(T => T.captured === null && T.side[p].length).length;
    s.terrains.forEach((T, t) => {
      if (T.captured !== null) { v += T.captured === p ? 100 : -100; return; }
      const a = pct(s, t, p), b = pct(s, t, o);
      let x = 12 * a * a - 12 * w.def * b * b; // squared: concentrate rather than sprinkle
      if (T.holder === p) x += w.hold; else if (T.holder === o) x -= w.hold * w.def;
      const tot = totals(s, t, p), over = sum(thr(s, t).map((th, i) => Math.max(0, tot[i] - th)));
      x += over * (b > 0.5 ? 0.5 : -0.7); // waste, unless the terrain is contested
      if (late) x += a > b ? w.late : a < b ? -w.late : 0;
      v += x * (1 + 0.5 * caps); // remaining terrains become decisive
    });
    return v;
  }
  // p's guess of the opponent's hidden cards: starting deck (public) minus what p has seen, re-dealt.
  // Card counting, not cheating: the real hand and deck order are never read.
  function guess(s, p) {
    const o = 1 - p, c = clone(s), P = c.players[o], pool = (P.list || DECKS[o].map(key => ({ key }))).slice();
    const seen = [...P.discard, ...c.terrains.flatMap(T => T.side[o].filter(u => u.key !== 'inconnu'))];
    for (const x of seen) { const i = pool.findIndex(y => y.key === x.key && !y.vet === !x.vet); if (i >= 0) pool.splice(i, 1); }
    shuffle(pool);
    let id = 1e4;
    const deal = n => pool.splice(0, n).map(x => ({ id: id++, ...x }));
    P.hand = deal(P.hand.length);
    P.deck = deal(P.deck.length);
    shuffle(c.players[p].deck); // own draw order is unknown too
    return c;
  }
  const uniq = m => !(m.a > m.b || (m.us && m.us[0] > m.us[1])); // mirrored duplicates exist for the UI only
  const foes = (s, p) => s.terrains.reduce((n, T) => n + T.side[1 - p].length, 0);
  function aiMove(s, level = 'normal') {
    const p = s.turn, b = blind(s, p), w = LEVELS[level] || LEVELS.normal;
    const ranked = moves(b).filter(uniq).map(m => {
      const c = clone(b);
      play(c, m);
      const bluff = m.kind === 'hidden' || m.t1 != null ? w.bluff : 0; // face-down play or a two-card face-down order
      const hits = w.aggro ? foes(b, p) - foes(c, p) + c.terrains.filter((T, t) => b.terrains[t].holder === 1 - p && T.holder !== 1 - p).length : 0;
      return { m, v: score(c, p, w) + bluff + (w.aggro || 0) * hits + Math.random() * 0.5 };
    }).sort((x, y) => y.v - x.v);
    if (w.margin) { // Recrue: hesitates between the moves that look about as good
      const ok = ranked.filter(r => r.v >= ranked[0].v - w.margin);
      return ok[Math.floor(Math.random() * ok.length)].m;
    }
    if (!w.roll) return ranked[0].m;
    // Vétéran: the k most aggressive-looking moves, each played out to nightfall `roll` times by two
    // Régulier players, on worlds where the opponent's hand and both draw orders are re-dealt.
    const tried = ranked.slice(0, w.k);
    for (const r of tried) {
      if (r.v >= 1e4) return r.m;
      r.wins = 0;
      for (let i = 0; i < w.roll; i++) {
        const c = guess(b, p);
        play(c, r.m);
        while (c.winner === null) play(c, aiMove(blind(c, c.turn)));
        if (c.winner === p) r.wins++;
      }
    }
    const top = Math.max(...tried.map(r => r.wins));
    return tried.find(r => r.wins >= top - w.slack).m; // tried is sorted: first = most aggressive-looking
  }

  return {
    use, RULES, ORDER, get TURNS() { return RULES.turns; }, get PACK() { return PACK; },
    get CARDS() { return CARDS; }, get TERRAINS() { return TERRAINS; }, get POWERS() { return POWERS; }, get MAIN() { return MAIN; },
    newGame, randomTerrains, moves, play, aiMove, score, LEVELS, blind, vals, totals, thr, lack, fills, surplus, pct, cap, control,
  };
})();
if (typeof module !== 'undefined') module.exports = E;
