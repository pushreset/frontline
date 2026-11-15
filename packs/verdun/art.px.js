// Verdun 1916 — card (128x80) and terrain (320x144) illustrations, at the resolution of the Gallic Wars.
// Build (writes packs/verdun/out/): node ~/.claude/skills/pxl-pixel-art/bin/pxl.js build packs/verdun/art.px.js --no-preview
//
// Palette of the Great War: overcast skies, mud, shattered wood, horizon blue against feldgrau. Hardly any green.
// Style rules (shared with every pack, see packs/art-lib.px.js): one light from the top left, hue-shifted ramps,
// warm outlines around figures only, three depths per landscape, no filler speckle, fire glows (D L K).
pal({
  k: "#14110f",
  1: "#6c757b", "+": "#7c8489", 2: "#8d9393", "=": "#9fa39d", 3: "#b2b3a6", "~": "#c2bfac", 4: "#d1cab0", 5: "#ebe5d2",   // overcast sky, cloud
  6: "#8c8d84", "%": "#75776d", "&": "#5e6158",                                     // far ridges in the haze
  a: "#232a1c", A: "#39432f", c: "#525b37", "^": "#626a3e", C: "#707a49", d: "#8e9157",   // what is left of the grass
  t: "#3b2d21", T: "#5b4834", q: "#846e4e", Q: "#a78f69",                           // mud, sandbags
  0: "#45433d", M: "#6d6a61", m: "#999689", l: "#c3bfad",                           // concrete, stone, chalk
  z: "#29353f", Z: "#45606b", p: "#6b8590", P: "#a5b7ba",                           // shell-hole water
  w: "#2a1c13", W: "#4e3927", x: "#75583a", X: "#9b7b51",                           // wood, leather
  o: "#584319", O: "#89692a", y: "#c29944", Y: "#e5c773",                           // straw, brass
  u: "#38475e", U: "#546985", v: "#7287a4", V: "#a1b2c5",                           // French horizon blue
  g: "#3c423d", G: "#5b635a", h: "#7e877b", H: "#a2aa9c",                           // German feldgrau
  7: "#5a4932", 8: "#8b7954", 9: "#b8a679",                                         // khaki, canvas
  e: "#462820", E: "#794935", f: "#b1765a", F: "#dda98a",                           // skin
  i: "#30353b", I: "#565c64", j: "#878e95", J: "#c7cccf",                           // steel
  r: "#3f1517", R: "#752228", s: "#a8392d", S: "#d76549",                           // red: kepi, trousers, cockade
  b: "#161c2a", B: "#263349", n: "#40557a", N: "#7f95b8",                           // night
  "@": "#c6c26a", "$": "#949347",                                                   // gas
  D: "#c9501f", L: "#f0a43a", K: "#fbeeb0",                                         // fire
})
ramps("1+2=3~45", "&%6345", "kaAc^Cd", "ktTqQ", "k0Mml", "kzZpP", "kwWxX", "koOyY", "kuUvV", "kgGhH", "k789", "keEfF", "kiIjJ", "krRsS", "kbBnN", "$@", "DLK")
include("../art-lib.px.js")

const AXIS = { V: "H", v: "h", U: "G", u: "g" }
const BACK = { V: "v", v: "U", U: "u", H: "h", h: "G", G: "g", F: "f", f: "E", E: "e", X: "x", x: "W", W: "w", J: "j", j: "I", I: "i", l: "m", m: "M", Q: "q", q: "T" }
const NIGHT = { V: "n", v: "B", U: "b", u: "b", H: "n", h: "B", G: "b", g: "b", F: "N", f: "n", E: "B", e: "b", X: "B", x: "b", W: "b", w: "b", J: "N", j: "n", I: "B", i: "b", y: "n", s: "B", S: "n", R: "b", r: "b", l: "N", m: "n", M: "B", q: "B", Q: "n", T: "b", t: "b" }

// ------------------------------------------------------------------ figures (about 36 px tall)
// Poilu advancing, facing right: Adrian helmet with its crest, horizon-blue greatcoat with the skirt buttoned back,
// leather webbing, puttees, the Lebel rifle with its long bayonet.
const SOL = `
  ..........vV................
  .........VVvV...............
  ........VvVvvvU.............
  ......UUUUUUUUUUU...........
  .........EfFFFU.............
  .........fFkFFf.............
  .........ffFFFFf............
  .........EffFFE.............
  ..........EffE..............
  .......VVvvEvvV.............
  ......VVvvvvvvvU............
  ......VvvVvvvvvvU...........
  ......VvvVvvvvvvvU..........
  ......VvvVvvvvvvUffXXxxxxxxjjjJJ
  ......VvxVvvvvvvxfFWWWWWWWj.....
  ......VvvVvvvvvvU.ff........
  ......VvvVvvvvvvU...........
  ......Vvvvvvvvvvv...........
  ......UxxxyxxxxxU...........
  ......VvvvvvvvvvU...........
  ......VvvVvvvvvvU...........
  ......VvvVvvvvvvUU..........
  ......vvvv.vvvvvvU..........
  ......vvU...vvvvvU..........
  .......UUU...UUUU...........
  ......UUU.....UUUU..........
  .....UUUU......UUU..........
  .....UUU.......UUUU.........
  ....UUUU........UUU.........
  ....UUU.........UUUU........
  ...WWWW..........WWWW.......
  ..WWWWW..........WWWWW......`
const KNEEL = `
  ..........vV..................
  .........VVvV.................
  ........VvVvvvU...............
  ......UUUUUUUUUUU.............
  .........EfFFFfFXxxxxxxxxjjjJJ
  .........fFkFFfWWWWWWWWWj.....
  .........ffFFFF...............
  .........EffFE................
  ..........EfE.................
  .......VVvvvvvVff.............
  ......VVvvvvvvvvFf............
  ......VvvVvvvvvvvf............
  ......VvvVvvvvvvv.............
  ......VvxVvvvvvvx.............
  ......VvvVvvvvvvU.............
  ......UxxxyxxxxxU.............
  ......VvvvvvvvvvUU............
  ......vvvvvvvvvvvvvvvU........
  .......UUUUUUUUUUUUUUU........
  .......UUUU.......UUUU........
  ......UUUU........UUUU........
  .....UUUU.........UUUU........
  ....UUUU..........UUU.........
  ...UUUUUU.........UUU.........
  ..WWUUUUUU........WWWW........
  .WWWWWWWWW........WWWWW.......`
const put = (grid, rows) => { const r = grid.split("\n").filter((x) => x.trim()).map((x) => x.trim()); for (const [i, s] of Object.entries(rows)) r[i] = s; return r.join("\n") }
const STAHL = { 0: "..........HH................", 1: ".........HhhhH..............", 2: "........HhHhhhhG............", 3: ".......GGhhhhhhGG...........", 4: ".......GG.EfFFFG............" }
const STAHLK = { 0: "..........HH..................", 1: ".........HhhhH................", 2: "........HhHhhhhG..............", 3: ".......GGhhhhhhGG.............", 4: ".......GG.EfFFFfFXxxxxxxxxjjjJJ" }
sprite("_sol", { outline: "k" }, SOL)
sprite("_kneel", { outline: "k" }, KNEEL)
sprite("_sol_x", { outline: "k", swap: AXIS }, put(SOL, STAHL))
sprite("_kneel_x", { outline: "k", swap: AXIS }, put(KNEEL, STAHLK))
// Officers: the French kepi (red crown, blue band), the German peaked cap; a pistol instead of the rifle.
const OFF = { 13: "......VvvVvvvvvvUffjjI......", 14: "......VvxVvvvvvvxfF.........", 15: "......VvvVvvvvvvU.f........." }
sprite("_officer", { outline: "k" }, put(SOL, { ...OFF, 0: "............................", 1: ".........ssss...............", 2: "........sSsssU..............", 3: "........UUUUUkk............." }))
sprite("_officer_x", { outline: "k", swap: AXIS }, put(SOL, { ...OFF, 0: "............................", 1: ".........hhhh...............", 2: "........HhssshG.............", 3: ".......GGGGGkkk............." }))
// Gas mask: round goggles and a snout over the face.
const MASK = { 4: ".........EMMMMU.............", 5: ".........MpMMpM.............", 6: ".........MMMMMMj............", 7: ".........MMMjj..............", 8: "..........MMjj.............." }
sprite("_masked", { outline: "k" }, put(SOL, MASK))
sprite("_masked_x", { outline: "k", swap: AXIS }, put(put(SOL, STAHL), MASK))

