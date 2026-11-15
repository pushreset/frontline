// War of the Ring — terrains (320x144) and the campaign map of Middle-earth (640x280).
// t_<key>.png: the 13 base terrains and the 4 campaign terrains with their own picture; map_terre_milieu.png.
//
// Style rules (as the Gaul pack):
// - One light, from the top left. Volumes get light/shade on the lit and the far side, cast shadows fall right.
// - Hue-shifted ramps, 4-5 tones per material. No outlines in landscapes: materials meet without lines.
// - Three depths per landscape: hazy far (bluish, light), the subject in the middle, a dark foreground edge.
// - No filler speckle: every mark has a cause (stone courses, planks, thatch, reeds, ripples, rain).
// - Pure landscapes: at most tiny banners or fires. Original designs from the book's descriptions.
{
const terrain = (name, ...items) => scene("t_" + name, { w: TW, h: TH, bg: "4" }, ...items)
const B8 = (x, y) => BAYER[(y & 7) * 8 + (x & 7)] / 64 - 0.5          // ordered-dither offset, -0.5..0.5

// ------------------------------------------------------------------ landform helpers
// Mountain silhouette: peaks [cx, top, halfWidth, power] merged, with a broken ridge line. f(x) = top height.
const peaks = (base, list, seed = 1, jag = 1) => (x) => {
  let y = base
  for (const [cx, top, hw, p = 0.8] of list) { const d = Math.abs(x - cx) / hw; if (d < 1) y = Math.min(y, top + (base - top) * Math.pow(d, p)) }
  return Math.round(y + jag * (Math.sin(x * 0.9 + seed) * 0.8 + Math.sin(x * 0.37 + seed * 2) * 1.3 + Math.sin(x * 0.13 + seed) * 1.5))
}
// The peak whose slope gives the ground at x (to find which ridge a pixel belongs to).
const ownPeak = (base, list, x) => { let best = list[0], by = 1e9; for (const pk of list) { const [cx, top, hw, p = 0.8] = pk, d = Math.abs(x - cx) / hw; const y = d < 1 ? top + (base - top) * Math.pow(d, p) : 1e9; if (y < by) { by = y; best = pk } } return best }
// A mountain range lit from the left: each peak has a lit west face and a shaded east face split along a wandering
// ridge, snow above `snow` (fraction of the height), gullies running down the lit faces, darker at the foot.
// keys: snow lit, snow shade, rock lit, rock shade, rock deep (a hazy range uses pale keys).
const massif = (base, list, keys, { seed = 1, jag = 1, snow = 0.35, to = TH, gully = true } = {}) => (c) => {
  const f = peaks(base, list, seed, jag), [S0, S1, R0, R1, R2] = keys
  for (let x = 0; x < TW; x++) {
    const pk = ownPeak(base, list, x), [cx, top] = pk, y0 = f(x)
    for (let y = y0; y < to; y++) {
      const ridge = cx + Math.round(Math.sin(y * 0.31 + cx) * 2.5 + Math.sin(y * 0.11 + seed) * 3 + (y - top) * 0.25)
      const lit = x < ridge
      const sl = top + snow * (base - top) + Math.sin(x * 0.7 + seed) * 2 + Math.sin(x * 0.23) * 3 + (lit ? 0 : -3)
      const deep = (y - top) / Math.max(1, base - top) + B8(x, y) * 0.25 > 0.82
      let k = y < sl ? (lit ? S0 : S1) : lit ? (deep ? R1 : R0) : (deep ? R2 : R1)
      // gullies: slanting grooves on the lit faces, snow lying in them below the snow line
      if (gully && lit && ((x * 2 + y * 3 + Math.floor(Math.sin(y * 0.2 + x * 0.05) * 6)) % 23 === 0) && y > y0 + 2) k = y < sl + 8 ? S1 : R1
      c.px(x, y, k)
    }
  }
}
// Ashlar wall: courses with offset head joints, a lit coping, merlons on top, foot in shade. keys: lit, face, joint, deep.
const ashlar = (x0, x1, y, h, keys = "lmM0", { merlon = true, ch = 3, bw = 6 } = {}) => (c) => {
  const [L, F, J, D] = keys
  c.rect(x0, y, x1 - x0, h, F); c.hline(x0, y, x1 - x0, L)
  for (let r = ch, k = 0; r < h; r += ch, k++) {
    c.hline(x0, y + r, x1 - x0, J)
    for (let x = x0 + ((k % 2) ? bw / 2 : 0); x < x1; x += bw) c.vline(Math.round(x), y + r - ch + 1, ch - 1, J)
  }
  c.rect(x0, y + h - Math.max(1, Math.floor(h / 5)), x1 - x0, Math.max(1, Math.floor(h / 5)), J); c.hline(x0, y + h - 1, x1 - x0, D)
  if (merlon) for (let x = x0; x < x1; x += 4) { c.rect(x, y - 2, 2, 2, F); c.px(x, y - 2, L) }
}
// Round or square tower: shaft lit on the left, shaded on the right, string courses, slit windows, crenels.
const towerAt = (x, y, w, h, keys = "lmM0", { cap = "merlon", win = true } = {}) => (c) => {
  const [L, F, J, D] = keys
  for (let i = 0; i < w; i++) { const t = i / (w - 1); c.vline(x + i, y, h, t < 0.25 ? L : t < 0.7 ? F : t < 0.9 ? J : D) }
  for (let r = y + 4; r < y + h; r += 4) for (let i = 0; i < w; i++) if ((i + r) % 5) c.px(x + i, r, i / w < 0.25 ? F : J)
  if (win) for (let r = y + 5; r < y + h - 6; r += 9) c.vline(x + Math.floor(w / 2), r, 2, D)
  if (cap === "merlon") { c.rect(x - 1, y - 2, w + 2, 2, F); c.hline(x - 1, y - 2, w + 2, L); for (let i = -1; i < w + 1; i += 3) c.rect(x + i, y - 4, 2, 2, i < w / 2 ? L : F) }
  if (cap === "cone") { const hw = Math.ceil(w / 2) + 1; c.poly([x - 1, y, x + w / 2, y - w - 2, x + w + 1, y], "U"); c.poly([x - 1, y, x + w / 2, y - w - 2, x + w / 2, y], "v") }
}
// Rain: long slanting streaks, falling left to right (the wind from the west).
const rain = (n, seed = 1, k = "6", y0 = 0, y1 = TH) => (c) => { const r = c.rng(seed); for (let i = 0; i < n; i++) { const x = Math.floor(r() * (TW + 40)) - 20, y = y0 + Math.floor(r() * (y1 - y0)), l = 4 + Math.floor(r() * 6); c.line(x, y, x + Math.round(l / 3), y + l, k) } }
// Snow falling: single flakes drifting in slanted pairs.
const snowfall = (n, seed = 1) => (c) => { const r = c.rng(seed); for (let i = 0; i < n; i++) { const x = Math.floor(r() * TW), y = Math.floor(r() * TH); c.px(x, y, "5"); if (r() < 0.4) c.px(x + 1, y + 1, "4") } }
// Long grass bending in the wind: strokes leaning right, light tips, painted on the given ground keys.
const windGrass = (y0, y1, n, seed = 1, on = "dC^cAa") => (c) => {
  const r = c.rng(seed)
  for (let i = 0; i < n; i++) {
    const x = Math.floor(r() * TW), y = y0 + Math.floor(r() * (y1 - y0)); if (!c.is(x, y, on)) continue
    const l = 1 + Math.floor((y - y0) / (y1 - y0) * 4), k = c.key(x, y)
    const lk = { d: "Y", C: "d", "^": "C", c: "C", A: "c", a: "A" }[k] || k
    c.line(x, y, x + Math.ceil(l / 2), y - l, lk)
  }
}
// Pale lights over dark water (corpse candles): a dot with a soft ring, reflected below.
const wisp = (x, y) => (c) => { c.px(x, y, "?"); c.px(x - 1, y, "!"); c.px(x + 1, y, "!"); c.px(x, y - 1, "!"); c.px(x, y + 3, "!"); c.px(x, y + 5, "3") }
// Stone dome, half lit: optionally broken (a bite out of its right side).
const dome = (cx, cy, r, keys = "lmM0", broken = false) => (c) => {
  const [L, F, J, D] = keys
  for (let y = cy - r; y <= cy; y++) for (let x = cx - r; x <= cx + r; x++) {
    const dx = x - cx, dy = y - cy; if (dx * dx + dy * dy > r * r) continue
    if (broken && dx > r * 0.15 && dy < -r * 0.25 + (dx % 3)) continue
    const v = (dx + dy * 0.6) / r + B8(x, y) * 0.4; c.px(x, y, v < -0.55 ? L : v < 0.15 ? F : v < 0.6 ? J : D)
  }
}
// Arch row: piers with round arches between; the openings show what is behind (drawn with `hole`).
const arches = (x0, y, n, span, h, pier = 3, keys = "lmM0", hole = "0") => (c) => {
  const [L, F, J, D] = keys, w = n * (span + pier) + pier
  c.rect(x0, y, w, h, F); c.hline(x0, y, w, L)
  for (let i = 0; i < n; i++) {
    const ax = x0 + pier + i * (span + pier), r = span / 2, top = y + 4 + Math.ceil(r)
    c.rect(ax, top, span, y + h - top, hole)
    c.ellipse(ax + r - 0.5, top, r - 0.5, r - 0.5, hole)
    c.hline(ax - 1, top + 1, 1, J); c.vline(ax, top, y + h - top, hole)
    c.vline(ax + span, top, y + h - top, J)
  }
  for (let r = 3; r < 6; r += 3) c.hline(x0, y + r, w, J)
}
// Cast shadow layer, shorthand.
const shadowPoly = (pts, steps = 1) => layer("sh", { shade: steps }, poly(pts, "k"))
// Trees along a crest line: small round crowns standing on top(x), lit on the left.
const crestTrees = (top, x0, x1, lit, dark, seed = 1) => (c) => { const r = c.rng(seed); for (let x = x0; x < x1; x += 2 + Math.floor(r() * 3)) { const rad = 2 + Math.floor(r() * 3), cy = top(x) - rad + 1; c.circ(x, cy, rad, dark); c.circ(x - 1, cy - 1, rad - 1, lit); c.vline(x, cy, top(x) - cy + 2, dark) } }
const crag = (x0, x1, top, foot, keys = "lmM0", seed = 1, grass = true) => (c) => {
  const [L, F, J, D] = keys, r = c.rng(seed)
  for (let x = x0; x < x1; x++) { const t = top(x), b = foot(x); if (b <= t) continue; for (let y = t; y < b; y++) { const v = (x + Math.floor(y / 11) * 3) % 13 < 7 ? L : F; c.px(x, y, (y - t) / (b - t) + B8(x, y) * 0.3 > 0.8 ? J : v) } if (grass) { c.px(x, t, "c"); c.px(x, t - 1, "A") } }
  for (let x = x0 + 3; x < x1 - 2; x += 3 + Math.floor(r() * 6)) { const t = top(x), b = foot(x); if (b - t < 10) continue; const y0 = t + 3 + Math.floor(r() * 5), l = Math.floor((b - t) * (0.4 + r() * 0.5)); for (let y = y0; y < y0 + l && y < b - 1; y++) c.px(x + (y % 9 < 4 ? 0 : 1), y, J) }   // fissures
  for (let x = x0; x < x1; x++) { const t = top(x), b = foot(x); for (let y = t + 9; y < b - 3; y += 11) if ((x + y) % 7 < 4) { c.px(x, y, J); if (grass && (x + y) % 7 === 0) c.px(x, y - 1, "c") } }  // ledges, a tuft here and there
  for (let x = x0; x < x1; x++) c.px(x, foot(x) - 1, D)
}

// ------------------------------------------------------------------ base terrains
// Plain: the downs of Rohan under a wide sky, grass waving in long swaths, the White Mountains far in the south.
terrain("plaine",
  sky(TW, 90), stamp("_cloud_a", 30, 10), stamp("_cloud_a", 196, 4), stamp("_cloud_b", 130, 28), stamp("_cloud_far", 262, 44), stamp("_cloud_far", 84, 50),
  massif(84, [[30, 50, 60, 1], [96, 58, 44, 1], [150, 64, 36, 1], [236, 52, 64, 1], [306, 60, 40, 1]], "543==", { seed: 3, snow: 0.3, gully: false }),
  hills(80, 3, "6", 7, 100, TW), treeline(84, 1, "%", "&", 5, TW, 100),
  flankShade((x) => Math.round(86 + 6 * Math.sin(x / 41) + 3 * Math.sin(x / 17)), 0, TW, "dC^c", (x) => 86 + 6 * Math.sin(x / 41)),
  flankShade((x) => Math.round(100 + 7 * Math.sin((x + 90) / 53) + 2 * Math.sin(x / 13)), 0, TW, "dC^c", (x) => 100 + 7 * Math.sin((x + 90) / 53)),
  // the wind combing the grass: light swaths drifting east
  layer("swath", { light: true, density: 0.5 }, (c) => { for (let i = 0; i < 7; i++) { const x = 10 + i * 50, y = 110 + (i % 3) * 8; c.poly([x - 30, y + 2, x + 10, y - 2, x + 34, y - 1, x - 6, y + 3], "k") } }),
  windGrass(112, 144, 260, 4),
  // a road of the Riddermark, worn into the turf, and a stone of the old kings by it
  layer("road", (c) => { for (let y = 92; y < 144; y++) { const t = (y - 92) / 52, cx = 160 + Math.sin(t * 2.6) * 26, w = 2 + t * t * 26; c.hline(Math.round(cx - w / 2), y, Math.round(w), "q"); if (w > 6) { c.px(Math.round(cx - w / 4), y, "T"); c.px(Math.round(cx + w / 4), y, "T") } } }),
  rect(214, 104, 4, 10, "m"), vline(214, 104, 10, "l"), vline(217, 105, 9, "M"), hline(214, 104, 4, "l"), shadowPoly([217, 113, 226, 113, 228, 115, 219, 115]),
  vgrad(0, 132, TW, 12, "cA", 1, 2), windGrass(130, 144, 300, 9, "cA"),
)

// Ford: the stony Fords of Isen, the river split by an eyot, a gravel causeway, the last Misty Mountains behind.
terrain("gue",
  sky(TW, 80), stamp("_cloud_a", 214, 8), stamp("_cloud_b", 40, 16), stamp("_cloud_far", 140, 40),
  massif(78, [[60, 30, 60, 0.9], [130, 46, 40, 1], [200, 40, 46], [280, 54, 50, 1]], "54=3=", { seed: 5, snow: 0.3, gully: true }),
  hills(76, 3, "6", 12, 100, TW), treeline(82, 2, "%", "&", 14, TW, 96),
  flankShade((x) => Math.round(86 + 2 * Math.sin(x / 31)), 0, TW, "dC^c"),
  ...water(96, 26, 16),
  // the ford: a pale gravel bar slanting across, the eyot in the middle with its grass, white water at the stones
  poly([96, 96, 128, 96, 238, 122, 196, 122], "Q"), poly([98, 96, 104, 96, 206, 122, 198, 122], "q"),
  (c) => { for (let i = 0; i < 26; i++) { const t = i / 26, x = Math.round(110 + t * 108 + (i % 3) * 4), y = Math.round(97 + t * 24); c.hline(x, y, 2 + (i % 2), i % 4 ? "m" : "l"); c.px(x + 2, y, "q") } },
  ellipse(160, 108, 22, 5, "Q"), ellipse(158, 106, 19, 3, "c"), hline(144, 104, 24, "C"), scatter("_reed", 142, 103, 34, 4, 14, { seed: 21 }),
  (c) => { for (const [x, y] of [[112, 100], [126, 112], [190, 101], [214, 116], [96, 116], [236, 106], [70, 110], [262, 112]]) { c.ellipse(x, y, 3, 1, "M"); c.hline(x - 2, y - 1, 3, "m"); c.hline(x + 3, y, 4, "5"); c.hline(x - 6, y + 1, 3, "4") } },
  line(170, 86, 116, 96, "T"), line(240, 122, 276, 144, "T"), line(241, 122, 280, 144, "q"),
  // the near bank: shingle and grass, reeds along the water
  poly([0, 122, TW, 122, TW, 144, 0, 144], "c"), poly([0, 122, TW, 122, TW, 125, 0, 126], "q"), hline(0, 122, TW, "Q"),
  (c) => { const r = c.rng(31); for (let i = 0; i < 40; i++) { const x = Math.floor(r() * TW), y = 123 + Math.floor(r() * 3); c.hline(x, y, 2, "m"); c.px(x, y + 1, "M") } },
  scatter("_reed", 0, 120, TW, 6, 60, { seed: 3 }), scatter("_reed", 0, 93, TW, 3, 16, { seed: 5 }),
  vgrad(0, 132, TW, 12, "cAa", 1, 2), windGrass(130, 144, 160, 19, "cAa"), bigTree(16, 112, 15), bigTree(304, 118, 12),
)
// Forest: deep in Fangorn, old trunks with root flares and grey beards of lichen, mist between, a shaft of light.
const trunk = (x, w, top, foot, keys = "xWw", seed = 1) => (c) => {
  const [L, F, D] = keys, r = c.rng(seed), lean = (y) => Math.round(Math.sin(y / 17 + seed) * 2 + Math.sin(y / 6 + seed * 3) * 0.7)
  for (let y = top; y < foot; y++) {
    const fl = Math.max(0, (y - (foot - 22)) / 22), ww = Math.round(w + fl * fl * w * 1.8), x0 = x - Math.round(fl * fl * w * 0.9) + lean(y)
    for (let i = 0; i < ww; i++) { const t = i / ww + B8(x0 + i, y) * 0.12; c.px(x0 + i, y, t < 0.18 ? L : t < 0.72 ? F : D) }
  }
  // bark: furrows of uneven length following the lean, knots
  for (let k = 0; k < w * 2; k++) { const bx = 2 + Math.floor(r() * (w - 3)), y0 = top + Math.floor(r() * (foot - top - 20)), l = 6 + Math.floor(r() * 18); for (let y = y0; y < y0 + l; y++) c.px(x + bx + lean(y), y, bx < w * 0.2 ? F : D) }
  for (let k = 0; k < 2; k++) { const ky = top + 20 + Math.floor(r() * 60), kx = x + 3 + Math.floor(r() * (w - 6)) + lean(ky); c.ellipse(kx, ky, 2, 3, D); c.px(kx - 1, ky - 1, F) }
  // roots crawling out
  for (const s of [-1, 1]) { const rx = x + (s < 0 ? 0 : w) + lean(foot), len = w; c.line(rx, foot - 4, rx + s * len, foot + 2, F, 3); c.line(rx, foot - 5, rx + s * len, foot + 1, s < 0 ? L : D) }
}
const bough = (x0, y0, x1, y1, w = 5, keys = "xWw") => (c) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let i = 0; i <= n; i++) { const t = i / n, x = Math.round(x0 + (x1 - x0) * t), y = Math.round(y0 + (y1 - y0) * t + Math.sin(t * 6) * 2), ww = Math.max(1, Math.round(w * (1 - t * 0.8))); c.vline(x, y - ww + 1, ww, keys[1]); c.px(x, y - ww + 1, keys[0]); c.px(x, y, keys[2]) } }
const beard = (x, y, len, seed = 1) => (c) => { const r = c.rng(seed); for (let i = 0; i < 6; i++) { const xx = x + i * 2 - 5 + Math.floor(r() * 2), yy = y + Math.floor(r() * 3), l = 3 + Math.floor(r() * len); c.vline(xx, yy, l, i % 2 ? "6" : "%"); c.px(xx, yy, "4"); c.px(xx, yy + l, "&") } }
const canopy = (y, n, seed = 1) => (c) => { const r = c.rng(seed); for (let i = 0; i < n; i++) { const x = Math.floor(r() * (TW + 20)) - 10, cy = y + Math.floor(r() * 14), rad = 8 + Math.floor(r() * 10); c.circ(x, cy, rad, "a"); c.circ(x - 2, cy - 2, rad - 4, "A"); if (rad > 13) c.circ(x - 4, cy - 4, rad - 10, "c") } }
terrain("foret",
  vgrad(0, 0, TW, TH, "6%&a", 1, 2),
  // far trunks in the mist, then nearer, darker ones
  (c) => { const r = c.rng(4); for (let x = 2; x < TW; x += 6 + Math.floor(r() * 24)) { const w = 1 + Math.floor(r() * 4), lx = Math.round(r() * 4 - 2); c.line(x, 0, x + lx, 118, "%", w); c.line(x + w, 0, x + w + lx, 118, "&") } },
  layer("mist", { light: true, density: 0.35 }, rect(0, 80, TW, 32, "k")),
  (c) => { const r = c.rng(7); for (let x = 12; x < TW; x += 26 + Math.floor(r() * 20)) { const w = 6 + Math.floor(r() * 4); c.rect(x, 0, w, 120, "&"); c.vline(x, 0, 120, "%"); c.rect(x + w - 2, 0, 2, 120, "a") } },
  canopy(-6, 26, 3),
  // the shaft of light falling into a glade
  layer("shaft", { light: true, density: 0.35 }, poly([138, 0, 176, 0, 240, 126, 172, 126], "k")),
  layer("shaft2", { light: true, density: 0.3 }, poly([150, 0, 164, 0, 222, 126, 198, 126], "k")),
  // the forest floor: moss, the lit glade, ferns
  vgrad(0, 114, TW, 30, "cAa", 1, 2), ellipse(208, 122, 38, 5, "C"), ellipse(206, 121, 26, 3, "d"),
  scatter("_tuft", 0, 116, TW, 28, 60, { seed: 7, on: "cAC" }),
  trunk(30, 24, 0, 130, "xWw", 1), trunk(112, 14, 0, 122, "WWw", 2), trunk(258, 28, 0, 134, "xWw", 3), trunk(306, 12, 0, 120, "WWw", 4),
  // great boughs and their grey beards
  bough(42, 34, -4, 14, 7), bough(262, 30, 320, 6, 7), bough(122, 44, 158, 26, 4, "WWw"), bough(262, 50, 222, 32, 5),
  beard(16, 22, 16, 1), beard(146, 30, 10, 2), beard(232, 38, 12, 3), beard(298, 14, 18, 4), beard(70, 10, 20, 5), beard(190, 6, 14, 6), beard(120, 4, 12, 7),
  canopy(-14, 10, 9),
  // a fallen log in front, furred with moss
  line(64, 139, 170, 133, "W", 6), line(64, 137, 170, 131, "x", 2), line(64, 141, 170, 135, "w", 2), ellipse(63, 139, 3, 3, "X"), ellipse(63, 139, 1, 1, "x"), (c) => { for (let x = 72; x < 160; x += 3) c.px(x, 136 - Math.round((x - 64) * 0.06) - (x % 2), "c") },
  vgrad(0, 140, TW, 4, "Aa", 1, 2),
)
// Fortress: a stronghold on a spur of rock, the curtain following the crest, the keep on the highest knob.
const lerpPts = (pts) => (x) => { for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; if (x <= x1) { const t = (x - x0) / (x1 - x0), s = t * t * (3 - 2 * t); return y0 + (y1 - y0) * s } } return pts[pts.length - 1][1] }
// Bedding planes and joints in a rock face: a bedding line every few rows (bent with the rock), joints between.
const strata = (f, x0, x1, y1, every = 9, steps = 1) => (c) => c.shade((x, y) => {
  if (x < x0 || x >= x1 || y <= f(x) + 2 || y >= y1) return false
  const yb = y + Math.round(Math.sin(x / 13) * 2 + Math.sin(x / 5) * 0.6), row = Math.floor(yb / every)
  if (yb % every === 0) return ((x + row * 31) % 29) < 15                                        // bedding planes, broken
  return row % 2 === 0 && ((x + row * 7) % 19 === 0) && (yb % every) < every - 2                 // joints in alternate beds
}, steps)
const SPUR = lerpPts([[0, 118], [60, 112], [96, 98], [122, 72], [140, 56], [160, 50], [196, 52], [214, 58], [222, 92], [232, 118], [320, 122]])
const spurJ = (x) => Math.round(SPUR(x) + Math.sin(x / 4) * 1.2 + Math.sin(x / 9.3))
terrain("forteresse",
  sky(TW, 70), stamp("_cloud_a", 26, 6), stamp("_cloud_b", 250, 14),
  massif(84, [[40, 20, 70], [150, 30, 50], [256, 14, 70, 0.9]], "54=3=", { seed: 8, snow: 0.35 }),
  massif(100, [[0, 50, 60, 1], [310, 48, 70, 1]], "4366%", { seed: 9, snow: 0.2 }),
  hills(96, 3, "6", 4, 120, TW), treeline(104, 2, "%", "&", 6, TW, 130),
  // the spur: lit on its western climb, the sheer eastern face in shade, bedding planes and joints
  crag(40, 250, spurJ, () => 124, "lmM0", 7), layer("eastface", { shade: true }, poly([196, 40, 222, 40, 240, 124, 206, 124, 200, 80], "k")),
  clip((x, y) => y > 104 + Math.sin(x / 11) * 3 + (x > 120 && x < 230 ? 12 : 0), flankShade(spurJ, 0, TW, "Cc^A", SPUR)),
  // the road from the valley up the shoulder of the spur to the gate
  layer("road", (c) => { const pts = [[60, 144], [80, 124], [56, 114], [98, 100], [118, 76], [134, 58]]; for (let i = 0; i < pts.length - 1; i++) c.line(...pts[i], ...pts[i + 1], "q", 2); for (let i = 0; i < pts.length - 1; i++) c.line(pts[i][0], pts[i][1] - 1, pts[i + 1][0], pts[i + 1][1] - 1, "Q") }),
  // the curtain on the crest, towers at the corners, halls inside, the keep
  rect(150, 30, 20, 14, "m"), poly([148, 30, 160, 21, 172, 30], "M"), poly([148, 30, 160, 21, 160, 30], "m"), hline(150, 34, 20, "M"),
  rect(186, 32, 18, 12, "m"), poly([184, 32, 195, 24, 206, 32], "M"), poly([184, 32, 195, 24, 195, 32], "m"),
  ashlar(136, 212, 42, 12, "lmM0"), layer("wallshade", { shade: true }, poly([136, 54, 212, 54, 214, 56, 138, 56], "k")),
  towerAt(130, 30, 10, 26), towerAt(206, 32, 9, 24), towerAt(156, 36, 6, 8),
  towerAt(170, 14, 14, 30, "lmM0"), rect(174, 6, 7, 8, "m"), vline(174, 6, 8, "l"), vline(180, 6, 8, "M"), poly([173, 6, 177, 1, 182, 6], "R"), poly([173, 6, 177, 1, 177, 6], "s"),
  vline(177, -6, 7, "w"), poly([178, -6, 186, -4, 178, -2], "s"), poly([178, -6, 186, -4, 178, -4], "S"),
  rect(131, 46, 6, 10, "w"), ellipse(133.5, 46, 2.5, 2, "w"), hline(130, 56, 8, "0"),
  // torn banners on the corner towers
  vline(134, 18, 8, "w"), poly([135, 18, 140, 19, 135, 21], "s"), vline(210, 20, 8, "w"), poly([211, 20, 216, 21, 211, 23], "s"),
  layer("spurshade", { shade: true, density: 0.5 }, poly([214, 58, 260, 124, 232, 124, 222, 92], "k")),
  treeline(130, 3, "A", "a", 33, TW, 144), bigTree(18, 116, 16), bigTree(300, 118, 15),
)
// River: the wide Anduin between grey cliffs, the west headland in shade, the east one lit, a tall eyot far down
// with the mist of the falls behind it, a rocky shore in front.
terrain("riviere",
  sky(TW, 74), stamp("_cloud_a", 130, 6), stamp("_cloud_far", 30, 30), stamp("_cloud_far", 250, 36),
  hills(62, 4, "3", 40, 100, TW), hills(70, 3, "6", 41, 100, TW),
  ...water(74, 70, 43, "~PpZz"),
  // the eyot: a sheer pinnacle of rock with trees on its crown, spray rising beyond (the falls)
  layer("spray", { light: true, density: 0.5 }, ellipse(180, 72, 34, 5, "k")),
  poly([170, 76, 172, 44, 176, 38, 184, 38, 188, 46, 190, 76], "M"), poly([170, 76, 172, 44, 176, 38, 179, 38, 178, 76], "m"), poly([172, 44, 176, 38, 177, 38, 174, 76, 171, 76], "l"),
  (c) => { for (const [x, r] of [[175, 3], [181, 3], [186, 2]]) { c.circ(x, 37, r, "&"); c.circ(x - 1, 36, r - 1, "%") } },
  hline(164, 76, 32, "5"), layer("eyotrefl", { shade: true, density: 0.5 }, rect(171, 77, 18, 12, "k")),
  // the headlands: reflections first, then the cliffs, trees along their crowns
  layer("refl", { shade: true, density: 0.5 }, poly([0, 96, 134, 84, 120, 104, 0, 122], "k"), poly([226, 86, 320, 92, 320, 112, 236, 98], "k")),
  crag(0, 136, (x) => Math.round(30 + x * 0.32 + Math.sin(x / 7) * 2 + (x > 110 ? (x - 110) * 1.4 : 0)), (x) => Math.round(98 - x * 0.1), "MM0z", 3),
  crag(222, TW, (x) => Math.round(46 + (TW - x) * 0.14 + Math.sin(x / 6) * 2 + (x < 244 ? (244 - x) * 1.3 : 0)), (x) => Math.round(88 + (x - 222) * 0.05), "lmM0", 4),
  crestTrees((x) => Math.round(30 + x * 0.32 + (x > 110 ? (x - 110) * 1.4 : 0)), 0, 124, "A", "a", 45),
  crestTrees((x) => Math.round(46 + (TW - x) * 0.14 + (x < 244 ? (244 - x) * 1.3 : 0)), 236, TW + 4, "c", "A", 46),
  // white water at the cliff feet, the current in long lines
  (c) => { for (let x = 0; x < 136; x += 3) c.hline(x, Math.round(98 - x * 0.1), 2, "4"); for (let x = 222; x < TW; x += 3) c.hline(x, Math.round(88 + (x - 222) * 0.05), 2, "5") },
  // the near shore: boulders lit on the left, reeds, dark turf
  poly([0, 128, 60, 124, 120, 132, 170, 144, 0, 144], "T"), poly([0, 128, 60, 124, 120, 132, 116, 134, 58, 127, 0, 131], "q"),
  (c) => { for (const [x, y, r] of [[30, 130, 7], [64, 134, 5], [96, 138, 6], [260, 140, 8], [292, 136, 6]]) { c.ellipse(x, y, r, r * 0.6, "M"); c.ellipse(x - 1, y - 1, r - 2, r * 0.4, "m"); c.px(x - r + 2, y - 2, "l"); c.hline(x - r + 1, y + Math.round(r * 0.6), r * 2, "0") } },
  poly([230, 144, 250, 136, 320, 130, 320, 144], "T"), scatter("_reed", 110, 126, 60, 14, 20, { seed: 9 }), scatter("_reed", 236, 128, 84, 10, 20, { seed: 10 }),
  vgrad(0, 140, TW, 4, "Ta", 1, 2),
)
// Marshes: the Dead Marshes in the dusk, black pools in grey-green mire, rotting tussocks, pale candles over the water.
const pool = (x, y, rx, ry, t) => (c) => { c.ellipse(x, y, rx, ry, t < 0.35 ? "Z" : "z"); c.ellipse(x - 1, y - 1, rx - 2, Math.max(1, ry - 1), t < 0.35 ? "Z" : "z"); c.hline(x - rx + 3, y - ry, Math.round(rx * 1.2), "6"); c.hline(x - 2, y + ry, Math.round(rx * 0.6), "<") }
const tussock = (x, y, s = 1) => (c) => { c.ellipse(x, y, 3 * s, s, "<"); for (let i = -3 * s; i <= 3 * s; i += 2) { const h = 2 + s * 2 + (i % 3); c.line(x + i, y, x + i + Math.sign(i), y - h, i < 0 ? "*" : ">") } }
terrain("marais",
  sky(TW, 72, "U+2=6"), stamp("_cloud_far", 60, 26, { swap: { 4: "6", 3: "%" } }), stamp("_cloud_far", 220, 36, { swap: { 4: "6", 3: "%" } }),
  // the mountains of Shadow, a low black line far to the east, a sickly gleam above
  (c) => { for (let x = 0; x < TW; x++) { const t = Math.round(60 - 4 * Math.abs(Math.sin(x / 37)) - 2 * Math.sin(x / 11)); c.vline(x, t, 12, "U"); if (Math.sin(x / 37) > 0 && (x % 37) < 18) c.px(x, t, "v") } },
  vgrad(0, 68, TW, 76, "%>&<", 1, 2),
  // pools: black water with a cold sheen on their far edge, larger towards us
  (c) => { const r = c.rng(5); for (let i = 0; i < 26; i++) { const y = 72 + Math.floor(r() * r() * 64), x = Math.floor(r() * TW), t = (y - 68) / 76; pool(x, y, 8 + Math.floor(r() * 12 + t * 30), 1 + Math.floor(t * 6), t)(c) } },
  layer("mist", { light: true, density: 0.3 }, rect(0, 70, TW, 8, "k"), poly([0, 92, 140, 88, 320, 94, 320, 98, 0, 97], "k")),
  (c) => { const r = c.rng(9); for (let i = 0; i < 46; i++) { const y = 74 + Math.floor(r() * 64), x = Math.floor(r() * TW); if (c.is(x, y, "zZ")) continue; tussock(x, y, y > 112 ? 2 : 1)(c) } },
  // drowned stumps, a dead tree
  (c) => { for (const [x, y, h] of [[48, 116, 18], [214, 102, 10], [284, 124, 26], [128, 92, 7]]) { c.vline(x, y - h, h, "w"); c.vline(x + 1, y - h + 2, h - 2, "W"); c.line(x, y - h + 4, x - 4, y - h, "w"); c.line(x + 1, y - h + 7, x + 5, y - h + 3, "w"); c.hline(x - 3, y, 8, "6") } },
  (c) => { for (const [x, y] of [[96, 108], [176, 90], [238, 120], [34, 96], [154, 130], [292, 100], [70, 84]]) wisp(x, y)(c) },
  glow("?!", { r: 8, strength: 0.7, color: "#bfe6ff" }),
  vgrad(0, 134, TW, 10, "<a", 1, 2), (c) => { const r = c.rng(17); for (let x = 4; x < TW; x += 10 + Math.floor(r() * 18)) tussock(x, 139 + Math.floor(r() * 4), 2)(c) },
)

