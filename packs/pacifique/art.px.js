// Pacific 1942–1945 — card (64x40) and terrain (160x72) illustrations, map, icons, coin.
// Build (writes packs/pacifique/out/): node ~/.claude/skills/pxl-pixel-art/bin/pxl.js build packs/pacifique/art.px.js --no-preview
// Palette of the Pacific war: hard tropical light, deep ocean and turquoise lagoons, white sand, palm green, black
// volcanic ash. US olive drab and haze-gray ships against Japanese khaki and darker naval gray.
pal({
  k: "#14110f", M: "#2e2f2c",
  u: "#4f86bd", s: "#78aad6", S: "#a9cfe6", h: "#ddeeea",            // tropical sky, top -> horizon
  7: "#d9845a", 8: "#f2c27a",                                        // dusk
  1: "#111a2e", 2: "#1d2c4b", 3: "#32507e", 9: "#7f95b8",            // night
  w: "#f6f3e8", W: "#cdd6d6",                                        // cloud, foam, white
  B: "#173f62", b: "#285f8c", c: "#3f86b0", C: "#7fbdd6",            // ocean, deep -> light
  L: "#2fa5a3", Q: "#7cd3c3",                                        // lagoon
  m: "#ecd9a2", d: "#cdb077", D: "#9b7f4c", e: "#5b4529",            // sand, wood
  g: "#78b04c", G: "#46833a", f: "#2b5e30", F: "#173a24",            // palms, jungle
  n: "#77716a", N: "#45413d", x: "#a49e94",                          // ash, smoke
  l: "#9ea86a", o: "#737d46", O: "#535b33", v: "#363d22",            // US olive drab
  Z: "#cbbb7e", a: "#aa975b", A: "#7d6d3f", z: "#4e4428",            // Japanese khaki
  t: "#b2bcc2", T: "#848f97", q: "#5a656e",                          // US haze gray, steel
  i: "#9a9c98", I: "#6c6f6c", j: "#474a48",                          // Japanese naval gray
  p: "#e0b088", P: "#b07e56",                                        // skin
  y: "#ffe08a", Y: "#f29a3a", r: "#c8352c", R: "#7e2622",            // fire, red
  6: "#2b4a8c",                                                      // US insignia blue
  4: "#e4d6aa", 5: "#c0aa76", H: "#8b7a52",                          // chart paper
})
ramps("kFfGg", "kvOol", "kzAaZ", "keDdm", "kqTt", "kjIi", "kBbcC", "kRrYy", "kNnx", "k123", "kWw", "kus", "k5")

const JP = { l: "Z", o: "a", O: "A", v: "z", t: "i", T: "I", q: "j" }
const NIGHT = { l: "3", o: "2", O: "1", v: "1", p: "3", P: "2", d: "2", D: "1", m: "2", e: "1", t: "3", T: "2", q: "1", Z: "3", a: "2", A: "1", z: "1" }

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

// Infantry facing right. Rows 0-1: the M1 helmet (US) or the Japanese helmet with its neck cloth.
const SOL = `
  ...OOOO......
  ..OOOOOOO....
  ..vOpppP.....
  ...ppppP.....
  ...ooooo.....
  ..oloooooMMMM
  ..olooqqqM...
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
  ...OOOO.....
  ..OOOOOOO...
  ..vOpppP....
  ...ppppP....
  ...ooooo....
  ..oloooooMMM
  ..oloooo.pp.
  ..oooooO....
  ...dddd.....
  ...oooooooo.
  ..ooOO...oo.
  .ooOO....oo.
  eeOO.....ee.
  ee.......eee`
const hat = (grid, a, b) => { const r = grid.split("\n").filter((x) => x.trim()); r[0] = a; r[1] = b; return r.join("\n") }
const JPHAT = ["  ...OOOO.....", "  ..OOOOOO...."]
const JPHAT_K = ["  ...OOOO....", "  .OOOOOOO..."]
sprite("_sol", { outline: "k" }, SOL)
sprite("_kneel", { outline: "k" }, KNEEL)
sprite("_sol_x", { outline: "k", swap: JP }, hat(SOL, ...JPHAT).replace("..vOpppP", ".OvOpppP"))
sprite("_kneel_x", { outline: "k", swap: JP }, hat(KNEEL, ...JPHAT_K).replace("..vOpppP", ".OvOpppP"))
sprite("_sol_night", { outline: "k", swap: NIGHT }, SOL)
sprite("_sol_x_night", { outline: "k", swap: { ...NIGHT, ...{ o: "2" } } }, hat(SOL, ...JPHAT).replace("..vOpppP", ".OvOpppP"))

// Ships, side view facing right. len = hull length. kind: bb battleship, dd destroyer, cv carrier, ss submarine,
// ak freighter, lc landing craft. Japanese versions swap the grays.
function ship(name, kind, len, swap) {
  const H = { bb: 16, dd: 12, cv: 14, ss: 8, ak: 15, lc: 7 }[kind]
  sprite(name, { w: len + 2, h: H, swap }, (c) => {
    const y = H - 4                                                               // waterline - 1
    // hull: raked bow on the right, rounded stern on the left
    c.poly([0, y - 1, len - 4, y - 2, len + 1, y - 4, len - 2, y + 2, 2, y + 2], "T")
    c.hline(1, y - 1, len - 4, "t"); c.hline(2, y + 2, len - 4, "q")
    if (kind === "bb") {
      c.rect(len * 0.35, y - 6, len * 0.3, 5, "t"); c.rect(len * 0.42, y - 10, 6, 4, "T"); c.vline(len * 0.45, y - 14, 4, "q")   // superstructure, tower, mast
      c.rect(len * 0.38, y - 8, 3, 2, "q")                                                                                     // funnel
      for (const gx of [len * 0.12, len * 0.24, len * 0.72, len * 0.84]) { c.rect(gx, y - 3, 5, 2, "q"); c.hline(gx + (gx > len / 2 ? 5 : -5), y - 3, 5, "q") }   // turrets, barrels
    } else if (kind === "dd") {
      c.rect(len * 0.55, y - 5, 6, 4, "t"); c.vline(len * 0.6, y - 9, 4, "q")                                                // bridge, mast
      c.rect(len * 0.35, y - 4, 3, 3, "q"); c.rect(len * 0.25, y - 4, 3, 3, "q")                                             // two funnels
      c.rect(len * 0.78, y - 2, 3, 1, "q"); c.hline(len * 0.82, y - 2, 4, "q"); c.rect(len * 0.08, y - 2, 3, 1, "q")
    } else if (kind === "cv") {
      c.rect(0, y - 3, len, 2, "q"); c.hline(0, y - 3, len, "T")                                                             // flight deck
      c.rect(len * 0.6, y - 8, 5, 5, "t"); c.rect(len * 0.6 + 1, y - 10, 3, 2, "q"); c.vline(len * 0.6 + 2, y - 13, 3, "q")  // island
      for (let x = 4; x < len - 6; x += 7) c.px(x, y - 3, "w")                                                               // deck markings
    } else if (kind === "ss") {
      c.rect(len * 0.42, y - 4, 5, 3, "q"); c.vline(len * 0.45, y - 7, 3, "q"); c.hline(len * 0.65, y - 2, 3, "q")          // conning tower, periscope, deck gun
    } else if (kind === "ak") {
      c.rect(len * 0.42, y - 6, 8, 5, "t"); c.rect(len * 0.46, y - 9, 3, 3, "q")                                             // bridge, funnel
      for (const mx of [len * 0.2, len * 0.75]) { c.vline(mx, y - 11, 10, "q"); c.line(mx, y - 10, mx + 5, y - 3, "q") }      // masts, derricks
      c.rect(len * 0.1, y - 3, 7, 2, "D"); c.rect(len * 0.68, y - 3, 6, 2, "d")                                              // deck cargo
    } else if (kind === "lc") {
      c.rect(len - 4, y - 3, 3, 4, "q"); c.rect(2, y - 2, 4, 2, "q")                                                         // ramp, wheelhouse
    }
  })
}
ship("_bb", "bb", 50); ship("_bb_x", "bb", 50, JP); ship("_yamato", "bb", 58, JP)
ship("_dd", "dd", 36); ship("_dd_x", "dd", 36, JP)
ship("_cv", "cv", 52); ship("_cv_x", "cv", 52, JP)
ship("_ss", "ss", 34); ship("_ss_x", "ss", 34, JP)
ship("_ak", "ak", 42); ship("_ak_x", "ak", 42, JP)
ship("_bb_far", "bb", 26); ship("_dd_far", "dd", 18); ship("_cv_far", "cv", 24); ship("_ak_far", "ak", 20)
ship("_bb_far_x", "bb", 26, JP); ship("_dd_far_x", "dd", 18, JP); ship("_cv_far_x", "cv", 24, JP); ship("_ak_far_x", "ak", 20, JP)

