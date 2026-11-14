# Ligne de Front · Front Line

A solo tactical card game set in Normandy, summer 1944, in pixel art. It runs in the browser with no
build step and no dependencies. Available in French and English.

**Play**: https://pushreset.github.io/frontline/, or open `index.html` locally.

## Gameplay

### The goal

Each battle is fought over **three terrains**. Every terrain has a **threshold** to reach in four
attributes: **Tank**, **Infantry**, **Air** and **Strategy** (for example 2 / 3 / 0 / 1). You play the
Allies against an AI that plays the German side with its own deck.

- Fill a terrain's whole threshold with your units and you **hold** it.
- If you still hold it at the start of your next turn, it is **captured**: the opponent had a full
  turn to strike back and failed. A captured terrain is closed for the rest of the battle.
- **Capture two terrains to win.** The AI wins on the spot. You play on for the third one: all three
  is a **total victory** (in a campaign: one more reinforcement). The battle ends when the third
  terrain is captured, by either side, or at nightfall.
- **Who starts** is decided before the terrains are dealt: a coin is tossed (Allied star, you start;
  eagle, the AI starts) in a quick battle, while each campaign battle follows its scenario (you, the AI,
  or the same coin toss).
- If nobody has two by **nightfall** (12 turns each), each open terrain goes to the side that filled
  the larger share of its threshold. Without a majority of two terrains, the defender (the AI) keeps
  its ground and wins.

### Your turn: one action

You start with 5 cards, draw 1 at the start of each turn, and can hold up to 7. Each turn you take
**one** action:

- **Deploy a unit face up** on a terrain. It adds its values to your side, and many units have a power
  that triggers when they are played (the Firefly destroys a light tank, the P-47 flips a face-down
  card, the Engineers move one of your units…).
- **Play a card face down.** It is worth **0** and its power is inactive: it is a bluff. The opponent
  only sees "???" and has to guess.
- **Reveal** one of your face-down cards: it gets its real values back. That costs your action, so
  bluffing is never free. A bluffed order that gets revealed is simply lost.
- **Play an order**: Artillery, Air Strike, Reconnaissance, Smoke Screen, Redeployment…
- **Resupply**: discard the selected card and draw 2.

Each side has 4 slots per terrain (3 on a bridge). On a full side you can still deploy by discarding
one of your own units there.

### Contested terrains

Both sides can fill the same threshold. The one with the larger **surplus** (total value above the
threshold) takes the hold; on a tie, whoever held it first keeps it. That is why you keep feeding a
terrain you already hold, and why destroying a single enemy unit can flip a whole terrain.

Every terrain also has a **trait** that changes how it plays: in the bocage each tank is worth 1 less,
in the ruined village face-down cards count as 2 Infantry, nothing can be destroyed in a bunker, no
tank can move in or out of the marsh, the hill lets your artillery hit any terrain, and so on.

### Campaign

- **23 battles** from the three D-Day beaches (Utah, Omaha, Sword) to the liberation of Paris. A
  campaign lasts 8 to 10 of them.
- **Your choices are final.** Every win opens the next battles, and winning one of them closes the
  other roads for good. If you lose, you can retry the same battle or pick another one that is open.
- **Three corridors with their own ground.** In the west, marshes and dense bocage favour infantry.
  The centre is balanced. In the east, the Caen plain favours tanks and aircraft. The map shows each
  battle's ground profile.
- **Reinforcements.** Some victories give a reward for the rest of the campaign:
  - a **veteran** copy of a card (+1 in its main attribute);
  - a **new card**: Sherman Jumbo, Hawker Typhoon, Commandos or Ambulance;
  - a **power** you can use once per battle, for free on top of your action (Naval Support,
    Reinforcements, Intelligence, Barrage, Air Cover);
  - or nothing at all.
- **Fog of war.** You only see the reward of the battles you can launch right now. Rewards are rolled
  as battles open, so each new campaign plays differently.
- **No game over**: a lost battle is simply replayed.

### Quick battle and difficulty

- **Quick battle**: three random terrains, no campaign bonuses.
- **Three enemy levels.** The rules, thresholds and terrains never change, only how the AI decides:
  - *Rookie* hesitates, spreads out, rarely bluffs and spots your threats late;
  - *Regular* plays the best move of the moment;
  - *Veteran* is aggressive: it plays each candidate move out to the end on guessed hands and punishes
    every opening.
- No level cheats: the AI never sees your hand or your face-down cards.

Progress is saved automatically in the browser. Music and sound effects are generated with Web Audio.

## Files

| File | Role |
|---|---|
| `index.html` | the game (interface, campaign map, save) |
| `engine.js` | rules and AI, no DOM, no campaign content: everything specific comes from the active pack |
| `campaign.js` | campaign runs for any pack: open battles, final choices, fog of war, rewards |
| `i18n.js` | interface texts and battle-log sentences, FR/EN |
| `audio.js` | music and sound effects |
| `assets.html` | gallery of a pack's illustrations (`assets.html?pack=normandie`) |
| `packs/<id>/` | one campaign each (see below); `packs/index.cjs` lists them for node |
| `packs/normandie/art.px.js` → `out/` | Normandy pixel art (pxl DSL); the built PNGs are committed in `out/` |
| `packs/test/pack.js` | hidden mini campaign the simulator plays, to prove the engine is campaign-agnostic |
| `sim.cjs`, `balance.cjs` | headless AI-vs-AI simulator, see below |

## Adding a campaign

A campaign is a folder in `packs/`. Nothing in `engine.js` has to change: the cards, terrains and
powers bring their own behaviour as small functions ("hooks").

