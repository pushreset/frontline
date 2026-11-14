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
      tagline: "Batailles de cartes à travers l'histoire", chooseCampaign: 'Choisis ta campagne', chooseEra: 'Choisis ton époque', back: 'Retour', battles: n => `${n} batailles`,
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
      tagline: 'Card battles through history', chooseCampaign: 'Choose your campaign', chooseEra: 'Choose your era', back: 'Back', battles: n => `${n} battles`,
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
      hold: (p, c, x) => `⏳ ${p ? 'The AI holds' : 'You hold'} ${x}.`,
      free: (p, c, x) => `○ ${x} is open again.`,
      capture: (p, c, x) => `⚑ ${p ? 'The AI captures' : 'You capture'} ${x}!`,
      night: () => '☾ Night falls.',
      power: (p, c, x, w) => `⚡ You use ${w}.`,
    },
  };
  const logLine = ev => typeof ev === 'string' ? ev
    : LOG[lang][ev.e](ev.p, ev.card && cardName(ev.card, ev.p), ev.t && terrainName(ev.t), ev.pw && powerName(ev.pw));

  return {
    UI, LOG, t, tx, cardName, cardText, terrainName, terrainText, battle, logLine, powerName, powerText, pack,
    get lang() { return lang; }, set lang(l) { lang = l === 'en' ? 'en' : 'fr'; },
    typeName: ty => tx(pk().types[ty]) || ty, attrName: a => pk().attrs[lang][a],
    attrShort: a => (pk().short || pk().attrs)[lang][a], // packs may give short attribute names for chips
  };
})();
if (typeof module !== 'undefined') module.exports = I18N;
