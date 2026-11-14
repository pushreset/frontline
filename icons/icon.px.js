// Ligne de Front — app icons (PWA, home screen): the favicon's pennant on the neutral menu charcoal.
// Build (writes icons/out/sprites/): node ~/.claude/skills/pxl-pixel-art/bin/pxl.js build icons/icon.px.js --no-preview
// Full-bleed square, the pennant inside the central 80 %: the same picture works as a maskable icon.
pal({ k: "#2c2a26", b: "#d9b56a", p: "#dccba3", s: "#b9a26d" })
const PENNANT = [                  // 16 x 16, as the favicon
  [4, 2, 1, 12, "b"], [3, 13, 4, 1, "b"],
  [5, 3, 6, 1, "p"], [5, 4, 7, 1, "p"], [5, 5, 8, 1, "p"], [5, 6, 8, 1, "s"], [5, 7, 6, 1, "s"],
]
for (const size of [180, 192, 512]) {
  const u = size / 16
  sprite("icon-" + size, { w: size, h: size }, (c) => {
    c.rect(0, 0, size, size, "k")
    for (const [x, y, w, h, col] of PENNANT) c.rect(Math.round(x * u), Math.round(y * u), Math.round(w * u), Math.round(h * u), col)
  })
}
