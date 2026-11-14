// Verdun 1916 — card (64x40) and terrain (160x72) illustrations.
// Build (writes packs/verdun/out/): node ~/.claude/skills/pxl-pixel-art/bin/pxl.js build packs/verdun/art.px.js --no-preview
// Palette of the Great War: overcast skies, mud, shattered wood, horizon blue against feldgrau. Hardly any green.
pal({
  k: "#14110f", M: "#2e2f2c",
  u: "#6f777d", s: "#8f9594", S: "#b4b5a8", h: "#d2cbb0",            // overcast sky, top -> horizon
  7: "#b0704f", 8: "#d3a676",                                        // dusk
  1: "#161c2a", 2: "#263349", 3: "#40557a", 9: "#7f95b8",            // night
  w: "#efe8d6", W: "#c8c0ac",                                        // cloud, canvas, stars
  g: "#717b4a", G: "#535c37", f: "#3c4530", F: "#273024",            // what is left of the grass
  l: "#a3b4c6", o: "#7489a5", O: "#566b86", v: "#3a4960",            // French horizon blue
  Z: "#a3ab9d", a: "#7f887c", A: "#5c645b", z: "#3d433e",            // German feldgrau
  m: "#a8916b", d: "#86704f", D: "#5d4a35", e: "#3d2f22",            // mud, sandbags, wood
  t: "#a9a596", T: "#7e7a6c", q: "#55524a",                          // concrete, stone, steel
  c: "#a6b8bb", b: "#6b8590", B: "#465f6b",                          // puddles
  p: "#d9a877", P: "#ad7c52",                                        // skin
  y: "#ffe08a", Y: "#f29a3a", r: "#c8452c", R: "#7e2a22",            // fire, brick, red trousers
  x: "#bdb7aa", n: "#8d887f", N: "#5f5b55",                          // smoke
  i: "#e9eeee", I: "#b9c7cd",                                        // snow, mist
  j: "#dcc896", J: "#b9a26d",                                        // paper, chalk
  4: "#c6c26a", 5: "#949347",                                        // gas
  6: "#2e4b8f",                                                      // cockade blue
})
ramps("kFfGg", "kvOol", "kzAaZ", "keDdm", "kqTt", "kBbc", "kRrYy", "kNnx", "k123", "kJj", "kIi", "kWw", "kus", "k54")

const AXIS = { l: "Z", o: "a", O: "A", v: "z" }
const NIGHT = { l: "3", o: "2", O: "1", v: "1", p: "3", P: "2", d: "2", D: "1", M: "1", e: "1", 6: "2", 3: "3", 2: "1", m: "2" }

// ------------------------------------------------------------------ parts
sprite("_cloud_a", `
  ....wwww......
  ..wwwwwwww.ww.
  .wwwwwwwwwwwww
  wwwwwwwwwwwwWW
  .WWWWWWWWWWWW.`)
sprite("_cloud_b", `
  ...www...
  .wwwwwww.
  wwwwwwWWW
  .WWWWWW..`)

// Infantry, facing right, greatcoat. Rows 0-1 are the helmet: Adrian (crest, front and back brim) or Stahlhelm (coal scuttle).
const SOL = `
  ....vO.......
  ..OOOOOOO....
  ..vOpppP.....
  ...ppppP.....
  ...ooooo.....
  ..oloooooDMMM
  ..olooDDDMM..
  ..ooooodO....
  ..oooooOO....
  ..ooooooo....
  ...oooOO.....
  ..ooo.OO.....
  ..oo...OO....
  .ooo...oO....
  .ee....ee....
  eee....eee...`
const KNEEL = `
  ....vO......
  ..OOOOOOO...
  ..vOpppP....
  ...ppppP....
  ...ooooo....
  ..oloooooo..
  ..oloooo.pp.
  ..oooooO....
  ...dddd.....
  ...oooooooo.
  ..ooOO...oo.
  .ooOO....oo.
  eeOO.....ee.
  ee.......eee`
const STAHL = ["  ...OOOO.....", "  ..OOOOOO...."]
const hat = (grid, a, b) => { const r = grid.split("\n").filter((x) => x.trim()); r[0] = a; r[1] = b; return r.join("\n") }
sprite("_sol", { outline: "k" }, SOL)
sprite("_kneel", { outline: "k" }, KNEEL)
sprite("_sol_x", { outline: "k", swap: AXIS }, hat(SOL, ...STAHL))
sprite("_kneel_x", { outline: "k", swap: AXIS }, hat(KNEEL, STAHL[0].slice(0, -1), STAHL[1].slice(0, -1)))
sprite("_officer", { outline: "k" }, hat(SOL, "  ...RRRR.....", "  ..vvvvvvv...."))                 // kepi
sprite("_officer_x", { outline: "k", swap: AXIS }, hat(SOL, "  ...OOOO.....", "  ..vvvvvvvv..."))   // peaked cap
sprite("_sol_night", { outline: "k", swap: NIGHT }, SOL)
sprite("_kneel_night", { outline: "k", swap: NIGHT }, KNEEL)
sprite("_sol_x_night", { outline: "k", swap: { ...NIGHT, Z: "3", a: "2", A: "1", z: "1" } }, hat(SOL, ...STAHL))
// Gas mask: goggles and snout over the face.
const MASK = (grid) => grid.replace("..vOpppP", "..vOqcqP").replace("...ppppP", "...pqqqM")
sprite("_masked", { outline: "k" }, MASK(SOL))
sprite("_masked_x", { outline: "k", swap: AXIS }, MASK(hat(SOL, ...STAHL)))

// Field gun facing right: shield, spoked wheel, trail. barrel = length, up = elevation in pixels.
function gun(name, { barrel = 14, up = 3, big = false, swap } = {}) {
  const W = big ? 46 : 36, H = big ? 26 : 20
  sprite(name, { w: W, h: H, outline: "k", swap }, (c) => {
    const R = big ? 7 : 5, wx = big ? 17 : 13, wy = H - R - 1
    c.line(wx, wy, 1, H - 2, "O", 2)                                             // trail
    c.rect(0, H - 3, 4, 2, "v")                                                  // spade
    const bx = wx + 2, by = wy - (big ? 5 : 4)
    c.line(bx - 4, by + 2, bx + barrel, by - up, "o", big ? 3 : 2)              // barrel
    c.line(bx - 4, by + 1, bx + barrel, by - up - 1, "l")
    c.rect(bx - 6, by, 7, big ? 6 : 4, "O")                                      // breech / cradle
    if (!big) { c.poly([wx - 3, wy - 11, wx + 5, wy - 12, wx + 5, wy + 1, wx - 3, wy + 1], "o"); c.vline(wx + 5, wy - 12, 13, "O"); c.hline(wx - 3, wy - 11, 8, "l") }   // shield
    c.circ(wx, wy, R, "e"); c.ring(wx, wy, R, "D")
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; c.line(wx, wy, Math.round(wx + Math.cos(a) * (R - 1)), Math.round(wy + Math.sin(a) * (R - 1)), "D") }
    c.px(wx, wy, "q")
  })
}
gun("_gun75"); gun("_gun75_x", { barrel: 13, swap: AXIS })
gun("_gun155", { barrel: 22, up: 13, big: true }); gun("_gun155_x", { barrel: 18, up: 14, big: true, swap: AXIS })

