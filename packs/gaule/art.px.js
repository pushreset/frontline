// Gallic Wars 58–51 BC — card (128x80) and terrain (320x144) illustrations, twice the resolution of the other packs.
// Build (writes packs/gaule/out/): node ~/.claude/skills/pxl-pixel-art/bin/pxl.js build packs/gaule/art.px.js --no-preview
//
// Style rules (keep them when adding a picture):
// - One light, from the top left. Volumes get `light`/`shade` on the lit and the far side, cast shadows fall right.
// - Hue-shifted ramps: shadows go cool (violet, blue), lights go warm (ochre, cream). 4-5 tones per material.
// - Outlines are warm near-black `k`, only around figures; inside, materials meet without lines.
// - Three depths per landscape: hazy far (bluish, light), the subject in the middle, a dark foreground edge.
// - No filler speckle: every mark has a cause (stone courses, planks, thatch, mail rings, wheel ruts).
// - Fire glows (keys K L D only). Figures face right for Rome, left for the Gauls (they come at you).
pal({
  k: "#1a1210",                                                                     // outline
  1: "#4d6a96", 2: "#6f8fb6", 3: "#9db5cd", 4: "#c8d3d4", 5: "#efe9d6", 6: "#8c9b98", // sky top -> haze, cloud, far hills
  "+": "#5e7da7", "=": "#86a2c2", "~": "#b3c5d2",                                   // sky in-betweens (smooth gradients)
  "^": "#698034",                                                                   // grass in-between
  "%": "#6d817d", "&": "#56695f",                                                   // far woods in the haze (lit, shade)
  7: "#b8664e", 8: "#e3a671", 9: "#f3d9a0",                                         // dusk
  i: "#353a46", I: "#5b6370", j: "#8e97a0", J: "#c9cfd0",                           // iron, mail
  b: "#4f3018", B: "#865a26", n: "#c28f3e", N: "#efcd76",                           // bronze, brass, gold
  r: "#41131a", R: "#78202a", s: "#ad3a2f", S: "#d96a4c",                           // Roman red
  g: "#232f20", G: "#3c5131", h: "#61783f", H: "#93a65b",                           // green wool
  u: "#1f2944", U: "#344a7a", v: "#5876a6", V: "#8ea9cb",                           // blue wool, woad
  o: "#553a17", O: "#8a6326", y: "#c39a3c", Y: "#e8cb6c",                           // ochre wool, thatch, blond
  e: "#462820", E: "#7b4733", f: "#b5765a", F: "#e2ac8a",                           // skin
  w: "#2b1b12", W: "#553622", x: "#855838", X: "#b38552",                           // wood, leather
  a: "#1e2c19", A: "#33461f", c: "#53682b", C: "#7f8e3b", d: "#aeac5c",             // grass, leaves
  t: "#3b2a1d", T: "#684a31", q: "#957049", Q: "#c3a06c",                           // earth, roads
  0: "#45403b", M: "#6e675d", m: "#9b917f", l: "#cbc1a7",                           // limestone
  z: "#1b2a37", Z: "#2e4b5c", p: "#4f7985", P: "#89aeb0",                           // water
  D: "#c9501f", L: "#f0a43a", K: "#fbeeb0",                                         // fire
})
ramps("1+2=3~45", "kaAc^Cd", "kiIjJ", "kbBnN", "krRsS", "kgGhH", "kuUvV", "koOyY", "keEfF", "kwWxX", "kaAcCd", "ktTqQ", "k0Mml", "kzZpP", "12345", "&%6345", "789", "DLK")

const CW = 128, CH = 80, TW = 320, TH = 144

// ------------------------------------------------------------------ figures (about 36 px tall)
// Legionary, facing right: Montefortino helmet with a short plume, mail shirt, the curved scutum held in front
// (red, bronze rim and boss, golden wings and thunderbolt), gladius on the right hip, caligae. The pilum is drawn
// by the scene (its angle changes with the pose).
sprite("_legio", { outline: "k" }, `
  .........rR.........
  ........rRsR........
  ........BnNB........
  .......BnNNnB.......
  ......bBnnnnBb......
  ......b.EfFFn.......
  ........fFkFF.......
  ........nfFFFF......
  ........nffFe.......
  .........EffE.......
  ......IjIIEfjIj.....
  .....IjrrrrrrrrrjI..
  ....IjjrSSsssRRrJjI.
  ....IjIrSSssYRRrjIjf
  ....jIIrSSsYsRRrIjff
  .....IjrSyssYyRrjIf.
  .....ijrSSyYyRRrIj..
  .....ijrSSnNnRRrjI..
  .....ijrSnNNNnRrnN..
  ......irSSnNnRRrnB..
  ......rrSSyYyRRrsR..
  ......srSysYsyRrsR..
  ......srSSsYsRRrRW..
  ......RrSSssYRRrsW..
  .......rSSsssRRrfW..
  .......rsssssRRrfx..
  .......rrrrrrrrrE...
  .......fF...fFfE....
  .......fF...ffE.....
  .......fF...ffE.....
  .......fFE..ffE.....
  .......fFE..ffE.....
  .......ffE..ffE.....
  .......xWE..xWE.....
  ......xxWW.xxWW.....
  ......WWWW.WWWW.....`)

// Gallic oval shield: painted wood, a vertical spina and a bronze boss, light from the left (front = right).
const gshield = (name, body, lit, dark, paint) => sprite(name, { w: 9, h: 19 }, (c) => {
  c.ellipse(4, 9, 4, 9, body)
  c.light((x, y) => (x - 2.5) * (x - 2.5) / 5 + (y - 6) * (y - 6) / 26 < 1)
  c.shade((x, y) => x >= 6)
  c.ellipse(4, 9, 4, 9, "B", true)
  c.vline(4, 2, 15, "n"); c.rect(3, 7, 3, 5, "n"); c.px(3, 8, "N"); c.px(3, 9, "N"); c.rect(5, 8, 1, 3, "B")
  for (const [x, y] of [[2, 4], [2, 3], [6, 15], [6, 14], [2, 14], [2, 15], [6, 4], [6, 3]]) c.px(x, y, paint)
})
gshield("_gshield", "h", "H", "G", "Y")
gshield("_gshield_b", "v", "V", "U", "S")
gshield("_gshield_o", "y", "Y", "O", "R")
// Carnyx: the bronze war horn, held upright, ending in a boar's head with an open jaw.
sprite("_carnyx", { outline: "k" }, `
  ..nNNn..
  .nNnnBn.
  nNkBnnBB
  nB..BnB.
  ....BnB.
  ....nB..
  ....nB..
  ....nB..
  ....nB..
  ....nB..
  ....nB..
  ....nB..
  ....nB..
  ...fnBf.
  ...ffff.
  ....nB..
  ....nB..
  ....nB..`)
// Gallic warrior charging, drawn facing right (flip it to face left): limed spiky hair, drooping moustache, gold
// torque, sword swung up behind the head, checked braccae, a sagum flying behind, oval shield in front.
sprite("_gaul", { outline: "k" }, `
  ..J.......................
  ..Jj......................
  ...Jj.....................
  ....Jj....................
  .....Jj......Y..Y.........
  ......Jj....YYYYYY.Y......
  .......Jj..YYyYYYYYY......
  ........nNnyYyYYYYY.......
  .......fnBn.yyFFFFY.......
  .......ff....fFFkFF.......
  ........ff...fFFFFFF......
  .........ff..fyyyyF.......
  ..........ff..fyyfE.......
  ...........ff.EffE........
  ...........fffNnNNn.......
  ........UUUhhHHHhhh.......
  .......UvvUhHHHhhGhh......
  ......UvvUuhHHhhhhhhGhf...
  .....UvvUUuhHhhhhhhGfF....
  .....UvUUuuhhhhhhhGGff....
  ....UvUUuuuhhhhhhGGg......
  ....UvUUuu.hhhhhGGg.......
  ...UvUUuu..WWnWWWWW.......
  ...UUUuu...hhhhhhGg.......
  ...UUuu....hhhhhGGg.......
  ...Uu......OqOqOqOqO......
  .........qOqOqOqOqO.......
  .........OqOqO.qOqOq......
  .........qOqO...OqOqO.....
  ........OqOq.....qOqOq....
  .......qOqO.......OqOq....
  .......OqO.........qOqO...
  ......qOq...........OqO...
  ......OqO...........fFf...
  .....fff............fff...
  ....ffE.............EfE...
  ...WWWW.............WWWW..
  ..WWxWW.............WxWWW.`,
  stamp("_gshield", 14, 15))

// Horse at the flying gallop, facing right, built from volumes then shaded: barrel, rump and chest, arched
// neck, long head, legs thrown forward and back, mane and tail streaming. coat = [shadow, body, light], hair = mane.
const horse = (name, coat = "Wxx", hair = "w", sock = null) => sprite(name, { w: 50, h: 32, outline: "k" }, (c) => {
  const [D, B, L] = coat
  // legs first (behind the body): far legs one step darker
  c.line(13, 18, 6, 24, D, 2); c.line(6, 24, 1, 27, D, 2)                 // far hind, kicked back
  c.line(34, 18, 39, 23, D, 2); c.line(39, 23, 38, 28, D, 2)              // far fore, folded
  c.line(10, 18, 13, 25, B, 3); c.line(13, 25, 9, 29, B, 2)               // near hind, under the body
  c.line(32, 18, 40, 20, B, 3); c.line(40, 20, 47, 23, B, 2)              // near fore, reaching
  for (const [x, y] of [[0, 27], [8, 29], [37, 28], [47, 23]]) { c.rect(x, y, 2, 2, "w") }
  if (sock) for (const [x, y] of [[9, 27], [45, 22]]) c.rect(x, y, 2, 2, sock)
  // body
  c.ellipse(22, 14, 13, 6, B); c.circ(11, 13, 6, B); c.circ(32, 14, 5, B)
  c.poly([28, 12, 34, 3, 40, 1, 41, 10, 36, 17], B)                       // neck, arched
  // modelling, light from the top left: rounded highlights on each mass, shade underneath and on the far edges
  const inE = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1
  c.shade((x, y) => c.is(x, y, B) && !inE(x, y, 21, 12, 13, 5.5) && !inE(x, y, 10.5, 11.5, 5.5, 5.5) && !inE(x, y, 32, 12.5, 4.5, 4.5) && y > 9, 1)
  c.light((x, y) => c.is(x, y, B) && (inE(x, y, 19, 10.5, 9, 2.5) || inE(x, y, 9.5, 10, 3.5, 3) || inE(x, y, 31, 11, 2.5, 2.5) || inE(x, y, 36, 5, 2.5, 3.5) || inE(x, y, 42, 3.5, 2, 1.5)), 1)
  // shoulder and hip muscle lines
  for (const [x, y] of [[29, 9], [28, 10], [28, 11], [28, 12], [29, 13], [29, 14]]) c.px(x, y, D)
  for (const [x, y] of [[15, 10], [16, 11], [16, 12], [15, 13], [14, 14]]) c.px(x, y, D)
  // the head, drawn by hand: ears, flat forehead sloping to the muzzle, round cheek, soft nose
  const head = `
    ..BB.........
    ..BLB........
    .BLLBB.......
    .BLLLBB......
    BBLLBBBB.....
    BBBkLBBBB....
    BBLBBBBBBB...
    BBBBBBBBBBB..
    DBBBBBDBBBBB.
    .DBBBD.DBBBDB
    ..DDD...DBDD.
    .........DD..`.split("\n").filter((r) => r.trim()).map((r) => r.trim())
  head.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== ".") c.px(37 + x, y, { B, L, D, k: "k" }[ch]) }))
  // mane and tail streaming back
  c.line(34, 5, 38, 1, hair, 2); c.line(31, 8, 35, 4, hair, 2); c.px(30, 10, hair); c.px(39, 1, hair)
  c.line(5, 10, 1, 13, hair, 2); c.line(1, 13, 0, 19, hair, 2); c.px(2, 11, hair)
  // harness: a leather breast strap and the saddle cloth
  c.line(31, 10, 34, 17, "W"); c.rect(17, 8, 10, 6, "R"); c.hline(17, 13, 10, "n"); c.hline(17, 8, 10, "s")
})
// Rider, seated, facing right: leaning into the gallop, spear couched forward, round shield on the near arm.
// Hair keys y/Y (a Suebian knot); the Gallic version swaps in a bronze helmet.
sprite("_rider", { outline: "k" }, `
  ......YY.......
  .....yYYy......
  ....yYYYYy.....
  ....yFFFFy.....
  ....fFkFFF.....
  ....ffFFFFF....
  .....yyfFE.....
  ......fEf......
  ....GhhHHhh....
  ...GhhHHHhhh...
  ...GhhhHhhhhff.
  ...GGhhhhhhhfF.
  ....GhhhhhhG...
  ....WWnWWWWW...
  ....OqOqOqOqO..
  .....OqOqOqOqO.
  .........qOqO..
  .........OqOq..
  .........qOqO..
  .........OqO...
  .........qOq...
  .........fff...
  .........fWWW..
  .........WWWWW.`)
sprite("_rider_g", { base: "_rider" },
  grid(5, 0, "BnNB"), grid(4, 1, "BnNNnB"), grid(4, 2, "bBnnnBb"), grid(4, 3, "nFFFFn"))