// Monoplane facing right. US: blue fuselage and the white star; Japan: light gray or green and the red disc.
// kind: fighter, bomber (longer canopy, bomb), torpedo (deep belly, torpedo).
function plane(name, kind, jp, body, dive = 0) {
  const [b1, b2] = body || (jp ? ["i", "I"] : ["c", "b"])
  const S = dive ? 32 : 0
  sprite(name, dive ? { w: S, h: S, outline: "k" } : { w: 30, h: 13, outline: "k" }, (c0) => {
    // Diving: draw level into a buffer, then copy it rotated by `dive` degrees (nose down) around the centre.
    const buf = new Map(), c = dive ? { poly: (pts, k) => c0.poly(pts, k), hline: (...a) => c0.hline(...a), rect: (...a) => c0.rect(...a), vline: (...a) => c0.vline(...a), px: (...a) => c0.px(...a), circ: (...a) => c0.circ(...a) } : c0
    c.poly([1, 6, 6, 5, 22, 4, 26, 5, 27, 7, 23, 9, 6, 8, 1, 7], b1); c.hline(6, 8, 17, b2)      // fuselage
    c.poly([1, 6, 1, 1, 4, 1, 7, 5], b1); c.hline(0, 6, 6, b2)                                   // fin, tailplane
    c.rect(25, 4, 3, 5, "M"); c.vline(29, 1, 11, "n")                                            // cowling, prop disc
    c.poly([9, 7, 21, 7, 19, 11, 12, 11], b2); c.hline(12, 10, 7, b1)                            // wing (seen from slightly below)
    c.rect(15, 3, kind === "bomber" || kind === "torpedo" ? 8 : 4, 2, "C"); c.px(17, 3, "W")    // canopy
    if (kind === "torpedo") { c.hline(10, 11, 12, "q"); c.px(22, 11, "M") }                      // torpedo
    if (kind === "bomber") { c.rect(15, 10, 4, 2, "M") }                                         // bomb
    if (jp) { c.circ(15, 9, 1, "r"); c.circ(4, 6, 1, "r") }
    else { c.circ(15, 9, 1, "6"); c.px(15, 9, "w"); c.px(14, 9, "w"); c.px(16, 9, "w"); c.circ(4, 6, 1, "6"); c.px(4, 6, "w") }
    if (!dive) return
    for (let y = 0; y < 13; y++) for (let x = 0; x < 30; x++) { const k = c0.key(x, y); if (k && k !== ".") buf.set(x + "," + y, k) }
    c0.rect(0, 0, S, S, "_")
    const a = dive * Math.PI / 180, co = Math.cos(a), si = Math.sin(a)
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const dx = x - 15.5, dy = y - 15.5, sx = Math.round(co * dx + si * dy + 15), sy = Math.round(-si * dx + co * dy + 6.5)
      const k = buf.get(sx + "," + sy); if (k) c0.px(x, y, k)
    }
  })
}
plane("_hellcat", "fighter", false); plane("_zero", "fighter", true, ["i", "I"])
plane("_sbd", "bomber", false); plane("_val", "bomber", true, ["f", "F"])
plane("_tbf", "torpedo", false); plane("_kate", "torpedo", true, ["G", "f"])
plane("_corsair", "fighter", false, ["b", "B"]); plane("_george", "fighter", true, ["G", "f"])
plane("_sbd_dive", "bomber", false, null, 50); plane("_val_dive", "bomber", true, ["f", "F"], 50)
plane("_zero_dive", "fighter", true, ["i", "I"], 35); plane("_hellcat_dive", "fighter", false, null, 35)
plane("_zero_fall", "fighter", true, ["i", "I"], 70); plane("_val_fall", "bomber", true, ["f", "F"], 60)
// Small far-away plane silhouettes.
sprite("_dot_plane", `
  ..k..
  kkkkk
  ..k..
  .kkk.`)

// Palm tree, leaning: trunk of `h` px, fronds on top.
function palm(name, h, lean) {
  sprite(name, { w: 21, h: h + 6 }, (c) => {
    for (let i = 0; i < h; i++) { const x = 10 + Math.round(lean * (i / h) ** 1.6); c.px(x, h + 5 - i, i % 3 ? "D" : "e"); c.px(x + 1, h + 5 - i, "d") }
    const tx = 10 + lean, ty = 6
    for (const [dx, dy] of [[-9, 3], [-7, -2], [-2, -5], [5, -4], [9, 1], [8, 5], [-5, 5]]) c.line(tx, ty, tx + dx, ty + dy, "G", 2)
    for (const [dx, dy] of [[-8, 2], [-6, -3], [4, -4], [8, 0]]) c.line(tx, ty - 1, tx + dx, ty + dy, "g")
    c.px(tx, ty + 1, "e"); c.px(tx + 1, ty + 1, "D")
  })
}
palm("_palm_a", 22, 4); palm("_palm_b", 16, -3); palm("_palm_c", 28, 6); palm("_palm_d", 12, 2)
group("_palms", ["_palm_a", "_palm_b", "_palm_c", "_palm_d"])
// Shattered palm after a bombardment.
sprite("_stump", { w: 7, h: 16 }, (c) => { c.rect(2, 2, 3, 14, "D"); c.vline(2, 2, 14, "e"); c.px(3, 1, "D"); c.px(5, 0, "e"); c.line(4, 5, 6, 3, "e") })

sprite("_boom", { w: 17, h: 16 }, (c) => {
  c.circ(8, 5, 4, "N"); c.circ(4, 7, 3, "n"); c.circ(12, 6, 3, "n"); c.circ(8, 2, 2, "n")
  c.circ(8, 11, 5, "r"); c.circ(8, 11, 3, "Y"); c.circ(8, 12, 1, "y")
  c.poly([0, 16, 4, 12, 13, 12, 17, 16], "r"); c.poly([3, 16, 6, 13, 11, 13, 14, 16], "Y")
})
// Water column thrown up by a shell or a bomb.
sprite("_splash", { w: 11, h: 18 }, (c) => {
  c.poly([1, 17, 4, 5, 5, 0, 6, 5, 9, 17], "C"); c.poly([3, 17, 5, 7, 5, 2, 6, 7, 7, 17], "w")
  c.circ(2, 8, 1, "C"); c.circ(8, 6, 1, "C"); c.ellipse(5, 17, 5, 1, "w")
})
sprite("_flak", `
  .nn.
  nNNn
  nNNn
  .nn.`)