// Ruins: Osgiliath across the Anduin, roofless halls and broken domes, the great bridge fallen in the middle,
// the mountains of Shadow dark beyond, rubble and a broken arch on the near bank.
// A ruined hall: a lit west face and a shaded side, a broken jagged top, rows of arched windows open to the sky.
const ruin = (x, y, w, h, keys = "lmM0", hole = "0", seed = 1) => (c) => {
  const [L, F, J, D] = keys, r = c.rng(seed), side = Math.max(2, Math.round(w * 0.25))
  const top = []; let t = 0; for (let i = 0; i < w + side; i++) { if (i % 3 === 0) t = Math.max(0, Math.min(h * 0.45, t + Math.floor(r() * 7) - 3)); top.push(Math.round(t)) }
  for (let i = 0; i < w + side; i++) { const yy = y + top[i]; c.vline(x + i, yy, h - top[i], i < w ? (i === 0 ? L : F) : J); if (i < w) c.px(x + i, yy, L) }
  for (let row = 0; row < 3; row++) for (let i = 3; i < w - 3; i += 6) { const wy = y + 6 + row * 10; if (wy + 6 > y + h || wy < y + top[i] + 2) continue; c.rect(x + i, wy + 1, 3, 5, hole); c.hline(x + i, wy, 3, hole); c.px(x + i, wy, J); c.px(x + i + 2, wy, J) }
  for (let row = 1; row < h / 5; row++) { const yy = y + row * 5; for (let i = 0; i < w; i++) if (yy > y + top[i] + 1 && (i + row * 3) % 7 < 5) c.px(x + i, yy, J) }
}
terrain("ruines",
  sky(TW, 78, "+2=3~4"), stamp("_cloud_a", 30, 10, { swap: { 5: "4", 4: "3" } }), stamp("_cloud_b", 230, 20, { swap: { 5: "4", 4: "3" } }),
  // the mountains of Shadow far off, a column of smoke from the east bank
  (c) => { for (let x = 0; x < TW; x++) { const t = Math.round(58 - 6 * Math.abs(Math.sin(x / 31)) - 2 * Math.sin(x / 9)); c.vline(x, t, 30, "&"); c.px(x, t, "%") } },
  smoke(254, 64, 12),
  // the far bank: ruined halls, a broken dome, a tower stump, in the haze
  ruin(10, 62, 26, 30, "4m6%", "&", 1), ruin(44, 56, 18, 36, "4m6%", "&", 2), dome(98, 66, 14, "4m6%", true), ruin(82, 66, 32, 26, "4m6%", "&", 3),
  ruin(130, 60, 14, 32, "4m6%", "&", 4), ruin(200, 64, 30, 28, "4m6%", "&", 5), dome(256, 70, 11, "4m6%", false), ruin(242, 70, 28, 22, "4m6%", "&", 6), ruin(286, 58, 16, 34, "4m6%", "&", 7),
  rect(0, 88, TW, 8, "6"), hline(0, 88, TW, "m"),
  ...water(96, 26, 21),
  // the bridge: arches on piers, the middle spans fallen, their stones heaped in the current
  layer("bridgerefl", { shade: true, density: 0.5 }, rect(0, 104, 120, 8, "k"), rect(196, 104, 124, 8, "k")),
  arches(-8, 86, 6, 12, 5, 5, "lmM0", "z"), arches(206, 86, 6, 12, 5, 5, "lmM0", "z"),
  rect(0, 100, 124, 4, "M"), rect(202, 100, 118, 4, "M"),
  (c) => { for (const [x, w, s] of [[122, 12, 1], [194, 12, -1]]) for (let i = 0; i < w; i++) { const xx = s > 0 ? x + i : x + w - 1 - i, t = Math.floor(i / 2) * 2 + (i % 4 === 1 ? 1 : 0), yy = 86 + t; c.vline(xx, yy, 18 - t, i < 2 ? "M" : "m"); c.px(xx, yy, "l"); if ((yy + 1) % 3 === 0) c.px(xx, yy + 2, "M") } },
  (c) => { for (const [x, y, w] of [[140, 104, 10], [160, 106, 8], [176, 103, 9], [150, 110, 6]]) { c.rect(x, y, w, 3, "m"); c.hline(x, y, w, "l"); c.hline(x + w, y + 1, 4, "5"); c.hline(x - 2, y + 3, w + 2, "Z") } },
  // the near bank: rubble, a fallen column, a broken arch standing, weeds in the joints
  poly([0, 120, TW, 116, TW, 144, 0, 144], "T"), poly([0, 120, TW, 116, TW, 119, 0, 123], "q"),
  (c) => { const r = c.rng(23); for (let i = 0; i < 38; i++) { const x = Math.floor(r() * TW), y = 122 + Math.floor(r() * 18), w = 3 + Math.floor(r() * 6), h = 2 + Math.floor(r() * 3); c.rect(x, y, w, h, "M"); c.hline(x, y, w, "m"); c.px(x, y, "l"); c.hline(x + 1, y + h, w, "t") } },
  // a fallen column: the shaft lies in drums, fluted, the capital rolled aside
  (c) => { for (let x = 168; x < 226; x++) { const brk = (x - 168) % 14 === 13; for (let y = 124; y < 134; y++) { const v = y - 124; c.px(x, y, brk ? "M" : v < 2 ? "l" : v < 6 ? ((x + v) % 3 === 0 && v > 2 ? "M" : "m") : v < 9 ? "M" : "0") } } c.ellipse(226, 129, 2, 5, "M"); c.ellipse(226, 129, 1, 3, "0") },
  rect(236, 124, 14, 9, "m"), hline(234, 123, 18, "l"), hline(234, 124, 18, "m"), rect(236, 130, 14, 3, "M"), shadowPoly([226, 134, 254, 134, 260, 136, 230, 136]),
  // the standing arch on the left, its keystone gone
  rect(18, 70, 10, 66, "m"), vline(18, 70, 66, "l"), vline(27, 70, 66, "M"), rect(70, 84, 10, 52, "M"), vline(70, 84, 52, "m"), vline(79, 84, 52, "0"),
  (c) => { for (let a = 0; a <= 12; a++) { const t = Math.PI * (1 - a / 12) * 0.62, x = Math.round(49 + Math.cos(t) * 26), y = Math.round(84 - Math.sin(t) * 22); c.rect(x - 3, y - 4, 7, 7, "m"); c.px(x - 3, y - 4, "l"); c.hline(x - 3, y + 2, 7, "M") } },
  (c) => { for (let y = 74; y < 136; y += 4) { c.hline(18, y, 10, "M"); c.hline(70, y + 2, 10, "0") } },
  layer("archshadow", { shade: true }, poly([28, 136, 46, 136, 54, 140, 30, 140], "k"), poly([80, 136, 96, 136, 104, 140, 82, 140], "k")),
  scatter("_tuft", 0, 124, TW, 18, 50, { seed: 25, on: "T" }), vgrad(0, 140, TW, 4, "ta", 1, 2),
)
// Village: Edoras on its green hill under the White Mountains: a dike and a thorn fence, halls stepping up,
// the golden roof of the king's hall at the top, the stream at the foot, barrows white with flowers by the road.
// A long hall seen from the side: timber wall, a steep thatched roof with the gable end to the west (lit), crossed
// gable beams. keys: roof lit, roof, roof shade, wall.
const hall = (x, y, w, h, rh, roof = "YyO", gold = false) => (c) => {
  const [RL, R, RS] = roof
  c.rect(x, y, w, h, "x"); c.vline(x, y, h, "X"); for (let i = x + 3; i < x + w; i += 4) c.vline(i, y, h, "W"); c.hline(x, y + h - 1, w, "w")
  c.rect(x + Math.floor(w / 2) - 1, y + h - 4, 3, 4, "w")
  c.poly([x - 2, y + 1, x + rh - 1, y - rh, x + w - rh + 1, y - rh, x + w + 2, y + 1], R)
  for (let i = x + 1; i < x + w; i += 3) c.line(i, y, i + (i < x + w / 2 ? 1 : -1), y - rh + 1, RS)
  c.poly([x - 2, y + 1, x + rh - 1, y - rh, x + rh - 1, y + 1], RL); c.hline(x + rh - 1, y - rh, w - 2 * rh + 2, RL)
  c.line(x + rh - 3, y - rh - 2, x + rh + 1, y - rh + 2, "W"); c.line(x + rh + 1, y - rh - 2, x + rh - 3, y - rh + 2, "W")
  if (gold) { for (let i = x + rh; i < x + w - rh; i += 5) c.px(i, y - rh + 1, "K"); c.px(x + rh - 1, y - rh - 1, "K") }
}
terrain("village",
  sky(TW, 80), stamp("_cloud_a", 220, 4), stamp("_cloud_far", 40, 22),
  massif(84, [[30, 10, 70, 0.9], [120, 22, 50], [196, 4, 60, 0.9], [286, 16, 70]], "54=3=", { seed: 12, snow: 0.45 }),
  massif(96, [[60, 54, 60, 1], [270, 50, 70, 1]], "4366%", { seed: 13, snow: 0.15 }),
  hills(90, 3, "6", 60, 110, TW), treeline(96, 2, "%", "&", 62, TW, 120),
  // the hill, its dike and fence, the halls
  flankShade((x) => Math.round(plateau(164, 54, 26, 112, 60)(x) + Math.sin(x / 6)), 0, TW, "dC^c", plateau(164, 54, 26, 112, 60)),
  (c) => { const f = plateau(164, 54, 26, 112, 60); for (let x = 70; x < 262; x++) { const y = Math.round(f(x) + 18 + Math.abs(x - 164) * 0.04); c.px(x, y, "A"); c.px(x, y + 1, "q"); if (x % 2 === 0) { c.vline(x, y - 4, 4, "W"); c.px(x, y - 5, "x") } } },
  hall(106, 82, 18, 5, 5), hall(132, 74, 14, 5, 5), hall(202, 80, 18, 5, 5), hall(220, 88, 14, 4, 4), hall(92, 92, 14, 4, 4), hall(180, 72, 14, 5, 5),
  hall(146, 46, 34, 7, 8, "NnB", true), glow("K", { r: 5, strength: 0.6 }),
  smoke(114, 76, 6), smoke(212, 74, 6), smoke(140, 68, 5),
  // the stair and the road down the hill, the gate in the fence
  layer("road", (c) => { c.line(160, 54, 162, 72, "m", 3); for (let y = 56; y < 72; y += 2) c.hline(158, y, 6, "l"); const pts = [[162, 72], [150, 86], [172, 98], [160, 112], [186, 144]]; for (let i = 0; i < pts.length - 1; i++) c.line(...pts[i], ...pts[i + 1], "q", 3); for (let i = 0; i < pts.length - 1; i++) c.line(pts[i][0] - 1, pts[i][1], pts[i + 1][0] - 1, pts[i + 1][1], "Q") }),
  // the stream crossing the meadow at the foot of the hill, a little bridge
  vgrad(0, 112, TW, 6, "Pp", 1, 2), (c) => { for (let x = 3; x < TW; x += 9) c.hline(x, 113 + (x % 3), 3, "4") }, hline(0, 112, TW, "c"),
  rect(170, 110, 18, 3, "x"), hline(170, 110, 18, "X"), hline(170, 113, 18, "w"),
  ...meadow(118, TW, 26, 64, 60),
  // the barrows along the road, white with evermind
  (c) => { for (const [x, y, rx] of [[60, 128, 18], [104, 134, 14], [250, 126, 20], [294, 136, 14]]) { for (let i = -rx; i <= rx; i++) { const h = Math.round(7 * Math.sqrt(1 - (i / rx) ** 2)); for (let j = 0; j < h; j++) { const v = i / rx + (h - j) / 14 + B8(x + i, y - j) * 0.3; c.px(x + i, y - j, v < -0.3 ? "d" : v < 0.35 ? "C" : "c") } } for (let i = -rx + 4; i < rx - 3; i += 4) c.px(x + i, y - Math.round(5 * Math.sqrt(1 - (i / rx) ** 2)) + (i % 3 === 0 ? 1 : 0), "5") } },
  layer("barrowshadow", { shade: true }, ellipse(70, 132, 16, 2, "k"), ellipse(262, 130, 18, 2, "k")),
  vgrad(0, 138, TW, 6, "cA", 1, 2), windGrass(130, 144, 120, 66, "cA"),
)
// Shadow lands: the ash plain of Gorgoroth under a sky of fumes lit red from beneath, black crags, glowing cracks,
// the Mountain far off with its red crown and its plume blown west.
const ashSky = (h) => vgrad(0, 0, TW, h, "u;;-:7", 1.1, 2)
// A black crag: a jagged silhouette, its east-facing edges and tops caught by the red glow of the fires beyond.
const blackCrag = (base, list, seed = 1, rim = ":") => (c) => {
  const f = peaks(base, list, seed, 1.4)
  for (let x = 0; x < TW; x++) { const y0 = f(x); if (y0 >= base || !list.some(([cx, , hw]) => Math.abs(x - cx) < hw)) continue; c.vline(x, y0, TH - y0, "u"); const d = f(x + 1) - y0; c.px(x, y0, d > 0 ? rim : "U"); if (d > 1) c.vline(x, y0 + 1, Math.min(d, 6), "-") }
  for (const [cx, top] of list) for (let y = top + 4; y < base; y += 3) { const xx = cx + Math.round(Math.sin(y / 3 + seed) * 2); if (c.is(xx, y, "u")) c.px(xx, y, "U") }   // ridge seams
}
terrain("ombre",
  ashSky(96),
  // clouds of fume in long bands, lit from below by the fires
  (c) => { for (const [x, y, w] of [[-20, 12, 180], [140, 24, 220], [20, 40, 170], [200, 52, 150]]) { c.ellipse(x + w / 2, y, w / 2, 4, ";"); c.ellipse(x + w / 2 + 6, y + 3, w / 2 - 14, 1, "-") } },
  // the Mountain's plume, leaning west, thickening as it rises into the cloud
  (c) => { for (let y = 52; y > 0; y--) { const t = (52 - y) / 52, cx = Math.round(236 - t * t * 90), w = Math.round(3 + t * 30); c.hline(cx - w, y, 2 * w, "u"); c.hline(cx - w, y, Math.max(1, Math.round(w * 0.3)), "U"); c.hline(cx + w - 2, y, 2, ";"); c.px(cx + w, y, "-") } },
  // the Mountain: a broken cone with a red crown, lava runs down its flank
  (c) => { const f = peaks(98, [[236, 50, 46, 0.75]], 4, 0.8); for (let x = 186; x < 290; x++) { const y0 = Math.min(98, f(x)); for (let y = y0; y < 98; y++) c.px(x, y, x < 236 + (y - 50) * 0.15 ? "U" : "u") } },
  hline(230, 51, 12, "D"), hline(232, 50, 8, "L"), line(239, 53, 252, 78, "D"), line(240, 54, 247, 66, "L"), line(232, 54, 220, 72, "D"),
  glow("DL", { r: 7, strength: 0.55 }),
  // far ridges of the Ash Mountains and the Mountains of Shadow, a dark line on the glow
  blackCrag(98, [[30, 72, 40], [90, 84, 30], [150, 80, 30], [310, 76, 30]], 3, "-"),
  // the ash plain: drifts of ash lit on their crests, cracks with fire seeping through
  vgrad(0, 96, TW, 48, "0Mt0", 1, 2),
  (c) => { const r = c.rng(8); for (let i = 0; i < 13; i++) { const x = Math.floor(r() * TW), y = 100 + Math.floor(r() * 40), w = 6 + Math.floor(r() * 10 + (y - 100) * 0.5); c.ellipse(x, y, w, 1 + Math.floor((y - 96) / 16), "M"); c.hline(x - w + 3, y - 1, w, "m"); c.hline(x - w / 2, y + 1 + Math.floor((y - 96) / 16), w, "t") } },
  (c) => { const r = c.rng(3); for (let i = 0; i < 14; i++) { let x = Math.floor(r() * TW), y = 100 + Math.floor(r() * 40); const n = 4 + Math.floor(r() * 8); for (let k = 0; k < n; k++) { const nx = x + 2 + Math.floor(r() * 4), ny = y + Math.floor(r() * 3) - 1; c.line(x, y, nx, ny, "k"); if (k % 3 === 1) { c.px(x, y, "D"); c.px(x + 1, y, "L") } x = nx; y = ny } } },
  glow("L", { r: 4, strength: 0.5, where: [0, 98, TW, 46] }),
  // black crags close by, their tops caught by the red glow
  blackCrag(110, [[16, 60, 26], [42, 70, 18], [300, 62, 28]], 5),
  blackCrag(TH + 4, [[-4, 104, 50], [36, 112, 26], [286, 108, 40], [320, 100, 30]], 7),
)
// Mountain pass: high on Caradhras, the path buried in snow between walls of dark rock, the storm blowing over.
terrain("montagne",
  sky(TW, 70, "1+2=3~"),
  massif(84, [[60, 8, 50], [160, 0, 50, 0.9], [262, 12, 56]], "54=3=", { seed: 14, snow: 0.6 }),
  // the saddle: a field of snow, wind-cut crests shadowed on their lee side
  vgrad(0, 80, TW, 64, "543", 1, 2),
  (c) => { for (const [x0, x1, y, a] of [[60, 240, 92, 3], [90, 300, 104, 4], [0, 200, 118, 5], [120, 320, 130, 4]]) for (let x = x0; x < x1; x++) { const yy = Math.round(y + Math.sin((x - x0) / (x1 - x0) * Math.PI * 1.5) * a); c.px(x, yy, "5"); c.px(x, yy + 1, "3"); c.px(x + 1, yy + 2, "3") } },
  // the near rock walls: dark, snow lying on their ledges and in their gullies
  massif(144, [[-10, 16, 120, 1.1], [44, 40, 50, 1]], "54MiU", { seed: 15, snow: 0.3, to: TH, gully: false }),
  massif(144, [[330, 10, 130, 1.1], [272, 44, 48, 1]], "54MiU", { seed: 16, snow: 0.3, to: TH, gully: false }),
  // snow lying along the crests of the near walls and on their ledges
  (c) => { const e = []; for (let x = 0; x < TW; x++) for (let y = 1; y < TH - 1; y++) if (c.is(x, y, "MiU") && !c.is(x, y - 1, "MiU")) e.push([x, y]); for (const [x, y] of e) { const n = 1 + ((x * 7) % 5 > 1 ? 2 : 0); for (let k = 0; k < n; k++) if (c.is(x, y + k, "MiU")) c.px(x, y + k, k < n - 1 ? "5" : "4") } },
  // couloirs: long tongues of snow down the gullies of the near walls
  (c) => { for (const [x0, y0, x1, y1] of [[20, 40, 34, 110], [70, 70, 86, 130], [262, 60, 248, 120], [300, 40, 290, 100]]) for (let i = 0; i <= 40; i++) { const t = i / 40, x = Math.round(x0 + (x1 - x0) * t + Math.sin(t * 9) * 1.5), y = Math.round(y0 + (y1 - y0) * t), w = Math.round(3 - t * 2); for (let k = -w; k <= w; k++) if (c.is(x + k, y, "MiU")) c.px(x + k, y, k < 0 ? "5" : "4") } },
  // the trodden path, footprints filling with snow
  (c) => { const pts = [[160, 82], [150, 96], [172, 112], [146, 128], [166, 144]]; for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; for (let k = 0; k <= 10; k++) { const x = Math.round(x0 + (x1 - x0) * k / 10), y = Math.round(y0 + (y1 - y0) * k / 10); c.px(x, y, "3"); if (i > 1) c.px(x + 1, y, "3"); if (i > 2) c.px(x - 1, y, "=") } } },
  (c) => { for (const [x, y] of [[104, 112], [228, 100], [76, 136], [256, 132]]) { c.poly([x - 6, y, x - 2, y - 7, x + 3, y - 8, x + 7, y], "M"); c.poly([x - 6, y, x - 2, y - 7, x, y - 7, x - 1, y], "m"); c.hline(x - 3, y - 8, 5, "5"); c.hline(x - 6, y, 18, "3") } },
  layer("gust", { light: true, density: 0.3 }, poly([0, 50, 320, 30, 320, 44, 0, 70], "k")),
  snowfall(240, 3),
)

