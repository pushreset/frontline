// War of the Ring — heroes, monsters, orders, card back, icons and the initiative coin (parts prefixed _u2).
// Same style rules as packs/gaule/art.px.js: one light from the top left, cast shadows fall right; hue-shifted
// ramps; outline k only around figures; three depths per picture; no filler speckle. Free Peoples face right,
// the Shadow faces left. c_<key> = the card's name, c_<key>_x = its enemy name (what the player sees for the Shadow).
// Original designs from the book's descriptions.
{
// Depth: the same figure further back, one step darker and cooler.
const BACK = { S: "s", s: "R", R: "r", N: "n", n: "B", B: "b", Y: "y", y: "O", F: "f", f: "E", E: "e", J: "j", j: "I", I: "i", X: "x", x: "W", W: "w",
  H: "h", h: "G", G: "g", V: "v", v: "U", U: "u", Q: "q", q: "T", T: "t", l: "m", m: "M", M: "0", "*": ">", ">": "<" }
const unit = (name, build) => { scene("c_" + name, { w: CW, h: CH }, ...build(false)); scene("c_" + name + "_x", { w: CW, h: CH }, ...build(true)) }
const order = (name, ...items) => scene("c_" + name, { w: CW, h: CH }, ...items)
// stamp a part facing right (free) or left (x): the part's width is needed to keep it in place when flipped
const face = (name, x, y, w, left, opts = {}) => stamp(name, left ? CW - x - w : x, y, { ...opts, ...(left ? { flip: "x" } : {}) })
const mirX = (left, x, w = 0) => left ? CW - x - w : x

// ------------------------------------------------------------------ horse (same build as the Gaul pack)
const horse = (name, coat = "Wxx", hair = "w", cloth = "Rsn") => sprite(name, { w: 50, h: 32, outline: "k" }, (c) => {
  const [D, B, L] = coat
  c.line(13, 18, 6, 24, D, 2); c.line(6, 24, 1, 27, D, 2)
  c.line(34, 18, 39, 23, D, 2); c.line(39, 23, 38, 28, D, 2)
  c.line(10, 18, 13, 25, B, 3); c.line(13, 25, 9, 29, B, 2)
  c.line(32, 18, 40, 20, B, 3); c.line(40, 20, 47, 23, B, 2)
  for (const [x, y] of [[0, 27], [8, 29], [37, 28], [47, 23]]) c.rect(x, y, 2, 2, "w")
  c.ellipse(22, 14, 13, 6, B); c.circ(11, 13, 6, B); c.circ(32, 14, 5, B)
  c.poly([28, 12, 34, 3, 40, 1, 41, 10, 36, 17], B)
  const inE = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1
  c.shade((x, y) => c.is(x, y, B) && !inE(x, y, 21, 12, 13, 5.5) && !inE(x, y, 10.5, 11.5, 5.5, 5.5) && !inE(x, y, 32, 12.5, 4.5, 4.5) && y > 9, 1)
  c.light((x, y) => c.is(x, y, B) && (inE(x, y, 19, 10.5, 9, 2.5) || inE(x, y, 9.5, 10, 3.5, 3) || inE(x, y, 31, 11, 2.5, 2.5) || inE(x, y, 36, 5, 2.5, 3.5) || inE(x, y, 42, 3.5, 2, 1.5)), 1)
  for (const [x, y] of [[29, 9], [28, 10], [28, 11], [28, 12], [29, 13], [29, 14]]) c.px(x, y, D)
  for (const [x, y] of [[15, 10], [16, 11], [16, 12], [15, 13], [14, 14]]) c.px(x, y, D)
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
  c.line(34, 5, 38, 1, hair, 2); c.line(31, 8, 35, 4, hair, 2); c.px(30, 10, hair); c.px(39, 1, hair)
  c.line(5, 10, 1, 13, hair, 2); c.line(1, 13, 0, 19, hair, 2); c.px(2, 11, hair)
  c.line(31, 10, 34, 17, "W"); c.rect(17, 8, 10, 6, cloth[0]); c.hline(17, 13, 10, cloth[2]); c.hline(17, 8, 10, cloth[1])
})
horse("_u2horse_black", "uUv", "k", "uUi")
horse("_u2horse_grey", "MmJ", "M", "gGn")
horse("_u2horse_bay", "Wxx", "w", "gGn")

// ------------------------------------------------------------------ the Nazgûl
// A Ringwraith in the saddle, facing right: a black hooded cloak streaming back, nothing inside the hood.
sprite("_u2wraith", { outline: "k" }, `
  ........uUU.........
  .......uUvUU........
  ......uUvVvU........
  ......uUvvkkU.......
  .....uUvvkkkk.......
  .....uUvvkkkU.......
  .....uUvvUkU........
  ...uuUUvvvUU........
  .uuUUUvvVvvvU.......
  uuUUUvvvVvvvUUi.....
  .uuUUUvvvvvvvUi.....
  ..uuuUUvvvvvUUi.....
  ...uuuUUvvvUU.......
  ....uuuUvvvU........
  ......uUvvvvU.......
  ........vvvvU.......
  .........vvvU.......
  .........vvU........
  .........UvU........
  .........UU.........
  .........iiI........
  .........iiii.......`)
// horse + wraith + a pale sword held out
sprite("_u2nazgul", { w: 64, h: 46 }, stamp("_u2horse_black", 0, 13), stamp("_u2wraith", 12, 1),
  line(27, 11, 40, 3, "j"), line(28, 11, 41, 3, "J"), px(42, 2, "J"))

// The fell beast: "a naked thing, no feather or quill, its pinions webs of hide between horned fingers", a long
// neck, a hooked beak, talons. Facing right. rider: a Ringwraith hunched at the base of the neck.
// wing(c, shoulder x, shoulder y, scale, flipY, membrane, bone): a bat wing raised up and back, fingers fanned
const wing = (c, sx, sy, s, fy, mem, bone) => {
  const P = ([x, y]) => [Math.round(sx + (x - 56) * s), Math.round(sy + (y - 38) * s * (fy ? -1 : 1))], F = (pts) => pts.flatMap((p) => P(p))
  const S = [56, 38], E = [68, 20], W = [62, 1], T = [[40, -6], [16, 1], [3, 18]]
  c.poly(F([S, E, W, T[0], [36, 3], [30, 6], [24, 5], T[1], [17, 8], [16, 13], [11, 17], T[2], [13, 25], [22, 28], [29, 33], [36, 41]]), mem)
  // the webs between the fingers catch the light in turn: lit near the arm, darker towards the flank
  c.light(F([W, T[0], [30, 6], T[1]]), 1); c.shade(F([T[2], [13, 25], [22, 28], [29, 33], [36, 41], [34, 34], [24, 24]]), 1)
  for (const t of T) c.line(...P(W), ...P(t), bone)
  c.line(...P(S), ...P(E), bone, 2); c.line(...P(E), ...P(W), bone, 2); c.line(...P([62, 1]), ...P([64, -2]), "m")
}
const fell = (name, rider = true) => sprite(name, { w: 100, h: 66, outline: "k" },
  layer("far wing", { y: 6 }, (c) => wing(c, 50, 40, 0.55, true, "r", "0")),
  layer("body", { y: 6 }, (c) => {
    c.line(36, 44, 18, 50, "0", 3); c.line(18, 50, 4, 49, "0", 2); c.poly([0, 46, 6, 48, 1, 53], "0")      // tail and its barb
    c.line(44, 46, 38, 53, "0", 2); c.line(38, 53, 33, 56, "0"); c.line(53, 46, 48, 54, "0", 2); c.line(48, 54, 44, 57, "0")
    c.ellipse(48, 42, 16, 6, "0"); c.circ(60, 40, 6, "0")
    c.line(63, 38, 72, 30, "0", 5); c.line(72, 30, 80, 25, "0", 4)
    c.poly([77, 21, 88, 20, 95, 23, 98, 28, 94, 27, 88, 28, 82, 30, 77, 29], "0")                      // head, beak hooked down
    c.poly([91, 22, 98, 26, 97, 31, 93, 27], "M"); c.px(86, 22, "D"); c.px(85, 22, "S")
    c.line(78, 20, 73, 16, "M"); c.line(82, 20, 79, 15, "M")                                                // horns
    c.light((x, y) => c.is(x, y, "0") && (((x - 48) / 14) ** 2 + ((y - 38.5) / 2.5) ** 2 < 1 || (x > 64 && x < 92 && y < 24 + Math.max(0, 76 - x) * 0.7)), 1)
    c.shade((x, y) => c.is(x, y, "0") && y > 45 && x > 30, 1)
    for (const [x, y] of [[32, 57], [34, 58], [43, 58], [45, 59]]) c.px(x, y, "m")
  }),
  layer("near wing", { y: 6 }, (c) => { wing(c, 58, 40, 1, false, "R", "M"); c.light((x, y) => c.is(x, y, "R") && y < 10 && x > 34, 1) }),
  ...(rider ? [layer("rider", { y: 6 }, (c) => {
    c.poly([62, 38, 63, 28, 66, 23, 70, 23, 72, 27, 72, 33, 69, 39], "u"); c.poly([63, 30, 66, 24, 68, 24, 65, 33], "U")
    c.px(70, 25, "k"); c.px(71, 26, "k"); c.px(70, 26, "k"); c.line(56, 32, 63, 30, "u", 2); c.line(51, 34, 56, 32, "U")  // cloak flying back
    c.line(71, 32, 78, 36, "i"); c.circ(79, 37, 1, "I")                                                     // a mace
  })] : []))
fell("_u2fell"); fell("_u2fell_bare", false)

// ------------------------------------------------------------------ scenery helpers
// cold fog banks: dithered pale bands that lighten whatever is under them
const fog = (y, h, dens = 0.5) => layer("fog", { light: 1, density: dens }, rect(0, y, CW, h, "?"))
// fog wisps: long soft banks, a solid core and a dithered fringe
const wisps = (list, k = "3", K = "4") => [layer("wisp-fringe", { density: 0.3 }, ...list.map(([x, y, w]) => ellipse(x, y, w, 3, k))), layer("wisp-core", { density: 0.5 }, ...list.map(([x, y, w]) => ellipse(x, y, w - 5, 1, K)))]
// Mordor: an ash sky glowing low, a ragged land of slag and dead ground
const ashSky = (h = 56) => vgrad(0, 0, CW, h, ";;-:7", 1, 2)
// dark smoke drifting right, lit from below by the fires
const darkSmoke = (x, y, n = 6) => (c) => { for (let i = 0; i < n; i++) { const r = 1 + Math.floor(i / 2), cx = x + Math.round(i * i * 0.35), cy = y - i * 3; c.circ(cx, cy, r, "0"); if (r > 1) c.circ(cx - 1, cy + 1, r - 1, i < 2 ? "7" : "M") } }
const ruinTower = (x, y, w, h, k = "0") => (c) => {
  c.rect(x, y, w, h, k); for (let i = 0; i < w; i += 2) c.vline(x + i, y - 1 - (i * 7 % 3), 1 + (i * 7 % 3), k)
  c.rect(x + 1, y + 3, 1, 2, ";"); c.rect(x + w - 2, y + 6, 1, 2, ";")
}
const deadTree = (x, y, h, k = "w") => (c) => {
  c.line(x, y, x, y - h, k, 2); c.line(x, y - h * 0.5, x - 5, y - h * 0.8, k); c.line(x, y - h * 0.7, x + 4, y - h, k); c.line(x - 3, y - h * 0.65, x - 4, y - h * 0.95, k)
}
unit("nazgul", (left) => left ? [
  // a winged shadow over a ruined land
  ashSky(58), (c) => { for (let x = 0; x < CW; x++) { const h = Math.round(46 - 3 * Math.sin(x / 13) - 2 * Math.sin(x / 5)); c.vline(x, h, 60 - h, "-") } },
  ruinTower(14, 30, 6, 30, "-"), ruinTower(96, 26, 8, 34, "-"), ruinTower(104, 34, 5, 26, "-"),
  vgrad(0, 52, CW, 28, "-0t", 1, 3), hline(0, 52, CW, ":"),
  // slag heaps lit on their left flank by the glow, the broken stumps of a wall
  (c) => { for (const [x, y, w, h] of [[2, 66, 26, 5], [40, 60, 16, 3], [80, 68, 30, 6], [104, 58, 14, 3]]) { c.ellipse(x + w / 2, y, w / 2, h, "0"); c.recolor({ 0: "t" }, [x + w / 2, y - h, w, 2 * h + 1]); c.rect(x, y + 1, w + 1, h + 1, "t") } },
  ruinTower(60, 44, 5, 12, "0"), ruinTower(116, 46, 7, 14, "0"),
  layer("shadow", { shade: true }, ellipse(56, 73, 20, 2, "k")),
  face("_u2fell", 14, -4, 102, true),
] : [
  // riders in a cold fog on a bare heath
  vgrad(0, 0, CW, 54, "v1+2=3", 1, 3),
  hills(40, 4, "V", 3, 60), hills(46, 3, "%", 9, 60), hills(50, 2, "&", 2, 60),
  vgrad(0, 52, CW, 28, "&GGg", 1, 3),
  hills(53, 2, "6", 4, 58), hills(51, 1, "3", 4, 52), deadTree(14, 54, 18, "&"), deadTree(116, 52, 14, "&"),
  layer("shadow", { shade: true }, shadowAt(66, 77, 40), shadowAt(14, 69, 34)),
  stamp("_u2nazgul", 4, 23, { swap: BACK }),
  stamp("_u2nazgul", 52, 31),
  hills(76, 2, "6", 6, 80), hills(75, 1, "3", 6, 76), (c) => { for (const [x, y, w] of [[6, 70, 16], [96, 68, 22], [40, 72, 12]]) { c.hline(x, y, w, "3"); c.hline(x + 3, y - 1, w - 6, "4") } },
])

// ------------------------------------------------------------------ cave trolls
// A cave troll, facing right: twice a man, hunched, grey hide like stone, a small head thrust forward, a tree-root
// club over the shoulder, the other arm hanging to the knee.
sprite("_u2troll", { w: 60, h: 64, outline: "k" }, (c) => {
  const limb = (pts, w, k = "M") => { for (let i = 0; i < pts.length - 1; i++) c.line(...pts[i], ...pts[i + 1], "0", w + 2); for (let i = 0; i < pts.length - 1; i++) c.line(...pts[i], ...pts[i + 1], k, w) }
  c.line(42, 33, 30, 14, "x", 3); c.line(30, 14, 16, 4, "x", 5); c.circ(14, 3, 3, "x"); c.line(29, 12, 15, 2, "X")    // club over the shoulder
  for (const [x, y] of [[20, 4], [24, 9], [12, 6]]) c.px(x, y, "w")
  limb([[22, 28], [15, 40], [13, 50]], 5, "0"); c.circ(13, 52, 3, "0")                                              // far arm, in shadow
  limb([[27, 45], [23, 53], [22, 59]], 6); limb([[38, 45], [42, 53], [43, 59]], 6)                                   // legs, bowed
  c.ellipse(21, 61, 6, 2, "M"); c.ellipse(45, 61, 6, 2, "M")
  c.ellipse(32, 36, 13, 12, "M"); c.circ(28, 22, 10, "M"); c.ellipse(35, 42, 10, 6, "M")                            // trunk, hump
  c.circ(47, 27, 7, "0"); c.circ(47, 27, 6, "M"); c.rect(45, 29, 9, 5, "M"); c.hline(45, 34, 9, "0")                 // head thrust forward, heavy jaw
  c.light((x, y) => c.is(x, y, "M") && (x - 26) ** 2 + (y - 18) ** 2 < 60, 1)
  c.shade((x, y) => c.is(x, y, "M") && (x - 30) + (y - 30) * 0.9 > 16, 1)
  c.line(42, 22, 52, 23, "0"); c.px(50, 25, "y"); c.px(54, 27, "0"); c.hline(47, 32, 6, "0"); c.px(48, 31, "l"); c.px(52, 31, "l")
  for (const [x0, y0, w] of [[30, 41, 8], [32, 45, 7], [22, 32, 5]]) c.hline(x0, y0, w, "0")                         // folds of hide
  c.poly([24, 45, 45, 45, 43, 53, 35, 50, 27, 53], "W"); c.hline(24, 45, 21, "x")                                   // loincloth
  limb([[35, 27], [38, 40], [42, 34]], 5); c.circ(42, 33, 4, "0"); c.circ(42, 33, 3, "M"); c.px(41, 32, "m"); c.line(42, 33, 38, 26, "x", 2)       // near arm and fist
  c.light((x, y) => c.is(x, y, "M") && x > 32 && x < 37 && y > 26 && y < 36, 1)
  for (const [x, y] of [[17, 62], [20, 63], [43, 63], [47, 63], [49, 62]]) c.px(x, y, "l")                            // toenails
})
// cavern: rough walls, a torch on a pillar, stalactites, a stone floor of fallen slabs
const cavern = (left) => [
  rect(0, 0, CW, CH, "w"),
  (c) => { const r = c.rng(5); for (let x = 0; x < CW; x += 3 + Math.floor(r() * 5)) { const h = 3 + Math.floor(r() * 9); c.poly([x, 0, x + 4, 0, x + 2, h], "t") } },
  ...[mirX(left, 4, 14), mirX(left, 104, 14)].map((x) => (c) => { c.rect(x, 0, 14, 62, "t"); c.rect(x + 1, 0, 4, 62, "T"); c.vline(x + 13, 0, 62, "k"); for (let y = 6; y < 62; y += 9) { c.hline(x, y, 14, "w"); c.hline(x + 1, y + 1, 4, "q") } }),
  vgrad(0, 58, CW, 22, "tTt", 1, 3), hline(0, 58, CW, "q"),
  (c) => { for (const [x, y, w] of [[8, 66, 20], [50, 62, 24], [92, 70, 26], [30, 75, 18]]) { c.hline(x, y, w, "q"); c.hline(x, y + 1, w, "w") } },
  rect(mirX(left, 20, 3), 26, 3, 6, "w"), circ(mirX(left, 21, 1), 23, 2, "D"), circ(mirX(left, 21, 1), 23, 1, "L"), px(mirX(left, 21, 1), 21, "K"),
  glow("DLK", { r: 34, strength: 0.55 }),
]
unit("trolls", (left) => left ? [
  // a battlefield at dusk, smoke over it, the trolls wading in
  vgrad(0, 0, CW, 54, "v-789", 1, 3), hills(42, 3, "7", 11, 60), hills(48, 3, "&", 12, 60), darkSmoke(20, 44, 8), darkSmoke(96, 46, 7),
  vgrad(0, 52, CW, 28, "Tt", 1, 3), hline(0, 52, CW, "q"),
  (c) => { for (const [x, y] of [[10, 70], [56, 74], [92, 66], [116, 76]]) { c.line(x, y, x + 9, y - 3, "x"); c.px(x + 10, y - 4, "J") } },   // broken spears
  layer("shadow", { shade: true }, shadowAt(4, 79, 40), shadowAt(66, 76, 34)),
  face("_u2troll", 66, 12, 62, true, { swap: BACK }),
  face("_u2troll", 16, 16, 62, true),
] : [
  ...cavern(false),
  layer("shadow", { shade: true }, shadowAt(66, 75, 34), shadowAt(22, 79, 40)),
  stamp("_u2troll", 64, 10, { swap: BACK }),
  stamp("_u2troll", 18, 15),
])

// ------------------------------------------------------------------ the mûmak
// A Gondor soldier, small (for a line being crushed): silver helm, black surcoat, the white tree.
sprite("_u2gsold", { outline: "k" }, `
  ..JJ..
  .JjjI.
  .jFFI.
  IuuuuJ
  IuJuuJ
  IuuuuJ
  .uuuu.
  .u..u.
  .i..i.`)
// War elephant of the Harad, facing right: four tusks, ears like sails, a war tower of timber on its back draped in
// red and gold, Haradrim archers in red with gold helms on the platform.
sprite("_u2mumak", { w: 90, h: 64, outline: "k" }, (c) => {
  c.poly([24, 40, 31, 40, 30, 58, 32, 61, 23, 61, 25, 58], "t"); c.poly([55, 42, 62, 42, 61, 58, 63, 61, 54, 61, 56, 58], "t")                                           // far legs
  c.ellipse(42, 34, 26, 15, "T"); c.circ(20, 32, 12, "T"); c.circ(66, 28, 11, "T"); c.circ(62, 22, 7, "T")
  c.poly([15, 42, 24, 42, 23, 58, 25, 62, 13, 62, 16, 58], "T"); c.poly([47, 44, 56, 44, 55, 58, 57, 62, 45, 62, 48, 58], "T")                                          // near legs
  c.line(74, 28, 79, 42, "T", 7); c.line(79, 42, 81, 52, "T", 5); c.line(81, 52, 85, 57, "T", 3); c.line(85, 57, 88, 55, "T", 2)   // trunk, curled at the tip
  c.light((x, y) => c.is(x, y, "T") && (((x - 34) / 22) ** 2 + ((y - 26) / 8) ** 2 < 1 || (x - 62) ** 2 + (y - 20) ** 2 < 40 || (x - 18) ** 2 + (y - 27) ** 2 < 40), 1)
  c.shade((x, y) => c.is(x, y, "T") && y > 40 && x > 20 && x < 70 && !(x >= 15 && x < 24) && !(x >= 47 && x < 56), 1)
  c.shade((x, y) => c.is(x, y, "T") && ((x >= 21 && x < 24) || (x >= 53 && x < 56)) && y > 42, 1)
  for (let y = 46; y < 62; y += 4) { c.hline(16, y, 6, "t"); c.hline(48, y, 6, "t") }              // wrinkles
  for (let y = 36; y < 54; y += 4) c.px(79 + Math.round((y - 36) / 4), y, "t")
  for (const x of [14, 17, 20, 46, 49, 52]) c.rect(x, 61, 2, 1, "Q")                                                  // toenails
  c.ellipse(57, 31, 8, 12, "k"); c.ellipse(57, 31, 7, 11, "t"); c.ellipse(56, 29, 5, 8, "T"); c.ellipse(55, 27, 3, 4, "q"); for (let y = 36; y < 42; y += 2) c.px(58 + (y % 4), y, "T")   // ear, a ragged sail
  c.px(68, 25, "k"); c.px(69, 25, "k"); c.line(66, 23, 70, 23, "t")
  // four tusks, sweeping forward and up, the upper pair longer
  for (let i = 0; i <= 16; i++) { const t = i / 16; c.px(Math.round(72 + t * 16), Math.round(37 + Math.sin(t * 2.4) * 6 - t * 6), t < 0.9 ? "l" : "5"); c.px(Math.round(72 + t * 16), Math.round(38 + Math.sin(t * 2.4) * 6 - t * 6), "m") }
  for (let i = 0; i <= 10; i++) { const t = i / 10; c.px(Math.round(70 + t * 10), Math.round(40 + Math.sin(t * 2.4) * 5 - t * 4), "l"); c.px(Math.round(70 + t * 10), Math.round(41 + Math.sin(t * 2.4) * 5 - t * 4), "M") }
  // saddle cloth and the tower
  c.poly([26, 18, 58, 18, 60, 34, 52, 38, 40, 34, 30, 38, 24, 34], "s"); c.poly([26, 18, 40, 18, 40, 34, 30, 38, 24, 34], "S")
  c.line(24, 34, 30, 38, "n"); c.line(30, 38, 40, 34, "n"); c.line(40, 34, 52, 38, "n"); c.line(52, 38, 60, 34, "n")
  for (const [x, y] of [[30, 26], [42, 24], [52, 27]]) { c.px(x, y, "N"); c.px(x - 1, y + 1, "n"); c.px(x + 1, y + 1, "n"); c.px(x, y + 2, "n") }
  c.rect(26, 14, 32, 4, "x"); c.hline(26, 14, 32, "X")                                              // platform
  c.rect(28, 3, 28, 11, "W"); for (let x = 30; x < 56; x += 4) c.vline(x, 3, 11, "x"); c.rect(28, 3, 3, 11, "X")
  for (let x = 28; x < 56; x += 4) c.rect(x, 1, 2, 2, "W")                                           // crenels
  c.hline(28, 8, 28, "n")
})
// Haradrim archers on the tower: red robes, gold helms, bows drawn (added over the beast, before the outline pass)
const harad = (x, y) => (c) => { for (const dx of [4, 12, 20]) { c.rect(x + dx, y - 3, 3, 3, "s"); c.px(x + dx + 1, y - 4, "F"); c.rect(x + dx, y - 6, 3, 2, "n"); c.px(x + dx + 1, y - 7, "N"); c.line(x + dx + 4, y - 7, x + dx + 5, y - 1, "w") } }
sprite("_u2mumak_full", { w: 92, h: 72, outline: "k" }, stamp("_u2mumak", 0, 6), harad(29, 8))
unit("mumak", (left) => left ? [
  // a line of Gondor crushed under it, dust rising
  sky(CW, 50, "+2=3~49"), hills(40, 3, "6", 14, 60), hills(46, 2, "%", 15, 60), ...meadow(50, CW, 30, 14, 40),
  layer("dust", dust([[20, 64, 6], [34, 70, 5], [96, 72, 5], [110, 66, 4]])),
  layer("shadow", { shade: true }, poly([20, 74, 110, 74, 116, 79, 26, 79], "k")),
  stamp("_u2gsold", 16, 66, { rot: 90 }), stamp("_u2gsold", 94, 68, { rot: 270 }), stamp("_u2gsold", 108, 62),
  line(6, 74, 18, 66, "x"), px(18, 65, "J"), line(100, 76, 112, 74, "x"),
  face("_u2mumak_full", 14, 6, 94, true),
  stamp("_u2gsold", 4, 64), stamp("_u2gsold", 118, 64, { flip: "x" }),
] : [
  sky(CW, 50, "+2=3~49"), stamp("_cloud_b", 12, 8), hills(40, 3, "6", 16, 60), treeline(48, 2, "%", "&", 17), ...meadow(50, CW, 30, 16, 50),
  layer("shadow", { shade: true }, poly([18, 74, 104, 74, 112, 79, 24, 79], "k")),
  stamp("_u2mumak_full", 16, 6),
])

// ------------------------------------------------------------------ the Witch-king
// The Lord of the Nazgûl: the hooded rider, a crown floating over the empty hood, a spiked mace raised.
sprite("_u2witch", { w: 66, h: 54 },
  stamp("_u2horse_black", 0, 21), stamp("_u2wraith", 12, 9),
  // the crown, hovering one pixel above the hood
  grid(18, 4, ".n.N.n.\n.nNNNn.\nBnNnNnB\n.BBBBB."),
  line(27, 20, 36, 7, "x"), line(28, 20, 37, 7, "W"),
  circ(38, 5, 3, "k"), circ(38, 5, 2, "i"), px(37, 4, "j"), px(38, 1, "I"), px(42, 5, "I"), px(34, 5, "I"), px(41, 2, "I"), px(35, 2, "I"),
)
// night over a burning land
const nightFire = (seed) => [
  vgrad(0, 0, CW, 56, "uUv-:", 1, 3),
  hills(44, 3, "u", seed, 60), (c) => { for (const [x, h] of [[18, 6], [52, 8], [98, 5]]) { c.poly([x - 4, 46, x, 46 - h, x + 4, 46], "D"); c.poly([x - 2, 46, x, 46 - h / 2, x + 2, 46], "L") } },
  darkSmoke(18, 40, 8), darkSmoke(52, 38, 9), darkSmoke(98, 40, 7), glow("DL", { r: 10, strength: 0.4 }),
  vgrad(0, 50, CW, 30, "ugU", 1, 3), hline(0, 50, CW, "U"),
]
// The great gate of the city, broken: white stone, the doors burst inwards, fire in the gap
const brokenGate = (x0) => (c) => {
  c.rect(x0, 4, 40, 56, "m"); c.rect(x0, 4, 6, 56, "l"); c.rect(x0 + 34, 4, 6, 56, "M")
  for (let y = 8; y < 60; y += 5) { c.hline(x0, y, 40, "M"); for (let x = x0 + ((y / 5) % 2 ? 3 : 0); x < x0 + 40; x += 7) c.vline(x, y + 1, 4, "M") }
  c.rect(x0 + 8, 20, 24, 40, "k"); c.circ(x0 + 20, 20, 12, "k"); c.rect(x0 + 8, 20, 24, 2, "k")
  c.circ(x0 + 20, 22, 11, "D"); c.rect(x0 + 9, 22, 23, 38, "D"); c.circ(x0 + 20, 36, 7, "L"); c.rect(x0 + 13, 36, 15, 24, "L"); c.rect(x0 + 17, 42, 7, 18, "K")
  c.poly([x0 + 8, 30, x0 + 14, 34, x0 + 14, 60, x0 + 8, 60], "w"); c.poly([x0 + 32, 26, x0 + 25, 32, x0 + 25, 60, x0 + 32, 60], "w")   // doors hanging
  c.line(x0 + 9, 36, x0 + 13, 38, "i"); c.line(x0 + 26, 38, x0 + 31, 36, "i")
  c.poly([x0 - 2, 4, x0 + 6, 0, x0 + 14, 3, x0 + 22, -1, x0 + 30, 2, x0 + 42, 0, x0 + 42, 4], "m")
}
unit("roi_sorcier", (left) => left ? [
  vgrad(0, 0, CW, 56, "uUv-:", 1, 3), darkSmoke(30, 40, 9),
  hills(48, 2, "u", 21, 60), vgrad(0, 52, CW, 28, "0Mt", 1, 3), hline(0, 52, CW, "m"),
  brokenGate(6), glow("DLK", { r: 22, strength: 0.6 }),
  (c) => { for (const [x, y, w] of [[2, 66, 10], [50, 62, 8], [24, 72, 14]]) { c.rect(x, y, w, 3, "m"); c.hline(x, y, w, "l"); c.hline(x, y + 3, w, "0") } },   // rubble of the gate
  layer("shadow", { shade: true }, shadowAt(70, 77, 40)),
  face("_u2witch", 46, 25, 66, true),
] : [
  ...nightFire(23),
  layer("shadow", { shade: true }, shadowAt(40, 77, 40)),
  stamp("_u2witch", 32, 25),
])

// ------------------------------------------------------------------ the Balrog
// "A great shadow, in the middle of which was a dark form, of man-shape maybe, yet greater; and a power and terror
// seemed to be in it and to go before it": wings of shadow, a mane of fire, a sword of flame, a whip of many thongs.
sprite("_u2balrog", { w: 80, h: 70, outline: "k" }, (c) => {
  // wings of shadow, spread wide, ragged
  c.poly([30, 24, 14, 2, 0, 0, 6, 10, 2, 16, 10, 20, 4, 28, 14, 30, 8, 38, 26, 36], "u")
  c.poly([46, 22, 60, 6, 76, 0, 72, 10, 79, 14, 70, 20, 78, 26, 66, 28, 72, 36, 50, 34], "u")
  for (const [x, y] of [[14, 2], [6, 12], [8, 26], [60, 6], [72, 12], [70, 26]]) c.line(38, 28, x, y, "U")
  // legs, standing wide on the bridge
  c.line(33, 46, 27, 60, ";", 7); c.line(27, 60, 25, 68, ";", 5); c.line(43, 46, 49, 60, ";", 7); c.line(49, 60, 51, 68, ";", 5)
  // a massive torso, broad in the shoulder, a small horned head sunk between them
  c.poly([25, 18, 52, 18, 50, 28, 45, 46, 31, 46, 27, 28], ";"); c.circ(27, 21, 4, ";"); c.circ(50, 21, 4, ";")
  c.circ(39, 14, 5, ";"); c.poly([35, 12, 26, 3, 28, 1, 37, 9], "-"); c.poly([43, 10, 50, 0, 53, 2, 45, 12], "-")
  // arms: near arm raising the sword of flame forward, far arm swinging the whip back
  c.line(50, 22, 56, 31, ";", 6); c.line(56, 31, 61, 22, ";", 5)
  c.line(27, 22, 21, 32, "k", 5); c.line(21, 32, 16, 40, "k", 4)
  // rim light on the edges turned to its own fire
  c.light((x, y) => c.is(x, y, ";") && (!c.is(x - 1, y, ";") || !c.is(x, y - 1, ";")), 1)
  // fire: cracks across the chest, molten eyes, a mane streaming back from head and shoulders, burning feet
  for (const [x0, y0, x1, y1] of [[33, 26, 39, 32], [39, 32, 36, 42], [43, 25, 46, 31], [36, 36, 32, 44], [41, 38, 44, 44]]) c.line(x0, y0, x1, y1, "D")
  c.line(39, 13, 41, 14, "K"); c.px(43, 13, "L")
  c.poly([36, 10, 22, 2, 28, 12, 14, 10, 24, 18, 10, 22, 26, 24, 30, 20], "D"); c.poly([36, 12, 26, 6, 30, 14, 20, 14, 30, 19], "L"); c.px(29, 10, "K"); c.px(27, 15, "K"); c.px(32, 12, "K")
  c.poly([19, 68, 23, 61, 25, 65, 28, 59, 31, 68], "D"); c.poly([45, 68, 49, 61, 51, 65, 54, 59, 57, 68], "D"); c.px(24, 66, "L"); c.px(27, 64, "K"); c.px(50, 66, "L"); c.px(53, 64, "K")
  // sword of flame, raised forward
  c.line(61, 22, 73, 4, "D", 3); c.line(61, 22, 73, 4, "L"); c.line(62, 19, 71, 6, "K"); c.hline(58, 22, 6, "B")
  // whip of many thongs trailing back and down
  for (const [dx, dy] of [[0, 0], [2, 3], [4, 6]]) { c.line(16, 40, 8 + dx, 48 + dy, "D"); c.line(8 + dx, 48 + dy, 2 + dx * 2, 60 + dy, "L") }
})
// Khazad-dûm: rows of pillars fading into the dark, a narrow bridge without kerb or rail over the chasm, fire below
const deep = (left) => [
  rect(0, 0, CW, CH, "k"),
  (c) => { for (let i = 0; i < 6; i++) { const x = 6 + i * 22, k = i % 2 ? ";" : "-"; c.rect(x, 0, 6, 52, ";"); c.vline(x + (left ? 4 : 1), 0, 52, "-") } },
  vgrad(0, 56, CW, 24, "k;rRsD", 1, 3),
  (c) => { const r = c.rng(3); for (let i = 0; i < 18; i++) { const x = Math.floor(r() * CW), y = 66 + Math.floor(r() * 12); c.px(x, y, "L") } },   // sparks rising from the fire below
  (c) => { for (let x = 0; x < CW; x++) { const y = Math.round(66 + ((x - 64) / 64) ** 2 * 4); c.vline(x, y, 3, "M"); c.px(x, y, "m"); c.px(x, y + 3, "0") } },   // the bridge
  glow("L", { r: 8, strength: 0.4, where: [0, 60, CW, 20] }),
]
unit("balrog", (left) => [
  ...deep(left),
  face("_u2balrog", 26, 0, 82, left),
  glow("LK", { r: 12, strength: 0.35, where: [0, 0, CW, 66] }),
])

// ------------------------------------------------------------------ Aragorn
// The ranger-king, facing right: dark hair, a weathered green cloak over mail, the black surcoat with the white tree,
// Andúril raised. The blade and the banner are drawn by the scene.
sprite("_u2aragorn", { outline: "k" }, `
  ........www.........
  .......wwwww........
  ......wwwFFFw.......
  ......wwFFkFF.......
  ......wwfFFFFF......
  ......wwfFFFF.......
  .......wwEfFE.......
  ........wEEE....ff..
  ......GgjJjjj..fF...
  .....GhIjJjjjIfF....
  ....GhhIuuuuuIf.....
  ....GhhIu?u?uI......
  ....GhhIuu?uuI......
  ....GhhIuu?uuI......
  ....GhhIu???uI......
  ....GhhIuuuuuI......
  ....GhhWWnWWWW......
  ....GhhIuuuuuI......
  ...GhhhIuuuuuuI.....
  ...GhhhIuuuuuuI.....
  ...GhhhIuuuuuuI.....
  ...GhhhIuuuuuuuI....
  ...GhhhIuuu.uuuI....
  ..GGhhhiIIi.iIIi....
  ..Ghhh.iIi...iIi....
  ..Ghh..iIi...iIi....
  ..Gh...iIi...iIi....
  .GG....iIi...iIi....
  .......xXW...xXW....
  .......xXW...xXW....
  ......xxXW..xxXW....
  ......WWWW..WWWWW...`)
// Andúril held up from the hand at (x, y): a long straight blade, a cold gleam
const anduril = (x, y, left) => (c) => { const d = left ? -1 : 1; c.line(x, y, x + 9 * d, y - 18, "J", 2); c.line(x, y, x + 9 * d, y - 18, "?"); c.line(x - 2 * d, y + 1, x + 2 * d, y - 1, "n"); c.px(x - d, y + 2, "B") }
// The banner of Elendil, black: the White Tree in flower, seven stars, a crown (the banner Arwen made)
const elendil = (x, y, h = 50) => (c) => {
  c.vline(x, y - h, h, "x"); c.vline(x + 1, y - h, h, "W"); c.hline(x - 1, y - h + 1, 22, "x")
  c.rect(x + 2, y - h + 2, 20, 24, "u"); c.rect(x + 2, y - h + 2, 3, 24, "U"); for (let i = 0; i < 20; i += 3) c.poly([x + 2 + i, y - h + 26, x + 5 + i, y - h + 26, x + 3 + i, y - h + 28], "u")
  const tx = x + 12, ty = y - h + 10
  c.vline(tx, ty, 12, "4"); c.line(tx, ty + 4, tx - 4, ty, "4"); c.line(tx, ty + 4, tx + 4, ty, "4"); c.line(tx, ty + 7, tx - 5, ty + 4, "4"); c.line(tx, ty + 7, tx + 5, ty + 4, "4"); c.hline(tx - 3, ty + 12, 7, "4")
  for (const [dx, dy] of [[-6, -4], [-3, -6], [0, -7], [3, -6], [6, -4], [-7, -1], [7, -1]]) c.px(tx + dx, ty + dy, "?")
}
unit("aragorn", (left) => [
  sky(CW, 54, "1+2=3~4"), stamp("_cloud_far", left ? 20 : 80, 22),
  hills(42, 3, "6", 31, 60), hills(48, 2, "%", 32, 60), ...meadow(52, CW, 28, 31, 50),
  // the host of the West behind: a line of helms and spears in the haze
  (c) => { for (let x = 2; x < 126; x += 4) { c.rect(x, 47, 3, 5, x % 8 ? "&" : "%"); c.px(x + 1, 46, "4"); c.line(x + 2, 46, x + 2, 39, "6") } },
  elendil(mirX(left, 26, 22), 72, 48),
  layer("shadow", { shade: true }, shadowAt(mirX(left, 58, 24), 78, 22)),
  face("_u2aragorn", 58, 44, 22, left),
  anduril(mirX(left, 74, 0), 51, left), glow("?", { r: 8, strength: 0.6, color: "#bfe6ff" }),
])

// ------------------------------------------------------------------ the Army of the Dead
// An oath-breaker, facing right: a pale helm with empty eyes, rags of mail, a ragged cloak, the legs fading into
// mist. Drawn in cold tones with a dark teal outline (no warm k: they are not of flesh).
sprite("_u2ghost", { outline: "Z" }, `
  .......!!!.........
  ......!PPP!........
  .....!PPPPP........
  .....!PZPZP........
  .....!PPPPP!.......
  ......PpZpP........
  .......PPP.........
  ....pPP!!!PPp......
  ...pPpP!P!PpPP.....
  ..pPppPP!PPppPPPP..
  .ppPppP!P!Ppp.!!!..
  pppPppPP!PPpp......
  .pp.ppP!P!Ppp......
  pp..ppPP!PPpp......
  p...ppPPPPPpp......
  ....pPPPPPPPp......
  ...pPPP.PPPPp......
  ...pPP...PPpp......
  ..pPp....PPp.......
  ..pp.....pp........
  .p.p....p.p........
  p...p..p...p.......`)
// a spear held level by the ghost stamped at (x, y)
const ghostSpear = (x, y, left) => (c) => { const d = left ? -1 : 1, x0 = left ? x + 21 - 6 : x + 6; c.line(x0, y + 11, x0 + 26 * d, y + 9, "P"); c.line(x0 + 26 * d, y + 9, x0 + 29 * d, y + 9, "!") }
unit("armee_morts", (left) => [
  // a black night over the river, the host of the Dead sweeping forward in a pale tide
  vgrad(0, 0, CW, 56, "uuUz", 1, 3), hills(44, 3, "z", 41, 60), hills(50, 2, "u", 42, 60),
  vgrad(0, 54, CW, 26, "zZz", 1, 3), hline(0, 54, CW, "Z"),
  (c) => { const r = c.rng(9); for (let i = 0; i < 40; i++) { const x = Math.floor(r() * CW), y = 56 + Math.floor(r() * 22); c.hline(x, y, 2 + Math.floor(r() * 5), y < 64 ? "Z" : "p") } },   // the river's ripples
  ...[[0, 28], [24, 26], [48, 29], [72, 27], [96, 28], [116, 26]].map(([x, y]) => face("_u2ghost", x, y, 21, left, { swap: { "!": "p", P: "Z", p: "z", Z: "u" } })),
  ...[[10, 38], [40, 36], [70, 39], [100, 37]].flatMap(([x, y]) => [face("_u2ghost", x, y, 21, left, { swap: { "!": "P", P: "p", p: "Z", Z: "z" } }), ghostSpear(mirX(left, x, 21), y, left)]),
  ...[[22, 50], [58, 52], [92, 49]].flatMap(([x, y]) => [face("_u2ghost", x, y, 21, left), ghostSpear(mirX(left, x, 21), y, left)]),
  // trailing mist behind the tide
  layer("mist", { density: 0.5 }, ...[[10, 72, 20], [52, 74, 26], [98, 72, 22]].map(([x, y, w]) => ellipse(mirX(left, x), y, w, 2, "p"))),
  glow("!", { r: 5, strength: 0.3, color: "#bfe6ff" }),
])

// ------------------------------------------------------------------ the Ents
// An Ent, facing right: fourteen feet of bark, legs like roots, a long head with a mossy beard, brown eyes with a green
// light in them, a crown of twigs and leaves; one arm swung up to strike.
sprite("_u2ent", { w: 46, h: 72, outline: "k" }, (c) => {
  const bark = (pts, w, k = "W") => { for (let i = 0; i < pts.length - 1; i++) c.line(...pts[i], ...pts[i + 1], k, w) }
  bark([[14, 30], [8, 42], [6, 52]], 4, "w"); bark([[6, 52], [2, 56]], 2, "w"); bark([[6, 52], [6, 58]], 2, "w")        // far arm hanging, twig fingers
  bark([[18, 48], [14, 60], [10, 70]], 6); bark([[26, 48], [28, 60], [32, 70]], 6)                                     // legs like roots
  c.line(10, 70, 4, 71, "W", 2); c.line(32, 70, 38, 71, "W", 2)
  c.poly([14, 22, 30, 22, 31, 40, 28, 52, 16, 52, 13, 40], "W")                                                         // trunk
  c.poly([16, 6, 26, 6, 28, 22, 14, 22], "W")                                                                            // long head
  for (const x of [16, 19, 23, 27]) c.vline(x, 24, 26, "w")                                                              // bark furrows
  c.light((x, y) => c.is(x, y, "W") && x < 19 + (y > 52 ? -4 : 0), 1)
  c.shade((x, y) => c.is(x, y, "W") && x > 28 && y > 20, 1)
  c.hline(18, 12, 3, "w"); c.hline(23, 12, 3, "w"); c.px(19, 13, "H"); c.px(24, 13, "H"); c.px(20, 13, "w"); c.px(25, 13, "w")   // deep-set eyes, green light
  c.px(22, 15, "w"); c.px(22, 16, "w")
  c.poly([16, 17, 28, 17, 27, 26, 24, 32, 22, 26, 19, 30, 17, 24], "A"); c.poly([17, 17, 22, 17, 21, 24, 19, 27, 18, 22], "c")   // mossy beard
  for (const [x, y] of [[18, 20], [21, 22], [25, 21], [24, 26]]) c.px(x, y, "C")
  for (const [x, y, r] of [[12, 4, 4], [20, 2, 5], [29, 4, 4], [34, 9, 3]]) { c.circ(x, y, r, "A"); c.circ(x - 1, y - 1, r - 2, "c"); c.px(x - 2, y - 2, "C") }   // crown of leaves
  c.line(16, 6, 12, 1, "w"); c.line(26, 6, 30, 1, "w")
  bark([[28, 26], [36, 18], [40, 6]], 5); bark([[40, 6], [38, 0]], 2); bark([[40, 6], [44, 2]], 2); bark([[40, 6], [45, 8]], 2)   // near arm raised to strike
  c.light((x, y) => c.is(x, y, "W") && y < 24 && x > 30 && x < 39, 1)
  for (const [x, y] of [[13, 34], [26, 44], [30, 30]]) { c.px(x, y, "c"); c.px(x + 1, y, "A") }                           // moss in the bark
})
// The stone wall of a ring-fortress: black courses, the top breaking under the blow, blocks flying
const breakWall = (x0, left) => (c) => {
  const X = (x) => left ? CW - 1 - x : x, top = (x) => 24 + Math.max(0, 12 - (x - x0)) * 2 + ((x * 7) % 4)
  for (let x = x0; x < CW; x++) { const t = top(x); c.vline(X(x), t, 66 - t, x < x0 + 3 ? "M" : "0"); c.px(X(x), t, "M") }
  for (let y = 28, k = 0; y < 66; y += 4, k++) for (let x = x0; x < CW; x++) if (y > top(x)) { c.px(X(x), y, "k"); if ((x + k * 5) % 10 === 0) c.vline(X(x), y + 1, 3, "k"); else if ((x + k * 5) % 10 === 1) c.vline(X(x), y + 1, 3, "M") }
  for (const [x, y, s] of [[x0 - 8, 16, 3], [x0 - 2, 8, 4], [x0 + 6, 12, 2], [x0 - 14, 28, 3], [x0 - 5, 58, 4], [x0 - 12, 62, 3]]) { const xx = left ? X(x) - s + 1 : x; c.rect(xx, y, s, s, "0"); c.hline(xx, y, s, "M"); c.vline(xx, y, s, "M") }
}
unit("ents", (left) => [
  sky(CW, 54, "+2=3~4"), stamp("_cloud_b", mirX(left, 10, 16), 8),
  hills(42, 3, "6", 51, 60), treeline(50, 3, "%", "&", 52), ...meadow(54, CW, 26, 51, 40),
  breakWall(92, left),
  layer("shadow", { shade: true }, shadowAt(mirX(left, 26, 22), 78, 22), shadowAt(mirX(left, 58, 26), 76, 26)),
  face("_u2ent", 6, 6, 48, left, { swap: BACK }),
  face("_u2ent", 46, 8, 48, left),
])

// ------------------------------------------------------------------ the Great Eagles
// A great eagle stooping, facing right: wings raised in a V, primaries spread like fingers, golden head, talons out.
sprite("_u2eagle", { w: 64, h: 34, mx: true, outline: "k" }, (c) => {
  c.poly([30, 9, 10, 2, 8, 6, 9, 12, 14, 16, 30, 20], "o")                                          // wing: flight feathers
  for (let i = 0; i < 5; i++) c.line(10, 4 + i * 2, i, 1 + i * 3, i % 2 ? "o" : "w", 2)            // primaries spread like fingers
  for (let x = 12; x < 30; x += 3) c.px(x, Math.round(16 + (x - 12) * 0.22), "_")                // notched trailing edge
  c.poly([30, 9, 10, 2, 9, 6, 16, 9, 30, 14], "O"); c.line(30, 9, 10, 2, "y"); c.line(26, 9, 14, 5, "Y")   // coverts, lit leading edge
  c.ellipse(32, 17, 5, 9, "O"); for (const y of [14, 18, 22]) { c.px(29, y, "o"); c.px(30, y + 1, "o") }   // body, barred breast
  c.light((x, y) => c.is(x, y, "O") && x < 30 && y < 14 && x > 26, 1)
  c.poly([28, 25, 32, 25, 32, 32, 25, 30], "O"); c.line(29, 26, 27, 30, "o"); c.line(31, 26, 30, 31, "o")   // tail fan
  c.line(29, 22, 28, 27, "y", 2); c.px(27, 28, "w"); c.px(29, 28, "w")                              // talons out
  c.circ(32, 6, 4, "Y"); c.circ(31, 5, 2, "N"); c.px(30, 6, "k"); c.poly([31, 8, 32, 8, 32, 12, 31, 11], "n"); c.px(31, 11, "w")   // golden head, hooked beak
})
const peaks = (y, keys, seed) => (c) => {
  const r = c.rng(seed)
  for (let x = -10; x < CW + 10; x += 18 + Math.floor(r() * 12)) {
    const h = 18 + Math.floor(r() * 16), w = 16 + Math.floor(r() * 10)
    c.poly([x - w, y, x, y - h, x + w, y], keys[1]); c.poly([x - w, y, x, y - h, x, y], keys[0])
    c.poly([x - 5, y - h + 6, x, y - h, x + 5, y - h + 6, x + 2, y - h + 8, x - 1, y - h + 5, x - 3, y - h + 8], "5"); c.poly([x, y - h, x + 5, y - h + 6, x + 2, y - h + 8], "4")
  }
}
unit("aigles", (left) => left ? [
  // fell beasts over Mordor
  ashSky(60), (c) => { for (let x = 0; x < CW; x++) { const h = Math.round(50 - 6 * Math.abs(Math.sin(x / 9)) - 3 * Math.sin(x / 4)); c.vline(x, h, 60 - h, ";") } },
  vgrad(0, 58, CW, 22, "-0t", 1, 3), hline(0, 58, CW, ":"),
  ...[[88, 10], [104, 22], [70, 6]].map(([x, y]) => grid(x, y, "k.......k\nkk.....kk\n.kkk.kkk.\n..kkkkkk.\n....kk...")),
  stamp("_u2fell_bare", 6, -2, { flip: "x" }),
] : [
  sky(CW, 60, "1+2=3~4"), stamp("_cloud_a", 80, 50), peaks(64, "lm", 61), peaks(72, "M0", 63), (c) => { for (let x = 0; x < CW; x++) c.vline(x, 70 + Math.round(Math.sin(x / 7) * 2), 12, "A") },
  stamp("_u2eagle", 70, 4, { swap: BACK }),
  stamp("_u2eagle", 18, 20),
])

// ------------------------------------------------------------------ orders (one picture each)
// A Rider of the Mark, seated, facing right: a helm with a white horsetail, blond braids, a green cloak.
sprite("_u2rohir", { outline: "k" }, `
  ...5.JJ........
  ..55JjJJ.......
  .55JjjjJj......
  .5.jFFFFj......
  ...YfFkFF......
  ...YffFFFF.....
  ...YYyfFE......
  ....Y.fEf......
  ....GhhHHhh....
  ...GhhHHHhhh...
  ..GGhhhHhhhhff.
  .GGGGhhhhhhhfF.
  .GG.GhhhhhhG...
  ....WWnWWWWW...
  ....jIjIjIjIj..
  .....IjIjIjIj..
  .........jIj...
  .........IjI...
  .........jIj...
  .........IjI...
  .........xxx...
  .........xWWW..
  .........WWWWW.`)
sprite("_u2rshield", { w: 9, h: 9, outline: "k" }, (c) => {
  c.circ(4, 4, 4, "h"); c.light([3, 3, 2.5]); c.shade((x, y) => x + y > 10); c.ring(4, 4, 4, "n"); c.px(4, 4, "N"); c.px(3, 3, "N")
})
const rider = (x, y, h = "_u2horse_bay", swap = {}) => [
  stamp(h, x, y, { swap }), stamp("_u2rohir", x + 14, y - 8, { swap }),
  (c) => { c.line(x + 27, y + 3, x + 58, y - 7, "x"); c.line(x + 56, y - 6, x + 60, y - 8, "J"); c.px(x + 61, y - 8, "J") },
  stamp("_u2rshield", x + 11, y - 1, { swap }),
]
sprite("_u2rider_bay", { w: 64, h: 44 }, ...rider(0, 12))
sprite("_u2rider_grey", { w: 64, h: 44 }, ...rider(0, 12, "_u2horse_grey"))
// An orc, facing right: grey-green hide, a flat face, red eyes, tusks, a black iron cap and a coat of rings.
sprite("_u2orc", { outline: "k" }, `
  .........x...........
  ........xx...........
  .......xX............
  ......xX.............
  .....xX..iii.........
  ....fx..iIIIi........
  ....**.iI>>*>........
  ....*>.i>>s>*........
  ....>>.>>>>>>>.......
  .....>>.>l>l>........
  ......>>.>>>.........
  .......>iiIiii.......
  ........iIjIIii......
  .......iIjjIIIii.....
  .......iIjIIIIi>.....
  .......iIIIIIii>*....
  .......iIIIIIi..>*...
  .......wwBwwww..*>...
  .......iiiIiii.......
  ......iii..iii.......
  ......>>....>>.......
  ......>>....>>.......
  .....>>.....>>.......
  .....ww.....ww.......
  ....www.....www......`)
// A great drum: a barrel of dark wood, iron hoops, a hide head
sprite("_u2drum", { w: 18, h: 16, outline: "k" }, (c) => {
  c.rect(1, 3, 16, 12, "W"); c.rect(1, 3, 4, 12, "x"); c.rect(14, 3, 3, 12, "w"); c.hline(1, 6, 16, "i"); c.hline(1, 12, 16, "i")
  c.ellipse(9, 3, 8, 2, "Q"); c.ellipse(8, 2, 5, 1, "l"); for (let x = 3; x < 16; x += 4) { c.line(x, 5, x + 2, 13, "w") }
})

order("fleches",
  // the elven archers' rain falls on a line of black shields
  sky(CW, 54, "1+2=3~4"), stamp("_cloud_a", 84, 6), hills(42, 3, "6", 71, 60), hills(48, 2, "%", 72, 60), ...meadow(54, CW, 26, 71, 40),
  (c) => { for (let x = 2; x < 126; x += 5) { c.rect(x, 56, 4, 9, x % 10 ? "i" : "u"); c.hline(x, 56, 4, "I"); c.px(x + 1, 59, "s"); c.line(x + 3, 55, x + 1, 48, "w"); c.px(x + 1, 47, "j") } },   // orc shields, spears up
  (c) => { const r = c.rng(7); for (let i = 0; i < 30; i++) { const x = 4 + Math.floor(r() * 120), y = 4 + Math.floor(r() * 44); c.line(x, y, x + 4, y + 6, "x"); c.px(x - 1, y - 1, "5"); c.px(x, y - 1, "5"); c.px(x + 5, y + 7, "J") } },
  (c) => { for (const [x, y] of [[12, 66], [40, 70], [70, 64], [96, 72], [118, 68]]) { c.line(x, y, x + 2, y + 4, "x"); c.px(x - 1, y - 1, "5") } },   // arrows stuck in the turf
)
order("lembas",
  // waybread wrapped in mallorn leaves, an elven pack and a leaf brooch, on a grey elven cloak
  vgrad(0, 0, CW, CH, "6%&", 1, 3),
  (c) => { for (let y = 4; y < CH; y += 8) for (let x = (y / 8) % 2 ? 0 : 6; x < CW; x += 12) { c.line(x, y, x + 3, y + 3, "&"); c.line(x + 3, y + 3, x + 6, y, "&") } },   // the grey elven cloak and its weave   // the cloak's weave
  layer("shadow", { shade: true }, ellipse(74, 68, 46, 6, "k")),
  // the pack, leather, a flap and a buckle
  rect(76, 18, 34, 40, "x"), rect(76, 18, 6, 40, "X"), rect(104, 18, 6, 40, "W"), rect(74, 14, 38, 14, "W"), rect(74, 14, 38, 3, "x"), rect(90, 24, 6, 6, "n"), rect(91, 25, 4, 4, "W"), hline(76, 57, 34, "w"),
  // the cakes: three, golden-brown crust, pale crumb, one broken
  ...[[8, 50], [38, 52], [22, 30]].map(([x, y]) => (c) => {
    c.poly([x - 6, y + 8, x + 8, y - 8, x + 36, y + 2, x + 24, y + 16], "h"); c.poly([x - 6, y + 8, x + 8, y - 8, x + 15, y + 4], "H"); c.line(x - 6, y + 8, x + 36, y + 2, "G")   // mallorn leaf, a gold-green sheen
    c.rect(x + 3, y - 3, 22, 10, "Q"); c.hline(x + 3, y - 3, 22, "l"); c.vline(x + 3, y - 3, 10, "l"); c.rect(x + 3, y + 5, 22, 2, "q"); c.line(x + 6, y, x + 22, y, "Y"); c.line(x + 6, y + 3, x + 22, y + 3, "Y")
  }),
  rect(36, 27, 11, 10, "5"), hline(36, 27, 11, "Q"), px(39, 30, "l"), px(43, 33, "l"), px(41, 35, "l"),   // one cake broken: the pale crumb
  // the brooch: a green leaf veined with silver
  poly([96, 64, 104, 58, 112, 60, 106, 68, 98, 68], "h"), line(97, 67, 110, 59, "J"), poly([98, 64, 104, 59, 108, 60, 102, 64], "H"),
)
order("marche",
  // riders on the road at full gallop, dust behind
  sky(CW, 50, "+2=3~4"), stamp("_cloud_far", 30, 20), hills(40, 4, "3", 81, 60), hills(46, 3, "6", 82, 60), ...meadow(50, CW, 30, 81, 40),
  layer("road", (c) => { c.poly([0, 70, 128, 56, 128, 64, 0, 80], "q"); c.line(0, 74, 128, 60, "Q"); c.line(0, 79, 128, 63, "T") }),
  layer("dust", dust([[8, 66, 5], [2, 60, 4], [18, 70, 4], [40, 58, 3]])),
  layer("shadow", { shade: true }, shadowAt(72, 66, 36), shadowAt(30, 76, 40)),
  stamp("_u2rider_grey", 62, 24, { swap: BACK }),
  stamp("_u2rider_bay", 20, 34),
)
order("palantir",
  // a dark seeing-stone on a black stand, the Eye burning in its depths
  vgrad(0, 0, CW, CH, "uUu", 1, 3),
  rect(0, 62, CW, 18, "k"), hline(0, 62, CW, "U"),
  poly([50, 74, 78, 74, 72, 62, 56, 62], "0"), poly([50, 74, 56, 62, 60, 62, 56, 74], "M"), rect(46, 74, 36, 4, "0"), hline(46, 74, 36, "M"),
  circ(64, 38, 22, "k"), circ(64, 38, 21, "u"), circ(62, 36, 16, "U"), circ(60, 33, 9, "v"),
  (c) => {   // the eye inside: a slit of fire in a ring of flame
    c.ellipse(66, 40, 11, 6, "R"); c.ellipse(66, 40, 9, 4, "D"); c.ellipse(66, 40, 6, 3, "L"); c.vline(66, 37, 7, "k"); c.vline(67, 38, 5, "k"); c.px(64, 39, "K")
  },
  px(52, 24, "?"), px(53, 25, "!"), px(51, 26, "!"),
  glow("DL", { r: 22, strength: 0.6, where: [0, 0, CW, 62] }),
)
order("cor_helm",
  // the Hornburg at dawn: the great horn sounds from the gate tower, echoing off the cliffs
  sky(CW, 56, "+=~4989"), circ(108, 50, 8, "9"), circ(108, 50, 5, "5"), glow("5", { r: 14, strength: 0.4 }),
  (c) => { for (let x = 0; x < CW; x++) { const h = Math.round(20 + Math.abs(x - 64) * 0.5 + Math.sin(x / 5) * 3); if (x < 36 || x > 92) c.vline(x, h, 80 - h, x < 64 ? "M" : "0") } },   // the cliffs of the Deep
  rect(34, 30, 60, 50, "m"), rect(34, 30, 8, 50, "l"), rect(86, 30, 8, 50, "M"),
  (c) => { for (let y = 34; y < 80; y += 5) { c.hline(34, y, 60, "M"); for (let x = 34 + ((y / 5) % 2 ? 4 : 0); x < 94; x += 9) c.vline(x, y + 1, 4, "M") } for (let x = 34; x < 94; x += 6) c.rect(x, 27, 4, 3, "m") },
  rect(54, 52, 20, 28, "w"), circ(64, 52, 10, "w"), rect(55, 53, 18, 27, "W"), circ(64, 53, 9, "W"), (c) => { for (let x = 57; x < 73; x += 4) c.vline(x, 46, 34, "w") },
  // the horn-blower on the tower, the horn raised, the sound rolling out in rings
  rect(56, 22, 16, 8, "m"), rect(56, 22, 3, 8, "l"), rect(54, 20, 20, 2, "M"), (c) => { for (let x = 54; x < 74; x += 4) c.rect(x, 18, 2, 2, "M") },
  rect(61, 10, 4, 10, "G"), rect(61, 10, 1, 10, "h"), circ(63, 8, 2, "F"), rect(61, 5, 4, 2, "j"), line(64, 9, 72, 6, "l", 2), line(72, 6, 75, 4, "5", 3), px(67, 8, "n"), px(70, 7, "n"),   // the horn-blower, a great horn
  (c) => { for (const r of [6, 11, 16, 21]) for (let a = -1.1; a <= 0.7; a += 0.04) c.px(Math.round(76 + Math.cos(a) * r), Math.round(4 + Math.sin(a) * r), r < 10 ? "5" : r < 15 ? "4" : "9") },
  vgrad(0, 72, CW, 8, "Tt", 1, 3),
)
order("tambours",
  // a vast dwarf hall in the dark, pillars without end, two orcs beating great drums by a fire
  rect(0, 0, CW, CH, "k"),
  (c) => { for (let i = 0; i < 7; i++) { const s = 1 - i * 0.12, w = Math.round(10 * s), xl = Math.round(64 - 58 * s), xr = Math.round(64 + 58 * s) - w, top = 0, bot = Math.round(40 + 30 * s); for (const x of [xl, xr]) { c.rect(x, top, w, bot, i > 3 ? ";" : "-"); c.vline(x, top, bot, i > 3 ? "-" : ":") } } },
  vgrad(0, 64, CW, 16, ";-", 1, 3),
  rect(60, 60, 8, 6, "0"), circ(64, 56, 4, "D"), circ(64, 55, 2, "L"), px(64, 52, "K"), px(63, 53, "L"), glow("DLK", { r: 34, strength: 0.6 }),
  layer("shadow", { shade: true }, shadowAt(34, 76, 30), shadowAt(84, 76, 30)),
  stamp("_u2drum", 38, 58), stamp("_u2orc", 18, 50),
  stamp("_u2drum", 72, 58), stamp("_u2orc", 90, 50, { flip: "x" }),
)
order("oeil",
  // the Dark Tower, and above it the lidless Eye wreathed in flame
  vgrad(0, 0, CW, CH, ";;-:", 1, 3),
  (c) => { for (let x = 0; x < CW; x++) { const h = Math.round(64 - Math.abs(Math.sin(x / 11)) * 6); c.vline(x, h, 80 - h, "k") } },
  poly([50, 80, 54, 30, 58, 22, 70, 22, 74, 30, 78, 80], "k"), poly([54, 30, 50, 18, 58, 22], "k"), poly([74, 30, 78, 18, 70, 22], "k"), rect(60, 16, 8, 6, "k"),
  poly([60, 16, 56, 6, 62, 14], "k"), poly([68, 16, 72, 6, 66, 14], "k"),
  (c) => { for (let y = 34; y < 78; y += 9) { c.px(58 + (y % 3), y, "D"); c.px(68 - (y % 4), y + 4, "L") } },    // lit slits in the tower
  (c) => {
    c.ellipse(64, 8, 18, 6, "D"); c.ellipse(64, 8, 14, 4, "L"); c.ellipse(64, 8, 9, 3, "K"); c.ellipse(64, 8, 6, 3, "S")
    c.vline(64, 5, 7, "k"); c.vline(65, 6, 5, "k")
    for (const [x, y] of [[44, 6], [46, 2], [82, 6], [80, 2], [50, 0], [78, 12], [48, 12]]) c.line(x, y, 64 + (x - 64) * 0.7, 8 + (y - 8) * 0.7, "D")
  },
  glow("DLK", { r: 18, strength: 0.6 }),
)
order("feu_orthanc",
  // night and rain: the blasting fire of Isengard breaks the wall, stones flying
  vgrad(0, 0, CW, CH, "uUvU", 1, 3),
  rect(0, 40, CW, 40, "0"), (c) => { for (let y = 44; y < 80; y += 4) { c.hline(0, y, CW, "k"); for (let x = (y / 4) % 2 ? 0 : 5; x < CW; x += 10) c.vline(x, y + 1, 3, "k") } }, rect(0, 38, CW, 3, "M"),
  (c) => { for (let x = 0; x < CW; x += 6) c.rect(x, 34, 4, 4, "M") },
  // the breach: a black hole in the wall, fire bursting out, blocks thrown
  circ(64, 56, 16, "k"), rect(48, 56, 32, 24, "k"),
  (c) => { const r = c.rng(4); for (let i = 0; i < 14; i++) { const a = -Math.PI * (0.1 + r() * 0.8), d = 10 + r() * 20; c.line(64, 56, Math.round(64 + Math.cos(a) * d), Math.round(56 + Math.sin(a) * d * 1.2), "D", 2) } },
  circ(64, 54, 11, "D"), circ(64, 52, 7, "L"), circ(64, 50, 4, "K"),
  (c) => { for (const [x, y, s] of [[36, 20, 4], [88, 16, 5], [48, 8, 3], [100, 30, 4], [24, 34, 3], [76, 6, 3]]) { c.rect(x, y, s, s, "M"); c.hline(x, y, s, "m"); c.vline(x + s - 1, y + 1, s - 1, "0") } },
  darkSmoke(64, 34, 8), glow("DLK", { r: 26, strength: 0.6 }),
  (c) => { const r = c.rng(11); for (let i = 0; i < 70; i++) { const x = Math.floor(r() * (CW + 20)) - 10, y = Math.floor(r() * CH); c.line(x, y, x - 2, y + 4, "3") } },   // rain
)

// ------------------------------------------------------------------ card back
// Dark green, a gold border, a ring of gold around a seven-pointed star, leaves in the corners
scene("c_back", { w: CW, h: CH, bg: "g" },
  (c) => { for (let i = -CH; i < CW; i += 6) { c.line(i, CH - 1, i + CH, 0, "G") } for (let i = 0; i < CW + CH; i += 6) c.line(i, CH - 1, i - CH, 0, "a") },
  box(2, 2, CW - 4, CH - 4, "n"), box(3, 3, CW - 6, CH - 6, "N"), box(5, 5, CW - 10, CH - 10, "B"),
  circ(64, 40, 22, "g"), ring(64, 40, 21, "B"), ring(64, 40, 20, "n"), ring(64, 40, 19, "N"), ring(64, 40, 18, "n"), ring(64, 40, 17, "B"),
  (c) => {
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 7, b1 = a - Math.PI / 7, b2 = a + Math.PI / 7
      c.poly([64 + Math.cos(a) * 14, 40 + Math.sin(a) * 14, 64 + Math.cos(b2) * 5, 40 + Math.sin(b2) * 5, 64, 40, 64 + Math.cos(b1) * 5, 40 + Math.sin(b1) * 5].map(Math.round), "J")
      c.poly([64 + Math.cos(a) * 14, 40 + Math.sin(a) * 14, 64, 40, 64 + Math.cos(b1) * 5, 40 + Math.sin(b1) * 5].map(Math.round), "4") }
    c.circ(64, 40, 2, "N")
    // corner leaves
    for (const [x, y, sx, sy] of [[8, 8, 1, 1], [119, 8, -1, 1], [8, 71, 1, -1], [119, 71, -1, -1]]) { c.poly([x, y, x + 10 * sx, y + 3 * sy, x + 3 * sx, y + 10 * sy], "h"); c.line(x, y, x + 7 * sx, y + 7 * sy, "n"); c.px(x + 2 * sx, y + 2 * sy, "N") }
  },
)