// ------------------------------------------------------------------ backdrop helpers
const sky = (w, hor, keys = "usS") => grad(0, 0, w, hor, keys, "v", 0.35)
// Sea from y to the bottom: bands deep -> light toward the horizon, short wave dashes.
const sea = (y, w, h, seed = 1, keys = "cbB") => (c) => {
  c.rect(0, y, w, h - y, keys[0])
  if (keys[1]) c.rect(0, y + Math.round((h - y) * 0.35), w, h, keys[1])
  if (keys[2]) c.rect(0, y + Math.round((h - y) * 0.75), w, h, keys[2])
  c.hline(0, y, w, "C")
  const r = c.rng(seed)
  for (let i = 0; i < w * (h - y) / 60; i++) { const yy = y + 2 + Math.floor(r() * (h - y - 2)), len = 2 + Math.floor((yy - y) / 6); c.hline(Math.floor(r() * w), yy, len, yy - y < (h - y) * 0.4 ? "C" : "c") }
}
// Foam line where waves break: dashed white along a row.
const surf = (y, x0, x1, seed = 1) => (c) => { const r = c.rng(seed); for (let x = x0; x < x1; x++) if (r() < 0.75) c.px(x, y + (r() < 0.2 ? 1 : 0), "w"); for (let x = x0; x < x1; x += 4) c.px(x + 2, y - 1, "W") }
// Wake behind a ship (to its left), widening.
const wake = (x, y, len) => (c) => { for (let i = 0; i < len; i++) { const sp = Math.round(i / 5); c.px(x - i, y - sp, "w"); c.px(x - i, y + sp, i % 2 ? "W" : "w") } }
const beach = (y, w, h, seed = 1) => (c) => {
  c.rect(0, y, w, h - y, "m"); const r = c.rng(seed)
  for (let i = 0; i < w / 6; i++) c.hline(Math.floor(r() * w), y + 2 + Math.floor(r() * (h - y - 2)), 2 + Math.floor(r() * 3), "d")
}
const smoke = (pts, keys = "Nnx") => (c) => { for (const [x, y, r, k = 0] of pts) c.circ(x, y, r, keys[k]) }
const hills = (y, amp, key, seed = 0, to) => (c) => {
  const r = c.rng(seed + 1), ph = r() * 6
  for (let x = 0; x < c.w; x++) { const top = Math.round(y - amp * (Math.sin(x * 0.07 + ph) + 0.6 * Math.sin(x * 0.19 + 2 * ph))); c.vline(x, top, (to || c.h) - top, key) }
}
const jungleWall = (y, w, seed = 1) => (c) => {
  const r = c.rng(seed)
  for (let x = 0; x < w; x++) { const top = y - Math.round(4 + 3 * Math.sin(x * 0.3 + seed) + 2 * Math.sin(x * 0.11)); c.vline(x, top, c.h - top, "f") }
  for (let i = 0; i < w * 1.2; i++) { const x = Math.floor(r() * w), yy = y - 6 + Math.floor(r() * 10); c.circ(x, yy, 1 + Math.floor(r() * 2), r() < 0.5 ? "G" : "f") }
  for (let i = 0; i < w / 2; i++) c.px(Math.floor(r() * w), y - 8 + Math.floor(r() * 8), "g")
}
function stamps2(name, pts) { return (c) => { for (const [x, y, o] of pts) c.stamp(name, x, y, o) } }

// ------------------------------------------------------------------ cards (64x40)
const CW = 64, CH = 40
function unit(name, build) {
  scene("c_" + name, { w: CW, h: CH }, ...build(""))
  scene("c_" + name + "_x", { w: CW, h: CH }, ...build("_x"))
}
const P2 = (x, us, jp) => (x ? jp : us)

