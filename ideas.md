# Idées

## Nouvelles campagnes

Contraintes du moteur : 4 attributs, 3 terrains par bataille, 13 tours. Voir « Adding a campaign » dans le README.

### Pacifique 1942–1945 — fait : `packs/pacifique/` (Wake → Okinawa, routes Nimitz et MacArthur)
Reste possible : la guerre en Birmanie, ou une campagne côté japonais (Pearl Harbor, Malaisie, Singapour).
- **Attributs** : Marine, Infanterie, Air, Logistique.
- **Batailles** : Midway, Guadalcanal, Tarawa, Saipan, Leyte, Iwo Jima, Okinawa.
- **Terrains** : atoll, jungle, piste d'aviation, récif (débarquement lent), grotte (immunité), porte-avions.
- **Mécaniques** : porte-avions qui donne +Air sur les autres terrains, kamikaze (se détruit pour détruire), jungle avec brouillard.
- **Sons** : moteur naval à ajouter dans `audio.js`.

### Première Guerre mondiale : les tranchées — fait : `packs/verdun/` (Verdun 1916)
Reste possible : une autre campagne 1914–1918 dans la même époque (la Marne, la Somme, Cambrai et les premiers chars), le sifflet et la sape sont déjà là.
- **Attributs** : Artillerie, Infanterie, Génie, Moral.
- **Batailles** : la Marne, Ypres, Verdun, la Somme, le Chemin des Dames, Cambrai (premiers chars), offensive des Cent-Jours.
- **Terrains** : tranchée (immunité), no man's land (moins d'emplacements), cratère, fort, barbelés (bloque les mouvements).
- **Mécaniques** : barrage roulant, gaz (malus sur tout un terrain), sape et mine, relève des troupes, guerre d'usure lente.
- **Sons** : sifflet de l'assaut.

### Guerre des Gaules — fait : `packs/gaule/` (Bibracte → Uxellodunum, routes de l'Océan et du Rhin, art en double résolution)
Reste possible : la campagne côté gaulois (Vercingétorix en 52), ou repasser les autres packs en double résolution.
- **Base** : le pack test `packs/test/pack.js` (Cavalerie, Infanterie, Tir, Stratégie).
- **Batailles** : Bibracte, la Sambre, Gergovie, Avaricum, Alésia, Uxellodunum.
- **Côtés** : jouer Rome ou Vercingétorix ? Deux decks possibles.
- **Mécaniques déjà prototypées** : charge, testudo, gué, camp.
- **Art et sons** : art à faire (le pack test emprunte les images de la Normandie), sabots de chevaux à ajouter.

### Shogun : l'époque Sengoku
- **Attributs** : Cavalerie, Ashigaru, Arquebuses, Honneur.
- **Batailles** : Okehazama, Anegawa, Nagashino, Yamazaki, Shizugatake, Sekigahara.
- **Terrains** : rizière (ralentit la cavalerie), château, col de montagne, temple, rivière.
- **Mécaniques** :
  - ninja (révèle ou sabote une carte face cachée) ;
  - trahison de clan (une carte change de camp, comme Kobayakawa à Sekigahara) ;
  - volée d'arquebuses (Nagashino) ;
  - duel de samouraïs.
- **Sons** : taiko.
