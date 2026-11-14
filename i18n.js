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
    battles: {
      omaha: { name: 'Omaha Beach', date: '6 June 1944', brief: 'D-Day. The landing craft hit the sand under fire from the strongpoints. Get a foothold on the beach while the Rangers scale the cliff.' },
      sainte_mere: { name: 'Sainte-Mère-Église', date: '6 June 1944', brief: 'The paratroopers jumped at night and landed scattered across the marshes. Hold the N13 crossroads before the counter-attack.' },
      pegasus: { name: 'Pegasus Bridge', date: '6 June 1944', brief: 'The gliders land yards from the Bénouville bridge. Take the bridges over the Orne and the canal intact.' },
      carentan: { name: 'Carentan', date: '12 June 1944', brief: 'The link between Utah and Omaha runs through Carentan. A single causeway crosses the flooded marshes.' },
      caen: { name: 'Caen', date: 'July 1944', brief: 'Caen was meant to fall on day one. A month later the city is rubble, and Carpiquet airfield and Hill 112 still hold.' },
      cherbourg: { name: 'Cherbourg', date: '26 June 1944', brief: 'The Allies need a deep-water port. Fort du Roule overlooks the harbour: take it before the docks are blown.' },
      saint_lo: { name: 'Saint-Lô', date: '18 July 1944', brief: 'The advance through the bocage goes hedge by hedge. Saint-Lô, capital of ruins, opens the road south.' },
      cobra: { name: 'Operation Cobra', date: '25 July 1944', brief: 'After the carpet bombing, the armour races through the crossroads. Break the front: Brittany and the Loire lie beyond.' },
      mortain: { name: 'Mortain', date: '7 August 1944', brief: 'Panzers counter-attack towards Avranches. A surrounded battalion holds Hill 317.' },
      falaise: { name: 'Falaise Pocket', date: '19 August 1944', brief: 'Two German armies flee through a corridor a few miles wide. The Poles hold Mont-Ormel: close the pocket.' },
      seine: { name: 'Crossing the Seine', date: '25 August 1944', brief: 'The bridges are down. At Vernon, cross the river under fire and throw a bridge across.' },
      paris: { name: 'Liberation of Paris', date: '25 August 1944', brief: 'The Resistance has risen. The French 2nd Armoured Division enters Paris: take the Hôtel de Ville and the Seine bridges.' },
    },
  };

  // UI strings. A function takes arguments; everything else is a plain string.
  const UI = {
    fr: {
      title: 'Ligne de Front', sub: 'Normandie · été 1944', resume: w => `Reprendre — ${w}`, campaign: 'Campagne', quick: 'Bataille rapide',
      reset: 'Réinitialiser la progression', confirm: 'Confirmer ?', colon: ' : ', music: 'Musique', sounds: 'Sons', yes: 'oui', no: 'non', lang: 'English',
      menu: 'Menu', map: 'Carte', restart: 'Recommencer la bataille', pool: 'Terrains possibles (3 tirés au hasard) :',
      locked: 'Gagne une bataille précédente pour débloquer celle-ci.', launch: 'Lancer la bataille', replay: 'Rejouer',
      won: (n, m) => `${n} / ${m} batailles gagnées`, mapAlt: 'Carte de Normandie',
      clock: (h, n) => `Heure <b>${h}</b> / ${n} avant la nuit`, score: (a, b) => `Terrains — <b style="color:var(--me)">Toi ${a}</b> · <b style="color:var(--ai)">${b} IA</b>`,
      decks: (a, b) => `pioche IA ${a} · ta pioche ${b}`, log: 'Journal de bataille',
      cap0: '⚑ Capturé par toi', cap1: "⚑ Capturé par l'IA", hold0: '⏳ Tenu par toi', hold1: "⏳ Tenu par l'IA — riposte !", free: 'Libre',
      thr: 'Seuil à atteindre', faceDown: 'face cachée', flipTip: 'Clique pour la retourner (1 action)',
      hAi: "L'IA réfléchit…", hPick: 'Choisis une carte, ou retourne une de tes cartes face cachée : 1 action par tour.',
      hNoSlot: 'Aucun emplacement libre.', hNoTarget: 'Aucune cible légale : pose-la face cachée ou ravitaille.',
      hReplace: "Terrain plein : choisis l'unité à remplacer (elle est défaussée).", hPower: 'Choisis une cible pour le pouvoir, ou valide sans cible.', hTarget: 'Choisis une cible surlignée.',
      playOrder: "Jouer l'ordre", noTarget: 'Valider sans cible', hidden: 'Face cachée', hiddenTip: 'Bluff : vaut 0, pouvoir inactif. La retourner coûte 1 action.',
      supply: 'Ravitailler', supplyTip: 'Défausse la carte choisie, pioche 2', cancel: 'Annuler',
      victory: 'Victoire', defeat: 'Défaite', paris: 'Paris libéré', byNight: 'La nuit est tombée : départage au pourcentage de seuil rempli.', byTwo: 'Deux terrains capturés.',
      endScore: (a, b) => `Toi ${a} – ${b} IA`, endDone: 'La campagne de Normandie est terminée. Toutes les batailles restent rejouables depuis la carte.',
      endWin: 'Les batailles suivantes sont débloquées sur la carte.', endLose: 'Pas de game over : recommence, les terrains seront tirés à nouveau.',
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
      reset: 'Reset progress', confirm: 'Confirm?', colon: ': ', music: 'Music', sounds: 'Sounds', yes: 'on', no: 'off', lang: 'Français',
      menu: 'Menu', map: 'Map', restart: 'Restart battle', pool: 'Possible terrains (3 drawn at random):',
      locked: 'Win a previous battle to unlock this one.', launch: 'Start battle', replay: 'Replay',
      won: (n, m) => `${n} / ${m} battles won`, mapAlt: 'Map of Normandy',
      clock: (h, n) => `Hour <b>${h}</b> / ${n} before nightfall`, score: (a, b) => `Terrains — <b style="color:var(--me)">You ${a}</b> · <b style="color:var(--ai)">${b} AI</b>`,
      decks: (a, b) => `AI deck ${a} · your deck ${b}`, log: 'Battle log',
      cap0: '⚑ Captured by you', cap1: '⚑ Captured by the AI', hold0: '⏳ Held by you', hold1: '⏳ Held by the AI — strike back!', free: 'Open',
      thr: 'Threshold to reach', faceDown: 'face down', flipTip: 'Click to flip it (1 action)',
      hAi: 'The AI is thinking…', hPick: 'Pick a card, or flip one of your face-down cards: 1 action per turn.',
      hNoSlot: 'No free slot.', hNoTarget: 'No legal target: play it face down or resupply.',
      hReplace: 'Terrain full: pick the unit to replace (it is discarded).', hPower: 'Pick a target for the power, or confirm without one.', hTarget: 'Pick a highlighted target.',
      playOrder: 'Play order', noTarget: 'Confirm without target', hidden: 'Face down', hiddenTip: 'Bluff: worth 0, power inactive. Flipping it costs 1 action.',
      supply: 'Resupply', supplyTip: 'Discard the selected card, draw 2', cancel: 'Cancel',
      victory: 'Victory', defeat: 'Defeat', paris: 'Paris liberated', byNight: 'Night has fallen: decided by share of threshold filled.', byTwo: 'Two terrains captured.',
      endScore: (a, b) => `You ${a} – ${b} AI`, endDone: 'The Normandy campaign is over. Every battle can still be replayed from the map.',
      endWin: 'The next battles are now unlocked on the map.', endLose: 'No game over: try again, the terrains will be drawn anew.',
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
    },
  };
  const logLine = ev => typeof ev === 'string' ? ev
    : LOG[lang][ev.e](ev.p, ev.card && cardName(ev.card, ev.p), ev.t && terrainName(ev.t));

  return {
    EN, UI, LOG, t, cardName, cardText, terrainName, terrainText, battle, logLine,
    get lang() { return lang; }, set lang(l) { lang = l === 'en' ? 'en' : 'fr'; },
    typeName: ty => t('types')[ty] || ty, attrName: a => t('attrs')[a],
  };
})();
if (typeof module !== 'undefined') module.exports = I18N;