// Wizard's tower: Orthanc in the ring of Isengard. Four black piers welded into one, horns at the top; the ring-wall
// round the plain, pits and smoking vents inside, paved roads with pillars converging on the tower; Methedras behind.
const ORX = 160, ORY = 112, RRX = 150, RRY = 20
const ringY = (x, s) => { const d = (x - ORX) / RRX; return Math.abs(d) > 1 ? null : Math.round(ORY + s * RRY * Math.sqrt(1 - d * d)) }
const ringWall = (s, h) => (c) => { for (let x = ORX - RRX; x <= ORX + RRX; x++) { const y = ringY(x, s); if (y == null) continue; const d = (x - ORX) / RRX; c.vline(x, y - h, h, s < 0 ? (d < 0.2 ? "M" : "0") : (d < -0.5 ? "m" : d < 0.5 ? "M" : "0")); c.px(x, y - h, s < 0 ? "m" : "l"); for (let k = 3; k < h; k += 3) if ((x + k) % 6) c.px(x, y - h + k, s < 0 ? "0" : "M") } }
const orthanc = (x, base, top) => (c) => {
  for (let y = top; y < base; y++) {
    const t = (y - top) / (base - top), hw = Math.round(9 + t * 5)
    for (let i = -hw; i <= hw; i++) { const u = (i + hw) / (2 * hw), pier = Math.floor(u * 3.999); let k = ["v", "U", "u", "k"][Math.max(0, Math.min(3, Math.floor(u * 4 + B8(x + i, y) * 0.3)))]; if (Math.abs(u * 3 - Math.round(u * 3)) < 0.06 && u > 0.05 && u < 0.95) k = "u"; c.px(x + i, y, k) }
  }
  // the horns: four sharp pinnacles round the summit platform, the far ones shorter
  for (const [dx, h, k] of [[-9, 14, "v"], [-3, 10, "U"], [4, 10, "u"], [9, 14, "k"]]) { c.poly([x + dx - 2, top + 1, x + dx, top - h, x + dx + 2, top + 1], k); c.px(x + dx, top - h, "J") }
  c.hline(x - 9, top, 19, "i"); c.vline(x - 2, top + 30, 3, "L"); c.px(x - 2, top + 30, "K")                       // a lit window high up
  for (let y = top + 12; y < base - 10; y += 14) c.hline(x - 6, y, 3, "u")                                         // windows
}
terrain("tour",
  sky(TW, 80, "+2=3~4"), stamp("_cloud_a", 40, 10, { swap: { 5: "4", 4: "3" } }),
  massif(88, [[50, 4, 80, 0.85], [160, 30, 50], [270, 20, 70]], "54=3=", { seed: 21, snow: 0.4 }),
  massif(104, [[0, 60, 70, 1], [320, 56, 80, 1]], "4366%", { seed: 22, snow: 0.1 }),
  hills(98, 2, "6", 9, 120, TW),
  // the plain outside the ring, then the plain inside it, gone to pits and vents
  vgrad(0, 92, TW, 52, "^cA", 1, 2), ellipse(ORX, ORY, RRX, RRY, "T"),
  ringWall(-1, 7),
  (c) => { const r = c.rng(5); for (let i = 0; i < 18; i++) { const a = r() * Math.PI * 2, d = 0.3 + r() * 0.6, x = Math.round(ORX + Math.cos(a) * RRX * d), y = Math.round(ORY + Math.sin(a) * RRY * d * 0.9); c.ellipse(x, y, 3, 1, "t"); c.hline(x - 2, y - 1, 4, "q"); if (i % 3 === 0) { c.px(x, y, "D"); smoke(x, y - 2, 5)(c) } } },
  // the roads, paved, with pillars along them, converging on the tower
  (c) => { for (const a of [0.5, 1.5, 2.6, 3.7]) { for (let t = 0.12; t < 0.95; t += 0.012) { const x = Math.round(ORX + Math.cos(a) * RRX * t), y = Math.round(ORY + Math.sin(a) * RRY * t); c.px(x, y, "M") } for (let t = 0.2; t < 0.95; t += 0.12) { const x = Math.round(ORX + Math.cos(a) * RRX * t), y = Math.round(ORY + Math.sin(a) * RRY * t); c.vline(x + 2, y - 3, 3, "m") } } },
  layer("towershadow", { shade: true }, poly([166, 112, 226, 118, 232, 122, 168, 116], "k")),
  orthanc(ORX, ORY + 4, 18),
  glow("D", { r: 4, strength: 0.6 }), glow("LK", { r: 3, strength: 0.6 }),
  ringWall(1, 9),
  rect(ORX - 6, ORY + RRY - 9, 12, 8, "z"), ellipse(ORX, ORY + RRY - 9, 6, 3, "z"),                                // the gate in the south
  // the felled vale in front: stumps of trees, ash of fires
  vgrad(0, 132, TW, 12, "cA", 1, 2), (c) => { const r = c.rng(9); for (let i = 0; i < 22; i++) { const x = Math.floor(r() * TW), y = 134 + Math.floor(r() * 9); c.rect(x, y - 2, 3, 3, "W"); c.hline(x, y - 2, 3, "X"); c.px(x + 3, y, "a") } },
)
// Harbour: Pelargir on the delta, white quays and towers, black-sailed ships of the Corsairs coming up the river.
// A corsair: a long low hull with a raised stern, oars out, a single great black sail bellied by the wind. L = length.
const corsair = (x, y, L, flip = false) => (c) => {
  const X = (i) => flip ? x + L - i : x + i, h = Math.max(3, Math.round(L / 9))
  for (let i = 0; i <= L; i++) { const t = i / L, top = y - Math.round((t < 0.15 ? (0.15 - t) * 22 : 0) + (t > 0.85 ? (t - 0.85) * 14 : 0) * h / 4), bot = y + h - Math.round(Math.abs(t - 0.5) * 2 * h * 0.6); c.vline(X(i), top, bot - top, "w"); c.px(X(i), top, "W"); if (bot - top > 3) c.px(X(i), y + 1, "R") }
  for (let i = Math.round(L * 0.2); i < L * 0.85; i += 3) c.line(X(i), y + h - 1, X(i) + (flip ? 2 : -2), y + h + 2, "W")                          // oars
  const mx = X(Math.round(L * 0.48)), sh = Math.round(L * 0.75), sw = Math.round(L * 0.32)
  c.vline(mx, y - sh - 2, sh + 2, "w")
  for (let j = 0; j < sh - 4; j++) { const bel = Math.round(Math.sin(j / (sh - 4) * Math.PI) * L / 14); for (let i = -sw; i <= sw + bel; i++) { const u = (i + sw) / (2 * sw + bel); c.px(mx + (flip ? -i : i), y - sh + j, u < 0.2 ? "v" : u < 0.7 ? "U" : "u") } }
  c.hline(mx - sw - 1, y - sh - 1, 2 * sw + 3, "w"); c.px(mx, y - sh - 4, "R"); c.px(mx + (flip ? -1 : 1), y - sh - 4, "s")
}
terrain("port",
  sky(TW, 76), stamp("_cloud_a", 50, 8), stamp("_cloud_b", 170, 22), stamp("_cloud_far", 260, 36),
  hills(70, 2, "6", 30, 90, TW), (c) => { for (let x = 0; x < TW; x++) c.vline(x, Math.round(74 + Math.sin(x / 19)), 4, "%") },
  ...water(78, 66, 31, "~PpZz"),
  // the city on its rise: quay wall at the water, gates, houses climbing behind, towers, the domed hall
  fillUnder((x) => x < 176 ? 999 : Math.round(66 - (x - 176) * 0.06 + Math.sin(x / 7)), "c", 96, 176, TW),
  (c) => { const r = c.rng(3); for (let row = 0; row < 3; row++) for (let x = 184 + row * 4; x < TW; x += 9 + Math.floor(r() * 4)) { const y = 64 + row * 9 - Math.floor((x - 176) * 0.05), w = 7 + Math.floor(r() * 3); c.rect(x, y, w, 7, "l"); c.vline(x, y, 7, "5"); c.vline(x + w - 1, y, 7, "m"); c.rect(x + 2, y + 3, 2, 3, "M"); c.poly([x - 1, y, x + w / 2, y - 4, x + w + 1, y], "s"); c.poly([x - 1, y, x + w / 2, y - 4, x + w / 2, y], "S") } },
  dome(250, 58, 9), rect(241, 58, 19, 8, "l"), vline(241, 58, 8, "5"), towerAt(206, 34, 7, 46), towerAt(288, 40, 7, 40), towerAt(232, 46, 6, 30),
  ashlar(176, TW, 90, 10, "lmM0"), rect(222, 92, 8, 8, "0"), ellipse(225.5, 92, 4, 3, "0"),
  // the stone quays and a timber jetty, reflections of the walls
  layer("quayrefl", { shade: true, density: 0.5 }, rect(176, 100, 144, 10, "k")),
  rect(150, 99, 40, 3, "x"), hline(150, 99, 40, "X"), (c) => { for (let x = 152; x < 190; x += 5) c.vline(x, 102, 6, "w") },
  // the ships: black sails, coming up on the wind
  corsair(120, 86, 34), corsair(40, 92, 44), corsair(-6, 120, 76), corsair(166, 112, 52, false),
  (c) => { for (const [x, y, l] of [[100, 132, 30], [210, 126, 22], [40, 100, 18]]) for (let i = 0; i < l; i++) c.px(x + i, y + (i % 4 === 0 ? 1 : 0), "5") },
)
// Walls: a great curtain closing a valley, drum towers and a gatehouse, the causeway to the gate; banners up.
terrain("muraille",
  sky(TW, 64), stamp("_cloud_a", 120, 4), stamp("_cloud_b", 260, 14),
  massif(60, [[20, 6, 70, 0.9], [290, 4, 70, 0.9]], "54=3=", { seed: 24, snow: 0.3 }),
  // the valley sides: rock spurs coming down on both hands
  crag(0, 64, (x) => Math.round(18 + x * 0.5 + Math.sin(x / 5) * 2), () => 110, "lmM0", 11), crag(256, TW, (x) => Math.round(22 + (TW - x) * 0.55 + Math.sin(x / 5) * 2), () => 110, "mM0z", 12),
  // the curtain, big blocks in courses, the wall-walk with its merlons
  ashlar(30, 290, 50, 58, "lmM0", { ch: 5, bw: 10 }),
  layer("wallfoot", { shade: true, density: 0.5 }, rect(30, 96, 260, 12, "k")),
  // towers standing forward, each casting its shadow on the wall to the right
  layer("towershadows", { shade: true }, poly([84, 40, 92, 40, 100, 108, 84, 108], "k"), poly([248, 40, 256, 40, 264, 108, 248, 108], "k")),
  towerAt(64, 34, 20, 76), towerAt(228, 34, 20, 76),
  // the gatehouse: two drums, the deep arch, the doors bound in iron
  towerAt(126, 24, 20, 86), towerAt(174, 24, 20, 86), ashlar(146, 174, 34, 76, "mM0z", { ch: 5, bw: 8 }),
  rect(148, 66, 26, 44, "z"), ellipse(160.5, 66, 13, 9, "z"),
  (c) => { for (let y = 64; y < 110; y++) for (let x = 150; x < 172; x++) { const inArch = y >= 66 || ((x - 160.5) / 11) ** 2 + ((y - 66) / 7) ** 2 <= 1; if (!inArch) continue; c.px(x, y, x % 4 === 0 ? "w" : x < 161 ? "x" : "W") } for (const y of [72, 86, 100]) c.hline(150, y, 22, "i"); for (let y = 74; y < 108; y += 4) for (const x of [152, 158, 164, 170]) c.px(x, y, "j"); c.vline(160, 62, 48, "k") },
  // banners
  (c) => { for (const [x, y] of [[73, 20], [135, 10], [183, 10], [237, 20]]) { c.vline(x, y, 10, "w"); c.rect(x + 1, y, 6, 8, "h"); c.vline(x + 1, y, 8, "H"); c.px(x + 3, y + 3, "5"); c.px(x + 4, y + 4, "5"); c.px(x + 3, y + 5, "5"); c.px(x + 7, y + 7, "G") } },
  // the causeway, the ground before the wall, the dark near edge
  ...meadow(108, TW, 36, 26, 60),
  layer("causeway", (c) => { c.poly([146, 108, 176, 108, 206, 144, 112, 144], "m"); c.poly([146, 108, 150, 108, 120, 144, 112, 144], "l"); for (let y = 112; y < 144; y += 4) c.hline(Math.round(146 - (y - 108) * 0.95), y, Math.round(30 + (y - 108) * 1.9), "M") }),
  scatter("_tuft", 0, 110, TW, 30, 30, { seed: 27, on: "cAC^" }),
)
// Helm's Deep at night in the rain: the Deeping Wall across the mouth of the gorge, the Hornburg on its rock,
// torches along the battlements, lightning over the mountains; the coomb in front black with rain.
terrain("gouffre",
  vgrad(0, 0, TW, 90, "uUvU", 1, 2),
  // lightning: a forked bolt, the clouds lit around it
  layer("flash", { light: true, density: 0.4 }, ellipse(230, 18, 60, 14, "k")),
  (c) => { const pts = [[236, 0], [232, 12], [240, 20], [234, 34], [242, 46]]; for (let i = 0; i < pts.length - 1; i++) c.line(...pts[i], ...pts[i + 1], "?"); c.line(240, 20, 250, 30, "!"); c.line(234, 34, 226, 42, "!") },
  massif(84, [[60, 18, 70], [180, 6, 60, 0.9], [290, 20, 60]], "VvUuu", { seed: 31, snow: 0.3 }),
  // the gorge walls closing in on both hands
  massif(150, [[-20, 20, 150, 1.1]], "VvUuu", { seed: 32, snow: 0.0, gully: false }), massif(150, [[340, 16, 150, 1.1]], "vUuuu", { seed: 33, snow: 0.0, gully: false }),
  // the Hornburg rock and its tower, the keep's walls stepping down to the Deeping Wall
  crag(50, 122, (x) => Math.round(64 + Math.abs(x - 84) * 0.5 + (x > 100 ? (x - 100) * 1.5 : 0) + Math.sin(x / 3) * 1.5), () => 120, "vUuk", 13, false),
  ashlar(58, 112, 54, 14, "vUiu", { ch: 4, bw: 8 }), towerAt(76, 18, 16, 40, "VvUu"), rect(80, 10, 8, 8, "v"), vline(80, 10, 8, "V"), poly([79, 10, 84, 4, 89, 10], "U"),
  ashlar(112, 270, 86, 18, "vUiu", { ch: 4, bw: 8 }), rect(186, 98, 8, 6, "u"), ellipse(189.5, 98, 4, 2, "u"),                  // the culvert
  // torches along the wall and in the keep's windows
  (c) => { for (const [x, y] of [[66, 50], [100, 50], [84, 30], [82, 44], [120, 82], [144, 82], [168, 82], [196, 82], [222, 82], [250, 82]]) { c.px(x, y, "K"); c.px(x, y + 1, "L"); c.px(x, y + 2, "w") } },
  glow("KL", { r: 6, strength: 0.6, color: "#ef9f38" }),
  // the coomb: the stream from the culvert, the dark slope, the dike far in front with the enemy's torches
  vgrad(0, 104, TW, 40, "Uuu", 1, 2), line(190, 104, 176, 124, "v", 2), line(176, 124, 196, 144, "v", 3),
  (c) => { const r = c.rng(41); for (let g = 0; g < 6; g++) { const gx = 20 + g * 50 + Math.floor(r() * 20); for (let i = 0; i < 4 + Math.floor(r() * 4); i++) { const x = gx + Math.floor(r() * 26), y = 128 + Math.floor(r() * 10); c.px(x, y, "K"); c.px(x, y + 1, "L") } } }, glow("K", { r: 3, strength: 0.5, where: [0, 120, TW, 24], color: "#c84a1d" }),
  rain(230, 5, "v"), rain(60, 6, "V"),
)