unit("cuirasse", (x) => [
  sky(CW, 24, "uss"), stamp("_cloud_a", 6, 4), sea(24, CW, CH, 1),
  stamp("_bb" + x, 6, 13), wake(8, 27, 8),
  smoke([[52, 14, 4, 2], [57, 10, 3, 2], [48, 10, 3, 1]]), poly([50, 19, 60, 15, 57, 19], "Y"), circ(51, 18, 2, "y"),
  glow("y", { r: 5, strength: 0.4 }),
])
unit("destroyer", (x) => [
  sky(CW, 20), stamp("_cloud_b", 44, 3), sea(20, CW, CH, 2),
  stamp("_dd" + x, 22, 12), poly([58, 22, 62, 19, 62, 24], "w"), wake(24, 22, 18),
  stamp("_splash", 4, 9), stamp("_splash", 14, 12),
])
unit("sous_marin", (x) => [
  grad(0, 0, CW, 22, "123", "v", 0.6), circ(52, 6, 3, "w"), glow("w", { r: 8, strength: 0.4 }),
  sea(22, CW, CH, 3, "321"), hline(0, 22, CW, "9"),
  stamp(P2(x, "_ss", "_ss_x"), 2, 16, { swap: NIGHT }), (c) => { for (let i = 0; i < 22; i++) c.px(38 + i, 30 + Math.round(i / 4), i % 2 ? "9" : "w") },   // torpedo wake
  stamp(P2(x, "_ak_far_x", "_ak_far"), 42, 13, { swap: NIGHT }), stamp("_boom", 46, 6),
])
unit("dauntless", (x) => [
  sky(CW, 26), stamp("_cloud_a", 40, 2), sea(26, CW, CH, 4),
  stamp(P2(x, "_sbd_dive", "_val_dive"), 4, -2),
  stamp(P2(x, "_cv_far_x", "_cv_far"), 30, 20), stamp("_splash", 40, 12), stamp("_boom", 24, 14),
  hline(16, 8, 3, "W"), hline(13, 3, 3, "W"),
])
unit("hellcat", (x) => [
  sky(CW, CH, "uss"), stamp("_cloud_a", 2, 26), stamp("_cloud_b", 44, 4), stamp("_cloud_b", 30, 30),
  stamp(P2(x, "_hellcat", "_zero"), 14, 10),
  hline(2, 14, 8, "W"), hline(4, 17, 6, "W"),
  stamp(P2(x, "_zero_fall", "_hellcat_dive"), 40, 14), smoke([[50, 24, 2, 0], [47, 21, 2, 1], [45, 18, 1, 2]]),
])
unit("marines", (x) => [
  sky(CW, 14, "ush"), sea(14, CW, 26, 5), beach(26, CW, CH, 5), surf(25, 0, CW, 5),
  stamp("_palm_b", 46, -2), stamp("_palm_d", 30, 4),
  stamp("_sol" + x, 4, 15), stamp("_sol" + x, 20, 18), stamp("_kneel" + x, 40, 22),
  rect(0, 26, 18, 2, "C"), rect(15, 30, 10, 1, "C"),
])
unit("lance_flammes", (x) => [
  sky(CW, 12, "u78"), rect(0, 12, CW, 28, "n"), hills(16, 2, "N", 3, 40),
  rect(44, 18, 20, 22, "N"), ellipse(54, 28, 6, 5, "k"), rect(48, 28, 13, 12, "N"),          // cave mouth
  beach(34, CW, CH, 6), dither(0, 33, CW, 2, "n", "m", 0.5),
  stamp("_sol" + x, 4, 19), rect(4, 24, 4, 7, "q"), hline(4, 24, 4, "T"),
  line(16, 26, 22, 25, "M"),
  poly([22, 24, 38, 21, 52, 26, 54, 31, 38, 30, 22, 26], "r"), poly([22, 24, 36, 23, 46, 27, 38, 28, 22, 26], "Y"), poly([22, 25, 32, 24, 38, 26, 30, 26], "y"),
  glow("Yy", { r: 7, strength: 0.5 }),
])
unit("seabees", (x) => [
  sky(CW, 18), stamp("_cloud_b", 6, 3), jungleWall(20, CW, 4), rect(0, 24, CW, 16, "d"), rect(0, 27, CW, 8, "x"),
  (c) => { for (let px = 2; px < CW; px += 6) c.hline(px, 31, 3, "W") },                       // pierced-steel planking
  // bulldozer
  rect(18, 22, 20, 8, "Y"), rect(20, 17, 9, 5, "q"), rect(21, 18, 7, 3, "C"), vline(31, 18, 4, "M"),
  rect(16, 30, 24, 4, "M"), (c) => { for (let wx = 18; wx < 40; wx += 4) c.circ(wx, 32, 1, "q") }, rect(38, 23, 3, 11, "q"), rect(41, 26, 3, 8, "T"),
  stamp("_kneel" + x, 6, 22), stamp(P2(x, "_palm_d", "_palm_d"), 48, 8),
])
unit("cargo", (x) => [
  sky(CW, 22, "ush"), sea(22, CW, CH, 7, "cb"),
  rect(0, 28, 20, 12, "D"), hline(0, 28, 20, "d"), (c) => { for (let px = 1; px < 20; px += 5) c.vline(px, 29, 11, "e") },   // pier
  stamp("_ak" + x, 18, 11), wake(20, 24, 6),
  (c) => { for (const [bx, by] of [[2, 22], [9, 22], [5, 17]]) { c.rect(bx, by, 6, 5, "d"); c.box(bx, by, 6, 5, "D"); c.line(bx, by, bx + 5, by + 4, "D") } },   // crates
])
unit("porte_avions", (x) => [
  sky(CW, 20), stamp("_cloud_a", 40, 2), sea(20, CW, CH, 8),
  stamp("_cv" + x, 4, 12), wake(6, 22, 6),
  (c) => { for (const px of [10, 18, 26]) c.grid(px, 13, "k.k\nkkk", x ? JP : undefined) },   // planes on deck
  stamp("_dot_plane", 46, 6), stamp("_dot_plane", 54, 10), stamp("_dot_plane", 38, 4),
])
unit("corsair", (x) => [
  sky(CW, 20, "ush"), jungleWall(30, CW, 9), smoke([[52, 26, 4, 0], [56, 20, 5, 1], [50, 18, 3, 2]]),
  stamp(P2(x, "_corsair", "_george"), 8, 6),
  line(36, 13, 48, 22, "y"), line(37, 14, 49, 23, "Y"), stamp("_boom", 44, 18),
])
unit("lvt", (x) => [
  sky(CW, 12), sea(12, CW, 24, 10), beach(24, CW, CH, 10), surf(23, 0, CW, 10),
  // amtrac climbing out of the surf: boxy hull, tracks
  poly([14, 30, 18, 20, 44, 20, 48, 26, 46, 32, 14, 32], P2(x, "o", "a")), hline(18, 20, 26, P2(x, "l", "Z")), rect(16, 30, 30, 4, "M"),
  (c) => { for (let tx = 17; tx < 46; tx += 3) c.px(tx, 33, "q") }, rect(36, 16, 6, 4, P2(x, "O", "A")), hline(41, 17, 4, "M"),
  stamp("_kneel" + x, 20, 9), stamp("_kneel" + x, 28, 9), poly([10, 30, 14, 26, 14, 32], "w"), surf(31, 4, 16, 3),
])
unit("code_talkers", (x) => [
  sky(CW, 14), jungleWall(18, CW, 11), rect(0, 26, CW, 14, "D"), ellipse(32, 30, 26, 6, "e"),    // foxhole
  rect(24, 22, 12, 9, P2(x, "O", "A")), rect(25, 23, 10, 3, "q"), (c) => { for (let i = 0; i < 4; i++) c.px(26 + 2 * i, 27, "y") }, vline(34, 6, 16, "M"), px(34, 5, "q"),   // radio, antenna
  stamp("_kneel" + x, 8, 18), stamp("_kneel" + x, 40, 18, { flip: "x" }), line(17, 22, 23, 24, "M"), line(46, 22, 36, 24, "M"),
])
unit("yamato", (x) => [
  sky(CW, 22, "u78"), sea(22, CW, CH, 12, "7cb"), hline(0, 22, CW, "8"),
  stamp(P2(x, "_yamato", "_yamato"), 2, 9), wake(4, 25, 5),
  smoke([[36, 5, 3, 1], [40, 2, 3, 2]]),
])
unit("garnison", (x) => [
  rect(0, 0, CW, CH, "N"), (c) => { const r = c.rng(13); for (let i = 0; i < 60; i++) c.px(Math.floor(r() * CW), Math.floor(r() * CH), r() < 0.5 ? "n" : "k") },
  ellipse(30, 24, 26, 14, "k"), rect(4, 24, 52, 16, "k"), rect(0, 36, CW, 4, "e"),              // tunnel
  stamp("_kneel" + x, 8, 20), stamp("_sol" + x, 34, 17),
  rect(20, 27, 10, 2, "q"), hline(30, 27, 4, "M"), line(22, 29, 20, 33, "q"), line(26, 29, 28, 33, "q"),   // machine gun
  circ(50, 8, 1, "y"), light([50, 9, 14]),
])
unit("tireurs", (x) => [
  sky(CW, 20, "ush"), sea(20, CW, 28, 14), beach(28, CW, CH, 14), surf(27, 0, CW, 14),
  stamp("_palm_c", 30, -2), stamp("_kneel" + x, 40, 2), line(48, 7, 56, 6, "M"),
  stamp(P2(x, "_sol_x", "_sol"), 6, 24), smoke([[57, 6, 1, 2]]),
])
unit("kamikaze", (x) => [
  sky(CW, 26, "usS"), sea(26, CW, CH, 15),
  stamp(P2(x, "_zero_dive", "_hellcat_dive"), 2, -4), smoke([[8, 2, 2, 0], [5, 0, 2, 1]]),
  stamps2("_flak", [[30, 4], [44, 10], [22, 14], [52, 2]]),
  stamp(P2(x, "_cv_far", "_cv_far_x"), 30, 20), stamp("_boom", 38, 12), glow("Yy", { r: 6, strength: 0.4 }),
])
unit("avenger", (x) => [
  sky(CW, 22), stamp("_cloud_b", 40, 2), sea(22, CW, CH, 16),
  stamp(P2(x, "_tbf", "_kate"), 4, 10),
  hline(14, 30, 6, "q"), (c) => { for (let i = 0; i < 18; i++) c.px(20 + i, 31, i % 2 ? "W" : "w") },
  stamp(P2(x, "_bb_far_x", "_bb_far"), 36, 18), stamp("_splash", 50, 12),
])
unit("corpsman", (x) => [
  sky(CW, 14, "ush"), sea(14, CW, 22, 17), beach(22, CW, CH, 17), surf(21, 0, CW, 17),
  stamp("_palm_a", 44, -4),
  stamp("_kneel" + x, 10, 20), rect(13, 25, 3, 2, "w"), px(14, 25, "r"),                        // armband
  rect(22, 32, 18, 3, P2(x, "o", "a")), rect(38, 31, 4, 3, "p"), rect(20, 31, 3, 3, P2(x, "O", "A")),   // wounded
  rect(26, 28, 4, 3, "w"), px(27, 29, "r"), px(28, 29, "r"),                                     // first-aid kit
])

// Orders are side-neutral: one illustration each.
const order = (name, ...items) => scene("c_" + name, { w: CW, h: CH }, ...items)
order("turkey_shoot",
  sky(CW, 30, "usS"), sea(30, CW, CH, 20),
  stamp("_zero_fall", 2, -2), smoke([[9, 3, 2, 0], [6, 0, 2, 1]]),
  stamp("_val_fall", 34, 4), smoke([[44, 11, 2, 0], [41, 8, 2, 1]]),
  stamp("_hellcat", 22, 18), stamps2("_flak", [[30, 4], [52, 4], [18, 12]]), stamp("_splash", 52, 22))
