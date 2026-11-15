// Pacific 1942–1945 — card (128x80) and terrain (320x144) illustrations, map, icons, coin, at the resolution of the Gallic Wars.
// Build (writes packs/pacifique/out/): node ~/.claude/skills/pxl-pixel-art/bin/pxl.js build packs/pacifique/art.px.js --no-preview
//
// Hard tropical light, deep ocean and turquoise lagoons, white sand, palm green, black volcanic ash. US olive drab and
// haze-gray ships against Japanese khaki and darker naval gray. Shared style rules: see packs/art-lib.px.js.
pal({
  k: "#14110f",
  1: "#4580ba", "+": "#5891c5", 2: "#71a5d2", "=": "#8bb9dc", 3: "#a6cce4", "~": "#c0dce8", 4: "#daebe8", 5: "#f6f3e8",   // tropical sky, cloud, foam
  6: "#8db0b2", "%": "#6c988b", "&": "#4c7b68",                                     // far islands in the haze
  a: "#122d1d", A: "#1f4d2b", c: "#337634", "^": "#4c913f", C: "#71ab4a", d: "#a3c464",   // palms, jungle
  t: "#5a4428", T: "#9a7e4b", q: "#ccaf76", Q: "#ebd8a1",                           // sand, chart paper
  0: "#2a2826", M: "#44403c", m: "#76706a", l: "#a39d93",                           // volcanic ash, smoke
  z: "#133a5b", Z: "#235985", p: "#3a81ac", P: "#7bb9d3",                           // ocean, deep -> light
  "@": "#2fa5a3", "$": "#7cd3c3",                                                   // lagoon
  w: "#2a1c13", W: "#5a4128", x: "#8a6a40", X: "#b4935e",                           // wood, palm trunks
  o: "#584318", O: "#8a6a2a", y: "#c39a44", Y: "#e6c873",                           // straw, brass
  u: "#2f351d", U: "#4f5830", v: "#717b45", V: "#9aa468",                           // US olive drab
  g: "#4d4328", G: "#7c6c3f", h: "#a9965a", H: "#cabb7d",                           // Japanese khaki
  i: "#56616a", I: "#808b93", j: "#aeb8be", J: "#d4dade",                           // US haze gray, steel
  7: "#464947", 8: "#6b6e6b", 9: "#999b97",                                         // Japanese naval gray
  e: "#4a2b20", E: "#7d4b35", f: "#b6795a", F: "#e0ad89",                           // skin
  r: "#4a1416", R: "#7e2622", s: "#c8352c", S: "#e8684f",                           // red
  b: "#111a2e", B: "#1d2c4b", n: "#32507e", N: "#7f95b8",                           // night, insignia blue
  D: "#c9501f", L: "#f0a43a", K: "#fbeeb0",                                         // fire
})
ramps("1+2=3~45", "&%6345", "kaAc^Cd", "ktTqQ", "k0Mml", "kzZpP", "@$", "kwWxX", "koOyY", "kuUvV", "kgGhH", "kiIjJ", "k789", "keEfF", "krRsS", "kbBnN", "DLK")
include("../art-lib.px.js")

const JP = { V: "H", v: "h", U: "G", u: "g", i: "7", I: "8", j: "9", J: "9" }
const BACK = { V: "v", v: "U", U: "u", H: "h", h: "G", G: "g", F: "f", f: "E", E: "e", X: "x", x: "W", W: "w", J: "j", j: "I", I: "i", 9: "8", 8: "7" }
const NIGHT = { V: "n", v: "B", U: "b", u: "b", H: "n", h: "B", G: "b", g: "b", F: "N", f: "n", E: "B", e: "b", X: "B", x: "b", W: "b", w: "b", J: "N", j: "n", I: "B", i: "b", 9: "n", 8: "B", 7: "b", y: "n", s: "B", q: "B", Q: "n", T: "b", m: "B", l: "n" }

// ------------------------------------------------------------------ figures (about 36 px tall)
// Marine advancing, facing right: M1 helmet with its camouflage cover, olive drab utilities, leggings, M1 rifle.
const SOL = `
  .........VVVV...............
  ........VcvVvV..............
  .......VvVvcvvU.............
  .......UUUUUUUUU............
  .........EfFFFU.............
  .........fFkFFf.............
  .........ffFFFFf............
  .........EffFFE.............
  ..........EffE..............
  .......VVvvEvvV.............
  ......VVvvvvvvvU............
  ......VvvVvvvvvvU...........
  ......VvvVvvvvvvvU..........
  ......VvvVvvvvvvUffXXxxxxxjjJ
  ......VvyVvvvvvvyfFWWWWWWj..
  ......VvvVvvvvvvU.ff........
  ......VvvVvvvvvvU...........
  ......Uvvvvvvvvvv...........
  ......UyyyOyyyyyU...........
  ......UyvyvvvvyvU...........
  ......UUvvvvvvvUU...........
  .......UUUUUUUUU............
  .......UUUU.UUUUU...........
  .......UUUU..UUUU...........
  ......UUUU....UUUU..........
  ......UUU......UUUU.........
  .....UUUU.......UUU.........
  .....UUU........UUUU........
  .....UUU.........UUU........
  ....qqq..........qqqq.......
  ....qqqq..........qqq.......
  ....qqq...........qqqq......
  ...WWWW...........WWWWW.....
  ..WWWWW...........WWWWWW....`
const KNEEL = `
  .........VVVV.................
  ........VcvVvV................
  .......VvVvcvvU...............
  .......UUUUUUUUU..............
  .........EfFFFfFXxxxxxxxxjjjJ
  .........fFkFFfWWWWWWWWWj.....
  .........ffFFFF...............
  .........EffFE................
  ..........EfE.................
  .......VVvvvvvVff.............
  ......VVvvvvvvvvFf............
  ......VvvVvvvvvvvf............
  ......VvvVvvvvvvv.............
  ......VvyVvvvvvvy.............
  ......VvvVvvvvvvU.............
  ......UyyyOyyyyyU.............
  ......UUvvvvvvvUU.............
  ......UUUUUUUUUUUUUUU.........
  .......UUUUUUUUUUUUUUU........
  .......UUUU.......UUUU........
  ......UUUU........UUUU........
  .....UUUU.........qqqq........
  ....UUUU..........qqq.........
  ...qqqqqq.........qqq.........
  ..WWqqqqqq........WWWW........
  .WWWWWWWWW........WWWWW.......`
const put = (grid, rows) => { const r = grid.split("\n").filter((x) => x.trim()).map((x) => x.trim()); for (const [i, s] of Object.entries(rows)) r[i] = s; return r.join("\n") }
// Japanese infantry: the helmet with its neck cloth hanging behind, khaki, puttees.
const JPHEAD = { 0: ".........HHHH...............", 1: "........HhhhhH..............", 2: ".......HhHhhhhG.............", 3: "......HHGGGGGGG.............", 4: ".....Hh..EfFFFG.............", 5: ".....hh..fFkFFf.............", 6: "......h..ffFFFFf............" }
const JPHEADK = { 0: ".........HHHH.................", 1: "........HhhhhH................", 2: ".......HhHhhhhG...............", 3: "......HHGGGGGGG...............", 4: ".....Hh..EfFFFfFXxxxxxxxxjjjJ", 5: ".....hh..fFkFFfWWWWWWWWWj.....", 6: "......h..ffFFFF..............." }
sprite("_sol", { outline: "k" }, SOL)
sprite("_kneel", { outline: "k" }, KNEEL)
sprite("_sol_x", { outline: "k", swap: { ...JP, q: "h", c: "h" } }, put(SOL, JPHEAD))
sprite("_kneel_x", { outline: "k", swap: { ...JP, q: "h", c: "h" } }, put(KNEEL, JPHEADK))