// Moria: the Dwarrowdelf, a hall hewn from the rock, double rows of pillars carved like the boles of trees whose
// boughs uphold the roof, going away into the dark; a shaft of grey light from a high window in the east wall,
// pooling on the polished floor.
const MVX = 160, MVY = 58
const mpillar = (side, z) => (c) => {
  const x = Math.round(MVX + side * 104 / z), w = Math.max(1, Math.round(20 / z)), yb = Math.round(MVY + 86 / z), yt = Math.round(MVY - 70 / z), cap = Math.round(26 / z)
  const fade = z > 4 ? 2 : z > 2.4 ? 1 : 0, K = [["0", "U", "u", "u"], ["U", "u", "u", "k"], ["u", "u", "k", "k"]][fade]
  for (let y = yt; y < yb; y++) {
    const flare = y < yt + cap ? Math.round((1 - (y - yt) / cap) ** 2 * w * 1.4) : y > yb - cap / 2 ? Math.round(((y - yb + cap / 2) / (cap / 2)) * w * 0.4) : 0
    for (let i = -flare; i < w + flare; i++) { const u = (i + flare) / (w + 2 * flare); c.px(x - Math.floor(w / 2) + i, y, side > 0 ? (u < 0.3 ? K[0] : u < 0.75 ? K[1] : K[2]) : (u < 0.25 ? K[1] : u < 0.6 ? K[2] : K[3])) }
  }
  if (w > 3) for (let k = 1; k < w - 1; k += 3) for (let y = yt + cap; y < yb - cap / 2; y++) if ((y + k) % 9 < 6) c.px(x - Math.floor(w / 2) + k, y, K[2])     // the flutes of the bole
  // boughs: ribs springing from the capital and arching into the vault
  for (const d of [-1, 1]) for (let i = 0; i <= 10; i++) { const t = i / 10, bx = Math.round(x + d * t * 40 / z), by = Math.round(yt - Math.sin(t * Math.PI / 2) * 22 / z); c.rect(bx, by, Math.max(1, Math.round(4 / z)), Math.max(1, Math.round(3 / z)), K[1]) }
}
terrain("moria",
  rect(0, 0, TW, TH, "k"),
  // the vault and the far darkness, a faint gleam on the floor's perspective lines
  vgrad(0, MVY - 6, TW, 12, "kuk", 1, 2),
  (c) => { for (let y = MVY + 4; y < TH; y++) { const z = 86 / (y - MVY); for (let x = 0; x < TW; x++) { const lx = (x - MVX) * z / 86; let k = z > 5 ? "k" : "u"; if (z < 4 && (Math.abs(lx * 4 - Math.round(lx * 4)) < 0.04 / z * 2 || Math.abs(z * 2 - Math.round(z * 2)) < 0.06 / z)) k = "k"; c.px(x, y, k) } } },
  ...[7, 5, 3.6, 2.6, 1.9, 1.4, 1.05, 0.8].flatMap((z) => [mpillar(-1, z), mpillar(1, z)]),
  // the shaft of light from the east window, the pool it makes and the pillars it touches
  rect(232, 0, 10, 4, "v"), hline(232, 0, 10, "V"),
  layer("shaft", { light: { k: "u", u: "U", U: "v", v: "V", 0: "M", M: "m", i: "I" }, density: 0.35 }, poly([226, 0, 248, 0, 196, 118, 160, 118], "k")),
  layer("shaft2", { light: { k: "u", u: "U", U: "v", v: "V", 0: "M", M: "m", i: "I" }, density: 0.5 }, poly([232, 0, 242, 0, 186, 116, 172, 116], "k")),
  layer("pool", { light: { k: "u", u: "U", U: "v", v: "V", 0: "M", M: "m", i: "I" }, density: 0.5 }, ellipse(176, 118, 30, 5, "k")), layer("pool2", { light: { k: "u", u: "U", U: "v", v: "V", 0: "M", M: "m", i: "I" } }, ellipse(176, 118, 18, 2, "k")),
  // motes in the beam
  (c) => { const r = c.rng(3); for (let i = 0; i < 26; i++) { const t = r(), x = Math.round(237 - t * 60 + (r() - 0.5) * 16), y = Math.round(t * 116); c.px(x, y, "V") } },
  // reflections of the near pillars in the polished floor
  layer("refl", { light: { k: "u", u: "U", U: "v", v: "V", 0: "M", M: "m", i: "I" }, density: 0.25 }, rect(48, 132, 12, 12, "k"), rect(262, 132, 12, 12, "k")),
)
// Black Gate: the Morannon shutting the pass between the Mountains of Shadow and the Ash Mountains, iron doors in a
// black wall, the Towers of the Teeth on the shoulders, slag-heaps and poisoned pools in front, the sky of fume.
terrain("morannon",
  ashSky(108),
  (c) => { for (const [x, y, w] of [[-20, 16, 200], [160, 30, 200], [40, 46, 160]]) { c.ellipse(x + w / 2, y, w / 2, 4, ";"); c.ellipse(x + w / 2 + 8, y + 3, w / 2 - 16, 1, "-") } },
  // the two mountain walls closing on the pass
  blackCrag(TH + 10, [[0, 14, 150, 0.9], [60, 34, 60], [90, 56, 30], [114, 62, 26]], 11),
  blackCrag(TH + 10, [[320, 10, 150, 0.9], [262, 30, 60], [232, 54, 30], [208, 60, 26]], 12),
  // the wall across the gap: black stone courses, battlements, the doors of iron
  ashlar(110, 212, 62, 44, "vUuk", { ch: 4, bw: 9 }),
  rect(144, 76, 34, 30, "i"), ellipse(160.5, 76, 17, 10, "i"), (c) => { for (let x = 146; x < 176; x++) for (let y = 70; y < 106; y++) if (c.is(x, y, "i")) c.px(x, y, x < 150 ? "I" : x === 160 || x === 161 ? "k" : "i"); for (const y of [80, 90, 100]) c.hline(146, y, 30, "I"); for (let y = 82; y < 106; y += 4) for (const x of [148, 154, 166, 172]) c.px(x, y, "j") },
  // the Towers of the Teeth, black, a red light in each
  towerAt(96, 20, 14, 88, "Uuuk", { cap: "merlon", win: false }), towerAt(212, 18, 14, 90, "Uuuk", { cap: "merlon", win: false }),
  px(102, 32, "s"), px(102, 33, "D"), px(218, 30, "s"), px(218, 31, "D"), (c) => { for (const x of [130, 150, 170, 190]) { c.px(x, 64, "D") } },
  glow("Ds", { r: 5, strength: 0.6 }),
  // slag-heaps and pits of poisonous mud before the gate
  vgrad(0, 106, TW, 38, "0Mt0", 1, 2),
  (c) => { for (const [x, y, w, h] of [[30, 126, 40, 14], [250, 120, 50, 18], [130, 134, 46, 10], [300, 138, 30, 8]]) { for (let i = -w / 2; i <= w / 2; i++) { const hh = Math.round(h * Math.sqrt(1 - (2 * i / w) ** 2)); for (let j = 0; j < hh; j++) c.px(Math.round(x + i), y - j, i < -w / 6 ? "M" : i < w / 5 ? "0" : "u") } } },
  (c) => { for (const [x, y, rx] of [[100, 118, 16], [210, 128, 20], [60, 112, 10]]) { c.ellipse(x, y, rx, 2, "<"); c.hline(x - rx + 3, y - 2, rx, ">"); c.hline(x - 3, y, 6, "*") } },
  blackCrag(TH + 6, [[-10, 116, 40], [330, 112, 40]], 13),
)

