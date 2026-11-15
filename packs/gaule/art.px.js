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
const terrain = (name, ...items) => scene("t_" + name, { w: TW, h: TH }, ...items)
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
  c.rect(x0, y, x1 - x0, h, "m"); c.hline(x0, y, x1 - x0, "l")
  for (let r = 3; r < h; r += 3) c.hline(x0, y + r, x1 - x0, "M")                                            // bedding joints
  for (let r = 0; r < h; r += 3) for (let x = x0 + (r % 6 ? 3 : 0); x < x1; x += 6) c.vline(x, y + r + 1, 2, "M") // head joints
  for (let r = 1; r < h - 1; r += 3) for (let x = x0 + 2 + (r % 2) * 4; x < x1; x += 8) c.rect(x, y + r, 2, 2, "w") // beam ends
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