1. **Create `packs/<id>/`** with these files (or a single file, like `packs/test/pack.js`). Each one
   adds to `globalThis.PACKS.<id>` and wraps its helpers in a `{ … }` block, because in the browser all
   scripts share one global scope.
   - `pack.js`: identity. Title, subtitle, dates and finale text (all `{ fr, en }`), the 4 attribute
     names and their icons, the card types (name, `main` attribute for veterans, deploy `sound`), the
     art folder, the menu picture (`cover`) and the map (`image` + longitude/latitude frame).
   - `cards.js`: `cards`, the two `decks` (player, AI), the campaign `powers` and the `rewards` pools.
   - `terrains.js`: `traits` (how a terrain plays), `terrains` (name, threshold, trait, text) and
     `quick`, the terrains a quick battle draws from.
   - `battles.js`: the campaign graph. Each battle has a name, date, `day` (time must move forward on
     every link), `pos` on the map, `next`, a `pool` of 4 terrains and a brief. Battles nobody points to
     are the starting choices; a battle with no `next` ends the campaign. Optional `first`: who takes the
     first turn (`0` the player, `1` the AI); without it, a coin toss.
   - `art.px.js` → `out/`: pictures named `scenes/c_<card>.png` (and `c_<card>_x.png` for the AI's
     version), `scenes/t_<terrain>.png`, `scenes/c_back.png`, the map, `sprites/i_<icon>.png` and the two faces of the initiative coin (`sprites/coin_0.png` the
     player, `coin_1.png` the AI). Build
     with `node ~/.claude/skills/pxl-pixel-art/bin/pxl.js build packs/<id>/art.px.js --no-preview`.
     A card or terrain can borrow another picture with `art: '<key>'`.
2. **Register it**: add its files to `packs/index.cjs` (node) and as `<script>` tags in `index.html`
   and `assets.html`. Bump the `?v=` of the script tags on every release, otherwise browsers may mix old
   and new files.
3. **Check it**: `node sim.cjs 300 <id>` (balance), `node sim.cjs 300 campagne <id>` (each battle,
   whole campaigns with and without rewards). The simulator first checks every pack: texts in FR and EN,
   every referenced card or terrain exists, every battle reachable and leading to an end.

### Hooks

A card is data plus optional functions. They receive `g`, a helper bound to the game (`g.p` is the side
the card acts for):

```js
firefly: {
  name: { fr: 'Sherman Firefly', en: 'Sherman Firefly' }, enemy: { fr: 'StuG III', en: 'StuG III' },
  type: 'Char', v: [2, 0, 0, 0],
  text: { fr: 'À la pose : détruit un Char adverse…', en: 'On deploy: destroy an enemy Tank…' },
  targets: (g, t) => g.safe(t) ? [] : g.hit(g.foes(t).filter(e => !e.down && g.type(e) === 'Char' && g.vals(e, t)[0] <= 2)),
  onPlay: (g, me, m) => { if (m.u != null) g.destroy(m.u); },
},
```

- **Cards**: `targets(g, t, card)` lists the choices when the unit is played on terrain `t` (orders:
  `targets(g, card)`), each `{ args, steps }`; `onPlay(g, me, move)` applies the chosen one (`move.u`,
  `move.t2`…). Passive hooks: `aura(g, unit, t, v)` changes any unit's values, `onTurnStart(g, me)`,
  `onFlipped(g, me, by)`, `extraSlot`, `surplus` (bonus in a contest), `immune` (`true` or a function),
  `tags`.
- **Terrain traits**: `modify(g, unit, t, v)` for units on this terrain, `fieldAura(g, unit, t, v)` for
  units everywhere, `slotDelta`, `downValue` (worth of a face-down card), `drawBonus` once captured,
  `hub` (adjacent to every terrain), `fog`, `blocksMove(g, unit)`, `immune`, `tags`.
- **Powers**: like orders, `targets(g)` + `onPlay(g, null, move)`; they never use up the turn.
- **`g`** reads the board with `foes(t)`, `allies(t)`, `mine()`, `theirs()`, `live()`, `type(u)`,
  `vals(u, t)`, `totals(t)`, `count(t)`, `cap(t)`, `adjacent(a, b)`, `canMove(u, from, to)`, `safe(t)`,
  `tough(u)`, `has(u, tag)`, `traitHas(t, tag)`, and changes it with `destroy`, `flip`, `move`, `swap`,
  `malus`, `draw`, `smoke`, `putDown`, `toHand`. `g.hit(units)` / `g.hits([{ u, t }])` turn units into
  targets; `g.U(id)`, `g.T(t)`, `g.H(id)` build the click steps.

`packs/normandie/` is the full reference; `packs/test/pack.js` shows mechanics Normandy does not have
(pushing an enemy back, conditional immunity, a ford, a bonus every turn) in a single file.

## Simulator

`node sim.cjs …` plays AI against AI without the interface (`[pack]` defaults to `normandie`):

| Command | What it tells you |
|---|---|
| `node sim.cjs 1000 [pack]` | balance: first-player edge, nightfall rate, battle length |
| `node sim.cjs 500 campagne [pack]` | each campaign battle, then whole campaigns with vs without rewards |
| `node sim.cjs 200 niveaux [pack]` | the three AI levels against each other, with a behaviour profile |
| `node sim.cjs 1 partie easy hard [pack]` | one battle told move by move |
| `node sim.cjs 300 empreinte` | one hash of 350 seeded battles: a refactor that must not change the game keeps it identical |