// Field gun facing right: shield, wooden spoked wheel, trail and spade. big = the 155 mm howitzer, barrel raised.
function gun(name, { barrel = 30, up = 6, big = false, swap } = {}) {
  const W = big ? 92 : 72, H = big ? 52 : 40
  sprite(name, { w: W, h: H, outline: "k", swap }, (c) => {
    const R = big ? 14 : 10, wx = big ? 34 : 26, wy = H - R - 2
    c.line(wx, wy, 2, H - 4, "U", big ? 4 : 3); c.line(wx, wy - 1, 2, H - 5, "v")                                    // trail
    c.rect(0, H - 6, 8, 4, "u")                                                                                       // spade
    const bx = wx + 4, by = wy - (big ? 10 : 8)
    c.line(bx - 8, by + 4, bx + barrel, by - up, "U", big ? 6 : 4); c.line(bx - 8, by + 2, bx + barrel, by - up - 2, "v", 1)   // barrel, its lit top
    c.rect(bx - 12, by, 14, big ? 12 : 8, "U"); c.hline(bx - 12, by, 14, "v")                                         // breech, cradle
    if (!big) { c.poly([wx - 2, wy - 16, wx + 8, wy - 17, wx + 8, wy - 3, wx - 2, wy - 3], "v"); c.vline(wx + 8, wy - 17, 14, "U"); c.hline(wx - 2, wy - 16, 10, "V"); c.px(wx + 3, wy - 10, "k") }   // shield, sight slot
    c.circ(wx, wy, R, "W"); c.circ(wx, wy, R - 2, "_"); c.ring(wx, wy, R, "x"); c.ring(wx, wy, R - 1, "W")
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; c.line(wx, wy, Math.round(wx + Math.cos(a) * (R - 2)), Math.round(wy + Math.sin(a) * (R - 2)), i % 2 ? "W" : "x") }
    c.circ(wx, wy, 2, "I"); c.px(wx - 1, wy - 1, "j")
  })
}
gun("_gun75"); gun("_gun75_x", { barrel: 26, swap: AXIS })
gun("_gun155", { barrel: 44, up: 26, big: true }); gun("_gun155_x", { barrel: 36, up: 28, big: true, swap: AXIS })

// Biplane (Nieuport 17, cockades) or monoplane (Fokker Eindecker, crosses), facing right.
function plane(name, { bi = true, swap } = {}) {
  sprite(name, { w: 68, h: 30, outline: "k", swap }, (c) => {
    c.poly([4, 14, 16, 12, 48, 10, 58, 12, 60, 16, 52, 20, 16, 18, 4, 16], "v"); c.hline(16, 12, 32, "V"); c.hline(16, 18, 36, "U")   // fuselage
    for (let x = 22; x < 50; x += 7) c.vline(x, 12, 6, "U")                                                          // fabric ribs
    c.poly([4, 14, 2, 4, 8, 4, 16, 12], "v"); c.hline(0, 14, 12, "U")                                                 // fin, tailplane
    c.rect(56, 10, 6, 10, "I"); c.vline(64, 4, 22, "j"); c.px(64, 15, "I")                                           // cowling, prop disc
    c.rect(20, 6, 36, 3, "V"); c.hline(20, 8, 36, "U")                                                               // top wing
    if (bi) { c.rect(24, 20, 28, 2, "U"); c.line(26, 8, 28, 20, "I"); c.line(48, 8, 46, 20, "I") } else c.line(32, 8, 40, 18, "I")   // lower wing, struts
    c.grid(38, 8, ".W.\nWfW")                                                                                        // the pilot's head
    if (!swap) { c.circ(14, 14, 3, "n"); c.circ(14, 14, 2, "5"); c.px(14, 14, "s"); c.circ(38, 7, 1, "s") }          // cockades
    else c.grid(12, 12, ".5.5.\n5k5k5\n.kkk.\n5k5k5\n.5.5.")
  })
}
plane("_nieuport"); plane("_fokker", { bi: false, swap: AXIS })
// Explosion and earth geyser: the column of mud a shell throws up.
sprite("_boom", { w: 34, h: 32 }, (c) => {
  for (const [x, y, r, k] of [[17, 10, 8, "0"], [9, 14, 6, "M"], [25, 13, 6, "M"], [17, 4, 4, "M"]]) { c.circ(x, y, r, k); c.circ(x - 2, y - 2, Math.max(1, r - 4), "m") }
  c.circ(17, 22, 9, "D"); c.circ(17, 22, 6, "L"); c.circ(17, 23, 3, "K")
  c.poly([0, 32, 8, 24, 26, 24, 34, 32], "D"); c.poly([6, 32, 12, 26, 22, 26, 28, 32], "L")
  for (const [x, y] of [[2, 18], [31, 16], [5, 8], [29, 5]]) c.rect(x, y, 2, 2, "k")
})
sprite("_geyser", { w: 30, h: 40 }, (c) => {
  c.poly([4, 39, 10, 12, 14, 0, 18, 10, 24, 39], "T"); c.poly([8, 39, 12, 16, 14, 6, 16, 16, 20, 39], "q"); c.poly([10, 39, 13, 20, 14, 12, 15, 20, 17, 39], "Q")
  for (const [x, y, r] of [[6, 18, 4], [22, 14, 4], [14, 4, 4], [3, 28, 3], [26, 26, 3]]) { c.circ(x, y, r, "T"); c.circ(x - 1, y - 1, r - 2, "q") }
  for (const [x, y] of [[0, 8], [28, 6], [4, 2], [24, 22], [12, 0]]) c.rect(x, y, 2, 2, "t")
})
// Shattered tree: a splintered trunk, a broken branch or two.
function stump(name, h, seed) {
  sprite(name, { w: 18, h }, (c) => {
    c.rect(6, 4, 6, h - 4, "W"); c.vline(6, 4, h - 4, "x"); c.vline(11, 4, h - 4, "w")
    c.poly([6, 4, 7, 0, 9, 3, 11, 1, 12, 4], "x")
    if (seed % 2) c.line(11, Math.round(h * 0.35), 17, Math.round(h * 0.2), "W", 2); else c.line(6, Math.round(h * 0.4), 0, Math.round(h * 0.25), "W", 2)
    if (seed % 3 === 0) c.line(11, Math.round(h * 0.6), 15, Math.round(h * 0.5), "W")
  })
}
stump("_stump_a", 52, 1); stump("_stump_b", 36, 2); stump("_stump_c", 24, 3); stump("_stump_d", 68, 4)
group("_stumps", ["_stump_a", "_stump_b", "_stump_c", "_stump_d"])
sprite("_snowstump", { base: "_stump_a" }, (c) => { c.hline(6, 4, 6, "5"); c.px(7, 0, "5"); c.px(9, 3, "5") })
// Barbed wire on X-shaped stakes.
const wireRow = (x0, x1, y, key = "I") => (c) => {
  for (let x = x0; x <= x1; x += 24) { c.line(x - 4, y + 8, x + 4, y - 10, "W", 2); c.line(x + 4, y + 8, x - 4, y - 10, "W", 2) }
  for (let x = x0; x < x1; x += 5) { c.ring(x, y - 2 + ((x / 5) % 2), 3, key); c.px(x - 2, y - 4, "j") }
}
// Sandbag wall: rows of rounded bags, staggered, lit on top.
const bags = (x0, y0, w, rows) => (c) => {
  for (let r = 0; r < rows; r++) for (let x = x0 + (r % 2) * 6; x < x0 + w - 6; x += 12) {
    const y = y0 - r * 6; c.rect(x, y, 12, 6, "q"); c.hline(x + 1, y, 10, "Q"); c.hline(x, y + 5, 12, "T"); c.px(x, y, "T"); c.px(x + 11, y, "T")
  }
}
// Shell hole: a dark rim, a lit far lip, standing water when it has rained.
const crater = (x, y, r, wet = false) => (c) => {
  c.ellipse(x, y, r, Math.max(2, Math.ceil(r / 2.5)), "t"); c.ellipse(x, y + 1, r - 2, Math.max(1, Math.ceil(r / 3) - 1), wet ? "Z" : "T")
  if (wet) { c.hline(x - Math.floor(r / 2), y, Math.max(1, r - 4), "p"); c.hline(x - Math.floor(r / 3), y + 1, Math.max(1, r / 3), "P") }
  c.hline(x - r + 2, y - Math.ceil(r / 2.5), 2 * r - 4, "Q")
}
const craters = (list, wet) => (c) => { for (const [x, y, r, w] of list) crater(x, y, r, w ?? wet)(c) }
// Churned mud from y down: two tones, ruts and clods; every mark is a clod or a rut, not filler.
const mud = (y, w, h, seed = 1) => [vgrad(0, y, w, h - y, "qTt", 1, 2), (c) => {
  for (let i = 0; i < w / 5; i++) { const x = (i * 37 + seed * 13) % w, yy = y + 3 + ((i * 11 + seed * 7) % Math.max(1, h - y - 4)); c.hline(x, yy, 3 + (i % 4), "t"); if (i % 2) c.hline(x + 1, yy - 1, 2, "Q") }
}]
// Trench mortar bomb with its fins; carrier pigeon.
sprite("_bomb", { outline: "k" }, `
  .III.
  IjjJI
  IjjjI
  IjjjI
  .III.
  ..I..
  .IiI.
  IiIiI`)