// Biplane (Nieuport, cockades) or monoplane (Fokker, crosses), facing right.
function plane(name, { bi = true, swap } = {}) {
  sprite(name, { w: 34, h: 15, outline: "k", swap }, (c) => {
    c.poly([2, 7, 8, 6, 24, 5, 29, 6, 30, 8, 26, 10, 8, 9, 2, 8], "o"); c.hline(8, 6, 16, "l")   // fuselage
    c.poly([2, 7, 1, 2, 4, 2, 8, 6], "o"); c.hline(0, 7, 6, "O")                                  // fin, tailplane
    c.rect(28, 5, 3, 5, "q"); c.vline(32, 2, 11, "N"); c.px(32, 7, "M")                          // cowling, prop disc
    c.hline(10, 3, 18, "l"); c.hline(10, 4, 18, "O")                                             // top wing
    if (bi) { c.hline(12, 10, 14, "O"); c.line(13, 4, 14, 10, "q"); c.line(24, 4, 23, 10, "q") }  // lower wing, struts
    else c.line(16, 4, 20, 9, "q")
    c.px(20, 5, "p"); c.px(20, 4, "e")                                                           // pilot
    if (!swap) { c.circ(7, 7, 1, "6"); c.px(7, 7, "r"); c.px(6, 7, "w") }
    else c.grid(6, 6, "kwk\nkkk\nkwk".replace(/w/g, "w"))
  })
}
plane("_nieuport"); plane("_fokker", { bi: false, swap: AXIS })

sprite("_boom", { w: 17, h: 16 }, (c) => {
  c.circ(8, 5, 4, "N"); c.circ(4, 7, 3, "n"); c.circ(12, 6, 3, "n"); c.circ(8, 2, 2, "n")
  c.circ(8, 11, 5, "r"); c.circ(8, 11, 3, "Y"); c.circ(8, 12, 1, "y")
  c.poly([0, 16, 4, 12, 13, 12, 17, 16], "r"); c.poly([3, 16, 6, 13, 11, 13, 14, 16], "Y")
  for (const [x, y] of [[1, 9], [15, 8], [3, 4], [14, 3]]) c.px(x, y, "k")
})
// Earth burst: the column of mud a shell throws up.
sprite("_geyser", { w: 15, h: 20 }, (c) => {
  c.poly([2, 19, 5, 6, 7, 0, 9, 5, 12, 19], "D"); c.poly([4, 19, 6, 8, 7, 3, 8, 8, 10, 19], "d")
  c.circ(3, 9, 2, "D"); c.circ(11, 7, 2, "D"); c.circ(7, 2, 2, "e")
  for (const [x, y] of [[0, 4], [14, 3], [2, 1], [12, 12]]) c.px(x, y, "e")
})
// Shattered tree: a splintered trunk, a broken branch or two.
function stump(name, h, seed) {
  sprite(name, { w: 9, h }, (c) => {
    c.rect(3, 2, 3, h - 2, "e"); c.vline(3, 2, h - 2, "D")
    c.px(3, 1, "e"); c.px(5, 0, "e"); c.px(4, 1, "D")
    if (seed % 2) c.line(5, Math.round(h * 0.35), 8, Math.round(h * 0.2), "e"); else c.line(3, Math.round(h * 0.4), 0, Math.round(h * 0.25), "e")
    if (seed % 3 === 0) c.line(5, Math.round(h * 0.6), 7, Math.round(h * 0.5), "e")
  })
}
stump("_stump_a", 26, 1); stump("_stump_b", 18, 2); stump("_stump_c", 12, 3); stump("_stump_d", 34, 4)
group("_stumps", ["_stump_a", "_stump_b", "_stump_c", "_stump_d"])
sprite("_snowstump", { base: "_stump_a" }, (c) => { c.px(3, 2, "i"); c.px(4, 2, "i"); c.px(5, 1, "i") })
// Barbed wire on X stakes.
const wireRow = (x0, x1, y, key = "q") => (c) => {
  for (let x = x0; x <= x1; x += 12) { c.line(x - 2, y + 4, x + 2, y - 5, "e"); c.line(x + 2, y + 4, x - 2, y - 5, "e") }
  for (let x = x0; x < x1; x += 3) { c.ring(x, y - 1 + ((x / 3) % 2), 2, key) }
}
// Sandbag wall: rows of small rounded bags, staggered.
const bags = (x0, y0, w, rows) => (c) => {
  for (let r = 0; r < rows; r++) for (let x = x0 + (r % 2) * 3; x < x0 + w - 3; x += 6) {
    const y = y0 - r * 3; c.rect(x, y, 6, 3, "m"); c.hline(x, y + 2, 6, "d"); c.px(x, y, "d"); c.px(x + 5, y, "d")
  }
}
// Crater: dark rim, sometimes standing water.
const crater = (x, y, r, water = false) => (c) => {
  c.ellipse(x, y, r, Math.max(1, Math.ceil(r / 2.5)), "e"); c.ellipse(x, y + 1, r - 1, Math.max(1, Math.ceil(r / 3) - 1), water ? "B" : "D")
  if (water) c.hline(x - Math.floor(r / 2), y, Math.max(1, r - 2), "b")
  c.hline(x - r + 1, y - Math.ceil(r / 2.5), 2 * r - 2, "m")
}
const craters = (list, water) => (c) => { for (const [x, y, r] of list) crater(x, y, r, water)(c) }
sprite("_bomb", `
  .q.
  qMq
  qMq
  .M.
  kMk`)
sprite("_pigeon", { outline: "k" }, `
  ..tt......
  .tttt..tw.
  ttTTtttt..
  .TTTTtqy..
  ...TT.....`)

// ------------------------------------------------------------------ backdrop helpers
const sky = (w, hor, keys = "usS") => grad(0, 0, w, hor, keys, "v", 0.35)
const ridge = (y, amp, key, seed = 0, to) => (c) => {
  for (let x = 0; x < c.w; x++) {
    const top = Math.round(y + amp * Math.sin(x / 9 + seed) + amp * 0.5 * Math.sin(x / 3.7 + seed * 2))
    c.vline(x, top, (to ?? c.h) - top, key)
  }
}
const smoke = (pts, keys = "Nnx") => (c) => { for (const [x, y, r, k = 0] of pts) c.circ(x, y, r, keys[k]) }
// Churned mud from y down: two tones and a few clods. Every mark is a clod or a rut, not filler.
const mud = (y, w, h, seed = 1) => (c) => {
  c.rect(0, y, w, h - y, "d")
  for (let i = 0; i < w / 6; i++) { const x = (i * 37 + seed * 13) % w, yy = y + 2 + ((i * 11 + seed * 7) % (h - y - 2)); c.hline(x, yy, 2 + (i % 3), "D"); if (i % 2) c.px(x + 1, yy - 1, "m") }
}