// The round shield, seen from the near side: a disc with a boss.
sprite("_rshield", { w: 9, h: 9, outline: "k" }, (c) => {
  c.circ(4, 4, 4, "v"); c.light([3, 3, 2.5]); c.shade((x, y) => x + y > 10); c.ring(4, 4, 4, "U")
  c.px(4, 4, "n"); c.px(3, 3, "N")
})
horse("_horse", "Wxx", "w")
horse("_horse_grey", "MmJ", "M", null)
horse("_horse_dun", "TqQ", "t")

// Archer drawing his bow, facing right: bow arm out in front, the string hand at the cheek, quiver on the back.
// Cretan auxiliary: dark hair, undyed tunic. The bow and arrow are drawn by bowman().
sprite("_archer", { outline: "k" }, `
  ........WWW.........
  .......WWWWW........
  .......WWFFFF.......
  .......WfFkFF.......
  ........ffFFFF......
  ........fffFE.......
  ...x.....EffEf......
  ..xXx.QQQQQqfffffff.
  ..xXxQQQQQQqqFFFFFf.
  ..xXQQQQQQqqq.......
  ...xQQQQQqqqq.......
  ...xQQQQqqqqq.......
  ....QQQQqqqqq.......
  ....QQQqqqqqq.......
  ....WWnWWWWWW.......
  ....QQQqqqqqq.......
  ....QQQqqqqqqq......
  ...QQQqqqqqqqq......
  ...QQQq...qqqq......
  ...fFf.....fff......
  ...fFf.....ffE......
  ..ffFE......fE......
  ..fFE.......ffE.....
  .ffE........ffE.....
  .fFE.........fE.....
  .fFE.........ffE....
  .xWE.........xWE....
  xxWW.........xxWW...
  WWWW.........WWWWW..`)
// bow and nocked arrow for an archer stamped at (x, y)
const bowman = (x, y, flip = false) => (c) => {
  const X = (dx) => flip ? x + 21 - dx : x + dx
  for (let j = -6; j <= 14; j++) { const bend = Math.round(2.4 - Math.abs(j - 4) * Math.abs(j - 4) / 40); c.px(X(19 + bend), y + 3 + j, "w") }
  c.line(X(19), y - 3, X(12), y + 9, "Q"); c.line(X(12), y + 9, X(19), y + 21, "Q")   // string drawn back
  c.line(X(10), y + 8, X(25), y + 8, "x"); c.px(X(26), y + 8, "J"); c.px(X(10), y + 7, "s"); c.px(X(10), y + 9, "s")
}
// Slinger, facing right, whirling the sling overhead: a pouch of stones at the hip.
sprite("_slinger", { outline: "k" }, `
  ..........f.........
  .........ff.........
  ........ff..........
  .......ff...........
  .......f.WWW........
  ......ff.WWWW.......
  ......f.WWFFFF......
  ......f.WfFkFF......
  ......ff.ffFFFF.....
  .......ff.fffE......
  ........fffffE......
  .........QQQQqq.....
  ........QQQQQqqf....
  ........QQQQqqqFf...
  ........QQQQqqq.ff..
  ........QQQqqqq..ff.
  ........WWnWWWW...f.
  .......XQQQqqqq.....
  .......xxQqqqqqq....
  ......xxxQq..qqq....
  .......x.fF...fff...
  .........fF...ffE...
  ........ffF....fE...
  ........fFE....ffE..
  .......ffE......fE..
  .......fFE......ffE.
  .......xWE......xWE.
  ......xxWW......xxWW
  ......WWWW......WWWW`)
// Centurion: the legionary with a transverse crest, silver phalerae on the chest and greaves.
sprite("_centurio", { base: "_legio" },
  grid(5, 0, "kRRsSSsRRk"), grid(6, 1, "RRsssRR"), grid(7, 2, "rRRRr"))
// Gallic war chief: the warrior with a crested bronze helmet, a gold-trimmed red cloak.
sprite("_chief", { base: "_gaul", swap: { U: "R", v: "s", u: "r" } },
  grid(13, 5, ".BnNNNnB."), grid(12, 6, "bBnNNnnnBb"), grid(12, 7, "bbBBBBBBBb"), grid(15, 3, "SS"), grid(15, 4, "sSs"))
// Fabri: an engineer swinging a dolabra (pickaxe-axe), tunic only, the shield left on the ground.
sprite("_faber", { outline: "k" }, `
  .....jJ.............
  ....jJJ.............
  ....ijx.............
  ......x.............
  ......x..WWW........
  .......x.WWWW.......
  .......xWWFFFF......
  .......ffFFkFF......
  .......fffFFFFF.....
  ........fffFE.......
  .........ffEE.......
  .........RRssRf.....
  ........RRsssSRff...
  ........RRssssRRff..
  .........RssssRR.fF.
  .........RsssssRR...
  .........WWnWWWWW...
  .........RssssRRR...
  ........RRssss.RRR..
  ........RRs.....RR..
  ........fF.......fF.
  ........fF.......fF.
  .......ffE.......ffE
  .......fFE.......ffE
  .......fFE........fE
  .......xWE........xW
  ......xxWW.......xxW
  ......WWWW.......WWW`)
// Druid: long white robe, a hood thrown back, white beard, an oak staff and the golden sickle.
sprite("_druid", { outline: "k" }, `
  ........x.............
  ........x..lll........
  ........x.llll5.......
  ........xlllFFF.......
  ........xllFkFF.......
  ........x.lFFFFF......
  ........x.555555......
  ........x..5555.......
  ........x.55555.......
  .......f5555555555....
  .......f555l5555l55...
  ........x55l5555l55N..
  ........x5ll5555l5NN..
  ........x5l55555l5N...
  ........x5l5555ll5....
  ........xll5555ll5....
  ........xl55555ll5....
  ........xl5555lll5....
  ........l55555ll55....
  .......ll5555lll55....
  .......l55555lll555...
  .......l5555llll555...
  ......ll5555llll5555..
  ......l55555llll5555..
  ......l5555lllll5555..
  .....ll5555lllll55555.
  .....lllllllllllllll..
  ......WWW.....WWW.....`)

// Standards. Eagle: gilded aquila with spread wings on a pole with phalerae. Boar: the Gallic war boar.
// Vexillum: a red square flag with gold fringe. All drawn with the pole foot at (x, y).
const aquila = (x, y, h = 30) => (c) => {
  c.vline(x, y - h, h, "x"); c.vline(x + 1, y - h, h, "W")
  for (let k = 0; k < 3; k++) { c.circ(x, y - h + 10 + k * 5, 1, "n"); c.px(x, y - h + 9 + k * 5, "N") }
  c.rect(x - 3, y - h + 4, 8, 2, "B"); c.hline(x - 3, y - h + 4, 8, "n")
  for (const [dx, dy, k] of [[-6, -1, "n"], [-5, -2, "N"], [-4, -3, "N"], [-3, -2, "n"], [-2, -1, "n"], [3, -1, "n"], [4, -2, "N"], [5, -3, "N"], [6, -2, "n"], [7, -1, "B"], [0, -2, "N"], [1, -2, "n"], [0, -1, "n"], [1, -1, "B"], [1, -3, "N"], [2, -3, "B"], [0, 0, "B"], [1, 0, "B"], [-1, 0, "n"]]) c.px(x + dx, y - h + 3 + dy, k)
  c.px(x - 6, y - h + 3, "N"); c.px(x + 7, y - h + 3, "n"); c.px(x - 7, y - h + 2, "N"); c.px(x + 8, y - h + 2, "B")
}
const boarStd = (x, y, h = 30) => (c) => {
  c.vline(x, y - h, h, "x"); c.vline(x + 1, y - h, h, "W")
  const b = `
    ...B.B.B.B....
    ..BnnnnnnnnB..
    .BnNNNNNnnnnB.
    BkNnnnnnnnnnnB
    NnnnnnnnnnnnB.
    .BnnnnnnnnBB..
    ..B.B...B.B...
    ..B.B...B.B...`.split("\n").filter((r) => r.trim()).map((r) => r.trim())
  b.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== ".") c.px(x - 6 + i, y - h - 9 + j, ch) }))
}
const vexillum = (x, y, h = 30, mark = null) => (c) => {
  c.vline(x, y - h, h, "x"); c.vline(x + 1, y - h, h, "W"); c.hline(x - 5, y - h + 2, 12, "x")
  c.rect(x - 5, y - h + 3, 12, 11, "s"); c.rect(x - 5, y - h + 3, 3, 11, "S"); c.rect(x + 4, y - h + 3, 3, 11, "R")
  for (let i = 0; i < 12; i += 2) c.px(x - 5 + i, y - h + 14, "N")
  if (mark) c.text(x - 3 - (mark.length > 1 ? 2 : 0), y - h + 6, mark, "N")
}
// Scorpion: a bolt-thrower on a tripod, torsion springs in a bronze-plated frame, a bolt ready.
sprite("_scorpio", { outline: "k" }, `
  ...........JJ.........
  .JjjjjjjjjjjjjJ.......
  ...xxxxxXXXXxx........
  .BnBxXXXXXXXXXxBnB....
  .BnB.WWWWWWWWW.BnB....
  .BnBxxxxxxxxxxxBnB....
  .bBb.....xX....bBb....
  .........xX...........
  ........xXXX..........
  .......xx.x.xx........
  ......xx..x..xx.......
  .....xx...x...xx......
  ....xx....x....xx.....
  ...WW.....W.....WW....`)
// Ox-drawn cart heavy with grain sacks, and the ox.
sprite("_cart", { outline: "k" }, `
  ....QQQqQQQqQQQq........
  ...QQQqqQQqqQQqqq.......
  ...QqqQQqqQQqqQQq.......
  ..XXXXXXXXXXXXXXXXX.....
  ..xxxxxxxxxxxxxxxxxxxxx.
  ..WWWWWWWWWWWWWWWWW.....
  ....xXXx......xXXx......
  ...xWxxWx....xWxxWx.....
  ...XxwwxX....XxwwxX.....
  ...xWxxWx....xWxxWx.....
  ....xXXx......xXXx......`)
sprite("_ox", { outline: "k" }, `
  ...................Q....
  ..................QlQ...
  ..qqqqqqqqqqqqqq..qq....
  .qqQQQQQQqqqqqqqqqQq....
  qqQQQQQqqqqqqqqqqqqqqq..
  qqQQqqqqqqqqqqqqqqqkqqq.
  .qqqqqqqqqqqqqqqqqqqqTTq
  .TqqqqqqqqqqqqqqqqTTq...
  ..TTqqqqqqqqqqqqTTT.....
  ..Tq.Tq......Tq.Tq......
  ..Tq.Tq......Tq.Tq......
  ..tt.tt......tt.tt......`)
// Granary on stilts (against mice and damp), thatched.
sprite("_granary", { outline: "k" }, `
  .......oo.......
  .....oYYyO......
  ...oYYYyyyOO....
  .oYYYYyyyyyOOo..
  oYYYyyyyyyyyOOo.
  .XXXXxxxxxxxWW..
  .XxXxxwwxxxxWW..
  .XxXxxwwxxxxWW..
  .XXXXxxxxxxxWW..
  .W..W.....W..W..
  .W..W.....W..W..`)
// British war chariot: wicker body, two wheels... seen from the side, pulled by a pony.
sprite("_chariot", { outline: "k" }, `
  ..XxXxXxXxXx..........
  ..xXxXxXxXxX..........
  ..XxXxXxXxXxxxxxxxxxxx
  ..xXxXxXxXxX..........
  ...WWWWWWWWW..........
  .....xXXXXx...........
  ....xW..x.Wx..........
  ...xW...x..Wx.........
  ...X.x..x.x.X.........
  ...XxxxxxxxxX.........
  ...X.x..x.x.X.........
  ...xW...x..Wx.........
  ....xW..x.Wx..........
  .....xXXXXx...........`)
// Siege tower: timber storeys covered in wet hides, a drawbridge at the top.
sprite("_tower", { outline: "k" }, `
  ...xxxxxxxxx...
  ...XEEEEEEEx...
  ...XEeeeeeEx...
  ...XEEEEEEEx...
  ..xxxxxxxxxxx..
  ..XEEEEEEEEEx..
  ..XEeeeEEeeEx..
  ..XEEEEEEEEEx..
  ..xxxxxxxxxxx..
  .XEEEEEEEEEEEx.
  .XEeeEEEEEeeEx.
  .XEEEEEEEEEEEx.
  .xxxxxxxxxxxxx.
  XEEEEEEEEEEEEEx
  XEEEEwwwwEEEEEx
  XEEEEwwwwEEEEEx
  xxxxxxxxxxxxxxx
  .xXx.......xXx.
  xWxWx.....xWxWx
  .xXx.......xXx.`)

// Depth: the same figure further back, one step darker and cooler (aerial perspective).
const BACK = { S: "s", s: "R", R: "r", N: "n", n: "B", B: "b", Y: "y", y: "O", F: "f", f: "E", E: "e", J: "j", j: "I", I: "i", X: "x", x: "W", W: "w",
               H: "h", h: "G", G: "g", V: "v", v: "U", U: "u", Q: "q", q: "T", T: "t" }

