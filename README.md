# Ligne de Front · Front Line

A solo tactical card game in pixel art, across several eras of history: **Verdun 1916** (First World
War) and **Normandy 1944** (Second World War). It runs in the browser with no build step and no
dependencies. Available in French and English.

**Play**: https://pushreset.github.io/frontline/, or open `index.html` locally.

## Gameplay

### The goal

Each battle is fought over **three terrains**. Every terrain has a **threshold** to reach in four
attributes, which depend on the era: **Tank**, **Infantry**, **Air** and **Strategy** in Normandy,
**Artillery**, **Infantry**, **Engineering** and **Morale** at Verdun (for example 2 / 3 / 0 / 1). You play
the Allies (in 1916, the French) against an AI that plays the German side with its own deck.

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

### Campaigns

The menu offers a **campaign** picker and, for a quick battle, a **theatre** picker (one tile per campaign,
in chronological order). Each campaign keeps its own progress.

#### Verdun 1916

One long battle in one sector, on a staff map of the Meuse and its forts, from the Bois des Caures
(21 February) to Louvemont (15 December). **15 battles**, a campaign lasts 7 to 9.

- **Two acts.** Until July you **defend**: the enemy has the initiative and, at nightfall, if nobody holds
  two terrains, the defender is **you**: holding until night is a win. From October you counter-attack,
  with the initiative and the usual rule (the AI defends).