// ------------------------------------------------------------------ cards (64x40)
const CW = 64, CH = 40
function unit(name, build) {
  scene("c_" + name, { w: CW, h: CH }, ...build(""))
  scene("c_" + name + "_x", { w: CW, h: CH }, ...build("_x"))
}

unit("canon75", (x) => [
  sky(CW, 22), stamp("_cloud_a", 36, 3), ridge(20, 1.2, "N", 1, 24),
  mud(23, CW, CH, 1), craters([[52, 36, 6], [8, 37, 4]]),
  stamp("_gun75" + x, 14, 15), stamp("_kneel" + x, 1, 22),
  smoke([[58, 12, 4, 1], [61, 8, 3, 2], [55, 8, 2, 2]]), poly([47, 15, 59, 9, 56, 15], "Y"), poly([47, 15, 54, 12, 53, 15], "y"), circ(48, 14, 2, "y"),
])
unit("obusier155", (x) => [
  sky(CW, 24, "u78"), ridge(21, 1, "N", 3, 26),
  mud(25, CW, CH, 2), bags(46, 34, 18, 3),
  stamp("_gun155" + x, 4, 11), stamp("_kneel" + x, 38, 22, { flip: "x" }),
  smoke([[44, 4, 4, 1], [48, 2, 3, 2], [40, 2, 2, 2]]), circ(40, 6, 2, "y"), px(42, 5, "Y"),
])
unit("crapouillot", (x) => [
  sky(CW, 18), ridge(16, 1, "N", 5, 19), mud(19, CW, CH, 3),
  rect(0, 28, CW, 12, "e"), rect(0, 28, CW, 2, "D"), bags(0, 26, CW, 2),                      // trench
  (c) => { for (let bx = 0; bx < CW; bx += 5) c.rect(bx, 37, 4, 1, "D") },                   // duckboards
  stamp("_kneel" + x, 6, 24),
  line(34, 36, 38, 27, "M", 3), rect(31, 36, 9, 2, "q"),                                     // stubby tube, baseplate
  stamp("_bomb", 46, 4), smoke([[47, 13, 2, 2], [46, 17, 1, 1]]),
])
unit("poilus", (x) => [
  sky(CW, 17), stamp("_cloud_b", 44, 3), ridge(15, 1, "N", 2, 19),
  mud(18, CW, CH, 4), craters([[30, 34, 7, true], [58, 26, 4], [6, 30, 3]]),
  stamp("_stump_b", 56, 4), stamp("_stump_c", 10, 8),
  stamp("_sol" + x, 2, 19), stamp("_sol" + x, 22, 15), stamp("_sol" + x, 43, 20),
])
unit("chasseurs", (x) => [
  sky(CW, 20, "uss"), ridge(18, 1.5, "f", 4, 22),
  stamp("_stump_d", 4, -4), stamp("_stump_a", 46, 0), stamp("_stump_b", 30, 6),
  mud(22, CW, CH, 5), rect(0, 31, CW, 9, "e"), bags(0, 30, CW, 3),
  stamp("_kneel" + x, 8, 17), stamp("_kneel" + x, 34, 17),
  line(20, 21, 27, 20, "M"), line(46, 21, 53, 20, "M"), px(28, 20, "y"),
])
unit("mitrailleuse", (x) => [
  grad(0, 0, CW, 22, "1237", "v", 0.6), ridge(20, 1, "1", 3, 24),
  mud(23, CW, CH, 6), bags(26, 33, 38, 3), rect(0, 33, CW, 7, "e"), bags(0, 34, 22, 1),
  stamp("_kneel" + x, 10, 19),
  rect(24, 21, 12, 3, "q"), hline(36, 22, 6, "M"), rect(22, 20, 4, 5, "M"), line(28, 24, 26, 29, "q"), line(30, 24, 33, 29, "q"),   // gun, water jacket, tripod
  line(42, 22, 63, 14, "y"), line(42, 23, 63, 20, "Y"), px(43, 22, "w"),                                                             // tracer
  glow("yw", { r: 5, strength: 0.4 }),
])
unit("nettoyeurs", (x) => [
  sky(CW, 14, "uss"), ridge(12, 1, "N", 6, 15), mud(14, CW, CH, 7),
  rect(0, 26, CW, 14, "e"), poly([0, 26, 64, 26, 64, 28, 0, 28], "D"), bags(30, 25, 34, 2),
  stamp("_sol" + x, 10, 10), line(22, 16, 26, 14, "t"),                                       // trench knife
  stamp("_boom", 42, 18), px(32, 4, "M"), px(33, 5, "M"),                                     // grenade arc
])
unit("lance_flammes", (x) => [
  sky(CW, 20, "u78"), ridge(18, 1, "N", 2, 21), mud(21, CW, CH, 8), bags(40, 30, 24, 3),
  stamp("_sol" + x, 4, 19), rect(4, 24, 4, 7, "q"), hline(4, 24, 4, "T"),                     // fuel tank on the back
  line(16, 26, 22, 25, "M"),
  poly([22, 24, 40, 18, 56, 22, 58, 28, 40, 30, 22, 26], "r"), poly([22, 24, 38, 21, 50, 24, 40, 27, 22, 26], "Y"), poly([22, 25, 34, 23, 40, 25, 30, 26], "y"),
  smoke([[50, 12, 5, 0], [56, 8, 4, 1], [44, 10, 3, 1]]),
  glow("Yy", { r: 7, strength: 0.5 }),
])
unit("sapeurs", (x) => [
  sky(CW, 8), mud(8, CW, 16, 9), stamp("_sol" + x, 46, -3), crater(20, 13, 4),
  rect(0, 16, CW, 24, "e"), (c) => { for (let i = 0; i < 40; i++) c.px((i * 29) % CW, 17 + (i * 13) % 22, "D") },   // chalk & clay underground
  rect(4, 24, 56, 12, "k"), rect(4, 24, 56, 1, "D"),                                          // gallery
  (c) => { for (const gx of [6, 22, 38, 54]) { c.vline(gx, 24, 12, "D"); c.vline(gx + 1, 24, 12, "d"); c.hline(gx - 1, 24, 4, "d") } },   // timbering
  stamp("_kneel" + x, 26, 23), line(37, 27, 41, 23, "D"), rect(40, 22, 3, 2, "q"),          // pick
  rect(46, 30, 5, 5, "d"), rect(52, 31, 5, 4, "D"), hline(46, 32, 11, "r"),                  // charges
  circ(14, 27, 1, "y"), glow("y", { r: 6, strength: 0.6 }),                                   // lamp
])
unit("terrassiers", (x) => [
  sky(CW, 16), ridge(14, 1, "N", 4, 17), mud(16, CW, CH, 10),
  poly([0, 27, 64, 25, 64, 40, 0, 40], "e"), poly([0, 26, 64, 24, 64, 26, 0, 28], "D"),      // trench being dug
  (c) => { for (const [mx, my] of [[8, 22], [40, 20], [56, 21]]) { c.ellipse(mx, my, 7, 3, "D"); c.ellipse(mx, my - 1, 5, 2, "d") } },   // spoil heaps
  stamp("_sol" + x, 16, 16), line(28, 22, 32, 30, "D"), rect(31, 30, 3, 2, "q"),             // shovel
  stamp("_kneel" + x, 40, 22, { flip: "x" }), line(36, 27, 33, 33, "D"),
  (c) => { for (let bx = 2; bx < CW; bx += 5) c.rect(bx, 37, 4, 1, "m") },
])
unit("telephonistes", (x) => [
  rect(0, 0, CW, CH, "e"), (c) => { for (let y = 2; y < 30; y += 6) c.hline(0, y, CW, "D") },   // dugout timber wall
  (c) => { for (const bx of [2, 30, 58]) c.rect(bx, 0, 3, 30, "D") }, rect(0, 30, CW, 10, "D"), hline(0, 30, CW, "d"),
  rect(36, 22, 18, 3, "d"), vline(38, 25, 6, "e"), vline(52, 25, 6, "e"),                   // crate table
  rect(40, 17, 8, 5, "q"), rect(41, 18, 6, 2, "T"), px(49, 18, "M"), line(48, 17, 50, 14, "M"),   // field telephone
  circ(58, 27, 3, "q"), ring(58, 27, 3, "M"), wire(48, 20, 58, 26, 3, "M"), wire(58, 25, 64, 22, 2, "M"),   // wire drum
  stamp("_kneel" + x, 18, 17), line(28, 20, 34, 18, "M"),
  circ(22, 5, 2, "y"), vline(22, 0, 3, "M"), light([22, 6, 12]),
])
unit("officier", (x) => [
  sky(CW, 18, "u78"), ridge(16, 1, "N", 7, 19), mud(18, CW, CH, 11),
  rect(0, 28, CW, 12, "e"), bags(0, 27, CW, 2), (c) => { for (let bx = 0; bx < CW; bx += 5) c.rect(bx, 37, 4, 1, "D") },
  line(30, 40, 34, 12, "e", 2), line(34, 12, 38, 8, "e"),                                     // trench ladder rail
  stamp("_officer" + x, 10, 13), px(22, 16, "t"), px(23, 16, "T"),                            // whistle
  stamp("_kneel" + x, 40, 21), stamp("_kneel" + x, 52, 22),
])
unit("escadrille", (x) => [
  sky(CW, 30), stamp("_cloud_a", 4, 4), stamp("_cloud_b", 46, 18),
  mud(30, CW, CH, 12), craters([[14, 34, 4, true], [40, 36, 5, true], [56, 32, 3]]),
  hline(0, 13, 7, "S"), hline(2, 18, 6, "S"),
  stamp(x ? "_fokker" : "_nieuport", 14, 6),
  grid(50, 20, x ? "..O..\nOOOOO\n..O..\nOOOOO" : "..A..\nAAAAA\n.AAA."), smoke([[56, 24, 1, 1], [59, 26, 2, 0]]),   // the other side's plane, going down
])
// Campaign rewards: lance_flammes is above (both decks); these are the player's only.
unit("brancardiers", () => [
  sky(CW, 18), ridge(16, 1, "N", 9, 19), mud(19, CW, CH, 13), craters([[54, 34, 6, true]]),
  stamp("_sol", 6, 18), stamp("_sol", 34, 18),
  rect(14, 24, 24, 2, "W"), hline(12, 25, 28, "e"), rect(18, 22, 12, 2, "o"), rect(30, 22, 3, 2, "p"),   // stretcher, wounded
  rect(9, 24, 3, 2, "w"), px(10, 24, "r"), rect(37, 24, 3, 2, "w"), px(38, 24, "r"),                     // armbands
])
unit("ricm", () => [
  grad(0, 0, CW, 24, "sSI", "v", 0.5), layer("fog", { density: 0.5 }, rect(0, 14, CW, 10, "I")),
  mud(22, CW, CH, 14), craters([[44, 34, 6], [12, 36, 4]]),
  stamp("_sol", 30, 17), stamp("_sol", 48, 21),
  stamp("_sol", 6, 18), vline(16, 2, 22, "e"), rect(17, 2, 5, 7, "6"), rect(22, 2, 5, 7, "w"), rect(27, 2, 5, 7, "r"),   // the regiment's colours
  rect(17, 9, 15, 1, "y"),
])
unit("pigeon", () => [
  sky(CW, 26, "u78"), ridge(22, 1, "N", 2, 27), mud(26, CW, CH, 15),
  rect(0, 14, 22, 26, "t"), rect(0, 14, 22, 2, "w"), rect(5, 22, 10, 4, "k"), vline(21, 14, 26, "T"),   // fort embrasure
  smoke([[34, 30, 5, 0], [42, 26, 6, 1], [30, 22, 4, 1]]),
  stamp("_pigeon", 30, 6), stamp("_pigeon", 46, 3),
])