// ------------------------------------------------------------------ landscape helpers
// Smooth ordered-dither gradient (Bayer 8x8): each band fades into the next over its whole height,
// no hard checkerboard stripes. keys run top -> bottom.
const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21]
// sharp: how much of each band stays flat (0 = dithered all the way, 3 = flat with a third of a band to blend).
const vgrad = (x, y, w, h, keys, ease = 1, sharp = 3) => (c) => {
  const n = keys.length - 1
  for (let j = 0; j < h; j++) {
    const t = Math.pow(j / Math.max(1, h - 1), ease) * n, i = Math.min(n - 1, Math.floor(t)), f = Math.min(1, Math.max(0, (t - i - 0.5) * sharp + 0.5))
    for (let k = 0; k < w; k++) c.px(x + k, y + j, f * 64 > BAYER[((y + j) & 7) * 8 + ((x + k) & 7)] + 0.5 ? keys[i + 1] : keys[i])
  }
}
const sky = (w, h, keys = "1+2=3~4", ease = 1.2) => vgrad(0, 0, w, h, keys, ease, 2)
sprite("_cloud_a", `
  ..............555.............
  ........5555.55555............
  ......555555555555555..5555...
  .....5555555555555555555555...
  ..5555555555555555555555555555
  .55555555555555555555555554444
  5555555555555555555444444444443
  .4444444444455544444443333333.
  ...333333333344433333.........`)
sprite("_cloud_b", `
  .......555......
  ....555555555...
  ..55555555555544
  555555555554444.
  .44444443333....`)
sprite("_cloud_far", `
  ....44444.....
  ..44444444444.
  44444443333333`)
// Rolling hills: a silhouette from a few sine waves, filled down to `to`.
const hills = (y, amp, key, seed = 0, to = 200, w = 400) => (c) => {
  for (let x = 0; x < w; x++) {
    const h = Math.round(y - amp * (0.6 * Math.sin((x + seed * 37) / 23) + 0.4 * Math.sin((x + seed * 11) / 9.5)))
    c.vline(x, h, to - h, key)
  }
}
// Tree line: rounded crowns side by side, lit on the left. Keys: crown, shadow side.
const treeline = (y, amp, lit, dark, seed = 1, w = 400, to = 200) => (c) => {
  const r = c.rng(seed)
  for (let x = -4; x < w; x += 2 + Math.floor(r() * 3)) {
    const rad = 3 + Math.floor(r() * amp), cy = y - Math.floor(r() * amp)
    c.circ(x, cy, rad, dark); if (rad > 1) c.circ(x - 1, cy - 1, rad - 1, lit)
    c.rect(x - rad, cy + 1, 2 * rad + 1, to - cy, dark)
  }
}
// Grass: tufts painted only on the ground colour (no speckle: each mark is a blade of grass).
sprite("_tuft_a", ".c.\ncAc")
sprite("_tuft_b", "..C.\n.cC.\nccAc")
sprite("_tuft_c", "d.C\ncCc")
group("_tuft", ["_tuft_a", "_tuft_a", "_tuft_b", "_tuft_c"])
const meadow = (y, w, h, seed = 1, n = 40) => [
  vgrad(0, y, w, h, "dC^cAa", 0.9, 2),
  scatter("_tuft", 0, y + 2, w, h - 2, n, { seed, on: "Cca" }),
]
// A pilum held by the figure stamped at (x, y): wooden shaft, long iron shank, small pyramidal head.
const pilum = (x, y, dx = 7, len = 34) => (c) => {
  const x0 = x + 19, y0 = y + 19, x1 = x0 + dx, y1 = y0 - len, xm = x0 + Math.round(dx * 0.55), ym = y0 - Math.round(len * 0.55)
  c.line(x0, y0, xm, ym, "x"); c.line(x0 + 1, y0, xm + 1, ym, "W")
  c.line(xm, ym, x1, y1, "j"); c.px(xm, ym, "n"); c.px(x1, y1 - 1, "J"); c.px(x1, y1, "J")
}
// Cast shadow on the ground, falling right (light from the top left).
const shadowAt = (x, y, w = 16) => poly([x, y, x + w, y, x + w + 6, y + 2, x + 2, y + 2], "k")

// ------------------------------------------------------------------ cards (128x80)
function unit(name, build) {
  scene("c_" + name, { w: CW, h: CH }, ...build(false))
  scene("c_" + name + "_x", { w: CW, h: CH }, ...build(true))
}
unit("legionnaire", (gaul) => gaul ? [
  sky(CW, 54), stamp("_cloud_b", 12, 10), stamp("_cloud_a", 80, 4),
  hills(40, 4, "3", 3, 60), treeline(48, 3, "%", "&", 4), hills(52, 1, "c", 1, 60),
  ...meadow(53, CW, 27, 5, 70),
  stamp("_carnyx", 44, 26), stamp("_carnyx", 100, 24),
  layer("shadow", { shade: true }, shadowAt(18, 77, 18), shadowAt(48, 79, 18), shadowAt(78, 77, 18)),
  stamp("_gaul", 88, 32, { flip: "x", swap: { ...BACK, O: "U", q: "v" } }), stamp("_gaul", 12, 33, { flip: "x", swap: { ...BACK, h: "s", H: "S", G: "R", O: "G", q: "h" } }),
  stamp("_gaul", 26, 38, { flip: "x", swap: { h: "v", H: "V", G: "U", O: "R", q: "s", Y: "X", y: "x" } }),
  stamp("_gaul", 52, 40, { flip: "x" }),
  stamp("_gaul", 80, 38, { flip: "x", swap: { h: "q", H: "Q", G: "T", O: "G", q: "h", Y: "S", y: "s" } }),
] : [
  sky(CW, 54), stamp("_cloud_far", 60, 30), stamp("_cloud_a", 6, 6), stamp("_cloud_b", 90, 16),
  hills(42, 3, "3", 7, 60), hills(46, 3, "6", 2, 60), hills(51, 2, "c", 5, 60),
  ...meadow(53, CW, 27, 3, 70),
  // the cohort behind: a wall of shields under slanted pila, in the haze
  (c) => { for (let x = 2; x < 126; x += 4) { c.rect(x, 47, 3, 5, x % 8 ? "R" : "r"); c.px(x + 1, 48, "B"); c.line(x + 2, 46, x + 4, 40, "6") } },
  layer("shadow", { shade: true }, shadowAt(38, 73, 14), shadowAt(60, 74, 14), shadowAt(82, 73, 14), shadowAt(36, 78), shadowAt(58, 79), shadowAt(80, 78)),
  // second rank, half hidden, one step darker
  stamp("_legio", 36, 34, { swap: BACK }), pilum(36, 34, 7, 30), stamp("_legio", 58, 35, { swap: BACK }), pilum(58, 35, 7, 30),
  stamp("_legio", 80, 34, { swap: BACK }), pilum(80, 34, 7, 30),
  stamp("_legio", 32, 42), pilum(32, 42, 8, 32),
  stamp("_legio", 54, 43), pilum(54, 43, 6, 33),
  stamp("_legio", 76, 42), pilum(76, 42, 8, 32),
])

// A horseman: horse, rider, spear and shield. gaul: helmeted Gaul with a green shield.
const horseman = (x, y, gaul = false, h = "_horse", swap = {}) => [
  stamp(h, x, y, { swap }),
  stamp(gaul ? "_rider_g" : "_rider", x + 14, y - 8, { swap }),
  (c) => { c.line(x + 27, y + 3, x + 58, y - 7, "x"); c.line(x + 56, y - 6, x + 60, y - 8, "J"); c.px(x + 61, y - 8, "J") },
  stamp("_rshield", x + 11, y - 1, { swap: gaul ? { v: "h", V: "H", U: "G", ...swap } : swap }),
]
sprite("_cav_rome", { w: 64, h: 44 }, ...horseman(0, 12))
sprite("_cav_germ", { w: 64, h: 44 }, ...horseman(0, 12, false, "_horse_grey", { h: "c", H: "C", G: "A" }))
sprite("_cav_gaul", { w: 64, h: 44 }, ...horseman(0, 12, true, "_horse_dun"))
sprite("_cav_gaul2", { w: 64, h: 44 }, ...horseman(0, 12, true, "_horse", { h: "v", H: "V", G: "U", O: "R", q: "s" }))

// Dust kicked up behind a galloping horse: soft puffs, lit on top.
const dust = (pts) => (c) => { for (const [x, y, r] of pts) { c.circ(x + 1, y + 1, r, "T"); c.circ(x, y, r, "q"); c.circ(x - 1, y - 1, Math.max(0, r - 2), "Q") } }
unit("cavaliers", (gaul) => [
  sky(CW, 50), stamp("_cloud_a", gaul ? 70 : 10, 6), stamp("_cloud_far", gaul ? 14 : 92, 24),
  hills(40, 4, "3", gaul ? 6 : 2, 60), hills(46, 3, "6", gaul ? 1 : 8, 60), treeline(50, 2, "%", "&", gaul ? 9 : 3),
  ...meadow(52, CW, 28, gaul ? 8 : 4, 60),
  layer("dust", dust(gaul ? [[112, 66, 5], [120, 62, 4], [104, 70, 4], [124, 70, 5]] : [[12, 66, 5], [4, 62, 4], [20, 70, 4], [2, 72, 5]])),
  layer("shadow", { shade: true }, ...(gaul ? [shadowAt(30, 77, 40), shadowAt(66, 69, 34)] : [shadowAt(52, 77, 40), shadowAt(18, 69, 34)])),
  ...(gaul ? [
    stamp("_cav_gaul2", 62, 28, { flip: "x", swap: BACK }),
    stamp("_cav_gaul", 28, 36, { flip: "x" }),
  ] : [
    stamp("_cav_germ", 6, 28, { swap: BACK }),
    stamp("_cav_rome", 38, 36),
  ]),
])

// ------------------------------------------------------------------ terrains (320x144)
const terrain = (name, ...items) => scene("t_" + name, { w: TW, h: TH, bg: "4" }, ...items)
// A plateau hill: steep flanks, flat top, lit on the left flank. Returns the top height at x.
const plateau = (cx, top, half, base, slope = 26) => (x) => {
  const d = Math.abs(x - cx) - half
  if (d <= 0) return top
  const t = Math.min(1, d / slope)
  return Math.round(top + (base - top) * (t * t * (3 - 2 * t)))
}
const fillUnder = (f, key, to = TH, x0 = 0, x1 = TW) => (c) => { for (let x = x0; x < x1; x++) c.vline(x, f(x), to - f(x), key) }
// Shade a landform by slope: light on the left flank, base colour on top, shadow on the right flank,
// with dithered seams. f(x) = top height; keys = [lit, base, shade, deep].
const flankShade = (f, x0, x1, keys, smooth = f) => (c) => {
  for (let x = x0; x < x1; x++) {
    const dy = smooth(x + 3) - smooth(x - 3), y0 = f(x)
    // slope < 0: rising (left flank, faces the light); > 0: falling (right flank)
    const t = Math.max(-1, Math.min(1, dy / 8))
    for (let y = y0; y < TH; y++) {
      const depth = Math.min(1, (y - y0) / 40)
      const v = 1 + t * 1.1 + (depth > 0.9 ? 0.7 : 0)       // 0 lit .. 3 deep; darker at the foot
      const b = (BAYER[(y & 7) * 8 + (x & 7)] / 64 - 0.5) * 0.7  // dither only near the seams
      const k = Math.max(0, Math.min(3, Math.floor(v + 0.5 + b)))
      c.px(x, y, keys[k])
    }
  }
}
// Roundhouse: wattle wall, a door, a tall conical thatched roof lit on the left, thatch strands following the cone.
sprite("_hut", { outline: "k" }, `
  ..........o..........
  .........oYO.........
  ........oYyOO........
  .......oYYyOOo.......
  ......oYYyyyOOo......
  .....oYYYyOyyOOo.....
  ....oYYyyyyOyyOOo....
  ...oYYYyOyyyyOyOOo...
  ..oYYyyyyOyyyyyOOOo..
  .oYYYyyOyyyyOyyyOOOo.
  oYYyyyyyyyyyyyyyyOOOo
  .XXXxxxxxxxxxxxxxWWW.
  .XXxxxxxwwwxxxxxxWWW.
  .XXxxxxxwwwxxxxxxWWW.
  .XXxxxxxwwwxxxxxxWWW.`)
sprite("_hut_s", { outline: "k" }, `
  .......o.......
  ......oYO......
  .....oYyOO.....
  ....oYYyOOo....
  ...oYyyOyyOo...
  ..oYYyyyyyOOo..
  .oYYyyOyyyyOOo.
  oYYyyyyyyyyyOOo
  .XXxxxxwwxxxWW.
  .XXxxxxwwxxxWW.`)