sprite("_pigeon", { outline: "k" }, `
  ...ll...............
  ..lllm........l5....
  .lllmmm.....lll.....
  llmmmmmmmlllll......
  .mmMMMmmmmmJy.......
  ..MMMMMMmmm.........
  ....MM..M...........`)

// ------------------------------------------------------------------ backdrop helpers
// Overcast front: low sky, a far ridge in the haze, a line of shattered trees on it.
const front = (seed = 1, hor = 40, keys = "1+2=3~4") => [sky(CW, hor, keys), stamp("_cloud_far", 10 + seed * 23 % 80, 8 + seed % 3 * 4), hills(hor - 2, 2, "%", seed, 70),
  (c) => { for (let x = 4 + seed % 9; x < CW; x += 18 + seed % 7) c.vline(x, hor - 8 - (x % 5), 8, "&") }]
const smokeP = (pts) => (c) => { for (const [x, y, r, k = 0] of pts) { c.circ(x, y, r, ["0", "M", "m"][k]); c.circ(x - 2, y - 2, Math.max(1, r - 3), ["M", "m", "4"][k]) } }
// Trench across the picture: parapet of bags, dark cut, duckboards, revetment posts.
const trench = (y, h = 24, w = CW) => [rect(0, y, w, h, "t"), rect(0, y, w, 4, "T"), bags(0, y - 2, w, 2),
  (c) => { for (let bx = 0; bx < w; bx += 12) c.rect(bx, y + h - 4, 10, 2, "x") },
  (c) => { for (let px_ = 20; px_ < w; px_ += 52) { c.vline(px_, y + 2, h - 4, "W"); c.vline(px_ + 1, y + 2, h - 4, "x") } }]
// Muzzle blast pointing right.
const blast = (x, y) => [poly([x, y, x + 18, y - 6, x + 14, y, x + 18, y + 6], "L"), poly([x, y, x + 10, y - 3, x + 8, y, x + 10, y + 3], "K"), circ(x + 1, y, 3, "K"),
  smokeP([[x + 22, y - 6, 6, 1], [x + 28, y - 12, 5, 2], [x + 18, y - 14, 4, 2]]), glow("LK", { r: 8, strength: 0.4 })]

// ------------------------------------------------------------------ cards (128x80)
function unit(name, build) {
  scene("c_" + name, { w: CW, h: CH }, ...build(""))
  scene("c_" + name + "_x", { w: CW, h: CH }, ...build("_x"))
}
const order = (name, ...items) => scene("c_" + name, { w: CW, h: CH }, ...items)