// Minas Tirith (also the menu cover): the city of seven circles built against Mount Mindolluin, each wall a curve
// facing east, the great prow of rock cleaving the city up to the citadel, the White Tower on the summit, the Great
// Gate in the first wall, the Pelennor before it with its farms and roads, the Rammas in front.
const MCX = 150
const TIERS = [[100, 16, 124, 14], [86, 11, 106, 12], [74, 10, 90, 10], [63, 9, 74, 8], [54, 8, 59, 6], [46, 7, 45, 5], [39, 6, 32, 4]]   // y at the front, wall height, rx, ry
const tierY = (k, x) => { const [y, , rx, ry] = TIERS[k], d = (x - MCX) / rx; return Math.abs(d) > 1 ? null : Math.round(y - ry * (1 - Math.sqrt(1 - d * d))) }
const tierWall = (k) => (c) => {
  const [, h, rx] = TIERS[k]
  for (let x = MCX - rx; x <= MCX + rx; x++) {
    const y = tierY(k, x); if (y == null) continue
    const d = (x - MCX) / rx, v = d, F = v < -0.5 ? "5" : v < 0.3 ? "l" : v < 0.72 ? "m" : "M", J = v < 0.3 ? "m" : "M"
    c.vline(x, y, h, F)
    for (let r = 3; r < h - 1; r += 3) c.px(x, y + r, J)                                                     // bedding joints
    for (let r = 0; r < h - 1; r += 3) if ((x + (r / 3) * 5) % 11 === 0) c.vline(x, y + r + 1, 2, J)         // head joints
    c.px(x, y + h - 1, v < 0.35 ? "m" : "0")
    if ((x - MCX) % 3 === 0) c.px(x, y - 1, F); c.px(x, y, F === "5" ? "5" : "l")                            // merlons, the lit coping
  }
}
// Houses on a tier, standing behind its wall: white fronts lit on the left, slate roofs, dark windows, two rows.
const tierHouses = (k, seed) => (c) => {
  const [, , rx] = TIERS[k], r = c.rng(seed)
  for (let x = MCX - rx; x <= MCX + rx; x++) { const y = tierY(k, x); if (y == null) continue; for (let j = 1; j < (k === 6 ? 4 : 12); j++) if (c.is(x, y - j, "VvUu")) { const d = (x - MCX) / rx; c.px(x, y - j, (d < -0.3 ? "m" : d < 0.4 ? "M" : "0")) } }   // the tier's ground and back walls
  for (let x = MCX - rx + 3; x < MCX + rx - 4; x += 5 + Math.floor(r() * 3)) {
    const y = tierY(k, x); if (y == null) continue
    const w = 3 + Math.floor(r() * 3), h = 3 + Math.floor(r() * 2) + (k < 2 ? 1 : 0), d = (x - MCX) / rx, base = y
    const F = d < 0.3 ? "l" : "m", S = d < 0.3 ? "m" : "M"
    c.rect(x, base - h, w, h, F); c.vline(x, base - h, h, d < -0.3 ? "5" : F); c.vline(x + w - 1, base - h, h, S)
    if (r() < 0.6) { c.hline(x, base - h - 1, w, d < 0.3 ? "m" : "M"); c.hline(x + 1, base - h - 2, w - 2, "M") } else c.hline(x - 1, base - h - 1, w + 2, F)
    if (h > 3) c.px(x + 1, base - h + 1, "M")
  }
}
const prow = (x, top, foot, hw) => (c) => {
  for (let y = top; y < foot; y++) {
    const t = (y - top) / (foot - top), w = Math.round(hw * (0.75 + t * 0.25))
    for (let i = -w; i <= w; i++) { const v = i / w + B8(x + i, y) * 0.2; c.px(x + i, y, i === 0 ? "5" : i === 1 ? "M" : v < -0.7 ? "5" : v < 0 ? "l" : v < 0.5 ? "M" : "0") }
  }
  for (let y = top + 6; y < foot - 2; y += 7) for (let i = -hw + 2; i < hw - 1; i++) if ((i + y) % 5 < 3 && i !== 0) c.px(x + i, y, i < 0 ? "M" : "0")     // ledges
  for (const i of [-9, -5, 4, 8]) for (let y = top + 3 + Math.abs(i); y < foot - 4; y++) if ((y + i * 3) % 11 < 7) c.px(x + i, y, i < 0 ? "M" : "0")    // cracks
  for (let y = top; y < foot; y++) { const t = (y - top) / (foot - top), w = Math.round(hw * (0.75 + t * 0.25)); c.px(x - w - 1, y, "M") }   // the seam where the circles run in behind it
  // the battlement at the prow's point, the bastion over the gate
  c.rect(x - hw - 1, top - 4, 2 * hw + 3, 4, "l"); c.hline(x - hw - 1, top - 4, 2 * hw + 3, "5"); c.rect(x + 1, top - 4, hw + 1, 4, "m"); for (let i = -hw - 1; i < hw + 2; i += 3) c.px(x + i, top - 5, i < 0 ? "5" : "m")
}
terrain("minas_tirith",
  sky(TW, 92), stamp("_cloud_a", 18, 12), stamp("_cloud_b", 262, 8), stamp("_cloud_far", 100, 30), stamp("_cloud_far", 286, 44),
  // Mindolluin and the White Mountains: violet in the morning, snow on the heights
  massif(100, [[20, 40, 70, 1], [92, 26, 50], [214, 0, 96, 0.85], [310, 34, 50]], "54VvU", { seed: 41, snow: 0.32 }),
  massif(118, [[-10, 54, 70, 1], [330, 60, 60, 1]], "4366%", { seed: 42, snow: 0.08 }),
  // the hill the city stands on, its flanks running down into the plain
  flankShade((x) => Math.round(plateau(MCX + 10, 46, 60, 112, 80)(x) + Math.sin(x / 5)), 0, TW, "VvUu", plateau(MCX + 10, 46, 60, 112, 80)),
  clip((x, y) => y > 98 + Math.sin(x / 9) * 2, flankShade((x) => Math.round(plateau(MCX + 10, 46, 60, 112, 80)(x) + Math.sin(x / 5)), 0, TW, "Cc^A", plateau(MCX + 10, 46, 60, 112, 80))),
  // the circles from the top down, each in front of the one above; the prow over all but the first
  tierHouses(6, 7), tierWall(6),
  // the citadel: the King's house, the White Tower rising over all, its banner, the pinnacle like a spike of pearl
  rect(MCX - 18, 31, 14, 9, "l"), vline(MCX - 18, 31, 9, "5"), poly([MCX - 19, 31, MCX - 11, 26, MCX - 3, 31], "j"), poly([MCX - 19, 31, MCX - 11, 26, MCX - 11, 31], "J"),
  rect(MCX + 10, 33, 10, 7, "m"), poly([MCX + 9, 33, MCX + 15, 29, MCX + 21, 33], "I"),
  (c) => { const x = MCX - 4; for (let y = 4; y < 38; y++) { const w = y < 9 ? 5 : 9, o = y < 9 ? 2 : 0; for (let i = 0; i < w; i++) c.px(x + o + i, y, i === 0 ? "5" : i < w - 3 ? "l" : i < w - 1 ? "m" : "M") } for (const y of [9, 18, 28]) { c.hline(x - 1, y, 11, "5"); c.hline(x - 1, y + 1, 11, "m"); c.px(x + 9, y, "m") } c.vline(x + 3, 12, 3, "M"); c.vline(x + 3, 21, 3, "M"); c.vline(x + 3, 31, 3, "M"); c.poly([x + 1, 4, x + 4, -2, x + 8, 4], "l"); c.poly([x + 4, -2, x + 8, 4, x + 4, 4], "m"); c.px(x + 4, -1, "?"); c.px(x + 4, 0, "?") },
  vline(MCX + 7, 0, 6, "m"), poly([MCX + 8, 0, MCX + 15, 1, MCX + 8, 4], "5"), poly([MCX + 8, 2, MCX + 15, 1, MCX + 14, 3, MCX + 8, 4], "4"),
  glow("?", { r: 4, strength: 0.6, color: "#ffffff" }),
  tierHouses(5, 6), tierWall(5), tierHouses(4, 5), tierWall(4), tierHouses(3, 4), tierWall(3), tierHouses(2, 3), tierWall(2), tierHouses(1, 2), tierWall(1),
  layer("prowshadow", { shade: true }, poly([MCX + 20, 42, MCX + 30, 46, MCX + 42, 86, MCX + 20, 86], "k")),
  prow(MCX, 42, 90, 20),
  tierHouses(0, 1), tierWall(0),
  // towers on the first wall, and the Great Gate between its two towers
  ...[-104, -70, -36, 36, 70, 104].map((dx) => (c) => { const x = MCX + dx, y = tierY(0, x) - 6, d = dx / 124; towerAt(x - 4, y, 9, 22, d < 0 ? "5lmM" : "lmM0")(c) }),
  towerAt(MCX - 14, 88, 9, 28, "5lmM"), towerAt(MCX + 6, 88, 9, 28, "lmM0"),
  (c) => { for (const [x, y] of [[MCX - 10, 76], [MCX + 10, 76], [MCX - 74, 78], [MCX + 66, 80]]) { c.vline(x, y, 8, "w"); c.rect(x + 1, y, 6, 4, "u"); c.hline(x + 1, y, 6, "U"); c.px(x + 3, y + 1, "5"); c.px(x + 3, y + 2, "4"); c.px(x + 2, y + 1, "4"); c.px(x + 4, y + 1, "4") } },
  rect(MCX - 5, 104, 11, 12, "z"), ellipse(MCX, 104, 5, 4, "z"), (c) => { for (let y = 102; y < 116; y++) for (let x = MCX - 4; x <= MCX + 4; x++) if (c.is(x, y, "z") && y > 103) c.px(x, y, x < MCX ? "I" : "i"); for (const y of [107, 111]) c.hline(MCX - 4, y, 9, "j"); c.vline(MCX, 103, 13, "k") },
  // the Pelennor: farms and fields, the roads coming in to the gate, the Rammas wall in front
  clip((x, y) => y >= 116, quilt(116, 134, 41)),
  layer("road", (c) => { for (const [x1, w] of [[60, 2], [150, 4], [270, 3]]) { c.line(MCX, 116, x1, 144, "m", w); c.line(MCX - 1, 116, x1 - 1, 144, "l") } }),
  (c) => { for (const [x, y] of [[42, 122], [96, 127], [218, 121], [262, 128], [70, 118]]) { c.rect(x, y, 6, 3, "l"); c.vline(x, y, 3, "5"); c.poly([x - 1, y, x + 3, y - 2, x + 7, y], "s"); c.stamp("_copse", x + 6, y - 9) } },
  vgrad(0, 134, TW, 10, "cA", 1, 2), (c) => { for (let x = 0; x < TW; x++) { const y = 136 + Math.round(Math.sin(x / 40) * 1.5); if (x % 60 < 50) { c.rect(x, y, 1, 4, x % 6 ? "m" : "M"); c.px(x, y, "l") } } },
  treeline(143, 3, "A", "a", 43, TW, 144), bigTree(10, 128, 13), bigTree(310, 130, 12),
)