// Smoke rising from a roof, drifting right with the wind, thinning out.
const smoke = (x, y, n = 6) => (c) => {
  for (let i = 0; i < n; i++) { const r = 1 + Math.floor(i / 2), cx = x + Math.round(i * i * 0.35), cy = y - i * 3; c.circ(cx, cy, r, i < 2 ? "m" : "4"); if (r > 1) c.circ(cx - 1, cy - 1, r - 1, i < 2 ? "4" : "5") }
}
// Murus gallicus: courses of dry stone with offset joints, the ends of the timber lacing in rows,
// a palisade of pointed stakes on top. Light from the left: the face is lit, its foot in shadow.
const murus = (x0, x1, y, h = 9) => (c) => {
  const ch = h > 14 ? 4 : 3, bw = h > 14 ? 10 : 8                                                         // course height, beam spacing
  c.rect(x0, y, x1 - x0, h, "m"); c.hline(x0, y, x1 - x0, "l")
  if (h > 14) c.rect(x0, y + h - Math.floor(h / 3), x1 - x0, Math.floor(h / 3), "M")                       // the foot in shade, splashed
  for (let r = ch; r < h; r += ch) c.hline(x0, y + r, x1 - x0, h > 14 && r > h * 0.66 ? "0" : "M")         // bedding joints
  for (let r = 0, k = 0; r < h; r += ch, k++) for (let x = x0 + (k % 2 ? 3 : 0) + (k % 3); x < x1; x += 6 + (k % 2)) c.vline(x, y + r + 1, ch - 1, "M")  // head joints
  for (let r = 1, k = 0; r < h - 2; r += ch * 2, k++) for (let x = x0 + 2 + (k % 2) * (bw / 2); x < x1; x += bw) c.rect(x, y + r + 1, 2, 2, "w")  // beam ends
  c.hline(x0, y + h, x1 - x0, "0")
  for (let x = x0; x < x1; x += 2) { c.vline(x, y - 4, 4, x % 4 ? "x" : "X"); c.px(x, y - 5, "W") }               // palisade
  c.hline(x0, y - 2, x1 - x0, "W")
}
// Field quilt: rows of patches (wheat, stubble, pasture, ploughland) divided by dark hedges, smaller with distance.
const quilt = (y0, y1, seed = 1) => (c) => {
  const r = c.rng(seed), crops = ["y", "d", "C", "c", "q", "Y", "^"]
  let y = y0, row = 0
  while (y < y1) {
    const h = 4 + row * 2
    let x = -Math.floor(r() * 20)
    while (x < TW) {
      const w = 18 + Math.floor(r() * 30) + row * 6, k = crops[Math.floor(r() * crops.length)]
      c.rect(x, y, w, h, k)
      if (k === "q") for (let j = y + 1; j < y + h; j += 2) c.hline(x + 1, j, w - 2, "T")                // furrows
      if (k === "y" || k === "Y") for (let j = y + 1; j < y + h; j += 2) for (let i = x + (j % 4); i < x + w; i += 4) c.px(i, j, "O")  // sheaves
      c.vline(x, y, h, "A"); x += w
    }
    c.hline(0, y + h - 1, TW, "A"); y += h; row++
  }
}
// A copse: a few round crowns, lit top left, with a shadow side.
sprite("_copse", { w: 26, h: 16 }, (c) => {
  c.ellipse(13, 12, 12, 3, "A")
  for (const [x, y, r] of [[6, 9, 5], [13, 6, 6], [20, 9, 5]]) { c.circ(x, y, r, "A"); c.circ(x - 1, y - 1, r - 2, "c"); c.circ(x - 2, y - 2, Math.max(1, r - 4), "C") }
})
// A big foreground tree to frame a landscape: trunk, round crowns lit on the top left.
const bigTree = (x, y, r = 12) => (c) => {
  c.rect(x - 1, y, 3, 30, "w")
  for (const [dx, dy, rr] of [[-r * 0.6, 2, r * 0.7], [r * 0.6, 3, r * 0.7], [0, -r * 0.4, r * 0.8]]) { const cx = Math.round(x + dx), cy = Math.round(y + dy), R = Math.round(rr); c.circ(cx, cy, R, "a"); c.circ(cx - 1, cy - 1, R - 2, "A"); c.circ(cx - 2, cy - 2, Math.max(1, R - 5), "c") }
}
// Strip fields on a slope: alternating ripe wheat, stubble and green.
const fields = (x0, y0, w, h, keys = "yOCd") => (c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const k = keys[Math.floor((i + j * 0.6) / 9) % keys.length]; c.px(x0 + i, y0 + j, k) } }

terrain("oppidum",
  sky(TW, 88), stamp("_cloud_a", 24, 8), stamp("_cloud_b", 236, 18), stamp("_cloud_far", 120, 40), stamp("_cloud_far", 280, 50),
  hills(68, 5, "3", 4, 100, TW), hills(78, 6, "6", 11, 110, TW), treeline(86, 3, "%", "&", 7, TW, 120),
  // the hill of the oppidum, modelled by its slopes
  flankShade((x) => plateau(180, 56, 70, 116, 44)(x) + Math.round(1.5 * Math.sin(x / 7) + Math.sin(x / 3.1)), 0, TW, "Cc^A", plateau(180, 56, 70, 116, 44)),
  // copses on the flanks, clipped to the slope
  clip((x, y) => y > plateau(180, 56, 70, 116, 44)(x) + 3, stamp("_copse", 104, 78), stamp("_copse", 84, 92), stamp("_copse", 250, 74), stamp("_copse", 268, 88)),
  // roofs above the wall, near ones bigger
  stamp("_hut_s", 128, 40), stamp("_hut", 140, 32), stamp("_hut_s", 166, 38), stamp("_hut", 188, 30),
  stamp("_hut_s", 212, 39), stamp("_hut", 226, 31), stamp("_hut_s", 248, 40),
  smoke(150, 30, 8), smoke(198, 28, 9), smoke(236, 29, 7),
  layer("wallshadow", { shade: true }, rect(110, 64, 140, 3, "k")),
  murus(110, 250, 55),
  // the gate: a timber tower over the gap, the road winding up to it
  rect(172, 52, 14, 13, "w"), rect(170, 38, 18, 14, "x"), rect(171, 39, 3, 12, "X"), (c) => { for (let x = 172; x < 188; x += 2) c.vline(x, 39, 12, x % 4 ? "x" : "W") }, rect(177, 43, 1, 4, "w"), hline(170, 51, 18, "W"),
  poly([167, 39, 179, 29, 191, 39], "O"), poly([167, 39, 179, 29, 179, 39], "Y"),
  layer("road", (c) => { const pts = [[179, 65], [168, 74], [186, 84], [160, 96], [194, 108], [146, 124], [124, 144]]; for (let i = 0; i < pts.length - 1; i++) c.line(...pts[i], ...pts[i + 1], "q", 3); for (let i = 0; i < pts.length - 1; i++) c.line(pts[i][0] - 1, pts[i][1] - 1, pts[i + 1][0] - 1, pts[i + 1][1] - 1, "Q", 1) }),
  // fields in the valley, the river, the dark near bank
  clip((x, y) => y >= 112, quilt(112, 128, 5)),
  vgrad(0, 127, TW, 9, "PpZ", 1, 2), (c) => { const r = c.rng(8); for (let i = 0; i < 40; i++) { const x = Math.floor(r() * TW), y = 129 + Math.floor(r() * 5); c.hline(x, y, 2 + Math.floor(r() * 5), y < 131 ? "4" : "P") } }, hline(0, 127, TW, "A"),
  treeline(140, 3, "A", "a", 33, TW, 144), bigTree(14, 112, 16), bigTree(306, 116, 14),
)


// ------------------------------------------------------------------ initiative coin (64x64)
// Player: a silver denarius with Caesar's laureate head. AI: a gold Arverni stater with a horse.
const coinDisc = (rim, body, lit, dark) => (c) => {
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) {
    const d = Math.hypot(x - 31.5, y - 31.5)
    if (d > 30.5) continue
    const b = BAYER[(y & 7) * 8 + (x & 7)] / 64 - 0.5
    if (d > 28.5) { c.px(x, y, (x + y) / 63 + b * 0.5 < 0.9 ? lit : rim); continue }     // raised rim
    if (d > 27.5) { c.px(x, y, dark); continue }
    const v = (x + y - 63) / 50 + b * 0.35                                               // flat field, a sheen at the edge
    c.px(x, y, d > 24 ? (v < -0.35 ? lit : v > 0.4 ? dark : body) : body)
  }
  for (let a = 0; a < 72; a++) { const t = a / 72 * Math.PI * 2; c.px(Math.round(31.5 + Math.cos(t) * 25.5), Math.round(31.5 + Math.sin(t) * 25.5), dark) }  // beaded border
}
// Relief: everything drawn in `mask` becomes `body`, lit on its top-left edges, shadowed on its bottom-right ones.
const relief = (mask, body, lit, dark) => (c) => {
  const m = (x, y) => c.is(x, y, mask), pts = []
  for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) if (m(x, y)) pts.push([x, y, !m(x - 1, y) || !m(x, y - 1), !m(x + 1, y) || !m(x, y + 1)])
  for (const [x, y, tl, br] of pts) c.px(x, y, br ? dark : tl ? lit : body)
}
sprite("coin_0", { w: 64, h: 64 }, coinDisc("I", "j", "J", "I"),
  // Caesar's head in profile, facing right, as a row-by-row silhouette: forehead, the long nose, lips, chin, neck
  (c) => {
    const L = [10, 8, 6, 5, 4, 4, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 7, 8, 8, 8, 7, 6, 5, 4, 3]
    const R = [17, 19, 20, 21, 22, 23, 23, 24, 24, 24, 25, 26, 26, 23, 24, 23, 24, 22, 20, 18, 18, 18, 18, 19, 21, 23, 24, 25]
    L.forEach((l, y) => c.hline(16 + l, 8 + y, R[y] - l + 1, "%"))
  },
  relief("%", "J", "5", "I"), recolor({ J: "j" }, (x, y) => x + y > 60 && Math.hypot(x - 31.5, y - 31.5) < 26, 0.5),
  // the laurel along the crown, the eye under its brow, the ear, the mouth, the line of the jaw
  (c) => { for (let i = 0; i < 10; i++) { const x = 22 + i * 2, y = 11 - Math.round(Math.sin(i / 9 * Math.PI) * 3); c.px(x, y, "I"); c.px(x + 1, y - 1, "5"); c.px(x, y + 1, "j") } },
  hline(34, 16, 3, "I"), px(35, 17, "i"), ring(27, 20, 2, "I"), px(38, 22, "I"), line(37, 22, 39, 23, "I"), hline(37, 22, 3, "I"),
  line(30, 25, 36, 25, "j"), line(28, 26, 31, 30, "j"),
  text(20, 46, "CAESAR", "I"), text(20, 45, "CAESAR", "5"),
)
sprite("coin_1", { w: 64, h: 64 }, coinDisc("B", "n", "N", "B"),
  // the Celtic horse of the staters: a galloping horse, stylised, a wheel under it
  stamp("_horse", 7, 16, { swap: { W: "B", x: "n", X: "N", w: "B", k: "b", R: "n", s: "N" } }),
  ring(31, 50, 4, "B"), line(27, 50, 35, 50, "B"), line(31, 46, 31, 54, "B"),
  circ(16, 13, 2, "B"), circ(46, 13, 2, "B"), px(15, 12, "N"), px(45, 12, "N"),
)

scene("contact_figs", { w: 200, h: 54, bg: "4" },
  stamp("_legio", 2, 4), stamp("_centurio", 26, 4), stamp("_archer", 50, 8), bowman(50, 8), stamp("_slinger", 76, 6),
  stamp("_gaul", 100, 2), stamp("_chief", 126, 2), stamp("_faber", 152, 8), stamp("_druid", 176, 8))

// ------------------------------------------------------------------ more units
const GTUNIC = { Q: "h", q: "G" }                       // auxiliary tunic -> Gallic green
const GREEN = { R: "G", s: "h", S: "H", r: "g" }        // red tunic -> green
const day = (seed = 1, hor = 52) => [sky(CW, hor), stamp("_cloud_b", 10 + seed * 17 % 60, 6 + seed % 3 * 4), stamp("_cloud_far", 70 + seed * 7 % 40, 26)]
const land = (seed = 1, y = 52) => [hills(y - 12, 4, "3", seed, 60), hills(y - 6, 3, "6", seed + 5, 60), treeline(y - 2, 2, "%", "&", seed + 2), ...meadow(y, CW, CH - y, seed, 60)]
// Arrows or bolts in flight: short strokes along an arc.
const volley = (x0, y0, dx, n = 6, seed = 1, k = "x") => (c) => { const r = c.rng(seed); for (let i = 0; i < n; i++) { const x = x0 + Math.floor(r() * 40) * Math.sign(dx), y = y0 + Math.floor(r() * 14); c.line(x, y, x + 4 * Math.sign(dx), y + 1, k); c.px(x + 5 * Math.sign(dx), y + 1, "J") } }
// The sling whirled overhead: a faint circle and the stone.
const sling = (x, y, flip = false) => (c) => { const cx = flip ? x + 11 : x + 10, cy = y - 2; for (let a = 0; a < 24; a += 2) { const t = a / 24 * Math.PI * 2; c.px(Math.round(cx + Math.cos(t) * 6), Math.round(cy + Math.sin(t) * 2), "4") } c.px(cx + 6, cy, "M") }

