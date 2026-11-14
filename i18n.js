'use strict';
// FR / EN. French stays the source of truth in engine.js and campaign.js; this file holds the
// English data, plus the UI and battle-log sentences in both languages. Missing English entries
// fall back to French. Shared by index.html, assets.html (global I18N) and sim.cjs (require).
const I18N = (() => {
  let lang = 'fr';
  const E_ = () => (typeof E !== 'undefined' ? E : require('./engine.js'));
  const C_ = () => (typeof CAMPAIGN !== 'undefined' ? CAMPAIGN : require('./campaign.js'));

  const EN = {
    cards: {
      sherman: { name: 'Sherman M4' },
      firefly: { name: 'Sherman Firefly', text: 'On deploy: destroy an enemy Tank with Armour 2 or less on this terrain.' },
      section: { name: 'Rifle Squad' },
      rangers: { name: 'Rangers', text: 'Can take a 5th slot when the terrain is full.' },
      mortiers: { name: 'Mortars', axis: 'Granatwerfer', text: 'On deploy: an enemy unit on this terrain loses 1 Infantry.' },
      paras: { name: 'Paratroopers', text: 'Played face down, they flip themselves at the start of your next turn.' },
      p47: { name: 'P-47 Thunderbolt', text: 'On deploy: flip an enemy face-down card on this terrain.' },
      spitfire: { name: 'Spitfire', text: 'Enemy Air units on this terrain lose 1 Air.' },
      genie: { name: 'Combat Engineers', axis: 'Pioniere', text: 'On deploy: move one of your units to an adjacent terrain.' },
      officier: { name: 'Liaison Officer', axis: 'Verbindungsoffizier', text: 'Your surplus on this terrain counts +2 in a contest.' },
      resistance: { name: 'Resistance', axis: 'Abwehr Agents', text: 'Flipped by an enemy unit: destroy that unit.' },
      observateur: { name: 'Forward Observer', axis: 'Artilleriebeobachter', text: 'Your Artillery can target a terrain not adjacent to your units.' },
      artillerie: { name: 'Heavy Artillery', text: 'Destroy an enemy non-Tank unit worth 3 or less in total (terrain where you have a unit, or adjacent).' },
      bombardement: { name: 'Air Strike', text: 'If you have 2 Air on a terrain: destroy an enemy unit there.' },
      recon: { name: 'Reconnaissance', text: 'Flip a face-down card. Draw 1.' },
      opsecrete: { name: 'Covert Operation', text: 'Play 2 cards face down on two different terrains.' },
      sabotage: { name: 'Sabotage', text: "Return an enemy face-down card to its owner's hand." },
      echange: { name: 'Front Swap', text: 'Swap two of your units on two different terrains.' },
      redeploy: { name: 'Redeployment', text: 'Move up to 2 of your units to the same adjacent terrain.' },
      jumbo: { name: 'Sherman Jumbo', text: 'Up-armoured: cannot be destroyed.' },
      typhoon: { name: 'Hawker Typhoon', text: 'On deploy: destroy an enemy Tank worth 3 or less in total on this terrain.' },
      commandos: { name: 'Commandos', text: 'On deploy: destroy an enemy face-down card on this terrain.' },
      ambulance: { name: 'Ambulance', text: 'On deploy: draw 2 cards.' },
      fumee: { name: 'Smoke Screen', text: "Until your next turn, the enemy can't take a terrain you hold." },
    },
    terrains: {
      bocage: { name: 'Bocage', text: 'Hedgerows: each Tank here is worth 1 Armour less.' },
      pont: { name: 'The Bridge', text: 'Bottleneck: 3 slots per side instead of 4.' },
      village: { name: 'Ruined Village', text: 'Street fighting: face-down cards are worth 2 Infantry.' },
      plage: { name: 'Beach', text: 'Beachhead: once captured, you draw 1 extra card per turn.' },
      colline: { name: 'Hill', text: 'High ground: while you hold it, your Artillery can target any terrain.' },
      aerodrome: { name: 'Airfield', text: 'Runway: once captured, your Air units get +1 Air elsewhere.' },
      carrefour: { name: 'Crossroads', text: 'Road hub: adjacent to both other terrains.' },
      foret: { name: 'Snowy Forest', text: 'Fog: units played here are face down but keep their values. Powers inactive.' },
      marais: { name: 'Marsh', text: 'Bogged down: no Tank can move in or out.' },
      omaha_dog: { name: 'Omaha – Dog Green' }, omaha_easy: { name: 'Omaha – Easy Red' },
      port_cherbourg: { name: 'Port of Cherbourg', text: 'Harbour: once captured, you draw 1 extra card per turn.' },
      wn62: { name: 'Strongpoint WN62', text: 'Concrete: no unit here can be destroyed.' },
      fort_roule: { name: 'Fort du Roule', text: 'Concrete: no unit here can be destroyed.' },
      pointe_hoc: { name: 'Pointe du Hoc', text: 'Cliff: 3 slots. While you hold it, your Artillery can target any terrain.' },
      cote_112: { name: 'Hill 112' }, mont_ormel: { name: 'Mont-Ormel' },
      bocage_dense: { name: 'Dense Bocage' },
      chemin_creux: { name: 'Sunken Lane', text: 'Hedgerows, narrow: 3 slots, each Tank here is worth 1 Armour less.' },
      pegasus: { name: 'Pegasus Bridge', text: 'Coup de main: 2 slots per side.' },
      pont_mine: { name: 'Mined Bridge' }, chaussee: { name: 'Carentan Causeway' },
      pont_vernon: { name: 'Vernon Bridge', text: 'Wide river: 4 slots, high threshold.' },
      sainte_mere: { name: 'Sainte-Mère-Église' }, caen: { name: 'Caen in Ruins' }, saint_lo: { name: 'Saint-Lô' },
      paris: { name: 'Paris – Hôtel de Ville' }, carpiquet: { name: 'Carpiquet' }, cerisy: { name: 'Cerisy Forest' },
    },
    powers: {
      naval: { name: 'Naval Support', text: 'Destroy an enemy unit worth 4 or less in total (not on a bunker).' },
      renforts: { name: 'Reinforcements', text: 'Draw 2 cards.' },
      renseignement: { name: 'Intelligence', text: 'Flip every enemy face-down card.' },
      barrage: { name: 'Barrage', text: 'Every enemy unit on a terrain loses 1 Infantry.' },
      couverture: { name: 'Air Cover', text: "Until your next turn, the opponent can't take a terrain you hold." },
    },
    battles: {
      utah: { name: 'Utah Beach', date: '6 June 1944', brief: 'The westernmost beach. The current pushed the landing craft off course, and behind the dunes the flooded marshes leave only a few causeways.' },
      omaha: { name: 'Omaha Beach', date: '6 June 1944', brief: 'D-Day. The landing craft hit the sand under fire from the strongpoints. Get a foothold on the bloodiest beach of the landings.' },
      sword: { name: 'Sword Beach', date: '6 June 1944', brief: "In the east, the British land in front of Ouistreham. Lord Lovat's commandos race to the bridges held by the paratroopers." },
      sainte_mere: { name: 'Sainte-Mère-Église', date: '6 June 1944', brief: 'The paratroopers jumped at night and landed scattered across the marshes. Hold the N13 crossroads before the counter-attack.' },
      pointe_hoc: { name: 'Pointe du Hoc', date: '6 June 1944', brief: 'The Rangers climb 100 feet of cliff under grenades to silence the guns threatening both beaches.' },
      bayeux: { name: 'Bayeux', date: '7 June 1944', brief: 'The first town liberated, almost untouched. Its roads lead south into the bocage and east to Caen: pick your direction.' },
      pegasus: { name: 'Pegasus Bridge', date: '6 June 1944', brief: 'The gliders land yards from the Bénouville bridge. Take the bridges over the Orne and the canal intact.' },
      carentan: { name: 'Carentan', date: '12 June 1944', brief: 'The link between Utah and Omaha runs through Carentan. A single causeway crosses the flooded marshes.' },
      villers_bocage: { name: 'Villers-Bocage', date: '13 June 1944', brief: 'A British armoured column enters the village… and runs into the ambush of a single Tiger. Here, tanks are the prey.' },
      epsom: { name: 'Epsom – the Odon', date: '26 June 1944', brief: 'The Scots cross the Odon in rain and mud. Hold the bridges and the woods against the SS Panzers.' },
      caen: { name: 'Caen', date: '8 July 1944', brief: 'Caen was meant to fall on day one. A month later the city is rubble and Carpiquet airfield still holds.' },
      cherbourg: { name: 'Cherbourg', date: '26 June 1944', brief: 'The Allies need a deep-water port. Fort du Roule overlooks the harbour: take it before the docks are blown.' },
      saint_lo: { name: 'Saint-Lô', date: '18 July 1944', brief: 'The advance through the bocage goes hedge by hedge. Saint-Lô, capital of ruins, opens the road south.' },
      cote_112: { name: 'Hill 112', date: '10 July 1944', brief: '"Whoever holds Hill 112 holds Normandy." A bare hill, ploughed by shells, that both sides keep taking back.' },
      goodwood: { name: 'Operation Goodwood', date: '18 July 1944', brief: 'Three armoured divisions charge into the plain south of Caen. Open ground, ideal for tanks… and for 88 mm guns.' },
      cobra: { name: 'Operation Cobra', date: '25 July 1944', brief: 'After the carpet bombing, the armour races through the crossroads. Break the front: Brittany and the Loire lie beyond.' },
      totalize: { name: 'Operation Totalize', date: '8 August 1944', brief: 'A night attack: Canadians and Poles advance in columns guided by searchlights and tracer fire.' },
      avranches: { name: 'Avranches', date: '31 July 1944', brief: "The gateway to Brittany. Everything goes over the Pontaubault bridge: Patton's army pours through the gap." },
      mortain: { name: 'Mortain', date: '7 August 1944', brief: 'Panzers counter-attack towards Avranches. A surrounded battalion holds Hill 317.' },
      falaise: { name: 'Falaise Pocket', date: '16 August 1944', brief: 'Two German armies pull back through a corridor a few miles wide. Tighten the pincers.' },
      chambois: { name: 'Chambois – Mont-Ormel', date: '20 August 1944', brief: 'The Poles hold Mont-Ormel, surrounded, against a whole army trying to break out of the pocket. Close the trap.' },
      seine: { name: 'Crossing the Seine', date: '25 August 1944', brief: 'The bridges are down. At Vernon, cross the river under fire and throw a bridge across.' },
      paris: { name: 'Liberation of Paris', date: '25 August 1944', brief: 'The Resistance has risen. The French 2nd Armoured Division enters Paris: take the Hôtel de Ville and the Seine bridges.' },
    },
  };

  // UI strings. A function takes arguments; everything else is a plain string.
  const UI = {
    fr: {
      title: 'Ligne de Front', sub: 'Normandie · été 1944', resume: w => `Reprendre — ${w}`, campaign: 'Campagne', quick: 'Bataille rapide',
      reset: 'Nouvelle campagne', confirm: 'Confirmer ?', colon: ' : ', music: 'Musique', sounds: 'Sons', yes: 'oui', no: 'non', lang: 'English',
      diff: 'Ennemi', easy: 'Recrue', normal: 'Régulier', hard: 'Vétéran',
      easyTip: 'Il hésite, éparpille ses troupes, bluffe rarement et voit tard tes menaces.',
      normalTip: 'Il joue le meilleur coup du moment.',
      hardTip: 'Agressif et opportuniste : il anticipe la suite et punit chaque ouverture.',
      menu: 'Menu', map: 'Carte', restart: 'Recommencer la bataille', pool: 'Terrains possibles (3 tirés au hasard) :',
      launch: 'Lancer la bataille', stage: n => `étape ${n}`, mapAlt: 'Carte de Normandie',
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
      victory: 'Victoire', defeat: 'Défaite', paris: 'Paris libéré', byNight: 'La nuit est tombée : départage au pourcentage de seuil rempli.', byTwo: 'Deux terrains capturés.', noMajority: "Personne n'a 2 terrains : le défenseur (l'IA) garde ses positions.",
      endScore: (a, b) => `Toi ${a} – ${b} IA`, endDone: 'La campagne de Normandie est terminée. Lance une nouvelle campagne : les renforts seront différents.',
      endWin: 'Choisis ta prochaine bataille sur la carte.', endLose: 'Pas de game over : recommence, ou choisis une autre bataille ouverte sur la carte.',
      backMap: 'Retour à la carte', again: 'Recommencer', newBattle: 'Nouvelle bataille',
      noPower: 'Aucun pouvoir.', secret: 'Carte face cachée', unknown: 'Inconnue', secretText: "Vaut 0 tant qu'elle n'est pas retournée.",
      downNote: 'Face cachée : vaut 0, pouvoir inactif.', here: t => `Ici, sur ${t} :`,
      types: { Char: 'Char', Infanterie: 'Infanterie', Air: 'Air', Soutien: 'Soutien', Ordre: 'Ordre' }, attrs: ['Char', 'Infanterie', 'Air', 'Stratégie'],
      // gallery
      gTitle: 'Ligne de Front – Atelier', gIntro: "Toutes les illustrations pixel art du prototype : cartes, terrains, carte de campagne et icônes. Taille d'origine indiquée sous chaque image, affichée en zoom entier pour garder les pixels nets.",
      gUnits: 'Unités', gOrders: 'Ordres et dos de carte', gBase: 'Terrains de base', gCamp: 'Terrains de campagne', gMap: 'Carte de campagne', gIcons: "Icônes d'attributs",
      gBack: 'Dos de carte', gVariant: b => `Variante de ${b}`, gSides: 'allié / axe', gCamps: n => `${n} × 2 camps · 64 × 40 px`, gIll: n => `${n} illustrations`,
      gMapNote: 'Projection : longitude −2,0 à 2,5, latitude 49,8 à 48,5. Les batailles sont posées dessus en HTML dans le jeu.', bunker: 'Bunker',
    },
    en: {
      title: 'Front Line', sub: 'Normandy · summer 1944', resume: w => `Resume — ${w}`, campaign: 'Campaign', quick: 'Quick battle',
      reset: 'New campaign', confirm: 'Confirm?', colon: ': ', music: 'Music', sounds: 'Sounds', yes: 'on', no: 'off', lang: 'Français',
      diff: 'Enemy', easy: 'Rookie', normal: 'Regular', hard: 'Veteran',
      easyTip: 'Hesitates, spreads out, rarely bluffs and spots your threats late.',
      normalTip: 'Plays the best move of the moment.',
      hardTip: 'Aggressive and opportunistic: thinks ahead and punishes every opening.',
      menu: 'Menu', map: 'Map', restart: 'Restart battle', pool: 'Possible terrains (3 drawn at random):',
      launch: 'Start battle', stage: n => `stage ${n}`, mapAlt: 'Map of Normandy',
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
      victory: 'Victory', defeat: 'Defeat', paris: 'Paris liberated', byNight: 'Night has fallen: decided by share of threshold filled.', byTwo: 'Two terrains captured.', noMajority: 'Nobody holds 2 terrains: the defender (the AI) keeps its ground.',
      endScore: (a, b) => `You ${a} – ${b} AI`, endDone: 'The Normandy campaign is over. Start a new campaign: the reinforcements will be different.',
      endWin: 'Pick your next battle on the map.', endLose: 'No game over: try again, or pick another open battle on the map.',
      backMap: 'Back to the map', again: 'Try again', newBattle: 'New battle',
      noPower: 'No power.', secret: 'Face-down card', unknown: 'Unknown', secretText: 'Worth 0 until it is flipped.',
      downNote: 'Face down: worth 0, power inactive.', here: t => `Here, on ${t}:`,
      types: { Char: 'Tank', Infanterie: 'Infantry', Air: 'Air', Soutien: 'Support', Ordre: 'Order' }, attrs: ['Armour', 'Infantry', 'Air', 'Strategy'],
      gTitle: 'Front Line – Workshop', gIntro: 'Every pixel-art illustration in the prototype: cards, terrains, campaign map and icons. Native size is shown under each image, displayed at integer zoom to keep pixels sharp.',
      gUnits: 'Units', gOrders: 'Orders and card back', gBase: 'Base terrains', gCamp: 'Campaign terrains', gMap: 'Campaign map', gIcons: 'Attribute icons',
      gBack: 'Card back', gVariant: b => `Variant of ${b}`, gSides: 'Allied / Axis', gCamps: n => `${n} × 2 sides · 64 × 40 px`, gIll: n => `${n} illustrations`,
      gMapNote: 'Projection: longitude −2.0 to 2.5, latitude 49.8 to 48.5. Battles are placed on top in HTML in the game.', bunker: 'Bunker',
    },
  };

  const cardName = (key, owner) => {
    const fr = E_().nameOf(key, owner), en = lang === 'en' && EN.cards[key];
    if (!en) return fr;
    return owner ? (en.axis || E_().CARDS[key].axis || en.name) : en.name;
  };
  const cardText = key => (lang === 'en' && EN.cards[key] && EN.cards[key].text) || (lang === 'en' && !E_().CARDS[key].text ? '' : E_().CARDS[key].text);
  const terrainName = key => (lang === 'en' && EN.terrains[key] && EN.terrains[key].name) || E_().TERRAINS[key].name;
  // A variant without its own English text inherits its base terrain's English trait.
  const terrainText = key => {
    if (lang !== 'en') return E_().TERRAINS[key].text;
    const T = E_().TERRAINS[key], own = EN.terrains[key] && EN.terrains[key].text;
    return own || (T.base && EN.terrains[T.base] && EN.terrains[T.base].text) || T.text;
  };
  const powerName = k => (lang === 'en' && EN.powers[k].name) || E_().POWERS[k].name;
  const powerText = k => (lang === 'en' && EN.powers[k].text) || E_().POWERS[k].text;
  const battle = b => ({ ...b, ...(lang === 'en' ? EN.battles[b.id] : {}) });
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
    EN, UI, LOG, t, cardName, cardText, terrainName, terrainText, battle, logLine, powerName, powerText,
    get lang() { return lang; }, set lang(l) { lang = l === 'en' ? 'en' : 'fr'; },
    typeName: ty => t('types')[ty] || ty, attrName: a => t('attrs')[a],
  };
})();
if (typeof module !== 'undefined') module.exports = I18N;
