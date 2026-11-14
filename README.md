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
- **Capture two terrains to win.**
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
| `engine.js` | rules and AI, no DOM |
| `campaign.js` | campaign battles, map links, rewards |
| `i18n.js` | English texts, FR/EN sentences |
| `audio.js` | music and sound effects |
| `assets.html` | gallery of every illustration |
| `art.px.js` → `out/` | pixel-art source (pxl DSL); the built PNGs are committed in `out/` |
| `sim.cjs`, `balance.cjs` | headless AI-vs-AI simulator: `node sim.cjs 1000` (balance), `node sim.cjs 500 campagne` (each campaign battle, runs with vs without rewards), `node sim.cjs 200 niveaux` (difficulty levels), `node sim.cjs 1 partie easy hard` (one battle told move by move) |