unit("sagittaires", (g) => [
  ...day(3), ...land(3),
  layer("shadow", { shade: true }, shadowAt(54, 78, 16), shadowAt(24, 70, 14), shadowAt(84, 70, 14)),
  ...(g ? [
    stamp("_archer", 24, 40, { flip: "x", swap: { ...GTUNIC, ...BACK } }), bowman(24, 40, true), stamp("_archer", 84, 41, { flip: "x", swap: { Q: "v", q: "U", ...BACK } }), bowman(84, 41, true),
    stamp("_archer", 52, 48, { flip: "x", swap: GTUNIC }), bowman(52, 48, true), volley(26, 10, -1, 9, 4),
  ] : [
    stamp("_archer", 82, 40, { swap: BACK }), bowman(82, 40), stamp("_archer", 22, 41, { swap: BACK }), bowman(22, 41),
    stamp("_archer", 52, 48), bowman(52, 48), volley(80, 10, 1, 9, 3),
  ]),
])
unit("frondeurs", (g) => [
  ...day(5), ...land(5),
  layer("shadow", { shade: true }, shadowAt(52, 78, 16), shadowAt(22, 70, 14), shadowAt(84, 70, 14)),
  ...(g ? [
    stamp("_slinger", 20, 40, { flip: "x", swap: { ...GTUNIC, ...BACK } }), sling(20, 40, true), stamp("_slinger", 84, 41, { flip: "x", swap: { Q: "v", q: "U", ...BACK } }), sling(84, 41, true),
    stamp("_slinger", 52, 48, { flip: "x", swap: GTUNIC }), sling(52, 48, true), volley(20, 16, -1, 5, 6, "M"),
  ] : [
    stamp("_slinger", 84, 40, { swap: BACK }), sling(84, 40), stamp("_slinger", 20, 41, { swap: BACK }), sling(20, 41),
    stamp("_slinger", 52, 48), sling(52, 48), volley(90, 16, 1, 5, 5, "M"),
  ]),
])
unit("centurion", (g) => g ? [
  ...day(7), ...land(7),
  boarStd(88, 50, 34), stamp("_carnyx", 22, 22),
  stamp("_gaul", 18, 36, { flip: "x", swap: BACK }), stamp("_gaul", 76, 35, { flip: "x", swap: { ...BACK, h: "v", H: "V", G: "U" } }),
  layer("shadow", { shade: true }, shadowAt(48, 78, 20)),
  stamp("_chief", 44, 39, { flip: "x" }),
] : [
  ...day(7), ...land(7),
  (c) => { for (let x = 2; x < 126; x += 4) { c.rect(x, 46, 3, 5, x % 8 ? "R" : "r"); c.px(x + 1, 47, "B"); c.line(x + 2, 45, x + 4, 39, "6") } },
  stamp("_legio", 20, 36, { swap: BACK }), pilum(20, 36, 7, 30), stamp("_legio", 84, 36, { swap: BACK }), pilum(84, 36, 7, 30),
  layer("shadow", { shade: true }, shadowAt(54, 78, 18)),
  stamp("_centurio", 52, 42), line(52 + 19, 61, 52 + 24, 50, "x"),                                   // the vine stick
])
unit("fabri", (g) => g ? [
  // Bituriges miners in a counter-mine under the Roman ramp: timber props, an oil lamp
  vgrad(0, 0, CW, CH, "tTt", 1, 2),
  (c) => { for (let x = 6; x < CW; x += 30) { c.rect(x, 10, 3, 60, "x"); c.vline(x, 10, 60, "X") } c.rect(0, 8, CW, 3, "x"); c.hline(0, 8, CW, "X"); c.rect(0, 70, CW, 10, "w") },
  (c) => { const r = c.rng(3); for (let i = 0; i < 30; i++) c.px(Math.floor(r() * CW), 12 + Math.floor(r() * 56), "q") },   // stones in the tunnel wall
  circ(98, 30, 1, "L"), px(98, 29, "K"), rect(96, 31, 5, 2, "B"), glow("LK", { r: 26, strength: 0.6 }),
  stamp("_faber", 30, 41, { flip: "x", swap: GREEN }), stamp("_faber", 62, 42, { flip: "x", swap: { ...GREEN, ...BACK } }),
  poly([0, 70, 24, 62, 30, 70], "T"), poly([4, 70, 20, 64, 24, 70], "q"),
] : [
  ...day(9), ...land(9, 50),
  // the ditch being dug, earth thrown up into a bank, stakes waiting
  poly([0, 64, 128, 60, 128, 70, 0, 74], "t"), poly([0, 60, 128, 56, 128, 61, 0, 65], "T"), (c) => { for (let x = 4; x < 128; x += 6) c.line(x, 58 - x / 32, x + 2, 52 - x / 32, "X") },
  stamp("_faber", 30, 44), stamp("_faber", 70, 42, { swap: BACK }),
  stamp("_legio", 96, 30, { swap: BACK }), pilum(96, 30, 6, 28),
])
unit("convoi", (g) => g ? [
  ...day(11), ...land(11),
  stamp("_granary", 64, 36), stamp("_granary", 88, 40, { swap: BACK }), stamp("_hut_s", 20, 38),
  layer("shadow", { shade: true }, shadowAt(66, 50, 20)),
  rect(50, 52, 6, 5, "Q"), rect(51, 51, 4, 1, "q"), rect(44, 53, 6, 5, "Q"), rect(45, 52, 4, 1, "q"),     // sacks
  stamp("_gaul", 26, 40, { flip: "x" }),
] : [
  ...day(11), ...land(11),
  layer("road", (c) => { c.poly([0, 66, 128, 58, 128, 70, 0, 78], "q"); c.line(0, 70, 128, 62, "T"); c.line(0, 74, 128, 66, "T") }),
  layer("shadow", { shade: true }, shadowAt(40, 67, 44)),
  stamp("_cart", 26, 50), stamp("_ox", 54, 52), line(50, 55, 58, 56, "W"),
  stamp("_legio", 84, 38, { swap: BACK }), pilum(84, 38, 6, 30),
])
unit("scorpion", () => [
  ...day(13), hills(40, 4, "3", 13, 60), hills(46, 3, "6", 18, 60), ...meadow(50, CW, 30, 13, 30),
  // on the rampart: an earth bank faced with turf, a palisade behind the crew
  poly([0, 58, 128, 54, 128, 80, 0, 80], "T"), poly([0, 58, 128, 54, 128, 57, 0, 61], "c"),
  (c) => { for (let x = 0; x < 128; x += 2) c.vline(x, 48 - x / 32, 8, x % 4 ? "x" : "X") },
  stamp("_scorpio", 50, 42), stamp("_legio", 28, 24), stamp("_legio", 74, 25, { swap: BACK }),
  volley(80, 30, 1, 2, 9, "x"),
])
unit("aquilifere", (g) => g ? [
  ...day(15), ...land(15),
  stamp("_gaul", 80, 36, { flip: "x", swap: BACK }),
  layer("shadow", { shade: true }, shadowAt(44, 78, 18)),
  boarStd(64, 76, 52), stamp("_gaul", 42, 38, { flip: "x", swap: { h: "s", H: "S", G: "R" } }),
] : [
  ...day(15), ...land(15),
  stamp("_legio", 84, 36, { swap: BACK }), pilum(84, 36, 7, 30), stamp("_legio", 22, 36, { swap: BACK }), pilum(22, 36, 7, 30),
  layer("shadow", { shade: true }, shadowAt(52, 78, 18)),
  aquila(71, 74, 50), stamp("_legio", 50, 41, { swap: { r: "o", R: "O", s: "y", S: "Y" } }),       // the eagle-bearer, his shield small and plain
])
unit("druide", () => [
  sky(CW, 50, "789"), hills(42, 3, "6", 21, 60), ...meadow(52, CW, 28, 21, 40),
  // a sacred oak with mistletoe, a standing stone
  rect(84, 18, 6, 40, "w"), rect(85, 18, 2, 40, "W"),
  (c) => { for (const [x, y, r] of [[74, 14, 12], [96, 12, 13], [86, 4, 10], [106, 22, 8]]) { c.circ(x, y, r, "a"); c.circ(x - 2, y - 2, r - 3, "A"); c.circ(x - 4, y - 4, Math.max(1, r - 7), "c") } },
  circ(80, 22, 2, "H"), px(80, 22, "5"), circ(98, 24, 2, "H"), px(97, 23, "5"),
  poly([18, 60, 20, 30, 28, 28, 30, 60], "M"), poly([20, 58, 21, 32, 25, 30, 24, 58], "m"),
  layer("shadow", { shade: true }, shadowAt(54, 77, 18)),
  stamp("_druid", 52, 47),
])
unit("soldurii", () => [
  sky(CW, 52, "+2=3~4"), ...land(23),
  stamp("_chief", 48, 30, { flip: "x", swap: BACK }),
  layer("shadow", { shade: true }, shadowAt(18, 78, 20), shadowAt(50, 79, 20), shadowAt(82, 78, 20)),
  // sworn bodyguards in mail, shields locked
  stamp("_chief", 16, 38, { flip: "x", swap: { h: "I", H: "j", G: "i", O: "U", q: "v", R: "U", s: "v", r: "u" } }),
  stamp("_chief", 48, 40, { flip: "x", swap: { h: "I", H: "j", G: "i", O: "R", q: "s", R: "G", s: "h", r: "g" } }),
  stamp("_chief", 80, 38, { flip: "x", swap: { h: "I", H: "j", G: "i", O: "G", q: "h" } }),
])
unit("vercingetorix", () => [
  sky(CW, 52, "789"), hills(40, 4, "7", 25, 60), hills(46, 3, "6", 26, 60), ...meadow(52, CW, 28, 25, 50),
  boarStd(98, 58, 40), boarStd(16, 56, 36),
  layer("shadow", { shade: true }, shadowAt(32, 78, 44)),
  stamp("_cav_gaul", 30, 32, { flip: "x", swap: { h: "s", H: "S", G: "R", q: "N", O: "n", t: "M", T: "m", q: "J", Q: "J" } }),
])
unit("char_guerre", () => [
  ...day(27), ...land(27),
  layer("dust", dust([[110, 68, 5], [118, 64, 4], [102, 72, 4]])),
  layer("shadow", { shade: true }, shadowAt(26, 77, 70)),
  stamp("_horse_dun", 14, 46, { flip: "x" }),
  stamp("_gaul", 62, 22, { flip: "x", swap: { h: "v", H: "V", G: "U" } }),
  stamp("_chariot", 58, 46, { flip: "x" }), line(62, 52, 50, 56, "W"),
])
unit("decima", () => [
  ...day(29), ...land(29),
  (c) => { for (let x = 2; x < 126; x += 4) { c.rect(x, 46, 3, 5, x % 8 ? "R" : "r"); c.px(x + 1, 47, "B") } },
  vexillum(62, 46, 34, "X"),
  layer("shadow", { shade: true }, shadowAt(32, 78), shadowAt(54, 79), shadowAt(76, 78)),
  stamp("_centurio", 32, 42), pilum(32, 42, 8, 32), stamp("_legio", 54, 43), pilum(54, 43, 6, 33), stamp("_legio", 76, 42), pilum(76, 42, 8, 32),
])
unit("tour", () => [
  ...day(31), hills(40, 4, "3", 31, 60), ...meadow(48, CW, 32, 31, 30),
  // the town wall on the right, the tower rolled up a ramp against it
  murus(92, 128, 34, 12), rect(92, 46, 36, 34, "M"), (c) => { for (let y = 48; y < 80; y += 3) c.hline(92, y, 36, "0") },
  poly([20, 80, 92, 46, 92, 80], "T"), poly([20, 80, 92, 46, 92, 49, 26, 80], "q"),
  stamp("_tower", 62, 35), stamp("_legio", 30, 42), stamp("_legio", 46, 38, { swap: BACK }),
])

// ------------------------------------------------------------------ orders (one picture each)
const order = (name, ...items) => scene("c_" + name, { w: CW, h: CH }, ...items)
order("pluie_traits",
  ...day(33), ...land(33),
  (c) => { for (let x = 4; x < 124; x += 5) { c.rect(x, 58, 4, 8, x % 10 ? "s" : "R"); c.hline(x, 58, 4, "S"); c.px(x + 1, 61, "n") } },
  (c) => { const r = c.rng(5); for (let i = 0; i < 26; i++) { const x = 10 + Math.floor(r() * 110), y = 8 + Math.floor(r() * 36); c.line(x, y, x + 5, y + 3, "x"); c.px(x + 6, y + 4, "J"); c.px(x + 7, y + 4, "J") } })
order("ravitaillement",
  ...day(35), ...land(35),
  layer("road", (c) => { c.poly([0, 70, 128, 60, 128, 68, 0, 80], "q"); c.line(0, 74, 128, 64, "T") }),
  stamp("_ox", 70, 46, { swap: BACK }), stamp("_cart", 44, 45, { swap: BACK }),
  stamp("_ox", 32, 56), stamp("_cart", 4, 54))
order("marche_forcee",
  sky(CW, 50, "+2=3~4"), ...land(37),
  layer("road", (c) => { c.poly([0, 62, 128, 54, 128, 62, 0, 72], "q"); c.line(0, 66, 128, 58, "Q") }),
  layer("dust", dust([[8, 60, 5], [2, 56, 4], [16, 64, 3]])),
  ...[0, 1, 2, 3, 4].map((i) => stamp("_legio", 102 - i * 20, 24 + i * 2, { swap: i < 2 ? BACK : {} })),
  ...[0, 1, 2, 3, 4].map((i) => pilum(102 - i * 20, 24 + i * 2, 4, 28)))
order("espions",
  sky(CW, 40, "+2=3"), hills(34, 3, "6", 39, 60), ...meadow(42, CW, 38, 39, 20),
  // a camp far off, watched from the edge of a wood
  (c) => { for (let x = 64; x < 120; x += 2) c.vline(x, 38, 4, x % 4 ? "x" : "X"); for (let x = 70; x < 116; x += 8) c.poly([x, 38, x + 3, 33, x + 6, 38], "l") },
  smoke(80, 32, 5),
  treeline(64, 4, "A", "a", 41, 60, 80), treeline(78, 4, "c", "A", 43, CW, 80),
  stamp("_archer", 30, 44, { swap: { Q: "G", q: "g" } }))