// ------------------------------------------------------------------ ships (side view, facing right)
// kind: bb battleship, dd destroyer, cv carrier, ss submarine, ak freighter. Hull with a sheer line, a dark boot
// topping at the waterline, superstructure in tiers, turrets and barrels, funnels, masts. Japanese: darker gray.
function ship(name, kind, len, swap) {
  const H = { bb: 34, dd: 24, cv: 28, ss: 16, ak: 30 }[kind]
  sprite(name, { w: len + 4, h: H, outline: "k", swap }, (c) => {
    const y = H - 6                                                                           // waterline
    c.poly([0, y - 3, len * 0.3, y - 4, len - 8, y - 5, len + 3, y - 9, len - 3, y + 4, 4, y + 4, 0, y], "I")   // hull: raked bow, rounded stern
    c.hline(2, y - 3, len - 8, "j"); c.line(len - 8, y - 5, len + 2, y - 9, "j")
    c.rect(4, y + 2, len - 8, 2, "i"); c.hline(3, y + 4, len - 6, "0")                        // boot topping
    for (let x = 12; x < len - 16; x += 8) c.px(x, y - 1, "i")                                // portholes
    if (kind === "bb") {
      c.rect(len * 0.34, y - 12, len * 0.32, 8, "I"); c.hline(len * 0.34, y - 12, len * 0.32, "j")              // superstructure
      c.rect(len * 0.42, y - 20, 12, 8, "I"); c.hline(len * 0.42, y - 20, 12, "j"); c.rect(len * 0.44, y - 18, 8, 2, "i")   // tower, bridge windows
      c.vline(len * 0.46, y - 28, 8, "i"); c.hline(len * 0.46 - 4, y - 25, 9, "i")                               // mast, yard
      c.rect(len * 0.36, y - 16, 6, 4, "i"); c.hline(len * 0.36, y - 16, 6, "I")                                 // funnel
      for (const gx of [len * 0.12, len * 0.24, len * 0.72, len * 0.84]) { const r = gx > len / 2; c.rect(gx, y - 7, 10, 4, "I"); c.hline(gx, y - 7, 10, "j"); c.hline(r ? gx + 10 : gx - 10, y - 6, 10, "i") }   // turrets, barrels
      for (let x = len * 0.36; x < len * 0.66; x += 5) c.px(x, y - 13, "J")                                      // AA guns
    } else if (kind === "dd") {
      c.rect(len * 0.55, y - 10, 12, 6, "I"); c.hline(len * 0.55, y - 10, 12, "j"); c.rect(len * 0.57, y - 9, 8, 2, "i"); c.vline(len * 0.6, y - 18, 8, "i")   // bridge, mast
      c.rect(len * 0.35, y - 9, 5, 5, "i"); c.rect(len * 0.24, y - 9, 5, 5, "i"); c.hline(len * 0.35, y - 9, 5, "I"); c.hline(len * 0.24, y - 9, 5, "I")   // two funnels
      c.rect(len * 0.78, y - 6, 6, 2, "I"); c.hline(len * 0.84, y - 6, 8, "i"); c.rect(len * 0.06, y - 6, 6, 2, "I")   // guns
      c.rect(len * 0.42, y - 5, 10, 2, "i")                                                                       // torpedo tubes
    } else if (kind === "cv") {
      c.rect(0, y - 7, len, 4, "i"); c.hline(0, y - 7, len, "I"); c.hline(0, y - 6, len, "8")                    // flight deck
      c.rect(len * 0.62, y - 17, 10, 10, "I"); c.hline(len * 0.62, y - 17, 10, "j"); c.rect(len * 0.62 + 2, y - 21, 6, 4, "i"); c.vline(len * 0.62 + 5, y - 27, 6, "i")   // island, funnel, mast
      for (let x = 6; x < len - 10; x += 12) c.hline(x, y - 7, 5, "J")                                            // deck markings
    } else if (kind === "ss") {
      c.rect(len * 0.42, y - 9, 10, 6, "i"); c.hline(len * 0.42, y - 9, 10, "I"); c.vline(len * 0.46, y - 14, 5, "i"); c.vline(len * 0.5, y - 12, 3, "i")   // conning tower, periscopes
      c.hline(len * 0.65, y - 5, 6, "i"); c.px(len * 0.7, y - 6, "I")                                            // deck gun
    } else if (kind === "ak") {
      c.rect(len * 0.42, y - 12, 16, 8, "I"); c.hline(len * 0.42, y - 12, 16, "j"); c.rect(len * 0.44, y - 10, 12, 2, "i"); c.rect(len * 0.48, y - 18, 6, 6, "i")   // bridge, funnel
      for (const mx of [len * 0.2, len * 0.76]) { c.vline(mx, y - 22, 18, "i"); c.line(mx, y - 20, mx + 10, y - 6, "i") }      // masts, derricks
      c.rect(len * 0.08, y - 7, 14, 4, "W"); c.box(len * 0.08, y - 7, 14, 4, "w"); c.rect(len * 0.66, y - 7, 12, 4, "x")    // deck cargo
    }
  })
}
ship("_bb", "bb", 100); ship("_bb_x", "bb", 100, JP); ship("_yamato", "bb", 116, JP)
ship("_dd", "dd", 72); ship("_dd_x", "dd", 72, JP)
ship("_cv", "cv", 104); ship("_cv_x", "cv", 104, JP)
ship("_ss", "ss", 68); ship("_ss_x", "ss", 68, JP)
ship("_ak", "ak", 84); ship("_ak_x", "ak", 84, JP)
ship("_bb_far", "bb", 52); ship("_dd_far", "dd", 36); ship("_cv_far", "cv", 48); ship("_ak_far", "ak", 40)
ship("_bb_far_x", "bb", 52, JP); ship("_dd_far_x", "dd", 36, JP); ship("_cv_far_x", "cv", 48, JP); ship("_ak_far_x", "ak", 40, JP)

// Monoplane facing right. US: dark blue over light gray and the white star; Japan: light gray or green and the
// red disc. kind: fighter, bomber (longer canopy, a bomb), torpedo (a torpedo under the belly). dive = degrees nose down.
function plane(name, kind, jp, body, dive = 0) {
  const [b1, b2] = body || (jp ? ["9", "8"] : ["n", "B"])
  const S = dive ? 64 : 0
  sprite(name, dive ? { w: S, h: S, outline: "k" } : { w: 60, h: 26, outline: "k" }, (c) => {
    c.poly([2, 12, 12, 10, 44, 8, 52, 10, 54, 14, 46, 18, 12, 16, 2, 14], b1)
    c.poly([12, 15, 46, 17, 52, 14, 54, 15, 46, 18, 12, 16], jp ? b2 : "j")                    // belly: light gray under the US blue
    c.hline(12, 10, 32, jp ? "J" : "N")
    c.poly([2, 12, 2, 2, 8, 2, 14, 10], b1); c.hline(0, 12, 12, b2)                            // fin, tailplane
    c.rect(50, 8, 6, 10, "M"); c.vline(50, 8, 10, "0"); c.vline(58, 2, 22, "l"); c.px(58, 13, "m")   // cowling, prop disc
    c.poly([18, 14, 42, 14, 38, 22, 24, 22], b2); c.hline(24, 20, 14, b1)                      // wing, seen from slightly below
    c.rect(30, 6, kind === "fighter" ? 8 : 16, 4, "P"); c.px(33, 6, "5"); c.vline(36, 6, 4, "M")   // canopy
    if (kind === "torpedo") { c.hline(20, 23, 24, "I"); c.px(44, 23, "j") }
    if (kind === "bomber") c.rect(30, 21, 8, 3, "M")
    if (jp) { c.circ(30, 17, 3, "5"); c.circ(30, 17, 2, "s"); c.circ(8, 12, 2, "s") }
    else { c.circ(30, 17, 3, "n"); c.grid(28, 15, "..5..\n55555\n.5.5."); c.circ(8, 12, 2, "n"); c.px(8, 12, "5") }
    if (!dive) return
    // diving: read the level drawing back, clear, rewrite it rotated nose-down around the centre
    const buf = new Map()
    for (let y = 0; y < 26; y++) for (let x = 0; x < 60; x++) { const k = c.key(x, y); if (k && k !== ".") buf.set(x + "," + y, k) }
    c.rect(0, 0, S, S, "_")
    const a = dive * Math.PI / 180, co = Math.cos(a), si = Math.sin(a)
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const dx = x - 31.5, dy = y - 31.5, sx = Math.round(co * dx + si * dy + 30), sy = Math.round(-si * dx + co * dy + 13)
      const k = buf.get(sx + "," + sy); if (k) c.px(x, y, k)
    }
  })
}
plane("_hellcat", "fighter", false); plane("_zero", "fighter", true)
plane("_sbd", "bomber", false); plane("_val", "bomber", true, ["c", "A"])
plane("_tbf", "torpedo", false); plane("_kate", "torpedo", true, ["^", "c"])
plane("_corsair", "fighter", false, ["B", "b"]); plane("_george", "fighter", true, ["^", "c"])
plane("_sbd_dive", "bomber", false, null, 50); plane("_val_dive", "bomber", true, ["c", "A"], 50)
plane("_zero_dive", "fighter", true, null, 35); plane("_hellcat_dive", "fighter", false, null, 35)
plane("_zero_fall", "fighter", true, null, 70); plane("_val_fall", "bomber", true, ["c", "A"], 60)
// Far-away plane silhouette.
sprite("_dot_plane", `
  ....m....
  ...mmm...
  mmmmmmmmm
  ....m....
  ...mmm...`)

