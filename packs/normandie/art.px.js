// Ligne de Front — card (64x40) and terrain (160x72) illustrations.
// Build (writes packs/normandie/out/): node ~/.claude/skills/pxl-pixel-art/bin/pxl.js build packs/normandie/art.px.js --no-preview
// One restrained "état-major 1944" palette: olive, khaki, sepia, rust (GDD "Direction artistique").
pal({
  k: "#14110f", M: "#2e2f2c",
  u: "#6f8fa6", s: "#9db7c4", S: "#cfd9cf", h: "#ecdcb2",            // day sky, top -> horizon
  7: "#c9774c", 8: "#eabf82",                                        // dusk
  1: "#161c2a", 2: "#263349", 3: "#40557a", 9: "#7f95b8",            // night
  w: "#f4ecd8", W: "#cdc5b0",                                        // cloud, canvas, stars
  g: "#7d9a4a", G: "#56733a", f: "#3b5230", F: "#263a26",            // vegetation
  l: "#a0a661", o: "#7a8046", O: "#585e32", v: "#3b4023",            // allied olive drab
  Z: "#a3ab9d", a: "#7f887c", A: "#5c645b", z: "#3d433e",            // axis feldgrau
  d: "#a5855a", D: "#76593b", e: "#4f3a28",                          // earth, wood
  t: "#aaa392", T: "#7e786b", q: "#55514a",                          // stone, steel
  c: "#9cc0cb", b: "#5d8ba3", B: "#3f6a85",                          // water
  p: "#d9a877", P: "#ad7c52",                                        // skin
  y: "#ffe08a", Y: "#f29a3a", r: "#c8452c", R: "#7e2a22",            // fire, brick
  x: "#bdb7aa", n: "#8d887f", N: "#5f5b55",                          // smoke
  i: "#e9eeee", I: "#b9c7cd",                                        // snow, mist
  j: "#dcc896", J: "#b9a26d",                                        // sand, paper
  6: "#3f5273",                                                      // insignia blue
})
ramps("kFfGg", "kvOol", "kzAaZ", "keDd", "kqTt", "kBbc", "kRrYy", "kNnx", "k123", "kJj", "kIi", "kWw", "kus")

const AXIS = { l: "Z", o: "a", O: "A", v: "z" }
const NIGHT = { l: "3", o: "2", O: "1", v: "1", p: "3", P: "2", d: "2", D: "1", M: "1", e: "1", 6: "2", 3: "3", 2: "1" }

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

// Infantry, facing right. Rows are edited in JS to derive headgear variants.
const SOL = `
  ...vOOO......
  ..OOOOOO.....
  ..vOpppP.....
  ...ppppP.....
  ...ooooo.....
  ..oloooooDMMM
  ..olooDDDMM..
  ..ooooodO....
  ...oooOO.....
  ...ddddd.....
  ...oooOO.....
  ..ooo.OO.....
  ..oo...OO....
  .ooo...oO....
  .ee....ee....
  eee....eee...`