// Orders are side-neutral: one illustration each.
const order = (name, ...items) => scene("c_" + name, { w: CW, h: CH }, ...items)
order("pilonnage",
  sky(CW, 24, "u78"), ridge(22, 1.5, "N", 1, 26), mud(25, CW, CH, 16), craters([[20, 34, 6, true], [50, 36, 5]]),
  stamp("_geyser", 6, 6), stamp("_geyser", 24, 9), stamp("_boom", 40, 9), stamp("_geyser", 52, 7),
  stamps2("_stump_c", [[34, 14], [60, 16]]))
order("barrage_roulant",
  sky(CW, 22, "u78"), ridge(20, 1, "N", 4, 23), mud(22, CW, CH, 17),
  stamp("_boom", 8, 8), stamp("_geyser", 26, 4), stamp("_boom", 40, 7), stamp("_geyser", 54, 5),
  smoke([[10, 20, 6, 0], [30, 19, 7, 1], [50, 20, 6, 0]]),
  stamp("_sol", 6, 24), stamp("_sol", 26, 25), stamp("_sol", 46, 24))
order("trommelfeuer",
  grad(0, 0, CW, 28, "1237", "v", 0.7), ridge(24, 1.5, "1", 2, 30), rect(0, 29, CW, 11, "2"), hline(0, 29, CW, "1"),
  (c) => { for (const [fx, fy] of [[6, 22], [18, 21], [30, 23], [42, 20], [54, 22], [12, 26], [48, 26]]) { c.circ(fx, fy, 2, "Y"); c.px(fx, fy, "y") } },
  (c) => { for (const [sx, sy] of [[8, 3], [20, 7], [36, 2], [50, 9], [60, 4]]) c.px(sx, sy, "W") },
  glow("Yy", { r: 9, strength: 0.6 }))
order("gaz",
  sky(CW, 18, "uss"), ridge(16, 1, "N", 3, 19), mud(19, CW, CH, 18),
  smoke([[44, 24, 9, 1], [58, 20, 8, 0], [30, 28, 7, 1], [52, 30, 8, 2], [62, 30, 6, 1], [38, 18, 6, 0], [22, 32, 5, 1]], "454"),
  rect(0, 33, CW, 7, "e"), bags(0, 33, 30, 1),
  stamp("_masked", 4, 18))