// ------------------------------------------------------------------ campaign map (640x280): pos [x, y] in map units, pixel = (x * 6.4, y * 6.364)
// An old chart in the style of map_gaule: parchment land, the sea hatched, rivers, mountains in hachures, forests in
// little trees (Mirkwood dark, Lórien golden), Mordor a dark walled square with the Mountain glowing inside.
const MP = (x, y) => [Math.round(x * 6.4), Math.round(y * 6.364)]
const mpath = (pts) => pts.flatMap(([x, y]) => MP(x, y))
// Sample a polyline (map units) at t in 0..1: point and the direction there.
const along = (pts, t) => {
  const L = []; let tot = 0; for (let i = 0; i < pts.length - 1; i++) { const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); L.push(d); tot += d }
  let s = t * tot; for (let i = 0; i < L.length; i++) { if (s <= L[i] || i === L.length - 1) { const f = Math.min(1, s / L[i]), [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; return [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, (x1 - x0) / L[i], (y1 - y0) / L[i]] } s -= L[i] }
}
const mriver = (pts, k = "p", wide = 0.6) => (c) => { for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = MP(...pts[i]), [x1, y1] = MP(...pts[i + 1]); c.line(x0, y0, x1, y1, k, i >= pts.length * wide ? 2 : 1) } }
// A mountain chain: hachured peaks scattered along a spine, bigger near the spine, lit on the west slope.
const chain = (pts, n, spread = 1.2, seed = 1, size = 4, keys = "QqT") => (c) => {
  const r = c.rng(seed), all = []
  for (let i = 0; i < n; i++) { const [x, y, dx, dy] = along(pts, r()), o = (r() - 0.5) * 2 * spread; all.push([x - dy * o, y + dx * o, Math.max(2, Math.round(size * (1 - Math.abs(o) / spread * 0.5) + r() - 0.5))]) }
  all.sort((a, b) => a[1] - b[1])
  for (const [mx, my, h] of all) { const [x, y] = MP(mx, my); c.poly([x - h, y + 1, x, y - h, x + 1, y - h, x + h + 1, y + 1], keys[0]); c.poly([x + 1, y - h, x + h + 1, y + 1, x + 1, y + 1], keys[2]); c.line(x - h, y + 1, x, y - h, keys[1]); c.line(x + 1, y - h, x + h + 1, y + 1, keys[2]) }
}
// A forest: little round trees on trunks, nearer rows over farther ones. keys: lit, crown, trunk.
const mwood = (x0, y0, x1, y1, n, seed = 1, keys = "hGW", inside = null) => (c) => {
  const r = c.rng(seed), all = []
  for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * r(), y = y0 + (y1 - y0) * r(); if (!inside || inside(x, y)) all.push(MP(x, y)) }
  all.sort((a, b) => a[1] - b[1])
  for (const [x, y] of all) { c.px(x, y + 1, keys[2]); c.rect(x - 1, y - 1, 3, 2, keys[1]); c.px(x, y - 2, keys[1]); c.px(x - 1, y - 1, keys[0]); c.px(x, y - 2, keys[0]) }
}
const COAST = [[0, 0], [4.5, 0], [5.5, 3], [4, 6], [5, 8.6], [10, 9.6], [10, 10.4], [5.5, 11], [4, 13], [3.2, 17], [4.6, 21], [7, 24.5], [10, 27.5], [13, 30], [17, 32.6], [21, 34.6], [23.5, 37], [24.6, 40.4],
  [27.5, 39.2], [31, 40.2], [35, 41.4], [40, 41.4], [44.5, 42.4], [48, 43.4], [51.5, 44], [0, 44]]