// Palm tree, leaning: a ringed trunk, a crown of fronds lit on the top left, coconuts.
function palm(name, h, lean) {
  sprite(name, { w: 44, h: h + 14 }, (c) => {
    for (let i = 0; i < h; i++) { const x = 21 + Math.round(lean * (i / h) ** 1.6); c.hline(x, h + 13 - i, 3, i % 4 ? "x" : "W"); c.px(x + 2, h + 13 - i, "W"); c.px(x, h + 13 - i, i % 4 ? "X" : "x") }
    const tx = 22 + lean, ty = 12
    for (const [dx, dy] of [[-18, 6], [-14, -4], [-4, -10], [10, -8], [18, 2], [16, 10], [-10, 10]]) { c.line(tx, ty, tx + dx, ty + dy, "A", 3); c.line(tx, ty - 1, tx + dx, ty + dy - 1, "c") }
    for (const [dx, dy] of [[-16, 4], [-12, -6], [8, -8], [16, 0]]) c.line(tx, ty - 2, tx + dx, ty + dy - 1, "C")
    c.circ(tx, ty + 2, 2, "W"); c.px(tx - 1, ty + 1, "x")
  })
}
palm("_palm_a", 44, 8); palm("_palm_b", 32, -6); palm("_palm_c", 56, 12); palm("_palm_d", 24, 4)
group("_palms", ["_palm_a", "_palm_b", "_palm_c", "_palm_d"])
// Shattered palm after a bombardment.
sprite("_stump", { w: 14, h: 32 }, (c) => { c.rect(4, 4, 6, 28, "x"); c.vline(4, 4, 28, "X"); c.vline(9, 4, 28, "W"); c.poly([4, 4, 6, 0, 8, 3, 10, 1, 10, 4], "x"); c.line(9, 10, 13, 6, "W", 2) })
// Explosion, water column, flak burst.
sprite("_boom", { w: 34, h: 32 }, (c) => {
  for (const [x, y, r, k] of [[17, 10, 8, "0"], [9, 14, 6, "M"], [25, 13, 6, "M"], [17, 4, 4, "M"]]) { c.circ(x, y, r, k); c.circ(x - 2, y - 2, Math.max(1, r - 4), "m") }
  c.circ(17, 22, 9, "D"); c.circ(17, 22, 6, "L"); c.circ(17, 23, 3, "K")
  c.poly([0, 32, 8, 24, 26, 24, 34, 32], "D"); c.poly([6, 32, 12, 26, 22, 26, 28, 32], "L")
})
sprite("_splash", { w: 22, h: 36 }, (c) => {
  c.poly([2, 35, 8, 10, 10, 0, 12, 10, 18, 35], "P"); c.poly([6, 35, 10, 14, 10, 4, 11, 14, 14, 35], "5")
  for (const [x, y] of [[3, 16], [17, 12], [6, 6], [15, 22]]) c.circ(x, y, 2, "P")
  c.ellipse(10, 35, 10, 2, "5")
})
sprite("_flak", `
  ..mmm..
  .mMMMm.
  mMMMMMm
  mMM0MMm
  .mMMMm.
  ..mmm..`)

// ------------------------------------------------------------------ backdrop helpers
// Ocean from y down: light at the horizon, deep in front, wave dashes, foam crests.
const sea = (y, w, h, seed = 1, keys = "PpZz") => [vgrad(0, y, w, h - y, keys, 1, 2), hline(0, y, w, "4"),
  (c) => { const r = c.rng(seed); for (let i = 0; i < w * (h - y) / 40; i++) { const yy = y + 2 + Math.floor(r() * (h - y - 2)), t = (yy - y) / (h - y); c.hline(Math.floor(r() * w), yy, 2 + Math.floor(t * 8), t < 0.4 ? "4" : "P"); if (r() < 0.15) c.px(Math.floor(r() * w), yy - 1, "5") } }]
// Foam line where waves break.
const surf = (y, x0, x1, seed = 1) => (c) => { const r = c.rng(seed); for (let x = x0; x < x1; x++) if (r() < 0.75) c.px(x, y + (r() < 0.2 ? 1 : 0), "5"); for (let x = x0; x < x1; x += 6) c.hline(x + 2, y - 1, 3, "4") }
// Wake behind a ship (to its left), widening.
const wake = (x, y, len) => (c) => { for (let i = 0; i < len; i++) { const sp = Math.round(i / 6); c.px(x - i, y - sp, "5"); c.px(x - i, y + sp, i % 2 ? "4" : "5") } }
// White sand beach with ripples left by the tide.
const beach = (y, w, h, seed = 1) => [vgrad(0, y, w, h - y, "Qq", 1, 2), (c) => { const r = c.rng(seed); for (let i = 0; i < w / 6; i++) c.hline(Math.floor(r() * w), y + 3 + Math.floor(r() * (h - y - 3)), 4 + Math.floor(r() * 5), "q") }]
const smokeP = (pts) => (c) => { for (const [x, y, r, k = 0] of pts) { c.circ(x, y, r, ["0", "M", "m"][k]); c.circ(x - 2, y - 2, Math.max(1, r - 3), ["M", "m", "l"][k]) } }
// Jungle wall: a bumpy dark mass, round crowns lit on top.
const jungleWall = (y, w, seed = 1) => (c) => {
  const r = c.rng(seed)
  for (let x = 0; x < w; x++) { const top = y - Math.round(8 + 6 * Math.sin(x * 0.15 + seed) + 4 * Math.sin(x * 0.055)); c.vline(x, top, c.h - top, "A") }
  for (let i = 0; i < w / 3; i++) { const x = Math.floor(r() * w), yy = y - 12 + Math.floor(r() * 16), rr = 3 + Math.floor(r() * 4); c.circ(x, yy, rr, "A"); c.circ(x - 1, yy - 1, rr - 2, "c"); c.circ(x - 2, yy - 2, Math.max(1, rr - 4), "^") }
}
function stamps2(name, pts) { return (c) => { for (const [x, y, o] of pts) c.stamp(name, x, y, o) } }
// Muzzle blast pointing right.
const blast = (x, y) => [poly([x, y, x + 18, y - 6, x + 14, y, x + 18, y + 6], "L"), poly([x, y, x + 10, y - 3, x + 8, y, x + 10, y + 3], "K"), circ(x + 1, y, 3, "K"),
  smokeP([[x + 22, y - 6, 6, 1], [x + 28, y - 12, 5, 2], [x + 18, y - 14, 4, 2]]), glow("LK", { r: 8, strength: 0.4 })]

scene("contact_parts", { w: 340, h: 170, bg: "4" },
  stamp("_sol", 2, 4), stamp("_sol_x", 34, 4), stamp("_kneel", 66, 12), stamp("_kneel_x", 98, 12), stamp("_palm_a", 130, 0), stamp("_boom", 180, 4), stamp("_splash", 216, 0),
  stamp("_bb", 2, 50), stamp("_yamato", 110, 46), stamp("_cv", 2, 90), stamp("_dd_x", 112, 92), stamp("_ss", 200, 96), stamp("_ak", 240, 46),
  stamp("_hellcat", 2, 130), stamp("_zero", 66, 130), stamp("_sbd_dive", 130, 106), stamp("_val", 196, 132), stamp("_tbf", 260, 130))