order("coup_de_main",
  grad(0, 0, CW, 26, "123", "v", 0.7), circ(46, 6, 2, "w"), glow("w", { r: 9, strength: 0.5 }),   // star shell
  ridge(24, 1, "1", 3, 28), rect(0, 27, CW, 13, "2"), wireRow(4, 62, 30, "1"),
  stamp("_kneel_night", 10, 22), stamp("_kneel_night", 30, 23))
order("releve",
  sky(CW, 20, "u78"), ridge(18, 1, "N", 5, 22), mud(21, CW, CH, 19),
  poly([0, 32, 64, 26, 64, 31, 0, 38], "D"), hline(0, 32, 64, "e"),                          // road out of the line
  stamp("_sol", 44, 10, { flip: "x" }), stamp("_sol", 30, 12, { flip: "x" }), stamp("_sol", 16, 14, { flip: "x" }), stamp("_sol", 2, 16, { flip: "x" }))
order("tenir",
  sky(CW, 20, "uss"), ridge(18, 1, "N", 6, 21), mud(20, CW, CH, 20),
  rect(0, 28, CW, 12, "e"), bags(0, 27, CW, 3),
  stamp("_sol", 22, 6), line(34, 11, 40, 4, "t"),                                             // bayonet
  stamp("_kneel", 2, 16), stamp("_kneel", 44, 16))

// Card back for face-down cards: horizon blue, an Adrian helmet seen from the side.
scene("c_back", { w: CW, h: CH, bg: "O" }, box(1, 1, CW - 2, CH - 2, "v"),
  (c) => { for (let i = -CH; i < CW; i += 6) c.line(i, CH - 1, i + CH, 0, "v") }, box(1, 1, CW - 2, CH - 2, "l"),
  circ(32, 20, 11, "v"), ring(32, 20, 11, "l"),
  ellipse(32, 21, 9, 5, "l"), rect(23, 21, 19, 5, "_"), rect(22, 21, 21, 2, "l"), hline(22, 22, 21, "o"), poly([30, 15, 34, 15, 33, 13, 31, 13], "w"))

const CARDS = ["canon75", "obusier155", "crapouillot", "poilus", "chasseurs", "mitrailleuse", "nettoyeurs", "lance_flammes", "sapeurs", "terrassiers", "telephonistes", "officier", "escadrille", "brancardiers", "ricm", "pigeon"]
const ORDERS = ["pilonnage", "barrage_roulant", "trommelfeuer", "gaz", "coup_de_main", "releve", "tenir", "back"]
scene("contact_cards", { w: 4 * 66 + 2, h: 10 * 42 + 2, bg: "k" },
  ...CARDS.map((n, i) => stamp("c_" + n, 2 + (i % 4) * 66, 2 + Math.floor(i / 4) * 42)),
  ...CARDS.slice(0, 13).map((n, i) => stamp("c_" + n + "_x", 2 + (i % 4) * 66, 2 + (4 + Math.floor(i / 4)) * 42)),
  ...ORDERS.map((n, i) => stamp("c_" + n, 2 + (i % 4) * 66, 2 + (8 + Math.floor(i / 4)) * 42)))

function stamps2(name, pts) { return (c) => { for (const [x, y, o] of pts) c.stamp(name, x, y, o) } }

// ------------------------------------------------------------------ terrains (160x72)
const TW = 160, TH = 72
const terrain = (name, ...items) => scene("t_" + name, { w: TW, h: TH }, ...items)
// A trench seen from the side, running across the picture: parapet of bags, dark cut, duckboards.
const trenchCut = (y, h = 10) => [rect(0, y, TW, h, "e"), rect(0, y, TW, 2, "D"), bags(0, y - 1, TW, 2),
  (c) => { for (let bx = 0; bx < TW; bx += 6) c.rect(bx, y + h - 2, 5, 1, "m") },
  (c) => { for (let px = 10; px < TW; px += 26) { c.vline(px, y + 1, h - 2, "D"); c.vline(px + 1, y + 1, h - 2, "d") } }]
// Helmets showing above a parapet.
const helmets = (list, x = "") => (c) => { for (const [hx, hy] of list) c.grid(hx, hy, x ? ".OOOO.\nOOOOOO" : "..vO..\nOOOOOOO", x ? AXIS : undefined) }

terrain("tranchee",
  sky(TW, 26), stamp("_cloud_a", 20, 5), stamp("_cloud_b", 96, 9), ridge(24, 1.2, "N", 1, 30),
  mud(28, TW, TH, 1), stamps2("_stump_c", [[30, 18], [120, 16]]), stamp("_stump_a", 140, 6),
  wireRow(6, 154, 34, "q"), craters([[60, 40, 6], [104, 42, 5]]),
  ...trenchCut(52, 20), helmets([[22, 46], [64, 46], [118, 46]]),
  stamp("_sol", 86, 40), line(98, 47, 106, 45, "M"),
  rect(140, 54, 14, 12, "k"), rect(139, 53, 16, 2, "D"), vline(140, 54, 12, "d"), vline(153, 54, 12, "d"))   // dugout door

terrain("no_mans_land",
  grad(0, 0, TW, 30, "nxS", "v", 0.35), ridge(26, 1, "N", 2, 32), mud(30, TW, TH, 2),
  layer("mist", { density: 0.35 }, rect(0, 26, TW, 8, "S")),
  craters([[20, 44, 10, true], [62, 38, 7, true], [104, 50, 12, true], [142, 40, 8, true], [44, 62, 9, true], [130, 64, 7], [86, 64, 5], [8, 60, 5]]),
  stamps2("_stumps", [[34, 18], [80, 22], [150, 20], [114, 26]]),
  (c) => { for (const [x, y] of [[70, 50], [76, 49], [82, 51]]) c.ring(x, y, 2, "q") }, line(66, 52, 70, 46, "e"), line(86, 52, 84, 46, "e"),   // what is left of the wire
  line(52, 34, 58, 31, "M"), px(58, 30, "q"),                                                 // abandoned rifle
  layer("mist2", { density: 0.25 }, rect(0, 44, TW, 6, "S")))

terrain("barbeles",
  sky(TW, 28), stamp("_cloud_b", 30, 6), stamp("_cloud_a", 112, 4), ridge(26, 1, "N", 3, 32), mud(30, TW, TH, 3),
  stamps2("_stumps", [[10, 10], [140, 12]]),
  wireRow(0, 160, 38, "q"), wireRow(6, 160, 48, "q"), wireRow(0, 160, 60, "M"), wireRow(6, 160, 70, "M"),
  (c) => { for (let x = 4; x < TW; x += 9) c.line(x, 40 + (x % 3), x + 6, 58, "q") },        // diagonal strands between rows
  craters([[36, 54, 5], [120, 66, 6]]))