order("banzai",
  grad(0, 0, CW, 24, "123", "v", 0.6), circ(40, 5, 2, "w"), glow("w", { r: 9, strength: 0.5 }),
  rect(0, 24, CW, 16, "2"), hline(0, 24, CW, "3"), stamp("_palm_b", 2, 4, { swap: NIGHT }),
  stamp("_sol_x_night", 10, 20), stamp("_sol_x_night", 26, 18), stamp("_sol_x_night", 42, 21),
  line(23, 26, 28, 22, "9"), line(39, 24, 44, 20, "9"), line(55, 27, 60, 23, "9"))
order("bombardement",
  sky(CW, 20, "u78"), sea(20, CW, CH, 21),
  hills(22, 3, "G", 5, 30), rect(0, 26, 30, 4, "m"),
  stamp("_boom", 4, 10), stamp("_boom", 18, 8), smoke([[12, 6, 5, 0], [24, 4, 4, 1]]),
  stamp("_bb_far", 36, 22), poly([36, 27, 30, 25, 36, 26], "y"), stamp("_dd_far", 46, 30), poly([48, 34, 42, 32, 48, 33], "y"))
order("ravitaillement",
  grad(0, 0, CW, 20, "123", "v", 0.6), circ(10, 6, 3, "w"), glow("w", { r: 8, strength: 0.4 }),
  sea(20, CW, CH, 22, "321"), hline(0, 20, CW, "9"), (c) => { for (let i = 0; i < 14; i++) c.px(4 + i * 2, 26, "9") },
  stamp("_ak_far", 6, 12, { swap: NIGHT }), stamp("_dd_far", 30, 15, { swap: NIGHT }), stamp("_ak_far", 40, 22, { swap: NIGHT }))
order("guetteurs",
  sky(CW, 22), sea(22, CW, 28, 23), jungleWall(30, CW, 23),
  stamp("_dd_far_x", 34, 16), stamp("_bb_far_x", 6, 14),
  stamp("_kneel", 44, 24, { flip: "x" }), rect(43, 27, 3, 2, "M"),                            // binoculars
  rect(54, 30, 8, 6, "O"), rect(55, 31, 6, 2, "q"), vline(60, 20, 10, "M"))                    // teleradio
order("fumee",
  sky(CW, 22), sea(22, CW, CH, 24),
  smoke([[6, 20, 6, 1], [14, 16, 7, 2], [24, 18, 7, 1], [32, 20, 6, 2], [10, 26, 5, 0], [22, 26, 6, 1], [30, 25, 4, 2]], "nxW"),
  stamp("_dd", 30, 18), poly([64, 28, 66, 26, 66, 31], "w"), wake(32, 28, 8),
  smoke([[38, 18, 2, 0], [36, 15, 2, 1]]))

// Card back for face-down cards: navy blue, an anchor.
scene("c_back", { w: CW, h: CH, bg: "b" }, box(1, 1, CW - 2, CH - 2, "B"),
  (c) => { for (let i = -CH; i < CW; i += 6) c.line(i, CH - 1, i + CH, 0, "B") }, box(1, 1, CW - 2, CH - 2, "C"),
  circ(32, 20, 12, "B"), ring(32, 20, 12, "C"),
  vline(32, 11, 17, "m"), vline(33, 11, 17, "d"), ring(32, 11, 2, "m"), hline(27, 15, 12, "m"),
  line(25, 22, 32, 28, "m", 2), line(39, 22, 32, 28, "m", 2), px(24, 21, "m"), px(40, 21, "m"))

const CARDS = ["cuirasse", "destroyer", "sous_marin", "dauntless", "hellcat", "marines", "lance_flammes", "seabees", "cargo", "porte_avions", "corsair", "lvt", "code_talkers", "yamato", "garnison", "tireurs", "kamikaze", "avenger", "corpsman"]
const ORDERS = ["turkey_shoot", "banzai", "bombardement", "ravitaillement", "guetteurs", "fumee", "back"]
scene("contact_cards", { w: 4 * 66 + 2, h: 12 * 42 + 2, bg: "k" },
  ...CARDS.map((n, i) => stamp("c_" + n, 2 + (i % 4) * 66, 2 + Math.floor(i / 4) * 42)),
  ...CARDS.map((n, i) => stamp("c_" + n + "_x", 2 + ((i + 20) % 4) * 66, 2 + Math.floor((i + 20) / 4) * 42)),
  ...ORDERS.map((n, i) => stamp("c_" + n, 2 + (i % 4) * 66, 2 + (10 + Math.floor(i / 4)) * 42)))

// ------------------------------------------------------------------ terrains (160x72)
const TW = 160, TH = 72
const terrain = (name, ...items) => scene("t_" + name, { w: TW, h: TH }, ...items)

terrain("haute_mer",
  sky(TW, 30), stamp("_cloud_a", 20, 6), stamp("_cloud_b", 110, 10), stamp("_cloud_a", 130, 2),
  sea(30, TW, TH, 1),
  stamp("_cv_far_x", 104, 22), stamp("_dd_far_x", 136, 26), stamp("_bb_far", 10, 24), wake(12, 30, 10),
  stamp("_cv", 40, 40), wake(42, 50, 24), stamp("_dd", 108, 50), wake(110, 58, 14),
  stamps2("_dot_plane", [[70, 8], [78, 12], [86, 6], [64, 14]]))

terrain("recif",
  sky(TW, 18, "ush"), stamp("_cloud_b", 120, 3), hills(16, 2, "G", 2, 20), rect(0, 18, TW, 4, "m"),
  rect(0, 22, TW, 50, "L"), rect(0, 22, TW, 10, "Q"),
  (c) => { const r = c.rng(4); for (let i = 0; i < 70; i++) { const x = Math.floor(r() * TW), y = 36 + Math.floor(r() * 10); c.ellipse(x, y, 2 + Math.floor(r() * 3), 1, r() < 0.5 ? "d" : "D") } },   // coral heads
  sea(48, TW, TH, 4), surf(47, 0, TW, 4), surf(36, 20, 140, 5),
  stamp("_ss", 20, 37, { swap: { T: "o", t: "l", q: "O" } }), stamp("_boom", 24, 26),        // amtrac stuck on the reef
  stamp("_kneel", 60, 30), stamp("_kneel", 76, 32), stamp("_sol", 96, 28), rect(56, 41, 50, 2, "Q"),
  stamp("_ak_far", 120, 52), stamp("_splash", 140, 40))

terrain("jungle",
  grad(0, 0, TW, 20, "sSh", "v", 0.4), jungleWall(24, TW, 1), jungleWall(44, TW, 2),
  (c) => { for (const [vx, vy] of [[20, 0], [62, 0], [118, 0], [146, 0]]) { c.line(vx, vy, vx + 3, 30, "F"); c.line(vx + 1, vy, vx + 4, 30, "f") } },   // vines
  stamps2("_palm_c", [[0, 8], [130, 6]]), stamps2("_palm_a", [[60, 10], [96, 16]]),
  rect(0, 60, TW, 12, "F"), (c) => { const r = c.rng(3); for (let i = 0; i < 90; i++) c.line(Math.floor(r() * TW), 72, Math.floor(r() * TW), 52 + Math.floor(r() * 10), r() < 0.5 ? "G" : "g") },   // ferns
  stamp("_kneel_x", 70, 46, { swap: { a: "f", A: "F", Z: "G", z: "F" } }))