unit("canon75", (x) => [
  ...front(1, 44), ...mud(46, CW, CH, 1), craters([[104, 72, 12], [16, 74, 8]]),
  layer("shadow", { shade: true }, shadowAt(24, 76, 50)),
  stamp("_gun75" + x, 28, 34), stamp("_kneel" + x, 2, 46),
  ...blast(x ? 92 : 96, 30),
])
unit("obusier155", (x) => [
  ...front(3, 48, "+=~89"), ...mud(50, CW, CH, 2), bags(92, 70, 36, 3),
  layer("shadow", { shade: true }, shadowAt(8, 76, 70)),
  stamp("_gun155" + x, 4, 24), stamp("_kneel" + x, 82, 44, { flip: "x" }),
  smokeP([[88, 8, 7, 1], [96, 4, 6, 2], [80, 4, 4, 2]]), circ(82, 12, 3, "K"), px(86, 10, "L"), glow("KL", { r: 8, strength: 0.5 }),
])
unit("crapouillot", (x) => [
  ...front(5, 36), ...mud(38, CW, CH, 3), ...trench(56),
  stamp("_kneel" + x, 12, 48),
  line(68, 72, 76, 54, "I", 5), line(69, 70, 76, 55, "j"), rect(62, 72, 18, 4, "i"),          // stubby tube, baseplate
  stamp("_bomb", 92, 8), smokeP([[94, 26, 3, 2], [92, 34, 2, 1]]),
])
unit("poilus", (x) => [
  ...front(2, 34), ...mud(36, CW, CH, 4), craters([[60, 68, 14, true], [116, 52, 8], [12, 60, 6]]),
  stamp("_stump_b", 112, 8), stamp("_stump_c", 20, 16),
  layer("shadow", { shade: true }, shadowAt(10, 76, 18), shadowAt(50, 72, 18), shadowAt(92, 78, 18)),
  stamp("_sol" + x, 4, 40, { swap: BACK }), stamp("_sol" + x, 44, 34), stamp("_sol" + x, 86, 42),
])
unit("chasseurs", (x) => [
  ...front(4, 40, "+2=3~"), stamp("_stump_d", 8, -8), stamp("_stump_a", 92, 0), stamp("_stump_b", 60, 12),
  ...mud(44, CW, CH, 5), rect(0, 62, CW, 18, "t"), bags(0, 60, CW, 3),
  stamp("_kneel" + x, 16, 34), stamp("_kneel" + x, 68, 34),
  px(56, 38, "K"), glow("K", { r: 4, strength: 0.6 }),
])
unit("mitrailleuse", (x) => [
  vgrad(0, 0, CW, 44, "bBn7", 1, 2), hills(40, 2, "b", 3, 48), ...mud(46, CW, CH, 6),
  bags(52, 66, 76, 3), rect(0, 66, CW, 14, "t"), bags(0, 68, 44, 1),
  stamp("_kneel" + x, 20, 38),
  rect(48, 42, 24, 6, "I"), hline(48, 42, 24, "j"), hline(72, 44, 12, "i"), rect(44, 40, 8, 10, "i"), line(56, 48, 52, 58, "I"), line(60, 48, 66, 58, "I"),   // gun, water jacket, tripod
  line(84, 44, 127, 28, "L"), line(84, 46, 127, 40, "D"), px(86, 44, "K"),                                         // tracer
  glow("LK", { r: 8, strength: 0.45 }),
])
unit("nettoyeurs", (x) => [
  ...front(6, 28, "+2=3~"), ...mud(28, CW, CH, 7),
  rect(0, 52, CW, 28, "t"), rect(0, 52, CW, 4, "T"), bags(60, 50, 68, 2),
  stamp("_sol" + x, 20, 20), line(44, 32, 52, 28, "J", 2),                                    // trench knife
  stamp("_boom", 84, 36), (c) => { for (const [px_, py] of [[64, 8], [66, 10], [68, 13]]) c.px(px_, py, "I") },   // grenade arc
])
unit("lance_flammes", (x) => [
  ...front(2, 40, "+=~89"), ...mud(42, CW, CH, 8), bags(80, 60, 48, 3),
  stamp("_sol" + x, 8, 38), rect(8, 48, 8, 14, "I"), hline(8, 48, 8, "j"),                    // fuel tank on the back
  poly([44, 48, 80, 36, 112, 44, 116, 56, 80, 60, 44, 52], "D"), poly([44, 48, 76, 42, 100, 48, 80, 54, 44, 52], "L"), poly([44, 50, 68, 46, 80, 50, 60, 52], "K"),
  smokeP([[100, 24, 10, 0], [112, 16, 8, 1], [88, 20, 6, 1]]),
  glow("LK", { r: 12, strength: 0.5 }),
])
unit("sapeurs", (x) => [
  sky(CW, 16), ...mud(16, CW, 32, 9), stamp("_sol" + x, 92, -6), crater(40, 26, 8),
  vgrad(0, 32, CW, 48, "Tt", 1, 2), (c) => { for (const [cx, cy] of [[10, 40], [44, 44], [100, 38], [70, 76], [118, 70]]) { c.ellipse(cx, cy, 3, 2, "m"); c.px(cx - 1, cy - 1, "l") } },   // chalk lumps in the clay
  rect(8, 48, 112, 24, "k"), rect(8, 48, 112, 2, "T"),                                         // gallery
  (c) => { for (const gx of [12, 44, 76, 108]) { c.vline(gx, 48, 24, "W"); c.vline(gx + 1, 48, 24, "x"); c.hline(gx - 2, 48, 8, "x") } },   // timbering
  stamp("_kneel" + x, 52, 46), line(74, 54, 82, 46, "W", 2), rect(80, 44, 6, 3, "I"),         // pick
  rect(92, 60, 10, 10, "q"), rect(104, 62, 10, 8, "T"), hline(92, 64, 22, "s"),               // charges
  circ(28, 54, 2, "L"), px(28, 53, "K"), glow("LK", { r: 14, strength: 0.6 }),                 // lamp
])
unit("terrassiers", (x) => [
  ...front(4, 32), ...mud(32, CW, CH, 10),
  poly([0, 54, 128, 50, 128, 80, 0, 80], "t"), poly([0, 52, 128, 48, 128, 52, 0, 56], "T"),    // trench being dug
  (c) => { for (const [mx, my] of [[16, 44], [80, 40], [112, 42]]) { c.ellipse(mx, my, 14, 6, "T"); c.ellipse(mx - 2, my - 2, 10, 4, "q") } },   // spoil heaps
  stamp("_sol" + x, 32, 32), line(56, 44, 64, 60, "W", 2), rect(62, 60, 6, 4, "I"),           // shovel
  stamp("_kneel" + x, 80, 44, { flip: "x" }), line(72, 54, 66, 66, "W", 2),
  (c) => { for (let bx = 4; bx < CW; bx += 10) c.rect(bx, 74, 8, 2, "x") },
])
unit("telephonistes", (x) => [
  rect(0, 0, CW, CH, "W"), (c) => { for (let y = 4; y < 60; y += 12) { c.hline(0, y, CW, "w"); c.hline(0, y + 1, CW, "x") } },   // dugout timber wall
  (c) => { for (const bx of [4, 60, 116]) { c.rect(bx, 0, 6, 60, "x"); c.vline(bx, 0, 60, "X") } }, rect(0, 60, CW, 20, "T"), hline(0, 60, CW, "q"),
  rect(72, 44, 36, 6, "x"), hline(72, 44, 36, "X"), vline(76, 50, 12, "W"), vline(104, 50, 12, "W"),                  // crate table
  rect(80, 34, 16, 10, "I"), rect(82, 36, 12, 4, "i"), px(98, 36, "j"), line(96, 34, 100, 28, "I"),                   // field telephone
  circ(116, 54, 6, "x"), ring(116, 54, 6, "W"), circ(116, 54, 2, "W"), wire(96, 40, 116, 52, 6, "k"), wire(116, 50, 128, 44, 3, "k"),   // wire drum
  stamp("_kneel" + x, 36, 34), line(56, 40, 68, 36, "I"),
  circ(44, 10, 3, "L"), px(44, 9, "K"), vline(44, 0, 6, "I"), glow("LK", { r: 26, strength: 0.45 }),
])
unit("officier", (x) => [
  ...front(7, 36, "+=~89"), ...mud(36, CW, CH, 11), ...trench(56),
  line(60, 80, 68, 24, "W", 3), line(68, 24, 76, 16, "W", 2), (c) => { for (let y = 30; y < 78; y += 8) c.hline(60 + (78 - y) / 7, y, 8, "x") },   // trench ladder
  stamp("_officer" + x, 20, 26), px(44, 32, "J"), px(45, 32, "j"),                             // whistle
  stamp("_kneel" + x, 80, 42), stamp("_kneel" + x, 102, 44),
])
unit("escadrille", (x) => [
  sky(CW, 60), stamp("_cloud_a", 8, 8), stamp("_cloud_b", 92, 36),
  ...mud(60, CW, CH, 12), craters([[28, 68, 8, true], [80, 72, 10, true], [112, 64, 6]]),
  hline(0, 26, 14, "4"), hline(4, 36, 12, "4"),
  stamp(x ? "_fokker" : "_nieuport", 24, 12),
  stamp(x ? "_nieuport" : "_fokker", 56, 40, { rot: 180, flip: "y", swap: { V: "m", v: "M", U: "0", H: "m", h: "M", G: "0" } }), smokeP([[52, 48, 4, 0], [44, 44, 5, 1], [34, 40, 5, 2]]),   // the other side's plane, going down
])
// Campaign rewards: the player's only, the same picture on both sides.
unit("brancardiers", () => [
  ...front(9, 36), ...mud(38, CW, CH, 13), craters([[108, 68, 12, true]]),
  stamp("_sol", 12, 36), stamp("_sol", 68, 36),
  rect(28, 48, 48, 4, "x"), hline(24, 50, 56, "W"), rect(36, 44, 24, 4, "v"), rect(60, 44, 6, 4, "F"),   // stretcher, wounded
  rect(18, 48, 6, 4, "5"), px(20, 49, "s"), rect(74, 48, 6, 4, "5"), px(76, 49, "s"),                    // armbands
])
unit("ricm", () => [
  vgrad(0, 0, CW, 48, "=~45", 1, 2), ...mud(44, CW, CH, 14), craters([[88, 68, 12], [24, 72, 8]]),
  stamp("_sol", 60, 34), stamp("_sol", 96, 42),
  stamp("_sol", 12, 36), vline(32, 4, 44, "W"), rect(34, 4, 10, 14, "n"), rect(44, 4, 10, 14, "5"), rect(54, 4, 10, 14, "s"),   // the regiment's colours
  rect(34, 18, 30, 2, "y"), (c) => { for (let x = 34; x < 64; x += 3) c.px(x, 20, "Y") },
])
unit("pigeon", () => [
  ...front(2, 52, "+=~89"), ...mud(52, CW, CH, 15),
  rect(0, 28, 44, 52, "l"), rect(0, 28, 44, 4, "5"), rect(10, 44, 20, 8, "k"), vline(42, 28, 52, "m"), (c) => { for (let y = 36; y < 80; y += 8) c.hline(0, y, 44, "m") },   // fort embrasure
  smokeP([[68, 60, 10, 0], [84, 52, 12, 1], [60, 44, 8, 1]]),
  stamp("_pigeon", 60, 12), stamp("_pigeon", 92, 6),
])

