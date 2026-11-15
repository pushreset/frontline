'use strict';
// FR / EN interface texts and battle-log sentences. Campaign texts (cards, terrains, battles, powers,
// attribute and type names) live in each pack as { fr, en } and are read here for the active pack.
// Shared by index.html, assets.html (global I18N) and sim.cjs (require).
const I18N = (() => {
  let lang = 'fr';
  const E_ = () => (typeof E !== 'undefined' ? E : require('./engine.js'));

  const UI = {
    fr: {
      title: 'Ligne de Front', resume: w => `Reprendre — ${w}`, campaign: 'Campagne', quick: 'Bataille rapide',
      tagline: "Batailles de cartes à travers l'histoire", chooseCampaign: 'Choisis ta campagne', chooseEra: 'Choisis ton théâtre', back: 'Retour', battles: n => `${n} batailles`,
      guide: 'Règles et tactique', guideRules: 'Les règles', guideTactics: 'Guide tactique',
      // phone layout
      hourShort: (h, n) => `Heure <b>${h}</b>/${n}`, scoreShort: (a, b) => `<span style="color:var(--me)">Toi <b>${a}</b></span> · <span style="color:var(--ai)"><b>${b}</b> IA</span>`,
      journal: 'Journal', flipShort: 'Retourner', hPlaceM: 'Touche un terrain « Poser ici ».', faceUpM: 'Visible', faceDownM: 'Cachée', supplySubM: 'défausse, pioche 2', barInfoM: 'Touche une carte. Appui long : détail.', orderLong: 'Ordre · appui long', close: 'Fermer', playCard: 'Jouer cette carte',
      usefulOn: 'Pouvoir utile sur', playableOn: 'Jouable sur', usefulNone: "Aucune cible pour l'instant : posée, elle ne déclenchera pas son pouvoir.",
      thrRow: 'Seuil', aiPlaced: 'IA posé', youPlaced: 'Toi posé', aiLacks: n => `IA manque <b>${n} pt${n > 1 ? 's' : ''}</b>`, youLacks: n => `Toi manque <b>${n} pt${n > 1 ? 's' : ''}</b>`,
      modNote: (fx, p, name, attr, x, y) => `${fx} : ${p ? "l'unité adverse" : 'ton unité'} ${name} compte ${x} ${attr} au lieu de ${y}.`,
      rotate: 'Tourne ton téléphone : le jeu se joue en portrait.', mapHint: 'Glisse pour explorer, pince pour zoomer', quit: 'Quitter la bataille',
      zoomIn: 'Zoomer', zoomOut: 'Dézoomer', prev: 'Carte précédente', next: 'Carte suivante',
      defend: 'Défense', defendTip: "Tiens jusqu'à la nuit : si personne n'a deux terrains, tu gardes tes positions et tu gagnes.", noMajorityYou: "Personne n'a 2 terrains : le défenseur (toi) tient ses positions.",
      reset: 'Nouvelle campagne', confirm: 'Confirmer ?', colon: ' : ', music: 'Musique', sounds: 'Sons', yes: 'oui', no: 'non', lang: 'English',
      help: 'Aide', helpTip: 'Survole un terrain : les 1 ou 2 cartes de ta main les plus utiles à y jouer sont signalées.', tip1: '★ Meilleur choix', tip2: 'Bon choix',
      diff: 'Ennemi', easy: 'Recrue', normal: 'Régulier', hard: 'Vétéran',
      easyTip: 'Il hésite, éparpille ses troupes, bluffe rarement et voit tard tes menaces.',
      normalTip: 'Il joue le meilleur coup du moment.',
      hardTip: 'Agressif et opportuniste : il anticipe la suite et punit chaque ouverture.',
      menu: 'Menu', map: 'Carte', restart: 'Recommencer la bataille', pool: 'Terrains possibles (3 tirés au hasard) :',
      launch: 'Lancer la bataille', stage: n => `étape ${n}`, mapAlt: 'Carte',
      reward: 'Récompense si tu gagnes', rewardFog: 'Récompense : ? Brouillard de guerre, gagne les batailles précédentes pour en savoir plus.',
      rewardGot: 'Obtenu', rewardNone: 'Aucun renfort : les lignes sont trop étirées.', gone: 'Branche abandonnée : tu as pris une autre route.',
      army: 'Ton armée', armyEmpty: 'Pas encore de renfort. Gagne des batailles pour en obtenir.', vet: 'Vétéran', vetNote: '+1 dans son attribut principal',
      newCard: 'Nouvelle carte', powerNote: 'Pouvoir : une fois par bataille, gratuit', profile: 'Terrain', balanced: 'équilibré', endReward: 'Renfort obtenu :',
      commit: 'Gagner cette bataille ferme les autres routes.',
      clock: (h, n) => `Heure <b>${h}</b> / ${n} avant la nuit`, score: (a, b) => `Terrains — <b style="color:var(--me)">Toi ${a}</b> · <b style="color:var(--ai)">${b} IA</b>`,
      decks: (a, b) => `pioche IA ${a} · ta pioche ${b}`, log: 'Journal de bataille',
      cap0: '⚑ Capturé par toi', cap1: "⚑ Capturé par l'IA", hold0: '⏳ Tenu par toi', hold1: "⏳ Tenu par l'IA — riposte !", free: 'Libre',
      thr: 'Seuil à atteindre', faceDown: 'face cachée', flipTip: 'Clique pour la retourner (1 action)',
      stampWin: 'Gagné', stampLose: 'Perdu', stampTie: 'Indécis', fxWin: 'Terrain pris !', fxLose: 'Terrain perdu !',
      night: '☾ La nuit tombe', hEnd: 'Fin de la bataille…',
      hAi: "L'IA réfléchit…", hPlace: 'Clique un terrain marqué « Poser ici »',
      hNoSlot: 'Aucun emplacement libre.', hNoTarget: 'Aucune cible légale : pose-la face cachée ou ravitaille.',
      hReplace: "Terrain plein : choisis l'unité à remplacer (elle est défaussée).", hTarget: 'Choisis une cible surlignée.',
      playOrder: "Jouer l'ordre", noTarget: 'Valider sans cible', noTargetSub: 'le pouvoir est perdu', noReplace: 'Poser sans remplacer',
      supply: 'Ravitailler', supplySub: 'défausse, pioche 2 cartes', cancel: 'Annuler', cancelPlace: 'Annuler la pose', cancelOrder: "Annuler l'ordre", esc: 'Échap',
      // action bar + "missing" rows of a terrain
      yourTurn: 'À toi · 1 action', barInfo: '<b>Choisis une carte</b> de ta main pour la poser, la poser cachée ou la ravitailler',
      flipBtn: 'Retourner une carte cachée', flipSub: 'clique-la sur le plateau · 1 action', flipNone: 'aucune carte cachée posée',
      placeHere: 'Poser ici', placeFog: 'Poser ici · dans le brouillard', fogged: 'brouillard', fogNote: "Brouillard : cachée à l'adversaire, mais elle garde ses valeurs. Pouvoir inactif.",
      faceUp: 'Face visible', faceDownBtn: 'Face cachée', targetTag: 'Cible', placing: 'En cours de pose',
      stepPill: (k, n) => `Étape ${k}/${n}`, powerPill: (k, n) => `Pouvoir · étape ${k}/${n}`,
      nTargets: n => `${n} cible${n > 1 ? 's' : ''} possible${n > 1 ? 's' : ''}.`, noTargets: 'Aucune cible : le pouvoir sera perdu.',
      gap: 'Brèche', gapTip: p => `Brèche : ce qu'il ${p ? "manque à l'IA" : 'te manque'} pour atteindre les seuils du terrain.`, pts: n => `${n} pt${n > 1 ? 's' : ''}`, placed: 'Posé', met: '✓ Seuils atteints',
      maybe: 'Carte cachée adverse : valeur inconnue',
      victory: 'Victoire', totalVictory: 'Victoire totale', byThree: 'Trois terrains capturés.', defeat: 'Défaite',
      secured: '★ Victoire totale',
      tossYou: "Tu as l'initiative", tossAi: "L'ennemi a l'initiative", scriptYou: "Scénario : tu as l'initiative", scriptAi: "Scénario : l'ennemi a l'initiative",
      init: 'Initiative', initYou: 'toi', initAi: "l'ennemi", initToss: 'au jeton', securedTip: 'Victoire acquise avec deux terrains. Capture aussi celui-ci : victoire totale.', endBonus: 'Bonus de victoire totale :',
      totalHint: 'Victoire totale (3 terrains) : un renfort de plus.', bonusGot: 'Victoire totale', byNight: 'La nuit est tombée : départage au pourcentage de seuil rempli.', byTwo: 'Deux terrains capturés.', noMajority: "Personne n'a 2 terrains : le défenseur (l'IA) garde ses positions.",
      endScore: (a, b) => `Toi ${a} – ${b} IA`, endDone: 'La campagne est terminée. Lance une nouvelle campagne : les renforts seront différents.',
      endWin: 'Choisis ta prochaine bataille sur la carte.', endLose: 'Pas de game over : recommence, ou choisis une autre bataille ouverte sur la carte.',
      backMap: 'Retour à la carte', again: 'Recommencer', newBattle: 'Nouvelle bataille',
      noPower: 'Aucun pouvoir.', secret: 'Carte face cachée', unknown: 'Inconnue', secretText: "Vaut 0 tant qu'elle n'est pas retournée.",
      downNote: 'Face cachée : vaut 0, pouvoir inactif.', here: t => `Ici, sur ${t} :`,
      // gallery
      gTitle: 'Ligne de Front – Atelier', gIntro: "Toutes les illustrations pixel art du prototype : cartes, terrains, carte de campagne et icônes. Taille d'origine indiquée sous chaque image, affichée en zoom entier pour garder les pixels nets.",
      gUnits: 'Unités', gOrders: 'Ordres et dos de carte', gBase: 'Terrains de base', gCamp: 'Terrains de campagne', gMap: 'Carte de campagne', gIcons: "Icônes d'attributs",
      gBack: 'Dos de carte', gVariant: b => `Variante de ${b}`, gSides: 'joueur / ennemi', gCamps: n => `${n} × 2 camps · 64 × 40 px`, gIll: n => `${n} illustrations`,
      gMapNote: 'Carte de campagne : les batailles sont posées dessus en HTML dans le jeu.',
    },
    en: {
      title: 'Front Line', resume: w => `Resume — ${w}`, campaign: 'Campaign', quick: 'Quick battle',
      tagline: 'Card battles through history', chooseCampaign: 'Choose your campaign', chooseEra: 'Choose your theatre', back: 'Back', battles: n => `${n} battles`,
      guide: 'Rules & tactics', guideRules: 'The rules', guideTactics: 'Tactics guide',
      // phone layout
      hourShort: (h, n) => `Hour <b>${h}</b>/${n}`, scoreShort: (a, b) => `<span style="color:var(--me)">You <b>${a}</b></span> · <span style="color:var(--ai)"><b>${b}</b> AI</span>`,
      journal: 'Log', flipShort: 'Flip', hPlaceM: 'Tap a terrain marked “Play here”.', faceUpM: 'Face up', faceDownM: 'Face down', supplySubM: 'discard, draw 2', barInfoM: 'Tap a card. Long press: details.', orderLong: 'Order · long press', close: 'Close', playCard: 'Play this card',
      usefulOn: 'Power useful on', playableOn: 'Playable on', usefulNone: 'No target for now: played, it will not trigger its power.',
      thrRow: 'Threshold', aiPlaced: 'AI has', youPlaced: 'You have', aiLacks: n => `AI misses <b>${n} pt${n > 1 ? 's' : ''}</b>`, youLacks: n => `You miss <b>${n} pt${n > 1 ? 's' : ''}</b>`,
      modNote: (fx, p, name, attr, x, y) => `${fx}: ${p ? 'the enemy' : 'your'} ${name} counts ${x} ${attr} instead of ${y}.`,
      rotate: 'Turn your phone: the game is played in portrait.', mapHint: 'Drag to explore, pinch to zoom', quit: 'Leave the battle',
      zoomIn: 'Zoom in', zoomOut: 'Zoom out', prev: 'Previous card', next: 'Next card',
      defend: 'Defence', defendTip: 'Hold until nightfall: if nobody has two terrains, you keep your ground and win.', noMajorityYou: 'Nobody holds 2 terrains: the defender (you) keeps its ground.',
      reset: 'New campaign', confirm: 'Confirm?', colon: ': ', music: 'Music', sounds: 'Sounds', yes: 'on', no: 'off', lang: 'Français',
      help: 'Help', helpTip: 'Hover a terrain: the 1 or 2 most useful cards to play there are flagged.', tip1: '★ Best pick', tip2: 'Good pick',
      diff: 'Enemy', easy: 'Rookie', normal: 'Regular', hard: 'Veteran',
      easyTip: 'Hesitates, spreads out, rarely bluffs and spots your threats late.',
      normalTip: 'Plays the best move of the moment.',
      hardTip: 'Aggressive and opportunistic: thinks ahead and punishes every opening.',
      menu: 'Menu', map: 'Map', restart: 'Restart battle', pool: 'Possible terrains (3 drawn at random):',
      launch: 'Start battle', stage: n => `stage ${n}`, mapAlt: 'Map',
      reward: 'Reward if you win', rewardFog: 'Reward: ? Fog of war, win the earlier battles to find out.',
      rewardGot: 'Gained', rewardNone: 'No reinforcements: the lines are stretched too thin.', gone: 'Abandoned branch: you took another road.',
      army: 'Your army', armyEmpty: 'No reinforcements yet. Win battles to earn some.', vet: 'Veteran', vetNote: '+1 in its main attribute',
      newCard: 'New card', powerNote: 'Power: once per battle, free', profile: 'Ground', balanced: 'balanced', endReward: 'Reinforcement gained:',
      commit: 'Winning this battle closes the other roads.',
      clock: (h, n) => `Hour <b>${h}</b> / ${n} before nightfall`, score: (a, b) => `Terrains — <b style="color:var(--me)">You ${a}</b> · <b style="color:var(--ai)">${b} AI</b>`,
      decks: (a, b) => `AI deck ${a} · your deck ${b}`, log: 'Battle log',
      cap0: '⚑ Captured by you', cap1: '⚑ Captured by the AI', hold0: '⏳ Held by you', hold1: '⏳ Held by the AI — strike back!', free: 'Open',
      thr: 'Threshold to reach', faceDown: 'face down', flipTip: 'Click to flip it (1 action)',
      stampWin: 'Won', stampLose: 'Lost', stampTie: 'Undecided', fxWin: 'Terrain taken!', fxLose: 'Terrain lost!',
      night: '☾ Night falls', hEnd: 'Battle over…',
      hAi: 'The AI is thinking…', hPlace: 'Click a terrain marked "Play here"',
      hNoSlot: 'No free slot.', hNoTarget: 'No legal target: play it face down or resupply.',
      hReplace: 'Terrain full: pick the unit to replace (it is discarded).', hTarget: 'Pick a highlighted target.',
      playOrder: 'Play order', noTarget: 'Confirm without target', noTargetSub: 'the power is lost', noReplace: 'Play without replacing',
      supply: 'Resupply', supplySub: 'discard, draw 2 cards', cancel: 'Cancel', cancelPlace: 'Cancel play', cancelOrder: 'Cancel order', esc: 'Esc',
      yourTurn: 'Your turn · 1 action', barInfo: '<b>Pick a card</b> from your hand to play it, play it face down or resupply',
      flipBtn: 'Flip a face-down card', flipSub: 'click it on the board · 1 action', flipNone: 'no face-down card on the board',
      placeHere: 'Play here', placeFog: 'Play here · into the fog', fogged: 'fog', fogNote: 'Fog: hidden from the enemy, but it keeps its values. Power inactive.',
      faceUp: 'Face up', faceDownBtn: 'Face down', targetTag: 'Target', placing: 'Being played',
      stepPill: (k, n) => `Step ${k}/${n}`, powerPill: (k, n) => `Power · step ${k}/${n}`,
      nTargets: n => `${n} possible target${n > 1 ? 's' : ''}.`, noTargets: 'No target: the power will be lost.',
      gap: 'Gap', gapTip: p => `Gap: what ${p ? 'the AI still needs' : 'you still need'} to reach the terrain's thresholds.`, pts: n => `${n} pt${n > 1 ? 's' : ''}`, placed: 'Placed', met: '✓ Thresholds met',
      maybe: 'Enemy face-down card: unknown value',
      victory: 'Victory', totalVictory: 'Total victory', byThree: 'Three terrains captured.', defeat: 'Defeat',
      secured: '★ Total victory',
      tossYou: 'You have the initiative', tossAi: 'The enemy has the initiative', scriptYou: 'Scenario: you have the initiative', scriptAi: 'Scenario: the enemy has the initiative',
      init: 'Initiative', initYou: 'you', initAi: 'the enemy', initToss: 'coin toss', securedTip: 'Two terrains: the battle is won. Capture this one too for a total victory.', endBonus: 'Total victory bonus:',
      totalHint: 'Total victory (3 terrains): one more reinforcement.', bonusGot: 'Total victory', byNight: 'Night has fallen: decided by share of threshold filled.', byTwo: 'Two terrains captured.', noMajority: 'Nobody holds 2 terrains: the defender (the AI) keeps its ground.',
      endScore: (a, b) => `You ${a} – ${b} AI`, endDone: 'The campaign is over. Start a new campaign: the reinforcements will be different.',
      endWin: 'Pick your next battle on the map.', endLose: 'No game over: try again, or pick another open battle on the map.',
      backMap: 'Back to the map', again: 'Try again', newBattle: 'New battle',
      noPower: 'No power.', secret: 'Face-down card', unknown: 'Unknown', secretText: 'Worth 0 until it is flipped.',
      downNote: 'Face down: worth 0, power inactive.', here: t => `Here, on ${t}:`,
      gTitle: 'Front Line – Workshop', gIntro: 'Every pixel-art illustration in the prototype: cards, terrains, campaign map and icons. Native size is shown under each image, displayed at integer zoom to keep pixels sharp.',
      gUnits: 'Units', gOrders: 'Orders and card back', gBase: 'Base terrains', gCamp: 'Campaign terrains', gMap: 'Campaign map', gIcons: 'Attribute icons',
      gBack: 'Card back', gVariant: b => `Variant of ${b}`, gSides: 'player / enemy', gCamps: n => `${n} × 2 sides · 64 × 40 px`, gIll: n => `${n} illustrations`,
      gMapNote: 'Campaign map: battles are placed on top in HTML in the game.',
    },
  };

  // Campaign texts are { fr, en } in the active pack (E.PACK); English falls back to French.
  const pk = () => E_().PACK;
  const tx = o => (o ? (typeof o === 'string' ? o : o[lang] ?? o.fr) : '');
  const cardName = (key, owner) => { const C = pk().cards[key]; return tx(owner ? C.enemy || C.name : C.name); };
  const cardText = key => tx(pk().cards[key].text);
  const terrainName = key => tx(pk().terrains[key].name);
  const terrainText = key => tx(pk().terrains[key].text);
  const powerName = k => tx(pk().powers[k].name);
  const powerText = k => tx(pk().powers[k].text);
  const battle = b => ({ ...b, name: tx(b.name), date: tx(b.date), brief: tx(b.brief) });
  const pack = (field, P = pk()) => tx(P[field]);
  const t = (k, ...a) => { const v = UI[lang][k] ?? UI.fr[k]; return typeof v === 'function' ? v(...a) : v; };

  // Battle log events -> sentences. Old saves may still hold plain strings.
  const LOG = {
    fr: {
      deploy: (p, c, x) => `${p ? "L'IA déploie" : 'Tu déploies'} ${c} sur ${x}.`,
      fog: (p, c, x) => `${p ? "L'IA pose" : 'Tu poses'} une carte dans le brouillard (${x}).`,
      hidden: (p, c, x) => `${p ? "L'IA pose" : 'Tu poses'} une carte face cachée sur ${x}.`,
      order: (p, c) => `${p ? "L'IA joue" : 'Tu joues'} ${c}.`,
      supply: p => (p ? "L'IA se ravitaille." : 'Tu te ravitailles.'),
      pass: p => (p ? "L'IA passe." : 'Tu passes.'),
      first: p => (p ? "L'IA a l'initiative." : "Tu as l'initiative."),
      destroy: (p, c, x) => `✖ ${c} détruit (${x}).`,
      reveal: (p, c, x) => `↻ ${c} révélé (${x}).`,
      conceal: (p, c, x) => `⤓ ${c} retourné face cachée (${x}).`,
      hold: (p, c, x) => `⏳ ${p ? "L'IA tient" : 'Tu tiens'} ${x}.`,
      free: (p, c, x) => `○ ${x} redevient libre.`,
      capture: (p, c, x) => `⚑ ${p ? "L'IA capture" : 'Tu captures'} ${x} !`,
      night: () => '☾ La nuit tombe.',
      power: (p, c, x, w) => `⚡ Tu actives ${w}.`,
    },
    en: {
      deploy: (p, c, x) => `${p ? 'The AI deploys' : 'You deploy'} ${c} on ${x}.`,
      fog: (p, c, x) => `${p ? 'The AI plays' : 'You play'} a card into the fog (${x}).`,
      hidden: (p, c, x) => `${p ? 'The AI plays' : 'You play'} a card face down on ${x}.`,
      order: (p, c) => `${p ? 'The AI plays' : 'You play'} ${c}.`,
      supply: p => (p ? 'The AI resupplies.' : 'You resupply.'),
      pass: p => (p ? 'The AI passes.' : 'You pass.'),
      first: p => (p ? 'The AI has the initiative.' : 'You have the initiative.'),
      destroy: (p, c, x) => `✖ ${c} destroyed (${x}).`,
      reveal: (p, c, x) => `↻ ${c} revealed (${x}).`,
      conceal: (p, c, x) => `⤓ ${c} turned face down (${x}).`,
      hold: (p, c, x) => `⏳ ${p ? 'The AI holds' : 'You hold'} ${x}.`,
      free: (p, c, x) => `○ ${x} is open again.`,
      capture: (p, c, x) => `⚑ ${p ? 'The AI captures' : 'You capture'} ${x}!`,
      night: () => '☾ Night falls.',
      power: (p, c, x, w) => `⚡ You use ${w}.`,
    },
  };
  // Home page "Rules & tactics": two long pages per language (plain HTML), kept true to engine.js.
  const GUIDE = {
    fr: {
      rules: `
<h3>Le but</h3>
<p>Chaque bataille se joue sur <b>trois terrains</b>. <b>Captures-en deux</b> pour gagner. Tu joues contre l'IA, chacun avec son propre paquet.</p>
<h3>Le seuil</h3>
<p>Chaque terrain affiche un <b>seuil</b> : une valeur à atteindre dans quatre attributs, qui dépendent de l'époque (en Normandie : Char, Infanterie, Air, Stratégie). Les unités que tu poses sur le terrain additionnent leurs valeurs. La ligne <b>Brèche</b> sous le seuil indique ce qu'il te manque encore, celle du dessus ce qu'il manque à l'IA.</p>
<h3>Tenir, puis capturer</h3>
<ul>
<li>Atteins tout le seuil d'un terrain : tu le <b>tiens</b> (⏳).</li>
<li>Si tu le tiens encore au début de ton tour suivant, il est <b>capturé</b> (⚑) : l'IA a eu un tour complet pour riposter et n'y est pas arrivée. Un terrain capturé est fermé jusqu'à la fin de la bataille.</li>
<li>Si les deux camps atteignent le seuil, le plus gros <b>surplus</b> (le total au-delà du seuil) prend la tenue. À égalité, celui qui tenait le premier garde le terrain.</li>
</ul>
<h3>Ton tour : une seule action</h3>
<p>Tu commences avec 5 cartes et tu en pioches 1 au début de chaque tour (7 en main au maximum). Puis tu fais <b>une</b> action :</p>
<ul>
<li><b>Poser une unité face visible.</b> Elle ajoute ses valeurs, et beaucoup d'unités ont un pouvoir qui se déclenche à la pose.</li>
<li><b>Poser une carte face cachée.</b> Elle vaut 0 et son pouvoir est inactif : c'est un bluff, l'IA ne voit que « ??? ».</li>
<li><b>Retourner une de tes cartes face cachée.</b> Elle retrouve ses valeurs, mais ça coûte ton action. Un ordre bluffé qui est retourné est perdu.</li>
<li><b>Jouer un ordre</b> : artillerie, bombardement, reconnaissance, écran de fumée… L'ordre agit puis part à la défausse.</li>
<li><b>Ravitailler</b> : défausse la carte choisie et pioche 2 cartes.</li>
</ul>
<p>Chaque camp a 4 emplacements par terrain (parfois 3). Sur un côté plein, tu peux encore poser une unité en défaussant l'une des tiennes à cet endroit.</p>
<h3>Les cartes retournées par l'adversaire</h3>
<p>Certains pouvoirs retournent face cachée une unité adverse de valeur totale 2 ou moins : elle vaut 0 jusqu'à ce que son propriétaire dépense une action pour la retourner. Jamais sur un terrain que son camp tient, et jamais une unité qui a un effet quand on la retourne (Résistance, mines, Hobbits…).</p>
<h3>Chaque terrain a sa règle</h3>
<p>La règle d'un terrain est écrite sous son nom. Dans le bocage, chaque char vaut 1 de moins. Rien ne peut être détruit dans un bunker. Aucun char n'entre ni ne sort du marais. Une plage capturée te fait piocher une carte de plus par tour… Touche le « i » d'un terrain pour le détail.</p>
<h3>La nuit</h3>
<p>Une bataille dure 13 tours chacun : l'horloge en haut indique l'heure. Après le 13e tour, la nuit tombe :</p>
<ul>
<li>chaque terrain encore libre va au camp qui a rempli la plus grande part de son seuil (le surplus ne compte pas, et à égalité il ne va à personne) ;</li>
<li>le camp qui a deux terrains gagne ;</li>
<li>sinon, le <b>défenseur</b> garde ses positions et gagne : l'IA en général, toi dans les batailles défensives.</li>
</ul>
<h3>La victoire totale</h3>
<p>Avec deux terrains, la bataille est gagnée, mais tu peux continuer pour le troisième. Les trois terrains, c'est une <b>victoire totale</b> (en campagne, un renfort de plus). L'IA, elle, gagne dès son deuxième terrain.</p>
<h3>La campagne</h3>
<ul>
<li>Choisis ta campagne, puis ta bataille sur la carte. Chaque victoire ouvre les batailles suivantes et peut fermer d'autres routes pour de bon.</li>
<li>Une victoire peut rapporter un renfort pour la suite : une carte <b>vétéran</b> (+1 dans son attribut principal), une <b>nouvelle carte</b>, un <b>pouvoir</b> utilisable une fois par bataille, gratuitement et en plus de ton action… ou rien.</li>
<li>Une bataille perdue se rejoue : il n'y a pas de game over.</li>
</ul>
<h3>Les niveaux</h3>
<p>Recrue, Régulier, Vétéran : les règles ne changent jamais, seule la façon de jouer de l'IA change. Aucun niveau ne triche : l'IA ne voit ni ta main ni tes cartes face cachée. En partie, le bouton <b>Aide</b> affiche des conseils au fil du jeu.</p>`,
      tactics: `
<p class="lead">Dix principes, du plus important au plus fin.</p>
<h3>1. Vise deux terrains, pas trois</h3>
<p>Deux captures suffisent. Répartir tes cartes sur les trois terrains, c'est n'en remplir aucun. Choisis tôt les deux terrains dont le seuil colle le mieux à ta main. Le troisième ne compte que pour la victoire totale.</p>
<h3>2. Lis la Brèche avant chaque coup</h3>
<p>La ligne Brèche dit exactement ce qu'il te manque. Le surplus ne sert qu'en cas de contestation : un quatrième point d'Infanterie là où il en faut trois est souvent une carte gaspillée, sauf si l'IA remplit aussi le seuil. Pense à la règle du terrain : dans le bocage, un Sherman apporte un Char de moins.</p>
<h3>3. Tenir n'est pas capturer</h3>
<p>Quand tu tiens un terrain, l'IA a tout un tour pour le casser. Avant de compléter un seuil, demande-toi ce qu'elle peut faire en retour : détruire une unité (artillerie, bombardement), en affaiblir une, ou remplir le seuil elle aussi avec plus de surplus. Une tenue avec de la marge, ou protégée (écran de fumée, Officier de liaison qui compte +2 de surplus), a plus de chances de tenir.</p>
<h3>4. Riposte quand l'IA tient</h3>
<p>« Tenu par l'IA — riposte ! » : tu n'as qu'un tour. Une seule unité détruite ou affaiblie peut faire tomber tout le terrain. Sinon, remplis le seuil toi aussi avec un plus gros surplus pour lui reprendre la tenue. Sur un terrain que l'IA tient, ses unités ne peuvent pas être retournées face cachée : il faut détruire, affaiblir ou la dépasser.</p>
<h3>5. Bluffe au bon moment</h3>
<ul>
<li>Une carte face cachée occupe un emplacement et laisse l'IA dans le doute, mais elle vaut 0 et la retourner coûte une action. Ne bluffe pas trop.</li>
<li>Elle échappe aux effets qui ne visent que les unités face visible (« détruit une unité face visible de valeur 2 ou moins »).</li>
<li>Certaines cartes sont faites pour être retournées : Résistance, mines, Hobbits… Leur effet se déclenche à ce moment-là, y compris quand c'est l'adversaire qui les retourne.</li>
<li>Certains terrains changent la donne : dans un village en ruines, une carte face cachée vaut 2 Infanterie. En forêt, les unités sont posées face cachée mais gardent leurs valeurs.</li>
</ul>
<h3>6. Joue les pouvoirs quand ils servent</h3>
<p>Un pouvoir « à la pose » ne se déclenche qu'une fois. Une unité posée face cachée puis retournée ne le déclenche pas, et une unité qui en remplace une autre sur un côté plein non plus. Un P-47 posé sans cible ne retourne rien : garde-le pour le tour où il change quelque chose.</p>
<h3>7. Gère ta main</h3>
<p>Une main bloquée te fait perdre des tours. Ravitailler (défausser une carte pour en piocher 2) vaut souvent mieux qu'un coup inutile. Les terrains qui donnent une carte de plus par tour une fois capturés (la Plage en Normandie, le Village en Terre du Milieu) méritent d'être pris tôt : l'avantage s'accumule.</p>
<h3>8. Garde un œil sur l'horloge</h3>
<p>Vers la 10e heure, fais tes comptes. Si tu ne peux plus capturer deux terrains, remplis la plus grande part possible du seuil sur deux terrains : c'est ce qui compte à la nuit. En attaque, une nuit sans majorité est une défaite. En défense, il suffit de tenir jusque-là.</p>
<h3>9. Garde tes pouvoirs pour le tour décisif</h3>
<p>Les pouvoirs de campagne sont gratuits mais ne servent qu'une fois par bataille. Garde-les pour le tour qui décide : compléter un seuil, casser la tenue de l'IA, ou protéger un terrain la veille de sa capture.</p>
<h3>10. Choisis ta route en campagne</h3>
<p>La carte de campagne montre le profil de terrain de chaque bataille. En Normandie, l'ouest (marais, bocage dense) favorise l'infanterie, l'est (plaine de Caen) les chars et l'aviation. Prends la route qui va avec tes renforts : une carte vétéran pèse plus là où son attribut est demandé.</p>`,
    },
    en: {
      rules: `
<h3>The goal</h3>
<p>Each battle is fought over <b>three terrains</b>. <b>Capture two</b> to win. You play against the AI, each side with its own deck.</p>
<h3>The threshold</h3>
<p>Every terrain shows a <b>threshold</b>: a value to reach in four attributes, which depend on the era (in Normandy: Tank, Infantry, Air, Strategy). The units you deploy on a terrain add up their values. The <b>Gap</b> row under the threshold shows what you still lack, the one above it what the AI lacks.</p>
<h3>Hold, then capture</h3>
<ul>
<li>Reach a terrain's whole threshold and you <b>hold</b> it (⏳).</li>
<li>If you still hold it at the start of your next turn, it is <b>captured</b> (⚑): the AI had a full turn to strike back and failed. A captured terrain is closed for the rest of the battle.</li>
<li>If both sides reach the threshold, the larger <b>surplus</b> (the total above the threshold) takes the hold. On a tie, whoever held it first keeps it.</li>
</ul>
<h3>Your turn: one action</h3>
<p>You start with 5 cards and draw 1 at the start of each turn (7 in hand at most). Then you take <b>one</b> action:</p>
<ul>
<li><b>Deploy a unit face up.</b> It adds its values, and many units have a power that triggers when they are played.</li>
<li><b>Play a card face down.</b> It is worth 0 and its power is inactive: it is a bluff, the AI only sees "???".</li>
<li><b>Reveal one of your face-down cards.</b> It gets its values back, but that costs your action. A bluffed order that gets revealed is lost.</li>
<li><b>Play an order</b>: artillery, air strike, reconnaissance, smoke screen… The order acts, then goes to the discard pile.</li>
<li><b>Resupply</b>: discard the selected card and draw 2.</li>
</ul>
<p>Each side has 4 slots per terrain (sometimes 3). On a full side you can still deploy a unit by discarding one of yours there.</p>
<h3>Cards turned by the enemy</h3>
<p>Some powers turn an enemy unit worth 2 or less in total face down: it is worth 0 until its owner spends an action to reveal it. Never on a terrain its side holds, and never a unit with an effect when it is turned (Resistance, mines, Hobbits…).</p>
<h3>Every terrain has its rule</h3>
<p>A terrain's rule is written under its name. In the bocage each tank is worth 1 less. Nothing can be destroyed in a bunker. No tank moves in or out of the marsh. A captured beach draws you one extra card per turn… Tap a terrain's "i" for the details.</p>
<h3>Nightfall</h3>
<p>A battle lasts 13 turns each: the clock at the top shows the hour. After the 13th turn, night falls:</p>
<ul>
<li>each terrain still open goes to the side that filled the larger share of its threshold (surplus does not count, and on a tie it goes to nobody);</li>
<li>the side with two terrains wins;</li>
<li>otherwise the <b>defender</b> keeps its ground and wins: usually the AI, you in defensive battles.</li>
</ul>
<h3>Total victory</h3>
<p>With two terrains the battle is won, but you can play on for the third. All three is a <b>total victory</b> (in a campaign, one more reinforcement). The AI wins as soon as it takes its second terrain.</p>
<h3>The campaign</h3>
<ul>
<li>Pick a campaign, then a battle on the map. Every win opens the next battles and may close other roads for good.</li>
<li>A win can bring a reinforcement for the rest of the campaign: a <b>veteran</b> card (+1 in its main attribute), a <b>new card</b>, a <b>power</b> you can use once per battle, for free on top of your action… or nothing.</li>
<li>A lost battle is simply replayed: there is no game over.</li>
</ul>
<h3>Difficulty</h3>
<p>Rookie, Regular, Veteran: the rules never change, only how the AI plays. No level cheats: the AI never sees your hand or your face-down cards. In a battle, the <b>Help</b> button shows tips as you play.</p>`,
      tactics: `
<p class="lead">Ten principles, from the most important to the finest.</p>
<h3>1. Aim for two terrains, not three</h3>
<p>Two captures are enough. Spreading your cards over all three terrains fills none of them. Pick early the two terrains whose thresholds best match your hand. The third only matters for a total victory.</p>
<h3>2. Read the Gap before every move</h3>
<p>The Gap row tells you exactly what you lack. Surplus only helps in a contest: a fourth Infantry point where three are needed is often a wasted card, unless the AI fills the threshold too. Mind the terrain's rule: in the bocage a Sherman brings one Tank less.</p>
<h3>3. Holding is not capturing</h3>
<p>Once you hold a terrain, the AI has a whole turn to break it. Before completing a threshold, ask what it can do in return: destroy a unit (artillery, air strike), weaken one, or fill the threshold too with more surplus. A hold with a margin, or a protected one (smoke screen, a Liaison Officer counting +2 surplus), is more likely to last.</p>
<h3>4. Strike back when the AI holds</h3>
<p>"Held by the AI — strike back!": you have one turn. A single unit destroyed or weakened can bring the whole terrain down. Otherwise fill the threshold too with a larger surplus to take the hold back. On a terrain the AI holds, its units cannot be turned face down: you have to destroy, weaken or outscore.</p>
<h3>5. Bluff at the right time</h3>
<ul>
<li>A face-down card takes a slot and keeps the AI guessing, but it is worth 0 and revealing it costs an action. Don't overdo it.</li>
<li>It escapes effects that only hit face-up units ("destroy a face-up enemy unit worth 2 or less").</li>
<li>Some cards are made to be turned: Resistance, mines, Hobbits… Their effect triggers right then, even when the enemy turns them.</li>
<li>Some terrains change everything: in a ruined village a face-down card is worth 2 Infantry. In a forest, units are played face down but keep their values.</li>
</ul>
<h3>6. Play powers when they matter</h3>
<p>An "on deploy" power triggers only once. A unit played face down and revealed later does not trigger it, and neither does a unit replacing another on a full side. A P-47 played with no target flips nothing: keep it for the turn when it changes something.</p>
<h3>7. Manage your hand</h3>
<p>A stuck hand costs you turns. Resupplying (discard one card, draw 2) is often better than a useless move. Terrains that draw you an extra card each turn once captured (the Beach in Normandy, the Village in Middle-earth) are worth taking early: the edge adds up.</p>
<h3>8. Watch the clock</h3>
<p>Around the 10th hour, do the maths. If you can no longer capture two terrains, fill the largest possible share of the threshold on two terrains: that is what counts at nightfall. Attacking, a night without a majority is a defeat. Defending, you only have to hold until then.</p>
<h3>9. Save your powers for the decisive turn</h3>
<p>Campaign powers are free but work once per battle. Keep them for the turn that decides: completing a threshold, breaking the AI's hold, or protecting a terrain the turn before it is captured.</p>
<h3>10. Choose your road in a campaign</h3>
<p>The campaign map shows each battle's ground profile. In Normandy the west (marshes, dense bocage) favours infantry, the east (the Caen plain) tanks and aircraft. Take the road that suits your reinforcements: a veteran card weighs more where its attribute is needed.</p>`,
    },
  };
  const logLine = ev => typeof ev === 'string' ? ev
    : LOG[lang][ev.e](ev.p, ev.card && cardName(ev.card, ev.p), ev.t && terrainName(ev.t), ev.pw && powerName(ev.pw));

  return {
    UI, LOG, GUIDE, guide: k => GUIDE[lang][k], t, tx, cardName, cardText, terrainName, terrainText, battle, logLine, powerName, powerText, pack,
    get lang() { return lang; }, set lang(l) { lang = l === 'en' ? 'en' : 'fr'; },
    typeName: ty => tx(pk().types[ty]) || ty, attrName: a => pk().attrs[lang][a],
    attrShort: a => (pk().short || pk().attrs)[lang][a], // packs may give short attribute names for chips
  };
})();
if (typeof module !== 'undefined') module.exports = I18N;