terrain("grottes",
  sky(TW, 20, "uss"), (c) => {
    const top = (x) => Math.round(20 + 8 * Math.sin(x * 0.05) + 4 * Math.sin(x * 0.17))
    for (let x = 0; x < TW; x++) { const t = top(x); for (let y = t; y < TH; y++) c.px(x, y, (y * 2 + x) % 14 < 9 ? "n" : "N"); c.px(x, t, "x") }
  },
  (c) => { const r = c.rng(5); for (let i = 0; i < 30; i++) { const x = Math.floor(r() * TW), y = 30 + Math.floor(r() * 30); c.line(x, y, x + 4, y + 6, "N") } },   // fissures
  (c) => { for (const [x, y, w, h] of [[20, 36, 10, 7], [62, 30, 12, 8], [104, 40, 9, 6], [136, 32, 10, 8], [44, 52, 8, 5], [122, 56, 9, 5]]) { c.ellipse(x, y, w / 2, h / 2, "k"); c.rect(x - w / 2, y, w, h / 2, "k"); c.hline(x - w / 2, y - h / 2, w, "x") } },
  (c) => { c.px(64, 33, "y"); c.px(106, 42, "y") }, glow("y", { r: 3, strength: 0.5 }),       // muzzle flashes
  stamps2("_stump", [[86, 12], [30, 18]]), rect(0, 64, TW, 8, "N"))

// Coconut-log pillbox: low mound, log rows, dark firing slit.
const pillbox = (x, y, w) => (c) => {
  c.ellipse(x + w / 2, y + 4, w / 2 + 4, 6, "d"); c.rect(x, y, w, 8, "e")
  for (let ly = y; ly < y + 8; ly += 2) { c.hline(x, ly, w, "D"); for (let lx = x + (ly % 4); lx < x + w; lx += 5) c.px(lx, ly, "e") }
  c.rect(x + 3, y + 3, w - 6, 2, "k"); c.hline(x - 2, y - 1, w + 4, "m")
}
terrain("blockhaus",
  sky(TW, 22, "ush"), sea(22, TW, 30, 6), beach(30, TW, TH, 6), surf(30, 0, TW, 6),
  stamps2("_stump", [[20, 16], [74, 20], [130, 14]]), stamps2("_palm_b", [[40, 8], [148, 10]]),
  pillbox(14, 40, 30), pillbox(76, 36, 26), pillbox(118, 46, 32),
  (c) => { for (const [x, y] of [[60, 58], [100, 62], [30, 64], [140, 66]]) { c.ellipse(x, y, 5, 2, "D"); c.ellipse(x, y + 1, 4, 1, "e") } },   // shell holes
  (c) => { c.px(20, 43, "y"); c.px(84, 39, "y") }, glow("y", { r: 3, strength: 0.6 }))

terrain("piste",
  sky(TW, 24), stamp("_cloud_a", 100, 4), jungleWall(30, TW, 7), stamps2("_palm_a", [[10, 6], [140, 4]]),
  rect(0, 34, TW, 38, "d"), rect(0, 44, TW, 16, "x"), hline(0, 44, TW, "W"), hline(0, 59, TW, "n"),
  (c) => { for (let x = 4; x < TW; x += 12) c.hline(x, 52, 6, "w") },                          // runway centre line
  (c) => { for (let x = 0; x < TW; x += 3) for (let y = 45; y < 59; y += 3) c.px(x + (y % 2), y, "W") },   // steel matting
  stamp("_hellcat", 40, 34), stamp("_sbd", 80, 38), stamp("_hellcat", 120, 32),
  rect(140, 24, 10, 10, "D"), rect(142, 18, 6, 6, "e"), rect(143, 19, 4, 2, "C"), vline(145, 12, 6, "M"),   // control tower
  rect(4, 62, 30, 8, "o"), poly([4, 62, 19, 56, 34, 62], "O"))                                  // quonset hut

terrain("port",
  sky(TW, 22, "ush"), hills(18, 4, "G", 3, 24), sea(24, TW, TH, 7, "cb"),
  rect(0, 46, 70, 26, "D"), hline(0, 46, 70, "d"), (c) => { for (let px = 4; px < 70; px += 8) c.vline(px, 47, 25, "e") },   // wharf
  rect(10, 30, 26, 16, "T"), poly([10, 30, 23, 24, 36, 30], "q"), rect(18, 38, 8, 8, "k"),     // warehouse
  vline(52, 20, 26, "q"), line(52, 21, 66, 30, "q"), line(66, 30, 66, 40, "M"),               // crane
  (c) => { for (const [bx, by] of [[40, 40], [47, 40], [43, 35]]) { c.rect(bx, by, 6, 5, "d"); c.box(bx, by, 6, 5, "D") } },
  stamp("_ak", 72, 34), stamp("_dd", 116, 44), stamp("_ak_far", 120, 22))

terrain("volcan",
  sky(TW, 46, "u78"), sea(46, TW, TH, 8, "cb"), smoke([[96, 4, 7, 0], [104, 8, 6, 1], [88, 10, 5, 2]]),
  (c) => {
    const top = (x) => Math.round(66 - 50 * Math.max(0, 1 - Math.abs(x - 96) / 70) ** 1.4)
    for (let x = 0; x < TW; x++) { const t = top(x); c.vline(x, t, TH - t, x > 96 ? "N" : "n"); c.px(x, t, "x") }
    for (let i = 0; i < 26; i++) { const x = 40 + i * 4, t = top(x); c.line(x, t + 2, x + (x < 96 ? -3 : 3), t + 10, "N") }   // gullies
  },
  rect(92, 15, 9, 2, "N"), circ(96, 14, 2, "Y"), glow("Y", { r: 4, strength: 0.5 }),
  beach(64, TW, TH, 8), dither(0, 62, TW, 3, "n", "m", 0.5))

terrain("lagon",
  sky(TW, 16), stamp("_cloud_b", 30, 2), sea(16, TW, TH, 9),
  ellipse(80, 46, 74, 22, "m"), ellipse(80, 47, 66, 17, "L"), ellipse(80, 48, 50, 12, "Q"),   // ring of sand round the lagoon
  surf(24, 10, 150, 9), stamps2("_palm_b", [[14, 20], [130, 18]]), stamps2("_palm_d", [[40, 18], [100, 16], [70, 52]]),
  stamp("_ak_far", 66, 42), stamp("_ss", 100, 50, { swap: { T: "o", t: "l", q: "O" } }))

terrain("atoll",
  sky(TW, 26, "ush"), stamp("_cloud_a", 108, 4), sea(26, TW, TH, 10),
  ellipse(80, 50, 54, 12, "m"), ellipse(80, 51, 44, 8, "L"), ellipse(84, 49, 26, 6, "m"),
  stamps2("_palm_a", [[50, 22], [90, 24]]), stamps2("_palm_d", [[70, 32], [108, 30]]),
  surf(38, 30, 130, 10), surf(62, 30, 130, 11),
  rect(60, 45, 40, 2, "x"), stamp("_dd_far_x", 128, 30))

terrain("marecage",
  grad(0, 0, TW, 24, "Shh", "v", 0.4), jungleWall(30, TW, 12),
  rect(0, 40, TW, 32, "B"), rect(0, 40, TW, 4, "b"),
  (c) => { const r = c.rng(6); for (let i = 0; i < 30; i++) { const x = Math.floor(r() * TW); for (const dx of [-3, -1, 1, 3]) c.line(x, 44, x + dx, 52 + Math.floor(r() * 6), "e"); c.circ(x, 40, 4, "f"); c.circ(x - 2, 38, 2, "G") } },   // mangrove roots
  (c) => { const r = c.rng(8); for (let i = 0; i < 40; i++) c.hline(Math.floor(r() * TW), 54 + Math.floor(r() * 18), 3, "c") },
  stamp("_kneel", 62, 46), stamp("_kneel", 86, 48))

// Landing beach: assault craft beached, Marines going in, palms behind.
terrain("plage",
  sky(TW, 16, "ush"), jungleWall(22, TW, 13), stamps2("_palm_c", [[20, 0], [110, 2]]), stamps2("_stump", [[70, 12]]),
  beach(28, TW, 50, 13), sea(50, TW, TH, 13), surf(50, 0, TW, 13),
  stamp("_ak_far", 20, 58), stamp("_dd_far", 120, 60),
  (c) => { for (const lx of [30, 92]) { c.rect(lx, 46, 22, 7, "T"); c.rect(lx + 18, 44, 4, 9, "q"); c.hline(lx, 46, 22, "t") } },   // landing craft
  stamp("_sol", 42, 32), stamp("_kneel", 60, 36), stamp("_sol", 102, 30), stamp("_kneel", 128, 36),
  stamp("_splash", 70, 44), stamp("_boom", 140, 22))

