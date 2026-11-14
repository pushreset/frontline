'use strict';
// Ligne de Front — rules engine + level-1 AI, GDD v0.1.
// No DOM: shared by index.html (classic <script>) and sim.cjs (node), so the
// "simulateur sans interface" and the vertical slice test the same rules.
const E = (() => {
  const ATTRS = ['Char', 'Infanterie', 'Air', 'Stratégie'];
  // Balance knobs, mutable so balance.cjs can sweep them. Defaults = the rules index.html plays.
  // thrDelta shifts every non-zero threshold (min 1); replace = deploy onto a full side by discarding one of your units.
  const RULES = { turns: 12, thrDelta: 0, slots: 4, replace: true };

  const U = (name, axis, type, v, text = '') => ({ name, axis, type, v, text });
  const O = (name, text) => ({ name, type: 'Ordre', v: [0, 0, 0, 0], text });
  const CARDS = {
    sherman: U('Sherman M4', 'Panzer IV', 'Char', [3, 0, 0, 1]),
    firefly: U('Sherman Firefly', 'StuG III', 'Char', [2, 0, 0, 0], 'À la pose : détruit un Char adverse de valeur Char 2 ou moins sur ce terrain.'),
    section: U("Section d'infanterie", 'Grenadiers', 'Infanterie', [0, 3, 0, 1]),
    rangers: U('Rangers', 'Gebirgsjäger', 'Infanterie', [0, 2, 0, 1], 'Peut occuper un 5e emplacement quand le terrain est plein.'),
    mortiers: U('Mortiers', 'Granatwerfer', 'Infanterie', [0, 2, 0, 0], 'À la pose : une unité adverse sur ce terrain perd 1 Infanterie.'),
    paras: U('Parachutistes', 'Fallschirmjäger', 'Infanterie', [0, 2, 1, 0], 'Posés face cachée, ils se retournent seuls au début de ton tour suivant.'),
    p47: U('P-47 Thunderbolt', 'Fw 190', 'Air', [1, 0, 2, 0], 'À la pose : retourne une carte face cachée adverse sur ce terrain.'),
    spitfire: U('Spitfire', 'Bf 109', 'Air', [0, 0, 3, 0], 'Les unités Air adverses sur ce terrain perdent 1 Air.'),
    genie: U('Génie militaire', 'Pionniers', 'Soutien', [1, 1, 0, 1], "À la pose : déplace une de tes unités vers un terrain adjacent."),
    officier: U('Officier de liaison', 'Officier de liaison', 'Soutien', [0, 1, 0, 2], 'Ton surplus sur ce terrain compte +2 en cas de contestation.'),
    resistance: U('Résistance', 'Contre-espions', 'Soutien', [0, 1, 0, 2], "Retournée par une unité adverse : détruit cette unité."),
    observateur: U('Observateur', 'Observateur', 'Soutien', [0, 0, 0, 2], 'Tes Artilleries peuvent viser un terrain non adjacent à tes unités.'),
    artillerie: O('Artillerie lourde', 'Détruit une unité adverse non Char de valeur totale 3 ou moins (terrain où tu as une unité, ou adjacent).'),
    bombardement: O('Bombardement aérien', 'Si tu as 2 Air devant un terrain : détruit une unité adverse sur ce terrain.'),
    recon: O('Reconnaissance', 'Retourne une carte face cachée. Pioche 1.'),
    opsecrete: O('Opération secrète', 'Pose 2 cartes face cachée sur deux terrains différents.'),
    sabotage: O('Sabotage', 'Renvoie une carte face cachée adverse dans la main de son propriétaire.'),
    echange: O('Échange de front', 'Échange deux de tes unités situées sur deux terrains différents.'),
    redeploy: O('Redéploiement', "Déplace jusqu'à 2 de tes unités vers un même terrain adjacent."),
    fumee: O('Écran de fumée', "Jusqu'à ton prochain tour, l'adversaire ne peut pas te prendre un terrain que tu tiens."),
    // What the AI (and the player's preview) sees instead of an enemy face-down card.
    inconnu: U('???', '???', 'Soutien', [0, 0, 0, 0]),
  };

  // Château-QG skipped: campaign-only.
  // Thresholds rebalanced for "face-down = 0" (balance.cjs): GDD values -2 per attribute, -1 for Bocage and Forêt.
  const TERRAINS = {
    bocage: { name: 'Bocage', thr: [2, 3, 0, 1], text: 'Haies : chaque Char posé ici vaut 1 Char de moins.' },
    pont: { name: 'Le Pont', thr: [3, 1, 1, 1], text: 'Goulet : 3 emplacements par camp au lieu de 4.' },
    village: { name: 'Village en ruines', thr: [1, 3, 0, 2], text: 'Combat de rue : les cartes face cachée valent 2 en Infanterie.' },
    plage: { name: 'Plage', thr: [1, 3, 1, 1], text: 'Tête de pont : une fois capturée, tu pioches 1 carte de plus par tour.' },
    colline: { name: 'Colline', thr: [1, 1, 1, 2], text: "Point haut : tant que tu la tiens, ton Artillerie vise n'importe quel terrain." },
    aerodrome: { name: 'Aérodrome', thr: [1, 1, 2, 1], text: 'Piste : une fois capturé, tes unités Air valent +1 Air ailleurs.' },
    carrefour: { name: 'Carrefour', thr: [2, 1, 1, 1], text: 'Nœud routier : adjacent aux deux autres terrains.' },
    foret: { name: 'Forêt enneigée', thr: [1, 3, 0, 2], text: "Brouillard : toute unité posée ici l'est face cachée mais garde ses valeurs. Pouvoirs inactifs." },
    marais: { name: 'Marais', thr: [1, 2, 1, 1], text: "Enlisement : aucun Char n'y entre ni n'en sort par déplacement." },
  };
  // Campaign variants: same trait as `base` (text repeated so the card reads on its own), own threshold,
  // optional own slot count. 'bunker' is a campaign-only trait.
  const V = (base, name, thr, extra = {}) => ({ base, name, thr, text: TERRAINS[base] ? TERRAINS[base].text : '', ...extra });
  const BETON = 'Béton : aucune unité ici ne peut être détruite.';
  Object.assign(TERRAINS, {
    omaha_dog: V('plage', 'Omaha – Dog Green', [1, 3, 1, 1]),
    omaha_easy: V('plage', 'Omaha – Easy Red', [2, 2, 1, 1]),
    port_cherbourg: V('plage', 'Port de Cherbourg', [2, 2, 1, 2], { text: 'Port : une fois capturé, tu pioches 1 carte de plus par tour.' }),
    wn62: V('bunker', "Point d'appui WN62", [1, 3, 0, 2], { text: BETON }),
    fort_roule: V('bunker', 'Fort du Roule', [2, 2, 0, 2], { text: BETON }),
    pointe_hoc: V('colline', 'Pointe du Hoc', [1, 3, 0, 2], { slots: 3, text: "Falaise : 3 emplacements. Tant que tu la tiens, ton Artillerie vise n'importe quel terrain." }),
    cote_112: V('colline', 'Cote 112', [2, 1, 1, 2]),
    mont_ormel: V('colline', 'Mont-Ormel', [1, 2, 1, 2]),
    bocage_dense: V('bocage', 'Bocage dense', [1, 4, 0, 1]),
    chemin_creux: V('bocage', 'Chemin creux', [2, 2, 0, 2], { slots: 3, text: 'Haies, goulet : 3 emplacements, chaque Char posé ici vaut 1 Char de moins.' }),
    pegasus: V('pont', 'Pegasus Bridge', [1, 2, 0, 1], { slots: 2, text: 'Coup de main : 2 emplacements par camp.' }),
    pont_mine: V('pont', 'Pont miné', [2, 1, 0, 2]),
    chaussee: V('pont', 'Chaussée de Carentan', [2, 2, 0, 1]),
    pont_vernon: V('pont', 'Pont de Vernon', [3, 2, 1, 2], { slots: 4, text: 'Large fleuve : 4 emplacements, gros seuil.' }),
    sainte_mere: V('village', 'Sainte-Mère-Église', [1, 3, 1, 1]),
    caen: V('village', 'Caen en ruines', [2, 3, 0, 2]),
    saint_lo: V('village', 'Saint-Lô', [1, 3, 0, 3]),
    paris: V('village', 'Paris – Hôtel de Ville', [1, 3, 0, 3]),
    carpiquet: V('aerodrome', 'Carpiquet', [1, 2, 2, 1]),
    cerisy: V('foret', 'Forêt de Cerisy', [1, 3, 0, 2]),
  });

  const UNITS14 = ['sherman', 'sherman', 'section', 'section', 'firefly', 'rangers', 'mortiers', 'paras', 'p47', 'spitfire', 'genie', 'officier', 'resistance', 'observateur'];
  const DECKS = [
    [...UNITS14, 'artillerie', 'bombardement', 'recon', 'opsecrete', 'redeploy', 'fumee'],
    [...UNITS14, 'artillerie', 'bombardement', 'recon', 'sabotage', 'echange', 'fumee'],
  ];

  const sum = a => a.reduce((x, y) => x + y, 0);
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const nameOf = (key, owner) => (owner ? CARDS[key].axis : CARDS[key].name) || CARDS[key].name;
  // Trait kind of a terrain: campaign variants (Omaha, Pegasus Bridge…) inherit their base terrain's trait.
  const K = T => TERRAINS[T.key].base || T.key;
  const live = (s, t) => s.terrains[t].captured === null;
  const cap = (s, t) => TERRAINS[s.terrains[t].key].slots || RULES.slots - (K(s.terrains[t]) === 'pont' ? 1 : 0);
  // Béton: nothing on a bunker terrain can be destroyed by Artillerie, Bombardement or Firefly.
  const bunker = (s, t) => K(s.terrains[t]) === 'bunker';
  const adjacent = (s, a, b) => a !== b && (Math.abs(a - b) === 1 || K(s.terrains[a]) === 'carrefour' || K(s.terrains[b]) === 'carrefour');

  function find(s, id) {
    for (let t = 0; t < 3; t++) for (let p = 0; p < 2; p++) {
      const u = s.terrains[t].side[p].find(x => x.id === id);
      if (u) return { u, t, p };
    }
  }

  function vals(s, u, t) {
    const T = s.terrains[t];
    // Face-down = pure bluff: worth nothing until its owner spends an action to reveal it (Village trait aside).
    // Forest fog hides units from the opponent but they still fight (otherwise every unit there costs 2 actions).
    const fog = K(T) === 'foret' && CARDS[u.key].type !== 'Ordre' && u.key !== 'inconnu';
    if (u.down && !fog) return [0, K(T) === 'village' ? 2 : 0, 0, 0];
    const C = CARDS[u.key], v = C.v.slice();
    if (C.type === 'Char' && K(T) === 'bocage') v[0] = Math.max(0, v[0] - 1);
    v[1] = Math.max(0, v[1] - u.malus);
    if (C.type === 'Air') {
      if (T.side[1 - u.owner].some(e => !e.down && e.key === 'spitfire')) v[2] = Math.max(0, v[2] - 1);
      if (K(T) !== 'aerodrome' && s.terrains.some(X => K(X) === 'aerodrome' && X.captured === u.owner)) v[2]++;
    }
    return v;
  }
  const totals = (s, t, p) => s.terrains[t].side[p].reduce((acc, u) => { vals(s, u, t).forEach((x, a) => acc[a] += x); return acc; }, [0, 0, 0, 0]);
  const thr = (s, t) => TERRAINS[s.terrains[t].key].thr.map(x => x && Math.max(1, x + RULES.thrDelta));
  const fills = (s, t, p) => { const tot = totals(s, t, p); return thr(s, t).every((x, a) => tot[a] >= x); };
  const surplus = (s, t, p) => sum(totals(s, t, p)) - sum(thr(s, t)) + 2 * s.terrains[t].side[p].filter(u => !u.down && u.key === 'officier').length;
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
    s.players[f.p].discard.push({ id, key: f.u.key });
    log(s, { e: 'destroy', p: f.p, card: f.u.key, t: s.terrains[f.t].key });
  }
  function flip(s, id, by) {
    const f = find(s, id);
    if (!f || !f.u.down) return;
    f.u.down = false;
    log(s, { e: 'reveal', p: f.p, card: f.u.key, t: s.terrains[f.t].key });
    if (CARDS[f.u.key].type === 'Ordre') return destroy(s, id); // a bluffed order is worth nothing once seen
    // ponytail: "à la pose" powers do not re-trigger on flip (would need target prompts mid-effect). Passive powers do.
    if (f.u.key === 'resistance' && by != null) {
      const b = find(s, by);
      if (b && b.p !== f.p) destroy(s, by);
    }
  }
  function moveUnit(s, id, to) {
    const f = find(s, id), side = s.terrains[f.t].side[f.p];
    side.splice(side.indexOf(f.u), 1);
    s.terrains[to].side[f.p].push(f.u);
  }
  const marsh = (s, u, a, b) => CARDS[u.key].type === 'Char' && (K(s.terrains[a]) === 'marais' || K(s.terrains[b]) === 'marais');
  const canMove = (s, u, from, to) => live(s, from) && live(s, to) && adjacent(s, from, to) && !marsh(s, u, from, to) && s.terrains[to].side[u.owner].length < cap(s, to);

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
    for (let t = 0; t < 3; t++) if (live(s, t)) for (const u of [...s.terrains[t].side[p]]) if (u.down && u.key === 'paras') flip(s, u.id, null);
    control(s, p);
    draw(s, p, 1 + s.terrains.filter(T => K(T) === 'plage' && T.captured === p).length);
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
    const p = s.turn, o = 1 - p, H = s.players[p].hand, out = [];
    const T = [0, 1, 2].filter(t => live(s, t));
    const mine = [], theirs = [];
    for (const t of T) {
      for (const u of s.terrains[t].side[p]) mine.push({ u, t });
      for (const u of s.terrains[t].side[o]) theirs.push({ u, t });
    }
    const n = t => s.terrains[t].side[p].length;
    for (const x of mine) if (x.u.down) out.push({ kind: 'reveal', u: x.u.id, steps: ['u' + x.u.id] });
    for (const c of H) {
      const C = CARDS[c.key];
      out.push({ kind: 'supply', c: c.id, steps: ['supply'] });
      for (const t of T) {
        const forest = K(s.terrains[t]) === 'foret', free = n(t) < cap(s, t);
        if (free) out.push({ kind: 'hidden', c: c.id, t, steps: ['t' + t] });
        if (C.type === 'Ordre') continue;
        // ponytail: a replacing unit does not trigger its "à la pose" power (no second target prompt).
        if (!free && RULES.replace) for (const x of s.terrains[t].side[p]) out.push({ kind: 'deploy', c: c.id, t, rep: x.id, steps: ['t' + t, 'u' + x.id] });
        if (!free && !(c.key === 'rangers' && !forest && n(t) === cap(s, t))) continue;
        const base = { kind: 'deploy', c: c.id, t }, st = ['t' + t];
        out.push({ ...base, steps: st });
        if (forest) continue; // lands face-down, power inactive
        const foes = s.terrains[t].side[o];
        const targets =
          c.key === 'firefly' ? bunker(s, t) ? [] : foes.filter(e => !e.down && CARDS[e.key].type === 'Char' && vals(s, e, t)[0] <= 2)
          : c.key === 'mortiers' ? foes.filter(e => !e.down)
          : c.key === 'p47' ? foes.filter(e => e.down) : [];
        for (const e of targets) out.push({ ...base, u: e.id, steps: [...st, 'u' + e.id] });
        if (c.key === 'genie') for (const x of mine) for (const to of T)
          if (canMove(s, x.u, x.t, to) && (to !== t || n(t) + 1 < cap(s, t)))
            out.push({ ...base, u: x.u.id, t2: to, steps: [...st, 'u' + x.u.id, 't' + to] });
      }
      if (C.type !== 'Ordre') continue;
      const ord = (x, steps) => out.push({ kind: 'order', c: c.id, ...x, steps });
      const hit = list => list.forEach(x => ord({ u: x.u.id }, ['u' + x.u.id]));
      if (c.key === 'artillerie') {
        const far = mine.some(x => !x.u.down && x.u.key === 'observateur') || s.terrains.some(X => K(X) === 'colline' && (X.holder === p || X.captured === p));
        hit(theirs.filter(x => !bunker(s, x.t) && !x.u.down && CARDS[x.u.key].type !== 'Char' && sum(vals(s, x.u, x.t)) <= 3 && (far || mine.some(m => m.t === x.t || adjacent(s, m.t, x.t)))));
      } else if (c.key === 'bombardement') hit(theirs.filter(x => !bunker(s, x.t) && totals(s, x.t, p)[2] >= 2));
      else if (c.key === 'recon') hit([...mine, ...theirs].filter(x => x.u.down));
      else if (c.key === 'sabotage') hit(theirs.filter(x => x.u.down));
      else if (c.key === 'fumee') ord({}, ['play']);
      else if (c.key === 'opsecrete') {
        for (const a of H) for (const b of H) if (a !== b && a !== c && b !== c)
          for (const t1 of T) for (const t2 of T) if (t1 !== t2 && n(t1) < cap(s, t1) && n(t2) < cap(s, t2))
            ord({ a: a.id, t1, b: b.id, t2 }, ['h' + a.id, 't' + t1, 'h' + b.id, 't' + t2]);
      } else if (c.key === 'echange') {
        for (const x of mine) for (const y of mine) if (x.t !== y.t && !marsh(s, x.u, x.t, y.t) && !marsh(s, y.u, x.t, y.t))
          ord({ a: x.u.id, b: y.u.id }, ['u' + x.u.id, 'u' + y.u.id]);
      } else if (c.key === 'redeploy') {
        for (const d of T) {
          const cand = mine.filter(x => canMove(s, x.u, x.t, d));
          for (const x of cand) {
            ord({ us: [x.u.id], t: d }, ['u' + x.u.id, 't' + d]);
            if (cap(s, d) - n(d) >= 2) for (const y of cand) if (x !== y) ord({ us: [x.u.id, y.u.id], t: d }, ['u' + x.u.id, 'u' + y.u.id, 't' + d]);
          }
        }
      }
    }
    if (!out.length) out.push({ kind: 'pass', steps: ['pass'] });
    return out;
  }

  function play(s, m) {
    const p = s.turn, P = s.players[p];
    const take = id => P.hand.splice(P.hand.findIndex(c => c.id === id), 1)[0];
    const put = (card, t, down) => { const u = { ...card, owner: p, down, malus: 0 }; s.terrains[t].side[p].push(u); return u; };
    if (m.kind === 'supply') { P.discard.push(take(m.c)); draw(s, p, 2); log(s, { e: 'supply', p }); }
    else if (m.kind === 'hidden') { put(take(m.c), m.t, true); log(s, { e: 'hidden', p, t: s.terrains[m.t].key }); }
    else if (m.kind === 'reveal') flip(s, m.u, null);
    else if (m.kind === 'deploy') {
      if (m.rep != null) destroy(s, m.rep);
      const down = K(s.terrains[m.t]) === 'foret', u = put(take(m.c), m.t, down);
      log(s, { e: down ? 'fog' : 'deploy', p, card: u.key, t: s.terrains[m.t].key });
      if (!down && m.u != null) {
        if (u.key === 'firefly') destroy(s, m.u);
        if (u.key === 'mortiers') find(s, m.u).u.malus++;
        if (u.key === 'p47') flip(s, m.u, u.id);
        if (u.key === 'genie') moveUnit(s, m.u, m.t2);
      }
    } else if (m.kind === 'order') {
      const c = take(m.c);
      P.discard.push(c);
      log(s, { e: 'order', p, card: c.key });
      if (c.key === 'artillerie' || c.key === 'bombardement') destroy(s, m.u);
      else if (c.key === 'recon') { flip(s, m.u, null); draw(s, p, 1); }
      else if (c.key === 'sabotage') {
        const f = find(s, m.u), side = s.terrains[f.t].side[f.p];
        side.splice(side.indexOf(f.u), 1);
        s.players[f.p].hand.push({ id: f.u.id, key: f.u.key });
      } else if (c.key === 'fumee') s.smoke[p] = true;
      else if (c.key === 'opsecrete') { put(take(m.a), m.t1, true); put(take(m.b), m.t2, true); }
      else if (c.key === 'echange') { const ta = find(s, m.a).t, tb = find(s, m.b).t; moveUnit(s, m.a, tb); moveUnit(s, m.b, ta); }
      else if (c.key === 'redeploy') m.us.forEach(id => moveUnit(s, id, m.t));
    } else log(s, { e: 'pass', p });
    endTurn(s);
  }

  function newGame(keys = ['bocage', 'pont', 'village']) {
    let id = 0;
    const s = {
      terrains: keys.map(key => ({ key, side: [[], []], holder: null, ripe: false, captured: null })),
      players: DECKS.map(d => ({ deck: shuffle(d.map(key => ({ id: id++, key }))), hand: [], discard: [], turns: 0 })),
      turn: 0, winner: null, timeout: false, smoke: [false, false], log: [],
    };
    // ponytail: no mulligan — add when hand quality shows up as a problem in playtests.
    draw(s, 0, 5); draw(s, 1, 5);
    startTurn(s);
    return s;
  }
  const randomTerrains = () => shuffle(Object.keys(TERRAINS).filter(k => !TERRAINS[k].base)).slice(0, 3);

  // ---- AI level 1: one half-turn lookahead, never cheats -------------------
  // Hand/deck cards are immutable {id,key}, so only arrays and board units are copied.
  const clone = s => ({
    ...s, log: [], smoke: [...s.smoke],
    players: s.players.map(P => ({ ...P, deck: [...P.deck], hand: [...P.hand], discard: [...P.discard] })),
    terrains: s.terrains.map(T => ({ ...T, side: T.side.map(a => a.map(u => ({ ...u }))) })),
  });
  // State as seen by p: enemy face-down cards become anonymous (worth 0, like any face-down card).
  function blind(s, p) {
    const c = clone(s);
    for (const T of c.terrains) for (const u of T.side[1 - p]) if (u.down) u.key = 'inconnu';
    return c;
  }
  function score(s, p) {
    if (s.winner !== null) return s.winner === p ? 1e4 : -1e4;
    const o = 1 - p, caps = s.terrains.filter(T => T.captured !== null).length;
    const late = RULES.turns - s.players[p].turns <= 2; // night is close: percentages decide
    let v = 0.3 * s.players[p].hand.length;
    s.terrains.forEach((T, t) => {
      if (T.captured !== null) { v += T.captured === p ? 100 : -100; return; }
      const a = pct(s, t, p), b = pct(s, t, o);
      let x = 12 * a * a - 12 * b * b; // squared: concentrate rather than sprinkle
      if (T.holder === p) x += 30; else if (T.holder === o) x -= 30;
      const tot = totals(s, t, p), over = sum(thr(s, t).map((th, i) => Math.max(0, tot[i] - th)));
      x += over * (b > 0.5 ? 0.5 : -0.7); // waste, unless the terrain is contested
      if (late) x += a > b ? 15 : a < b ? -15 : 0;
      v += x * (1 + 0.5 * caps); // remaining terrains become decisive
    });
    return v;
  }
  function aiMove(s) {
    const p = s.turn, b = blind(s, p);
    let best = null, bs = -Infinity;
    for (const m of moves(b)) {
      if (m.a > m.b || (m.us && m.us[0] > m.us[1])) continue; // mirrored duplicates exist for the UI only
      const c = clone(b);
      play(c, m);
      const v = score(c, p) + Math.random() * 0.5;
      if (v > bs) { bs = v; best = m; }
    }
    return best;
  }

  return { K, ATTRS, RULES, get TURNS() { return RULES.turns; }, CARDS, TERRAINS, newGame, randomTerrains, moves, play, aiMove, blind, vals, totals, thr, fills, surplus, pct, cap, nameOf, control };
})();
if (typeof module !== 'undefined') module.exports = E;