// ------------------------------------------------------------------ attribute icons (shown 9-11 px tall: kept at native size)
sprite("i_epee", { outline: "k" }, `
  ..........JJ
  .........JJj
  ........JJj.
  .......JJj..
  ......JJj...
  .....JJj....
  ..n.JJj.....
  ...nJj......
  ...BnB......
  ..WB.Bn.....
  .WW.........`)
sprite("i_cheval", { outline: "k" }, `
  ....w.w.....
  ...wMmMm....
  ..wwmmmmM...
  .wwmmkmmmM..
  .wwmmmmmmmM.
  wwmmmmMmmmmM
  wwmmmM..Mmmw
  wmmmM....MM.
  wmmmM.......
  Mmmmmw......`)
sprite("i_arc", { outline: "k" }, `
  ..xW.......
  .xW..5.....
  .xW...5....
  xW.....5...
  xWxxxxxxJJ.
  xW.....5...
  .xW...5....
  .xW..5.....
  ..xW.......`)
sprite("i_baton", { outline: "k" }, `
  .......??..
  ......?!!?.
  .......??x.
  ........xW.
  .......xW..
  ......xW...
  .....xW....
  ....xW.....
  ...xW......
  ..xW.......
  .xW........`)

// ------------------------------------------------------------------ initiative coin (64x64)
// Free Peoples: silver, the White Tree in flower under seven stars, in relief
sprite("coin_0", { w: 64, h: 64 }, coinDisc("I", "j", "J", "I"),
  (c) => {
    c.rect(31, 24, 3, 22, "%"); c.rect(28, 44, 9, 2, "%"); c.rect(25, 46, 15, 2, "%")
    for (const [y, w] of [[26, 9], [31, 12], [36, 14]]) { c.line(32, y + 4, 32 - w, y - 2, "%", 2); c.line(32, y + 4, 32 + w, y - 2, "%", 2) }
    c.line(32, 24, 32, 18, "%", 2)
    for (let i = 0; i < 7; i++) { const a = Math.PI * (1.15 + i * 0.7 / 6), x = Math.round(32 + Math.cos(a) * 19), y = Math.round(30 + Math.sin(a) * 15); c.px(x, y, "%"); c.px(x - 1, y, "%"); c.px(x + 1, y, "%"); c.px(x, y - 1, "%"); c.px(x, y + 1, "%") }
  },
  relief("%", "J", "5", "I"),
  (c) => { for (const [x, y] of [[20, 26], [44, 26], [18, 32], [46, 32], [22, 38], [42, 38]]) c.px(x, y, "5") },   // flowers on the branch tips
)
// The Shadow: dark iron, a raised rim of bronze, the red lidless Eye
sprite("coin_1", { w: 64, h: 64 }, coinDisc("b", "i", "I", "k"),
  (c) => { c.ellipse(32, 32, 18, 8, "%") }, relief("%", "B", "n", "b"),
  (c) => { c.ellipse(32, 32, 15, 6, "R"); c.ellipse(32, 32, 12, 5, "s"); c.ellipse(32, 32, 8, 4, "D"); c.ellipse(32, 32, 4, 3, "L"); c.vline(32, 27, 11, "k"); c.vline(33, 28, 9, "k"); c.px(30, 30, "K") },
  (c) => { for (const [x, y] of [[12, 32], [52, 32], [32, 20], [32, 44], [18, 22], [46, 22], [18, 42], [46, 42]]) { const dx = Math.sign(x - 32), dy = Math.sign(y - 32); c.line(x, y, x + dx * 3, y + dy * 3, "B") } },   // rays
)
}