// ------------------------------------------------------------------ cards (128x80)
function unit(name, build) {
  scene("c_" + name, { w: CW, h: CH }, ...build(""))
  scene("c_" + name + "_x", { w: CW, h: CH }, ...build("_x"))
}
const P2 = (x, us, jp) => (x ? jp : us)
const order = (name, ...items) => scene("c_" + name, { w: CW, h: CH }, ...items)

unit("cuirasse", (x) => [
  sky(CW, 48), stamp("_cloud_a", 10, 6), ...sea(48, CW, CH, 1),
  stamp("_bb" + x, 6, 22), wake(10, 52, 14),
  ...blast(102, 34),
])
unit("destroyer", (x) => [
  sky(CW, 40), stamp("_cloud_b", 88, 6), ...sea(40, CW, CH, 2),
  stamp("_dd" + x, 40, 26), poly([114, 44, 124, 38, 124, 48], "5"), wake(44, 46, 36),
  stamp("_splash", 6, 16), stamp("_splash", 26, 22),
])
unit("sous_marin", (x) => [
  vgrad(0, 0, CW, 44, "bBn", 1, 2), circ(104, 12, 6, "5"), glow("5", { r: 14, strength: 0.4 }),
  ...sea(44, CW, CH, 3, "nBbb"), hline(0, 44, CW, "N"),
  stamp(P2(x, "_ss", "_ss_x"), 4, 38, { swap: NIGHT }), (c) => { for (let i = 0; i < 44; i++) c.px(76 + i, 62 + Math.round(i / 4), i % 2 ? "N" : "5") },   // torpedo wake
  stamp(P2(x, "_ak_far_x", "_ak_far"), 80, 24, { swap: NIGHT }), stamp("_boom", 92, 10),
])
unit("dauntless", (x) => [
  sky(CW, 52), stamp("_cloud_a", 80, 4), ...sea(52, CW, CH, 4),
  stamp(P2(x, "_sbd_dive", "_val_dive"), 4, -6),
  stamp(P2(x, "_cv_far_x", "_cv_far"), 60, 40), stamp("_splash", 82, 22), stamp("_boom", 50, 28),
  hline(32, 16, 6, "4"), hline(26, 6, 6, "4"),
])
unit("hellcat", (x) => [
  sky(CW, CH, "1+2=3~"), stamp("_cloud_a", 4, 52), stamp("_cloud_b", 88, 8), stamp("_cloud_b", 60, 60),
  stamp(P2(x, "_hellcat", "_zero"), 24, 18),
  hline(4, 28, 16, "4"), hline(8, 34, 12, "4"),
  stamp(P2(x, "_zero_fall", "_hellcat_dive"), 76, 24), smokeP([[96, 44, 4, 0], [90, 38, 4, 1], [86, 32, 3, 2]]),
])
unit("marines", (x) => [
  sky(CW, 28, "1+2=34"), ...sea(28, CW, 52, 5), ...beach(52, CW, CH, 5), surf(51, 0, CW, 5),
  stamp("_palm_b", 88, -8), stamp("_palm_d", 60, 8),
  stamp("_sol" + x, 8, 32), stamp("_sol" + x, 40, 38, { swap: BACK }), stamp("_kneel" + x, 84, 46),
])
unit("lance_flammes", (x) => [
  sky(CW, 24, "+=~YS"), rect(0, 24, CW, 56, "m"), hills(32, 4, "M", 3, 80),
  rect(88, 36, 40, 44, "M"), ellipse(108, 56, 12, 10, "k"), rect(96, 56, 26, 24, "M"), rect(98, 58, 22, 22, "k"),   // cave mouth
  ...beach(68, CW, CH, 6),
  stamp("_sol" + x, 8, 38), rect(8, 48, 8, 14, "I"), hline(8, 48, 8, "j"),
  poly([44, 48, 76, 42, 104, 52, 108, 62, 76, 60, 44, 52], "D"), poly([44, 48, 72, 46, 92, 54, 76, 56, 44, 52], "L"), poly([44, 50, 64, 48, 76, 52, 60, 52], "K"),
  glow("LK", { r: 12, strength: 0.5 }),
])
unit("seabees", (x) => [
  sky(CW, 36), stamp("_cloud_b", 12, 6), jungleWall(40, CW, 4), rect(0, 48, CW, 32, "q"), rect(0, 54, CW, 16, "T"),
  (c) => { for (let px_ = 4; px_ < CW; px_ += 12) { c.hline(px_, 62, 6, "W"); c.hline(px_ + 6, 58, 4, "t") } },   // pierced-steel planking
  // bulldozer: yellow body, cab, tracks, blade
  rect(36, 44, 40, 16, "y"), hline(36, 44, 40, "Y"), rect(40, 34, 18, 10, "I"), rect(42, 36, 14, 6, "P"), vline(62, 36, 8, "M"),
  rect(32, 60, 48, 8, "M"), (c) => { for (let wx = 36; wx < 80; wx += 8) c.circ(wx, 64, 3, "I") }, rect(76, 46, 6, 22, "I"), rect(82, 52, 6, 16, "j"),
  stamp("_kneel" + x, 8, 44), stamp("_palm_d", 96, 16),
])
unit("cargo", (x) => [
  sky(CW, 44, "1+2=34"), ...sea(44, CW, CH, 7, "PpZ"),
  rect(0, 56, 40, 24, "W"), hline(0, 56, 40, "x"), (c) => { for (let px_ = 2; px_ < 40; px_ += 10) c.vline(px_, 58, 22, "w") },   // pier
  stamp("_ak" + x, 36, 20), wake(40, 48, 12),
  (c) => { for (const [bx, by] of [[4, 44], [18, 44], [10, 34]]) { c.rect(bx, by, 12, 10, "x"); c.box(bx, by, 12, 10, "W"); c.line(bx, by, bx + 11, by + 9, "W") } },   // crates
])
unit("porte_avions", (x) => [
  sky(CW, 40), stamp("_cloud_a", 80, 4), ...sea(40, CW, CH, 8),
  stamp("_cv" + x, 8, 24), wake(12, 44, 12),
  (c) => { for (const px_ of [20, 36, 52]) c.grid(px_, 25, x ? "9.9.9\n99999" : "n.n.n\nnnnnn") },   // planes on deck
  stamp("_dot_plane", 92, 12), stamp("_dot_plane", 108, 20), stamp("_dot_plane", 76, 8),
])
unit("corsair", (x) => [
  sky(CW, 64, "1+2=34"), jungleWall(60, CW, 9), smokeP([[104, 52, 8, 0], [112, 40, 10, 1], [100, 36, 6, 2]]),
  stamp(P2(x, "_corsair", "_george"), 16, 12),
  line(72, 26, 96, 44, "L"), line(74, 28, 98, 46, "D"), stamp("_boom", 88, 36),
])
unit("lvt", (x) => [
  sky(CW, 24), ...sea(24, CW, 48, 10), ...beach(48, CW, CH, 10), surf(47, 0, CW, 10),
  // amtrac climbing out of the surf: boxy hull, tracks, men inside
  poly([28, 60, 36, 40, 88, 40, 96, 52, 92, 64, 28, 64], P2(x, "v", "h")), hline(36, 40, 52, P2(x, "V", "H")), rect(32, 60, 60, 8, "M"),
  (c) => { for (let tx = 34; tx < 92; tx += 6) c.rect(tx, 66, 3, 2, "I") }, rect(72, 32, 12, 8, P2(x, "U", "G")), hline(82, 34, 8, "M"),
  stamp("_kneel" + x, 40, 18), stamp("_kneel" + x, 56, 18), poly([20, 60, 28, 52, 28, 64], "5"), surf(62, 8, 32, 3),
])
unit("code_talkers", (x) => [
  sky(CW, 28), jungleWall(36, CW, 11), rect(0, 52, CW, 28, "T"), ellipse(64, 60, 52, 12, "t"),    // foxhole
  rect(48, 44, 24, 18, P2(x, "U", "G")), rect(50, 46, 20, 6, "I"), (c) => { for (let i = 0; i < 4; i++) c.px(52 + 4 * i, 54, "L") }, vline(68, 12, 32, "M"), px(68, 10, "I"),   // radio, antenna
  stamp("_kneel" + x, 16, 36), stamp("_kneel" + x, 80, 36, { flip: "x" }), line(34, 44, 46, 48, "M"), line(92, 44, 72, 48, "M"),
])
unit("yamato", (x) => [
  sky(CW, 44, "+=~YS"), ...sea(44, CW, CH, 12, "YpZz"), hline(0, 44, CW, "Y"),
  stamp("_yamato", 4, 18), wake(8, 50, 10),
  smokeP([[72, 10, 6, 1], [80, 4, 6, 2]]),
])
unit("garnison", (x) => [
  vgrad(0, 0, CW, CH, "mM0", 1, 2), (c) => { for (const [cx, cy] of [[12, 10], [40, 6], [100, 12], [116, 30], [8, 40]]) { c.ellipse(cx, cy, 6, 3, "M"); c.hline(cx - 4, cy - 2, 6, "l") } },   // rock strata
  ellipse(60, 48, 52, 28, "k"), rect(8, 48, 104, 32, "k"), rect(0, 72, CW, 8, "t"),                // tunnel
  stamp("_kneel" + x, 16, 40), stamp("_sol" + x, 68, 34),
  rect(40, 54, 20, 4, "I"), hline(60, 54, 8, "M"), line(44, 58, 40, 66, "I"), line(52, 58, 56, 66, "I"),   // machine gun
  circ(100, 16, 2, "L"), px(100, 15, "K"), glow("LK", { r: 26, strength: 0.5 }),
])
unit("tireurs", (x) => [
  sky(CW, 40, "1+2=34"), ...sea(40, CW, 56, 14), ...beach(56, CW, CH, 14), surf(55, 0, CW, 14),
  stamp("_palm_c", 56, -12), stamp("_kneel" + x, 80, 4), line(96, 14, 112, 12, "M"),
  stamp(P2(x, "_sol_x", "_sol"), 12, 44), px(114, 12, "K"),
])
unit("kamikaze", (x) => [
  sky(CW, 52, "1+2=3~4"), ...sea(52, CW, CH, 15),
  stamp(P2(x, "_zero_dive", "_hellcat_dive"), 4, -8), smokeP([[16, 4, 4, 0], [10, 0, 4, 1]]),
  stamps2("_flak", [[60, 8], [88, 20], [44, 28], [104, 4]]),
  stamp(P2(x, "_cv_far", "_cv_far_x"), 60, 40), stamp("_boom", 76, 24), glow("LK", { r: 10, strength: 0.4 }),
])
unit("avenger", (x) => [
  sky(CW, 44), stamp("_cloud_b", 80, 4), ...sea(44, CW, CH, 16),
  stamp(P2(x, "_tbf", "_kate"), 8, 18),
  hline(28, 60, 12, "I"), (c) => { for (let i = 0; i < 36; i++) c.px(40 + i, 62, i % 2 ? "4" : "5") },
  stamp(P2(x, "_bb_far_x", "_bb_far"), 72, 34), stamp("_splash", 100, 24),
])
unit("corpsman", (x) => [
  sky(CW, 28, "1+2=34"), ...sea(28, CW, 44, 17), ...beach(44, CW, CH, 17), surf(43, 0, CW, 17),
  stamp("_palm_a", 88, -14),
  stamp("_kneel" + x, 20, 40), rect(26, 50, 6, 4, "5"), px(28, 50, "s"),                                   // armband
  rect(44, 64, 36, 6, P2(x, "v", "h")), rect(76, 62, 8, 6, "F"), rect(40, 62, 6, 6, P2(x, "U", "G")),      // wounded
  rect(52, 56, 8, 6, "5"), px(55, 58, "s"), px(56, 58, "s"), px(55, 57, "s"), px(55, 59, "s"),             // first-aid kit
])