// Campaign terrains with their own picture.
terrain("betio",
  sky(TW, 14, "u78"), smoke([[40, 8, 7, 0], [52, 4, 6, 1], [120, 10, 6, 0]]),
  beach(20, TW, 34, 14), rect(0, 20, TW, 5, "e"), (c) => { for (let x = 0; x < TW; x += 4) c.vline(x, 20, 5, "D") },   // log seawall
  stamps2("_stump", [[30, 6], [90, 4], [140, 8]]), pillbox(60, 12, 20),
  rect(0, 34, TW, 38, "L"), rect(0, 50, TW, 22, "c"), surf(33, 0, TW, 14),
  rect(100, 26, 6, 46, "D"), (c) => { for (let y = 28; y < 72; y += 5) c.hline(100, y, 6, "e") },   // long pier
  stamp("_ss", 30, 44, { swap: { T: "o", t: "l", q: "O" } }), stamp("_boom", 34, 32),
  stamp("_kneel", 60, 38), stamp("_kneel", 76, 42), stamp("_sol", 120, 40), stamp("_kneel", 140, 46),
  rect(56, 50, 40, 2, "Q"), rect(118, 55, 30, 2, "Q"))

terrain("sable_noir",
  sky(TW, 20, "uss"),
  (c) => { const top = (x) => Math.round(30 - 22 * Math.max(0, 1 - Math.abs(x - 24) / 30)); for (let x = 0; x < 60; x++) { const t = top(x); c.vline(x, t, 32 - t, "N") } },   // Suribachi far away
  rect(0, 30, TW, 30, "N"), (c) => { for (let y = 34; y < 58; y += 5) for (let x = (y * 7) % 20; x < TW; x += 28) c.hline(x, y, 12, "n") },   // black sand terraces
  sea(58, TW, TH, 15, "cb"), surf(58, 0, TW, 15),
  stamp("_ss", 20, 52, { swap: { T: "o", t: "l", q: "O" } }), stamp("_boom", 90, 20), stamp("_boom", 130, 26),
  stamp("_kneel", 50, 40), stamp("_kneel", 70, 44), stamp("_sol", 106, 36), stamp("_kneel", 130, 46),
  smoke([[100, 14, 4, 0], [140, 18, 5, 1]]))

sprite("_flag", { w: 11, h: 11 }, (c) => {
  c.vline(0, 0, 11, "e")
  for (let y = 0; y < 6; y++) c.hline(1, y, 9, y % 2 ? "w" : "r")
  c.rect(1, 0, 4, 3, "6"); c.px(2, 1, "w")
})
terrain("suribachi",
  sky(TW, 64, "usSh"), stamp("_cloud_a", 14, 6), stamp("_cloud_b", 130, 12),
  (c) => {
    const top = (x) => Math.round(62 - 46 * Math.max(0, 1 - Math.abs(x - 80) / 64) ** 1.2)
    for (let x = 0; x < TW; x++) { const t = top(x); c.vline(x, t, TH - t, x > 80 ? "N" : "n"); c.px(x, t, "x") }
    for (let i = 0; i < 20; i++) { const x = 30 + i * 5, t = top(x); c.line(x, t + 2, x + (x < 80 ? -2 : 2), t + 9, "N") }
  },
  rect(74, 15, 12, 2, "N"), line(76, 16, 84, 4, "e"),                                           // the pole, raised
  (c) => { for (let y = 0; y < 6; y++) c.line(84 - Math.round(y * 0.1), 4 + y, 93, 5 + y, y % 2 ? "w" : "r") }, rect(84, 4, 4, 3, "6"),
  stamp("_kneel", 70, 8), stamp("_sol", 78, 4, { flip: "x" }),
  sea(64, TW, TH, 16, "cb"), surf(64, 0, TW, 16))

const TERRAINS = ["haute_mer", "recif", "jungle", "grottes", "blockhaus", "piste", "port", "volcan", "lagon", "atoll", "marecage", "plage", "betio", "sable_noir", "suribachi"]
scene("contact_terrains", { w: 2 * 162 + 2, h: 8 * 74 + 2, bg: "k" },
  ...TERRAINS.map((n, i) => stamp("t_" + n, 2 + (i % 2) * 162, 2 + Math.floor(i / 2) * 74)))

// ------------------------------------------------------------------ attribute icons (value chips)
// One-colour silhouettes: they sit on the coloured chip, holes let the chip colour through.
sprite("i_ancre", `
  ....kkk....
  ....k.k....
  ....kkk....
  ..kkkkkkk..
  .....k.....
  .....k.....
  kk...k...kk
  .kk..k..kk.
  ..kkkkkkk..
  ....kkk....`)
sprite("i_casque", `
  ....kkkkk....
  ..kkkkkkkkk..
  .kkkkkkkkkkk.
  .kkkkkkkkkkk.
  kkkkkkkkkkkkk
  ..k.......k..
  ...k.....k...
  ....kkkkk....`)
sprite("i_avion", `
  ......k......
  ......k......
  .....kkk.....
  kkkkkkkkkkkkk
  .kkkkkkkkkkk.
  ......k......
  ......k......
  ....kkkkk....`)
sprite("i_caisse", `
  kkkkkkkkkkk
  k.........k
  kkkkkkkkkkk
  kk.kkkkk.kk
  kkk.kkk.kkk
  kkkk.k.kkkk
  kkk.kkk.kkk
  kk.kkkkk.kk
  kkkkkkkkkkk`)

// ------------------------------------------------------------------ initiative coin (32x32)
// coin_0 = the player (the white star on blue), coin_1 = the enemy (the red disc on white).
const coin = (edge, rim, lit, face) => (c) => {
  for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
    const d = Math.hypot(x - 15.5, y - 15.5)
    if (d <= 15.6) c.px(x, y, d > 14.6 ? edge : d > 12.6 ? (x + y < 28 ? lit : rim) : d > 11.7 ? edge : face)
  }
}
const disc = (r, col) => (c) => { for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) if (Math.hypot(x - 15.5, y - 15.5) <= r) c.px(x, y, col) }
const star = (r, col) => (c) => {
  const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; pts.push(Math.round(15.5 + Math.cos(a) * rr), Math.round(16 + Math.sin(a) * rr)) }
  c.poly(pts, col)
}
sprite("coin_0", { w: 32, h: 32 }, coin("B", "b", "c", "6"), star(10, "w"))
sprite("coin_1", { w: 32, h: 32 }, coin("H", "5", "4", "w"), disc(7.4, "r"))

