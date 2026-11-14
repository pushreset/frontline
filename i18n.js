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
      reset: 'Nouvelle campagne', confirm: 'Confirmer ?', colon: ' : ', music: 'Musique', sounds: 'Sons', yes: 'oui', no: 'non', lang: 'English',
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
      hAi: "L'IA réfléchit…", hPick: 'Choisis une carte, ou retourne une de tes cartes face cachée : 1 action par tour.',
      hNoSlot: 'Aucun emplacement libre.', hNoTarget: 'Aucune cible légale : pose-la face cachée ou ravitaille.',
      hReplace: "Terrain plein : choisis l'unité à remplacer (elle est défaussée).", hPower: 'Choisis une cible pour le pouvoir, ou valide sans cible.', hTarget: 'Choisis une cible surlignée.',
      playOrder: "Jouer l'ordre", noTarget: 'Valider sans cible', hidden: 'Face cachée', hiddenTip: 'Bluff : vaut 0, pouvoir inactif. La retourner coûte 1 action.',
      supply: 'Ravitailler', supplyTip: 'Défausse la carte choisie, pioche 2', cancel: 'Annuler',
      victory: 'Victoire', defeat: 'Défaite', byNight: 'La nuit est tombée : départage au pourcentage de seuil rempli.', byTwo: 'Deux terrains capturés.', noMajority: "Personne n'a 2 terrains : le défenseur (l'IA) garde ses positions.",
      endScore: (a, b) => `Toi ${a} – ${b} IA`, endDone: 'La campagne est terminée. Lance une nouvelle campagne : les renforts seront différents.',
      endWin: 'Choisis ta prochaine bataille sur la carte.', endLose: 'Pas de game over : recommence, ou choisis une autre bataille ouverte sur la carte.',
      backMap: 'Retour à la carte', again: 'Recommencer', newBattle: 'Nouvelle bataille',
      noPower: 'Aucun pouvoir.', secret: 'Carte face cachée', unknown: 'Inconnue', secretText: "Vaut 0 tant qu'elle n'est pas retournée.",
      downNote: 'Face cachée : vaut 0, pouvoir inactif.', here: t => `Ici, sur ${t} :`,
      // gallery
      gTitle: 'Ligne de Front – Atelier', gIntro: "Toutes les illustrations pixel art du prototype : cartes, terrains, carte de campagne et icônes. Taille d'origine indiquée sous chaque image, affichée en zoom entier pour garder les pixels nets.",
      gUnits: 'Unités', gOrders: 'Ordres et dos de carte', gBase: 'Terrains de base', gCamp: 'Terrains de campagne', gMap: 'Carte de campagne', gIcons: "Icônes d'attributs",
      gBack: 'Dos de carte', gVariant: b => `Variante de ${b}`, gSides: 'allié / axe', gCamps: n => `${n} × 2 camps · 64 × 40 px`, gIll: n => `${n} illustrations`,
      gMapNote: 'Carte de campagne : les batailles sont posées dessus en HTML dans le jeu.',
    },
    en: {
      title: 'Front Line', resume: w => `Resume — ${w}`, campaign: 'Campaign', quick: 'Quick battle',
      reset: 'New campaign', confirm: 'Confirm?', colon: ': ', music: 'Music', sounds: 'Sounds', yes: 'on', no: 'off', lang: 'Français',
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
      hAi: 'The AI is thinking…', hPick: 'Pick a card, or flip one of your face-down cards: 1 action per turn.',
      hNoSlot: 'No free slot.', hNoTarget: 'No legal target: play it face down or resupply.',
      hReplace: 'Terrain full: pick the unit to replace (it is discarded).', hPower: 'Pick a target for the power, or confirm without one.', hTarget: 'Pick a highlighted target.',
      playOrder: 'Play order', noTarget: 'Confirm without target', hidden: 'Face down', hiddenTip: 'Bluff: worth 0, power inactive. Flipping it costs 1 action.',
      supply: 'Resupply', supplyTip: 'Discard the selected card, draw 2', cancel: 'Cancel',
      victory: 'Victory', defeat: 'Defeat', byNight: 'Night has fallen: decided by share of threshold filled.', byTwo: 'Two terrains captured.', noMajority: 'Nobody holds 2 terrains: the defender (the AI) keeps its ground.',
      endScore: (a, b) => `You ${a} – ${b} AI`, endDone: 'The campaign is over. Start a new campaign: the reinforcements will be different.',
      endWin: 'Pick your next battle on the map.', endLose: 'No game over: try again, or pick another open battle on the map.',
      backMap: 'Back to the map', again: 'Try again', newBattle: 'New battle',
      noPower: 'No power.', secret: 'Face-down card', unknown: 'Unknown', secretText: 'Worth 0 until it is flipped.',
      downNote: 'Face down: worth 0, power inactive.', here: t => `Here, on ${t}:`,
      gTitle: 'Front Line – Workshop', gIntro: 'Every pixel-art illustration in the prototype: cards, terrains, campaign map and icons. Native size is shown under each image, displayed at integer zoom to keep pixels sharp.',
      gUnits: 'Units', gOrders: 'Orders and card back', gBase: 'Base terrains', gCamp: 'Campaign terrains', gMap: 'Campaign map', gIcons: 'Attribute icons',
      gBack: 'Card back', gVariant: b => `Variant of ${b}`, gSides: 'Allied / Axis', gCamps: n => `${n} × 2 sides · 64 × 40 px`, gIll: n => `${n} illustrations`,
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
  };
})();
if (typeof module !== 'undefined') module.exports = I18N;