// Orders are side-neutral: one illustration each.
order("pilonnage",
  ...front(1, 48, "+=~89"), ...mud(50, CW, CH, 16), craters([[40, 68, 12, true], [100, 72, 10]]),
  stamp("_geyser", 8, 12), stamp("_geyser", 46, 18), stamp("_boom", 78, 18), stamp("_geyser", 100, 14),
  stamp("_stump_c", 68, 28), stamp("_stump_c", 120, 32))
order("barrage_roulant",
  ...front(4, 44, "+=~89"), ...mud(44, CW, CH, 17),
  stamp("_boom", 12, 14), stamp("_geyser", 52, 8), stamp("_boom", 80, 12), stamp("_geyser", 106, 10),
  smokeP([[20, 40, 12, 0], [60, 38, 14, 1], [100, 40, 12, 0]]),
  stamp("_sol", 10, 46), stamp("_sol", 50, 48), stamp("_sol", 90, 46))
order("trommelfeuer",
  vgrad(0, 0, CW, 56, "bBn7", 1, 2), hills(48, 3, "b", 2, 60), rect(0, 58, CW, 22, "B"), hline(0, 58, CW, "b"),
  (c) => { for (const [fx, fy] of [[12, 44], [36, 42], [60, 46], [84, 40], [108, 44], [24, 52], [96, 52]]) { c.circ(fx, fy, 3, "L"); c.circ(fx, fy, 1, "K") } },
  (c) => { for (const [sx, sy] of [[16, 6], [40, 14], [72, 4], [100, 18], [120, 8]]) c.px(sx, sy, "N") },
  glow("LK", { r: 14, strength: 0.6 }))
order("gaz",
  ...front(3, 36, "+2=3"), ...mud(38, CW, CH, 18),
  (c) => { for (const [x, y, r, k] of [[88, 48, 18, 1], [116, 40, 16, 0], [60, 56, 14, 1], [104, 60, 16, 2], [124, 60, 12, 1], [76, 36, 12, 0], [44, 64, 10, 1]]) { c.circ(x, y, r, k ? "$" : "@"); c.circ(x - 3, y - 3, r - 5, k === 2 ? "$" : "@") } },
  rect(0, 66, CW, 14, "t"), bags(0, 66, 60, 1),
  stamp("_masked", 8, 36))
order("coup_de_main",
  vgrad(0, 0, CW, 52, "bBn", 1, 2), circ(92, 12, 3, "5"), glow("5", { r: 16, strength: 0.5 }),   // star shell
  hills(48, 2, "b", 3, 56), rect(0, 54, CW, 26, "B"), wireRow(8, 124, 60, "n"),
  stamp("_kneel", 20, 44, { swap: NIGHT }), stamp("_kneel", 60, 46, { swap: NIGHT }))
order("releve",
  ...front(5, 40, "+=~89"), ...mud(42, CW, CH, 19),
  poly([0, 64, 128, 52, 128, 62, 0, 76], "T"), hline(0, 64, 128, "t"),                        // road out of the line
  stamp("_sol", 88, 20, { flip: "x" }), stamp("_sol", 60, 24, { flip: "x" }), stamp("_sol", 32, 28, { flip: "x" }), stamp("_sol", 4, 32, { flip: "x" }))
order("tenir",
  ...front(6, 40, "+2=3~"), ...mud(40, CW, CH, 20), ...trench(56),
  stamp("_sol", 44, 12),
  stamp("_kneel", 4, 32), stamp("_kneel", 88, 32))

// Card back for face-down cards: horizon blue, an Adrian helmet seen from the side.
scene("c_back", { w: CW, h: CH, bg: "U" },
  (c) => { for (let i = -CH; i < CW; i += 8) c.line(i, CH - 1, i + CH, 0, "u") },
  box(2, 2, CW - 4, CH - 4, "V"), box(4, 4, CW - 8, CH - 8, "u"),
  circ(64, 40, 22, "u"), ring(64, 40, 22, "V"), ring(64, 40, 19, "v"),
  clip((x, y) => y < 45, ellipse(64, 45, 17, 12, "v")), (c) => { c.light((x, y) => c.is(x, y, "v") && Math.hypot(x - 58, y - 38) < 8); c.shade((x, y) => c.is(x, y, "v") && x > 72) }, rect(42, 44, 44, 3, "V"), hline(42, 47, 44, "U"), hline(48, 40, 32, "U"),
  poly([60, 33, 68, 33, 66, 28, 62, 28], "V"), hline(61, 28, 6, "5"))

const CARDS = ["canon75", "obusier155", "crapouillot", "poilus", "chasseurs", "mitrailleuse", "nettoyeurs", "lance_flammes", "sapeurs", "terrassiers", "telephonistes", "officier", "escadrille", "brancardiers", "ricm", "pigeon"]
const ORDERS = ["pilonnage", "barrage_roulant", "trommelfeuer", "gaz", "coup_de_main", "releve", "tenir", "back"]
scene("contact_cards", { w: 4 * 130 + 2, h: 10 * 82 + 2, bg: "k" },
  ...CARDS.map((n, i) => stamp("c_" + n, 2 + (i % 2) * 260, 2 + Math.floor(i / 2) * 82)),
  ...CARDS.map((n, i) => stamp("c_" + n + "_x", 132 + (i % 2) * 260, 2 + Math.floor(i / 2) * 82)),
  ...ORDERS.map((n, i) => stamp("c_" + n, (i % 4) * 130 + 2, 2 + (8 + Math.floor(i / 4)) * 82)))

// ------------------------------------------------------------------ terrains (320x144)
const terrain = (name, ...items) => scene("t_" + name, { w: TW, h: TH, bg: "4" }, ...items)
const stamps = (name, pts) => (c) => { for (const [x, y, o] of pts) c.stamp(name, x, y, o) }
const frontT = (seed = 1, hor = 56, keys = "1+2=3~4") => [sky(TW, hor, keys), stamp("_cloud_far", 30 + seed * 37 % 200, 10 + seed % 3 * 6), stamp("_cloud_b", 200 - seed * 29 % 150, 20),
  hills(hor - 4, 3, "%", seed, 80, TW), (c) => { for (let x = 6 + seed % 9; x < TW; x += 22 + seed % 9) { c.vline(x, hor - 14 - (x % 7), 14, "&"); if (x % 3 === 0) c.line(x, hor - 10, x + 4, hor - 14, "&") } }]
// Helmets showing above a parapet: Adrian crests, or German Stahlhelme.
const helmets = (list, x = "") => (c) => { for (const [hx, hy] of list) c.grid(hx, hy, x ? "...HHHH...\n..HhhhhG..\n.GGhhhhGG." : "....vV....\n..VVvvvU..\nUUUUUUUUUU") }
// Concrete fort: earth-covered casemate, armoured turret, embrasures, a cratered glacis.
const fort = (x0, y0, w, { turret = true, snow = false } = {}) => (c) => {
  c.poly([x0 - 40, y0 + 36, x0, y0, x0 + w, y0, x0 + w + 40, y0 + 36], snow ? "4" : "T"); c.poly([x0 - 40, y0 + 36, x0, y0, x0 + 8, y0, x0 - 28, y0 + 36], snow ? "5" : "q")   // earth cover, its lit slope
  c.hline(x0, y0, w, snow ? "5" : "Q")
  c.rect(x0 + 12, y0 + 16, w - 24, 24, "l"); c.hline(x0 + 12, y0 + 16, w - 24, "5"); c.vline(x0 + w - 13, y0 + 16, 24, "m"); c.rect(x0 + 12, y0 + 36, w - 24, 4, "m")
  for (let ex = x0 + 24; ex < x0 + w - 28; ex += 28) { c.rect(ex, y0 + 24, 16, 6, "k"); c.hline(ex - 2, y0 + 30, 20, "M") }
  for (let x = x0 + 16; x < x0 + w - 16; x += 10) c.vline(x, y0 + 32, 4, "m")                                               // rain streaks
  if (turret) { const cx = x0 + w / 2; c.ellipse(cx, y0, 16, 8, "I"); c.rect(cx - 17, y0, 34, 9, "_"); c.ellipse(cx, y0, 16, 8, "I"); c.ellipse(cx - 3, y0 - 3, 8, 3, "j"); c.line(cx + 12, y0 - 2, cx + 30, y0 - 6, "i", 3) }
}
// Razed village: stubs of walls of uneven height, rubble, the stump of a church.
const stub = (x, base, w, h) => (c) => {
  for (let i = 0; i < w; i++) { const hh = Math.max(4, Math.round(h * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.35 + x))))); c.vline(x + i, base - hh, hh, i > w * 0.7 ? "m" : "l"); c.px(x + i, base - hh, "M") }
  c.hline(x, base - 6, w, "m"); c.hline(x, base - 12, w, "m")
}
const rubbleV = (list) => (c) => { for (const [x, y, r] of list) { c.ellipse(x, y, r, Math.ceil(r / 2), "M"); c.ellipse(x - 1, y - 1, r - 2, Math.max(1, Math.ceil(r / 2) - 1), "m"); c.px(x - r / 2, y - 1, "l"); c.rect(x + r - 4, y, 3, 2, "s") } }