order("circonvallation",
  ...day(43), hills(40, 4, "3", 43, 60), ...meadow(48, CW, 32, 43, 20),
  // Alesia's works: a ditch with sharpened stakes (cippi), an earth rampart, a palisade, a watchtower
  poly([0, 52, 128, 48, 128, 58, 0, 62], "T"), poly([0, 52, 128, 48, 128, 50, 0, 54], "c"),
  (c) => { for (let x = 0; x < 128; x += 2) { c.vline(x, 40 - Math.round(x / 32), 9, x % 4 ? "x" : "X"); c.px(x, 39 - Math.round(x / 32), "W") } },
  rect(94, 22, 12, 18, "x"), rect(95, 23, 10, 16, "X"), poly([92, 22, 100, 16, 108, 22], "W"), rect(96, 26, 8, 2, "w"),
  poly([0, 66, 128, 62, 128, 72, 0, 76], "t"),
  (c) => { for (let x = 3; x < 128; x += 7) { c.line(x, 72 - x / 32, x + 3, 64 - x / 32, "X"); c.px(x + 3, 63 - x / 32, "l") } })
order("carnyx",
  sky(CW, 56, "1789"), circ(96, 50, 6, "9"), glow("9", { r: 10, strength: 0.4 }),
  hills(48, 4, "7", 45, 70), hills(54, 3, "&", 46, 70), rect(0, 60, CW, 20, "a"), hline(0, 60, CW, "A"),
  ...[[20, 30], [52, 26], [84, 32]].map(([x, y]) => stamp("_carnyx", x, y, {})),
  stamp("_gaul", 8, 40, { flip: "x", swap: { h: "g", H: "G", G: "g", O: "g", q: "G", Y: "o", y: "o", F: "E", f: "e", B: "b", n: "B", N: "n" } }),
  stamp("_gaul", 40, 38, { flip: "x", swap: { h: "g", H: "G", G: "g", O: "g", q: "G", Y: "o", y: "o", F: "E", f: "e", B: "b", n: "B", N: "n" } }),
  stamp("_gaul", 72, 41, { flip: "x", swap: { h: "g", H: "G", G: "g", O: "g", q: "G", Y: "o", y: "o", F: "E", f: "e", B: "b", n: "B", N: "n" } }))
order("terre_brulee",
  vgrad(0, 0, CW, 54, "1uUr", 1, 2), hills(46, 3, "u", 47, 70), rect(0, 52, CW, 28, "g"), hline(0, 52, CW, "G"),
  // a village and its fields on fire at night
  stamp("_hut", 20, 34, { swap: { Y: "D", y: "R", O: "r", o: "r", X: "W", x: "w" } }), stamp("_granary", 64, 38, { swap: { Y: "D", y: "R", O: "r", o: "r", X: "W", x: "w" } }),
  stamp("_hut_s", 94, 40, { swap: { Y: "D", y: "R", O: "r", o: "r", X: "W", x: "w" } }),
  (c) => { for (const [x, y, h] of [[30, 34, 14], [72, 37, 12], [101, 40, 10], [50, 54, 6], [116, 56, 5]]) { c.poly([x - 5, y, x - 2, y - h, x, y - h / 2, x + 2, y - h - 3, x + 5, y], "D"); c.poly([x - 3, y, x - 1, y - h * 0.6, x + 1, y - h * 0.4, x + 3, y], "L"); c.poly([x - 1, y, x, y - h * 0.3, x + 1, y], "K") } },
  smoke(36, 16, 6), smoke(78, 20, 5), glow("DLK", { r: 14, strength: 0.6 }))

// Card back for face-down cards: Roman red, a gold laurel wreath around SPQR.
scene("c_back", { w: CW, h: CH, bg: "R" },
  (c) => { for (let i = -CH; i < CW; i += 8) c.line(i, CH - 1, i + CH, 0, "r") },
  box(2, 2, CW - 4, CH - 4, "n"), box(4, 4, CW - 8, CH - 8, "B"),
  (c) => {
    // two laurel branches: a stem along an arc, a pair of leaves every few pixels, lit on top
    for (const side of [-1, 1]) for (let a = 0; a <= 40; a++) {
      const t = 0.35 + a / 40 * 2.3, x = Math.round(64 + side * Math.sin(t) * 28), y = Math.round(40 - Math.cos(t) * 24)
      c.px(x, y, "B")
      if (a % 4 === 0) { c.px(x + side, y - 1, "N"); c.px(x + 2 * side, y - 2, "n"); c.px(x - side, y - 1, "n"); c.px(x - 2 * side, y - 1, "B") }
    }
    c.circ(64, 64, 2, "n"); c.px(63, 63, "N")
  },
  text(52, 38, "SPQR", "N", { shadow: "r" }))

const CARDS = ["legionnaire", "cavaliers", "sagittaires", "frondeurs", "centurion", "fabri", "convoi", "scorpion", "aquilifere", "druide", "soldurii", "vercingetorix", "char_guerre", "decima", "tour"]
const ORDERS = ["pluie_traits", "ravitaillement", "marche_forcee", "espions", "circonvallation", "carnyx", "terre_brulee", "back"]
scene("contact_cards", { w: 4 * 130 + 2, h: 10 * 82 + 2, bg: "k" },
  ...CARDS.map((n, i) => stamp("c_" + n, 2 + (i % 2) * 260, 2 + Math.floor(i / 2) * 82)),
  ...CARDS.map((n, i) => stamp("c_" + n + "_x", 132 + (i % 2) * 260, 2 + Math.floor(i / 2) * 82)),
  ...ORDERS.map((n, i) => stamp("c_" + n, (i % 4) * 130 + 2, 2 + (8 + Math.floor(i / 4)) * 82)))

// ------------------------------------------------------------------ more terrain pieces
// Water band: sky reflected light near the far bank, darker towards us, ripples as short light strokes.
const water = (y, h, seed = 1, keys = "PpZz") => [vgrad(0, y, TW, h, keys, 1, 2),
  (c) => { const r = c.rng(seed); for (let i = 0; i < h * 6; i++) { const x = Math.floor(r() * TW), yy = y + 1 + Math.floor(r() * (h - 2)), t = (yy - y) / h; c.hline(x, yy, 2 + Math.floor(r() * (2 + t * 6)), t < 0.4 ? "4" : "P") } }]
// Reeds: thin stalks with a dark seed head, painted on the near bank.
sprite("_reed_a", ".w.\n.c.\n.c.\nc.c")
sprite("_reed_b", "w..\nc..\n.c.\n.c.\ncA.")
group("_reed", ["_reed_a", "_reed_b"])
// Roman leather tent (contubernium), seen from the corner, lit on the left slope.
sprite("_tent", { outline: "k" }, `
  ......Xx......
  .....XXxx.....
  ....XXXxxx....
  ...XXXXxxxW...
  ..XXXXXxxxWW..
  .XXXXXXxxxWWW.
  XXXXXXwxxxWWWW`)
// Palisade along a line of stakes, sharpened tops.
const palisade = (x0, x1, y, h = 6, slope = 0) => (c) => { for (let x = x0; x < x1; x += 2) { const yy = Math.round(y + (x - x0) * slope); c.vline(x, yy, h, x % 4 ? "x" : "X"); c.vline(x + 1, yy + 1, h - 1, "W"); c.px(x, yy - 1, "W") } }
// Watchtower on four posts with a little roof.
sprite("_wtower", { outline: "k" }, `
  ...WWWWW...
  ..WxxxxxW..
  .WWWWWWWWW.
  ..XxwwwxX..
  ..XxxxxxX..
  ..WWWWWWW..
  ..x.x.x.x..
  ..x..x..x..
  ..x.x.x.x..
  ..xx...xx..
  ..x.x.x.x..
  ..x..x..x..`)
// Ditch: a dark trench with a lit far lip, optional stakes (lilia) in it.
const ditch = (y, h = 5, stakes = false) => (c) => { c.rect(0, y, TW, h, "t"); c.hline(0, y, TW, "T"); c.hline(0, y + h, TW, "A"); if (stakes) for (let x = 3; x < TW; x += 6) { c.line(x, y + h - 1, x + 2, y + 1, "X"); c.px(x + 2, y, "l") } }
// White chalk or limestone cliff: vertical fissures, lit faces, a grassy top.
const cliff = (x0, x1, top, base, keys = "lmM0") => (c) => {
  const r = c.rng(x0 + top)
  for (let x = x0; x < x1; x++) { const t = top + Math.round(Math.sin(x / 9) * 2 + Math.sin(x / 3.7)); c.vline(x, t, base - t, keys[(x % 11 < 6) ? 0 : 1]); c.px(x, t, "c"); c.px(x, t + 1, "A") }
  for (let x = x0 + 3; x < x1; x += 4 + Math.floor(r() * 5)) c.vline(x, top + 4 + Math.floor(r() * 4), base - top - 6 - Math.floor(r() * 6), keys[2])
  for (let x = x0; x < x1; x += 2) c.px(x, base - 1, keys[3])
}
// Veneti ship: tall oak hull with a high bow and stern, a leather sail; Roman galley: low, oars, a red sail.
sprite("_veneti", { outline: "k" }, `
  ..............w.........
  ..........EEEEwEEEE.....
  ..........EeeEwEeeE.....
  ..........EEEEwEEEE.....
  ..........EeeEwEeeE.....
  ..........EEEEwEEEE.....
  ...........EEEwEEE......
  ..............w.........
  WW............w.......WW
  WxW...................xW
  WxxWWWWWWWWWWWWWWWWWWxxW
  .WxxxxxxxxxxxxxxxxxxxxW.
  .WxXXXXXXXXXXXXXXXXXXxW.
  ..WxxxxxxxxxxxxxxxxxxW..
  ...WWWWWWWWWWWWWWWWWW...`)
sprite("_galley", { outline: "k" }, `
  ..........w..........
  .......sssSwsss......
  .......sSSSwSSs......
  .......sssSwsss......
  ........ssSwss.......
  ..........w..........
  W.........w.........n
  WxW................xn
  .WxxxxxxxxxxxxxxxxxxW
  ..RRRRRRRRRRRRRRRRRR.
  ..WWWWWWWWWWWWWWWWW..
  ...x.x.x.x.x.x.x.x...
  ..x.x.x.x.x.x.x.x....`)