// Orders are side-neutral: one illustration each.
order("turkey_shoot",
  sky(CW, 60, "1+2=3~4"), ...sea(60, CW, CH, 20),
  stamp("_zero_fall", 4, -6), smokeP([[18, 6, 4, 0], [12, 0, 4, 1]]),
  stamp("_val_fall", 68, 6), smokeP([[88, 22, 4, 0], [82, 16, 4, 1]]),
  stamp("_hellcat", 40, 36), stamps2("_flak", [[60, 8], [104, 8], [36, 24]]), stamp("_splash", 104, 44))
order("banzai",
  vgrad(0, 0, CW, 48, "bBn", 1, 2), circ(80, 10, 4, "5"), glow("5", { r: 16, strength: 0.5 }),
  rect(0, 48, CW, 32, "B"), hline(0, 48, CW, "n"), stamp("_palm_b", 4, 4, { swap: NIGHT }),
  stamp("_sol_x", 20, 40, { swap: NIGHT }), stamp("_sol_x", 52, 36, { swap: NIGHT }), stamp("_sol_x", 84, 42, { swap: NIGHT }))
order("bombardement",
  sky(CW, 40, "+=~YS"), ...sea(40, CW, CH, 21),
  clip((x, y) => y < 54 && x < 70 - (54 - y) * 0.6, jungleWall(50, 72, 5)), poly([0, 52, 64, 52, 72, 58, 0, 58], "Q"), hline(0, 58, 72, "5"),
  stamp("_boom", 8, 20), stamp("_boom", 36, 16), smokeP([[24, 12, 8, 0], [48, 8, 6, 1]]),
  stamp("_bb_far", 72, 44), poly([72, 54, 60, 50, 72, 52], "L"), stamp("_dd_far", 92, 60), poly([96, 68, 84, 64, 96, 66], "L"))
order("ravitaillement",
  vgrad(0, 0, CW, 40, "bBn", 1, 2), circ(20, 12, 5, "5"), glow("5", { r: 14, strength: 0.4 }),
  ...sea(40, CW, CH, 22, "nBbb"), hline(0, 40, CW, "N"), (c) => { for (let i = 0; i < 28; i++) c.px(8 + i * 2, 52, "N") },
  stamp("_ak_far", 12, 24, { swap: NIGHT }), stamp("_dd_far", 60, 30, { swap: NIGHT }), stamp("_ak_far", 80, 44, { swap: NIGHT }))
order("guetteurs",
  sky(CW, 44), ...sea(44, CW, 56, 23), jungleWall(60, CW, 23),
  stamp("_dd_far_x", 68, 32), stamp("_bb_far_x", 12, 28),
  stamp("_kneel", 88, 48, { flip: "x" }), rect(86, 54, 6, 4, "M"),                              // binoculars
  rect(108, 60, 16, 12, "U"), rect(110, 62, 12, 4, "I"), vline(120, 40, 20, "M"))                // teleradio
order("fumee",
  sky(CW, 44), ...sea(44, CW, CH, 24),
  smokeP([[12, 40, 12, 1], [28, 32, 14, 2], [48, 36, 14, 1], [64, 40, 12, 2], [20, 52, 10, 0], [44, 52, 12, 1], [60, 50, 8, 2]]),
  stamp("_dd", 56, 36), poly([128, 56, 132, 52, 132, 62], "5"), wake(60, 56, 16),
  smokeP([[76, 36, 4, 0], [72, 30, 4, 1]]))

// Card back for face-down cards: navy blue, an anchor.
scene("c_back", { w: CW, h: CH, bg: "Z" },
  (c) => { for (let i = -CH; i < CW; i += 8) c.line(i, CH - 1, i + CH, 0, "z") },
  box(2, 2, CW - 4, CH - 4, "P"), box(4, 4, CW - 8, CH - 8, "z"),
  circ(64, 40, 24, "z"), ring(64, 40, 24, "P"), ring(64, 40, 21, "p"),
  rect(63, 22, 3, 34, "Q"), vline(65, 22, 34, "q"), ring(64, 21, 3, "Q"), rect(54, 29, 22, 3, "Q"), hline(54, 31, 22, "q"),
  line(50, 44, 64, 56, "Q", 3), line(78, 44, 64, 56, "Q", 3), poly([46, 42, 52, 40, 50, 46], "Q"), poly([82, 42, 76, 40, 78, 46], "Q"))