terrain("crateres",
  grad(0, 0, TW, 22, "usS", "v", 0.35), ridge(20, 1, "N", 4, 24), mud(22, TW, TH, 4),
  craters([[14, 30, 9, true], [44, 28, 7, true], [76, 32, 11, true], [114, 28, 8, true], [146, 32, 9, true],
           [28, 46, 12, true], [70, 52, 14, true], [118, 48, 13, true], [10, 64, 8, true], [48, 66, 9, true], [98, 68, 10, true], [148, 62, 9, true]]),
  (c) => { for (const [x, y] of [[76, 32], [70, 52], [118, 48]]) c.hline(x - 3, y + 1, 3, "c") },   // sky in the puddles
  stamp("_stump_c", 58, 34), stamp("_stump_b", 132, 30))

// Concrete fort: earth-covered casemate, armoured turret, embrasures, a cratered glacis.
const fort = (x0, y0, w, { turret = true, snow = false } = {}) => (c) => {
  c.poly([x0 - 20, y0 + 18, x0, y0, x0 + w, y0, x0 + w + 20, y0 + 18], snow ? "I" : "D")     // earth cover
  c.hline(x0, y0, w, snow ? "i" : "d")
  c.rect(x0 + 6, y0 + 8, w - 12, 12, "t"); c.hline(x0 + 6, y0 + 8, w - 12, "w"); c.vline(x0 + w - 7, y0 + 8, 12, "T")
  for (let ex = x0 + 12; ex < x0 + w - 14; ex += 14) { c.rect(ex, y0 + 12, 8, 3, "k"); c.hline(ex - 1, y0 + 15, 10, "q") }
  if (turret) { c.ellipse(x0 + w / 2, y0, 8, 4, "q"); c.rect(x0 + w / 2 - 8, y0, 17, 4, "_"); c.ellipse(x0 + w / 2, y0, 8, 4, "q"); c.hline(x0 + w / 2 - 7, y0 - 3, 14, "T"); c.line(x0 + w / 2 + 6, y0 - 1, x0 + w / 2 + 14, y0 - 3, "M", 2) }
}
terrain("fort",
  sky(TW, 34), stamp("_cloud_a", 10, 6), ridge(30, 1, "N", 5, 36),
  mud(34, TW, TH, 5), fort(44, 28, 72),
  craters([[20, 56, 8], [60, 62, 7, true], [100, 58, 6], [140, 64, 9, true], [130, 48, 5]]), wireRow(0, 160, 66, "q"))

terrain("cote",
  sky(TW, 46, "u78"), ridge(42, 2, "N", 1, 50), rect(0, 50, TW, 22, "N"),
  (c) => {                                                                                    // bare hill, ploughed by shells
    const top = (x) => Math.round(62 - 40 * Math.exp(-(((x - 84) / 46) ** 2)))
    for (let x = 0; x < TW; x++) { const t = top(x); c.vline(x, t, TH - t, x > 90 ? "D" : "d"); c.px(x, t, "m") }
    for (let x = 30; x < 140; x += 3) c.rect(x, top(x) + 9 + (x % 2), 3, 2, "e")             // trench line along the crest
  },
  craters([[40, 50, 5], [70, 34, 4], [100, 38, 5], [126, 52, 6], [60, 62, 7], [20, 66, 5]]),
  stamp("_geyser", 112, 14), stamp("_geyser", 52, 22),
  vline(84, 12, 10, "e"), hline(81, 15, 7, "e"))                                              // wooden cross on the top

// Razed village: stubs of walls, rubble, the stump of a church.
const stub = (x, base, w, h) => (c) => {
  for (let i = 0; i < w; i++) { const hh = Math.max(2, Math.round(h * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.7 + x))))); c.vline(x + i, base - hh, hh, i > w * 0.7 ? "T" : "t") }
  c.hline(x, base - 3, w, "T")
}
terrain("ruines",
  grad(0, 0, TW, 40, "unx8", "v", 0.35), ridge(36, 1, "N", 3, 44),
  smoke([[40, 16, 6, 0], [46, 8, 7, 1], [120, 18, 5, 0], [126, 10, 7, 1]]),
  rect(74, 20, 10, 24, "t"), rect(80, 20, 4, 24, "T"), poly([74, 20, 78, 14, 84, 20], "t"), rect(77, 26, 3, 6, "k"),   // church stump
  stub(6, 46, 26, 14), stub(40, 46, 18, 8), stub(96, 46, 22, 12), stub(128, 46, 26, 9),
  mud(44, TW, TH, 6), dither(0, 44, TW, 3, "q", "d", 0.5),
  (c) => { for (const [x, y, r] of [[14, 52, 7], [52, 56, 5], [104, 52, 6], [140, 58, 8], [80, 64, 6], [30, 66, 5]]) { c.ellipse(x, y, r, Math.ceil(r / 2), "q"); c.ellipse(x - 1, y - 1, r - 1, Math.ceil(r / 2) - 1, "t"); c.px(x + r - 2, y, "R") } },
  craters([[64, 50, 6, true], [118, 66, 7, true]]),
  rect(144, 30, 2, 18, "e"), rect(138, 30, 14, 5, "w"), hline(140, 32, 10, "k"))           // signpost: the only trace of the name

terrain("bois",
  grad(0, 0, TW, 40, "sSh", "v", 0.35), ridge(34, 1.5, "N", 4, 42),
  tile("_stump_c", -2, 24, 18, 1), mud(40, TW, TH, 7), dither(0, 40, TW, 4, "G", "d", 0.4),
  stamps2("_stump_d", [[8, 8], [40, 4], [76, 10], [112, 6], [146, 9]]), stamps2("_stump_a", [[24, 20], [60, 22], [96, 18], [130, 22]]),
  (c) => { for (const [x, y] of [[18, 46], [52, 48], [90, 44], [122, 50], [150, 46], [70, 62], [30, 64], [110, 66]]) { c.line(x, y, x + 10, y + 2, "e", 2) } },   // felled trunks
  craters([[40, 58, 6], [140, 62, 7, true]]))

terrain("boyau",
  sky(TW, 24), stamp("_cloud_b", 70, 6), ridge(22, 1, "N", 5, 26), mud(24, TW, TH, 8),
  (c) => {                                                                                    // zigzag communication trench seen from above-ish
    const pts = [[80, 26], [64, 34], [92, 42], [56, 52], [100, 62], [70, 72]]
    for (let i = 1; i < pts.length; i++) { const [x1, y1] = pts[i - 1], [x2, y2] = pts[i]; const w = 3 + i * 2; c.line(x1, y1, x2, y2, "e", w); c.line(x1, y1, x2, y2, "D", Math.max(1, w - 4)) }
  },
  stamp("_sol", 74, 40), stamp("_sol", 60, 48, { flip: "x" }),
  craters([[26, 40, 7, true], [130, 46, 8], [20, 62, 6], [140, 64, 7, true]]), stamps2("_stumps", [[30, 12], [124, 14]]))