terrain("plaine",
  sky(TW, 84), stamp("_cloud_a", 40, 10), stamp("_cloud_a", 200, 4), stamp("_cloud_b", 140, 30), stamp("_cloud_far", 260, 50),
  hills(68, 4, "3", 2, 100, TW), hills(76, 4, "6", 7, 100, TW), treeline(82, 2, "%", "&", 3, TW, 100),
  clip((x, y) => y >= 84, quilt(84, 116, 9)), ...meadow(112, TW, 32, 9, 120).map((it) => it),
  layer("road", (c) => { c.poly([150, 84, 158, 84, 210, 144, 120, 144], "q"); c.line(154, 84, 165, 144, "T"); c.line(156, 84, 182, 144, "T") }),
  bigTree(70, 92, 12), layer("shadow", { shade: true }, ellipse(82, 118, 14, 3, "k")),
  rect(196, 104, 3, 8, "m"), rect(196, 104, 1, 8, "l"),                                                  // a milestone by the road
)
terrain("gue",
  sky(TW, 80), stamp("_cloud_a", 220, 8), stamp("_cloud_b", 30, 18),
  hills(64, 4, "3", 12, 100, TW), hills(72, 4, "6", 13, 100, TW), treeline(80, 3, "%", "&", 14, TW, 96),
  ...meadow(90, TW, 54, 15, 80),
  ...water(98, 22, 16),
  // the ford: a pale gravel bar across the river, stones breaking the current, cart tracks going in
  poly([130, 98, 190, 98, 210, 120, 110, 120], "Q"), (c) => { const r = c.rng(4); for (let i = 0; i < 40; i++) { const x = 116 + Math.floor(r() * 90), y = 100 + Math.floor(r() * 19); c.px(x, y, r() < 0.5 ? "m" : "q") } },
  (c) => { for (const [x, y] of [[112, 108], [206, 112], [124, 116], [196, 102]]) { c.ellipse(x, y, 3, 1, "M"); c.hline(x - 2, y - 1, 3, "m"); c.hline(x + 3, y + 1, 4, "4") } },
  line(150, 90, 152, 98, "T"), line(168, 90, 170, 98, "T"), line(150, 120, 146, 144, "T"), line(170, 120, 176, 144, "T"),
  scatter("_reed", 0, 118, TW, 8, 70, { seed: 3 }), scatter("_reed", 0, 92, TW, 6, 50, { seed: 5 }),
  treeline(142, 3, "A", "a", 17, TW, 144),
)
terrain("foret",
  vgrad(0, 0, TW, 144, "&Aa", 1, 2),
  // deep woods: rows of trunks, farther ones paler in the mist, light shafts slanting from the left
  (c) => { const r = c.rng(2); for (let row = 0; row < 3; row++) for (let x = Math.floor(r() * 10); x < TW; x += 12 + Math.floor(r() * 14) - row * 3) { const w = 2 + row * 2, k = ["%", "W", "w"][row]; c.rect(x, 0, w, 120 + row * 8, k); if (row) c.vline(x, 0, 120 + row * 8, row === 1 ? "x" : "W") } },
  layer("shafts", { light: true, density: 0.35 }, poly([60, 0, 90, 0, 170, 144, 120, 144], "k"), poly([180, 0, 200, 0, 270, 144, 240, 144], "k")),
  (c) => { for (const [x, y, r] of [[30, 6, 22], [100, 0, 26], [170, 8, 22], [240, 2, 26], [300, 6, 20]]) { c.circ(x, y, r, "a"); c.circ(x - 3, y - 3, r - 6, "A") } },
  vgrad(0, 124, TW, 20, "Aa", 1, 2), scatter("_tuft", 0, 126, TW, 18, 80, { seed: 7, on: "Aa" }),
)
terrain("camp",
  sky(TW, 70), stamp("_cloud_b", 40, 10), stamp("_cloud_a", 230, 6),
  hills(56, 4, "3", 22, 80, TW), hills(64, 4, "6", 23, 90, TW), ...meadow(70, TW, 74, 24, 50),
  // rows of tents inside the rampart, the standards in the middle
  ...[0, 1, 2, 3].flatMap((row) => Array.from({ length: 14 }, (_, i) => stamp("_tent", 30 + i * 19 + (row % 2) * 9, 66 + row * 9))),
  vexillum(160, 74, 26, "X"), aquila(176, 76, 30), smoke(110, 70, 6), smoke(220, 72, 5),
  // the agger: earth bank, turf facing and palisade, the ditch in front, the gate
  poly([0, 110, TW, 110, TW, 124, 0, 124], "T"), hline(0, 110, TW, "c"), palisade(0, TW, 102, 9),
  rect(150, 96, 22, 28, "w"), stamp("_wtower", 140, 84), stamp("_wtower", 170, 84),
  ditch(126, 6), vgrad(0, 132, TW, 12, "cA", 1, 2),
)
terrain("murus",
  sky(TW, 60), stamp("_cloud_a", 180, 8),
  hills(48, 4, "3", 30, 80, TW), treeline(56, 3, "%", "&", 31, TW, 80),
  stamp("_hut", 60, 22), stamp("_hut_s", 100, 30), stamp("_hut", 220, 24), smoke(70, 20, 6), smoke(230, 22, 6),
  murus(0, TW, 46, 40), layer("wallshade", { shade: true }, rect(0, 84, TW, 2, "k")),
  // the gate: a deep passage between the wall's turned-in ends, a timber bridge over it
  rect(140, 50, 40, 36, "w"), rect(138, 40, 44, 10, "x"), hline(138, 40, 44, "X"), (c) => { for (let x = 140; x < 180; x += 4) c.vline(x, 42, 8, "W") },
  rect(144, 56, 32, 30, "0"), (c) => { for (let x = 146; x < 176; x += 3) c.vline(x, 58, 28, "W") },
  ...meadow(86, TW, 58, 32, 50), layer("road", (c) => c.poly([144, 86, 176, 86, 200, 144, 120, 144], "q")),
)
terrain("riviere",
  sky(TW, 76), stamp("_cloud_a", 20, 8), stamp("_cloud_b", 180, 20), stamp("_cloud_far", 260, 44),
  hills(60, 5, "3", 40, 100, TW), hills(70, 4, "6", 41, 100, TW), treeline(78, 3, "%", "&", 42, TW, 100),
  ...meadow(84, TW, 60, 43, 80),
  // a river winding from the far hills to us
  (c) => { for (let y = 84; y < 144; y++) { const t = (y - 84) / 60, cx = 160 + Math.sin(t * 4) * 60, w = 6 + t * 70; c.hline(Math.round(cx - w / 2), y, Math.round(w), t < 0.3 ? "P" : t < 0.7 ? "p" : "Z"); if (y % 3 === 0) c.hline(Math.round(cx - w / 4), y, Math.round(w / 6), "4") } },
  scatter("_reed", 0, 128, TW, 14, 50, { seed: 9 }), bigTree(30, 104, 14), bigTree(290, 110, 12),
)
terrain("marais",
  sky(TW, 70, "+2=3~4"), hills(58, 3, "6", 50, 90, TW), treeline(66, 2, "%", "&", 51, TW, 90),
  vgrad(0, 70, TW, 74, "^cA", 1, 2),
  // pools of still water among the reeds, dead trees, a low mist
  (c) => { const r = c.rng(5); for (let i = 0; i < 14; i++) { const x = Math.floor(r() * TW), y = 78 + Math.floor(r() * 60), rx = 10 + Math.floor(r() * 24); c.ellipse(x, y, rx, 2 + Math.floor((y - 70) / 18), y < 100 ? "P" : "p"); c.hline(x - rx + 3, y - 1, rx, "4") } },
  scatter("_reed", 0, 76, TW, 66, 200, { seed: 11 }),
  (c) => { for (const [x, h] of [[60, 34], [210, 40], [270, 26]]) { c.vline(x, 104 - h, h, "w"); c.line(x, 104 - h + 8, x - 8, 104 - h, "w"); c.line(x, 104 - h + 14, x + 7, 104 - h + 6, "w") } },
)
terrain("cote",
  sky(TW, 70), stamp("_cloud_a", 60, 6), stamp("_cloud_b", 230, 16),
  ...water(70, 74, 61, "3pZz"),
  cliff(0, 110, 54, 118), poly([0, 118, 110, 118, 130, 144, 0, 144], "Q"), (c) => { for (let x = 0; x < 130; x += 3) c.px(x, 120 + (x % 7), "q") },
  stamp("_veneti", 190, 56), stamp("_veneti", 250, 74, { swap: BACK }), stamp("_galley", 140, 92),
  (c) => { for (let x = 110; x < TW; x += 9) c.hline(x, 118 + (x % 5), 4, "5") },
)
terrain("village",
  sky(TW, 70), stamp("_cloud_a", 140, 6), stamp("_cloud_far", 40, 30),
  hills(56, 4, "3", 60, 90, TW), hills(64, 4, "6", 61, 90, TW), treeline(70, 2, "%", "&", 62, TW, 90),
  ...meadow(74, TW, 70, 63, 60), clip((x, y) => y > 74 && y < 90, quilt(74, 90, 63)),
  stamp("_hut", 40, 72), stamp("_hut_s", 80, 82), stamp("_granary", 120, 80), stamp("_hut", 160, 74), stamp("_hut", 230, 78), stamp("_hut_s", 270, 88), stamp("_granary", 200, 92),
  smoke(50, 70, 7), smoke(170, 72, 7), smoke(240, 76, 6),
  (c) => { for (let x = 20; x < 300; x += 3) { c.vline(x, 106, 5, "x"); } c.hline(20, 107, 280, "X"); c.hline(20, 109, 280, "W") },   // wattle fence
  layer("road", (c) => c.poly([140, 112, 170, 112, 200, 144, 110, 144], "q")),
)
terrain("lignes",
  sky(TW, 64), stamp("_cloud_b", 220, 12),
  hills(40, 5, "3", 70, 80, TW), fillUnder(plateau(160, 30, 50, 66, 30), "6", 80), hills(60, 3, "6", 71, 80, TW),
  ...meadow(66, TW, 78, 72, 40),
  // the two lines facing outwards and inwards: rampart, palisade and towers, ditches with stakes between
  poly([0, 76, TW, 76, TW, 84, 0, 84], "T"), hline(0, 76, TW, "c"), palisade(0, TW, 70, 7),
  ...[30, 110, 190, 270].map((x) => stamp("_wtower", x, 56)),
  ditch(88, 4, true), ditch(98, 5, true),
  poly([0, 110, TW, 110, TW, 120, 0, 120], "T"), hline(0, 110, TW, "c"), palisade(0, TW, 103, 8),
  ...[60, 150, 240].map((x) => stamp("_wtower", x, 88)),
  (c) => { for (let x = 4; x < TW; x += 8) for (let y = 126; y < 144; y += 6) { c.ellipse(x + (y % 12 ? 4 : 0), y, 2, 1, "t"); c.px(x + (y % 12 ? 4 : 0), y - 1, "l") } },   // the lilia: pits with a stake
)

// ------------------------------------------------------------------ campaign terrains with their own picture
terrain("morbihan",
  sky(TW, 64, "1+2=3~4"), stamp("_cloud_a", 30, 6), stamp("_cloud_far", 200, 30),
  ...water(64, 80, 71, "3pZz"),
  // islands of the gulf, the Veneti fleet under leather sails, the Roman galleys closing in
  (c) => { for (const [x, w, h] of [[20, 70, 6], [150, 40, 4], [250, 60, 5]]) { c.ellipse(x + w / 2, 66, w / 2, h, "6"); c.hline(x + 4, 66 - h + 1, w - 8, "%") } },
  stamp("_veneti", 40, 70, { swap: BACK }), stamp("_veneti", 200, 66, { swap: BACK }), stamp("_veneti", 110, 84),
  stamp("_galley", 30, 104), stamp("_galley", 230, 100), stamp("_galley", 150, 118),
  (c) => { for (const [x, y] of [[40, 116], [156, 130], [240, 112]]) for (let i = 0; i < 14; i++) c.px(x - i, y + (i % 3 === 0 ? 1 : 0), "5") },   // wakes
)
terrain("kent",
  sky(TW, 88), stamp("_cloud_a", 140, 4), stamp("_cloud_b", 260, 14),
  // the white cliffs, the shingle beach, the legions wading ashore from grounded ships
  cliff(0, 200, 28, 86, "5lmM"), poly([0, 86, 200, 86, 240, 100, 0, 100], "Q"),
  ...water(86, 58, 81, "3pZz"), poly([0, 96, 230, 96, 250, 104, 0, 104], "Q"), (c) => { for (let x = 0; x < 250; x += 3) c.px(x, 98 + (x % 5), "q") },
  (c) => { for (let x = 0; x < 250; x += 8) c.hline(x, 104 + (x % 3), 5, "5") },
  stamp("_galley", 200, 100), stamp("_galley", 260, 112, { swap: BACK }),
  stamp("_legio", 120, 98), stamp("_legio", 150, 104), stamp("_legio", 176, 108), aquila(140, 128, 40),
  ...water(124, 20, 83, "pZZz"), (c) => { for (const x of [128, 158, 184]) { c.hline(x, 124, 9, "5"); c.px(x - 1, 125, "4"); c.px(x + 9, 125, "4") } },
  stamp("_gaul", 40, 64, { flip: "x", swap: { h: "v", H: "V", G: "U", F: "v", f: "U" } }), stamp("_gaul", 70, 62, { flip: "x", swap: { h: "v", H: "V", G: "U", F: "v", f: "U" } }),
)
terrain("pont_rhin",
  sky(TW, 70), stamp("_cloud_a", 220, 8),
  hills(56, 4, "3", 90, 90, TW), treeline(66, 4, "&", "a", 91, TW, 90),
  ...water(72, 52, 92, "PpZz"),
  // the timber bridge on paired piles, raked downstream, a breakwater of logs upstream
  (c) => {
    for (let x = 0; x < TW; x++) { const y = Math.round(76 + x * 0.12); c.rect(x, y, 1, 4, x % 6 < 3 ? "X" : "x"); c.px(x, y + 4, "W") }
    for (let x = 6; x < TW; x += 18) { const y = Math.round(76 + x * 0.12); c.line(x, y + 4, x - 3, y + 26, "w", 2); c.line(x + 6, y + 4, x + 9, y + 26, "w", 2); c.line(x, y + 12, x + 6, y + 12, "W") }
  },
  stamp("_legio", 100, 52), stamp("_legio", 124, 55), stamp("_faber", 170, 60),
  ...meadow(124, TW, 20, 93, 40), scatter("_reed", 0, 120, TW, 8, 40, { seed: 13 }),
)
terrain("avaricum",
  sky(TW, 70, "+2=3~4"), stamp("_cloud_a", 30, 8),
  hills(56, 3, "6", 100, 90, TW),
  // the town on its rise, behind the murus; the Roman ramp (agger) climbs to it between two siege towers
  fillUnder(plateau(170, 58, 80, 84, 30), "c"), murus(80, 260, 50, 16), stamp("_hut", 110, 30), stamp("_hut", 200, 32), stamp("_hut_s", 150, 36), smoke(120, 28, 7), smoke(210, 30, 6),
  vgrad(0, 84, TW, 60, "^cA", 1, 2), (c) => { const r = c.rng(6); for (let i = 0; i < 10; i++) { const x = Math.floor(r() * TW), y = 96 + Math.floor(r() * 40); c.ellipse(x, y, 12 + Math.floor(r() * 16), 2, "p"); c.hline(x - 8, y - 1, 10, "P") } },
  scatter("_reed", 0, 92, TW, 50, 120, { seed: 15 }),
  poly([60, 144, 140, 66, 200, 66, 170, 144], "T"), poly([60, 144, 140, 66, 146, 66, 70, 144], "q"),
  stamp("_tower", 110, 46), stamp("_tower", 196, 46, { swap: BACK }),
)
terrain("gergovie",
  sky(TW, 60), stamp("_cloud_a", 60, 4), stamp("_cloud_b", 240, 12),
  hills(52, 5, "3", 110, 90, TW),
  // the long plateau of the Arverni, steep on every side, the small Roman camp on a knoll below
  flankShade(plateau(150, 34, 110, 110, 34), 0, TW, "Cc^A"),
  murus(48, 252, 30, 6), stamp("_hut_s", 70, 16), stamp("_hut", 120, 12), stamp("_hut_s", 180, 16), stamp("_hut", 220, 12), smoke(130, 12, 6), smoke(230, 12, 6),
  clip((x, y) => y > plateau(150, 34, 110, 110, 34)(x) + 4, stamp("_copse", 40, 70), stamp("_copse", 250, 66), stamp("_copse", 60, 90), stamp("_copse", 270, 92)),
  ...meadow(110, TW, 34, 111, 50),
  // the Roman camp: a square rampart with tents
  poly([200, 118, 300, 118, 300, 132, 200, 132], "T"), palisade(200, 300, 113, 6), ...[0, 1, 2, 3].map((i) => stamp("_tent", 210 + i * 20, 116)),
)
terrain("alesia",
  sky(TW, 56, "789"), circ(250, 36, 8, "9"), glow("9", { r: 14, strength: 0.35 }), stamp("_cloud_far", 40, 20),
  hills(44, 5, "7", 120, 80, TW), hills(52, 4, "6", 121, 80, TW),
  // Mont Auxois with the oppidum, ringed in the plain by the Roman double line, the relief army's campfires beyond
  flankShade(plateau(160, 40, 70, 96, 44), 0, TW, "Cc^A"),
  murus(96, 224, 36, 6), stamp("_hut_s", 110, 22), stamp("_hut", 140, 18), stamp("_hut_s", 176, 22), stamp("_hut", 196, 18), smoke(150, 18, 7), smoke(206, 18, 6),
  ...meadow(96, TW, 48, 122, 40),
  poly([0, 104, TW, 104, TW, 110, 0, 110], "T"), hline(0, 104, TW, "c"), palisade(0, TW, 99, 5),
  ...[20, 100, 180, 260].map((x) => stamp("_wtower", x, 86)), ditch(112, 3, true),
  poly([0, 124, TW, 124, TW, 130, 0, 130], "T"), hline(0, 124, TW, "c"), palisade(0, TW, 118, 6), ...[60, 140, 220, 300].map((x) => stamp("_wtower", x, 104)),
  (c) => { for (let x = 6; x < TW; x += 14) { c.px(x, 138, "L"); c.px(x, 137, "K"); c.px(x + 1, 138, "D") } }, glow("LK", { r: 5, strength: 0.5 }),
)
terrain("uxellodunum",
  sky(TW, 70), stamp("_cloud_a", 200, 6),
  hills(60, 4, "3", 130, 90, TW),
  // the oppidum on its limestone spur above the river, the spring at the cliff foot, the Roman tower facing it
  cliff(60, 260, 44, 112, "lmM0"), murus(70, 250, 36, 7), stamp("_hut", 100, 18), stamp("_hut_s", 150, 24), stamp("_hut", 200, 18), smoke(110, 16, 6), smoke(210, 16, 6),
  fillUnder(plateau(160, 44, 100, 112, 20), "c", 112, 0, 60), fillUnder(plateau(160, 44, 100, 112, 20), "c", 112, 260, TW),
  ...meadow(108, TW, 36, 131, 40), ...water(124, 20, 132, "PpZz"),
  circ(180, 112, 3, "P"), px(179, 111, "5"), line(180, 115, 186, 124, "p"),                                // the spring
  stamp("_tower", 236, 84), stamp("_legio", 210, 92), stamp("_faber", 196, 96),
)