terrain("tranchee",
  ...frontT(1, 52), ...mud(56, TW, TH, 1), stamps("_stump_c", [[60, 36], [240, 32]]), stamp("_stump_a", 280, 12),
  wireRow(12, 308, 68), craters([[120, 80, 12], [208, 84, 10]]),
  ...trench(104, 40, TW), helmets([[44, 92], [128, 92], [236, 92]]),
  stamp("_sol", 172, 80),
  rect(280, 108, 28, 24, "k"), rect(278, 106, 32, 4, "x"), vline(280, 108, 24, "x"), vline(306, 108, 24, "x"))     // dugout door

terrain("no_mans_land",
  vgrad(0, 0, TW, 60, "=~4", 1, 2), hills(52, 2, "%", 2, 64, TW), ...mud(60, TW, TH, 2),
  craters([[40, 88, 20, true], [124, 76, 14, true], [208, 100, 24, true], [284, 80, 16, true], [88, 124, 18, true], [260, 128, 14], [172, 128, 10], [16, 120, 10]]),
  stamps("_stumps", [[68, 36], [160, 44], [296, 40], [228, 52]]),
  (c) => { for (const [x, y] of [[140, 100], [152, 98], [164, 102]]) c.ring(x, y, 4, "I") }, line(132, 104, 140, 92, "W", 2), line(172, 104, 168, 92, "W", 2),   // what is left of the wire
  line(104, 68, 116, 62, "x", 2), px(117, 61, "j"), px(118, 60, "J"))                                                         // abandoned rifle

terrain("barbeles",
  ...frontT(3, 56), ...mud(60, TW, TH, 3),
  stamps("_stumps", [[20, 20], [280, 24]]),
  wireRow(0, 320, 76), wireRow(12, 320, 96), wireRow(0, 320, 120, "j"), wireRow(12, 320, 140, "j"),
  (c) => { for (let x = 8; x < TW; x += 18) c.line(x, 80 + (x % 5), x + 12, 116, "I") },                                     // diagonal strands between rows
  craters([[72, 108, 10], [240, 132, 12]]))

terrain("crateres",
  vgrad(0, 0, TW, 44, "1+2=3~4", 1.2, 2), hills(40, 2, "%", 4, 48, TW), ...mud(44, TW, TH, 4),
  craters([[28, 60, 18, true], [88, 56, 14, true], [152, 64, 22, true], [228, 56, 16, true], [292, 64, 18, true],
           [56, 92, 24, true], [140, 104, 28, true], [236, 96, 26, true], [20, 128, 16, true], [96, 132, 18, true], [196, 136, 20, true], [296, 124, 18, true]]),
  (c) => { for (const [x, y] of [[152, 64], [140, 104], [236, 96]]) c.hline(x - 6, y + 2, 6, "3") },                         // sky in the puddles
  stamp("_stump_c", 116, 68), stamp("_stump_b", 264, 60))

terrain("fort",
  ...frontT(5, 68), ...mud(68, TW, TH, 5), fort(88, 56, 144),
  craters([[40, 112, 16], [120, 124, 14, true], [200, 116, 12], [280, 128, 18, true], [260, 96, 10]]), wireRow(0, 320, 132))

terrain("cote",
  sky(TW, 92, "+=~89"), hills(84, 4, "%", 1, 100, TW), rect(0, 100, TW, 44, "%"),
  // bare hill, ploughed by shells, a trench line along the crest
  flankShade((x) => Math.round(124 - 80 * Math.exp(-(((x - 168) / 92) ** 2))), 0, TW, "QqTt"),
  (c) => { const top = (x) => Math.round(124 - 80 * Math.exp(-(((x - 168) / 92) ** 2))); for (let x = 60; x < 280; x += 6) c.rect(x, top(x) + 18 + (x % 2), 5, 3, "t") },
  craters([[80, 100, 10], [140, 68, 8], [200, 76, 10], [252, 104, 12], [120, 124, 14], [40, 132, 10]]),
  stamp("_geyser", 224, 28), stamp("_geyser", 104, 44),
  vline(168, 24, 20, "W"), hline(162, 30, 13, "W"))                                                                            // wooden cross on the top

terrain("ruines",
  vgrad(0, 0, TW, 80, "2=~48", 1, 2), hills(72, 2, "%", 3, 88, TW),
  smokeP([[80, 32, 12, 0], [92, 16, 14, 1], [240, 36, 10, 0], [252, 20, 14, 1]]),
  rect(148, 40, 20, 48, "l"), rect(160, 40, 8, 48, "m"), poly([148, 40, 156, 28, 168, 40], "l"), rect(154, 52, 6, 12, "k"),   // church stump
  stub(12, 92, 52, 28), stub(80, 92, 36, 16), stub(192, 92, 44, 24), stub(256, 92, 52, 18),
  ...mud(88, TW, TH, 6),
  rubbleV([[28, 104, 14], [104, 112, 10], [208, 104, 12], [280, 116, 16], [160, 128, 12], [60, 132, 10]]),
  craters([[128, 100, 12, true], [236, 132, 14, true]]),
  rect(288, 60, 4, 36, "W"), rect(276, 60, 28, 10, "5"), hline(280, 64, 20, "k"))                                            // signpost: the only trace of the name

terrain("bois",
  vgrad(0, 0, TW, 80, "2=~4", 1, 2), hills(68, 3, "%", 4, 84, TW),
  (c) => { for (let x = -4; x < TW; x += 18) c.stamp("_stump_c", x, 48 + (x % 3) * 2, { swap: BACK }) }, ...mud(80, TW, TH, 7), vgrad(0, 80, TW, 8, "^q", 1, 2),
  stamps("_stump_d", [[16, 16], [80, 8], [152, 20], [224, 12], [292, 18]]), stamps("_stump_a", [[48, 40], [120, 44], [192, 36], [260, 44]]),
  (c) => { for (const [x, y] of [[36, 92], [104, 96], [180, 88], [244, 100], [300, 92], [140, 124], [60, 128], [220, 132]]) { c.line(x, y, x + 20, y + 4, "W", 3); c.line(x, y - 1, x + 20, y + 3, "x") } },   // felled trunks
  craters([[80, 116, 12], [280, 124, 14, true]]))

terrain("boyau",
  ...frontT(5, 48), ...mud(48, TW, TH, 8),
  (c) => {                                                                                                                      // zigzag communication trench
    const pts = [[160, 52], [128, 68], [184, 84], [112, 104], [200, 124], [140, 144]]
    for (let i = 1; i < pts.length; i++) { const [x1, y1] = pts[i - 1], [x2, y2] = pts[i]; const w = 6 + i * 4; c.line(x1, y1, x2, y2, "t", w); c.line(x1, y1 - 1, x2, y2 - 1, "T", Math.max(2, w - 8)) }
  },
  stamp("_sol", 148, 76), stamp("_sol", 120, 92, { flip: "x" }),
  craters([[52, 80, 14, true], [260, 92, 16], [40, 124, 12], [280, 128, 14, true]]), stamps("_stumps", [[60, 20], [248, 24]]))