terrain("depot",
  sky(TW, 26, "u78"), ridge(24, 1, "N", 6, 28), mud(26, TW, TH, 9),
  poly([0, 30, 50, 22, 70, 30, 70, 50, 0, 50], "D"), rect(18, 34, 22, 16, "k"), rect(16, 32, 26, 3, "e"), vline(17, 34, 16, "d"), vline(40, 34, 16, "d"),   // dugout entrance
  (c) => { for (let r = 0; r < 4; r++) for (let sx = 80 + (r % 2) * 3; sx < 140 - r * 6; sx += 6) { c.ellipse(sx, 50 - r * 4, 2, 2, "J"); c.px(sx - 1, 49 - r * 4, "j"); c.hline(sx - 2, 52 - r * 4, 5, "D"); c.px(sx, 48 - r * 4, "q") } },   // stacked shells
  (c) => { for (const [x, y] of [[50, 54], [62, 56], [144, 52]]) { c.rect(x, y, 10, 7, "d"); c.box(x, y, 10, 7, "D"); c.line(x, y, x + 9, y + 6, "D") } },   // crates
  hline(0, 66, TW, "q"), hline(0, 69, TW, "q"), (c) => { for (let x = 2; x < TW; x += 6) c.vline(x, 65, 6, "e") },   // narrow-gauge rail
  rect(100, 58, 18, 6, "q"), circ(103, 65, 2, "M"), circ(115, 65, 2, "M"))                  // wagon

// Campaign terrains with their own picture.
terrain("bois_caures",
  grad(0, 0, TW, 40, "sIi", "v", 0.35), ridge(34, 1.5, "I", 4, 42),
  rect(0, 40, TW, 32, "i"), (c) => { for (let y = 46; y < 72; y += 7) for (let x = (y * 5) % 40; x < TW; x += 46) c.hline(x, y, 22, "I") },
  stamps2("_snowstump", [[8, 10], [36, 6], [70, 12], [104, 8], [140, 11]]), stamps2("_stump_b", [[24, 22], [56, 24], [92, 20], [126, 24]]),
  stamp("_boom", 50, 30), stamp("_geyser", 118, 22),
  rect(0, 58, TW, 14, "e"), bags(0, 57, TW, 2), (c) => { for (let x = 0; x < TW; x += 3) c.px(x, 55, "i") },
  helmets([[30, 51], [86, 51], [134, 51]]),
  (c) => { const r = c.rng(7); for (let i = 0; i < 70; i++) c.px(Math.floor(r() * TW), Math.floor(r() * TH), "w") })   // snowfall

terrain("fort_douaumont",
  grad(0, 0, TW, 36, "usS", "v", 0.35), layer("fog", { density: 0.4 }, rect(0, 24, TW, 14, "I")),
  mud(36, TW, TH, 10), fort(30, 26, 100),
  craters([[12, 58, 8, true], [50, 64, 9], [90, 60, 7, true], [130, 66, 9], [150, 52, 6], [76, 50, 5]]),
  stamp("_geyser", 132, 10), wireRow(0, 160, 70, "q"))

terrain("mort_homme",
  sky(TW, 50, "uss"), rect(0, 50, TW, 22, "S"), ridge(48, 1, "N", 2, 60), smoke([[30, 30, 8, 0], [36, 20, 9, 1], [44, 10, 8, 2], [118, 28, 7, 0], [124, 18, 8, 1]]),
  (c) => {                                                                                    // flattened summit, chalk showing through
    const top = (x) => Math.round(58 - 34 * Math.exp(-(((x - 80) / 56) ** 4)))
    for (let x = 0; x < TW; x++) { const t = top(x); c.vline(x, t, TH - t, "d"); c.px(x, t, "J") }
    for (let i = 0; i < 40; i++) { const x = (i * 41) % TW, y = top(x) + 3 + (i * 7) % 20; c.hline(x, y, 3, i % 2 ? "J" : "m") }
  },
  craters([[30, 34, 6], [64, 30, 7], [100, 32, 6], [134, 38, 5], [50, 48, 8], [90, 50, 7], [120, 56, 8], [20, 56, 6]]),
  stamp("_geyser", 72, 6), stamp("_boom", 108, 14))

terrain("fort_vaux",
  sky(TW, 30, "u78"), mud(28, TW, TH, 11),
  rect(30, 14, 100, 40, "t"), rect(30, 14, 100, 3, "w"), vline(129, 14, 40, "T"),           // the fort's gorge wall
  (c) => { for (let y = 22; y < 54; y += 7) c.hline(30, y, 100, "T") },
  rect(70, 30, 20, 24, "k"), rect(68, 28, 24, 3, "q"), rect(72, 34, 16, 20, "M"),           // entrance corridor
  rect(40, 24, 10, 4, "k"), rect(110, 24, 10, 4, "k"),
  poly([30, 14, 22, 54, 30, 54], "D"), poly([130, 14, 138, 54, 130, 54], "D"),
  craters([[16, 62, 8, true], [146, 64, 9], [52, 66, 6], [110, 64, 7, true]]),
  stamp("_pigeon", 120, 4), smoke([[40, 10, 5, 1], [100, 8, 6, 0]]))

terrain("fleury",
  grad(0, 0, TW, 30, "nxS", "v", 0.35), ridge(26, 1, "N", 7, 32), mud(30, TW, TH, 12),
  craters([[16, 40, 9, true], [52, 36, 8], [92, 42, 10, true], [130, 38, 8], [30, 58, 10], [74, 62, 9, true], [116, 60, 11], [150, 56, 7, true]]),
  (c) => { for (const [x, y] of [[44, 48], [62, 50], [104, 52], [140, 46], [10, 50]]) { c.rect(x, y, 3, 2, "t"); c.px(x + 1, y - 1, "T") } },   // scattered stones
  stub(64, 44, 10, 6),
  rect(122, 26, 2, 18, "e"), rect(114, 26, 18, 5, "w"), hline(116, 28, 14, "k"))

const TERRAINS = ["tranchee", "no_mans_land", "barbeles", "crateres", "fort", "cote", "ruines", "bois", "boyau", "depot", "bois_caures", "fort_douaumont", "mort_homme", "fort_vaux", "fleury"]
scene("contact_terrains", { w: 2 * 162 + 2, h: 8 * 74 + 2, bg: "k" },
  ...TERRAINS.map((n, i) => stamp("t_" + n, 2 + (i % 2) * 162, 2 + Math.floor(i / 2) * 74)))

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