// ------------------------------------------------------------------ campaign map (640x280), the same lon/lat frame as pack.js
// An antique chart: parchment land, sea in hatched teal, rivers, hachured mountains, forests in little trees, Latin names.
const MW = 640, MH = 280
const P = (lon, lat) => [Math.round((lon + 7) / 22 * MW), Math.round((53 - lat) / 10.5 * MH)]
const path = (pts) => pts.flatMap(([lon, lat]) => P(lon, lat))
const river = (pts, k = "p") => (c) => { for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = P(...pts[i]), [x1, y1] = P(...pts[i + 1]); c.line(x0, y0, x1, y1, k, i > pts.length / 2 ? 2 : 1) } }
const ridge = (lon0, lat0, lon1, lat1, n, seed = 1) => (c) => {
  const r = c.rng(seed)
  for (let i = 0; i < n; i++) { const t = r(), [x, y] = P(lon0 + (lon1 - lon0) * t + (r() - 0.5) * 1.2, lat0 + (lat1 - lat0) * t + (r() - 0.5) * 0.9); c.line(x - 3, y + 2, x, y - 2, "q"); c.line(x, y - 2, x + 3, y + 2, "T"); c.px(x - 1, y, "Q") }
}
const wood = (lon0, lat0, lon1, lat1, n, seed = 1) => (c) => {
  const r = c.rng(seed)
  for (let i = 0; i < n; i++) { const [x, y] = P(lon0 + (lon1 - lon0) * r(), lat0 + (lat1 - lat0) * r()); c.px(x, y - 1, "h"); c.px(x - 1, y, "G"); c.px(x, y, "G"); c.px(x + 1, y, "G"); c.px(x, y + 1, "W") }
}
const ATLANTIC = [[-7, 53], [5.5, 53], [4.7, 52.9], [4.2, 51.9], [3.5, 51.4], [2.5, 51.1], [1.6, 50.9], [1.4, 50.1], [0.2, 49.5], [-1.1, 49.4], [-1.3, 49.7], [-1.9, 49.7],
  [-1.6, 48.7], [-2.0, 48.6], [-3.0, 48.8], [-4.0, 48.7], [-4.7, 48.4], [-4.4, 47.9], [-3.5, 47.7], [-2.5, 47.3], [-2.2, 46.8], [-1.2, 46.0], [-1.2, 44.6], [-1.6, 43.4],
  [-3.8, 43.5], [-5.8, 43.6], [-7, 43.7]]
const BRITAIN = [[-5.7, 50.0], [-4.2, 50.4], [-3.4, 50.6], [-2.0, 50.7], [-1.0, 50.8], [0.3, 50.8], [1.4, 51.2], [1.4, 51.4], [0.9, 51.6], [1.7, 52.1], [1.7, 52.7], [0.3, 53.1],
  [-3.0, 53.1], [-4.5, 52.8], [-4.2, 52.0], [-5.2, 51.7], [-3.0, 51.5], [-4.5, 51.2]]
const IRELAND = [[-7, 52.2], [-6.3, 52.2], [-6.0, 53.1], [-7, 53.1]]
const MEDIT = [[2.6, 42.4], [3.1, 43.0], [3.5, 43.3], [4.5, 43.4], [5.3, 43.3], [6.2, 43.1], [7.0, 43.5], [7.5, 43.8], [8.2, 43.9], [8.8, 44.4], [9.5, 44.1], [10.2, 43.9], [10.5, 43.3], [10.7, 42.9], [11.2, 42.4]]
const ADRIA = [[12.3, 44.4], [12.4, 45.4], [13.8, 45.6], [13.6, 45.1], [14.0, 44.9], [14.5, 45.3], [15.1, 45.2], [15.1, 42.4], [14.2, 42.4], [13.5, 43.6], [12.6, 44.0]]
const CORSICA = [[9.4, 43.0], [9.55, 42.4], [8.6, 42.4], [8.7, 42.7]]
scene("map_gaule", { w: MW, h: MH, bg: "Q" },
  // parchment: a warm wash darker towards the edges, a few stains
  rect(0, 0, MW, MH, "l"),
  // seas
  poly(path(ATLANTIC), "p"), poly(path(MEDIT.concat([[11.2, 42.4]])), "p"), poly(path(ADRIA), "p"),
  poly(path(BRITAIN), "l"), poly(path(IRELAND), "l"), poly(path(CORSICA), "l"),
  // sea hatching parallel to the coasts (waves), lighter by the shore
  (c) => { for (let y = 2; y < MH; y += 4) for (let x = (y % 8) * 2; x < MW; x += 10) if (c.is(x, y, "p") && c.is(x + 4, y, "p")) c.hline(x, y, 4, "P") },
  // coastlines
  (c) => { const L = (ch) => "lQq".includes(ch); for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) if (c.is(x, y, "p") && (L(c.key(x - 1, y)) || L(c.key(x + 1, y)) || L(c.key(x, y - 1)) || L(c.key(x, y + 1)))) c.px(x, y, "Z") },
  // relief and forests
  ridge(5.8, 45.2, 13.5, 46.6, 160, 1), ridge(6.0, 44.2, 7.5, 45.5, 40, 2),            // Alps
  ridge(2.4, 44.6, 3.9, 46.0, 50, 3), ridge(5.7, 46.4, 6.8, 47.3, 18, 4), ridge(6.8, 47.8, 7.4, 48.9, 18, 5),   // Massif Central, Jura, Vosges
  ridge(-1.4, 42.6, 3.0, 42.95, 40, 6), ridge(-4.2, 43.0, -1.6, 43.2, 18, 7),          // Pyrenees, Cantabrians
  wood(4.6, 49.7, 6.8, 50.5, 60, 8), wood(8.6, 48.6, 14.5, 51.6, 220, 9), wood(0.8, 47.8, 2.0, 48.4, 20, 10), wood(-1.0, 51.0, 0.6, 51.3, 20, 11),
  // rivers
  river([[0.2, 49.45], [1.0, 49.4], [1.5, 49.1], [2.3, 48.85], [3.0, 48.5], [3.6, 48.3], [4.5, 48.0], [4.7, 47.6]]),               // Seine
  river([[-2.2, 47.3], [-1.5, 47.2], [0.0, 47.3], [0.7, 47.4], [1.9, 47.9], [2.7, 47.6], [3.0, 47.0], [3.2, 46.5], [4.0, 46.0], [4.1, 45.2]]),  // Loire
  river([[4.8, 43.4], [4.8, 44.2], [4.8, 45.0], [4.85, 45.75], [5.5, 46.0], [6.2, 46.2]]), river([[4.85, 45.75], [4.8, 46.8], [5.2, 47.3], [5.9, 47.9]]),  // Rhône, Saône
  river([[4.2, 51.9], [5.5, 51.9], [6.2, 51.8], [6.8, 51.2], [7.2, 50.6], [7.6, 50.3], [8.3, 49.9], [8.4, 49.0], [7.8, 48.3], [7.6, 47.6], [8.5, 47.6], [9.5, 47.6]]),  // Rhine
  river([[-1.0, 45.6], [-0.5, 44.9], [0.6, 44.3], [1.4, 43.6]]), river([[-0.5, 44.9], [0.5, 44.85], [1.5, 44.9], [2.2, 45.4]]),    // Garonne, Dordogne
  river([[4.2, 51.9], [5.8, 51.5], [5.7, 50.8], [4.9, 50.5], [4.8, 49.5]]), river([[4.9, 50.5], [4.0, 50.3], [3.6, 50.1]]),      // Meuse, Sambre
  river([[1.0, 51.5], [0.0, 51.5], [-1.0, 51.7], [-1.8, 51.7]]), river([[12.4, 45.0], [10.5, 45.1], [9.0, 45.2], [7.6, 45.0]]),   // Thames, Po
  // names, in Roman capitals
  text(...P(-6.2, 46.6), "OCEANVS", "Z", { scale: 2 }), text(...P(0.2, 46.6), "GALLIA", "T", { scale: 2 }), text(...P(-4.0, 52.4), "BRITANNIA", "T"),
  text(...P(9.6, 50.6), "GERMANIA", "T", { scale: 2 }), text(...P(9.3, 44.9), "ITALIA", "T"), text(...P(4.6, 43.05), "MARE NOSTRVM", "Z"),
  text(...P(-0.4, 50.3), "FRETVM", "Z"), text(...P(3.6, 51.0), "BELGAE", "T"), text(...P(-1.4, 44.0), "AQVITANI", "T"), text(...P(10.4, 46.5), "ALPES", "q"),
  // compass rose, top right, and a frame
  (c) => { const [cx, cy] = [606, 36]; c.ring(cx, cy, 12, "T"); c.ring(cx, cy, 9, "q"); c.poly([cx, cy - 17, cx + 3, cy, cx, cy + 17, cx - 3, cy], "T"); c.poly([cx - 17, cy, cx, cy - 3, cx + 17, cy, cx, cy + 3], "q"); c.poly([cx, cy - 17, cx + 3, cy, cx, cy], "s"); c.text(cx - 1, cy - 26, "N", "T") },
  // aged edges over everything, land and sea: two dithered steps darker towards the border
  (c) => {
    const e = (x, y) => Math.min(x, y, MW - 1 - x, MH - 1 - y), b = (x, y) => BAYER[(y & 7) * 8 + (x & 7)] / 64
    const AGE = { l: "Q", Q: "q", q: "T", P: "p", p: "Z", Z: "z", G: "g", h: "G", T: "t", s: "R" }
    c.recolor(AGE, (x, y) => e(x, y) < 18 + b(x, y) * 10); c.recolor(AGE, (x, y) => e(x, y) < 6 + b(x, y) * 6)
  },
  box(0, 0, MW, MH, "T"), box(3, 3, MW - 6, MH - 6, "q"),
)

// ------------------------------------------------------------------ attribute icons (shown 9-11 px tall: kept at native size)
sprite("i_glaive", { outline: "k" }, `
  .........JJ
  ........JJj
  .......JJj.
  ......JJj..
  .....JJj...
  ..n.JJj....
  ...nJj.....
  ...BnB.....
  ..xB.Bn....
  .xx........`)
sprite("i_cheval", { outline: "k" }, `
  ....x.x.....
  ...wXxXx....
  ..wwXXXXx...
  .wwXXkXXXx..
  .wwXXXXXXXx.
  wwXXXXxXXXXx
  wwXXXx..xXXx
  wXXXx....xx.
  wXXXx.......
  xXXXXx......`)
sprite("i_arc", { outline: "k" }, `
  ..xW.......
  .xW..J.....
  .xW...J....
  xW.....J...
  xWxxxxxxJJ.
  xW.....J...
  .xW...J....
  .xW..J.....
  ..xW.......`)
sprite("i_dolabra", { outline: "k" }, `
  ...JJ.......
  ..JjjJ......
  jJjjjjxJJJj.
  ..JjjJx.....
  ...JJ.x.....
  ......x.....
  ......x.....
  ......x.....
  ......x.....
  ......W.....`)