terrain("depot",
  ...frontT(6, 52, "+=~89"), ...mud(52, TW, TH, 9),
  poly([0, 60, 100, 44, 140, 60, 140, 100, 0, 100], "T"), poly([0, 60, 100, 44, 108, 48, 8, 64], "q"), rect(36, 68, 44, 32, "k"), rect(32, 64, 52, 6, "W"), vline(34, 68, 32, "x"), vline(80, 68, 32, "x"),   // dugout entrance
  (c) => { for (let r = 0; r < 4; r++) for (let sx = 160 + (r % 2) * 6; sx < 280 - r * 12; sx += 12) { c.ellipse(sx, 100 - r * 8, 4, 4, "y"); c.px(sx - 2, 98 - r * 8, "Y"); c.hline(sx - 4, 104 - r * 8, 9, "T"); c.rect(sx - 1, 95 - r * 8, 2, 2, "I") } },   // stacked shells
  (c) => { for (const [x, y] of [[100, 108], [124, 112], [288, 104]]) { c.rect(x, y, 20, 14, "x"); c.box(x, y, 20, 14, "W"); c.line(x, y, x + 19, y + 13, "W") } },   // crates
  hline(0, 132, TW, "I"), hline(0, 138, TW, "I"), (c) => { for (let x = 4; x < TW; x += 12) c.rect(x, 130, 4, 12, "W") },   // narrow-gauge rail
  rect(200, 116, 36, 12, "I"), hline(200, 116, 36, "j"), circ(206, 130, 4, "i"), circ(230, 130, 4, "i"))                       // wagon

// Campaign terrains with their own picture.
terrain("bois_caures",
  vgrad(0, 0, TW, 80, "=~45", 1, 2), hills(68, 3, "4", 4, 84, TW),
  rect(0, 80, TW, 64, "5"), (c) => { for (let y = 92; y < 144; y += 14) for (let x = (y * 5) % 80; x < TW; x += 92) { c.hline(x, y, 44, "4"); c.hline(x + 6, y + 1, 28, "~") } },
  stamps("_snowstump", [[16, 20], [72, 12], [140, 24], [208, 16], [280, 22]]), stamps("_stump_b", [[48, 44], [112, 48], [184, 40], [252, 48]]),
  stamp("_boom", 100, 60), stamp("_geyser", 236, 44),
  rect(0, 116, TW, 28, "t"), bags(0, 114, TW, 2), (c) => { for (let x = 0; x < TW; x += 4) c.px(x, 108, "5") },
  helmets([[60, 102], [172, 102], [268, 102]]),
  (c) => { const r = c.rng(7); for (let i = 0; i < 120; i++) { const x = Math.floor(r() * TW), y = Math.floor(r() * TH); c.px(x, y, "5"); if (r() < 0.3) c.px(x + 1, y, "5") } })   // snowfall

terrain("fort_douaumont",
  vgrad(0, 0, TW, 72, "=~45", 1, 2), ...mud(72, TW, TH, 10), fort(60, 52, 200),
  craters([[24, 116, 16, true], [100, 128, 18], [180, 120, 14, true], [260, 132, 18], [300, 104, 12], [152, 100, 10]]),
  stamp("_geyser", 264, 20), wireRow(0, 320, 140))

terrain("mort_homme",
  sky(TW, 100, "+2=3~"), rect(0, 100, TW, 44, "3"), hills(96, 2, "%", 2, 120, TW), smokeP([[60, 60, 16, 0], [72, 40, 18, 1], [88, 20, 16, 2], [236, 56, 14, 0], [248, 36, 16, 1]]),
  // the flattened summit, chalk showing through the torn earth
  flankShade((x) => Math.round(116 - 68 * Math.exp(-(((x - 160) / 112) ** 4))), 0, TW, "QqTt"),
  (c) => { const top = (x) => Math.round(116 - 68 * Math.exp(-(((x - 160) / 112) ** 4))); for (let i = 0; i < 50; i++) { const x = (i * 41) % TW, y = top(x) + 6 + (i * 7) % 40; c.hline(x, y, 6, i % 2 ? "l" : "m"); c.px(x + 1, y - 1, "5") } },
  craters([[60, 68, 12], [128, 60, 14], [200, 64, 12], [268, 76, 10], [100, 96, 16], [180, 100, 14], [240, 112, 16], [40, 112, 12]]),
  stamp("_geyser", 144, 12), stamp("_boom", 216, 28))

terrain("fort_vaux",
  sky(TW, 60, "+=~89"), ...mud(56, TW, TH, 11),
  rect(60, 28, 200, 80, "l"), rect(60, 28, 200, 6, "5"), vline(258, 28, 80, "m"),                                             // the fort's gorge wall
  (c) => { for (let y = 44; y < 108; y += 12) { c.hline(60, y, 200, "m"); for (let x = 60 + (y % 24); x < 260; x += 24) c.vline(x, y - 11, 11, "m") } },
  rect(140, 60, 40, 48, "k"), rect(136, 56, 48, 6, "M"), rect(144, 68, 32, 40, "M"), rect(146, 70, 28, 38, "0"),               // entrance corridor
  rect(80, 48, 20, 8, "k"), rect(220, 48, 20, 8, "k"),
  poly([60, 28, 44, 108, 60, 108], "T"), poly([260, 28, 276, 108, 260, 108], "T"),
  craters([[32, 124, 16, true], [292, 128, 18], [104, 132, 12], [220, 128, 14, true]]),
  stamp("_pigeon", 240, 8), smokeP([[80, 20, 10, 1], [200, 16, 12, 0]]))

terrain("fleury",
  vgrad(0, 0, TW, 60, "=~4", 1, 2), hills(52, 2, "%", 7, 64, TW), ...mud(60, TW, TH, 12),
  craters([[32, 80, 18, true], [104, 72, 16], [184, 84, 20, true], [260, 76, 16], [60, 116, 20], [148, 124, 18, true], [232, 120, 22], [300, 112, 14, true]]),
  (c) => { for (const [x, y] of [[88, 96], [124, 100], [208, 104], [280, 92], [20, 100]]) { c.rect(x, y, 6, 4, "l"); c.hline(x, y + 3, 6, "m"); c.px(x + 2, y - 1, "M") } },   // scattered stones: all that is left of the village
  stub(128, 88, 20, 12),
  rect(244, 52, 4, 36, "W"), rect(228, 52, 36, 10, "5"), hline(232, 56, 28, "k"))

// ------------------------------------------------------------------ attribute icons (value chips)
// One-colour silhouettes: they sit on the coloured chip, holes let the chip colour through.
sprite("i_art", `
  ...........kk
  .........kkkk
  .......kkkk..
  ..kkkkkkk....
  .kkkkkkk.....
  kk.kkkk......
  ..k.k.k......
  .kk.kkk......
  ..k.k.k......
  ...kkk.......`)
sprite("i_inf", `
  ......k......
  .....kkk.....
  ...kkkkkkk...
  ..kkkkkkkkk..
  ..kkkkkkkkk..
  .kkkkkkkkkkk.
  kkkkkkkkkkkkk
  kkk.......kkk`)
sprite("i_gen", `
  kkk.......kk.
  .kkk.....kkkk
  ..kkk...kkkk.
  ...kkk.k.kk..
  ....kkk......
  ....kkkk.....
  ...kk..kk....
  ..kk....kk...
  .kk......kk..
  kk........kk.`)
sprite("i_moral", `
  kk.........
  kkkkkkkkk..
  kkkkkkkkkk.
  kkkkkkkkkkk
  kkkkkkkkkk.
  kkkkkkkkk..
  kk.........
  kk.........
  kk.........
  kk.........`)