// ------------------------------------------------------------------ initiative coin (32x32)
// coin_0 = the player (French cockade), coin_1 = the enemy (iron cross).
const coin = (edge, rim, lit, face) => (c) => {
  for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
    const d = Math.hypot(x - 15.5, y - 15.5)
    if (d <= 15.6) c.px(x, y, d > 14.6 ? edge : d > 12.6 ? (x + y < 28 ? lit : rim) : d > 11.7 ? edge : face)
  }
}
const disc = (r, col) => (c) => { for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) if (Math.hypot(x - 15.5, y - 15.5) <= r) c.px(x, y, col) }
sprite("coin_0", { w: 32, h: 32 }, coin("v", "o", "l", "O"), disc(10.6, "6"), disc(7.2, "w"), disc(3.8, "r"))
sprite("coin_1", { w: 32, h: 32 }, coin("z", "A", "a", "Z"),
  // cross pattée: arms widen toward the ends, white border
  (c) => { for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) { const dx = Math.abs(x - 15.5), dy = Math.abs(y - 15.5); if (Math.max(dx, dy) > 10.6) continue
    const arm = (a, b) => a <= 1.5 + b * 0.38; if (arm(dx, dy) || arm(dy, dx)) c.px(x, y, "w") } },
  (c) => { for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) { const dx = Math.abs(x - 15.5), dy = Math.abs(y - 15.5); if (Math.max(dx, dy) > 9.6) continue
    const arm = (a, b) => a <= 1.0 + b * 0.36; if (arm(dx, dy) || arm(dy, dx)) c.px(x, y, "k") } })

// ------------------------------------------------------------------ campaign map (320x140)
// Same frame as campaign.js project(): lon 5.18..5.56, lat 49.29..49.15. Staff map of the Verdun sector: the Meuse,
// the wooded Côtes de Meuse, the forts, the shell-ploughed ground of the front. Battle markers are HTML on top.
const MW = 320, MH = 140
const P = (lon, lat) => [Math.round((lon - 5.18) * MW / 0.38), Math.round((49.29 - lat) * MH / 0.14)]
const path = (pts) => pts.flatMap(([lon, lat]) => P(lon, lat))
const blob = (lon, lat, rx, ry, key) => (c) => { const [x, y] = P(lon, lat); c.ellipse(x, y, rx, ry, key) }
const MEUSE = [[5.405, 49.13], [5.39, 49.155], [5.383, 49.165], [5.372, 49.18], [5.368, 49.2], [5.362, 49.215], [5.352, 49.232], [5.338, 49.25], [5.318, 49.262], [5.3, 49.272], [5.288, 49.285], [5.28, 49.3]]
const FORTS = [[5.438, 49.216], [5.47, 49.197], [5.43, 49.178], [5.455, 49.172], [5.408, 49.165], [5.36, 49.17], [5.335, 49.19], [5.49, 49.17]]
scene("map_verdun", { w: MW, h: MH, bg: "j" },
  (c) => { const r = c.rng(3); for (let i = 0; i < 380; i++) c.hline(Math.floor(r() * MW), Math.floor(r() * MH), 2 + Math.floor(r() * 3), "J") },   // paper grain of fields
  // The Woëvre plain to the east, low and wet.
  poly(path([[5.5, 49.3], [5.6, 49.3], [5.6, 49.14], [5.52, 49.14], [5.5, 49.18], [5.515, 49.22], [5.5, 49.26]]), "g"),
  // Woods of the Côtes de Meuse.
  blob(5.395, 49.268, 16, 6, "G"), blob(5.475, 49.262, 14, 7, "G"), blob(5.43, 49.245, 10, 5, "G"), blob(5.45, 49.205, 14, 6, "G"),
  blob(5.41, 49.2, 9, 5, "G"), blob(5.25, 49.27, 12, 6, "G"), blob(5.22, 49.205, 14, 6, "G"), blob(5.47, 49.18, 10, 5, "G"), blob(5.33, 49.2, 8, 4, "G"),
  (c) => { const r = c.rng(5); for (let i = 0; i < 400; i++) { const x = Math.floor(r() * MW), y = Math.floor(r() * MH); if (c.is(x, y, "G")) c.px(x, y, r() < 0.5 ? "f" : "g") } },   // tree crowns
  // The front of 1916: a belt of shell-ploughed ground from Mort-Homme to Vaux.
  layer("front", {}, poly(path([[5.2, 49.255], [5.3, 49.25], [5.37, 49.245], [5.44, 49.235], [5.5, 49.215], [5.5, 49.19], [5.44, 49.188], [5.39, 49.19], [5.33, 49.22], [5.21, 49.215]]), "m")),
  (c) => { const r = c.rng(9); for (let i = 0; i < 700; i++) { const x = Math.floor(r() * MW), y = Math.floor(r() * MH); if (c.is(x, y, "m")) { c.px(x, y, "D"); c.px(x + 1, y, "d") } } },   // craters
  // Hachures on the heights: Mort-Homme, Hill 304, Pepper Hill, the Douaumont ridge.
  (c) => { for (const [lon, lat, n] of [[5.268, 49.245, 6], [5.225, 49.222, 6], [5.375, 49.232, 7], [5.44, 49.218, 9], [5.43, 49.18, 6]]) { const [x, y] = P(lon, lat); for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; c.line(Math.round(x + Math.cos(a) * 4), Math.round(y + Math.sin(a) * 3), Math.round(x + Math.cos(a) * 7), Math.round(y + Math.sin(a) * 5), "e") } } },
  // Rivers: the Meuse with its canal, the Ornes brook.
  (c) => { const q = path(MEUSE); for (let i = 2; i < q.length; i += 2) c.line(q[i - 2], q[i - 1], q[i], q[i + 1], "B", 3) },
  (c) => { const q = path(MEUSE); for (let i = 2; i < q.length; i += 2) c.line(q[i - 2] + 1, q[i - 1], q[i] + 1, q[i + 1], "b") },
  (c) => { const q = path([[5.56, 49.26], [5.5, 49.255], [5.46, 49.25]]); for (let i = 2; i < q.length; i += 2) c.line(q[i - 2], q[i - 1], q[i], q[i + 1], "b") },
  // Verdun: the town and its citadel at the bottom.
  (c) => { const [x, y] = P(5.385, 49.16); c.rect(x - 9, y - 4, 18, 9, "t"); c.box(x - 9, y - 4, 18, 9, "T"); for (let i = 0; i < 18; i++) c.px(x - 8 + (i * 7) % 16, y - 3 + (i * 5) % 7, i % 3 ? "r" : "R") },
  // Roads out of Verdun, the Sacred Way to the south-west.
  (c) => { const [vx, vy] = P(5.385, 49.16); for (const [lon, lat] of [[5.18, 49.12], [5.44, 49.24], [5.56, 49.19], [5.3, 49.3]]) { const [x, y] = P(lon, lat); c.line(vx, vy, x, y, "D") } },
  // Forts: concrete pentagons.
  (c) => { for (const [lon, lat] of FORTS) { const [x, y] = P(lon, lat); c.poly([x, y - 3, x + 3, y - 1, x + 2, y + 2, x - 2, y + 2, x - 3, y - 1], "q"); c.px(x, y, "t") } },
  // Villages: a few roofs (most of them would not survive the year).
  (c) => { for (const [lon, lat] of [[5.34, 49.252], [5.418, 49.228], [5.495, 49.21], [5.4, 49.195], [5.385, 49.25], [5.48, 49.235], [5.28, 49.23], [5.37, 49.205]]) { const [x, y] = P(lon, lat); c.grid(x - 2, y - 1, "rRr.\n.rrR") } },
  // Frame like a printed staff map.
  box(0, 0, MW, MH, "e"), box(1, 1, MW - 2, MH - 2, "J"))