const KNEEL = `
  ...vOOO.....
  ..OOOOOO....
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
const hat = (grid, a, b) => { const r = grid.split("\n").filter((x) => x.trim()); r[0] = a; r[1] = b; return r.join("\n") }
for (const [x, swap] of [["", undefined], ["_x", AXIS]]) {
  sprite("_sol" + x, { outline: "k", swap }, SOL)
  sprite("_kneel" + x, { outline: "k", swap }, KNEEL)
  sprite("_officer" + x, { outline: "k", swap }, hat(SOL, "  ..OOOOOO.....", "  ..vvvvvvvv..."))   // peaked cap
}
sprite("_resist", { outline: "k", swap: { o: "6", l: "3", O: "2", d: "D" } }, hat(SOL, "  .........    ", "  .OOOOOO......"))   // beret
sprite("_sol_night", { outline: "k", swap: NIGHT }, SOL)
sprite("_kneel_night", { outline: "k", swap: NIGHT }, KNEEL)

// Side-view tank, facing right. One body, options make Sherman / Firefly / Panzer IV / StuG.
function tank(name, { gun = 9, brake = false, turret = true, skirt = false, cross = false, swap } = {}) {
  sprite(name, { w: 50, h: 25, outline: "k", swap }, (c) => {
    const Y = 4
    c.poly([4, Y + 14, 37, Y + 14, 40, Y + 17, 37, Y + 21, 6, Y + 21, 2, Y + 17], "M")           // track run
    for (const x of [8, 13, 18, 23, 28, 33]) { c.circ(x, Y + 18, 2, "q"); c.px(x, Y + 18, "T") }  // bogies
    c.circ(37, Y + 16, 1, "T"); c.circ(4, Y + 16, 1, "T")
    c.poly([5, Y + 8, 30, Y + 8, 38, Y + 12, 38, Y + 14, 3, Y + 14, 3, Y + 10], "o")              // hull
    c.hline(5, Y + 8, 25, "l"); c.hline(3, Y + 13, 35, "O")
    c.poly([30, Y + 8, 38, Y + 12, 38, Y + 13, 31, Y + 9], "l")                                    // glacis catches the light
    c.rect(4, Y + 9, 3, 3, "D"); c.hline(4, Y + 10, 3, "e")                                        // bedroll
    if (turret) {
      c.poly([12, Y + 2, 24, Y + 2, 27, Y + 4, 27, Y + 8, 10, Y + 8, 10, Y + 4], "o")
      c.hline(12, Y + 2, 12, "l"); c.hline(10, Y + 7, 17, "O")
      c.rect(27, Y + 4, 2, 3, "O"); c.rect(15, Y + 1, 4, 1, "O")                                   // mantlet, hatch
      c.hline(29, Y + 5, gun, "o"); c.hline(29, Y + 6, gun, "O")
      if (brake) c.rect(29 + gun - 3, Y + 4, 2, 4, "O")
      c.line(11, Y + 2, 9, Y - 4, "M")                                                             // antenna
    } else {                                                                                       // casemate assault gun
      c.poly([9, Y + 4, 27, Y + 4, 32, Y + 8, 7, Y + 8], "o"); c.hline(9, Y + 4, 18, "l"); c.hline(8, Y + 7, 23, "O")
      c.rect(28, Y + 5, 3, 3, "O"); c.hline(31, Y + 6, gun, "o"); c.hline(31, Y + 7, gun, "O")
      c.rect(31 + gun - 3, Y + 5, 2, 4, "O")
    }
    if (skirt) { c.rect(5, Y + 12, 31, 4, "O"); for (const x of [11, 17, 23, 29]) c.vline(x, Y + 12, 4, "v"); c.hline(5, Y + 12, 31, "o") }
    if (cross) c.grid(17, Y + 9, "wkw\nkkk\nwkw"); else c.grid(16, Y + 9, "..w..\nwwwww\n.www.\n.w.w.")
  })
}
tank("_tank_sherman")
tank("_tank_firefly", { gun: 16, brake: true })
tank("_tank_sherman_x", { gun: 13, brake: true, skirt: true, cross: true, swap: AXIS })   // Panzer IV
tank("_tank_firefly_x", { gun: 11, turret: false, cross: true, swap: AXIS })              // StuG III
tank("_tank_jumbo", { gun: 10, skirt: true })                                               // Sherman Jumbo: appliqué armour (campaign)

// Side-view fighter, facing right. fat = P-47 / Fw 190 radial, slim = Spitfire / Bf 109 inline.
function plane(name, { fat = true, mark = "us", swap, nose } = {}) {
  sprite(name, { w: 46, h: 18, outline: "k", swap }, (c) => {
    const body = fat ? [3, 8, 9, 6, 30, 5, 38, 6, 41, 9, 38, 13, 28, 14, 10, 11, 3, 10] : [3, 8, 9, 7, 30, 6, 38, 7, 42, 9, 38, 12, 28, 13, 10, 10, 3, 10]
    c.poly(body, "o")
    c.poly(fat ? [3, 8, 9, 6, 30, 5, 38, 6, 38, 7, 9, 7, 3, 9] : [3, 8, 9, 7, 30, 6, 38, 7, 38, 8, 9, 8], "l")   // top light
    c.poly(fat ? [10, 11, 28, 13, 38, 12, 38, 13, 28, 14] : [10, 10, 28, 12, 38, 11, 38, 12, 28, 13], "O")       // belly
    c.poly([3, 8, 1, 2, 5, 2, 10, 7], "o"); c.vline(2, 3, 5, "O")                                                // fin, rudder
    c.hline(0, 8, 7, "O")                                                                                        // tailplane
    c.poly(fat ? [21, 5, 23, 3, 28, 3, 30, 5] : [22, 6, 24, 4, 28, 4, 30, 6], "c"); c.px(26, fat ? 3 : 4, "q")   // canopy
    c.poly([15, 10, 31, 10, 28, 12, 13, 12], "O"); c.hline(15, 10, 16, "v")                                      // wing root
    if (fat) c.rect(37, 6, 3, 7, nose || "O"); else c.poly([38, 7, 42, 9, 38, 12], nose || "q")                  // cowling / spinner
    c.vline(fat ? 41 : 43, 4, 11, "q"); c.px(fat ? 41 : 43, 9, "M")                                              // prop disc
    if (mark === "us") { for (let i = 0; i < 5; i++) c.vline(8 + i, 7, 4, i % 2 ? "k" : "w"); c.circ(17, 8, 2, "6"); c.grid(16, 7, ".w.\nwww\n.w.") }
    if (mark === "raf") { c.circ(15, 8, 2, "6"); c.circ(15, 8, 1, "w"); c.px(15, 8, "r"); c.recolor({ o: "G", l: "g" }, [18, 4, 24, 4, 30, 9, 24, 9]); c.recolor({ o: "G", l: "g" }, [3, 2, 6, 2, 9, 7, 5, 8]) }
    if (mark === "x") c.grid(14, 7, "wkw\nkkk\nwkw")
  })
}
plane("_plane_p47")
plane("_plane_spitfire", { fat: false, mark: "raf" })
plane("_plane_typhoon", { mark: "raf", nose: "q" })                                          // Hawker Typhoon (campaign)
plane("_plane_p47_x", { mark: "x", swap: AXIS, nose: "y" })
plane("_plane_spitfire_x", { fat: false, mark: "x", swap: AXIS, nose: "y" })

sprite("_bomber", `
  N...........N..
  NN....NNNNNNNNN
  NNNNNNNNNNNNNN.
  ......NNNN.....`)
sprite("_chute", { w: 15, h: 19 }, (c) => {
  c.ellipse(7, 7, 7, 6, "w"); c.rect(0, 7, 15, 12, "_")   // dome = top half of an ellipse
  for (const x of [3, 7, 11]) c.vline(x, 2, 5, "W")
  c.hline(1, 6, 13, "W")
  for (const x of [1, 5, 9, 13]) c.line(x, 7, 7, 13, "n")
  c.grid(6, 13, ".p.\nOoO\n.o.\n.O.\nO.O")
})
sprite("_boom", { w: 17, h: 16 }, (c) => {
  c.circ(8, 5, 4, "N"); c.circ(4, 7, 3, "n"); c.circ(12, 6, 3, "n"); c.circ(8, 2, 2, "n")   // smoke column
  c.circ(8, 11, 5, "r"); c.circ(8, 11, 3, "Y"); c.circ(8, 12, 1, "y")                        // fireball
  c.poly([0, 16, 4, 12, 13, 12, 17, 16], "r"); c.poly([3, 16, 6, 13, 11, 13, 14, 16], "Y")
  for (const [x, y] of [[1, 9], [15, 8], [3, 4], [14, 3]]) c.px(x, y, "k")                    // debris
})
sprite("_truck", { w: 38, h: 20, outline: "k" }, (c) => {
  c.rect(1, 3, 22, 12, "d"); c.hline(2, 2, 20, "d"); c.hline(1, 3, 22, "w")                  // canvas tilt
  for (const x of [6, 12, 18]) c.vline(x, 3, 11, "D")
  c.rect(1, 13, 22, 3, "O")                                                                  // bed
  c.rect(24, 6, 6, 10, "o"); c.rect(25, 7, 4, 3, "c"); c.hline(24, 6, 6, "l")               // cab
  c.rect(30, 10, 7, 6, "o"); c.hline(30, 10, 7, "l"); c.vline(36, 11, 5, "O")               // hood
  c.grid(25, 11, ".w.\nwww\n.w.")
  c.hline(1, 16, 36, "v")
  for (const x of [6, 12, 32]) { c.circ(x, 17, 2, "M"); c.px(x, 17, "q") }
})
function tree(name, s = 1) {
  const R = (v) => Math.round(v * s)
  sprite(name, { w: R(19), h: R(25) }, (c) => {
    c.rect(R(8), R(14), Math.max(2, R(3)), R(11), "e"); c.vline(R(8), R(14), R(11), "D")
    c.circ(R(9), R(8), R(7), "G"); c.circ(R(4), R(11), R(4), "G"); c.circ(R(14), R(11), R(4), "G")
    c.circ(R(12), R(11), R(4), "f"); c.circ(R(14), R(12), R(3), "F")                              // shaded side
    c.circ(R(7), R(6), R(4), "g"); c.circ(R(4), R(10), R(2), "g"); c.px(R(10), R(3), "g"); c.px(R(12), R(5), "g")   // lit clumps
  })
}
tree("_tree"); tree("_tree_big", 1.8)
sprite("_poplar", { w: 7, h: 26 }, ellipse(3, 11, 3, 11, "G"), ellipse(4, 12, 2, 9, "f"), vline(2, 3, 12, "g"), rect(3, 22, 1, 4, "e"))
sprite("_bush", `
  ...gg...GG...
  .ggGgGGGGGGf.
  gGGGGGGfGGfff
  GGGGfGGGfffFF
  fGfffffffFFFF`)
function pine(name, s = 1, snow = false, swap) {
  const R = (v) => Math.round(v * s), m = R(7.5)
  sprite(name, { w: R(15), h: R(27), swap }, (c) => {
    c.rect(m - Math.max(1, R(1)), R(22), Math.max(2, R(2)), R(27) - R(22), "e")
    for (const [y, hw] of [[16, 7], [10, 6], [5, 4], [0, 3]]) {
      c.poly([m - R(hw), R(y + 8), m, R(y), m + R(hw), R(y + 8)], "f"); c.poly([m, R(y + 2), m + R(hw), R(y + 8), m, R(y + 8)], "F")
      if (snow) { c.poly([m - R(hw - 2), R(y + 6), m, R(y), m + R(0.5), R(y + 3), m - R(1.5), R(y + 6)], "i"); c.hline(m - R(hw), R(y + 8) - 1, R(4), "I") }
    }
  })
}
pine("_pine_far", 1, false, { f: "u", F: "u", e: "u" }); pine("_pine_snow", 1.3, true); pine("_pine_big", 2.3, true)
sprite("_dead", { w: 15, h: 26 }, (c) => {                                    // drowned tree
  c.line(7, 25, 8, 4, "q", 2); c.line(8, 12, 13, 5, "q"); c.line(7, 16, 2, 9, "q"); c.line(8, 7, 5, 1, "q"); c.line(12, 7, 14, 8, "q"); c.vline(7, 6, 19, "N")
})
sprite("_hedgehog", `
  M.....M
  .M...M.
  ..MqM..
  ..qMq..
  .M.q.M.
  M..q..M`)
sprite("_lcvp", { w: 28, h: 11 }, (c) => {                                    // landing craft, ramp down
  c.poly([2, 3, 22, 3, 22, 9, 4, 9], "T"); c.hline(2, 3, 20, "t"); c.hline(4, 8, 18, "q")
  c.poly([22, 3, 23, 3, 28, 9, 22, 9], "q"); c.rect(3, 0, 5, 3, "T"); c.px(5, 1, "c")
  for (const x of [10, 13, 16, 19]) c.grid(x, 1, "O\np")
  c.hline(0, 10, 28, "w")
})

// ------------------------------------------------------------------ backdrop helpers
const sky = (w, hor, keys = "usS") => grad(0, 0, w, hor, keys, "v", 0.35)
// Rolling skyline: fills from a wavy line down to `to`.
const ridge = (y, amp, key, seed = 0, to) => (c) => {
  for (let x = 0; x < c.w; x++) {
    const top = Math.round(y + amp * Math.sin(x / 9 + seed) + amp * 0.5 * Math.sin(x / 3.7 + seed * 2))
    c.vline(x, top, (to ?? c.h) - top, key)
  }
}
// Ploughed rows converging to the horizon.
const furrows = (hor, h, key) => (c) => { for (let i = 1, y = hor + 1; y < h; y += i++ + 1) c.hline(0, y, c.w, key) }
const smoke = (pts, keys = "Nnx") => (c) => { for (const [x, y, r, k = 0] of pts) c.circ(x, y, r, keys[k]) }

// ------------------------------------------------------------------ cards (64x40)
const CW = 64, CH = 40
function unit(name, build) {
  scene("c_" + name, { w: CW, h: CH }, ...build(""))
  scene("c_" + name + "_x", { w: CW, h: CH }, ...build("_x"))
}

unit("sherman", (x) => [
  sky(CW, 20), stamp("_cloud_a", 40, 3), stamp("_cloud_b", 6, 8),
  ridge(18, 1.5, "f", 1, 22), stamp("_poplar", 52, -2), stamp("_poplar", 58, 1),
  rect(0, 21, CW, 19, "g"), furrows(21, 34, "G"),
  poly([0, 34, 64, 31, 64, 40, 0, 40], "d"), hline(0, 37, 64, "D"), dither(0, 33, 64, 2, "d", "g", 0.5),
  smoke([[3, 34, 3, 2], [0, 30, 2, 2], [7, 36, 2, 1]], "DdJ"),
  stamp("_tank_sherman" + x, 8, 11),
])
unit("firefly", (x) => [
  sky(CW, 22, "u78"), ridge(19, 1.5, "F", 3, 23), stamp("_tree", -6, 2),
  rect(0, 22, CW, 18, "G"), furrows(22, 34, "f"), poly([0, 34, 64, 33, 64, 40, 0, 40], "D"), hline(0, 38, 64, "e"),
  stamp("_tank_firefly" + x, 0, 10),
  smoke([[58, 17, 4, 1], [61, 13, 3, 2], [56, 13, 2, 2]]),
  poly([49, 20, 60, 17, 60, 24], "Y"), poly([49, 20, 56, 19, 56, 22], "y"), circ(50, 20, 2, "y"),   // muzzle blast
])
unit("section", (x) => [
  sky(CW, 16), stamp("_cloud_b", 44, 3), ridge(14, 1, "f", 2, 18),
  rect(0, 17, CW, 23, "g"), tile("_bush", -3, 13, 6, 1), rect(0, 18, CW, 2, "f"),
  dither(0, 20, CW, 5, "G", "g", 0.5), rect(0, 34, CW, 6, "G"), dither(0, 32, CW, 2, "g", "G", 0.5),
  stamp("_sol" + x, 2, 17), stamp("_sol" + x, 22, 21), stamp("_sol" + x, 43, 18),
  (c) => { for (let i = 0; i < 16; i++) { const gx = (i * 23) % 64, gy = 35 + (i * 7) % 5; c.vline(gx, gy, 2, "g"); c.px(gx + 1, gy, "g") } },   // grass tufts
])
unit("rangers", (x) => [
  sky(CW, 26, "usS"), stamp("_cloud_a", 2, 4),
  rect(0, 26, CW, 14, "b"), hline(0, 26, CW, "c"), (c) => { for (let i = 0; i < 9; i++) c.hline((i * 17) % 30, 28 + i, 5 + (i % 3), i % 2 ? "c" : "B") },
  poly([26, 40, 30, 22, 34, 20, 64, 18, 64, 40], "t"), poly([26, 40, 30, 22, 34, 20, 36, 20, 33, 40], "T"),   // cliff, shadowed face
  hline(34, 19, 30, "g"), hline(36, 18, 28, "G"),
  (c) => { for (const [sx, sy, len] of [[38, 25, 20], [36, 30, 24], [40, 35, 18]]) c.hline(sx, sy, len, "T") },   // strata
  line(33, 21, 30, 40, "D"), px(34, 20, "M"),                                                                 // grappling rope
  stamp("_sol" + x, 38, 3), stamp("_kneel" + x, 50, 5, { flip: "x" }),
])
unit("mortiers", (x) => [
  sky(CW, 18), ridge(16, 1, "f", 5, 19), rect(0, 19, CW, 21, "g"), dither(0, 19, CW, 4, "G", "g", 0.5),
  rect(0, 35, CW, 5, "d"), dither(0, 34, CW, 1, "d", "g", 0.5),
  stamp("_kneel" + x, 8, 20),
  line(38, 34, 46, 21, "M", 2), line(46, 23, 50, 35, "q"), line(46, 23, 44, 35, "q"), rect(34, 35, 8, 2, "q"),   // tube, bipod, baseplate
  rect(47, 8, 1, 3, "M"), px(47, 7, "r"), smoke([[47, 16, 2, 2], [45, 18, 2, 1]]),                                // round leaving
  (c) => { for (const [bx, by] of [[52, 34], [58, 34], [55, 31], [61, 31]]) { c.ellipse(bx, by, 3, 1, "d"); c.hline(bx - 2, by + 1, 5, "D") } },   // sandbags
])
unit("paras", (x) => [
  sky(CW, 36, "us8"), stamp("_cloud_a", 44, 22), stamp("_cloud_b", 0, 26),
  stamp("_bomber", 2, 3, { swap: { N: "q" } }),
  stamp("_chute", 12, 6), stamp("_chute", 34, 2), stamp("_chute", 46, 15),
  grid(27, 12, "w\nW"), grid(57, 6, "w\nW"), grid(6, 14, "w\nW"),                                                 // far canopies
  ridge(36, 1, "F", 4), rect(0, 38, CW, 2, "f"),
])
unit("p47", (x) => [
  sky(CW, 34, "uus"), stamp("_cloud_a", 46, 6), stamp("_cloud_b", 2, 22), stamp("_cloud_a", 34, 28),
  rect(0, 34, CW, 6, "g"), rect(10, 34, 14, 3, "G"), rect(38, 36, 20, 4, "d"), rect(0, 37, 12, 3, "G"), hline(0, 34, CW, "f"),   // fields far below
  hline(0, 13, 6, "S"), hline(2, 19, 5, "S"),                                                                                     // slipstream
  stamp("_plane_p47" + x, 8, 6),
])
unit("spitfire", (x) => [
  sky(CW, 40, "uss"), circ(9, 7, 4, "h"), ring(9, 7, 6, "S"),
  (c) => { for (let i = 0; i < 10; i++) c.circ(i * 8 - 2, 37 + (i % 3), 5, "w") }, (c) => { for (let i = 0; i < 9; i++) c.circ(i * 9 + 2, 40, 4, "W") },   // cloud deck
  hline(0, 15, 5, "S"), hline(1, 22, 6, "S"),
  stamp("_plane_spitfire" + x, 8, 9),
])
unit("genie", (x) => [
  sky(CW, 16), ridge(14, 1, "f", 6, 18), stamp("_tree", 44, -6),
  rect(0, 17, CW, 23, "g"), poly([0, 30, 64, 27, 64, 40, 0, 40], "b"), hline(0, 33, 22, "c"), hline(30, 36, 20, "B"), hline(40, 31, 16, "c"),
  poly([0, 26, 20, 24, 24, 40, 0, 40], "d"), poly([14, 25, 20, 24, 24, 40, 19, 40], "D"),                         // near bank
  rect(18, 22, 46, 3, "D"), hline(18, 22, 46, "d"),                                                                // Bailey deck
  box(22, 14, 42, 8, "q"), (c) => { for (let bx = 22; bx < 62; bx += 8) { c.line(bx, 21, bx + 7, 14, "q"); c.line(bx, 14, bx + 7, 21, "q") } },
  stamp("_kneel" + x, 2, 12), line(13, 18, 17, 13, "D"), rect(16, 12, 3, 2, "q"),                                 // sledgehammer
])
unit("officier", (x) => [
  rect(0, 0, CW, CH, "D"), poly([0, 0, 64, 0, 64, 12, 0, 20], "d"), poly([0, 20, 64, 12, 64, 14, 0, 22], "e"),    // tent slope
  vline(40, 0, 30, "e"), rect(0, 32, CW, 8, "e"), hline(0, 32, CW, "D"),
  rect(42, 24, 20, 2, "d"), vline(44, 26, 7, "D"), vline(59, 26, 7, "D"),                                          // map table
  rect(45, 21, 13, 3, "j"), line(47, 22, 54, 22, "r"), px(50, 23, "6"),
  rect(26, 22, 9, 10, "O"), rect(27, 23, 7, 3, "v"), px(28, 27, "y"), px(31, 27, "r"), vline(33, 4, 18, "M"),     // field radio
  stamp("_officer" + x, 6, 15), wire(18, 19, 27, 25, 3, "k"),
  circ(52, 5, 2, "y"), vline(52, 0, 4, "M"), light([52, 6, 11]),                                                   // lamp
])
unit("resistance", (x) => [
  sky(CW, 10, "278"), rect(0, 6, CW, 28, "t"),
  (c) => { for (let y = 9; y < 34; y += 5) { c.hline(0, y, CW, "T"); for (let bx = (y % 2) * 5; bx < CW; bx += 10) c.vline(bx, y - 4, 4, "T") } },   // stone courses
  poly([0, 6, 64, 6, 64, 3, 0, 4], "R"), hline(0, 6, CW, "e"),                                                    // eave
  rect(44, 13, 13, 21, "e"), rect(45, 14, 11, 20, "D"), vline(50, 14, 20, "e"), px(48, 25, "y"),                  // door
  line(26, 12, 29, 20, "w"), line(29, 20, 32, 12, "w"),                                                           // painted V
  rect(0, 34, CW, 6, "q"), hline(0, 34, CW, "N"), shade([0, 6, 12, 28]),
  stamp(x ? "_officer_x" : "_resist", 10, 18),
])
unit("observateur", (x) => [
  sky(CW, 22), stamp("_cloud_a", 30, 3), ridge(20, 1, "u", 2, 24),
  rect(0, 23, CW, 17, "g"), rect(30, 25, 12, 4, "G"), rect(44, 28, 14, 5, "d"), rect(28, 31, 12, 4, "j"), rect(46, 35, 18, 5, "G"),   // patchwork valley
  line(26, 39, 44, 24, "b"), line(44, 24, 64, 26, "b"),
  grid(52, 20, ".q.\n.t.\nttt\ntrt"), smoke([[58, 18, 2, 1], [60, 15, 2, 2]]),
  poly([0, 40, 0, 24, 6, 22, 22, 22, 28, 28, 30, 40], "T"), poly([22, 22, 28, 28, 30, 40, 24, 40], "q"), hline(6, 22, 16, "t"),       // rock ledge
  stamp("_kneel" + x, 6, 7), rect(17, 10, 3, 2, "M"),                                                                                  // binoculars
])

// Campaign reward cards (player only): both sides get the same picture so the gallery pairs stay complete.
const reward = (name, ...items) => unit(name, () => items)
reward("jumbo",
  sky(CW, 20, "u78"), ridge(18, 1.5, "F", 7, 22),
  rect(0, 21, CW, 19, "G"), furrows(21, 34, "f"), poly([0, 33, 64, 31, 64, 40, 0, 40], "D"), hline(0, 37, 64, "e"),
  stamp("_tank_jumbo", 8, 11),
  rect(20, 15, 12, 1, "q"), rect(16, 22, 3, 3, "q"), rect(25, 22, 3, 3, "q"),                    // welded plates
  (c) => { for (const [x, y] of [[44, 14], [47, 18], [41, 20]]) { c.px(x, y, "y"); c.px(x + 1, y, "Y") } },   // shells bouncing off
  smoke([[3, 34, 3, 2], [0, 30, 2, 2]], "DdJ"))
reward("typhoon",
  sky(CW, 28, "uus"), stamp("_cloud_a", 44, 3), ridge(26, 1, "f", 8, 30),
  rect(0, 29, CW, 11, "g"), rect(0, 34, CW, 6, "d"), hline(0, 34, CW, "D"),
  stamp("_plane_typhoon", 2, 4),
  line(40, 16, 50, 27, "x"), line(36, 17, 46, 29, "x"), px(50, 27, "y"), px(46, 29, "y"),       // rocket trails
  stamp("_boom", 45, 24))
reward("commandos",
  sky(CW, 26, "123"), circ(12, 7, 4, "w"), circ(14, 6, 4, "1"),                                  // crescent moon
  (c) => { for (const [x, y] of [[8, 4], [20, 9], [33, 3], [42, 12], [60, 15]]) c.px(x, y, "W") },
  rect(0, 26, CW, 14, "2"), (c) => { for (let i = 0; i < 7; i++) c.hline((i * 13) % 50, 29 + i * 2, 6 + (i % 3) * 2, i % 2 ? "3" : "1") },   // night sea
  poly([34, 40, 40, 22, 64, 18, 64, 40], "1"), hline(40, 22, 24, "3"),                          // dark cliff
  stamp("_lcvp", 2, 25, { swap: { q: "2", T: "3", t: "3" } }),
  stamp("_kneel_night", 38, 6), stamp("_sol_night", 50, 1))
reward("ambulance",
  sky(CW, 18), stamp("_cloud_b", 4, 3), ridge(16, 1, "f", 9, 20),
  rect(0, 19, CW, 21, "g"), rect(0, 31, CW, 6, "d"), hline(0, 31, CW, "D"), hline(0, 36, CW, "D"),
  stamp("_truck", 4, 13),
  rect(7, 17, 14, 8, "w"), rect(12, 18, 4, 6, "r"), rect(10, 20, 8, 2, "r"),                      // red cross on the canvas
  stamp("_kneel", 46, 16), rect(49, 23, 3, 2, "w"), px(50, 23, "r"))                            // medic, armband

// Orders are side-neutral: one illustration each.
const order = (name, ...items) => scene("c_" + name, { w: CW, h: CH }, ...items)
order("artillerie",
  sky(CW, 24, "u78"), ridge(22, 1, "F", 1, 26), rect(0, 25, CW, 15, "G"), rect(0, 34, CW, 6, "D"), hline(0, 34, CW, "e"),
  stamp("_kneel", 0, 21),
  line(24, 27, 46, 13, "O", 3), line(24, 26, 45, 12, "l"), poly([20, 22, 27, 18, 29, 30, 22, 31], "o"), vline(27, 19, 11, "O"),   // barrel, shield
  line(22, 31, 8, 37, "O", 2),                                                                                                       // trail
  circ(26, 32, 5, "M"), ring(26, 32, 5, "q"), circ(26, 32, 1, "q"),
  smoke([[55, 8, 5, 1], [60, 5, 4, 2], [52, 4, 3, 2]]), poly([46, 13, 60, 4, 56, 11], "Y"), poly([46, 13, 55, 7, 53, 11], "y"), circ(47, 12, 2, "y"))
order("bombardement",
  sky(CW, 30, "uus"), stamp("_cloud_b", 48, 14),
  stamp("_bomber", 4, 2), stamp("_bomber", 24, 6), stamp("_bomber", 44, 3),
  (c) => { for (const [bx, by] of [[12, 9], [14, 16], [32, 13], [34, 21], [52, 10], [50, 18]]) c.vline(bx, by, 2, "k") },
  ridge(30, 1, "F", 3), rect(0, 33, CW, 7, "f"), grid(6, 28, ".q...\n.t.tt\nttttt"), grid(50, 29, "tt.q\ntttt"),
  stamp("_boom", 14, 20), stamp("_boom", 38, 23, { flip: "x" }))
order("recon",
  sky(CW, 18), ridge(16, 1.5, "f", 2, 20), rect(0, 19, CW, 21, "g"), furrows(19, 40, "G"),
  stamp("_tank_sherman_x", 8, 8, { flip: "x" }), tile("_bush", -2, 28, 6, 1), rect(0, 33, CW, 7, "f"),
  (c) => { for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) if (Math.hypot(x - 20, y - 20) > 17 && Math.hypot(x - 43, y - 20) > 17) c.px(x, y, "k") },   // binocular mask
  hline(28, 20, 8, "k"), vline(32, 17, 7, "k"), hline(12, 20, 3, "k"), hline(49, 20, 3, "k"))
order("opsecrete",
  grad(0, 0, CW, 28, "123", "v", 0.7), circ(50, 9, 5, "i"), circ(48, 8, 1, "I"), px(52, 11, "I"),
  (c) => { for (const [sx, sy] of [[6, 4], [18, 9], [30, 3], [38, 13], [60, 20], [12, 16]]) c.px(sx, sy, "9") },
  ridge(25, 2, "1", 2, 30), grid(40, 19, "...11...\n..1111..\n.111111.\n11111111\n11111111\n111y1111\n11111111"),   // farm, one lit window
  rect(0, 29, CW, 11, "2"), dither(0, 29, CW, 3, "1", "2", 0.5), hline(0, 36, CW, "1"), hline(20, 32, 30, "3"),
  stamp("_sol_night", 6, 18), stamp("_sol_night", 24, 21),
  glow("i", { r: 10, strength: 0.35 }))
order("sabotage",
  grad(0, 0, CW, 26, "1237", "v", 0.7), ridge(22, 1, "1", 5, 27),
  vline(52, 4, 24, "k"), hline(49, 6, 7, "k"), wire(0, 9, 52, 7, 3, "k"), wire(52, 7, 64, 8, 1, "k"),               // telegraph line
  poly([0, 30, 64, 30, 64, 40, 0, 40], "q"), poly([0, 29, 64, 29, 64, 31, 0, 31], "N"),                              // ballast
  (c) => { for (let sx = 2; sx < CW; sx += 6) c.rect(sx, 28, 3, 2, "e") }, hline(0, 26, CW, "x"), hline(0, 27, CW, "M"),   // sleepers, rail
  rect(30, 23, 6, 3, "r"), vline(32, 23, 3, "R"), vline(34, 23, 3, "R"), hline(30, 24, 6, "j"),                      // charge
  wire(30, 24, 14, 31, 2, "k"), rect(10, 31, 5, 5, "D"), hline(9, 30, 7, "M"), vline(12, 27, 3, "M"),               // plunger
  stamp("_kneel_night", 0, 24), px(36, 22, "y"), px(37, 21, "Y"),
  glow("y", { r: 7, strength: 0.6 }))
order("echange",
  rect(0, 0, CW, CH, "j"), box(0, 0, CW, CH, "J"),
  (c) => { for (let gx = 8; gx < CW; gx += 12) c.vline(gx, 1, CH - 2, "J"); for (let gy = 8; gy < CH; gy += 12) c.hline(1, gy, CW - 2, "J") },
  ellipse(46, 12, 12, 7, "J", true), ellipse(46, 12, 7, 4, "J", true), ellipse(14, 30, 10, 6, "J", true),            // contour lines
  line(0, 16, 20, 22, "b"), line(20, 22, 36, 18, "b"), line(36, 18, 64, 30, "b"),
  rect(6, 8, 11, 7, "w"), box(6, 8, 11, 7, "6"), line(6, 8, 16, 14, "6"), line(6, 14, 16, 8, "6"),                   // infantry counter
  rect(46, 26, 11, 7, "w"), box(46, 26, 11, 7, "6"), ellipse(51, 29, 3, 1, "6", true),                               // armour counter
  line(19, 10, 42, 10, "r"), line(42, 10, 50, 22, "r"), poly([47, 21, 54, 21, 50, 25], "r"),
  line(44, 31, 22, 31, "6"), line(22, 31, 12, 18, "6"), poly([9, 19, 16, 19, 12, 15], "6"),
  line(56, 2, 40, 6, "D"), px(39, 6, "k"))                                                                           // pencil
order("redeploy",
  sky(CW, 20), stamp("_cloud_a", 4, 4), ridge(18, 1, "f", 4, 22),
  stamp("_poplar", 4, -4), stamp("_poplar", 16, -3), stamp("_poplar", 28, -4), stamp("_poplar", 52, -3),
  rect(0, 21, CW, 19, "g"), rect(0, 30, CW, 7, "d"), hline(0, 30, CW, "D"), hline(0, 37, CW, "D"), rect(0, 38, CW, 2, "G"),
  smoke([[5, 32, 3, 2], [1, 28, 2, 2], [10, 34, 2, 1]], "DdJ"),
  stamp("_truck", 16, 13), grid(20, 17, "O.O.O"))
order("fumee",
  sky(CW, 18), ridge(16, 1, "f", 1, 20), rect(0, 19, CW, 21, "g"), dither(0, 19, CW, 4, "G", "g", 0.5), rect(0, 36, CW, 4, "G"),
  stamp("_sol", 4, 18), stamp("_sol", 44, 20),
  smoke([[32, 33, 7, 0], [46, 31, 6, 0], [22, 31, 5, 0], [30, 28, 8, 1], [52, 28, 6, 1], [44, 16, 6, 1], [34, 12, 5, 1], [20, 25, 7, 2], [40, 23, 8, 2], [28, 16, 6, 2], [14, 32, 4, 2], [38, 7, 4, 2], [58, 21, 4, 2]]),
  rect(31, 36, 3, 3, "q"), px(32, 35, "M"))

// Card back for face-down cards.
scene("c_back", { w: CW, h: CH, bg: "O" }, box(1, 1, CW - 2, CH - 2, "v"),
  (c) => { for (let i = -CH; i < CW; i += 6) c.line(i, CH - 1, i + CH, 0, "v") }, box(1, 1, CW - 2, CH - 2, "l"),
  circ(32, 20, 10, "v"), ring(32, 20, 10, "l"), poly([32, 12, 34, 18, 40, 18, 35, 22, 37, 28, 32, 24, 27, 28, 29, 22, 24, 18, 30, 18], "w"))

const CARDS = ["sherman", "firefly", "section", "rangers", "mortiers", "paras", "p47", "spitfire", "genie", "officier", "resistance", "observateur"]
const ORDERS = ["artillerie", "bombardement", "recon", "opsecrete", "sabotage", "echange", "redeploy", "fumee"]
scene("contact_cards", { w: 4 * 66 + 2, h: 8 * 42 + 2, bg: "k" },
  ...CARDS.map((n, i) => stamp("c_" + n, 2 + (i % 4) * 66, 2 + Math.floor(i / 4) * 42)),
  ...CARDS.map((n, i) => stamp("c_" + n + "_x", 2 + (i % 4) * 66, 2 + (3 + Math.floor(i / 4)) * 42)),
  ...ORDERS.map((n, i) => stamp("c_" + n, 2 + (i % 4) * 66, 2 + (6 + Math.floor(i / 4)) * 42)))

// ------------------------------------------------------------------ terrains (160x72)
const TW = 160, TH = 72
const terrain = (name, ...items) => scene("t_" + name, { w: TW, h: TH }, ...items)
const stamps = (name, pts) => (c) => { for (const [x, y, o] of pts) c.stamp(name, x, y, o) }

terrain("bocage",
  sky(TW, 26), stamp("_cloud_a", 20, 5), stamp("_cloud_b", 70, 10), stamp("_cloud_a", 118, 3),
  ridge(25, 1.5, "f", 1, 30), rect(0, 29, TW, 43, "g"), poly([92, 30, 160, 30, 160, 36, 100, 35], "l"),   // far pasture, hay field
  stamps("_tree", [[58, 8], [84, 9], [100, 7]]), tile("_bush", -2, 30, 13, 1),
  poly([72, 35, 88, 35, 124, 72, 36, 72], "d"), line(77, 36, 58, 72, "D"), line(83, 36, 102, 72, "D"),   // sunken lane, cart ruts
  rect(71, 30, 1, 6, "e"), rect(88, 30, 1, 6, "e"), hline(72, 31, 16, "D"), hline(72, 33, 16, "D"), line(72, 31, 87, 33, "D"),   // field gate
  poly([0, 36, 66, 35, 26, 72, 0, 72], "f"), poly([160, 36, 94, 35, 134, 72, 160, 72], "f"),              // hedge banks
  poly([72, 35, 36, 72, 26, 72, 66, 35], "d"), poly([88, 35, 124, 72, 134, 72, 94, 35], "e"),             // earth faces: lit, shadowed
  hline(66, 35, 6, "D"),
  scatter("_bush", 0, 36, 60, 36, 26, { on: "f", clip: true, rflip: "x" }), scatter("_bush", 100, 36, 60, 36, 26, { on: "f", clip: true, rflip: "x", seed: 4 }),
  stamps("_tree", [[40, 14], [102, 13]]), stamp("_tree_big", -10, 6), stamp("_tree_big", 128, 4, { flip: "x" }),
  layer("shadow", { shade: true }, poly([88, 35, 124, 72, 98, 72, 80, 35], "k")))

terrain("pont",
  sky(TW, 26), stamp("_cloud_a", 10, 4), stamp("_cloud_b", 96, 8), stamp("_cloud_a", 132, 2),
  ridge(23, 1.5, "f", 2, 30), stamps("_tree", [[2, 4], [20, 6], [128, 5], [146, 3]]), rect(0, 28, TW, 6, "g"), hline(0, 33, TW, "G"),
  grad(0, 34, TW, 38, "cbB", "v", 0.3),
  (c) => { for (let i = 0; i < 26; i++) c.hline((i * 37) % 150, 37 + ((i * 11) % 34), 4 + (i % 4), i % 3 ? "c" : "B") },   // ripples
  layer("bridge", {},
    poly([0, 24, 22, 20, 138, 20, 160, 24, 160, 34, 0, 34], "T"), rect(18, 20, 124, 30, "T"),
    (c) => { for (let y = 26; y < 50; y += 4) { c.hline(18, y, 124, "q"); for (let x = 20 + (y % 8 ? 0 : 4); x < 142; x += 8) c.vline(x, y - 3, 3, "q") } },   // masonry courses
    rect(0, 17, TW, 3, "t"), hline(0, 17, TW, "w"), hline(0, 20, TW, "q"), poly([0, 20, 18, 20, 18, 24, 0, 28], "t"), poly([160, 20, 142, 20, 142, 24, 160, 28], "t"),   // parapet
    (c) => { for (const cx of [45, 80, 115]) { c.ellipse(cx, 42, 15, 16, "t"); c.ellipse(cx, 42, 13, 14, "_"); c.rect(cx - 16, 50, 33, 10, "_") } },                    // voussoirs, openings
    (c) => { for (const cx of [27, 62, 98, 133]) { c.rect(cx - 3, 44, 7, 8, "t"); c.vline(cx + 3, 44, 8, "q"); c.hline(cx - 4, 52, 9, "q") } }),                        // cutwaters
  layer("refl", { shade: true, density: 0.5 }, rect(18, 53, 124, 7, "k")),
  poly([0, 34, 20, 34, 30, 52, 22, 72, 0, 72], "g"), poly([20, 34, 30, 52, 22, 72, 17, 72, 25, 52, 16, 34], "D"),
  poly([160, 34, 140, 34, 130, 52, 138, 72, 160, 72], "G"), poly([140, 34, 130, 52, 138, 72, 143, 72, 135, 52, 144, 34], "e"),
  (c) => { for (let i = 0; i < 12; i++) { const x = 26 + (i * 5) % 9, y = 56 + i; c.vline(x, y - 5, 5, "o"); c.px(x, y - 6, "e") } },   // reeds
  stamp("_tree_big", 132, 26, { flip: "x" }), stamp("_bush", -4, 60), stamp("_bush", 4, 66))

// Gutted house: wall columns of uneven height, empty windows, a few surviving rafters.
const ruin = (x, base, w, h, seed, roof) => (c) => {
  const top = (i) => Math.round(h * (0.62 + 0.38 * Math.abs(Math.sin(i * 0.45 + seed)) * (0.6 + 0.4 * Math.sin(i * 1.9 + seed))))
  for (let i = 0; i < w; i++) { const hh = Math.max(4, top(i)); c.vline(x + i, base - hh, hh, i > w * 0.72 ? "T" : "t"); c.px(x + i, base - hh, "q") }
  for (let y = base - 5; y > base - h * 0.6; y -= 6) c.hline(x, y, w, "T")
  for (let wy = base - 10; wy > base - h + 4; wy -= 11) for (let wx = x + 4; wx < x + w - 6; wx += 9) { c.rect(wx, wy - 6, 5, 7, "k"); c.hline(wx - 1, wy + 1, 7, "q"); c.px(wx, wy - 6, "N") }
  c.rect(x + Math.floor(w / 2) - 3, base - 9, 6, 9, "k")
  if (roof) { c.poly([x - 2, base - h + 2, x + w * 0.45, base - h - 9, x + w * 0.5, base - h - 6, x + 6, base - h + 4], "R"); c.line(x + w * 0.45, base - h - 8, x + w * 0.8, base - h + 3, "e"); c.line(x + w * 0.3, base - h - 3, x + w * 0.62, base - h + 5, "e") }
}
terrain("village",
  grad(0, 0, TW, 46, "unx8", "v", 0.35),
  ridge(40, 1, "N", 3, 48), (c) => { for (const [x, w, h] of [[6, 12, 9], [24, 8, 13], [108, 14, 10], [140, 10, 14]]) c.rect(x, 42 - h, w, h, "N") },   // far blocks
  smoke([[30, 20, 6, 0], [36, 12, 7, 1], [44, 5, 8, 1], [26, 28, 4, 0], [122, 22, 5, 0], [128, 14, 7, 1], [136, 6, 8, 1]]),
  rect(70, 8, 14, 40, "t"), rect(80, 8, 4, 40, "T"), poly([70, 8, 74, -2, 79, 3, 84, 8], "q"), rect(74, 14, 5, 8, "k"), rect(74, 30, 5, 6, "k"), hline(70, 26, 14, "T"), hline(70, 8, 14, "w"),   // church tower, spire shot off
  ruin(0, 50, 34, 30, 1, true), ruin(36, 50, 28, 22, 2.2), ruin(90, 50, 32, 26, 0.4, true), ruin(124, 50, 36, 34, 3.1),
  rect(0, 50, TW, 22, "T"), dither(0, 50, TW, 3, "q", "T", 0.5), poly([56, 50, 104, 50, 124, 72, 36, 72], "t"),      // street
  (c) => { for (let y = 54; y < 72; y += 4) for (let x = 40 + (y % 8) - (y - 50); x < 122 + (y - 50); x += 9) c.hline(x, y, 5, "T") },   // cobbles
  (c) => { for (const [x, y, r] of [[10, 53, 6], [24, 56, 4], [46, 52, 3], [112, 53, 5], [140, 56, 7], [152, 52, 4], [130, 62, 3]]) { c.ellipse(x, y, r, Math.ceil(r / 2), "q"); c.ellipse(x - 1, y - 1, r - 1, Math.ceil(r / 2) - 1, "t"); c.px(x + r - 2, y, "R") } },   // rubble heaps
  ellipse(80, 62, 9, 3, "q"), ellipse(80, 62, 7, 2, "k"), hline(73, 59, 14, "N"),                                     // crater
  rect(41, 31, 5, 7, "Y"), px(43, 33, "y"), rect(131, 23, 5, 7, "Y"), px(133, 25, "y"), glow("Yy", { r: 9, strength: 0.5 }),
  line(18, 72, 22, 50, "e", 2), line(22, 50, 30, 46, "e"))                                                             // fallen telegraph pole

terrain("plage",
  sky(TW, 22), stamp("_cloud_a", 30, 4), stamp("_cloud_b", 84, 9), stamp("_cloud_a", 124, 5),
  grad(0, 22, TW, 22, "Bbc", "v", 0.3), hline(0, 22, TW, "u"),
  grid(14, 19, "..q...\n.qqq..\nqqqqqq"), grid(52, 20, ".q..\nqqqq"), grid(96, 19, "...q..\n..qqq.\nqqqqqq"),   // fleet on the horizon
  grid(40, 6, ".xxxx.\nxxxxxx\n.xxxx."), vline(43, 9, 12, "n"), grid(110, 3, ".xxxx.\nxxxxxx\n.xxxx."), vline(113, 6, 14, "n"),   // barrage balloons
  (c) => { for (let i = 0; i < 22; i++) c.hline((i * 29) % 150, 25 + ((i * 7) % 16), 5 + (i % 4), i % 2 ? "c" : "B") },
  stamp("_lcvp", 16, 30), stamp("_lcvp", 70, 27), (c) => { for (const [x, y] of [[54, 24], [120, 27], [140, 31]]) { c.grid(x, y, ".w.w.\n..w..\n.www.\n.wcw.\n.wcw.\nwwcww"); c.hline(x - 2, y + 6, 9, "c") } },   // shell splashes
  rect(0, 44, TW, 28, "j"), rect(0, 43, TW, 3, "J"), hline(0, 42, TW, "w"), (c) => { for (let x = 0; x < TW; x += 14) c.hline(x + 3, 44, 7, "w") },   // surf
  (c) => { for (let i = 0; i < 12; i++) c.hline((i * 43) % 150, 50 + ((i * 5) % 20), 6, "J") },                                                  // sand ripples
  poly([98, 46, 126, 34, 160, 28, 160, 72, 112, 72], "J"), poly([126, 34, 160, 28, 160, 33, 128, 38], "G"), hline(126, 33, 34, "g"),          // bluff
  (c) => { for (let i = 0; i < 9; i++) c.vline(128 + i * 4, 31 - (i % 2), 3, "g") },
  rect(136, 36, 18, 9, "t"), rect(136, 36, 18, 2, "w"), rect(139, 40, 11, 2, "k"), vline(153, 36, 9, "T"), poly([134, 45, 156, 45, 158, 48, 132, 48], "T"),   // casemate
  stamps("_hedgehog", [[8, 50], [34, 47], [58, 53], [84, 48], [22, 60], [70, 62], [100, 58]]),
  (c) => { for (const [x, y] of [[46, 58], [92, 64], [12, 66]]) { c.line(x, y, x + 5, y - 9, "e", 2); c.rect(x + 4, y - 11, 3, 2, "q") } },      // mined stakes
  (c) => { for (let x = 104; x < 160; x += 4) c.ring(x, 54 + Math.round((x - 104) / 9), 2, "M") }, vline(104, 52, 5, "e"), vline(132, 55, 5, "e"),   // wire
  layer("shadow", { shade: true }, (c) => { for (const [x, y] of [[8, 50], [34, 47], [58, 53], [84, 48], [22, 60], [70, 62], [100, 58]]) c.hline(x + 2, y + 6, 9, "k") }))

terrain("colline",
  sky(TW, 46), stamp("_cloud_a", 8, 6), stamp("_cloud_b", 40, 14), stamp("_cloud_a", 128, 9), stamp("_cloud_b", 108, 20),
  ridge(42, 2, "u", 1, 50), ridge(46, 1.5, "f", 4, 52),
  (c) => {                                                                             // the hill: bell curve, lit from the left
    const top = (x) => Math.round(62 - 46 * Math.exp(-(((x - 92) / 44) ** 2)))
    for (let x = 0; x < TW; x++) { const t = top(x); c.vline(x, t, TH - t, x > 96 ? "G" : "g"); c.px(x, t, x > 96 ? "f" : "l") }
    for (let x = 90; x < 104; x++) for (let y = top(x) + 1; y < TH; y++) c.px(x, y, (x * 3 + y * 5) % 14 < x - 90 ? "G" : "g")   // soft terminator
    for (let k = 1; k < 5; k++) for (let x = 20; x < 150; x++) { const y = top(x) + k * 9 + Math.round(2 * Math.sin(x / 8 + k)); if (y < TH && x % 9 > 1) c.px(x, y, x > 96 ? "f" : "G") }   // terrace lines
    let px = 60, py = 71                                                                // track winding up
    for (const [tx, ty] of [[84, 58], [70, 46], [92, 36], [82, 27], [90, 20]]) { c.line(px, py, tx, ty, "d", 2); px = tx; py = ty }
    for (let x = 62; x < 126; x += 3) c.rect(x, top(x) + 12 + (x % 2), 3, 2, "e")      // trench line
  },
  rect(84, 11, 18, 7, "t"), rect(84, 11, 18, 2, "w"), rect(87, 14, 10, 2, "k"), vline(101, 11, 7, "T"), poly([82, 18, 104, 18, 106, 20, 80, 20], "T"),   // bunker
  vline(99, 0, 11, "M"), line(99, 2, 104, 11, "q"), line(99, 2, 94, 11, "q"),
  (c) => { for (const [x, y, r] of [[30, 64, 5], [124, 60, 4], [142, 67, 5], [52, 58, 3]]) { c.ellipse(x, y, r, 2, "e"); c.hline(x - r, y - 2, 2 * r, "d") } },   // craters
  stamps("_tree", [[-6, 40], [8, 44], [144, 42]]), stamp("_bush", 22, 66), stamp("_bush", 126, 67))

terrain("aerodrome",
  sky(TW, 36), stamp("_cloud_a", 54, 5), stamp("_cloud_b", 82, 14), stamp("_cloud_a", 2, 12),
  ridge(33, 1, "f", 2, 38), rect(0, 36, TW, 36, "g"), dither(0, 36, TW, 4, "G", "g", 0.5),
  layer("hangar", {}, ellipse(28, 38, 26, 17, "a"), rect(0, 38, 60, 20, "_"),
    (c) => { for (let x = 4; x < 54; x += 4) for (let y = 20; y < 38; y++) if (c.is(x, y, "a")) c.px(x, y, "A") },     // corrugated iron
    ellipse(28, 38, 26, 17, "Z", true), rect(0, 38, 60, 20, "_"), rect(12, 27, 32, 11, "k"), rect(12, 27, 3, 11, "z"), rect(41, 27, 3, 11, "z"),
    poly([20, 38, 24, 31, 32, 31, 36, 38], "A"), vline(28, 28, 8, "q"), hline(22, 33, 12, "q")),                       // nose of a parked aircraft
  poly([64, 37, 84, 37, 156, 72, 30, 72], "n"), line(64, 37, 30, 72, "N"), line(84, 37, 156, 72, "N"),                // runway
  (c) => { for (let y = 39, n = 2; y < 72; y += n + 3, n += 2) c.rect(Math.round(74 + (y - 37) * 0.54), y, 2 + Math.floor(n / 3), n, "w") },
  rect(128, 14, 12, 23, "t"), vline(139, 14, 23, "T"), rect(125, 8, 18, 6, "c"), box(125, 8, 18, 6, "q"), vline(131, 8, 6, "q"), vline(137, 8, 6, "q"),   // control tower
  rect(124, 6, 20, 2, "T"), vline(134, 0, 6, "M"), rect(131, 30, 5, 7, "k"), hline(128, 22, 12, "T"),
  vline(108, 16, 21, "q"), poly([109, 16, 121, 18, 121, 21, 109, 21], "r"), rect(112, 16, 3, 5, "w"), rect(118, 18, 3, 3, "w"),   // windsock
  stamp("_plane_p47", 96, 42, { flip: "x" }), line(110, 59, 109, 62, "M"), circ(109, 63, 1, "M"), line(126, 56, 128, 62, "M"), px(128, 63, "M"),   // parked fighter, gear
  layer("shadow", { shade: true }, ellipse(118, 65, 20, 2, "k")),
  (c) => { for (const x of [4, 9, 14]) { c.rect(x, 44, 4, 6, "r"); c.hline(x, 44, 4, "y"); c.hline(x, 47, 4, "R") } })   // fuel drums

terrain("carrefour",
  sky(TW, 28), stamp("_cloud_a", 16, 6), stamp("_cloud_b", 62, 3), stamp("_cloud_a", 112, 10),
  ridge(26, 1.5, "f", 5, 32),
  rect(0, 30, 74, 14, "j"), furrows(30, 44, "J"), rect(74, 30, 86, 14, "g"), rect(0, 50, TW, 22, "g"), dither(0, 50, TW, 3, "G", "g", 0.5),
  grid(132, 22, "...RRRRRR..\n..RRRRRRRR.\n.RRRRRRRRRR\n.ttttttttt.\n.tktttkttt.\n.tttttkttt."), smoke([[141, 19, 1, 2], [143, 16, 2, 2]]),   // farm
  poly([0, 42, 160, 42, 160, 49, 0, 51], "d"), hline(0, 42, TW, "D"), hline(0, 50, TW, "D"),                         // east-west road
  poly([70, 31, 80, 31, 116, 72, 38, 72], "d"), line(73, 32, 56, 72, "D"), line(77, 32, 98, 72, "D"), line(70, 31, 62, 42, "D"), line(80, 31, 90, 42, "D"),   // north-south road
  ellipse(60, 60, 6, 2, "b"), hline(57, 59, 5, "c"), ellipse(88, 47, 4, 1, "b"),                                    // puddles
  stamps("_poplar", [[2, 17], [16, 17], [30, 17], [44, 17], [100, 17], [114, 17], [128, 17], [148, 17]]),
  layer("shadow", { shade: true }, (c) => { for (const x of [2, 16, 30, 44, 100, 114, 128, 148]) c.poly([x + 2, 43, x + 5, 43, x + 12, 50, x + 9, 50], "k") }),
  vline(104, 30, 26, "e"), vline(105, 30, 26, "D"),                                                                   // signpost
  poly([106, 31, 122, 31, 125, 33, 122, 35, 106, 35], "w"), hline(108, 33, 11, "k"),
  poly([103, 37, 88, 37, 85, 39, 88, 41, 103, 41], "w"), hline(90, 39, 10, "k"),
  poly([106, 43, 118, 43, 121, 45, 118, 47, 106, 47], "j"), hline(108, 45, 8, "k"),
  rect(34, 34, 3, 16, "t"), rect(30, 38, 11, 3, "t"), vline(36, 34, 16, "T"), rect(31, 50, 9, 3, "T"),              // calvary
  grid(118, 52, ".rrr.\nwwwww\nwkkww\nwwwww"),                                                                    // kilometre stone
  stamp("_bush", -4, 64), stamp("_bush", 140, 66))

terrain("foret",
  grad(0, 0, TW, 34, "sIi", "v", 0.35),
  tile("_pine_far", -4, 6, 12, 1), tile("_pine_far", 3, 9, 11, 1), rect(0, 32, TW, 40, "i"),
  layer("mist", { density: 0.5 }, rect(0, 24, TW, 9, "i")),
  stamps("_pine_snow", [[10, 8], [34, 12], [58, 6], [84, 11], [106, 7], [128, 12], [146, 9]]),
  (c) => { for (let y = 46; y < 72; y += 7) for (let x = (y * 5) % 40; x < TW; x += 46) { c.hline(x, y, 22, "I"); c.hline(x + 3, y + 1, 14, "I") } },   // drift shadows
  stamp("_pine_big", -12, 8), stamp("_pine_big", 132, 4), stamp("_pine_snow", 100, 28), stamp("_pine_snow", 40, 30),
  layer("shadow", { shade: true }, poly([10, 68, 30, 68, 60, 72, 14, 72], "k"), poly([148, 64, 160, 64, 160, 70, 150, 70], "k")),
  ellipse(80, 58, 13, 4, "I"), ellipse(80, 59, 10, 3, "e"), ellipse(80, 60, 8, 2, "k"),                              // foxhole
  line(68, 55, 92, 54, "D", 2), line(70, 53, 90, 52, "e"), grid(77, 55, ".OOO.\nOOOOO"), line(84, 56, 93, 51, "M"),   // log parapet, helmet, rifle
  (c) => { for (let i = 0; i < 9; i++) c.rect(96 + i * 6, 62 + (i % 2) * 2 + Math.round(i / 3), 2, 1, "I") },           // footprints
  (c) => { const r = c.rng(7); for (let i = 0; i < 70; i++) c.px(Math.floor(r() * TW), Math.floor(r() * TH), "w") })   // snowfall

terrain("marais",
  grad(0, 0, TW, 30, "nxS", "v", 0.35),
  ridge(25, 1.5, "f", 2, 31), stamps("_dead", [[12, 6], [52, 8, { flip: "x" }], [124, 5], [146, 9, { flip: "x" }]]),
  grad(0, 30, TW, 42, "bBF", "v", 0.3),
  (c) => { for (let i = 0; i < 20; i++) c.hline((i * 31) % 150, 33 + ((i * 13) % 36), 6 + (i % 5), i % 2 ? "b" : "B") },
  layer("mist", { density: 0.35 }, rect(0, 26, TW, 8, "S")),
  stamp("_tank_sherman", 78, 22), rect(76, 39, 56, 8, "B"), hline(78, 39, 50, "c"), hline(74, 41, 58, "b"), hline(86, 43, 40, "b"),   // bogged tank
  (c) => {
    for (const [x, y, rx] of [[26, 46, 16], [130, 56, 20], [70, 62, 12], [150, 40, 9]]) {       // mud banks with reed beds
      c.ellipse(x, y, rx, 3, "e"); c.ellipse(x, y - 1, rx - 2, 2, "D")
      for (let i = -rx + 3; i < rx - 2; i += 2) { const h = 6 + ((x + i * 7) % 6); c.vline(x + i, y - 2 - h, h, i % 4 ? "o" : "l"); if (i % 3 === 0) c.vline(x + i, y - 3 - h, 2, "e") }
    }
    for (const [x, y, rx] of [[52, 52, 7], [100, 50, 9], [16, 62, 8], [108, 66, 6]]) { c.ellipse(x, y, rx, 1, "G"); c.px(x - 2, y, "g") }   // duckweed
    for (let i = 0; i < 9; i++) { const x = 34 + i * 5, y = 70 - i * 2; c.rect(x, y, 6, 2, "d"); c.hline(x, y + 1, 6, "D"); if (i % 3 === 0) c.vline(x + 2, y + 2, 3, "e") }   // duckboards
  },
  stamp("_dead", 2, 30), layer("mist2", { density: 0.25 }, rect(0, 34, TW, 5, "S")))

const TERRAINS = ["bocage", "pont", "village", "plage", "colline", "aerodrome", "carrefour", "foret", "marais"]
scene("contact_terrains", { w: 2 * 162 + 2, h: 5 * 74 + 2, bg: "k" },
  ...TERRAINS.map((n, i) => stamp("t_" + n, 2 + (i % 2) * 162, 2 + Math.floor(i / 2) * 74)))

// ------------------------------------------------------------------ attribute icons (value chips)
// One-colour silhouettes: they sit on the coloured chip, holes let the chip colour through.
sprite("i_char", `
  .....kkkk......
  ....kkkkkkkkkkk
  ....kkkkkk.....
  ..kkkkkkkkkk...
  .kkkkkkkkkkkkk.
  kkkkkkkkkkkkkkk
  k.kk.kk.kk.kk.k
  kkkkkkkkkkkkkkk
  .kkkkkkkkkkkkk.`)
sprite("i_inf", `
  ....kkkkk....
  ..kkkkkkkkk..
  .kkkkkkkkkkk.
  .kkkkkkkkkkk.
  kkkkkkkkkkkkk
  kkkkkkkkkkkkk
  .k.........k.
  ..k.......k..
  ...kk...kk...`)
sprite("i_air", `
  ......k......
  ......k......
  .....kkk.....
  .kkkkkkkkkkk.
  kkkkkkkkkkkkk
  kkkkkkkkkkkkk
  .....kkk.....
  .....kkk.....
  ......k......
  ....kkkkk....`)
sprite("i_strat", `
  .....k.....
  .....k.....
  ....kkk....
  kkkkkkkkkkk
  .kkkkkkkkk.
  ..kkkkkkk..
  ..kkkkkkk..
  .kkkk.kkkk.
  .kkk...kkk.
  kk.......kk`)

// ------------------------------------------------------------------ campaign map (320x140)
// Same frame as campaign.js project(): lon -2.0..2.5, lat 49.8..48.5. Seen from above, staff-map style:
// bocage patchwork, rivers, forests, towns. Battle markers and names are HTML on top.
const MW = 320, MH = 140
const P = (lon, lat) => [Math.round((lon + 2) * MW / 4.5), Math.round((49.8 - lat) * MH / 1.3)]
const path = (pts) => pts.flatMap(([lon, lat]) => P(lon, lat))
const LAND = path([
  [-2.1, 48.4], [-2.1, 48.64], [-1.85, 48.67], [-1.55, 48.62], [-1.4, 48.66], [-1.52, 48.72], [-1.6, 48.84], [-1.58, 49.0],
  [-1.62, 49.13], [-1.67, 49.25], [-1.8, 49.38], [-1.88, 49.52], [-1.94, 49.65], [-1.94, 49.72], [-1.85, 49.71], [-1.62, 49.65],
  [-1.45, 49.69], [-1.26, 49.67], [-1.24, 49.6], [-1.27, 49.57], [-1.25, 49.48], [-1.18, 49.42], [-1.16, 49.36], [-1.12, 49.33],
  [-1.08, 49.38], [-1.04, 49.39], [-0.99, 49.4], [-0.85, 49.37], [-0.75, 49.35], [-0.62, 49.34], [-0.45, 49.335], [-0.35, 49.32],
  [-0.25, 49.29], [-0.12, 49.29], [-0.07, 49.3], [0.08, 49.37], [0.23, 49.42], [0.38, 49.44], [0.3, 49.47], [0.1, 49.49],
  [0.07, 49.53], [0.16, 49.69], [0.2, 49.71], [0.37, 49.76], [0.6, 49.85], [2.6, 49.9], [2.6, 48.4]])
const river = (pts, w = 1) => (c) => { const q = path(pts); for (let i = 2; i < q.length; i += 2) c.line(q[i - 2], q[i - 1], q[i], q[i + 1], "B", w) }
const blob = (lon, lat, r, key, edge) => (c) => { const [x, y] = P(lon, lat); c.circ(x, y, r, key); if (edge) c.ring(x, y, r, edge) }
const town = (lon, lat, r) => (c) => {                       // red roofs around a grey core
  const [x, y] = P(lon, lat), rnd = c.rng(x * 7 + y)
  for (let i = 0; i < r * r * 3 + 3; i++) { const a = rnd() * 6.28, d = rnd() * r; c.px(Math.round(x + Math.cos(a) * d * 1.3), Math.round(y + Math.sin(a) * d), rnd() < 0.35 ? "t" : "r") }
  c.px(x, y, "R")
}
scene("map_normandie", { w: MW, h: MH, bg: "b" },
  grad(0, 0, MW, 40, "Bb", "v", 0.6),
  (c) => { const r = c.rng(3); for (let i = 0; i < 160; i++) c.hline(Math.floor(r() * MW), Math.floor(r() * 60), 2 + Math.floor(r() * 3), "c") },   // chop
  poly(LAND, "g"),
  (c) => {                                                   // bocage patchwork: jittered Voronoi fields, hedges on borders
    const r = c.rng(11), S = 7, seeds = [], F = "ggggggllloGd"
    const cols = Math.floor(MW / S) + 3, H = S * 0.8
    for (let gy = -1; gy < MH / H + 1; gy++) for (let gx = -1; gx < cols - 1; gx++) seeds.push([gx * S + r() * S, gy * H + r() * H, F[Math.floor(r() * F.length)]]), id = new Int32Array(MW * MH).fill(-1)
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      if (!c.is(x, y, "g")) continue
      let best = 1e9, bi = 0
      const gx = Math.floor(x / S) + 1, gy = Math.floor(y / H) + 1
      for (let j = gy - 2; j <= gy + 2; j++) for (let i = gx - 2; i <= gx + 2; i++) {
        const k = j * cols + i, sd = seeds[k]; if (!sd) continue
        const d = (sd[0] - x) ** 2 + ((sd[1] - y) * 1.3) ** 2; if (d < best) { best = d; bi = k }
      }
      id[y * MW + x] = bi
    }
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      const k = id[y * MW + x]; if (k < 0) continue
      const edge = (x + 1 < MW && id[y * MW + x + 1] >= 0 && id[y * MW + x + 1] !== k) || (y + 1 < MH && id[(y + 1) * MW + x] >= 0 && id[(y + 1) * MW + x] !== k)
      c.px(x, y, edge ? "G" : seeds[k][2])
    }
  },
  (c) => {                                                   // coastline: sand on land, surf on sea
    const land = (x, y) => c.is(x, y, "glGdjo")
    const sea = [], sand = []
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => x + dx >= 0 && x + dx < MW && y + dy >= 0 && y + dy < MH && land(x + dx, y + dy) !== land(x, y))
      if (n) (land(x, y) ? sand : sea).push([x, y])
    }
    for (const [x, y] of sand) c.px(x, y, "j")
    for (const [x, y] of sea) c.px(x, y, "c")
  },
  layer("marsh", { density: 0.6 }, blob(-1.2, 49.3, 5, "c"), blob(-1.32, 49.25, 3, "c"), blob(-0.12, 49.24, 3, "c")),   // Douve/Taute, Dives floods
  blob(-0.88, 49.2, 6, "f"), blob(-0.8, 49.18, 4, "f"), blob(0.7, 49.4, 5, "f"), blob(1.5, 49.4, 6, "f"), blob(1.58, 49.37, 4, "f"),
  blob(-1.0, 48.8, 4, "f"), blob(1.8, 48.66, 7, "f"), blob(0.92, 48.95, 5, "f"), blob(-0.3, 48.72, 4, "f"),
  (c) => { const r = c.rng(5); for (let i = 0; i < 260; i++) { const x = Math.floor(r() * MW), y = Math.floor(r() * MH); if (c.is(x, y, "f")) c.px(x, y, r() < 0.5 ? "F" : "G") } },   // tree crowns
  river([[0.38, 49.44], [0.6, 49.45], [0.85, 49.42], [1.1, 49.44], [1.2, 49.33], [1.4, 49.25], [1.48, 49.09], [1.72, 48.99], [2.0, 48.93], [2.2, 48.9], [2.35, 48.86], [2.6, 48.82]], 2),
  river([[-0.25, 49.29], [-0.36, 49.18], [-0.4, 49.05], [-0.25, 48.9], [-0.1, 48.75], [0.0, 48.7]]),
  river([[-1.12, 49.33], [-1.09, 49.11], [-0.95, 48.9], [-0.89, 48.8]]),
  river([[-1.12, 49.33], [-1.3, 49.28], [-1.45, 49.3]]),
  river([[-0.12, 49.29], [-0.1, 49.1], [0.0, 48.95]]),
  blob(2.35, 48.86, 6, "t", "T"), blob(2.3, 48.88, 4, "t"),                                                             // Paris
  town(-1.62, 49.63, 3), town(-0.36, 49.18, 3), town(-1.09, 49.11, 2), town(-0.7, 49.28, 2), town(1.1, 49.44, 3),
  town(0.12, 49.49, 3), town(-0.2, 48.89, 1), town(-0.94, 48.65, 1), town(1.48, 49.09, 1), town(-1.25, 49.3, 1),
  town(-1.36, 48.68, 1), town(-1.44, 49.05, 1), town(0.23, 49.15, 2), town(1.15, 49.02, 2), town(-1.6, 48.84, 1),
  (c) => { for (const [lon, lat] of [[-1.1, 49.47], [-0.95, 49.46], [-0.8, 49.44], [-0.6, 49.42], [-0.45, 49.41], [-0.3, 49.4], [-1.0, 49.52], [-0.7, 49.5]]) { const [x, y] = P(lon, lat); c.hline(x - 1, y, 4, "q"); c.px(x + 1, y - 1, "q"); c.hline(x - 2, y + 1, 6, "c") } },   // the invasion fleet
  box(0, 0, MW, MH, "e"))

// ------------------------------------------------------------------ campaign terrain variants (160x72)
// Concrete casemate, embrasure facing left.
sprite("_casemate", { w: 44, h: 20 }, (c) => {
  c.poly([2, 6, 40, 4, 44, 8, 44, 20, 0, 20, 0, 9], "t"); c.hline(2, 6, 38, "w"); c.poly([40, 4, 44, 8, 44, 20, 38, 20, 38, 6], "T")
  c.rect(0, 9, 30, 2, "T"); c.rect(3, 11, 18, 5, "k"); c.hline(3, 16, 18, "q"); c.rect(5, 12, 4, 2, "q"); c.hline(0, 13, 6, "q")   // embrasure, barrel
  for (let x = 24; x < 38; x += 5) c.vline(x, 12, 8, "T")                                                                        // shuttering marks
  c.poly([-2, 20, 0, 16, 46, 16, 46, 20], "J")
})
const surf = (y, key = "w") => (c) => { for (let x = 0; x < TW; x += 11) c.hline(x + ((y * 3) % 7), y, 6, key) }
const soldiers = (pts, x = "") => (c) => { for (const [px, py, k] of pts) c.stamp((k ? "_kneel" : "_sol") + x, px, py) }
const barbed = (x0, x1, y) => (c) => { for (let x = x0; x < x1; x += 4) c.ring(x, y + ((x / 4) % 2), 2, "M"); c.vline(x0, y - 2, 5, "e"); c.vline(x1, y - 2, 5, "e") }

terrain("omaha_dog",                                                  // grey dawn, bluffs and the Vierville draw
  grad(0, 0, TW, 24, "nxS", "v", 0.4), stamp("_cloud_a", 18, 3, { swap: { w: "x", W: "n" } }), stamp("_cloud_b", 120, 6, { swap: { w: "x", W: "n" } }),
  (c) => { for (let x = 0; x < TW; x++) { const top = Math.round(14 + 6 * Math.sin(x / 15) + (x > 70 && x < 92 ? (x - 70) * (92 - x) / 30 : 0)); c.vline(x, top, 36 - top, x % 3 ? "G" : "f") } },   // bluffs with a draw
  (c) => { for (let x = 0; x < TW; x++) { const top = Math.round(26 + 2 * Math.sin(x / 7)); c.vline(x, top, 36 - top, "f") } },
  grid(30, 13, "...RR..\n..RRRR.\n.tttttt\n.tkttkt"), smoke([[36, 10, 3, 1], [40, 6, 4, 2]]),                                       // villa on the bluff
  rect(78, 30, 12, 6, "d"), stamp("_casemate", 120, 18, { swap: { J: "f" } }),
  rect(0, 36, TW, 7, "j"), dither(0, 36, TW, 2, "J", "j", 0.5), grad(0, 43, TW, 29, "cbB", "v", 0.3), surf(43), surf(47, "c"),
  (c) => { for (let i = 0; i < 18; i++) c.hline((i * 37) % 150, 50 + ((i * 7) % 20), 4 + (i % 3), i % 2 ? "c" : "B") },
  stamps("_hedgehog", [[6, 36], [24, 37], [46, 35], [66, 37], [98, 36], [118, 35], [140, 37]]),
  stamp("_lcvp", 14, 48), stamp("_lcvp", 104, 52), stamp("_lcvp", 60, 58, { flip: "x" }),
  soldiers([[30, 30], [52, 32, 1], [86, 29], [128, 31, 1]]),
  smoke([[146, 30, 4, 0], [150, 24, 5, 1], [144, 18, 5, 2], [8, 28, 3, 1], [12, 22, 4, 2]]))

terrain("omaha_easy",                                                 // high tide, men pinned behind the shingle bank
  sky(TW, 20, "uxS"), stamp("_cloud_a", 60, 4), ridge(16, 2, "G", 3, 30), ridge(22, 1.5, "f", 1, 30),
  line(46, 30, 54, 22, "d"), line(54, 22, 50, 17, "d"),                                                                             // path up the bluff
  rect(0, 30, TW, 10, "j"), (c) => { const r = c.rng(4); for (let i = 0; i < 260; i++) c.px(Math.floor(r() * TW), 38 + Math.floor(r() * 6), r() < 0.5 ? "T" : "t") },   // shingle
  rect(0, 44, TW, 4, "J"), surf(47), grad(0, 48, TW, 24, "cbB", "v", 0.3), surf(52, "c"),
  stamp("_tank_sherman", 96, 42), rect(94, 60, 56, 3, "b"), hline(96, 59, 50, "w"),                                                // DD tank in the surf
  smoke([[118, 40, 4, 0], [122, 33, 5, 1], [116, 26, 6, 2], [126, 20, 5, 2]]),
  soldiers([[8, 30, 1], [26, 31, 1], [44, 30], [62, 31, 1], [78, 30, 1]]),
  stamps("_hedgehog", [[134, 46], [12, 50], [58, 52]]), stamp("_lcvp", 22, 58),
  (c) => { for (const [x, y] of [[70, 60], [140, 64]]) c.grid(x, y, ".w.w.\n..w..\n.www.\nwwcww") })

terrain("port_cherbourg",                                             // harbour, demolished cranes, fort on the heights
  sky(TW, 26, "u78"), ridge(16, 3, "G", 2, 30), ridge(22, 2, "f", 5, 30),
  rect(110, 8, 22, 8, "J"), rect(110, 8, 22, 2, "j"), (c) => { for (let x = 110; x < 132; x += 4) c.rect(x, 6, 2, 2, "J") },        // Fort du Roule
  rect(0, 28, TW, 4, "t"), (c) => { for (const [x, w, h] of [[4, 18, 8], [26, 12, 6], [44, 20, 9]]) { c.rect(x, 28 - h, w, h, "T"); c.poly([x, 28 - h, x + w / 2, 24 - h, x + w, 28 - h], "R") } },   // warehouses
  grad(0, 32, TW, 26, "bBB", "v", 0.3), (c) => { for (let i = 0; i < 16; i++) c.hline((i * 41) % 150, 34 + ((i * 5) % 22), 5, "c") },
  rect(70, 36, 90, 3, "T"), hline(70, 36, 90, "t"),                                                                                  // breakwater
  layer("crane", {}, line(30, 44, 44, 6, "q", 2), line(44, 6, 70, 10, "q"), line(44, 6, 40, 28, "q"), line(64, 10, 64, 22, "M"), rect(26, 40, 10, 6, "T")),
  line(96, 46, 124, 34, "q", 2), line(124, 34, 138, 42, "q"), rect(92, 44, 10, 4, "T"),                                              // toppled crane
  rect(0, 58, TW, 14, "t"), hline(0, 58, TW, "w"), (c) => { for (let x = 4; x < TW; x += 20) { c.rect(x, 56, 3, 3, "q"); c.px(x + 1, 55, "M") } }, hline(0, 62, TW, "T"),   // quay, bollards
  (c) => { for (let x = 0; x < TW; x += 9) c.vline(x, 63, 9, "T") },
  smoke([[52, 18, 5, 0], [58, 10, 6, 1], [66, 4, 6, 2], [140, 30, 3, 1], [146, 24, 4, 2]]),
  stamp("_boom", 74, 18), soldiers([[110, 42], [130, 43, 1]]), stamp("_truck", 4, 40))

terrain("wn62",                                                       // close-up of a strongpoint in the dunes
  sky(TW, 30, "nxS"), grad(0, 24, 56, 8, "bB", "v", 0.3), hline(0, 24, 56, "c"),
  poly([0, 32, 40, 30, 70, 14, 160, 10, 160, 72, 0, 72], "J"), poly([40, 30, 70, 14, 160, 10, 160, 18, 72, 22, 50, 32], "j"),     // dune slope
  scatter("_bush", 70, 10, 90, 20, 14, { on: "jJ", rflip: "x", swap: { g: "o", G: "O", f: "v", F: "v" } }),
  stamp("_casemate", 58, 18), stamp("_casemate", 112, 10),
  layer("net", { density: 0.4 }, poly([56, 22, 104, 18, 106, 26, 58, 30], "O")),
  (c) => { let x = 10, y = 60; for (const [tx, ty] of [[40, 52], [30, 46], [70, 42], [64, 36], [100, 34], [96, 30]]) { c.line(x, y, tx, ty, "e", 3); c.line(x, y - 1, tx, ty - 1, "D"); x = tx; y = ty } },   // zigzag trench
  barbed(4, 60, 40), barbed(70, 150, 54), stamps("_hedgehog", [[4, 62], [26, 66], [130, 64]]),
  soldiers([[60, 34, 1], [92, 26]], "_x"),
  (c) => { for (const [x, y] of [[20, 44], [118, 46], [46, 64]]) { c.ellipse(x, y, 5, 2, "D"); c.hline(x - 4, y - 2, 9, "j") } })

terrain("fort_roule",                                                 // granite spur and its fort above the town, dusk
  sky(TW, 34, "u78"), stamp("_cloud_b", 20, 6, { swap: { w: "8", W: "7" } }),
  grad(0, 40, 60, 10, "bB", "v", 0.3), hline(0, 40, 60, "8"),
  (c) => { for (let x = 50; x < TW; x++) { const top = Math.round(x < 96 ? 48 - (x - 50) * 0.75 : 14 + Math.sin(x / 6)); c.vline(x, top, TH - top, (x * 7 + top) % 11 < 3 ? "q" : "T"); c.px(x, top, "t") } },   // granite spur
  (c) => { for (let k = 0; k < 9; k++) c.line(60 + k * 11, 72, 70 + k * 10, 30 + (k % 3) * 6, "q") },                             // rock fissures
  rect(96, 4, 64, 11, "J"), rect(96, 4, 64, 2, "j"), (c) => { for (let x = 96; x < TW; x += 6) c.rect(x, 2, 3, 2, "J"); for (let x = 102; x < TW; x += 12) c.rect(x, 8, 2, 3, "k") },   // fort walls
  rect(122, 0, 10, 6, "J"), rect(122, 0, 10, 1, "j"),
  (c) => { for (let i = 0; i < 9; i++) { const x = 2 + i * 9, y = 52 + (i % 3) * 3; c.rect(x, y, 8, 6, "t"); c.poly([x - 1, y, x + 4, y - 4, x + 9, y], "R"); c.px(x + 3, y + 3, i % 4 ? "k" : "Y") } },   // town roofs
  rect(0, 62, 80, 10, "q"), glow("Y", { r: 6, strength: 0.5 }),
  smoke([[110, 0, 5, 1], [118, -2, 6, 2]]), (c) => { for (const [x, y] of [[100, 20], [112, 26], [128, 22]]) { c.px(x, y, "y"); c.px(x + 1, y, "Y") } },   // muzzle flashes
  soldiers([[70, 34], [84, 26, 1]]))

terrain("pointe_hoc",                                                 // the cliff from the sea, ropes and ladders
  sky(TW, 18, "usS"), stamp("_cloud_a", 120, 3),
  (c) => { for (let x = 0; x < TW; x++) { const top = Math.round(16 + 2 * Math.sin(x / 10) + (x > 120 ? (x - 120) * 0.3 : 0)); c.vline(x, top, 58 - top, "t"); c.px(x, top, "g"); c.px(x, top + 1, "G") } },
  (c) => { for (let y = 22; y < 58; y += 5) for (let x = (y * 7) % 13; x < TW; x += 17) c.hline(x, y, 8, "T") },                   // strata
  (c) => { for (const x of [20, 70, 118]) c.poly([x, 58, x + 6, 26, x + 14, 26, x + 20, 58], "T") },                               // shadowed gullies
  (c) => { for (const [x, y, r] of [[40, 16, 6], [96, 15, 7], [140, 20, 5]]) { c.ellipse(x, y, r, 3, "D"); c.ellipse(x, y - 1, r - 2, 2, "e") } },   // shell craters on the top
  rect(60, 8, 14, 7, "t"), rect(60, 8, 14, 2, "q"), line(62, 8, 58, 4, "q"), line(70, 8, 76, 2, "q"),                             // wrecked gun position
  (c) => { for (const [x, top] of [[34, 18], [52, 17], [88, 19], [104, 18]]) { c.vline(x, top, 40, "D"); for (let y = top + 3; y < 58; y += 4) c.hline(x - 1, y, 3, "e") } },   // ropes, ladders
  soldiers([[28, 26], [46, 36], [84, 30], [98, 42]]),
  rect(0, 56, TW, 4, "q"), (c) => { const r = c.rng(9); for (let i = 0; i < 40; i++) c.ellipse(Math.floor(r() * TW), 57 + Math.floor(r() * 3), 2 + Math.floor(r() * 3), 1, "T") },   // fallen rock
  grad(0, 60, TW, 12, "cbB", "v", 0.3), surf(60), stamp("_lcvp", 120, 60), stamp("_lcvp", 8, 62))
const CAMP1 = ["omaha_dog", "omaha_easy", "port_cherbourg", "wn62", "fort_roule", "pointe_hoc"]
scene("contact_camp1", { w: 2 * 162 + 2, h: 3 * 74 + 2, bg: "k" }, ...CAMP1.map((n, i) => stamp("t_" + n, 2 + (i % 2) * 162, 2 + Math.floor(i / 2) * 74)))

terrain("cote_112",                                                   // bare, shelled plateau, burnt trees, wheat around
  sky(TW, 30, "nxh"), stamp("_cloud_b", 30, 6, { swap: { w: "x", W: "n" } }),
  (c) => { for (let x = 0; x < TW; x++) { const top = Math.round(40 - 18 * Math.exp(-(((x - 84) / 50) ** 2))); c.vline(x, top, TH - top, "d"); c.px(x, top, "D") } },
  (c) => { const r = c.rng(2); for (let i = 0; i < 26; i++) { const x = Math.floor(r() * TW), y = 26 + Math.floor(r() * 44); if (c.is(x, y, "d")) { c.ellipse(x, y, 4, 2, "e"); c.ellipse(x, y - 1, 3, 1, "D"); c.hline(x - 4, y - 2, 8, "J") } } },   // crater field
  poly([0, 54, 40, 50, 30, 72, 0, 72], "j"), poly([160, 52, 124, 50, 134, 72, 160, 72], "j"), furrows(50, 72, "J"),                 // wheat at the foot
  (c) => { for (const [x, y, h] of [[60, 24, 14], [72, 22, 10], [100, 22, 16], [112, 25, 9]]) { c.vline(x, y - h, h, "e"); c.line(x, y - h + 4, x + 4, y - h, "e"); c.line(x, y - h + 7, x - 3, y - h + 4, "e") } },   // stumps
  stamp("_tank_sherman", 18, 40), stamp("_tank_sherman_x", 108, 30, { flip: "x" }), smoke([[134, 30, 4, 0], [138, 22, 5, 1], [132, 16, 5, 2]]),
  soldiers([[52, 36, 1], [74, 30]]))

terrain("mont_ormel",                                                 // the hilltop over the Dives valley, columns burning below
  sky(TW, 24, "u78"), ridge(22, 1.5, "u", 3, 30),
  grad(0, 28, TW, 22, "gGf", "v", 0.4), (c) => { for (let k = 0; k < 5; k++) c.hline(0, 32 + k * 4, TW, k % 2 ? "G" : "g") },
  line(0, 44, 160, 34, "d", 2), (c) => { for (let x = 10; x < 150; x += 14) { const y = Math.round(44 - x * 10 / 160); c.rect(x, y - 3, 7, 3, "A"); c.px(x + 6, y - 4, "z") } },   // retreating column
  smoke([[24, 36, 3, 0], [26, 30, 4, 1], [66, 32, 3, 0], [70, 25, 4, 1], [112, 30, 3, 0], [116, 22, 5, 2], [74, 18, 5, 2]]),
  (c) => { for (const x of [24, 66, 112]) { c.px(x, 40 - Math.round(x / 16), "Y"); c.px(x + 1, 40 - Math.round(x / 16), "y") } },
  poly([0, 50, 50, 44, 110, 46, 160, 52, 160, 72, 0, 72], "g"), poly([0, 60, 160, 58, 160, 72, 0, 72], "G"),                        // our hill
  (c) => { for (let x = 20; x < 140; x += 3) c.rect(x, 52 + (x % 2), 3, 2, "e") }, stamp("_tank_sherman", 100, 42, { flip: "x" }),
  soldiers([[30, 46, 1], [60, 44], [84, 48, 1]]), stamps("_tree", [[2, 40], [142, 38]]), glow("Yy", { r: 5, strength: 0.6 }))

terrain("bocage_dense",                                               // a wall of hedge, a Rhino tank cutting through
  sky(TW, 16), stamp("_cloud_a", 90, 2),
  stamps("_tree_big", [[-12, -8], [22, -12], [58, -10], [96, -12], [130, -9]]),
  rect(0, 22, TW, 28, "f"), scatter("_bush", 0, 18, 160, 34, 70, { rflip: "x" }),                                                   // the hedge itself
  poly([0, 46, 160, 42, 160, 54, 0, 56], "D"), hline(0, 46, TW, "d"),                                                                // earth bank
  rect(0, 54, TW, 18, "g"), dither(0, 54, TW, 3, "G", "g", 0.5), (c) => { for (let i = 0; i < 20; i++) { const x = (i * 23) % 160, y = 60 + (i * 7) % 10; c.vline(x, y, 2, "G") } },
  stamp("_tank_sherman", 58, 30), line(96, 46, 104, 50, "q", 2), line(96, 42, 104, 46, "q", 2),                                      // hedge-cutter prongs
  scatter("_bush", 54, 26, 50, 18, 10, { rflip: "x", seed: 7 }), smoke([[52, 44, 3, 1], [48, 40, 3, 2]], "DdJ"),
  soldiers([[18, 50, 1], [130, 48]]))

terrain("chemin_creux",                                               // sunken lane under a tunnel of branches
  grad(0, 0, TW, 34, "Shh", "v", 0.4),
  (c) => { for (let x = 0; x < TW; x++) c.vline(x, 0, Math.round(4 + Math.abs(x - 80) * 0.5 + 3 * Math.sin(x / 5)), (x * 3) % 7 < 2 ? "G" : "f") },   // canopy, gap over the lane
  scatter("_bush", 0, 0, 160, 30, 40, { rflip: "xy", clip: true, on: "fG" }),
  poly([0, 20, 60, 34, 66, 72, 0, 72], "D"), poly([160, 20, 100, 34, 94, 72, 160, 72], "e"), scatter("_bush", 0, 24, 50, 30, 16, { rflip: "x", seed: 2 }), scatter("_bush", 110, 24, 50, 30, 16, { rflip: "x", seed: 5 }),
  poly([60, 34, 100, 34, 112, 72, 48, 72], "d"), line(76, 34, 62, 72, "D"), line(84, 34, 98, 72, "D"),                              // lane, ruts
  layer("sunbeams", { light: true, density: 0.3 }, poly([70, 0, 86, 0, 104, 72, 80, 72], "w")),
  (c) => { for (const x of [30, 40, 120, 134]) c.line(x, 20, x + (x < 80 ? 6 : -6), 50, "e") },                                    // roots
  stamp("_sol", 72, 46), stamp("_kneel", 56, 52), stamp("_kneel_x", 94, 30, { flip: "x" }))

terrain("pegasus",                                                    // night: the lifting bridge and the gliders in the field
  grad(0, 0, TW, 32, "123", "v", 0.6), circ(130, 10, 5, "i"), (c) => { for (const [x, y] of [[10, 4], [40, 9], [64, 3], [96, 12], [150, 20]]) c.px(x, y, "9") },
  ridge(28, 1, "1", 2, 34), rect(0, 32, TW, 6, "2"),
  grad(0, 38, TW, 34, "3221", "v", 0.3), (c) => { for (let i = 0; i < 20; i++) c.hline((i * 37) % 150, 40 + ((i * 11) % 30), 5, "9") },
  layer("bridge", {}, rect(30, 30, 90, 4, "q"), hline(30, 30, 90, "T"),
    poly([70, 30, 80, 8, 92, 8, 96, 30], "q"), rect(80, 8, 12, 8, "N"), rect(82, 10, 8, 4, "1"),                                    // counterweight girder
    (c) => { for (let x = 32; x < 118; x += 8) { c.line(x, 30, x + 8, 22, "N"); c.line(x, 22, x + 8, 30, "N") } }, hline(30, 22, 90, "N"),
    rect(28, 30, 4, 12, "T"), rect(118, 30, 4, 12, "T")),
  poly([0, 40, 28, 38, 26, 72, 0, 72], "2"), poly([160, 40, 122, 38, 124, 72, 160, 72], "2"),
  grid(2, 44, "...qqq.......\nqqqqqqqqqqqqq\n..qqqqqqqqq..\n.....q......."), grid(132, 52, ".....qq.....\nqqqqqqqqqqq.\n...qqqqq....\n...q........"),   // Horsa gliders
  soldiers([[44, 16], [104, 18, 1]], "_night"), stamp("_sol_night", 8, 30), glow("i", { r: 10, strength: 0.35 }),
  (c) => { for (const [x, y] of [[60, 26], [110, 24]]) { c.px(x, y, "y"); c.px(x + 1, y, "Y") } }, glow("y", { r: 5, strength: 0.6 }))

terrain("pont_mine",                                                  // stone bridge rigged with charges, warning signs
  sky(TW, 26), stamp("_cloud_b", 20, 6), ridge(23, 1.5, "f", 6, 30), rect(0, 28, TW, 6, "g"),
  grad(0, 34, TW, 38, "cbB", "v", 0.3), (c) => { for (let i = 0; i < 20; i++) c.hline((i * 37) % 150, 40 + ((i * 11) % 30), 4, "c") },
  layer("bridge", {}, rect(14, 22, 132, 36, "T"), rect(14, 20, 132, 2, "t"), hline(14, 20, 132, "w"),
    (c) => { for (let y = 30; y < 58; y += 5) c.hline(14, y, 132, "q") },
    (c) => { for (const cx of [48, 112]) { c.ellipse(cx, 44, 22, 18, "t"); c.ellipse(cx, 44, 19, 15, "_"); c.rect(cx - 23, 44, 47, 20, "_") } },
    rect(74, 28, 12, 30, "T"), vline(85, 28, 30, "q")),
  layer("refl", { shade: true, density: 0.5 }, rect(26, 54, 108, 6, "k")),
  (c) => { for (const [x, y] of [[76, 32], [76, 44], [42, 28], [108, 28]]) { c.rect(x, y, 6, 4, "r"); c.hline(x, y + 1, 6, "j"); c.vline(x + 2, y, 4, "R") } },   // charges
  wire(79, 36, 150, 12, 4, "k"), wire(150, 12, 160, 18, 2, "k"),
  vline(150, 6, 16, "e"), rect(144, 4, 14, 8, "w"), box(144, 4, 14, 8, "r"), grid(148, 5, "kkkkk\nk.k.k\nkkkkk\n.k.k."),               // skull sign
  poly([0, 34, 14, 34, 18, 72, 0, 72], "g"), poly([160, 34, 146, 34, 142, 72, 160, 72], "G"),
  stamp("_kneel", 2, 30), line(16, 42, 20, 36, "M"), circ(21, 35, 2, "q"))                                                          // sapper with mine detector

terrain("chaussee",                                                   // a single raised causeway across the flooded marsh
  grad(0, 0, TW, 26, "uxS", "v", 0.35), ridge(22, 1, "f", 4, 28),
  grid(130, 8, "..q..\n..t..\n.ttt.\n.ttt.\nttttt\nttttt\nttttt\nttttt\nttttt\nttttt\nttttt\nttttt\nttttt\nttttt\nttttt"),            // Carentan steeple far away
  grad(0, 28, TW, 44, "cbB", "v", 0.3), (c) => { for (let i = 0; i < 26; i++) c.hline((i * 31) % 150, 30 + ((i * 13) % 40), 6, i % 2 ? "c" : "B") },
  stamps("_dead", [[8, 14], [36, 18], [120, 16, { flip: "x" }]]),
  poly([60, 28, 76, 28, 160, 64, 160, 72, 30, 72], "d"), poly([60, 28, 30, 72, 22, 72, 58, 28], "D"), poly([76, 28, 160, 64, 160, 66, 78, 28], "e"),   // causeway embankment
  (c) => { for (let i = 0; i < 6; i++) { const t = i / 6, x = Math.round(70 + t * 70), y = Math.round(28 + t * 34); c.vline(x, y - 10 - i * 2, 10 + i * 2, "e"); c.hline(x - 2, y - 9 - i * 2, 5, "e") } },   // telegraph poles
  stamp("_truck", 70, 34), soldiers([[44, 40], [100, 44, 1]]),
  (c) => { for (const [x, y] of [[20, 54], [130, 34]]) c.grid(x, y, ".w.w.\n..w..\n.www.\nwwcww") }, layer("mist", { density: 0.3 }, rect(0, 28, TW, 6, "S")))
const CAMP2 = ["cote_112", "mont_ormel", "bocage_dense", "chemin_creux", "pegasus", "pont_mine", "chaussee"]
scene("contact_camp2", { w: 2 * 162 + 2, h: 4 * 74 + 2, bg: "k" }, ...CAMP2.map((n, i) => stamp("t_" + n, 2 + (i % 2) * 162, 2 + Math.floor(i / 2) * 74)))

terrain("pont_vernon",                                                // wide Seine, blown spans, assault boats, chalk cliffs
  sky(TW, 22), stamp("_cloud_a", 100, 4),
  (c) => { for (let x = 0; x < TW; x++) { const top = Math.round(12 + 4 * Math.sin(x / 13 + 1)); c.vline(x, top, 26 - top, "w"); c.vline(x, top, 2, "g"); if ((x * 7) % 23 < 3) c.vline(x, top + 4, 26 - top - 6, "W") } }, rect(0, 20, TW, 4, "W"),   // chalk cliffs
  rect(0, 24, TW, 3, "G"), grad(0, 27, TW, 45, "cbbB", "v", 0.3), (c) => { for (let i = 0; i < 30; i++) c.hline((i * 37) % 150, 30 + ((i * 11) % 40), 5, i % 2 ? "c" : "B") },
  rect(0, 24, 46, 4, "T"), rect(46, 26, 8, 4, "T"), line(54, 28, 62, 34, "T", 2), rect(96, 30, 64, 4, "T"), line(96, 30, 88, 36, "T", 2),   // blown spans
  (c) => { for (const x of [20, 44, 108, 136]) { c.rect(x, 28, 6, 14, "t"); c.vline(x + 5, 28, 14, "T") } },
  (c) => { for (const [x, y] of [[30, 50], [74, 44], [118, 58]]) { c.poly([x, y, x + 20, y, x + 18, y + 4, x + 2, y + 4], "O"); c.hline(x, y, 20, "l"); for (let i = 3; i < 18; i += 4) c.grid(x + i, y - 3, "O\np"); c.hline(x - 4, y + 4, 28, "w") } },   // assault boats
  (c) => { for (const [x, y] of [[54, 38], [100, 50], [140, 40]]) c.grid(x, y, ".w.w.\n..w..\n.www.\nwwcww") },
  poly([0, 60, 50, 62, 40, 72, 0, 72], "d"), stamp("_kneel", 4, 52), smoke([[150, 18, 4, 1], [154, 12, 5, 2]]))

terrain("sainte_mere",                                                // night square, burning house, a paratrooper caught on the steeple
  grad(0, 0, TW, 40, "1237", "v", 0.5), (c) => { for (const [x, y] of [[6, 6], [30, 12], [140, 4], [118, 14]]) c.px(x, y, "9") },
  rect(64, 6, 22, 44, "3"), rect(80, 6, 6, 44, "2"), poly([64, 6, 75, -10, 86, 6], "2"), rect(70, 16, 6, 9, "1"), rect(70, 32, 6, 8, "1"),   // church
  stamp("_chute", 78, -2, { swap: { w: "x", W: "n" } }), line(85, 11, 86, 6, "n"),
  (c) => { for (const [x, w, h] of [[0, 30, 26], [32, 26, 20], [96, 28, 22], [126, 34, 28]]) { c.rect(x, 50 - h, w, h, "2"); c.poly([x - 2, 50 - h, x + w / 2, 42 - h, x + w + 2, 50 - h], "1"); for (let wx = x + 4; wx < x + w - 4; wx += 8) c.rect(wx, 50 - h + 6, 4, 5, wx % 3 ? "1" : "y") } },   // houses
  smoke([[110, 24, 5, 0], [116, 16, 6, 1], [106, 8, 6, 2]], "rYn"), rect(102, 30, 18, 8, "Y"), poly([100, 30, 111, 22, 122, 30], "r"),     // the barn fire
  rect(0, 50, TW, 22, "2"), poly([40, 50, 120, 50, 140, 72, 20, 72], "3"), (c) => { for (let y = 54; y < 72; y += 4) for (let x = 24 - (y - 50) + (y % 8); x < 136 + (y - 50); x += 9) c.hline(x, y, 5, "2") },
  stamps("_tree", [[38, 34], [104, 36]]), soldiers([[30, 52], [118, 54, 1]], "_night"), stamp("_chute", 136, 6, { swap: { w: "x", W: "n" } }),
  glow("Yy", { r: 14, strength: 0.6 }))

terrain("caen",                                                       // a field of rubble, the Abbaye aux Hommes spires behind
  grad(0, 0, TW, 40, "nxh", "v", 0.4), smoke([[20, 20, 8, 1], [34, 10, 9, 2], [140, 16, 8, 1], [128, 6, 7, 2]]),
  (c) => { for (const x of [62, 82]) { c.rect(x, 6, 8, 34, "t"); c.vline(x + 7, 6, 34, "T"); c.poly([x, 6, x + 4, -8, x + 8, 6], "T"); c.rect(x + 2, 14, 3, 6, "k") } }, rect(58, 22, 36, 18, "t"), rect(66, 26, 4, 8, "k"), rect(78, 26, 4, 8, "k"),   // abbey
  ruin(0, 46, 40, 26, 0.7), ruin(100, 46, 30, 18, 1.9, true), ruin(132, 46, 28, 30, 2.6),
  rect(0, 46, TW, 26, "T"), (c) => { const r = c.rng(6); for (let i = 0; i < 40; i++) { const x = Math.floor(r() * TW), y = 46 + Math.floor(r() * 26), rr = 2 + Math.floor(r() * 6); c.ellipse(x, y, rr, Math.ceil(rr / 2), "q"); c.ellipse(x - 1, y - 1, rr - 1, Math.ceil(rr / 2) - 1, "t"); if (i % 3 === 0) c.px(x + 1, y, "R") } },   // rubble
  poly([60, 46, 96, 46, 110, 72, 46, 72], "d"), stamp("_tank_sherman", 54, 44), soldiers([[16, 50, 1], [118, 52]]),
  (c) => { for (const [x, y] of [[30, 40], [140, 42]]) { c.line(x, y, x + 8, y - 10, "e"); c.line(x + 4, y - 5, x + 10, y - 2, "e") } })   // charred beams

terrain("saint_lo",                                                   // the town on its rock, ramparts, shattered church towers
  sky(TW, 30, "nxS"), ridge(26, 1.5, "f", 3, 34), rect(0, 34, TW, 38, "g"), dither(0, 34, TW, 3, "G", "g", 0.5),
  poly([20, 72, 34, 34, 126, 30, 144, 72], "T"), (c) => { for (let y = 38; y < 72; y += 6) for (let x = 30 + (y % 12); x < 136; x += 12) c.hline(x, y, 7, "q") },     // rampart masonry
  rect(36, 26, 88, 8, "t"), (c) => { for (let x = 36; x < 124; x += 6) c.rect(x, 24, 3, 2, "t") },
  (c) => { for (const x of [66, 84]) { c.rect(x, 4, 9, 22, "t"); c.vline(x + 8, 4, 22, "T"); c.rect(x + 3, 10, 3, 5, "k") } }, poly([66, 4, 69, 0, 72, 6, 75, 2, 75, 4], "_"), poly([84, 4, 88, 1, 93, 5, 93, 4], "_"),   // broken towers
  ruin(36, 26, 26, 14, 1.3), ruin(98, 26, 26, 16, 2.4, true),
  poly([0, 50, 26, 54, 20, 72, 0, 72], "g"), poly([160, 48, 140, 54, 146, 72, 160, 72], "G"), stamps("_bush", [[0, 60], [146, 62]]),
  line(144, 72, 112, 40, "d", 3), stamp("_tank_sherman", 112, 46, { flip: "x" }), soldiers([[4, 46], [130, 40, 1]]),
  smoke([[100, 10, 5, 1], [108, 4, 6, 2], [44, 14, 4, 1]]))

terrain("paris",                                                      // Hôtel de Ville, a barricade, tricolours out
  sky(TW, 34, "uS8"), stamp("_cloud_a", 10, 4), stamp("_cloud_b", 128, 8),
  grid(144, 2, "...q...\n...q...\n..qqq..\n..q.q..\n..qqq..\n.q...q.\n.q...q.\nqqqqqqq\nq.....q\nq.....q\nq.....q"),                    // the Tower, far
  rect(20, 14, 120, 34, "j"), rect(20, 14, 120, 3, "J"), (c) => { for (let x = 26; x < 136; x += 10) { c.rect(x, 20, 5, 8, "2"); c.rect(x, 32, 5, 9, "2"); c.hline(x - 1, 28, 7, "J") } },   // façade
  poly([16, 14, 26, 4, 134, 4, 144, 14], "6"), poly([70, 4, 75, -4, 85, -4, 90, 4], "6"), rect(76, -2, 8, 8, "j"), circ(80, 2, 2, "w"),   // roofs, clock
  (c) => { for (const x of [34, 80, 126]) { c.vline(x, 4, 14, "e"); c.rect(x + 1, 4, 3, 6, "6"); c.rect(x + 4, 4, 3, 6, "w"); c.rect(x + 7, 4, 3, 6, "r") } },   // tricolours
  rect(0, 48, TW, 24, "T"), (c) => { for (let y = 50; y < 72; y += 3) for (let x = (y % 6) * 2; x < TW; x += 6) c.rect(x, y, 4, 2, "t") },   // paving
  (c) => { for (const [x, w] of [[30, 26], [62, 40], [108, 24]]) { c.poly([x, 56, x + 4, 46, x + w - 4, 46, x + w, 56], "q"); for (let i = x + 2; i < x + w - 2; i += 4) c.rect(i, 48 + (i % 3), 3, 2, "t") } },   // barricade of paving stones
  grid(66, 40, "..eeee..\n.eMMMMe.\neeeeeeee\n.M....M."), stamp("_resist", 44, 30), stamp("_resist", 92, 32, { flip: "x" }), stamp("_sol", 120, 34))

terrain("carpiquet",                                                  // airfield wrecked: torn hangar, cratered runway
  sky(TW, 30, "nxS"), ridge(28, 1, "f", 2, 34), rect(0, 32, TW, 40, "g"), dither(0, 32, TW, 4, "G", "g", 0.5),
  (c) => { c.ellipse(40, 34, 30, 18, "a"); c.rect(10, 34, 60, 20, "_") }, (c) => { for (let x = 14; x < 66; x += 4) for (let y = 16; y < 34; y++) if (c.is(x, y, "a")) c.px(x, y, "A") },
  poly([26, 16, 44, 20, 34, 34, 22, 34], "k"), (c) => { for (let x = 22; x < 44; x += 3) c.line(x, 18 + (x % 5), x + 2, 34, "q") },      // the hole, ribs
  poly([64, 34, 92, 34, 160, 66, 160, 72, 40, 72], "n"), line(64, 34, 40, 72, "N"), line(92, 34, 160, 66, "N"),                             // runway
  (c) => { for (const [x, y, r] of [[80, 42, 5], [100, 54, 7], [70, 60, 6], [130, 62, 5]]) { c.ellipse(x, y, r, Math.ceil(r / 2), "e"); c.ellipse(x, y - 1, r - 1, Math.ceil(r / 2) - 1, "D"); c.hline(x - r, y - Math.ceil(r / 2) - 1, 2 * r, "N") } },
  stamp("_plane_p47_x", 108, 36, { rot: 180, flip: "y" }), smoke([[124, 38, 3, 0], [128, 32, 4, 1], [122, 26, 5, 2]]),                       // wrecked Fw 190
  (c) => { for (let x = 0; x < 30; x += 8) c.rect(x, 54, 6, 3, "d") }, soldiers([[4, 40, 1], [20, 44]]), stamp("_tank_sherman", 132, 50))

terrain("cerisy",                                                     // summer beech forest, sun shafts, foxholes
  rect(0, 0, TW, TH, "G"), grad(0, 0, TW, 16, "gSg", "v", 0.4),
  (c) => { for (const x of [10, 34, 62, 96, 124, 150]) { c.rect(x, 0, 5, 60, "t"); c.vline(x + 4, 0, 60, "T"); c.vline(x, 0, 60, "x") } },   // beech trunks
  stamps("_tree_big", [[-8, -24], [26, -26], [58, -22], [92, -26], [120, -24]]),
  rect(0, 56, TW, 16, "f"), dither(0, 54, TW, 3, "G", "f", 0.5), scatter("_bush", 0, 50, 160, 22, 18, { rflip: "x" }),
  layer("sunbeams", { light: true, density: 0.25 }, poly([40, 0, 52, 0, 80, 72, 62, 72], "w"), poly([104, 0, 112, 0, 132, 72, 120, 72], "w")),
  ellipse(80, 62, 12, 3, "e"), ellipse(80, 63, 9, 2, "k"), grid(76, 58, ".OOO.\nOOOOO"), line(84, 60, 94, 55, "M"),
  stamp("_kneel", 40, 46), stamp("_sol", 110, 40))
const CAMP3 = ["pont_vernon", "sainte_mere", "caen", "saint_lo", "paris", "carpiquet", "cerisy"]
scene("contact_camp3", { w: 2 * 162 + 2, h: 4 * 74 + 2, bg: "k" }, ...CAMP3.map((n, i) => stamp("t_" + n, 2 + (i % 2) * 162, 2 + Math.floor(i / 2) * 74)))