- **Attrition instead of armour.** No tanks, hardly any aircraft. Shelling, gas and worn-out ground take
  Infantry away from units for good (the steady fire of the 155 mm howitzer, a gas attack that hits
  **both** sides except engineers, the no man's land that wears down your strongest unit every turn).
  Relief (back to hand), stretcher-bearers, deep dugouts in a trench and Pétain's rotation take it back.
- **Mines.** Tunnellers are a bluff with teeth: the moment they are turned face up, by you or by the
  enemy, they blow the strongest enemy unit on their terrain.
- **Asymmetric decks**: the French creeping barrage and trench cleaners, the German drumfire and
  flamethrowers. Terrains: trench, no man's land, barbed wire, crater field, forts, ridges, razed
  villages, shattered woods, communication trenches, depots.
- Rewards: veterans, new cards (Stretcher-Bearers, Schilt Flamethrower, RICM, Carrier Pigeon) and powers
  (Sacred Way, Rotation, 400 mm Railway Gun, Aerial Reconnaissance, None Shall Pass).

#### Pacific 1941–1945

Island after island across a naval chart of the Pacific, from Wake (December 1941) to Okinawa (April 1945).
**17 battles**, a campaign lasts 10.

- **Two roads to Japan.** 1942 is defensive (Wake or the Coral Sea, Midway, Henderson Field). Then you choose:
  **Nimitz** across the Central Pacific (Tarawa, Kwajalein, Saipan, then the Philippine Sea or Guam) or
  **MacArthur** along New Guinea (Bougainville, Hollandia, Peleliu, then Leyte or Leyte Gulf). Both meet at
  Iwo Jima, then Okinawa. The great naval battles of 1944 are Japanese counter-attacks: you defend.
- **Navy, Infantry, Air, Logistics.** On the open sea infantry is worth nothing. On a coral reef landing
  craft run aground (a unit counts 1 Infantry less until your next turn, the amtrac excepted). Airstrips give
  your aircraft +1 Air everywhere else, caves make units indestructible, mangroves give malaria.
- **Asymmetric decks**: US carriers (+1 Air to all your aircraft), Corsairs, amtracs, Navajo code talkers and
  the Turkey Shoot; Japanese dug-in garrisons that cannot be destroyed, snipers, the Yamato and banzai charges.
  From Leyte on, **kamikazes** join the enemy deck: each one sinks a ship and dies with it.
- Rewards: veterans, new cards (TBF Avenger, Navy Corpsmen, F4U Corsair, Code Talkers) and powers (Station
  Hypo, Task Force 58, Fleet Gunfire, Leapfrogging, Hold at All Costs).

#### Normandy 1944

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

- **Quick battle**: pick a theatre, three random terrains of that campaign, no campaign bonuses.
- **Three enemy levels.** The rules, thresholds and terrains never change, only how the AI decides:
  - *Rookie* hesitates, spreads out, rarely bluffs and spots your threats late;
  - *Regular* plays the best move of the moment;
  - *Veteran* is aggressive: it plays each candidate move out to the end on guessed hands and punishes
    every opening.
- No level cheats: the AI never sees your hand or your face-down cards.

Progress is saved automatically in the browser. Music and sound effects are generated with Web Audio.

### Phone and offline

- **Phones, portrait only** (below 600 px wide): three terrain columns side by side, units in 2 × 2 squares,
  the hand as a fan, the same action bar in two lines. Tap a card then a terrain to play; **long press**
  (400 ms) on a card or a unit for its details, **tap a terrain** for its sheet (threshold, what each side has
  after the terrain's effect, what it misses, and why). The battle log, sound, language, enemy level and
  restart live in the menu sheet. The Android back button cancels the current step or closes the sheet.
  Held sideways, the phone asks to be turned. The campaign map drags with a finger and zooms with a pinch.
- **Install it** (Add to Home Screen): it opens full screen, in portrait, and works **offline**. The service
  worker (`sw.js`) fetches from the network first and keeps a copy of everything it loads; the installed app
  also fetches every campaign picture once in the background. Above 600 px wide, nothing changes.

## Files

| File | Role |
|---|---|
| `index.html` | the game (menu, campaign map, battle interface, save) |
| `engine.js` | rules and AI, no DOM, no campaign content: everything specific comes from the active pack |
| `campaign.js` | campaign runs for any pack: open battles, final choices, fog of war, rewards |
| `i18n.js` | interface texts and battle-log sentences, FR/EN |
| `audio.js` | music and sound effects |
| `assets.html` | gallery of a pack's illustrations (`assets.html?pack=normandie`) |
| `manifest.webmanifest`, `sw.js`, `icons/` | installable app (PWA): manifest, offline service worker, icons (`icons/icon.px.js` → `icons/out/`) |
| `packs/<id>/` | one campaign each (see below); `packs/index.cjs` lists them for node |
| `packs/<id>/art.px.js` → `out/` | each campaign's pixel art (pxl DSL); the built PNGs are committed in `out/` |
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
     Also its `era` (`{ key, fr, en, years }`: the menus show it on the campaign's tile and sort campaigns by
     its years), and optionally its look: `theme` (CSS
     colours: `olive`, `btn`, `btnHi`, `edge`, `bg1`-`bg3`, `panel`, `panelEdge`, `tile1`, `tile2`; the
     defaults are Normandy's), `font: 'serif'` (titles in Georgia instead of the stencil) and `startSound`
     (a sound of `audio.js` played when a battle starts).
   - `cards.js`: `cards`, the two `decks` (player, AI), the campaign `powers` and the `rewards` pools.
   - `terrains.js`: `traits` (how a terrain plays), `terrains` (name, threshold, trait, text) and
     `quick`, the terrains a quick battle draws from.
   - `battles.js`: the campaign graph. Each battle has a name, date, `day` (time must move forward on
     every link), `pos` on the map, `next`, a `pool` of 4 terrains and a brief. Battles nobody points to
     are the starting choices; a battle with no `next` ends the campaign. Optional `first`: who takes the
     first turn (`0` the player, `1` the AI); without it, a coin toss. Optional `defend: true`: at nightfall
     without a majority, the player keeps the ground and wins (by default the AI does). Optional `aiCards`:
     card keys added to the AI's deck for this battle only (the Pacific's kamikazes from Leyte on).
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
  `hub` (adjacent to every terrain), `fog`, `blocksMove(g, unit)`, `immune`, `tags`, `onTurnStart(g, t)`
  (at the start of each turn of side `g.p`, while the terrain is open: Verdun's worn-out no man's land).
- **Powers**: like orders, `targets(g)` + `onPlay(g, null, move)`; they never use up the turn.
- **`g`** reads the board with `foes(t)`, `allies(t)`, `mine()`, `theirs()`, `live()`, `type(u)`,
  `vals(u, t)`, `totals(t)`, `count(t)`, `cap(t)`, `adjacent(a, b)`, `canMove(u, from, to)`, `safe(t)`,
  `tough(u)`, `has(u, tag)`, `traitHas(t, tag)`, and changes it with `destroy`, `flip`, `move`, `swap`,
  `malus`, `draw`, `smoke`, `putDown`, `toHand`. `g.hit(units)` / `g.hits([{ u, t }])` turn units into
  targets; `g.U(id)`, `g.T(t)`, `g.H(id)` build the click steps.

`packs/normandie/`, `packs/verdun/` and `packs/pacifique/` are full references; `packs/test/pack.js` shows mechanics Normandy does not have
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