// ------------------------------------------------------------------ initiative coin (64x64), struck in relief
// coin_0 = the player (the French cockade), coin_1 = the enemy (the iron cross).
const disc = (r, col) => (c) => { for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) if (Math.hypot(x - 31.5, y - 31.5) <= r) c.px(x, y, col) }
sprite("coin_0", { w: 64, h: 64 }, coinDisc("u", "U", "v", "u"), disc(21, "n"), disc(14.5, "5"), disc(7.5, "s"),
  (c) => { for (let a = 0; a < 64; a++) { const t = a / 64 * Math.PI * 2; c.px(Math.round(31.5 + Math.cos(t) * 21), Math.round(31.5 + Math.sin(t) * 21), Math.cos(t) + Math.sin(t) < 0 ? "N" : "B") } },
  ring(32, 32, 14, "4"), (c) => { c.px(26, 24, "S"); c.px(27, 24, "S"); c.px(26, 25, "S") })
sprite("coin_1", { w: 64, h: 64 }, coinDisc("g", "G", "h", "g"),
  // cross pattée: arms widen toward the ends, a white border, struck in relief
  (c) => { for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { const dx = Math.abs(x - 31.5), dy = Math.abs(y - 31.5); if (Math.max(dx, dy) > 21) continue
    const arm = (a, b) => a <= 3 + b * 0.38; if (arm(dx, dy) || arm(dy, dx)) c.px(x, y, "&") } },
  relief("&", "5", "5", "4"),
  (c) => { for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) { const dx = Math.abs(x - 31.5), dy = Math.abs(y - 31.5); if (Math.max(dx, dy) > 18.5) continue
    const arm = (a, b) => a <= 1.8 + b * 0.36; if (arm(dx, dy) || arm(dy, dx)) c.px(x, y, x + y < 60 ? "i" : "k") } })

// ------------------------------------------------------------------ campaign map (640x280)
// Same frame as campaign.js project(): lon 5.18..5.56, lat 49.29..49.15. Staff map of the Verdun sector: the Meuse,
// the wooded Côtes de Meuse, the forts, the shell-ploughed ground of the front. Battle markers are HTML on top.
const P = (lon, lat) => [Math.round((lon - 5.18) * MW / 0.38), Math.round((49.29 - lat) * MH / 0.14)]
const path = (pts) => pts.flatMap(([lon, lat]) => P(lon, lat))
const blob = (lon, lat, rx, ry, key) => (c) => { const [x, y] = P(lon, lat); c.ellipse(x, y, rx, ry, key) }
const MEUSE = [[5.405, 49.13], [5.39, 49.155], [5.383, 49.165], [5.372, 49.18], [5.368, 49.2], [5.362, 49.215], [5.352, 49.232], [5.338, 49.25], [5.318, 49.262], [5.3, 49.272], [5.288, 49.285], [5.28, 49.3]]
const FORTS = [[5.438, 49.216], [5.47, 49.197], [5.43, 49.178], [5.455, 49.172], [5.408, 49.165], [5.36, 49.17], [5.335, 49.19], [5.49, 49.17]]
scene("map_verdun", { w: MW, h: MH, bg: "l" },
  (c) => { const r = c.rng(3); for (let i = 0; i < 600; i++) c.hline(Math.floor(r() * MW), Math.floor(r() * MH), 3 + Math.floor(r() * 5), "m") },   // field boundaries on the paper
  // the Woëvre plain to the east, low and wet
  poly(path([[5.5, 49.3], [5.6, 49.3], [5.6, 49.14], [5.52, 49.14], [5.5, 49.18], [5.515, 49.22], [5.5, 49.26]]), "d"),
  // woods of the Côtes de Meuse
  ...[[5.395, 49.268, 32, 12], [5.475, 49.262, 28, 14], [5.43, 49.245, 20, 10], [5.45, 49.205, 28, 12], [5.41, 49.2, 18, 10], [5.25, 49.27, 24, 12], [5.22, 49.205, 28, 12], [5.47, 49.18, 20, 10], [5.33, 49.2, 16, 8]].map(([lon, lat, rx, ry]) => blob(lon, lat, rx, ry, "C")),
  (c) => { const r = c.rng(5); for (let i = 0; i < 6000; i++) { const x = Math.floor(r() * MW), y = Math.floor(r() * MH); if (c.is(x, y, "C") && c.is(x + 1, y + 1, "Cc")) { c.px(x, y, "^"); c.px(x + 1, y + 1, "A") } } },   // tree crowns
  // the front of 1916: a belt of shell-ploughed ground from Mort-Homme to Vaux
  poly(path([[5.2, 49.255], [5.3, 49.25], [5.37, 49.245], [5.44, 49.235], [5.5, 49.215], [5.5, 49.19], [5.44, 49.188], [5.39, 49.19], [5.33, 49.22], [5.21, 49.215]]), "Q"),
  (c) => { const r = c.rng(9); for (let i = 0; i < 1400; i++) { const x = Math.floor(r() * MW), y = Math.floor(r() * MH); if (c.is(x, y, "Q") && c.is(x + 2, y, "Q")) { c.ellipse(x, y, 2, 1, "T"); c.px(x - 1, y - 1, "q") } } },   // craters
  // hachures on the heights: Mort-Homme, Hill 304, Pepper Hill, the Douaumont ridge
  (c) => { for (const [lon, lat, n] of [[5.268, 49.245, 10], [5.225, 49.222, 10], [5.375, 49.232, 12], [5.44, 49.218, 14], [5.43, 49.18, 10]]) { const [x, y] = P(lon, lat); for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; c.line(Math.round(x + Math.cos(a) * 8), Math.round(y + Math.sin(a) * 6), Math.round(x + Math.cos(a) * 14), Math.round(y + Math.sin(a) * 10), "T") } } },
  // rivers: the Meuse with its canal, the Ornes brook
  (c) => { const q = path(MEUSE); for (let i = 2; i < q.length; i += 2) c.line(q[i - 2], q[i - 1], q[i], q[i + 1], "Z", 6) },
  (c) => { const q = path(MEUSE); for (let i = 2; i < q.length; i += 2) c.line(q[i - 2] + 1, q[i - 1] - 1, q[i] + 1, q[i + 1] - 1, "p", 2) },
  (c) => { const q = path([[5.56, 49.26], [5.5, 49.255], [5.46, 49.25]]); for (let i = 2; i < q.length; i += 2) c.line(q[i - 2], q[i - 1], q[i], q[i + 1], "p", 2) },
  // Verdun: the town and its citadel
  (c) => { const [x, y] = P(5.385, 49.16); c.rect(x - 18, y - 8, 36, 18, "m"); c.box(x - 18, y - 8, 36, 18, "M"); const r = c.rng(2); for (let i = 0; i < 50; i++) c.rect(x - 16 + Math.floor(r() * 32), y - 6 + Math.floor(r() * 14), 2, 1, r() < 0.6 ? "s" : "R") },
  // roads out of Verdun, the Sacred Way to the south-west
  (c) => { const [vx, vy] = P(5.385, 49.16); for (const [lon, lat] of [[5.18, 49.12], [5.44, 49.24], [5.56, 49.19], [5.3, 49.3]]) { const [x, y] = P(lon, lat); c.line(vx, vy, x, y, "T", 2) } },
  // forts: concrete pentagons
  (c) => { for (const [lon, lat] of FORTS) { const [x, y] = P(lon, lat); c.poly([x, y - 6, x + 6, y - 2, x + 4, y + 4, x - 4, y + 4, x - 6, y - 2], "M"); c.poly([x, y - 4, x + 3, y - 1, x - 3, y - 1], "l"); c.px(x, y, "0") } },
  // villages: a few roofs (most of them would not survive the year)
  (c) => { for (const [lon, lat] of [[5.34, 49.252], [5.418, 49.228], [5.495, 49.21], [5.4, 49.195], [5.385, 49.25], [5.48, 49.235], [5.28, 49.23], [5.37, 49.205]]) { const [x, y] = P(lon, lat); c.grid(x - 4, y - 2, ".ss.ss.\nsRRsRRs\n.mm.mm.") } },
  // frame like a printed staff map
  box(0, 0, MW, MH, "W"), box(2, 2, MW - 4, MH - 4, "q"))