const CARDS = ["cuirasse", "destroyer", "sous_marin", "dauntless", "hellcat", "marines", "lance_flammes", "seabees", "cargo", "porte_avions", "corsair", "lvt", "code_talkers", "yamato", "garnison", "tireurs", "kamikaze", "avenger", "corpsman"]
const ORDERS = ["turkey_shoot", "banzai", "bombardement", "ravitaillement", "guetteurs", "fumee", "back"]
scene("contact_cards", { w: 4 * 130 + 2, h: 12 * 82 + 2, bg: "k" },
  ...CARDS.map((n, i) => stamp("c_" + n, 2 + (i % 2) * 260, 2 + Math.floor(i / 2) * 82)),
  ...CARDS.map((n, i) => stamp("c_" + n + "_x", 132 + (i % 2) * 260, 2 + Math.floor(i / 2) * 82)),
  ...ORDERS.map((n, i) => stamp("c_" + n, (i % 4) * 130 + 2, 2 + (10 + Math.floor(i / 4)) * 82)))

// ------------------------------------------------------------------ terrains (320x144)
const terrain = (name, ...items) => scene("t_" + name, { w: TW, h: TH, bg: "4" }, ...items)
// Coconut-log pillbox: a low sand mound, rows of logs, a dark firing slit.
const pillbox = (x, y, w) => (c) => {
  c.ellipse(x + w / 2, y + 8, w / 2 + 8, 12, "q"); c.ellipse(x + w / 2 - 4, y + 4, w / 2, 6, "Q")
  c.rect(x, y, w, 16, "W"); for (let ly = y; ly < y + 16; ly += 4) { c.hline(x, ly, w, "x"); c.hline(x, ly + 3, w, "w"); for (let lx = x + (ly % 8); lx < x + w; lx += 10) c.ellipse(lx, ly + 1, 1, 1, "X") }
  c.rect(x + 6, y + 6, w - 12, 4, "k"); c.hline(x - 4, y - 2, w + 8, "Q")
}
const reefCoral = (y0, y1, seed) => (c) => { const r = c.rng(seed); for (let i = 0; i < 90; i++) { const x = Math.floor(r() * TW), y = y0 + Math.floor(r() * (y1 - y0)); c.ellipse(x, y, 3 + Math.floor(r() * 5), 1 + Math.floor(r() * 2), r() < 0.5 ? "q" : "T"); c.px(x - 1, y - 1, "Q") } }
const amtrac = (x, y) => [poly([x, y + 16, x + 6, y, x + 52, y, x + 58, y + 10, x + 56, y + 18, x, y + 18], "v"), hline(x + 6, y, 46, "V"), rect(x + 2, y + 14, 52, 6, "M"),
  (c) => { for (let tx = x + 4; tx < x + 54; tx += 6) c.rect(tx, y + 18, 3, 2, "I") }, rect(x + 38, y - 6, 10, 6, "U")]

terrain("haute_mer",
  sky(TW, 60), stamp("_cloud_a", 40, 10), stamp("_cloud_b", 220, 18), stamp("_cloud_a", 260, 4),
  ...sea(60, TW, TH, 1),
  stamp("_cv_far_x", 208, 44), stamp("_dd_far_x", 272, 50), stamp("_bb_far", 20, 46), wake(24, 58, 18),
  stamp("_cv", 80, 78), wake(84, 102, 40), stamp("_dd", 216, 98), wake(220, 118, 24),
  stamps2("_dot_plane", [[140, 16], [156, 24], [172, 12], [128, 28]]))

terrain("recif",
  sky(TW, 36, "1+2=34"), stamp("_cloud_b", 240, 6), hills(32, 3, "&", 2, 40, TW), rect(0, 36, TW, 8, "Q"),
  vgrad(0, 44, TW, 52, "$$@", 1, 2), reefCoral(70, 92, 4),                                                   // the lagoon over the reef, coral heads
  ...sea(96, TW, TH, 4), surf(95, 0, TW, 4), surf(72, 40, 280, 5),
  ...amtrac(36, 68), stamp("_boom", 44, 48),                                                                // amtrac stuck on the reef
  stamp("_kneel", 120, 56), stamp("_kneel", 152, 60), stamp("_sol", 192, 52), rect(112, 82, 100, 3, "$"),
  stamp("_ak_far", 240, 104), stamp("_splash", 280, 78))

terrain("jungle",
  vgrad(0, 0, TW, 40, "~4C", 1, 2), jungleWall(48, TW, 1), jungleWall(88, TW, 2),
  (c) => { for (const [vx, vy] of [[40, 0], [124, 0], [236, 0], [292, 0]]) { c.line(vx, vy, vx + 6, 60, "a", 2); c.line(vx + 2, vy, vx + 8, 60, "c") } },   // vines
  stamps2("_palm_c", [[0, 16], [260, 12]]), stamps2("_palm_a", [[120, 20], [192, 32]]),
  rect(0, 120, TW, 24, "a"), (c) => { const r = c.rng(3); for (let i = 0; i < 140; i++) { const x = Math.floor(r() * TW); c.line(x, 144, x + Math.floor(r() * 12) - 6, 104 + Math.floor(r() * 20), r() < 0.5 ? "c" : "^") } },   // ferns
  stamp("_kneel_x", 140, 92, { swap: { h: "c", H: "^", G: "A", g: "a" } }))

terrain("grottes",
  sky(TW, 40, "1+2=3"),
  flankShade((x) => Math.round(40 + 16 * Math.sin(x * 0.025) + 8 * Math.sin(x * 0.085)), 0, TW, "lmM0"),
  (c) => { const r = c.rng(5); for (let i = 0; i < 40; i++) { const x = Math.floor(r() * TW), y = 60 + Math.floor(r() * 60); c.line(x, y, x + 8, y + 12, "0") } },   // fissures
  (c) => { for (const [x, y, w, h] of [[40, 72, 20, 14], [124, 60, 24, 16], [208, 80, 18, 12], [272, 64, 20, 16], [88, 104, 16, 10], [244, 112, 18, 10]]) { c.ellipse(x, y, w / 2, h / 2, "k"); c.rect(x - w / 2, y, w, h / 2, "k"); c.hline(x - w / 2, y - h / 2, w, "l") } },   // cave mouths
  px(128, 66, "K"), px(129, 66, "L"), px(212, 84, "K"), glow("KL", { r: 5, strength: 0.6 }),               // muzzle flashes
  stamps2("_stump", [[172, 24], [60, 36]]), rect(0, 128, TW, 16, "M"))

terrain("blockhaus",
  sky(TW, 44, "1+2=34"), ...sea(44, TW, 60, 6), ...beach(60, TW, TH, 6), surf(60, 0, TW, 6),
  stamps2("_stump", [[40, 32], [148, 40], [260, 28]]), stamps2("_palm_b", [[80, 16], [292, 20]]),
  pillbox(28, 80, 60), pillbox(152, 72, 52), pillbox(236, 92, 64),
  (c) => { for (const [x, y] of [[120, 116], [200, 124], [60, 128], [280, 132]]) { c.ellipse(x, y, 10, 4, "T"); c.ellipse(x, y + 1, 8, 2, "t") } },   // shell holes
  px(40, 86, "K"), px(168, 78, "K"), glow("K", { r: 5, strength: 0.6 }))

terrain("piste",
  sky(TW, 48), stamp("_cloud_a", 200, 8), jungleWall(60, TW, 7), stamps2("_palm_a", [[20, 12], [280, 8]]),
  rect(0, 68, TW, 76, "q"), rect(0, 88, TW, 32, "T"), hline(0, 88, TW, "W"), hline(0, 119, TW, "t"),
  (c) => { for (let x = 0; x < TW; x += 6) for (let y = 90; y < 118; y += 6) c.rect(x + (y % 12 ? 0 : 3), y, 3, 2, "W") },   // pierced-steel matting
  (c) => { for (let x = 8; x < TW; x += 24) c.hline(x, 104, 12, "5") },                                       // runway centre line
  stamp("_hellcat", 80, 68), stamp("_sbd", 160, 76), stamp("_hellcat", 240, 64),
  rect(280, 48, 20, 20, "W"), rect(284, 36, 12, 12, "x"), rect(286, 38, 8, 4, "P"), vline(290, 24, 12, "M"),    // control tower
  rect(8, 124, 60, 16, "v"), poly([8, 124, 38, 112, 68, 124], "U"), hline(10, 116, 56, "V"))                     // quonset hut