const ANDUIN = [[44, 0.5], [44.6, 5], [45, 10], [44.4, 15], [44.8, 19], [45.8, 23], [45.9, 27], [46.6, 29], [48.2, 31], [51, 33], [53, 34.6], [54.4, 36], [54.2, 38], [53.6, 40.5], [53.6, 42.5], [52.4, 44]]
const EPHEL = [[59, 25], [60.5, 28], [62.5, 31], [63.4, 35], [63.2, 40], [63.6, 44]]
const LITHUI = [[59, 25], [64, 24.2], [70, 24.6], [76, 24.4], [82, 25.2], [85, 26]]
const MORDOR = [[59, 25], [64, 24.2], [70, 24.6], [76, 24.4], [82, 25.2], [85.5, 26], [86, 32], [85, 38], [86, 44], [63.6, 44], [63.2, 40], [63.4, 35], [62.5, 31], [60.5, 28]]
scene("map_terre_milieu", { w: MW, h: MH, bg: "Q" },
  rect(0, 0, MW, MH, "l"),
  // the sea, hatched in waves parallel to the coast, the coastline drawn darker
  poly(mpath(COAST), "p"),
  (c) => { for (let y = 2; y < MH; y += 4) for (let x = (y % 8) * 2; x < MW; x += 10) if (c.is(x, y, "p") && c.is(x + 4, y, "p")) c.hline(x, y, 4, "P") },
  (c) => { const L = (ch) => "lQq".includes(ch), e = []; for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) if (c.is(x, y, "p") && (L(c.key(x - 1, y)) || L(c.key(x + 1, y)) || L(c.key(x, y - 1)) || L(c.key(x, y + 1)))) e.push([x, y]); for (const [x, y] of e) c.px(x, y, "Z") },
  // Mordor: the land inside the mountain walls darkened with close hatching
  poly(mpath(MORDOR), "Q"), (c) => { for (let y = 0; y < MH; y += 2) for (let x = 0; x < MW; x++) if (c.is(x, y, "Q") && (x + y) % 4 === 0) c.px(x, y, "q") },
  // the Shire: little fields and hedges in the west
  (c) => { const r = c.rng(3); for (let i = 0; i < 26; i++) { const [x, y] = MP(8.5 + r() * 5.5, 9 + r() * 5); const w = 4 + Math.floor(r() * 5); c.rect(x, y, w, 3, i % 3 ? "d" : "C"); c.hline(x, y + 3, w, "h") } },
  // rivers
  mriver(ANDUIN, "p", 0.45),
  mriver([[32.5, 26], [32.2, 28.5], [30, 31], [26, 31.8], [21, 32.4], [17, 32.8]]),                                        // Isen
  mriver([[36.8, 26], [39, 27.6], [42, 28.6], [46.2, 29.4]]),                                                              // Entwash
  mriver([[39, 21], [42, 21.2], [44.8, 21]]),                                                                              // Silverlode
  mriver([[14, 4], [13.4, 8], [14.2, 12], [14, 16], [12.6, 21], [10.6, 25.4], [9, 27.4]]),                                // Brandywine
  mriver([[31, 11], [28, 13], [25.6, 17], [24.6, 21], [21, 25], [17, 28.4], [13.2, 30]]),                                  // Bruinen and Greyflood
  mriver([[26, 6], [25.4, 12], [25.2, 17]]),                                                                               // Hoarwell
  mriver([[50.4, 5.6], [51.4, 8], [52.4, 9.4]]), ellipse(...MP(52.6, 10.2), 3, 6, "p"), mriver([[52.8, 11.4], [54.4, 15], [57, 19]]),  // the Running River, Long Lake
  mriver([[47.4, 5.2], [46.6, 9], [45, 10]]),                                                                              // the Forest River
  // the Dead Marshes: pools and reeds just north-west of the Gate, the plain of Dagorlad before it
  (c) => { const r = c.rng(5); for (let i = 0; i < 26; i++) { const [x, y] = MP(52.4 + r() * 5.2, 21.2 + r() * 2.6); c.hline(x, y, 3 + Math.floor(r() * 3), "p"); c.px(x + 1, y - 1, "h"); c.px(x + 2, y - 2, "G") } },
  // forests
  mwood(42, 4, 56.5, 22, 330, 7, "GgW", (x, y) => !(y > 16 && x < 44 + (y - 16) * 0.3) && !(Math.abs(y - 13) < 0.6 && x < 55)),    // Mirkwood, the road through it
  mwood(37.6, 19.6, 40.8, 22.8, 34, 8, "NnB"),                                                                             // Lórien
  mwood(34.6, 23.8, 38.4, 27.2, 46, 9, "hGW"),                                                                             // Fangorn
  mwood(15.4, 10.4, 17.6, 12.6, 14, 10, "hGW"), mwood(26.5, 9, 29.5, 11.2, 14, 11, "hGW"),                                // the Old Forest, the Trollshaws
  mwood(54.4, 28, 60, 33, 40, 12, "hGW", (x, y) => x > 55 + (y - 28) * 0.1 && x < 59.5 + (y - 28) * 0.5),                // Ithilien
  mwood(50, 40, 54, 42, 0, 13),
  // mountains: the Misty Mountains north to south, the Grey Mountains, the White Mountains, Emyn Muil, the Weather Hills
  chain([[35, 1.4], [34.5, 7], [35, 12], [35.6, 17], [35.6, 21], [34.4, 25.4]], 170, 1.3, 1, 5),
  chain([[36.5, 2.2], [42, 1.6], [48, 2.2]], 46, 0.6, 2, 3),
  chain([[26, 39], [28, 36], [31, 33.5], [35, 32.2], [39, 33], [43, 34.5], [47, 36], [49.4, 37]], 140, 0.9, 3, 4),
  chain([[47, 24], [50, 25.6], [52, 26.4]], 18, 0.8, 4, 2), chain([[20.6, 10.6], [21.4, 13.4]], 8, 0.5, 5, 2),
  // the Lonely Mountain, alone in the north-east
  (c) => { const [x, y] = MP(50, 5); c.poly([x - 9, y + 4, x - 1, y - 7, x + 1, y - 7, x + 10, y + 4], "q"); c.poly([x + 1, y - 7, x + 10, y + 4, x + 1, y + 4], "T"); c.line(x - 9, y + 4, x - 1, y - 7, "T"); c.hline(x - 1, y - 7, 2, "t") },
  // Mordor's walls, heavy and dark: Ephel Dúath and Ered Lithui, the Black Gate in their corner
  chain(EPHEL, 90, 0.7, 6, 5, "qTt"), chain(LITHUI, 110, 0.7, 7, 5, "qTt"), chain([[85.5, 26.4], [86, 33], [85.4, 39]], 30, 0.6, 8, 3, "qTt"),
  // Mount Doom glowing, Barad-dûr's tower, the black road between
  (c) => { const [x, y] = MP(70, 34); c.poly([x - 7, y + 4, x - 1, y - 5, x + 2, y - 5, x + 8, y + 4], "T"); c.poly([x + 1, y - 5, x + 8, y + 4, x + 1, y + 4], "t"); c.hline(x - 1, y - 6, 3, "D"); c.px(x, y - 7, "L"); c.line(x, y - 8, x - 4, y - 14, "M"); c.line(x - 4, y - 14, x - 10, y - 17, "m") },
  (c) => { const [x, y] = MP(75.5, 29.5); c.rect(x - 1, y - 8, 3, 9, "t"); c.px(x - 2, y - 9, "t"); c.px(x + 2, y - 9, "t"); c.px(x, y - 6, "D"); const [a, b] = MP(70, 33); for (let i = 0; i < 12; i++) c.px(Math.round(a + (x - a) * i / 12), Math.round(b + (y - b) * i / 12), "T") },
  glow("DL", { r: 6, strength: 0.6 }),
  // the East Road from the Shire to Rivendell, dotted
  (c) => { const pts = [[11, 11.6], [16, 11.4], [21, 12.6], [26, 11.8], [31, 11]]; for (let t = 0; t < 1; t += 0.006) { const [x, y] = along(pts, t); const [px, py] = MP(x, y); if (Math.round(t * 166) % 2 === 0) c.px(px, py, "q") } },
  // names, faint, in capitals
  text(...MP(2.4, 37), "BELEGAER", "Z", { scale: 2 }), text(...MP(14, 19.5), "ERIADOR", "q", { scale: 2 }), text(...MP(8.4, 15.4), "THE SHIRE", "T"),
  text(...MP(39.4, 29.6), "ROHAN", "q"), text(...MP(35, 37.4), "GONDOR", "q", { scale: 2 }), text(...MP(68, 40), "MORDOR", "t", { scale: 2 }),
  text(...MP(64, 11), "RHOVANION", "q", { scale: 2 }), text(...MP(78, 6), "RHUN", "q"),
  // compass rose, top right, and the aged border
  (c) => { const [cx, cy] = [606, 36]; c.ring(cx, cy, 12, "T"); c.ring(cx, cy, 9, "q"); c.poly([cx, cy - 17, cx + 3, cy, cx, cy + 17, cx - 3, cy], "T"); c.poly([cx - 17, cy, cx, cy - 3, cx + 17, cy, cx, cy + 3], "q"); c.poly([cx, cy - 17, cx + 3, cy, cx, cy], "s"); c.text(cx - 1, cy - 26, "N", "T") },
  (c) => {
    const e = (x, y) => Math.min(x, y, MW - 1 - x, MH - 1 - y), b = (x, y) => BAYER[(y & 7) * 8 + (x & 7)] / 64
    const AGE = { l: "Q", Q: "q", q: "T", P: "p", p: "Z", Z: "z", G: "g", h: "G", T: "t", s: "R", d: "C", C: "c" }
    c.recolor(AGE, (x, y) => e(x, y) < 18 + b(x, y) * 10); c.recolor(AGE, (x, y) => e(x, y) < 6 + b(x, y) * 6)
  },
  box(0, 0, MW, MH, "T"), box(3, 3, MW - 6, MH - 6, "q"),
)
}
