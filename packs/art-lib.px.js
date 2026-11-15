// Shared pixel-art library for every campaign's art.px.js: picture sizes, smooth dithered gradients, skies,
// hills, tree lines, meadows, cast shadows, smoke and dust, plateaus shaded by slope, water, cliffs, coins in relief.
// Use: call pal()/ramps() first, then include("../art-lib.px.js"): the parts defined here (clouds, grass tufts,
// reeds, copse) take the palette active at that point.
//
// Key convention (every pack defines these keys, with its own era's colours):
//   k outline (warm near-black)        1 + 2 = 3 ~ 4 5  sky, top -> horizon, then cloud
//   6 % &  far hills / woods in haze   a A c ^ C d      grass and leaves, dark -> sunlit
//   t T q Q  earth, roads, dust         0 M m l          stone, dark -> light
//   z Z p P  water, dark -> light       w W x X          wood, leather
//   o O y Y  straw, ochre, wheat        J                bright steel (arrow heads, glints)
// Pictures: cards CW x CH, terrains TW x TH, campaign map MW x MH (twice the original 64x40, 160x72, 320x140).
const CW = 128, CH = 80, TW = 320, TH = 144
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
// Cast shadow on the ground, falling right (light from the top left).
const shadowAt = (x, y, w = 16) => poly([x, y, x + w, y, x + w + 6, y + 2, x + 2, y + 2], "k")
// Dust kicked up behind a galloping horse: soft puffs, lit on top.
const dust = (pts) => (c) => { for (const [x, y, r] of pts) { c.circ(x + 1, y + 1, r, "T"); c.circ(x, y, r, "q"); c.circ(x - 1, y - 1, Math.max(0, r - 2), "Q") } }
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
// Smoke rising from a roof, drifting right with the wind, thinning out.
const smoke = (x, y, n = 6) => (c) => {
  for (let i = 0; i < n; i++) { const r = 1 + Math.floor(i / 2), cx = x + Math.round(i * i * 0.35), cy = y - i * 3; c.circ(cx, cy, r, i < 2 ? "m" : "4"); if (r > 1) c.circ(cx - 1, cy - 1, r - 1, i < 2 ? "4" : "5") }
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
// Coin blank (64x64): raised rim, beaded border, flat field with a sheen at the edge, lit from the top left.
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
// Arrows or bolts in flight: short strokes along an arc.
const volley = (x0, y0, dx, n = 6, seed = 1, k = "x") => (c) => { const r = c.rng(seed); for (let i = 0; i < n; i++) { const x = x0 + Math.floor(r() * 40) * Math.sign(dx), y = y0 + Math.floor(r() * 14); c.line(x, y, x + 4 * Math.sign(dx), y + 1, k); c.px(x + 5 * Math.sign(dx), y + 1, "J") } }
// Water band: sky reflected light near the far bank, darker towards us, ripples as short light strokes.
const water = (y, h, seed = 1, keys = "PpZz") => [vgrad(0, y, TW, h, keys, 1, 2),
  (c) => { const r = c.rng(seed); for (let i = 0; i < h * 6; i++) { const x = Math.floor(r() * TW), yy = y + 1 + Math.floor(r() * (h - 2)), t = (yy - y) / h; c.hline(x, yy, 2 + Math.floor(r() * (2 + t * 6)), t < 0.4 ? "4" : "P") } }]
// Reeds: thin stalks with a dark seed head, painted on the near bank.
sprite("_reed_a", ".w.\n.c.\n.c.\nc.c")
sprite("_reed_b", "w..\nc..\n.c.\n.c.\ncA.")
group("_reed", ["_reed_a", "_reed_b"])
// White chalk or limestone cliff: vertical fissures, lit faces, a grassy top.
const cliff = (x0, x1, top, base, keys = "lmM0") => (c) => {
  const r = c.rng(x0 + top)
  for (let x = x0; x < x1; x++) { const t = top + Math.round(Math.sin(x / 9) * 2 + Math.sin(x / 3.7)); c.vline(x, t, base - t, keys[(x % 11 < 6) ? 0 : 1]); c.px(x, t, "c"); c.px(x, t + 1, "A") }
  for (let x = x0 + 3; x < x1; x += 4 + Math.floor(r() * 5)) c.vline(x, top + 4 + Math.floor(r() * 4), base - top - 6 - Math.floor(r() * 6), keys[2])
  for (let x = x0; x < x1; x += 2) c.px(x, base - 1, keys[3])
}
// An antique chart: parchment land, sea in hatched teal, rivers, hachured mountains, forests in little trees, Latin names.
const MW = 640, MH = 280