terrain("port",
  sky(TW, 44, "1+2=34"), hills(36, 6, "c", 3, 48, TW), ...sea(48, TW, TH, 7, "PpZ"),
  rect(0, 92, 140, 52, "W"), hline(0, 92, 140, "x"), (c) => { for (let px_ = 8; px_ < 140; px_ += 16) c.vline(px_, 94, 50, "w") },   // wharf
  rect(20, 60, 52, 32, "i"), poly([20, 60, 46, 48, 72, 60], "I"), rect(36, 76, 16, 16, "k"),                    // warehouse
  vline(104, 40, 52, "I"), line(104, 42, 132, 60, "I", 2), line(132, 60, 132, 80, "M"),                         // crane
  (c) => { for (const [bx, by] of [[80, 80], [94, 80], [86, 70]]) { c.rect(bx, by, 12, 10, "x"); c.box(bx, by, 12, 10, "W") } },
  stamp("_ak", 144, 66), stamp("_dd", 232, 88), stamp("_ak_far", 240, 44))

terrain("volcan",
  sky(TW, 92, "+=~YS"), ...sea(92, TW, TH, 8, "PpZ"), smokeP([[192, 8, 14, 0], [208, 16, 12, 1], [176, 20, 10, 2]]),
  flankShade((x) => Math.round(132 - 100 * Math.max(0, 1 - Math.abs(x - 192) / 140) ** 1.4), 0, TW, "lmM0"),
  (c) => { const top = (x) => Math.round(132 - 100 * Math.max(0, 1 - Math.abs(x - 192) / 140) ** 1.4); for (let i = 0; i < 26; i++) { const x = 80 + i * 8, t = top(x); c.line(x, t + 4, x + (x < 192 ? -6 : 6), t + 20, "0") } },   // gullies
  rect(184, 30, 18, 4, "0"), circ(192, 28, 4, "L"), circ(192, 28, 2, "K"), glow("LK", { r: 8, strength: 0.5 }),
  ...beach(128, TW, TH, 8), vgrad(0, 124, TW, 6, "Mq", 1, 2))

terrain("lagon",
  sky(TW, 32), stamp("_cloud_b", 60, 4), ...sea(32, TW, TH, 9),
  ellipse(160, 92, 148, 44, "Q"), ellipse(160, 94, 132, 34, "@"), ellipse(160, 96, 100, 24, "$"),              // ring of sand round the lagoon
  surf(48, 20, 300, 9), stamps2("_palm_b", [[28, 36], [260, 32]]), stamps2("_palm_d", [[80, 36], [200, 32], [140, 100]]),
  stamp("_ak_far", 132, 84), stamp("_ss", 200, 100))

terrain("atoll",
  sky(TW, 52, "1+2=34"), stamp("_cloud_a", 216, 8), ...sea(52, TW, TH, 10),
  ellipse(160, 100, 108, 24, "Q"), ellipse(160, 102, 88, 16, "@"), ellipse(168, 98, 52, 12, "Q"),
  stamps2("_palm_a", [[100, 40], [180, 44]]), stamps2("_palm_d", [[140, 64], [216, 60]]),
  surf(76, 60, 260, 10), surf(124, 60, 260, 11),
  rect(120, 90, 80, 3, "T"), stamp("_dd_far_x", 256, 60))

terrain("marecage",
  vgrad(0, 0, TW, 48, "~4C", 1, 2), jungleWall(60, TW, 12),
  vgrad(0, 80, TW, 64, "ZzZ", 1, 2), hline(0, 80, TW, "p"),
  (c) => { const r = c.rng(6); for (let i = 0; i < 34; i++) { const x = Math.floor(r() * TW); for (const dx of [-6, -2, 2, 6]) c.line(x, 88, x + dx, 104 + Math.floor(r() * 12), "W"); c.circ(x, 80, 8, "A"); c.circ(x - 2, 78, 5, "c"); c.circ(x - 4, 76, 2, "^") } },   // mangrove roots
  (c) => { const r = c.rng(8); for (let i = 0; i < 60; i++) c.hline(Math.floor(r() * TW), 108 + Math.floor(r() * 36), 6, "p") },
  stamp("_kneel", 124, 92), stamp("_kneel", 172, 96))

// Landing beach: assault craft beached, Marines going in, palms behind.
terrain("plage",
  sky(TW, 32, "1+2=34"), jungleWall(44, TW, 13), stamps2("_palm_c", [[40, 0], [220, 4]]), stamps2("_stump", [[140, 24]]),
  ...beach(56, TW, 100, 13), ...sea(100, TW, TH, 13), surf(100, 0, TW, 13),
  stamp("_ak_far", 40, 112), stamp("_dd_far", 240, 116),
  (c) => { for (const lx of [60, 184]) { c.rect(lx, 92, 44, 14, "I"); c.rect(lx + 36, 88, 8, 18, "i"); c.hline(lx, 92, 44, "j"); c.hline(lx - 4, 106, 52, "5") } },   // landing craft
  stamp("_sol", 84, 64), stamp("_kneel", 120, 72), stamp("_sol", 204, 60), stamp("_kneel", 256, 72),
  stamp("_splash", 140, 84), stamp("_boom", 280, 44))

// Campaign terrains with their own picture.
terrain("betio",
  sky(TW, 28, "+=~YS"), smokeP([[80, 16, 14, 0], [104, 8, 12, 1], [240, 20, 12, 0]]),
  ...beach(40, TW, 68, 14), rect(0, 40, TW, 10, "W"), (c) => { for (let x = 0; x < TW; x += 8) { c.vline(x, 40, 10, "x"); c.px(x + 1, 41, "X") } },   // log seawall
  stamps2("_stump", [[60, 12], [180, 8], [280, 16]]), pillbox(120, 24, 40),
  vgrad(0, 68, TW, 76, "$@pZ", 1, 2), surf(66, 0, TW, 14),
  rect(200, 52, 12, 92, "W"), (c) => { for (let y = 56; y < 144; y += 10) c.hline(200, y, 12, "x") },          // the long pier
  ...amtrac(56, 86), stamp("_boom", 68, 62),
  stamp("_kneel", 120, 76), stamp("_kneel", 152, 84), stamp("_sol", 240, 80), stamp("_kneel", 280, 92),
  rect(112, 100, 80, 3, "$"), rect(236, 110, 60, 3, "$"))

terrain("sable_noir",
  sky(TW, 40, "1+2=3"),
  flankShade((x) => Math.round(x < 120 ? 60 - 44 * Math.max(0, 1 - Math.abs(x - 48) / 60) : 200), 0, 120, "mM00"),         // Suribachi far away
  rect(0, 60, TW, 60, "M"), (c) => { for (let y = 68; y < 116; y += 10) for (let x = (y * 7) % 40; x < TW; x += 56) { c.hline(x, y, 24, "0"); c.hline(x + 4, y - 1, 16, "m") } },   // black sand terraces
  ...sea(116, TW, TH, 15, "PpZ"), surf(116, 0, TW, 15),
  ...amtrac(40, 100), stamp("_boom", 180, 40), stamp("_boom", 260, 52),
  stamp("_kneel", 100, 80), stamp("_kneel", 140, 88), stamp("_sol", 212, 72), stamp("_kneel", 260, 92),
  smokeP([[200, 28, 8, 0], [280, 36, 10, 1]]))