// ------------------------------------------------------------------ campaign map (320x140)
// Same frame as campaign.js project(): lon 118..186 (Midway at 182.6), lat 40..-16. A naval chart of the Pacific:
// pale sea with its grid, coastlines in sand and jungle. Battle markers are HTML on top.
const MW = 320, MH = 140
const P = (lon, lat) => [Math.round((lon - 118) * MW / 68), Math.round((40 - lat) * MH / 56)]
const path = (pts) => pts.flatMap(([lon, lat]) => P(lon, lat))
const land = (pts, key = "m") => poly(path(pts), key)
const isle = (lon, lat, rx = 1, ry = 1, key = "m") => (c) => { const [x, y] = P(lon, lat); c.ellipse(x, y, rx, ry, key) }
scene("map_pacifique", { w: MW, h: MH, bg: "C" },
  // Chart grid: every 10 degrees.
  (c) => { for (let lon = 120; lon <= 180; lon += 10) { const [x] = P(lon, 0); for (let y = 0; y < MH; y += 2) c.px(x, y, "c") } for (let lat = 30; lat >= -10; lat -= 10) { const [, y] = P(120, lat); for (let x = 0; x < MW; x += 2) c.px(x, y, "c") } },
  (c) => { const [, y] = P(120, 0); c.hline(0, y, MW, "c") },                                   // the equator, solid
  // Asia: China, Korea, Japan, Taiwan.
  land([[118, 41], [121.5, 41], [122.2, 39.2], [121, 38.8], [122.5, 37.4], [119.2, 37.1], [120.3, 36], [122.5, 32], [121.8, 30.5], [121, 28], [119.5, 25.5], [118, 24]]),
  land([[124.4, 40], [128, 41], [129.6, 41], [129.4, 38.5], [129.4, 35.2], [127, 34.5], [126.2, 34.6], [126.6, 37.5], [125, 38.5]]),
  land([[130, 33.9], [131.9, 34], [132, 32.9], [131.3, 31.2], [130.2, 31.3], [129.8, 32.8]]),                          // Kyushu
  land([[131, 34.4], [135, 34.6], [137, 34.6], [139, 34.9], [140.9, 35.7], [141, 37.8], [142, 39.5], [141.5, 41], [140, 41], [140, 39.5], [139.5, 38], [137, 37.2], [136, 36], [133, 35.5], [131, 34.9]]),      // Honshu
  land([[132.5, 33.9], [134.7, 34.2], [134.5, 33.3], [133, 32.8]]),                                                    // Shikoku
  land([[120.1, 25.2], [121.9, 25.1], [121, 22], [120.2, 22.8]]),                                                      // Taiwan
  // The Philippines.
  land([[119.8, 18.5], [122.5, 18.4], [122, 16], [124, 13.6], [122.5, 13.7], [120.6, 14.4], [119.8, 16.3]]),         // Luzon
  land([[121, 13.4], [121.5, 12.4], [120.3, 12.5]]), land([[121.9, 12.2], [123.5, 12.3], [123.2, 10.8], [122, 10.5]]),
  land([[124.3, 11.6], [125.3, 11.4], [125.1, 10], [124.4, 10.3]]),                                                    // Leyte, Samar
  land([[124.7, 12.6], [125.7, 12.2], [125.4, 11.1], [124.6, 11.6]]),
  land([[122, 9], [124.3, 8.8], [126.4, 9.6], [126.2, 6.3], [125.3, 5.6], [123.2, 7.5], [122.1, 7]]),                 // Mindanao
  land([[118, 10.5], [119.6, 11.5], [118.6, 9.5], [118, 9]]),                                                          // Palawan
  // Borneo, Celebes, the Moluccas at the left edge.
  land([[118, 7], [119.3, 5.3], [118.5, 4.3], [118, 1], [118, 7]], "g"),
  land([[120.5, 1.2], [124.9, 1.6], [121, 0.4], [120.2, -1.5], [121.5, -4.6], [120.3, -5.5], [119.4, -3.5], [119.7, 0.5]], "g"),
  land([[127.4, 2.2], [128.6, 1.4], [128, -0.8], [127.5, 0.3]], "g"),
  // New Guinea and the Bismarcks.
  land([[131, -1.2], [134, -0.8], [135.3, -3.3], [138, -1.6], [141, -2.6], [145.8, -4.8], [147.7, -6.2], [150.5, -10.4], [147, -10.1], [143.5, -9], [141, -9.2], [138, -8.4], [137.5, -5], [134, -3.9], [132, -2.8]], "g"),
  land([[148, -5.6], [151, -5.2], [152.2, -4.2], [152.4, -5.8], [150.5, -6.4], [148.5, -6.1]], "g"),                  // New Britain (Rabaul)
  land([[150.8, -2.6], [152.8, -4.2], [152.6, -4.8]], "g"),                                                            // New Ireland
  // The Solomons: Bougainville to Guadalcanal and San Cristobal.
  land([[154.6, -5.1], [155.9, -6.4], [155.5, -6.9], [154.7, -6.1]], "g"),
  land([[156.6, -7.0], [157.6, -7.4], [157.4, -8.0]], "g"), land([[158.1, -7.5], [159.8, -8.4], [159.5, -8.7]], "g"),
  land([[159.6, -9.2], [160.8, -9.4], [160.4, -9.8], [159.6, -9.6]], "g"),                                             // Guadalcanal
  land([[160.7, -8.4], [161.5, -9.6], [161, -9.3]], "g"), land([[161.3, -10.2], [162.3, -10.7], [161.6, -10.6]], "g"),
  // Australia's north coast, bottom left.
  land([[130, -11.3], [132.6, -11.5], [136.8, -12.2], [136, -14.5], [135.5, -16], [130, -16]]),
  land([[141.6, -12.6], [142.5, -10.7], [143.4, -12.6], [145.3, -14.9], [145.5, -16], [141.4, -16]]),
  // Small islands: Marianas, Bonins and Volcanos, Ryukyus, Palau, Carolines, Marshalls, Gilberts, Wake, Midway.
  (c) => {
    const dots = [[145.7, 15.2, 1], [144.8, 13.4, 2], [145.6, 14.1, 1], [145.7, 16.7], [145.8, 18.1], [145.6, 20],                // Marianas
      [141.3, 24.8, 1], [142.2, 27], [142.1, 26.6],                                                                                  // Iwo Jima, Bonins
      [127.8, 26.3, 2], [128.5, 27.2], [129.5, 28.3], [130.5, 30.4], [124.2, 24.4], [125.3, 24.8],                                   // Ryukyus
      [134.5, 7.4, 1], [134.25, 7], [138.1, 9.5], [151.8, 7.4, 1], [158.2, 6.9], [163, 5.3],                                          // Palau, Yap, Truk, Ponape, Kosrae
      [167.7, 9, 1], [167.4, 8.7], [171.4, 7.1], [169.6, 6], [171.2, 8.7], [166.8, 11.2], [168.8, 11.6],                             // Marshalls
      [173, 1.4, 1], [172.9, 3], [173.6, 0.2], [174.4, -0.6],                                                                         // Gilberts
      [166.6, 19.3, 1], [182.6, 28.2, 1], [178.5, 28.4], [184.2, 26.2], [173, -15], [178, -16], [167, -15.5], [168, -16]]           // Wake, Midway, Fiji, Vanuatu
    for (const [lon, lat, r = 0] of dots) { const [x, y] = P(lon, lat); if (r) { c.ellipse(x, y, r + 1, r, "m"); c.px(x, y, "g") } else c.rect(x, y, 2, 1, "m") }
  },
  // Coast shading: a darker rim where land meets the sea.
  (c) => { for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) if ((c.is(x, y, "m") || c.is(x, y, "g")) && (c.is(x + 1, y + 1, "C") || c.is(x, y + 1, "C"))) c.px(x, y, "d") },
  // Jungle texture on the big islands.
  (c) => { const r = c.rng(5); for (let i = 0; i < 500; i++) { const x = Math.floor(r() * MW), y = Math.floor(r() * MH); if (c.is(x, y, "g")) c.px(x, y, r() < 0.5 ? "G" : "f") } },
  // Japan: the rising sun capital, a dot of red.
  (c) => { const [x, y] = P(139.7, 35.7); c.circ(x, y, 1, "r") },
  // Arrow off the right edge toward Pearl Harbor.
  (c) => { const [x, y] = P(185, 21); c.line(x - 8, y, x, y, "H"); c.px(x - 1, y - 1, "H"); c.px(x - 1, y + 1, "H") },
  // Frame like a printed chart.
  box(0, 0, MW, MH, "H"), box(1, 1, MW - 2, MH - 2, "4"))