terrain("suribachi",
  sky(TW, 128, "1+2=3~4"), stamp("_cloud_a", 28, 12), stamp("_cloud_b", 260, 24),
  flankShade((x) => Math.round(124 - 92 * Math.max(0, 1 - Math.abs(x - 160) / 128) ** 1.2), 0, TW, "lmM0"),
  (c) => { const top = (x) => Math.round(124 - 92 * Math.max(0, 1 - Math.abs(x - 160) / 128) ** 1.2); for (let i = 0; i < 24; i++) { const x = 60 + i * 9, t = top(x); c.line(x, t + 4, x + (x < 160 ? -4 : 4), t + 18, "0") } },
  rect(148, 30, 24, 4, "0"), line(152, 32, 168, 8, "W", 2),                                                     // the pole, raised
  (c) => { for (let y = 0; y < 12; y++) c.line(168 - Math.round(y * 0.1), 8 + y, 186, 10 + y, y % 4 < 2 ? "5" : "s") }, rect(168, 8, 8, 6, "n"), (c) => { c.px(170, 10, "5"); c.px(173, 11, "5") },
  stamp("_kneel", 136, 12), stamp("_sol", 152, 4, { flip: "x" }),
  ...sea(128, TW, TH, 16, "PpZ"), surf(128, 0, TW, 16))

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

// ------------------------------------------------------------------ initiative coin (64x64), struck in relief
// coin_0 = the player (the white star on blue), coin_1 = the enemy (the red disc on white).
const starMask = (cx, cy, R, r, key) => (c) => {
  const P = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R; return [cx + d * Math.cos(a), cy + d * Math.sin(a)] })
  const inside = (x, y) => P.reduce((n, [x1, y1], i) => { const [x2, y2] = P[(i + 1) % 10]; return (y1 > y) !== (y2 > y) && x < x1 + (y - y1) * (x2 - x1) / (y2 - y1) ? !n : n }, false)
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) if (inside(x + 0.5, y + 0.5)) c.px(x, y, key)
}
const disc = (r, col) => (c) => { for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) if (Math.hypot(x - 31.5, y - 31.5) <= r) c.px(x, y, col) }
sprite("coin_0", { w: 64, h: 64 }, coinDisc("b", "n", "N", "B"), disc(23, "n"), starMask(32, 34, 20, 8, "&"), relief("&", "5", "5", "4"))
sprite("coin_1", { w: 64, h: 64 }, coinDisc("T", "Q", "5", "q"), disc(23, "5"), disc(14, "&"), relief("&", "s", "S", "R"))

// ------------------------------------------------------------------ campaign map (640x280)
// Same frame as campaign.js project(): lon 118..186 (Midway at 182.6), lat 40..-16. A naval chart of the Pacific:
// pale sea with its grid, coastlines in sand and jungle. Battle markers are HTML on top.
const P = (lon, lat) => [Math.round((lon - 118) * MW / 68), Math.round((40 - lat) * MH / 56)]
const path = (pts) => pts.flatMap(([lon, lat]) => P(lon, lat))
const land = (pts, key = "Q") => poly(path(pts), key)
scene("map_pacifique", { w: MW, h: MH, bg: "P" },

  // chart grid every 10 degrees, depth soundings near the coasts
  (c) => { for (let lon = 120; lon <= 180; lon += 10) { const [x] = P(lon, 0); for (let y = 0; y < MH; y += 3) c.px(x, y, "p") } for (let lat = 30; lat >= -10; lat -= 10) { const [, y] = P(120, lat); for (let x = 0; x < MW; x += 3) c.px(x, y, "p") } },
  (c) => { const [, y] = P(120, 0); c.hline(0, y, MW, "p") },                                   // the equator, solid
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
  land([[118, 7], [119.3, 5.3], [118.5, 4.3], [118, 1], [118, 7]], "C"),
  land([[120.5, 1.2], [124.9, 1.6], [121, 0.4], [120.2, -1.5], [121.5, -4.6], [120.3, -5.5], [119.4, -3.5], [119.7, 0.5]], "C"),
  land([[127.4, 2.2], [128.6, 1.4], [128, -0.8], [127.5, 0.3]], "C"),
  // New Guinea and the Bismarcks.
  land([[131, -1.2], [134, -0.8], [135.3, -3.3], [138, -1.6], [141, -2.6], [145.8, -4.8], [147.7, -6.2], [150.5, -10.4], [147, -10.1], [143.5, -9], [141, -9.2], [138, -8.4], [137.5, -5], [134, -3.9], [132, -2.8]], "C"),
  land([[148, -5.6], [151, -5.2], [152.2, -4.2], [152.4, -5.8], [150.5, -6.4], [148.5, -6.1]], "C"),                  // New Britain (Rabaul)
  land([[150.8, -2.6], [152.8, -4.2], [152.6, -4.8]], "C"),                                                            // New Ireland
  // The Solomons: Bougainville to Guadalcanal and San Cristobal.
  land([[154.6, -5.1], [155.9, -6.4], [155.5, -6.9], [154.7, -6.1]], "C"),
  land([[156.6, -7.0], [157.6, -7.4], [157.4, -8.0]], "C"), land([[158.1, -7.5], [159.8, -8.4], [159.5, -8.7]], "C"),
  land([[159.6, -9.2], [160.8, -9.4], [160.4, -9.8], [159.6, -9.6]], "C"),                                             // Guadalcanal
  land([[160.7, -8.4], [161.5, -9.6], [161, -9.3]], "C"), land([[161.3, -10.2], [162.3, -10.7], [161.6, -10.6]], "C"),
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
    for (const [lon, lat, r = 0] of dots) { const [x, y] = P(lon, lat); if (r) { c.ellipse(x, y, r + 1, r, "m"); c.px(x, y, "C") } else c.rect(x, y, 2, 1, "m") }
  },
  // small islands: Marianas, Bonins and Volcanos, Ryukyus, Palau, Carolines, Marshalls, Gilberts, Wake, Midway
  (c) => {
    const dots = [[145.7, 15.2, 2], [144.8, 13.4, 3], [145.6, 14.1, 2], [145.7, 16.7], [145.8, 18.1], [145.6, 20],
      [141.3, 24.8, 2], [142.2, 27], [142.1, 26.6], [127.8, 26.3, 3], [128.5, 27.2], [129.5, 28.3], [130.5, 30.4], [124.2, 24.4], [125.3, 24.8],
      [134.5, 7.4, 2], [134.25, 7], [138.1, 9.5], [151.8, 7.4, 2], [158.2, 6.9], [163, 5.3],
      [167.7, 9, 2], [167.4, 8.7], [171.4, 7.1], [169.6, 6], [171.2, 8.7], [166.8, 11.2], [168.8, 11.6],
      [173, 1.4, 2], [172.9, 3], [173.6, 0.2], [174.4, -0.6],
      [166.6, 19.3, 2], [182.6, 28.2, 2], [178.5, 28.4], [184.2, 26.2], [173, -15], [178, -16], [167, -15.5], [168, -16]]
    for (const [lon, lat, r = 0] of dots) { const [x, y] = P(lon, lat); if (r) { c.ellipse(x, y, r + 2, r, "Q"); c.ring(x, y, r + 3, "$"); c.px(x, y, "C") } else { c.rect(x, y, 3, 2, "Q"); c.px(x - 1, y + 2, "$") } }
  },
  // coast shading: a sand rim and a pale lagoon ring where land meets the sea
  (c) => { const L = (x, y) => c.is(x, y, "QC^c"); for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) { if (L(x, y) && (!L(x + 1, y + 1) || !L(x, y + 1))) c.px(x, y, "q"); else if (!L(x, y) && (L(x - 1, y) || L(x + 1, y) || L(x, y - 1) || L(x, y + 1))) c.px(x, y, "$") } },
  // jungle texture on the big islands
  (c) => { const r = c.rng(5); for (let i = 0; i < 4000; i++) { const x = Math.floor(r() * MW), y = Math.floor(r() * MH); if (c.is(x, y, "C") && c.is(x + 1, y + 1, "C")) { c.px(x, y, "^"); c.px(x + 1, y + 1, "c") } } },
  // Japan's capital, a red dot; an arrow off the right edge toward Pearl Harbor
  (c) => { const [x, y] = P(139.7, 35.7); c.circ(x, y, 2, "s") },
  (c) => { const [x, y] = P(185, 21); c.line(x - 16, y, x, y, "T", 2); c.line(x - 4, y - 4, x, y, "T"); c.line(x - 4, y + 4, x, y, "T") },
  box(0, 0, MW, MH, "T"), box(2, 2, MW - 4, MH - 4, "Q"))
