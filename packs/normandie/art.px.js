// Normandy 1944 — card (128x80) and terrain (320x144) illustrations, at the resolution of the Gallic Wars.
// Build (writes packs/normandie/out/): node ~/.claude/skills/pxl-pixel-art/bin/pxl.js build packs/normandie/art.px.js --no-preview
//
// "État-major 1944": olive drab, khaki, feldgrau, bocage greens, Norman stone, a grey-green Channel.
// Style rules (shared with every pack, see packs/art-lib.px.js): one light from the top left, hue-shifted ramps,
// warm outlines around figures only, three depths per landscape, no filler speckle, fire glows (D L K).
// Allied figures and vehicles face right, the Germans' versions (_x) are the same scenes in feldgrau.
pal({
  k: "#16120f",                                                                     // outline
  1: "#56789a", "+": "#6886a6", 2: "#7d9ab3", "=": "#94afc2", 3: "#adc3cd", "~": "#c4d3d2", 4: "#dad9cb", 5: "#f2ead6",   // sky, cloud
  6: "#8c9a8e", "%": "#73866e", "&": "#5b6d55",                                     // far hills and woods in the haze
  a: "#1d2816", A: "#30441d", c: "#4c672a", "^": "#5f7c36", C: "#7b9644", d: "#a7ae63",   // bocage greens
  t: "#3c2c20", T: "#674c35", q: "#937150", Q: "#c09f71",                           // earth, lanes, dust
  0: "#45413b", M: "#6c6860", m: "#9a9487", l: "#cbc4b1",                           // Caen stone, concrete
  z: "#1c2a31", Z: "#2e4954", p: "#4d707c", P: "#84a5aa",                           // the Channel, rivers
  w: "#291b13", W: "#513828", x: "#7d573b", X: "#ab8356",                           // wood, leather, rifle stocks
  o: "#584318", O: "#8a6a2a", y: "#c39a44", Y: "#e6c873",                           // wheat, straw, brass
  u: "#2b2f17", U: "#474d27", v: "#676f37", V: "#8c934e",                           // US olive drab
  g: "#2a302b", G: "#454d45", h: "#6a7368", H: "#929a8c",                           // German feldgrau
  7: "#5b482b", 8: "#877043", 9: "#b39a65",                                         // khaki: webbing, gaiters, canvas, battledress
  e: "#472a20", E: "#7a4a35", f: "#b27759", F: "#deac8a",                           // skin
  i: "#2f343b", I: "#545b64", j: "#858d95", J: "#c6cccf",                           // steel, gun metal
  r: "#3f1517", R: "#752228", s: "#a8392d", S: "#d76549",                           // brick, red cross, flags
  b: "#151c2c", B: "#273550", n: "#43587e", N: "#7c93b6",                           // night, insignia blue
  D: "#c9501f", L: "#f0a43a", K: "#fbeeb0",                                         // fire
})
ramps("1+2=3~45", "&%6345", "kaAc^Cd", "ktTqQ", "k0Mml", "kzZpP", "kwWxX", "koOyY", "kuUvV", "kgGhH", "k789", "keEfF", "kiIjJ", "krRsS", "kbBnN", "DLK")
include("../art-lib.px.js")

const AXIS = { V: "H", v: "h", U: "G", u: "g", 9: "G", 8: "7" }                       // olive drab -> feldgrau, gaiters -> jackboots
const BACK = { V: "v", v: "U", U: "u", H: "h", h: "G", G: "g", F: "f", f: "E", E: "e", 9: "8", 8: "7", X: "x", x: "W", W: "w", J: "j", j: "I", I: "i", l: "m", m: "M", S: "s", s: "R" }
const NIGHT = { V: "n", v: "B", U: "b", u: "b", H: "n", h: "B", G: "b", g: "b", F: "N", f: "n", E: "B", e: "b", 9: "B", 8: "b", 7: "b", X: "B", x: "b", W: "b", w: "b", J: "N", j: "n", I: "B", i: "b", y: "n", s: "B", S: "n", R: "b", r: "b", l: "N", m: "n", M: "B" }

// ------------------------------------------------------------------ figures (about 36 px tall)
// GI advancing, facing right: M1 helmet, olive drab jacket and trousers, webbing belt with pouches, canvas
// leggings, the M1 rifle held forward at the hip. Light from the left: the near side is the lit one.
const GI = `
  .........VVVV...............
  ........VVvvvV..............
  .......VvVvvvvU.............
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
  ......Vv8Vvvvvvv8fFWWWWWWj..
  ......VvvVvvvvvvU.ff........
  ......VvvVvvvvvvU...........
  ......Uvvvvvvvvvv...........
  ......U888y88888U...........
  ......U8v8vvvv8vU...........
  ......UUvvvvvvvUU...........
  .......UUUUUUUUU............
  .......UUUU.UUUUU...........
  .......UUUU..UUUU...........
  ......UUUU....UUUU..........
  ......UUU......UUUU.........
  .....UUUU.......UUU.........
  .....UUU........UUUU........
  .....UUU.........UUU........
  ....999..........9999.......
  ....9999..........999.......
  ....999...........9999......
  ...WWWW...........WWWWW.....
  ..WWWWW...........WWWWWW....`
// Kneeling, aiming the rifle along the cheek.
const KNEEL = `
  .........VVVV.................
  ........VVvvvV................
  .......VvVvvvvU...............
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
  ......Vv8Vvvvvvv8.............
  ......VvvVvvvvvvU.............
  ......U888y88888U.............
  ......UUvvvvvvvUU.............
  ......UUUUUUUUUUUUUUU.........
  .......UUUUUUUUUUUUUUU........
  .......UUUU.......UUUU........
  ......UUUU........UUUU........
  .....UUUU.........9999........
  ....UUUU..........999.........
  ...999999.........999.........
  ..WW999999........WWWW........
  .WWWWWWWWW........WWWWW.......`
const put = (grid, rows) => { const r = grid.split("\n").filter((x) => x.trim()).map((x) => x.trim()); for (const [i, s] of Object.entries(rows)) r[i] = s; return r.join("\n") }
// German Stahlhelm: flared skirt over the ears and neck.
const STAHL = { 0: ".........HHHH...............", 1: "........HhhhhH..............", 2: ".......HhHhhhhG.............", 3: "......GGhhhhhhGG............", 4: "......GG.EfFFFG............." }
const STAHLK = { 0: ".........HHHH.................", 1: "........HhhhhH................", 2: ".......HhHhhhhG...............", 3: "......GGhhhhhhGG..............", 4: "......GG.EfFFFfFXxxxxxxxxjjjJ" }
sprite("_gi", { outline: "k" }, GI)
sprite("_kneel", { outline: "k" }, KNEEL)
sprite("_gi_x", { outline: "k", swap: AXIS }, put(GI, STAHL))
sprite("_kneel_x", { outline: "k", swap: AXIS }, put(KNEEL, STAHLK))
// Officer: soft cap with a peak instead of the helmet, binoculars on the chest.
const CAP = { 0: "............................", 1: ".........vvvv...............", 2: "........VvvvvU..............", 3: ".......UUUUUkkk.............", 14: "......Vv8Vvvvvvv8fF.........", 13: "......VvvVvvvvvvUff.........", 11: "......VvvVvvivvvU...........", 12: "......VvvVvviivvvU.........." }
sprite("_officer", { outline: "k" }, put(GI, CAP))
sprite("_officer_x", { outline: "k", swap: AXIS }, put(GI, { ...CAP, 1: ".........hhhh...............", 2: "........HhhhhGG.............", 3: ".......GGGGGkkk............." }))
// Résistant: a beret, a civilian jacket and trousers, a Sten gun.
sprite("_resist", { outline: "k", swap: { V: "m", v: "M", U: "0", u: "0", 9: "0", 8: "W", y: "0" } },
  put(GI, { 0: "............................", 1: "........bbbbb...............", 2: ".......bBBBBBb..............", 3: "........bbbbbb..............", 13: "......VvvVvvvvvvUffjjjjiiJ..", 14: "......Vv8Vvvvvvv8fFij.......", 15: "......VvvVvvvvvvU.f.........", 4: ".........EfFFF.............." }))
// British commando: green beret, khaki battledress.
sprite("_commando", { outline: "k", swap: { V: "9", v: "8", U: "7", u: "7", 9: "7" } },
  put(GI, { 0: "............................", 1: "........AAAAA...............", 2: ".......AcccccA..............", 3: "........AAAAAAk.............", 4: ".........EfFFF.............." }))
sprite("_commando_k", { outline: "k", swap: { V: "9", v: "8", U: "7", u: "7", 9: "7" } },
  put(KNEEL, { 0: "..............................", 1: "........AAAAA.................", 2: ".......AcccccA................", 3: "........AAAAAAk...............", 4: ".........EfFFFfFXxxxxxxxxjjjJ" }))
// Paratrooper hanging under his canopy.
sprite("_chute", { w: 30, h: 40 }, (c) => {
  c.ellipse(15, 13, 14, 11, "5"); c.rect(0, 13, 30, 27, "_")                                                   // the canopy, top half
  c.light([10, 6, 6]); c.recolor({ 5: "4" }, (x, y) => x > 18 && y > 6); c.hline(1, 12, 28, "~")
  for (const x of [6, 12, 18, 24]) c.vline(x, 3, 9, x > 16 ? "~" : "4")                                       // gores
  for (const x of [2, 9, 21, 28]) c.line(x, 13, 15, 27, "M")                                                   // rigging lines
  c.grid(13, 25, ".VV.\nVvvU\n.EF.\nvvvU\nvUvU\nU..U\n9..9\nW..W")                                               // the man
})

// ------------------------------------------------------------------ vehicles (side view, facing right)
// Tank at twice the old scale: track run with road wheels and return rollers, hull, turret, gun, stowage.
// Sherman / Firefly / Jumbo (olive drab), Panzer IV with skirts, StuG III casemate (feldgrau).
function tank(name, { gun = 18, brake = false, turret = true, skirt = false, cross = false, swap, jumbo = false } = {}) {
  sprite(name, { w: 100, h: 46, outline: "k", swap }, (c) => {
    const Y = 8
    // tracks: dark band, link texture, road wheels (lit on the upper left), sprocket and idler
    c.poly([8, Y + 26, 74, Y + 26, 80, Y + 32, 74, Y + 40, 12, Y + 40, 4, Y + 33], "i")
    for (let x = 8; x < 76; x += 3) { c.px(x, Y + 26, "I"); c.px(x + 1, Y + 39, "I") }
    for (const x of [16, 26, 36, 46, 56, 66]) { c.circ(x, Y + 34, 4, "I"); c.circ(x - 1, Y + 33, 2, "j"); c.px(x, Y + 34, "i") }
    c.circ(75, Y + 31, 3, "I"); c.px(75, Y + 31, "j"); c.circ(8, Y + 31, 3, "I"); c.px(8, Y + 31, "j")
    for (const x of [22, 42, 62]) { c.circ(x, Y + 27, 1, "I") }
    // hull: lit top edge, sloped glacis, shaded lower side, bolts along the sponson
    c.poly([10, Y + 16, 58, Y + 16, 76, Y + 22, 77, Y + 27, 6, Y + 27, 6, Y + 20], "v")
    c.hline(10, Y + 16, 48, "V"); c.poly([58, Y + 16, 76, Y + 22, 76, Y + 24, 60, Y + 18], "V")
    c.rect(6, Y + 23, 71, 4, "U"); c.hline(6, Y + 22, 71, "u")
    for (let x = 12; x < 72; x += 6) c.px(x, Y + 20, "U")
    c.rect(8, Y + 18, 7, 5, "8"); c.hline(8, Y + 18, 7, "9"); c.vline(11, Y + 18, 5, "7")                     // bedroll
    c.rect(62, Y + 20, 6, 2, "j"); c.px(61, Y + 20, "J")                                                      // headlight guard
    if (turret) {
      c.poly([24, Y + 4, 48, Y + 4, 54, Y + 8, 54, Y + 16, 20, Y + 16, 20, Y + 8], "v")
      c.hline(24, Y + 4, 24, "V"); c.poly([20, Y + 8, 24, Y + 4, 30, Y + 4, 26, Y + 8], "V"); c.rect(20, Y + 13, 34, 3, "U")
      c.rect(54, Y + 8, 4, 7, "U"); c.vline(54, Y + 8, 7, "v")                                                 // mantlet
      c.rect(30, Y + 2, 9, 2, "U"); c.hline(31, Y + 1, 7, "u")                                                // hatch
      c.rect(58, Y + 10, gun, 2, "v"); c.hline(58, Y + 10, gun, "V"); c.hline(58, Y + 12, gun, "U")             // gun
      if (brake) { c.rect(56 + gun, Y + 9, 4, 5, "U"); c.vline(56 + gun, Y + 9, 5, "v") }
      c.line(22, Y + 4, 17, Y - 8, "j"); c.px(17, Y - 9, "J")                                                 // antenna
      if (jumbo) { c.rect(26, Y + 6, 24, 1, "U"); c.rect(14, Y + 18, 40, 1, "U"); for (const x of [16, 30, 44]) c.rect(x, Y + 19, 6, 3, "U") }   // welded plates
    } else {                                                                                                // casemate assault gun
      c.poly([18, Y + 8, 54, Y + 8, 64, Y + 16, 14, Y + 16], "v"); c.hline(18, Y + 8, 36, "V"); c.rect(14, Y + 14, 50, 2, "U")
      c.rect(56, Y + 10, 5, 6, "U"); c.rect(61, Y + 12, gun, 2, "v"); c.hline(61, Y + 12, gun, "V"); c.hline(61, Y + 14, gun, "U")
      c.rect(57 + gun, Y + 10, 4, 6, "U")
    }
    if (skirt) { c.rect(10, Y + 23, 62, 8, "U"); for (const x of [22, 34, 46, 58]) c.vline(x, Y + 23, 8, "u"); c.hline(10, Y + 23, 62, "v"); if (turret) c.rect(18, Y + 7, 38, 7, "U"), c.hline(18, Y + 7, 38, "v") }
    // markings: the white Allied star, or the black-and-white cross
    if (cross) c.grid(33, Y + 17, ".5.5.\n5k5k5\n.kkk.\n5k5k5\n.5.5.")
    else c.grid(32, Y + 17, "...5...\n...5...\n5555555\n.55555.\n.55.55.\n.5...5.")
  })
}
tank("_sherman")
tank("_firefly", { gun: 32, brake: true })
tank("_jumbo", { gun: 20, jumbo: true })
tank("_sherman_x", { gun: 26, brake: true, skirt: true, cross: true, swap: AXIS })     // Panzer IV H
tank("_firefly_x", { gun: 22, turret: false, cross: true, swap: AXIS })               // StuG III

// Fighter in profile, facing right. fat = P-47 / Typhoon / Fw 190 radial or chin radiator, slim = Spitfire / Bf 109.
// Allied aircraft carry the black-and-white invasion stripes of June 1944.
function plane(name, { fat = true, mark = "us", swap, nose, stripes = true } = {}) {
  sprite(name, { w: 92, h: 34, outline: "k", swap }, (c) => {
    const body = fat ? [6, 15, 18, 12, 60, 10, 76, 12, 82, 17, 76, 25, 56, 27, 20, 21, 6, 19] : [6, 15, 18, 13, 60, 12, 76, 13, 84, 17, 76, 23, 56, 25, 20, 20, 6, 19]
    c.poly(body, "v")
    c.light((x, y) => c.is(x, y, "v") && y < (fat ? 15 : 15.5), 1); c.shade((x, y) => c.is(x, y, "v") && y > (fat ? 21 : 20), 1)
    c.poly([6, 15, 2, 3, 10, 3, 20, 13], "v"); c.vline(4, 5, 10, "U"); c.hline(5, 4, 4, "V")                   // fin, rudder
    c.poly([0, 16, 14, 15, 14, 18, 0, 18], "U")                                                                // tailplane
    c.poly(fat ? [42, 10, 46, 5, 56, 5, 60, 10] : [44, 12, 48, 7, 56, 7, 60, 12], "p"); c.poly(fat ? [44, 9, 47, 6, 51, 6, 49, 9] : [46, 11, 49, 8, 52, 8, 50, 11], "P")   // canopy, its glint
    c.vline(52, fat ? 5 : 7, 5, "i")
    c.poly([28, 20, 62, 20, 56, 24, 26, 24], "U"); c.hline(28, 20, 34, "u")                                    // wing root
    for (let x = 24; x < 74; x += 10) c.vline(x, fat ? 11 : 13, 2, "U")                                        // panel lines
    if (fat) { c.rect(74, 11, 6, 15, nose || "U"); c.vline(74, 11, 15, "u") } else c.poly([76, 13, 84, 17, 76, 23], nose || "j")   // cowling / spinner
    c.vline(fat ? 82 : 86, 6, 22, "j"); c.px(fat ? 82 : 86, 17, "I")                                            // prop disc
    if (stripes && mark !== "x") for (let i = 0; i < 5; i++) c.rect(30 + i * 3, 11, 3, 13, i % 2 ? "k" : "5")  // invasion stripes
    if (mark === "us") { c.circ(18, 16, 4, "n"); c.circ(18, 16, 3, "B"); c.grid(16, 14, "..5..\n55555\n.555.\n.5.5.") }
    if (mark === "raf") { c.circ(18, 16, 4, "B"); c.circ(18, 16, 3, "5"); c.circ(18, 16, 1, "s"); c.recolor({ v: "^", V: "C", U: "c" }, [46, 22, 70, 22, 60, 12, 54, 12]) }
    if (mark === "x") c.grid(24, 13, ".5.5.\n5k5k5\n.kkk.\n5k5k5\n.5.5.")
  })
}
plane("_p47")
plane("_spitfire", { fat: false, mark: "raf" })
plane("_typhoon", { mark: "raf", nose: "j" })
plane("_p47_x", { mark: "x", swap: AXIS, nose: "y" })                                  // Fw 190, yellow nose
plane("_spitfire_x", { fat: false, mark: "x", swap: AXIS, nose: "y" })                 // Bf 109
// Heavy bomber seen from below, far away; and its bombs.
sprite("_bomber", { outline: "k" }, `
  .............MM.............
  ............MmmM............
  MMMMMMMMMMMMMmmMMMMMMMMMMMMM
  MmmmmmmmmmmmmmmmmmmmmmmmmmmM
  .MMMMMMMMMMMMmmMMMMMMMMMMMM.
  ......M.....MmmM.....M......
  ............MmmM............
  ...........MMmmMM...........
  ..........MMM..MMM..........`)
// Explosion: a fireball at the base, a column of dark smoke rolling up, debris.
sprite("_boom", { w: 34, h: 32 }, (c) => {
  for (const [x, y, r, k] of [[17, 10, 8, "0"], [9, 14, 6, "M"], [25, 13, 6, "M"], [17, 4, 4, "M"], [12, 6, 4, "0"]]) { c.circ(x, y, r, k); c.circ(x - 2, y - 2, Math.max(1, r - 4), "m") }
  c.circ(17, 22, 9, "D"); c.circ(17, 22, 6, "L"); c.circ(17, 23, 3, "K")
  c.poly([0, 32, 8, 24, 26, 24, 34, 32], "D"); c.poly([6, 32, 12, 26, 22, 26, 28, 32], "L")
  for (const [x, y] of [[2, 18], [31, 16], [5, 8], [29, 5], [33, 24]]) c.rect(x, y, 2, 2, "k")
})
// Two-and-a-half-ton truck ("Jimmy"), canvas tilt over the bed.
sprite("_truck", { w: 76, h: 40, outline: "k" }, (c) => {
  c.rect(2, 6, 44, 22, "8"); c.hline(4, 4, 40, "8"); c.hline(2, 6, 44, "9"); c.poly([2, 6, 4, 4, 44, 4, 46, 6], "9")   // canvas tilt
  for (const x of [12, 24, 36]) c.vline(x, 6, 21, "7")
  c.rect(2, 26, 44, 5, "U"); c.hline(2, 26, 44, "v")                                                         // bed
  c.rect(48, 12, 12, 19, "v"); c.rect(50, 14, 8, 6, "p"); c.px(51, 15, "P"); c.hline(48, 12, 12, "V")        // cab, windscreen
  c.rect(60, 20, 14, 11, "v"); c.hline(60, 20, 14, "V"); c.vline(73, 21, 10, "U"); c.rect(70, 23, 3, 4, "U") // bonnet, grille
  c.grid(64, 22, "..5..\n55555\n.5.5.")
  c.hline(2, 31, 72, "u")
  for (const x of [12, 24, 64]) { c.circ(x, 34, 5, "i"); c.circ(x, 34, 3, "I"); c.circ(x - 1, 33, 1, "j") }
})
// Landing craft (LCVP, "Higgins boat"), ramp up, men's helmets showing above the side.
sprite("_lcvp", { w: 56, h: 22, outline: "k" }, (c) => {
  c.poly([4, 6, 44, 6, 44, 18, 8, 18], "M"); c.hline(4, 6, 40, "m"); c.hline(8, 16, 36, "0")
  c.poly([44, 6, 47, 6, 56, 18, 44, 18], "0"); c.hline(44, 6, 3, "M")                                         // ramp
  c.rect(6, 0, 10, 6, "M"); c.rect(8, 2, 4, 2, "p")                                                           // coxswain's shelter
  for (const x of [20, 26, 32, 38]) c.grid(x, 2, ".VV.\nVvvU\nUUUU")
  c.hline(0, 20, 56, "5"); c.hline(4, 21, 48, "P")
})
// Czech hedgehog beach obstacle, three crossed steel beams.
sprite("_hedgehog", { outline: "k" }, `
  I...........I
  jI.........Ij
  .jI.......Ij.
  ..jI.....Ij..
  ...jI...Ij...
  ....jIjIj....
  .....IjI.....
  ....jIjIj....
  ...jI.I.Ij...
  ..jI..I..Ij..
  .jI...I...Ij.
  jI....I....Ij`)
// Trees: a hedgerow oak, a poplar, a bush, a pine (snowy or not), a drowned dead tree.
const oak = (name, s = 1) => sprite(name, { w: Math.round(40 * s), h: Math.round(50 * s) }, (c) => {
  const R = (v) => Math.round(v * s)
  c.rect(R(18), R(28), R(5), R(22), "W"); c.vline(R(18), R(28), R(22), "x"); c.line(R(20), R(32), R(10), R(24), "W", 2); c.line(R(21), R(30), R(30), R(22), "W", 2)
  for (const [x, y, r] of [[20, 16, 13], [9, 22, 9], [31, 22, 9], [14, 10, 8], [27, 11, 8]]) c.circ(R(x), R(y), R(r), "A")
  for (const [x, y, r] of [[18, 14, 10], [8, 20, 6], [29, 20, 6], [13, 8, 6], [25, 9, 6]]) c.circ(R(x - 1), R(y - 1), R(r - 1), "c")
  for (const [x, y, r] of [[14, 10, 5], [6, 18, 3], [24, 7, 3], [11, 6, 3]]) c.circ(R(x), R(y), R(r), "C")
  for (const [x, y] of [[8, 14], [15, 4], [26, 4], [4, 21]]) c.px(R(x), R(y), "d")
  c.shade((x, y) => c.is(x, y, "cC") && x > R(28), 1)
})
oak("_oak"); oak("_oak_big", 1.6); oak("_oak_small", 0.65)
sprite("_poplar", { w: 14, h: 52 }, (c) => {
  c.ellipse(7, 22, 6, 22, "A"); c.ellipse(6, 21, 4, 19, "c"); c.ellipse(5, 18, 2, 14, "C"); c.vline(7, 44, 8, "W")
  for (let y = 6; y < 40; y += 5) c.px(4 + (y % 3), y, "d")
})
sprite("_bush", { w: 28, h: 12 }, (c) => {
  for (const [x, y, r] of [[5, 7, 5], [12, 5, 6], [20, 6, 5], [24, 8, 4]]) c.circ(x, y, r, "A")
  for (const [x, y, r] of [[4, 6, 3], [11, 4, 4], [19, 5, 3]]) c.circ(x, y, r, "c")
  for (const [x, y] of [[3, 4], [10, 2], [18, 3]]) c.px(x, y, "C")
  c.rect(0, 10, 28, 2, "a")
})
const pine = (name, s = 1, snow = false, swap) => sprite(name, { w: Math.round(30 * s), h: Math.round(54 * s), swap }, (c) => {
  const R = (v) => Math.round(v * s), m = R(15)
  c.rect(m - R(1), R(44), Math.max(2, R(3)), R(10), "W")
  for (const [y, hw] of [[32, 14], [22, 12], [12, 9], [3, 6]]) {
    c.poly([m - R(hw), R(y + 14), m, R(y), m + R(hw), R(y + 14)], "A"); c.poly([m - R(hw) + 2, R(y + 12), m, R(y + 2), m - 1, R(y + 12)], "c")
    if (snow) { c.poly([m - R(hw - 3), R(y + 11), m, R(y), m + R(1), R(y + 5), m - R(3), R(y + 11)], "5"); c.hline(m - R(hw), R(y + 14) - 1, R(hw), "4") }
  }
})
pine("_pine"); pine("_pine_far", 0.6, false, { A: "&", c: "%", W: "&" }); pine("_pine_snow", 1, true); pine("_pine_big", 1.6, true)
sprite("_dead", { w: 30, h: 52 }, (c) => {
  c.line(14, 51, 16, 8, "M", 3); c.line(16, 24, 26, 10, "M", 2); c.line(14, 32, 4, 18, "M", 2); c.line(16, 14, 10, 2, "M"); c.line(24, 14, 28, 16, "M")
  c.vline(13, 12, 39, "0")
})

// ------------------------------------------------------------------ cards (128x80)
function unit(name, build) {
  scene("c_" + name, { w: CW, h: CH }, ...build(""))
  scene("c_" + name + "_x", { w: CW, h: CH }, ...build("_x"))
}
const reward = (name, ...items) => unit(name, () => items)
const order = (name, ...items) => scene("c_" + name, { w: CW, h: CH }, ...items)
// Bocage backdrop: sky, far hills, a hedge line with oaks, a meadow.
const bocage = (seed = 1, hor = 40, sk = "1+2=3~4") => [sky(CW, hor, sk), stamp("_cloud_b", 12 + seed * 23 % 70, 6 + seed % 3 * 4), stamp("_cloud_far", 70 - seed * 11 % 40, 24),
  hills(hor - 6, 3, "6", seed, 70), treeline(hor, 3, "%", "&", seed + 3, CW, 70), ...meadow(hor + 2, CW, CH - hor - 2, seed, 50)]
// Ploughed field converging to the horizon.
const furrows = (y0, y1, key) => (c) => { for (let i = 1, y = y0 + 1; y < y1; y += i++ + 1) c.hline(0, y, CW, key) }
// A dirt road across the foreground, with tracks.
const lane = (y, h = 10) => [poly([0, y + 2, CW, y, CW, y + h, 0, y + h + 2], "q"), line(0, y + 4, CW, y + 2, "T"), line(0, y + h - 2, CW, y + h - 4, "T"), hline(0, y + h + 1, CW, "a")]


// Muzzle blast, pointing right: a flash and its smoke.
const blast = (x, y) => [poly([x, y, x + 18, y - 6, x + 14, y, x + 18, y + 6], "L"), poly([x, y, x + 10, y - 3, x + 8, y, x + 10, y + 3], "K"), circ(x + 1, y, 3, "K"),
  (c) => { for (const [dx, dy, r] of [[22, -6, 6], [28, -12, 5], [18, -14, 4]]) { c.circ(x + dx, y + dy, r, "m"); c.circ(x + dx - 1, y + dy - 1, Math.max(1, r - 2), "4") } }, glow("LK", { r: 8, strength: 0.4 })]
// Dust behind a vehicle, lit on top.
const dustL = (x, y) => layer("dust", dust([[x, y, 6], [x - 8, y - 4, 5], [x + 6, y + 2, 4], [x - 4, y + 4, 4]]))
// Sandbags: a low wall of stacked bags.
const sandbags = (x, y, n = 4, rows = 2) => (c) => { for (let r = 0; r < rows; r++) for (let i = 0; i < n - r; i++) { const bx = x + i * 8 + r * 4, by = y - r * 4; c.ellipse(bx, by, 4, 2, "8"); c.hline(bx - 3, by - 1, 6, "9"); c.hline(bx - 3, by + 2, 7, "7") } }

unit("sherman", (x) => [
  ...bocage(1, 40), stamp("_poplar", 104, -4), stamp("_poplar", 116, 0),
  furrows(44, 66, "^"), ...lane(64, 12), dustL(10, 66),
  layer("shadow", { shade: true }, shadowAt(18, 74, 76)),
  stamp(x ? "_sherman_x" : "_sherman", 16, 30),
])
unit("firefly", (x) => [
  ...bocage(3, 44, "+=~89"), stamp("_oak", -10, 4),
  furrows(46, 68, "c"), poly([0, 68, CW, 66, CW, CH, 0, CH], "T"), hline(0, 76, CW, "t"),
  layer("shadow", { shade: true }, shadowAt(4, 74, 76)),
  stamp(x ? "_firefly_x" : "_firefly", 0, 28), ...blast(x ? 84 : 98, 46),
])
unit("section", (x) => [
  ...bocage(2, 32), (c) => { for (let bx = -6; bx < CW; bx += 26) c.stamp("_bush", bx, 26) }, hline(0, 36, CW, "a"),
  layer("shadow", { shade: true }, shadowAt(10, 76, 18), shadowAt(50, 78, 18), shadowAt(92, 76, 18)),
  stamp("_gi" + x, 4, 38, { swap: BACK }), stamp("_gi" + x, 44, 42), stamp("_gi" + x, 86, 38, { swap: BACK }),
])
unit("rangers", (x) => [
  sky(CW, 52), stamp("_cloud_a", 4, 6),
  ...water(52, 28, 4, "PpZz").map((f) => f),
  // Pointe du Hoc: the cliff face in shadow, strata, the grassy lip, the grappling ropes
  poly([52, 80, 60, 44, 68, 40, 128, 36, 128, 80], "M"), poly([52, 80, 60, 44, 68, 40, 72, 40, 66, 80], "0"),
  (c) => { for (const [sx, sy, len] of [[76, 50, 44], [72, 60, 50], [80, 70, 40]]) { c.hline(sx, sy, len, "0"); c.hline(sx + 4, sy + 1, len - 10, "m") } },
  hline(68, 38, 60, "c"), hline(72, 36, 56, "^"), poly([68, 40, 128, 36, 128, 38, 68, 41], "A"),
  line(66, 42, 60, 80, "8"), line(74, 40, 70, 80, "8"), px(66, 41, "j"), px(74, 39, "j"),
  stamp(x ? "_gi_x" : "_commando", 76, 4, x ? {} : { swap: { A: "U", c: "v" } }), stamp("_kneel" + x, 100, 12, { flip: "x" }),
])
unit("mortiers", (x) => [
  ...bocage(5, 36), poly([0, 70, CW, 68, CW, CH, 0, CH], "q"), hline(0, 69, CW, "T"),
  stamp("_kneel" + x, 14, 40),
  line(76, 68, 92, 42, "I", 3), line(77, 67, 92, 43, "j"), line(92, 46, 100, 70, "i"), line(92, 46, 88, 70, "i"), rect(68, 69, 16, 3, "i"),   // tube, bipod, baseplate
  rect(93, 16, 2, 6, "I"), px(93, 15, "s"), (c) => { for (const [dx, dy, r] of [[94, 32, 3], [90, 36, 3], [96, 26, 2]]) c.circ(dx, dy, r, "4") },   // round leaving
  sandbags(102, 70, 3, 2),
])
unit("paras", (x) => [
  sky(CW, 72, "1+2=38"), stamp("_cloud_a", 88, 44), stamp("_cloud_b", 0, 52),
  stamp("_bomber", 4, 6, { swap: { M: "0", m: "M" } }), stamp("_bomber", 70, 14, { swap: { M: "&", m: "%" } }),
  stamp("_chute", 22, 12), stamp("_chute", 66, 4), stamp("_chute", 92, 30),
  (c) => { for (const [px_, py] of [[54, 24], [114, 12], [12, 28]]) { c.ellipse(px_, py, 3, 2, "5"); c.rect(px_ - 3, py, 7, 2, "_"); c.vline(px_, py, 4, "M") } },   // far canopies
  treeline(74, 2, "%", "&", 4, CW, 80), rect(0, 76, CW, 4, "a"),
])
unit("p47", (x) => [
  sky(CW, 68, "1+2=3"), stamp("_cloud_a", 90, 10), stamp("_cloud_b", 4, 44), stamp("_cloud_a", 66, 56),
  // the bocage far below: fields and hedges, tiny
  (c) => { const r = c.rng(3); c.rect(0, 68, CW, 12, "^"); for (let i = 0; i < 18; i++) { const fx = Math.floor(r() * CW), fy = 68 + Math.floor(r() * 10); c.rect(fx, fy, 8 + Math.floor(r() * 10), 3, ["C", "d", "c", "y"][i % 4]) } c.hline(0, 68, CW, "A") },
  hline(0, 26, 12, "~"), hline(4, 38, 10, "~"),
  stamp("_p47" + x, 14, 14),
])
unit("spitfire", (x) => [
  sky(CW, 80, "1+2=3"), circ(18, 14, 8, "5"), ring(18, 14, 11, "4"), glow("5", { where: [18, 14, 9], r: 10, strength: 0.3 }),
  (c) => { for (let i = 0; i < 12; i++) { c.circ(i * 12 - 4, 74 + (i % 3) * 2, 9, "4"); c.circ(i * 12 - 6, 72 + (i % 3) * 2, 7, "5") } },   // cloud deck
  hline(0, 30, 10, "~"), hline(2, 44, 12, "~"),
  stamp("_spitfire" + x, 16, 18),
])
unit("genie", (x) => [
  ...bocage(6, 32), stamp("_oak", 88, -12),
  ...water(56, 24, 6, "PpZz"),
  poly([0, 52, 40, 48, 48, 80, 0, 80], "q"), poly([28, 50, 40, 48, 48, 80, 38, 80], "T"),                       // near bank
  // the Bailey bridge: steel panels of crossed girders over a timber deck
  rect(36, 44, 92, 5, "W"), hline(36, 44, 92, "x"),
  box(44, 28, 84, 16, "I"), (c) => { for (let bx = 44; bx < 124; bx += 16) { c.line(bx, 42, bx + 15, 29, "I"); c.line(bx, 29, bx + 15, 42, "I"); c.vline(bx, 28, 16, "j") } },
  layer("refl", { shade: true }, rect(36, 56, 92, 4, "k")),
  stamp("_kneel" + x, 4, 20), line(26, 38, 34, 26, "W", 2), rect(32, 24, 6, 3, "I"),                           // sledgehammer
])
unit("officier", (x) => [
  // inside the command tent: canvas slopes, a map table, the field radio, a hanging lamp
  rect(0, 0, CW, CH, "8"), poly([0, 0, CW, 0, CW, 24, 0, 40], "9"), poly([0, 40, CW, 24, CW, 28, 0, 44], "7"), vline(80, 0, 60, "7"),
  rect(0, 64, CW, 16, "T"), hline(0, 64, CW, "q"),
  rect(84, 48, 40, 3, "x"), vline(88, 51, 13, "W"), vline(118, 51, 13, "W"), rect(90, 42, 26, 6, "l"), (c) => { c.line(94, 44, 108, 44, "s"); c.px(100, 46, "n"); c.line(96, 46, 110, 43, "n") },
  rect(52, 44, 18, 20, "U"), rect(54, 46, 14, 6, "u"), px(56, 54, "L"), px(62, 54, "s"), rect(58, 56, 8, 2, "i"), vline(66, 8, 36, "I"),   // radio
  stamp("_officer" + x, 10, 30), wire(36, 40, 54, 50, 4, "k"),
  circ(104, 10, 3, "L"), px(104, 9, "K"), vline(104, 0, 7, "I"), glow("LK", { r: 26, strength: 0.45 }),
])
unit("resistance", (x) => [
  sky(CW, 18, "2=89"),
  // a farm wall of rough Norman stone, the barn door, a painted V
  rect(0, 12, CW, 56, "m"), (c) => { for (let y = 18; y < 68; y += 6) { c.hline(0, y, CW, "M"); for (let bx = (y % 12) ? 0 : 6; bx < CW; bx += 12) c.vline(bx, y - 5, 5, "M") } },
  poly([0, 12, CW, 12, CW, 6, 0, 8], "R"), hline(0, 12, CW, "W"), poly([0, 8, CW, 6, CW, 4, 0, 6], "s"),
  rect(88, 26, 26, 42, "W"), rect(90, 28, 22, 40, "x"), vline(101, 28, 40, "W"), (c) => { for (let y = 32; y < 68; y += 6) c.hline(90, y, 22, "W") }, px(97, 50, "Y"),
  line(52, 24, 58, 40, "5", 2), line(58, 40, 64, 24, "5", 2),
  rect(0, 68, CW, 12, "0"), hline(0, 68, CW, "M"), shade([0, 12, 22, 56]),
  stamp(x ? "_officer_x" : "_resist", 20, 32),
])
unit("observateur", (x) => [
  sky(CW, 44), stamp("_cloud_a", 60, 6), hills(40, 2, "6", 2, 48),
  // a patchwork valley below, a river, a burning farm; a rock ledge in front
  rect(0, 46, CW, 34, "^"), rect(60, 50, 24, 8, "C"), rect(88, 56, 28, 10, "d"), rect(56, 62, 24, 8, "y"), rect(92, 70, 36, 10, "C"),
  line(52, 79, 88, 48, "p", 2), line(88, 48, 128, 52, "p", 2),
  stamp("_hut_far", 104, 38), (c) => { for (const [dx, dy, r] of [[116, 36, 3], [120, 30, 4]]) { c.circ(dx, dy, r, "M"); c.circ(dx - 1, dy - 1, r - 1, "m") } },
  poly([0, 80, 0, 48, 12, 44, 44, 44, 56, 56, 60, 80], "M"), poly([44, 44, 56, 56, 60, 80, 48, 80], "0"), hline(12, 44, 32, "m"),
  stamp("_kneel" + x, 12, 14), rect(34, 20, 6, 3, "i"),
])
// Campaign reward cards (player only): both sides get the same picture so the gallery pairs stay complete.
reward("jumbo",
  ...bocage(7, 40, "+=~89"), furrows(42, 66, "c"), poly([0, 66, CW, 62, CW, CH, 0, CH], "T"), hline(0, 74, CW, "t"),
  layer("shadow", { shade: true }, shadowAt(18, 74, 76)), stamp("_jumbo", 16, 30),
  (c) => { for (const [px_, py] of [[96, 30], [102, 38], [90, 42]]) { c.px(px_, py, "K"); c.px(px_ + 1, py, "L"); c.px(px_ + 2, py - 1, "L") } }, glow("KL", { r: 4, strength: 0.6 }))
reward("typhoon",
  sky(CW, 56, "1+2=3"), stamp("_cloud_a", 88, 6), hills(52, 2, "6", 8, 60), ...meadow(58, CW, 22, 8, 30), ...lane(66, 8),
  stamp("_typhoon", 4, 6),
  line(80, 32, 100, 56, "m"), line(72, 34, 92, 60, "m"), px(100, 56, "L"), px(92, 60, "L"),
  stamp("_boom", 90, 46))
reward("commandos",
  vgrad(0, 0, CW, 52, "bBn", 1, 2), circ(24, 14, 8, "5"), circ(28, 12, 8, "b"),
  (c) => { for (const [sx, sy] of [[16, 8], [40, 18], [66, 6], [84, 24], [120, 30], [104, 10]]) c.px(sx, sy, "N") },
  rect(0, 52, CW, 28, "B"), (c) => { for (let i = 0; i < 14; i++) c.hline((i * 26) % 100, 56 + i * 2, 10 + (i % 3) * 4, i % 2 ? "n" : "b") },
  poly([68, 80, 80, 44, 128, 36, 128, 80], "b"), hline(80, 44, 48, "n"),
  stamp("_lcvp", 4, 50, { swap: NIGHT }), stamp("_commando_k", 76, 12, { swap: NIGHT }), stamp("_commando", 100, 2, { swap: NIGHT }))
reward("ambulance",
  ...bocage(9, 36), ...lane(62, 12),
  layer("shadow", { shade: true }, shadowAt(8, 74, 70)),
  stamp("_truck", 8, 34),
  rect(14, 42, 28, 16, "5"), rect(24, 44, 8, 12, "s"), rect(20, 48, 16, 4, "s"),
  stamp("_kneel", 92, 36), rect(98, 50, 5, 3, "5"), px(100, 50, "s"))

// Orders are side-neutral: one illustration each.
order("artillerie",
  ...bocage(1, 48, "+=~89"), poly([0, 68, CW, 66, CW, CH, 0, CH], "T"), hline(0, 68, CW, "t"),
  stamp("_kneel", 0, 42),
  line(48, 54, 92, 26, "U", 5), line(48, 52, 90, 24, "v", 1), poly([40, 44, 54, 36, 58, 60, 44, 62], "v"), vline(54, 38, 22, "U"),   // barrel, shield
  line(44, 62, 16, 74, "U", 3), circ(52, 64, 9, "i"), circ(52, 64, 7, "I"), circ(51, 63, 2, "j"),
  ...blast(92, 26))
order("bombardement",
  sky(CW, 60, "1+2=3"), stamp("_cloud_b", 96, 28),
  stamp("_bomber", 8, 4), stamp("_bomber", 48, 12), stamp("_bomber", 88, 6),
  (c) => { for (const [bx, by] of [[24, 18], [28, 32], [64, 26], [68, 42], [104, 20], [100, 36]]) { c.vline(bx, by, 4, "i"); c.px(bx, by + 4, "I") } },
  treeline(60, 2, "%", "&", 3, CW, 80), rect(0, 66, CW, 14, "A"),
  stamp("_boom", 22, 40), stamp("_boom", 76, 46, { flip: "x" }))
order("recon",
  ...bocage(2, 36), furrows(38, 80, "^"),
  stamp("_sherman_x", 18, 18, { flip: "x" }), (c) => { for (let bx = -4; bx < CW; bx += 26) c.stamp("_bush", bx, 58) }, rect(0, 68, CW, 12, "A"),
  (c) => { for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) if (Math.hypot(x - 40, y - 40) > 34 && Math.hypot(x - 86, y - 40) > 34) c.px(x, y, "k") },   // binocular mask
  hline(56, 40, 16, "k"), vline(64, 34, 13, "k"), hline(24, 40, 6, "k"), hline(98, 40, 6, "k"))
order("opsecrete",
  vgrad(0, 0, CW, 56, "bBn", 1, 2), circ(100, 18, 10, "5"), circ(96, 16, 2, "4"), px(104, 22, "4"), glow("5", { r: 14, strength: 0.3 }),
  (c) => { for (const [sx, sy] of [[12, 8], [36, 18], [60, 6], [76, 26], [120, 40], [24, 32]]) c.px(sx, sy, "N") },
  hills(50, 3, "b", 2, 60), grid(80, 38, "....bbbb....\n...bbbbbb...\n..bbbbbbbb..\n.bbbbbbbbbb.\nbbbbbbbbbbbb\nbbbbbbbbbbbb\nbbbbbbLbbbbb\nbbbbbbbbbbbb"),   // farm, one lit window
  rect(0, 58, CW, 22, "B"), hline(0, 58, CW, "b"), hline(40, 64, 60, "n"),
  stamp("_gi", 12, 36, { swap: NIGHT }), stamp("_gi", 48, 42, { swap: NIGHT }), glow("L", { r: 6, strength: 0.5 }))
order("sabotage",
  vgrad(0, 0, CW, 52, "bBn7", 1, 2), hills(44, 2, "b", 5, 54),
  vline(104, 8, 48, "k"), hline(98, 12, 14, "k"), wire(0, 18, 104, 14, 6, "k"), wire(104, 14, 128, 16, 2, "k"),   // telegraph line
  poly([0, 60, CW, 60, CW, CH, 0, CH], "M"), poly([0, 58, CW, 58, CW, 62, 0, 62], "0"),
  (c) => { for (let sx = 4; sx < CW; sx += 12) c.rect(sx, 56, 6, 4, "W") }, hline(0, 52, CW, "j"), hline(0, 54, CW, "I"),   // sleepers, rail
  rect(60, 46, 12, 6, "s"), vline(64, 46, 6, "R"), vline(68, 46, 6, "R"), hline(60, 48, 12, "l"),
  wire(60, 48, 28, 62, 4, "k"), rect(20, 62, 10, 10, "W"), hline(18, 60, 14, "I"), vline(24, 54, 6, "I"),
  stamp("_kneel", 0, 46, { swap: NIGHT }), px(72, 44, "K"), px(74, 42, "L"), glow("KL", { r: 12, strength: 0.6 }))
order("echange",
  // a staff map on the table: grid squares, contour lines, a river, unit counters and arrows, a pencil
  rect(0, 0, CW, CH, "l"), box(0, 0, CW, CH, "m"),
  (c) => { for (let gx = 16; gx < CW; gx += 24) c.vline(gx, 1, CH - 2, "m"); for (let gy = 16; gy < CH; gy += 24) c.hline(1, gy, CW - 2, "m") },
  ellipse(92, 24, 24, 14, "Q", true), ellipse(92, 24, 14, 8, "Q", true), ellipse(92, 24, 6, 3, "Q", true), ellipse(28, 60, 20, 12, "Q", true), ellipse(28, 60, 10, 6, "Q", true),
  line(0, 32, 40, 44, "p", 2), line(40, 44, 72, 36, "p", 2), line(72, 36, 128, 60, "p", 2),
  rect(12, 16, 22, 14, "5"), box(12, 16, 22, 14, "n"), line(12, 16, 33, 29, "n"), line(12, 29, 33, 16, "n"),
  rect(92, 52, 22, 14, "5"), box(92, 52, 22, 14, "n"), ellipse(102, 58, 6, 3, "n", true),
  line(38, 20, 84, 20, "s", 2), line(84, 20, 100, 44, "s", 2), poly([94, 42, 108, 42, 100, 50], "s"),
  line(88, 62, 44, 62, "n", 2), line(44, 62, 24, 36, "n", 2), poly([18, 38, 32, 38, 24, 30], "n"),
  line(112, 4, 80, 12, "y", 2), line(112, 3, 82, 11, "O"), px(78, 12, "k"))
order("redeploy",
  ...bocage(4, 40), (c) => { for (const px_ of [8, 32, 56, 104]) c.stamp("_poplar", px_, -8) },
  ...lane(60, 14), dustL(10, 66),
  layer("shadow", { shade: true }, shadowAt(30, 74, 70)), stamp("_truck", 30, 34))
order("fumee",
  ...bocage(1, 36), rect(0, 70, CW, 10, "A"),
  stamp("_gi", 8, 36), stamp("_gi", 88, 40),
  (c) => { for (const [x, y, r, k] of [[64, 66, 14, 0], [92, 62, 12, 0], [44, 62, 10, 0], [60, 56, 16, 1], [104, 56, 12, 1], [88, 32, 12, 1], [68, 24, 10, 1], [40, 50, 14, 2], [80, 46, 16, 2], [56, 32, 12, 2], [28, 64, 8, 2], [76, 14, 8, 2], [116, 42, 8, 2]]) { const K = ["m", "4", "5"][k]; c.circ(x, y, r, ["M", "m", "4"][k]); c.circ(x - 2, y - 2, r - 3, K) } },
  rect(62, 72, 6, 6, "I"), px(64, 70, "j"))

// Card back for face-down cards: olive drab, a white star in a ring.
scene("c_back", { w: CW, h: CH, bg: "U" },
  (c) => { for (let i = -CH; i < CW; i += 8) c.line(i, CH - 1, i + CH, 0, "u") },
  box(2, 2, CW - 4, CH - 4, "V"), box(4, 4, CW - 8, CH - 8, "u"),
  circ(64, 40, 20, "u"), ring(64, 40, 20, "V"), ring(64, 40, 17, "v"),
  (c) => {
    const P = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? 6.5 : 16; return [64 + d * Math.cos(a), 41 + d * Math.sin(a)] })
    const inside = (x, y) => P.reduce((n, [x1, y1], i) => { const [x2, y2] = P[(i + 1) % 10]; return (y1 > y) !== (y2 > y) && x < x1 + (y - y1) * (x2 - x1) / (y2 - y1) ? !n : n }, false)
    for (let y = 20; y < 60; y++) for (let x = 44; x < 84; x++) if (inside(x + 0.5, y + 0.5)) c.px(x, y, x + y < 104 ? "5" : "4")
  })

// A distant farm for backdrops: a slate roof, stone walls.
sprite("_hut_far", { outline: "k" }, `
  ...MMMMMMMM..
  ..MmmmmmmmmM.
  .MmmmmmmmmmmM
  .lllllllllll.
  .lkllllkllll.
  .lllllllllll.`)

const CARDS = ["sherman", "firefly", "section", "rangers", "mortiers", "paras", "p47", "spitfire", "genie", "officier", "resistance", "observateur", "jumbo", "typhoon", "commandos", "ambulance"]
const ORDERS = ["artillerie", "bombardement", "recon", "opsecrete", "sabotage", "echange", "redeploy", "fumee", "back"]
scene("contact_cards", { w: 4 * 130 + 2, h: 11 * 82 + 2, bg: "k" },
  ...CARDS.map((n, i) => stamp("c_" + n, 2 + (i % 2) * 260, 2 + Math.floor(i / 2) * 82)),
  ...CARDS.map((n, i) => stamp("c_" + n + "_x", 132 + (i % 2) * 260, 2 + Math.floor(i / 2) * 82)),
  ...ORDERS.map((n, i) => stamp("c_" + n, (i % 4) * 130 + 2, 2 + (8 + Math.floor(i / 4)) * 82)))

// ------------------------------------------------------------------ terrains (320x144)
const terrain = (name, ...items) => scene("t_" + name, { w: TW, h: TH, bg: "4" }, ...items)
const stamps = (name, pts) => (c) => { for (const [x, y, o] of pts) c.stamp(name, x, y, o) }
const soldiers = (pts, x = "", swap) => (c) => { for (const [px_, py, k] of pts) c.stamp((k ? "_kneel" : "_gi") + x, px_, py, swap ? { swap } : undefined) }
// Surf: broken white lines along a shore.
const surf = (y, key = "5", step = 22) => (c) => { for (let x = 0; x < TW; x += step) { c.hline(x + ((y * 3) % 9), y, 10, key); c.hline(x + ((y * 3) % 9) + 3, y + 1, 5, "4") } }
// Barbed wire: coils on pickets.
const barbed = (x0, x1, y) => (c) => { for (let x = x0; x < x1; x += 6) { c.ring(x, y + ((x / 6) % 2), 3, "I"); c.px(x - 2, y - 2, "j") } c.vline(x0, y - 4, 9, "W"); c.vline(x1, y - 4, 9, "W") }
// Rubble heaps of Caen stone, a red tile here and there.
const rubble = (n, y0, y1, seed = 1) => (c) => { const r = c.rng(seed); for (let i = 0; i < n; i++) { const x = Math.floor(r() * TW), y = y0 + Math.floor(r() * (y1 - y0)), rr = 3 + Math.floor(r() * 9); c.ellipse(x, y, rr, Math.ceil(rr / 2), "M"); c.ellipse(x - 1, y - 1, rr - 2, Math.max(1, Math.ceil(rr / 2) - 1), "m"); c.px(x - rr / 2, y - 1, "l"); if (r() < 0.4) c.rect(x + rr - 4, y, 3, 2, "s") } }
// Shell crater: a dark bowl, a lit far lip, earth thrown around.
const crater = (x, y, r) => (c) => { c.ellipse(x, y, r + 2, Math.ceil(r / 2) + 1, "q"); c.ellipse(x, y, r, Math.ceil(r / 2), "T"); c.ellipse(x, y + 1, r - 2, Math.max(1, Math.ceil(r / 2) - 1), "t"); c.hline(x - r, y - Math.ceil(r / 2) - 1, 2 * r, "Q") }
// Gutted house: wall columns of uneven height, empty windows, stone courses, a few rafters left.
const ruin = (x, base, w, h, seed, roof) => (c) => {
  const top = (i) => Math.round(h * (0.62 + 0.38 * Math.abs(Math.sin(i * 0.22 + seed)) * (0.6 + 0.4 * Math.sin(i * 0.95 + seed))))
  for (let i = 0; i < w; i++) { const hh = Math.max(8, top(i)); c.vline(x + i, base - hh, hh, i > w * 0.72 ? "m" : "l"); c.px(x + i, base - hh, "M") }
  for (let y = base - 10; y > base - h * 0.6; y -= 8) c.hline(x, y, w, "m")
  for (let wy = base - 18; wy > base - h + 8; wy -= 20) for (let wx = x + 8; wx < x + w - 12; wx += 18) { c.rect(wx, wy - 12, 9, 13, "k"); c.hline(wx - 1, wy + 1, 11, "M"); c.vline(wx, wy - 12, 13, "0") }
  c.rect(x + Math.floor(w / 2) - 5, base - 18, 10, 18, "k")
  if (roof) { c.poly([x - 4, base - h + 4, x + w * 0.45, base - h - 18, x + w * 0.5, base - h - 12, x + 12, base - h + 8], "R"); c.line(x + w * 0.45, base - h - 16, x + w * 0.8, base - h + 6, "W", 2); c.line(x + w * 0.3, base - h - 6, x + w * 0.62, base - h + 10, "W", 2) }
}
// Concrete casemate, embrasure facing left (the sea).
sprite("_casemate", { w: 88, h: 40 }, (c) => {
  c.poly([4, 12, 80, 8, 88, 16, 88, 40, 0, 40, 0, 18], "l"); c.hline(4, 12, 76, "5"); c.poly([80, 8, 88, 16, 88, 40, 76, 40, 76, 12], "m")
  c.rect(0, 18, 60, 4, "m"); c.rect(6, 22, 36, 10, "k"); c.hline(6, 32, 36, "M"); c.rect(10, 24, 8, 4, "i"); c.hline(0, 26, 12, "I")   // embrasure, gun
  for (let x = 48; x < 76; x += 6) c.vline(x, 24, 16, "m")                                                                  // shuttering marks
  for (let x = 4; x < 72; x += 14) c.vline(x + 3, 34, 6, "M")                                                               // rain streaks
  c.poly([-4, 40, 0, 32, 92, 32, 92, 40], "Q")
})
// Horsa glider, broken landing in a field.
sprite("_horsa", { outline: "k" }, `
  ......mm...................
  .....mllm..................
  mmmmmmllmmmmmmmmmmmmmmmmm..
  mllllllllllllllllllllllllm.
  .mmmmmmmmmmmmmmmmmmmmmmmmmm
  .......llll.....mm.........
  .....mmmmmmmm..............`)
// Village steeple, slate spire, a clock.
sprite("_steeple", { outline: "k" }, `
  .....M.....
  .....M.....
  ....MmM....
  ....MmM....
  ...MmmmM...
  ...MmmmM...
  ..MmmmmmM..
  ..MmmmmmM..
  .MmmmmmmmM.
  .lllllllll.
  .lllkkklll.
  .llk5k5kll.
  .lllkkklll.
  .lllllllll.
  .llllkllll.
  .llllklllm.
  .llllllllm.
  .lllllllllm
  .lllkklllm.
  .lllkklllm.
  .lllllllllm`)

terrain("bocage",
  sky(TW, 54), stamp("_cloud_a", 40, 8), stamp("_cloud_b", 150, 18), stamp("_cloud_a", 236, 4),
  hills(48, 3, "6", 1, 70, TW), treeline(56, 3, "%", "&", 1, TW, 70), ...meadow(58, TW, 86, 1, 160), poly([184, 60, 320, 60, 320, 72, 200, 70], "d"),   // far pasture, hay field
  stamps("_oak", [[112, 14], [168, 16], [200, 12]]), (c) => { for (let bx = -6; bx < TW; bx += 26) c.stamp("_bush", bx, 58) },
  // the sunken lane between two hedge banks, cart ruts, a field gate
  poly([144, 70, 176, 70, 248, 144, 72, 144], "q"), line(154, 72, 116, 144, "T", 2), line(166, 72, 204, 144, "T", 2),
  rect(142, 60, 2, 12, "W"), rect(176, 60, 2, 12, "W"), hline(144, 62, 32, "X"), hline(144, 66, 32, "X"), line(144, 62, 174, 66, "X"),
  poly([0, 72, 132, 70, 52, 144, 0, 144], "A"), poly([320, 72, 188, 70, 268, 144, 320, 144], "A"),                        // hedge banks
  poly([144, 70, 72, 144, 52, 144, 132, 70], "Q"), poly([176, 70, 248, 144, 268, 144, 188, 70], "T"),                    // earth faces: lit, shadowed
  scatter("_bush", 0, 72, 120, 72, 30, { on: "A", rflip: "x" }), scatter("_bush", 200, 72, 120, 72, 30, { on: "A", rflip: "x", seed: 4 }),
  stamps("_oak", [[80, 28], [204, 26]]), stamp("_oak_big", -20, 10), stamp("_oak_big", 256, 6, { flip: "x" }),
  layer("shadow", { shade: true }, poly([176, 70, 248, 144, 196, 144, 160, 70], "k")))

terrain("pont",
  sky(TW, 52), stamp("_cloud_a", 20, 8), stamp("_cloud_b", 192, 16), stamp("_cloud_a", 264, 4),
  hills(44, 3, "6", 2, 60, TW), treeline(52, 3, "%", "&", 2, TW, 62), stamps("_oak_small", [[4, 22], [40, 26], [256, 24], [292, 20]]), rect(0, 56, TW, 12, "^"), hline(0, 66, TW, "c"),
  ...water(68, 76, 2, "PpZz"),
  layer("bridge",
    poly([0, 48, 44, 40, 276, 40, 320, 48, 320, 68, 0, 68], "m"), rect(36, 40, 248, 60, "m"),
    (c) => { for (let y = 52; y < 100; y += 8) { c.hline(36, y, 248, "M"); for (let x = 40 + (y % 16 ? 0 : 8); x < 284; x += 16) c.vline(x, y - 7, 7, "M") } },   // masonry courses
    rect(0, 34, TW, 6, "l"), hline(0, 34, TW, "5"), hline(0, 40, TW, "M"), poly([0, 40, 36, 40, 36, 48, 0, 56], "l"), poly([320, 40, 284, 40, 284, 48, 320, 56], "l"),   // parapet
    (c) => { for (const cx of [90, 160, 230]) { c.ellipse(cx, 84, 30, 32, "l"); c.ellipse(cx, 84, 26, 28, "_"); c.rect(cx - 32, 100, 66, 20, "_") } },
    (c) => { for (const cx of [54, 124, 196, 266]) { c.rect(cx - 6, 88, 14, 16, "l"); c.vline(cx + 6, 88, 16, "m"); c.hline(cx - 8, 104, 18, "m") } }),
  layer("refl", { shade: true }, rect(36, 106, 248, 10, "k")),
  poly([0, 68, 40, 68, 60, 104, 44, 144, 0, 144], "^"), poly([40, 68, 60, 104, 44, 144, 34, 144, 50, 104, 32, 68], "T"),
  poly([320, 68, 280, 68, 260, 104, 276, 144, 320, 144], "c"), poly([280, 68, 260, 104, 276, 144, 286, 144, 270, 104, 288, 68], "t"),
  scatter("_reed", 44, 112, 40, 30, 24, { seed: 3 }), stamp("_oak_big", 252, 50, { flip: "x" }), stamp("_bush", -8, 120), stamp("_bush", 8, 132))

terrain("village",
  vgrad(0, 0, TW, 92, "2=~48", 1, 2),
  hills(80, 2, "M", 3, 96, TW), (c) => { for (const [x, w, h] of [[12, 24, 18], [48, 16, 26], [216, 28, 20], [280, 20, 28]]) c.rect(x, 84 - h, w, h, "M") },   // far blocks
  (c) => { for (const [x, y, r, k] of [[60, 40, 12, 0], [72, 24, 14, 1], [88, 10, 16, 1], [52, 56, 8, 0], [244, 44, 10, 0], [256, 28, 14, 1], [272, 12, 16, 1]]) { c.circ(x, y, r, ["0", "M", "m"][k]); c.circ(x - 3, y - 3, r - 4, ["M", "m", "4"][k]) } },
  // the church tower, its spire shot off
  rect(140, 16, 28, 80, "l"), rect(160, 16, 8, 80, "m"), poly([140, 16, 148, -4, 158, 6, 168, 16], "M"), rect(148, 28, 10, 16, "k"), rect(148, 60, 10, 12, "k"), hline(140, 52, 28, "m"), hline(140, 16, 28, "5"),
  ruin(0, 100, 68, 60, 1, true), ruin(72, 100, 56, 44, 2.2), ruin(180, 100, 64, 52, 0.4, true), ruin(248, 100, 72, 68, 3.1),
  rect(0, 100, TW, 44, "m"), poly([112, 100, 208, 100, 248, 144, 72, 144], "l"),                                         // street
  (c) => { for (let y = 108; y < 144; y += 6) for (let x = 80 + (y % 12) - (y - 100); x < 244 + (y - 100); x += 14) c.hline(x, y, 8, "m") },   // cobbles
  rubble(16, 104, 140, 2), crater(160, 124, 16),
  rect(82, 62, 10, 14, "L"), px(86, 66, "K"), rect(262, 46, 10, 14, "L"), px(266, 50, "K"), glow("LK", { r: 16, strength: 0.5 }),
  line(36, 144, 44, 100, "W", 3), line(44, 100, 60, 92, "W", 2))

terrain("plage",
  sky(TW, 44), stamp("_cloud_a", 60, 8), stamp("_cloud_b", 168, 18), stamp("_cloud_a", 248, 10),
  vgrad(0, 44, TW, 44, "ZpP", 1, 2), hline(0, 44, TW, "2"),
  grid(28, 38, "....M.....\n...MMM....\n.MMMMMMM..\nMMMMMMMMMM"), grid(104, 40, ".M....\nMMMMMM"), grid(192, 38, ".....M....\n....MMM...\nMMMMMMMMMM"),   // fleet on the horizon
  (c) => { for (const [x, y] of [[80, 12], [220, 6]]) { c.ellipse(x, y, 6, 3, "M"); c.ellipse(x - 1, y - 1, 4, 2, "m"); c.line(x, y + 3, x + 2, y + 30, "0") } },   // barrage balloons
  ...water(48, 40, 7, "pPpZ"),
  stamp("_lcvp", 32, 60), stamp("_lcvp", 140, 54), (c) => { for (const [x, y] of [[108, 48], [240, 54], [280, 62]]) { c.grid(x, y, ".5.5.\n..5..\n.555.\n.545.\n.545.\n55455"); c.hline(x - 4, y + 6, 14, "4") } },   // shell splashes
  rect(0, 88, TW, 56, "l"), rect(0, 86, TW, 4, "m"), surf(86), (c) => { for (let i = 0; i < 24; i++) c.hline((i * 43) % 300, 100 + ((i * 5) % 40), 10, "m") },   // wet sand, ripples
  poly([196, 92, 252, 68, 320, 56, 320, 144, 224, 144], "Q"), poly([252, 68, 320, 56, 320, 66, 256, 76], "c"), hline(252, 66, 68, "C"),   // bluff
  stamp("_casemate", 230, 56),
  stamps("_hedgehog", [[16, 100], [68, 94], [116, 106], [168, 96], [44, 120], [140, 124], [200, 116]]),
  (c) => { for (const [x, y] of [[92, 116], [184, 128], [24, 132]]) { c.line(x, y, x + 10, y - 18, "W", 2); c.rect(x + 8, y - 22, 6, 4, "I") } },   // mined stakes
  barbed(208, 318, 108),
  layer("shadow", { shade: true }, (c) => { for (const [x, y] of [[16, 100], [68, 94], [116, 106], [168, 96], [44, 120], [140, 124], [200, 116]]) c.hline(x + 4, y + 12, 16, "k") }))

terrain("colline",
  sky(TW, 92), stamp("_cloud_a", 16, 12), stamp("_cloud_b", 80, 28), stamp("_cloud_a", 256, 18), stamp("_cloud_b", 216, 40),
  hills(84, 4, "6", 1, 100, TW), treeline(92, 3, "%", "&", 4, TW, 104),
  // the hill, a bell curve shaded by slope, terrace lines, a track winding up, a trench line near the top
  flankShade((x) => Math.round(124 - 92 * Math.exp(-(((x - 184) / 88) ** 2))), 0, TW, "C^cA"),
  (c) => { const top = (x) => Math.round(124 - 92 * Math.exp(-(((x - 184) / 88) ** 2))); for (let k = 1; k < 5; k++) for (let x = 40; x < 300; x++) { const y = top(x) + k * 18 + Math.round(3 * Math.sin(x / 16 + k)); if (y < TH && x % 18 > 3) c.px(x, y, "A") } for (let x = 124; x < 252; x += 6) c.rect(x, top(x) + 24 + (x % 2), 5, 3, "t") },
  (c) => { let px_ = 120, py = 143; for (const [tx, ty] of [[168, 116], [140, 92], [184, 72], [164, 54], [180, 40]]) { c.line(px_, py, tx, ty, "Q", 3); px_ = tx; py = ty } },
  rect(168, 22, 36, 14, "l"), rect(168, 22, 36, 3, "5"), rect(174, 28, 20, 4, "k"), vline(202, 22, 14, "m"), poly([164, 36, 208, 36, 212, 40, 160, 40], "m"),   // bunker
  vline(198, 0, 22, "I"), line(198, 4, 208, 22, "I"), line(198, 4, 188, 22, "I"),
  crater(60, 128, 10), crater(248, 120, 8), crater(284, 134, 10), crater(104, 116, 6),
  stamps("_oak", [[-12, 80], [16, 88], [288, 84]]), stamp("_bush", 44, 132), stamp("_bush", 252, 134))

terrain("aerodrome",
  sky(TW, 72), stamp("_cloud_a", 108, 10), stamp("_cloud_b", 164, 28), stamp("_cloud_a", 4, 24),
  hills(66, 2, "6", 2, 76, TW), treeline(72, 2, "%", "&", 2, TW, 80), ...meadow(72, TW, 72, 2, 80),
  layer("hangar", ellipse(56, 76, 52, 34, "j"), rect(0, 76, 120, 40, "_"),
    (c) => { for (let x = 8; x < 108; x += 6) for (let y = 40; y < 76; y++) if (c.is(x, y, "j")) c.px(x, y, "I") },
    ellipse(56, 76, 52, 34, "J", true), rect(0, 76, 120, 40, "_"), rect(24, 54, 64, 22, "k"), rect(24, 54, 6, 22, "i"), rect(82, 54, 6, 22, "i"),
    poly([40, 76, 48, 62, 64, 62, 72, 76], "U"), vline(56, 56, 16, "i"), hline(44, 66, 24, "i")),
  poly([128, 74, 168, 74, 312, 144, 60, 144], "M"), line(128, 74, 60, 144, "0"), line(168, 74, 312, 144, "0"),           // runway
  (c) => { for (let y = 78, n = 3; y < 144; y += n + 5, n += 3) c.rect(Math.round(148 + (y - 74) * 0.54) - 1, y, 2 + Math.floor(n / 3), n, "5") },
  rect(256, 28, 24, 46, "l"), vline(278, 28, 46, "m"), rect(250, 16, 36, 12, "p"), box(250, 16, 36, 12, "M"), vline(262, 16, 12, "M"), vline(274, 16, 12, "M"),   // control tower
  rect(248, 12, 40, 4, "m"), vline(268, 0, 12, "I"), rect(262, 60, 10, 14, "k"), hline(256, 44, 24, "m"),
  vline(216, 32, 42, "I"), poly([218, 32, 242, 36, 242, 42, 218, 42], "s"), rect(224, 32, 6, 10, "5"), rect(236, 36, 6, 6, "5"),   // windsock
  stamp("_p47", 192, 84, { flip: "x" }), line(220, 118, 218, 124, "I"), circ(218, 126, 2, "i"), line(252, 112, 256, 124, "I"), circ(256, 126, 2, "i"),
  layer("shadow", { shade: true }, ellipse(236, 130, 40, 4, "k")),
  (c) => { for (const x of [8, 18, 28]) { c.rect(x, 88, 8, 12, "s"); c.hline(x, 88, 8, "S"); c.hline(x, 94, 8, "R") } })

terrain("carrefour",
  sky(TW, 56), stamp("_cloud_a", 32, 12), stamp("_cloud_b", 124, 6), stamp("_cloud_a", 224, 20),
  hills(52, 3, "6", 5, 64, TW), treeline(60, 2, "%", "&", 5, TW, 64),
  rect(0, 60, 148, 28, "y"), furrows(60, 88, "O"), rect(148, 60, 172, 28, "^"), ...meadow(100, TW, 44, 5, 60),
  grid(264, 44, "......RRRRRRRRRRRR....\n.....RRRRRRRRRRRRRR...\n....RssssssssssssssR..\n...RRRRRRRRRRRRRRRRRR.\n...llllllllllllllllll.\n...llkllllllkllllllll.\n...llkllllllkllkkllll.\n...llllllllllllkkllll."),   // farm
  smoke(282, 38, 6),
  poly([0, 84, 320, 84, 320, 98, 0, 102], "q"), hline(0, 84, TW, "T"), hline(0, 100, TW, "T"),                            // east-west road
  poly([140, 62, 160, 62, 232, 144, 76, 144], "q"), line(146, 64, 112, 144, "T", 2), line(154, 64, 196, 144, "T", 2),    // north-south road
  ellipse(120, 120, 12, 3, "p"), hline(114, 118, 10, "P"), ellipse(176, 94, 8, 2, "p"),                                   // puddles
  stamps("_poplar", [[4, 34], [32, 34], [60, 34], [88, 34], [200, 34], [228, 34], [256, 34], [296, 34]]),
  layer("shadow", { shade: true }, (c) => { for (const x of [4, 32, 60, 88, 200, 228, 256, 296]) c.poly([x + 4, 86, x + 10, 86, x + 24, 100, x + 18, 100], "k") }),
  vline(208, 60, 52, "W"), vline(209, 60, 52, "x"),                                                                        // signpost
  poly([212, 62, 244, 62, 250, 66, 244, 70, 212, 70], "5"), hline(216, 66, 22, "k"),
  poly([206, 74, 176, 74, 170, 78, 176, 82, 206, 82], "5"), hline(180, 78, 20, "k"),
  poly([212, 86, 236, 86, 242, 90, 236, 94, 212, 94], "l"), hline(216, 90, 16, "k"),
  rect(68, 68, 6, 32, "l"), rect(60, 76, 22, 6, "l"), vline(72, 68, 32, "m"), rect(62, 100, 18, 6, "m"),                 // calvary
  grid(236, 104, ".sss.\n55555\n5kk55\n55555\n55555"),                                                                   // kilometre stone
  stamp("_bush", -8, 128), stamp("_bush", 280, 132))

terrain("foret",
  vgrad(0, 0, TW, 68, "=~45", 1, 2),
  (c) => { for (let x = -8; x < TW; x += 14) c.stamp("_pine_far", x, 14 + (x % 3) * 2) }, rect(0, 64, TW, 80, "5"),
  stamps("_pine_snow", [[20, 16], [68, 24], [116, 12], [168, 22], [212, 14], [256, 24], [292, 18]]),
  (c) => { for (let y = 92; y < 144; y += 14) for (let x = (y * 5) % 80; x < TW; x += 92) { c.hline(x, y, 44, "4"); c.hline(x + 6, y + 1, 28, "~") } },   // drift shadows
  stamp("_pine_big", -24, 16), stamp("_pine_big", 264, 8), stamp("_pine_snow", 200, 56), stamp("_pine_snow", 80, 60),
  layer("shadow", { shade: true }, poly([20, 136, 60, 136, 120, 144, 28, 144], "k"), poly([296, 128, 320, 128, 320, 140, 300, 140], "k")),
  ellipse(160, 116, 26, 8, "4"), ellipse(160, 118, 20, 6, "T"), ellipse(160, 120, 16, 4, "k"),                            // foxhole
  line(136, 110, 184, 108, "W", 3), line(140, 106, 180, 104, "x", 2), grid(154, 108, "..UUUU..\n.UvvvvU.\nUUUUUUUU"), line(168, 112, 186, 102, "I"),   // log parapet, helmet, rifle
  (c) => { for (let i = 0; i < 9; i++) c.rect(192 + i * 12, 124 + (i % 2) * 4 + Math.round(i / 3) * 2, 4, 2, "~") },     // footprints
  (c) => { const r = c.rng(7); for (let i = 0; i < 120; i++) { const x = Math.floor(r() * TW), y = Math.floor(r() * TH); c.px(x, y, "5"); if (r() < 0.3) c.px(x + 1, y, "5") } })   // snowfall

terrain("marais",
  vgrad(0, 0, TW, 60, "=~4", 1, 2),
  hills(50, 3, "6", 2, 62, TW), treeline(56, 2, "%", "&", 2, TW, 62), stamps("_dead", [[24, 12], [104, 16, { flip: "x" }], [248, 10], [292, 18, { flip: "x" }]]),
  ...water(60, 84, 2, "PpZz"),
  stamp("_sherman", 152, 40), rect(150, 78, 112, 16, "p"), hline(152, 78, 104, "P"), hline(148, 82, 116, "Z"), hline(170, 86, 84, "p"),   // bogged tank
  (c) => {
    for (const [x, y, rx] of [[52, 92, 32], [260, 112, 40], [140, 124, 24], [300, 80, 18]]) {       // mud banks with reed beds
      c.ellipse(x, y, rx, 5, "t"); c.ellipse(x, y - 1, rx - 4, 3, "T")
      for (let i = -rx + 6; i < rx - 4; i += 3) { const h = 12 + ((x + i * 7) % 10); c.vline(x + i, y - 3 - h, h, i % 6 ? "c" : "C"); if (i % 9 === 0) c.vline(x + i, y - 5 - h, 3, "W") }
    }
    for (const [x, y, rx] of [[104, 104, 14], [200, 100, 18], [32, 124, 16], [216, 132, 12]]) { c.ellipse(x, y, rx, 2, "^"); c.hline(x - 6, y, 6, "C") }   // duckweed
    for (let i = 0; i < 12; i++) { const x = 68 + i * 8, y = 140 - i * 3; c.rect(x, y, 10, 3, "X"); c.hline(x, y + 2, 10, "x"); if (i % 3 === 0) c.vline(x + 4, y + 3, 5, "W") }   // duckboards
  },
  stamp("_dead", 4, 60))

// ------------------------------------------------------------------ campaign terrain variants (320x144)
terrain("omaha_dog",                                                  // grey dawn, bluffs and the Vierville draw
  vgrad(0, 0, TW, 50, "2=~4", 1, 2), stamp("_cloud_a", 36, 6), stamp("_cloud_b", 240, 12),
  flankShade((x) => Math.round(28 + 12 * Math.sin(x / 30) + (x > 140 && x < 184 ? (x - 140) * (184 - x) / 30 : 0)), 0, TW, "C^cA"),   // bluffs with a draw
  (c) => { for (let x = 0; x < TW; x++) { const top = Math.round(54 + 4 * Math.sin(x / 14)); c.vline(x, top, 72 - top, x % 7 < 4 ? "A" : "c") } }, scatter("_bush", 0, 44, TW, 20, 18, { on: "C^cA", rflip: "x" }),
  grid(60, 26, "......RRRR....\n....RRRRRRRR..\n..llllllllllll\n..llkllllkllll\n..llkllllkllll"), smoke(74, 22, 6),               // villa on the bluff
  rect(156, 60, 24, 12, "q"), stamp("_casemate", 236, 34),
  rect(0, 72, TW, 14, "l"), rect(0, 72, TW, 3, "m"), ...water(86, 58, 3, "pPpZ"), surf(86), surf(94, "4"),
  stamps("_hedgehog", [[12, 72], [48, 74], [92, 70], [132, 74], [196, 72], [236, 70], [280, 74]]),
  stamp("_lcvp", 28, 96), stamp("_lcvp", 208, 104), stamp("_lcvp", 120, 116, { flip: "x" }),
  soldiers([[60, 54], [104, 58, 1], [172, 52], [256, 56, 1]]),
  smoke(296, 60, 7), smoke(16, 56, 6))

terrain("omaha_easy",                                                 // high tide, men pinned behind the shingle bank
  sky(TW, 40, "2=~4"), stamp("_cloud_a", 120, 8), hills(32, 4, "c", 3, 60, TW), hills(44, 3, "A", 1, 60, TW),
  line(92, 60, 108, 44, "Q", 2), line(108, 44, 100, 34, "Q", 2),                                                          // path up the bluff
  rect(0, 60, TW, 20, "l"), (c) => { const r = c.rng(4); for (let i = 0; i < 300; i++) { const x = Math.floor(r() * TW), y = 74 + Math.floor(r() * 14); c.rect(x, y, 2, 1, r() < 0.5 ? "m" : "M") } },   // shingle
  rect(0, 88, TW, 8, "m"), ...water(96, 48, 5, "pPpZ"), surf(94), surf(104, "4"),
  stamp("_sherman", 188, 72), rect(186, 112, 112, 6, "p"), hline(190, 110, 100, "5"),                                    // DD tank in the surf
  smoke(236, 74, 8),
  soldiers([[16, 58, 1], [52, 60, 1], [88, 58], [124, 60, 1], [156, 58, 1]]),
  stamps("_hedgehog", [[268, 92], [24, 100], [116, 104]]), stamp("_lcvp", 44, 114),
  (c) => { for (const [x, y] of [[140, 118], [280, 126]]) c.grid(x, y, ".5.5.\n..5..\n.555.\n55455") })

terrain("port_cherbourg",                                             // harbour, demolished cranes, fort on the heights
  sky(TW, 52, "+=~89"), hills(32, 6, "c", 2, 60, TW), hills(44, 4, "A", 5, 60, TW),
  rect(220, 16, 44, 16, "l"), rect(220, 16, 44, 4, "5"), (c) => { for (let x = 220; x < 264; x += 8) c.rect(x, 12, 4, 4, "l") },   // Fort du Roule
  rect(0, 56, TW, 8, "m"), (c) => { for (const [x, w, h] of [[8, 36, 16], [52, 24, 12], [88, 40, 18]]) { c.rect(x, 56 - h, w, h, "m"); c.vline(x + w - 1, 56 - h, h, "M"); c.poly([x, 56 - h, x + w / 2, 48 - h, x + w, 56 - h], "R") } },   // warehouses
  ...water(64, 52, 6, "ZpZz"),
  rect(140, 72, 180, 6, "m"), hline(140, 72, 180, "l"),                                                                  // breakwater
  layer("crane", line(60, 88, 88, 12, "I", 3), line(88, 12, 140, 20, "I", 2), line(88, 12, 80, 56, "I", 2), line(128, 20, 128, 44, "j"), rect(52, 80, 20, 12, "m")),
  line(192, 92, 248, 68, "I", 3), line(248, 68, 276, 84, "I", 2), rect(184, 88, 20, 8, "m"),                              // toppled crane
  rect(0, 116, TW, 28, "m"), hline(0, 116, TW, "l"), (c) => { for (let x = 8; x < TW; x += 40) { c.rect(x, 112, 6, 6, "M"); c.px(x + 2, 110, "0") } }, hline(0, 124, TW, "M"),   // quay, bollards
  (c) => { for (let x = 0; x < TW; x += 18) c.vline(x, 126, 18, "M") },
  smoke(104, 36, 8), smoke(280, 60, 6),
  stamp("_boom", 148, 36), soldiers([[220, 84], [260, 86, 1]]), stamp("_truck", 8, 80))

terrain("wn62",                                                       // close-up of a strongpoint in the dunes
  sky(TW, 60, "2=~4"), vgrad(0, 48, 112, 16, "pZ", 1, 2), hline(0, 48, 112, "P"),
  poly([0, 64, 80, 60, 140, 28, 320, 20, 320, 144, 0, 144], "Q"), poly([80, 60, 140, 28, 320, 20, 320, 36, 144, 44, 100, 64], "y"),   // dune slope
  scatter("_tuft", 140, 20, 180, 40, 40, { on: "yQ", swap: { c: "O", A: "o", C: "y", d: "Y" } }),
  stamp("_casemate", 116, 36), stamp("_casemate", 224, 20),
  layer("net", { density: 0.5 }, poly([112, 44, 208, 36, 212, 52, 116, 60], "U")),
  (c) => { let x = 20, y = 120; for (const [tx, ty] of [[80, 104], [60, 92], [140, 84], [128, 72], [200, 68], [192, 60]]) { c.line(x, y, tx, ty, "t", 5); c.line(x, y - 2, tx, ty - 2, "T"); x = tx; y = ty } },   // zigzag trench
  barbed(8, 120, 80), barbed(140, 300, 108), stamps("_hedgehog", [[8, 124], [52, 132], [260, 128]]),
  soldiers([[120, 68, 1], [184, 52]], "_x"),
  crater(40, 88, 10), crater(236, 92, 10), crater(92, 128, 8))

terrain("fort_roule",                                                 // granite spur and its fort above the town, dusk
  sky(TW, 84, "+2=~89"), stamp("_cloud_b", 40, 12, { swap: { 5: "9", 4: "8", 3: "7" } }),
  vgrad(0, 84, TW, 20, "pZ", 1, 2), hline(0, 84, TW, "9"), (c) => { for (let x = 4; x < 140; x += 12) c.hline(x, 88 + (x % 5), 5, "8") },
  fillUnder((x) => Math.round(x < 100 ? 200 : x < 192 ? 96 - (x - 100) * 0.75 : 28 + Math.sin(x / 12) * 2), "m", TH, 100, TW),
  clip((x, y) => x >= 100, flankShade((x) => Math.round(x < 192 ? 96 - (x - 100) * 0.75 : 28 + Math.sin(x / 12) * 2), 100, TW, "lmmM")),
  (c) => { for (let k = 0; k < 9; k++) c.line(120 + k * 22, 144, 140 + k * 20, 60 + (k % 3) * 12, "M") },                 // rock fissures
  rect(192, 8, 128, 22, "l"), rect(192, 8, 128, 4, "5"), (c) => { for (let x = 192; x < TW; x += 12) c.rect(x, 4, 6, 4, "l"); for (let x = 204; x < TW; x += 24) c.rect(x, 16, 4, 6, "k") },   // fort walls
  rect(244, 0, 20, 12, "l"), rect(244, 0, 20, 2, "5"),
  (c) => { for (let i = 0; i < 9; i++) { const x = 4 + i * 18, y = 104 + (i % 3) * 6; c.rect(x, y, 16, 12, "l"); c.vline(x + 15, y, 12, "m"); c.poly([x - 2, y, x + 8, y - 8, x + 18, y], "R"); c.rect(x + 6, y + 5, 3, 4, i % 4 ? "k" : "L") } },   // town roofs
  rect(0, 124, 160, 20, "M"), glow("L", { r: 8, strength: 0.5 }),
  smoke(220, 4, 6), (c) => { for (const [x, y] of [[200, 40], [224, 52], [256, 44]]) { c.px(x, y, "K"); c.px(x + 1, y, "L"); c.px(x + 2, y, "L") } },   // muzzle flashes
  soldiers([[140, 68], [168, 52, 1]]))

terrain("pointe_hoc",                                                 // the cliff from the sea, ropes and ladders
  sky(TW, 36), stamp("_cloud_a", 240, 6),
  cliff(0, TW, 32, 116, "mlM0"),
  (c) => { for (const x of [40, 140, 236]) c.poly([x, 116, x + 12, 52, x + 28, 52, x + 40, 116], "M") },                 // shadowed gullies
  (c) => { for (const [x, y, r] of [[80, 32, 12], [192, 30, 14], [280, 40, 10]]) { c.ellipse(x, y, r, 5, "T"); c.ellipse(x, y - 1, r - 4, 3, "t") } },   // shell craters on the top
  rect(120, 16, 28, 14, "l"), rect(120, 16, 28, 4, "m"), line(124, 16, 116, 8, "I", 2), line(140, 16, 152, 4, "I", 2),   // wrecked gun position
  (c) => { for (const [x, top] of [[68, 36], [104, 34], [176, 38], [208, 36]]) { c.vline(x, top, 80, "8"); for (let y = top + 6; y < 116; y += 8) c.hline(x - 2, y, 5, "7") } },   // ropes, ladders
  soldiers([[56, 52], [92, 72], [168, 60], [196, 84]]),
  rect(0, 112, TW, 8, "M"), (c) => { const r = c.rng(9); for (let i = 0; i < 60; i++) c.ellipse(Math.floor(r() * TW), 114 + Math.floor(r() * 5), 3 + Math.floor(r() * 5), 2, "m") },   // fallen rock
  ...water(120, 24, 9, "pPZz"), surf(120), stamp("_lcvp", 240, 118), stamp("_lcvp", 16, 122))

terrain("cote_112",                                                   // bare, shelled plateau, burnt trees, wheat around
  sky(TW, 60, "=~4"), stamp("_cloud_b", 60, 12),
  flankShade((x) => Math.round(80 - 36 * Math.exp(-(((x - 168) / 100) ** 2))), 0, TW, "QqTt"),
  (c) => { const r = c.rng(2); for (let i = 0; i < 24; i++) { const x = Math.floor(r() * TW), y = 60 + Math.floor(r() * 80); c.ellipse(x, y, 8, 3, "t"); c.ellipse(x, y - 1, 6, 2, "T"); c.hline(x - 8, y - 4, 16, "Q") } },   // crater field
  poly([0, 108, 80, 100, 60, 144, 0, 144], "y"), poly([320, 104, 248, 100, 268, 144, 320, 144], "y"), furrows(100, 144, "O"),   // wheat at the foot
  (c) => { for (const [x, y, h] of [[120, 48, 28], [144, 44, 20], [200, 44, 32], [224, 50, 18]]) { c.vline(x, y - h, h, "w"); c.vline(x + 1, y - h, h, "W"); c.line(x, y - h + 8, x + 8, y - h, "w"); c.line(x, y - h + 14, x - 6, y - h + 8, "w") } },   // burnt stumps
  stamp("_sherman", 24, 72), stamp("_sherman_x", 200, 56, { flip: "x" }), smoke(268, 56, 8),
  soldiers([[104, 70, 1], [148, 58]]))

terrain("mont_ormel",                                                 // the hilltop over the Dives valley, columns burning below
  sky(TW, 48, "+=~89"), hills(44, 3, "6", 3, 60, TW),
  vgrad(0, 56, TW, 44, "C^c", 1, 2), (c) => { for (let k = 0; k < 5; k++) c.hline(0, 64 + k * 8, TW, k % 2 ? "c" : "^") },
  line(0, 88, 320, 68, "Q", 3), (c) => { for (let x = 20; x < 300; x += 28) { const y = Math.round(88 - x * 20 / 320); c.rect(x, y - 6, 14, 6, "G"); c.rect(x + 2, y - 8, 8, 2, "h"); c.px(x + 12, y - 8, "g") } },   // retreating column
  smoke(48, 70, 6), smoke(132, 62, 7), smoke(224, 58, 8), smoke(148, 34, 5),
  (c) => { for (const x of [48, 132, 224]) { const y = 80 - Math.round(x / 16); c.px(x, y, "K"); c.px(x + 1, y, "L"); c.px(x, y + 1, "D") } },
  poly([0, 100, 100, 88, 220, 92, 320, 104, 320, 144, 0, 144], "C"), poly([0, 120, 320, 116, 320, 144, 0, 144], "c"),        // our hill
  (c) => { for (let x = 40; x < 280; x += 6) c.rect(x, 104 + (x % 2), 5, 3, "t") }, stamp("_sherman", 196, 80, { flip: "x" }),
  soldiers([[60, 92, 1], [120, 88], [168, 96, 1]]), stamps("_oak", [[-4, 76], [284, 72]]), glow("KL", { r: 6, strength: 0.6 }))

terrain("bocage_dense",                                               // a wall of hedge, a Rhino tank cutting through
  sky(TW, 32), stamp("_cloud_a", 180, 4),
  stamps("_oak_big", [[-24, -16], [44, -24], [116, -20], [192, -24], [260, -18]]),
  rect(0, 44, TW, 56, "A"), scatter("_bush", 0, 36, TW, 68, 90, { rflip: "x" }),                                             // the hedge itself
  poly([0, 92, 320, 84, 320, 108, 0, 112], "T"), hline(0, 92, TW, "q"),                                                       // earth bank
  ...meadow(108, TW, 36, 9, 40),
  stamp("_sherman", 116, 52), line(192, 92, 208, 100, "I", 3), line(192, 84, 208, 92, "I", 3),                               // hedge-cutter prongs
  scatter("_bush", 108, 52, 100, 36, 12, { rflip: "x", seed: 7 }), layer("dust", dust([[104, 88, 6], [96, 80, 5]])),
  soldiers([[36, 100, 1], [260, 96]]))

terrain("chemin_creux",                                               // sunken lane under a tunnel of branches
  vgrad(0, 0, TW, 68, "~4C", 1, 2),
  (c) => { for (let x = 0; x < TW; x++) c.vline(x, 0, Math.round(8 + Math.abs(x - 160) * 0.5 + 6 * Math.sin(x / 10)), (x * 3) % 7 < 2 ? "c" : "A") },   // canopy, a gap over the lane
  scatter("_bush", 0, 0, TW, 60, 50, { rflip: "xy", on: "Ac" }),
  poly([0, 40, 120, 68, 132, 144, 0, 144], "T"), poly([320, 40, 200, 68, 188, 144, 320, 144], "t"), scatter("_bush", 0, 48, 100, 60, 20, { rflip: "x", seed: 2 }), scatter("_bush", 220, 48, 100, 60, 20, { rflip: "x", seed: 5 }),
  poly([120, 68, 200, 68, 224, 144, 96, 144], "q"), line(152, 68, 124, 144, "T", 2), line(168, 68, 196, 144, "T", 2),        // lane, ruts
  layer("sunbeams", { light: true }, poly([140, 0, 160, 0, 200, 144, 172, 144], "k")),
  (c) => { for (const x of [60, 80, 240, 268]) c.line(x, 40, x + (x < 160 ? 12 : -12), 100, "W", 2) },                      // roots
  stamp("_gi", 144, 92), stamp("_kneel", 112, 104), stamp("_kneel_x", 188, 60, { flip: "x" }))

terrain("pegasus",                                                    // night: the lifting bridge and the gliders in the field
  vgrad(0, 0, TW, 64, "bBn", 1, 2), circ(260, 20, 10, "5"), glow("5", { r: 16, strength: 0.3 }), (c) => { for (const [x, y] of [[20, 8], [80, 18], [128, 6], [192, 24], [300, 40]]) c.px(x, y, "N") },
  hills(56, 2, "b", 2, 68, TW), rect(0, 64, TW, 12, "B"),
  vgrad(0, 76, TW, 68, "nBBb", 1, 2), (c) => { for (let i = 0; i < 30; i++) c.hline((i * 37) % 300, 80 + ((i * 11) % 60), 8, "n") },
  layer("bridge", rect(60, 60, 180, 8, "n"), hline(60, 60, 180, "N"), hline(60, 67, 180, "b"),
    poly([140, 60, 160, 16, 184, 16, 192, 60], "B"), poly([144, 60, 162, 20, 166, 20, 150, 60], "n"), rect(160, 16, 24, 16, "n"), rect(164, 20, 16, 8, "B"),   // counterweight girder
    (c) => { for (let x = 64; x < 236; x += 16) { c.line(x, 60, x + 16, 44, "N"); c.line(x, 44, x + 16, 60, "N") } }, hline(60, 44, 180, "N"),
    rect(56, 60, 8, 24, "n"), rect(236, 60, 8, 24, "n")),
  layer("refl", { shade: true }, rect(60, 76, 180, 6, "k")),
  poly([0, 80, 56, 76, 52, 144, 0, 144], "b"), poly([320, 80, 244, 76, 248, 144, 320, 144], "b"),
  stamp("_horsa", 4, 88, { swap: NIGHT }), stamp("_horsa", 264, 104, { swap: NIGHT }),                                          // Horsa gliders
  soldiers([[88, 32], [208, 36, 1]], "", NIGHT), stamp("_gi", 16, 60, { swap: NIGHT }),
  (c) => { for (const [x, y] of [[120, 52], [220, 48]]) { c.px(x, y, "K"); c.px(x + 1, y, "L") } }, glow("KL", { r: 6, strength: 0.6 }))

terrain("pont_mine",                                                  // stone bridge rigged with charges, warning signs
  sky(TW, 52), stamp("_cloud_b", 40, 12), hills(44, 3, "6", 6, 60, TW), treeline(52, 2, "%", "&", 6, TW, 60), rect(0, 56, TW, 12, "^"),
  ...water(68, 76, 6, "PpZz"),
  layer("bridge", rect(28, 44, 264, 72, "m"), rect(28, 40, 264, 4, "l"), hline(28, 40, 264, "5"),
    (c) => { for (let y = 60; y < 116; y += 10) c.hline(28, y, 264, "M") },
    (c) => { for (const cx of [96, 224]) { c.ellipse(cx, 88, 44, 36, "l"); c.ellipse(cx, 88, 38, 30, "_"); c.rect(cx - 46, 88, 94, 40, "_") } },
    rect(148, 56, 24, 60, "m"), vline(170, 56, 60, "M")),
  layer("refl", { shade: true }, rect(52, 108, 216, 12, "k")),
  (c) => { for (const [x, y] of [[152, 64], [152, 88], [84, 56], [216, 56]]) { c.rect(x, y, 12, 8, "s"); c.hline(x, y + 2, 12, "l"); c.vline(x + 4, y, 8, "R") } },   // charges
  wire(158, 72, 300, 24, 8, "k"), wire(300, 24, 320, 36, 3, "k"),
  vline(300, 12, 32, "W"), rect(288, 8, 28, 16, "5"), box(288, 8, 28, 16, "s"), grid(296, 10, "..kkkk..\n.kkkkkk.\n.k.kk.k.\n.kkkkkk.\n..k..k..\n...kk..."),   // skull sign
  poly([0, 68, 28, 68, 36, 144, 0, 144], "^"), poly([320, 68, 292, 68, 284, 144, 320, 144], "c"),
  stamp("_kneel", 4, 60), line(32, 84, 40, 72, "I"), circ(42, 70, 3, "I"))                                                   // sapper with mine detector

terrain("chaussee",                                                   // a single raised causeway across the flooded marsh
  vgrad(0, 0, TW, 52, "2=~4", 1, 2), hills(44, 2, "6", 4, 56, TW),
  stamp("_steeple", 256, 18),                                                                                                    // Carentan steeple far away
  ...water(56, 88, 4, "PpZz"),
  stamps("_dead", [[16, 28], [72, 36], [240, 32, { flip: "x" }]]),
  poly([120, 56, 152, 56, 320, 128, 320, 144, 60, 144], "q"), poly([120, 56, 60, 144, 44, 144, 116, 56], "Q"), poly([152, 56, 320, 128, 320, 132, 156, 56], "T"),   // causeway embankment
  (c) => { for (let i = 0; i < 6; i++) { const t = i / 6, x = Math.round(140 + t * 140), y = Math.round(56 + t * 68); c.vline(x, y - 20 - i * 4, 20 + i * 4, "W"); c.hline(x - 4, y - 18 - i * 4, 9, "W") } },   // telegraph poles
  stamp("_truck", 136, 64), soldiers([[88, 80], [200, 88, 1]]),
  (c) => { for (const [x, y] of [[40, 108], [260, 68]]) c.grid(x, y, ".5.5.\n..5..\n.555.\n55455") })

terrain("pont_vernon",                                                // wide Seine, blown spans, assault boats, chalk cliffs
  sky(TW, 44), stamp("_cloud_a", 200, 8),
  cliff(0, TW, 24, 50, "5lmM"), rect(0, 48, TW, 6, "c"),
  ...water(54, 90, 10, "PppZ"),
  rect(0, 48, 92, 8, "m"), rect(92, 52, 16, 8, "m"), line(108, 56, 124, 68, "m", 3), rect(192, 60, 128, 8, "m"), line(192, 60, 176, 72, "m", 3),   // blown spans
  (c) => { for (const x of [40, 88, 216, 272]) { c.rect(x, 56, 12, 28, "l"); c.vline(x + 11, 56, 28, "m") } },
  (c) => { for (const [x, y] of [[60, 100], [148, 88], [236, 116]]) { c.poly([x, y, x + 40, y, x + 36, y + 8, x + 4, y + 8], "O"); c.hline(x, y, 40, "y"); for (let i = 6; i < 36; i += 8) c.grid(x + i, y - 6, ".VV.\nVvvU\n.EF."); c.hline(x - 8, y + 8, 56, "5") } },   // assault boats
  (c) => { for (const [x, y] of [[108, 76], [200, 100], [280, 80]]) c.grid(x, y, ".5.5.\n..5..\n.555.\n55455") },
  poly([0, 120, 100, 124, 80, 144, 0, 144], "q"), stamp("_kneel", 8, 104), smoke(300, 36, 6))

terrain("sainte_mere",                                                // night square, burning house, a paratrooper caught on the steeple
  vgrad(0, 0, TW, 80, "bBn7", 1, 2), (c) => { for (const [x, y] of [[12, 12], [60, 24], [280, 8], [236, 28]]) c.px(x, y, "N") },
  stamp("_steeple", 128, 8, { swap: NIGHT }), stamp("_chute", 146, -4, { swap: NIGHT }),
  (c) => { for (const [x, w, h] of [[0, 60, 52], [64, 52, 40], [192, 56, 44], [252, 68, 56]]) { c.rect(x, 100 - h, w, h, "B"); c.poly([x - 4, 100 - h, x + w / 2, 84 - h, x + w + 4, 100 - h], "b"); for (let wx = x + 8; wx < x + w - 8; wx += 16) c.rect(wx, 100 - h + 12, 6, 8, "b") } },
  smoke(220, 48, 7), rect(204, 60, 36, 16, "L"), poly([200, 60, 222, 44, 244, 60], "D"), (c) => { for (let x = 206; x < 238; x += 6) c.poly([x, 60, x + 3, 50, x + 6, 60], "K") },   // the barn fire
  rect(0, 100, TW, 44, "B"), poly([80, 100, 240, 100, 280, 144, 40, 144], "n"), (c) => { for (let y = 108; y < 144; y += 8) for (let x = 48 - (y - 100) + (y % 16); x < 272 + (y - 100); x += 18) c.hline(x, y, 10, "B") },
  stamps("_oak_small", [[76, 68], [208, 72]]), soldiers([[60, 104], [236, 108, 1]], "", NIGHT), stamp("_chute", 272, 12, { swap: NIGHT }),
  glow("LK", { r: 26, strength: 0.6 }))

terrain("caen",                                                       // a field of rubble, the Abbaye aux Hommes spires behind
  vgrad(0, 0, TW, 80, "=~4", 1, 2), smoke(40, 40, 8), smoke(68, 20, 8), smoke(280, 32, 8), smoke(256, 12, 7),
  (c) => { for (const x of [124, 164]) { c.rect(x, 12, 16, 68, "l"); c.vline(x + 15, 12, 68, "m"); c.poly([x, 12, x + 8, -16, x + 16, 12], "m"); c.rect(x + 4, 28, 6, 12, "k") } }, rect(116, 44, 72, 36, "l"), rect(132, 52, 8, 16, "k"), rect(156, 52, 8, 16, "k"),   // abbey
  ruin(0, 92, 80, 52, 0.7), ruin(200, 92, 60, 36, 1.9, true), ruin(264, 92, 56, 60, 2.6),
  rect(0, 92, TW, 52, "m"), rubble(40, 96, 142, 6),
  poly([120, 92, 192, 92, 220, 144, 92, 144], "q"), stamp("_sherman", 108, 74), soldiers([[32, 96, 1], [236, 100]]),
  (c) => { for (const [x, y] of [[60, 80], [280, 84]]) { c.line(x, y, x + 16, y - 20, "w", 2); c.line(x + 8, y - 10, x + 20, y - 4, "w", 2) } })   // charred beams

terrain("saint_lo",                                                   // the town on its rock, ramparts, shattered church towers
  sky(TW, 60, "2=~4"), hills(52, 3, "6", 3, 68, TW), ...meadow(68, TW, 76, 3, 60),
  poly([40, 144, 68, 68, 252, 60, 288, 144], "m"), (c) => { for (let y = 76; y < 144; y += 12) for (let x = 60 + (y % 24); x < 272; x += 24) c.hline(x, y, 14, "M") },   // rampart masonry
  rect(72, 52, 176, 16, "l"), (c) => { for (let x = 72; x < 248; x += 12) c.rect(x, 48, 6, 4, "l") },
  (c) => { for (const x of [132, 168]) { c.rect(x, 8, 18, 44, "l"); c.vline(x + 17, 8, 44, "m"); c.rect(x + 6, 20, 6, 10, "k") } }, poly([132, 8, 138, 0, 144, 12, 150, 4, 150, 8], "_"), poly([168, 8, 176, 2, 186, 10, 186, 8], "_"),   // broken towers
  ruin(72, 52, 52, 28, 1.3), ruin(196, 52, 52, 32, 2.4, true),
  poly([0, 100, 52, 108, 40, 144, 0, 144], "^"), poly([320, 96, 280, 108, 292, 144, 320, 144], "c"), stamps("_bush", [[0, 120], [292, 124]]),
  line(288, 144, 224, 80, "Q", 5), stamp("_sherman", 216, 88, { flip: "x" }), soldiers([[8, 92], [260, 80, 1]]),
  smoke(200, 20, 7), smoke(88, 28, 6))

terrain("paris",                                                      // Hôtel de Ville, a barricade, tricolours out
  sky(TW, 68, "1+2=8"), stamp("_cloud_a", 20, 8), stamp("_cloud_b", 256, 16),
  grid(286, 4, "......M......\n......M......\n.....MMM.....\n.....M.M.....\n....MMMMM....\n....M...M....\n...MM...MM...\n...M.....M...\n..MMMMMMMMM..\n..M.......M..\n.MM.......MM.\n.M.........M.\nMMMMMMMMMMMMM"),   // the Tower, far
  rect(40, 28, 240, 68, "l"), rect(40, 28, 240, 6, "5"), (c) => { for (let x = 52; x < 272; x += 20) { c.rect(x, 40, 10, 16, "B"); c.rect(x, 64, 10, 18, "B"); c.hline(x - 2, 56, 14, "5") } },   // façade
  poly([32, 28, 52, 8, 268, 8, 288, 28], "B"), poly([140, 8, 150, -8, 170, -8, 180, 8], "B"), rect(152, -4, 16, 16, "l"), circ(160, 4, 4, "5"), circ(160, 4, 1, "k"),   // roofs, clock
  (c) => { for (const x of [68, 160, 252]) { c.vline(x, 8, 28, "W"); c.rect(x + 1, 8, 6, 12, "n"); c.rect(x + 7, 8, 6, 12, "5"); c.rect(x + 13, 8, 6, 12, "s") } },   // tricolours
  rect(0, 96, TW, 48, "m"), (c) => { for (let y = 100; y < 144; y += 6) for (let x = (y % 12) * 2; x < TW; x += 12) c.rect(x, y, 8, 4, "l") },   // paving
  (c) => { for (const [x, w] of [[60, 52], [124, 80], [216, 48]]) { c.poly([x, 112, x + 8, 92, x + w - 8, 92, x + w, 112], "M"); for (let i = x + 4; i < x + w - 4; i += 8) c.rect(i, 96 + (i % 3) * 2, 6, 4, "l") } },   // barricade of paving stones
  grid(132, 80, "....WWWWWWWW....\n..WW00000000WW..\nWWWWWWWWWWWWWWWW\n..00........00.."), stamp("_resist", 88, 60), stamp("_resist", 184, 64, { flip: "x" }), stamp("_gi", 240, 68))

terrain("carpiquet",                                                  // airfield wrecked: torn hangar, cratered runway
  sky(TW, 60, "2=~4"), hills(56, 2, "6", 2, 68, TW), ...meadow(64, TW, 80, 2, 60),
  (c) => { c.ellipse(80, 68, 60, 36, "j"); c.rect(20, 68, 120, 40, "_") }, (c) => { for (let x = 28; x < 132; x += 6) for (let y = 32; y < 68; y++) if (c.is(x, y, "j")) c.px(x, y, "I") },
  poly([52, 32, 88, 40, 68, 68, 44, 68], "k"), (c) => { for (let x = 44; x < 88; x += 6) c.line(x, 36 + (x % 10), x + 4, 68, "I") },   // the hole, ribs
  poly([128, 68, 184, 68, 320, 132, 320, 144, 80, 144], "M"), line(128, 68, 80, 144, "0"), line(184, 68, 320, 132, "0"),      // runway
  crater(160, 84, 10), crater(200, 108, 14), crater(140, 120, 12), crater(260, 124, 10),
  stamp("_p47_x", 216, 72, { rot: 180, flip: "y" }), smoke(248, 76, 7),                                                         // wrecked Fw 190
  (c) => { for (let x = 0; x < 60; x += 16) c.rect(x, 108, 12, 6, "8") }, soldiers([[8, 80, 1], [40, 88]]), stamp("_sherman", 220, 96))

terrain("cerisy",                                                     // summer beech forest, sun shafts, foxholes
  rect(0, 0, TW, TH, "c"), vgrad(0, 0, TW, 32, "C~C", 1, 2),
  (c) => { for (const x of [20, 68, 124, 192, 248, 300]) { c.rect(x, 0, 10, 120, "m"); c.vline(x + 9, 0, 120, "M"); c.vline(x, 0, 120, "l") } },   // beech trunks
  stamps("_oak_big", [[-16, -48], [52, -52], [116, -44], [184, -52], [240, -48]]),
  rect(0, 112, TW, 32, "A"), scatter("_bush", 0, 100, TW, 44, 24, { rflip: "x" }),
  layer("sunbeams", { light: true }, poly([80, 0, 104, 0, 160, 144, 124, 144], "k"), poly([208, 0, 224, 0, 264, 144, 240, 144], "k")),
  ellipse(160, 124, 24, 6, "t"), ellipse(160, 126, 18, 4, "k"), grid(152, 116, "..UUUU..\n.UvvvvU.\nUUUUUUUU"), line(168, 120, 188, 110, "I"),
  stamp("_kneel", 80, 92), stamp("_gi", 220, 80))

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


// ------------------------------------------------------------------ initiative coin (64x64), struck in relief
// coin_0 = the player (the Allied star), coin_1 = the enemy (the eagle).
const starMask = (cx, cy, R, r, key) => (c) => {
  const P = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R; return [cx + d * Math.cos(a), cy + d * Math.sin(a)] })
  const inside = (x, y) => P.reduce((n, [x1, y1], i) => { const [x2, y2] = P[(i + 1) % 10]; return (y1 > y) !== (y2 > y) && x < x1 + (y - y1) * (x2 - x1) / (y2 - y1) ? !n : n }, false)
  for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) if (inside(x + 0.5, y + 0.5)) c.px(x, y, key)
}
sprite("coin_0", { w: 64, h: 64 }, coinDisc("u", "v", "V", "U"), starMask(32, 34, 20, 8, "&"), relief("&", "5", "5", "4"), ring(32, 33, 23, "U"))
const EAGLE = `
  ........##..........
  ........##..........
  .........#..........
  ##########..........
  ##########..........
  .#########..........
  .#.#######..........
  .#.#.#####..........
  ...#.#.###..........
  .....#.###..........
  ........##..........
  ......##.#..........
  .....##..#..........
  ........##..........
  .......###..........
  .......###..........`.split("\n").filter((r) => r.trim()).map((r) => r.trim())
sprite("coin_1", { w: 64, h: 64 }, coinDisc("g", "G", "h", "g"),
  (c) => { for (let y = 0; y < 16; y++) for (let x = 0; x < 20; x++) { const on = EAGLE[y][x] === "#" || EAGLE[y][19 - x] === "#"; if (on) c.rect(12 + x * 2, 16 + y * 2, 2, 2, "&") } },   // mirrored eagle, drawn 2x
  relief("&", "H", "4", "g"), px(29, 19, "g"))

// ------------------------------------------------------------------ campaign map (640x280)
// Same frame as campaign.js project(): lon -2.0..2.5, lat 49.8..48.5. Seen from above, staff-map style:
// bocage patchwork, rivers, forests, towns. Battle markers and names are HTML on top.
const P = (lon, lat) => [Math.round((lon + 2) * MW / 4.5), Math.round((49.8 - lat) * MH / 1.3)]
const path = (pts) => pts.flatMap(([lon, lat]) => P(lon, lat))
const LAND = path([
  [-2.1, 48.4], [-2.1, 48.64], [-1.85, 48.67], [-1.55, 48.62], [-1.4, 48.66], [-1.52, 48.72], [-1.6, 48.84], [-1.58, 49.0],
  [-1.62, 49.13], [-1.67, 49.25], [-1.8, 49.38], [-1.88, 49.52], [-1.94, 49.65], [-1.94, 49.72], [-1.85, 49.71], [-1.62, 49.65],
  [-1.45, 49.69], [-1.26, 49.67], [-1.24, 49.6], [-1.27, 49.57], [-1.25, 49.48], [-1.18, 49.42], [-1.16, 49.36], [-1.12, 49.33],
  [-1.08, 49.38], [-1.04, 49.39], [-0.99, 49.4], [-0.85, 49.37], [-0.75, 49.35], [-0.62, 49.34], [-0.45, 49.335], [-0.35, 49.32],
  [-0.25, 49.29], [-0.12, 49.29], [-0.07, 49.3], [0.08, 49.37], [0.23, 49.42], [0.38, 49.44], [0.3, 49.47], [0.1, 49.49],
  [0.07, 49.53], [0.16, 49.69], [0.2, 49.71], [0.37, 49.76], [0.6, 49.85], [2.6, 49.9], [2.6, 48.4]])
const river = (pts, w = 2) => (c) => { const q = path(pts); for (let i = 2; i < q.length; i += 2) c.line(q[i - 2], q[i - 1], q[i], q[i + 1], "p", w) }
const blob = (lon, lat, r, key) => (c) => { const [x, y] = P(lon, lat); c.circ(x, y, r, key) }
const town = (lon, lat, r) => (c) => {                       // red roofs around a grey core, little streets
  const [x, y] = P(lon, lat), rnd = c.rng(x * 7 + y)
  for (let i = 0; i < r * r * 5 + 6; i++) { const a = rnd() * 6.28, d = rnd() * r; const tx = Math.round(x + Math.cos(a) * d * 1.3), ty = Math.round(y + Math.sin(a) * d); c.rect(tx, ty, 2, 1, rnd() < 0.35 ? "l" : "s"); c.px(tx, ty + 1, "R") }
  c.rect(x - 1, y - 1, 3, 2, "M")
}
scene("map_normandie", { w: MW, h: MH, bg: "p" },
  vgrad(0, 0, MW, 100, "Zp", 1, 2),
  (c) => { const r = c.rng(3); for (let i = 0; i < 320; i++) c.hline(Math.floor(r() * MW), Math.floor(r() * 120), 3 + Math.floor(r() * 4), "P") },   // chop
  poly(LAND, "C"),
  (c) => {                                                   // bocage patchwork: jittered Voronoi fields, hedges on their borders
    const r = c.rng(11), S = 10, seeds = [], F = "CCCCCC^^^^ddcy"
    const cols = Math.floor(MW / S) + 3, H = S * 0.8, id = new Int32Array(MW * MH).fill(-1)
    for (let gy = -1; gy < MH / H + 1; gy++) for (let gx = -1; gx < cols - 1; gx++) seeds.push([gx * S + r() * S, gy * H + r() * H, F[Math.floor(r() * F.length)]])
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      if (!c.is(x, y, "C")) continue
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
      c.px(x, y, edge ? "A" : seeds[k][2])
    }
  },
  (c) => {                                                   // coastline: pale sand on land, surf on sea
    const land = (x, y) => c.is(x, y, "C^dycA")
    const sea = [], sand = []
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => x + dx >= 0 && x + dx < MW && y + dy >= 0 && y + dy < MH && land(x + dx, y + dy) !== land(x, y))
      if (n) (land(x, y) ? sand : sea).push([x, y])
    }
    for (const [x, y] of sand) c.px(x, y, "l")
    for (const [x, y] of sea) c.px(x, y, "P")
  },
  // flooded marshes of the Douve and the Dives, forests
  (c) => { for (const [lon, lat, r] of [[-1.2, 49.3, 10], [-1.32, 49.25, 6], [-0.12, 49.24, 6]]) { const [x, y] = P(lon, lat); for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) if (i * i + j * j <= r * r && (i + j) % 2 === 0) c.px(x + i, y + j, "P") } },
  ...[[-0.88, 49.2, 12], [-0.8, 49.18, 8], [0.7, 49.4, 10], [1.5, 49.4, 12], [1.58, 49.37, 8], [-1.0, 48.8, 8], [1.8, 48.66, 14], [0.92, 48.95, 10], [-0.3, 48.72, 8]].map(([lon, lat, r]) => blob(lon, lat, r, "A")),
  (c) => { const r = c.rng(5); for (let i = 0; i < 900; i++) { const x = Math.floor(r() * MW), y = Math.floor(r() * MH); if (c.is(x, y, "A") && c.is(x + 1, y, "A") && c.is(x, y + 1, "A")) { c.px(x, y, "c"); c.px(x + 1, y + 1, "a") } } },   // tree crowns
  river([[0.38, 49.44], [0.6, 49.45], [0.85, 49.42], [1.1, 49.44], [1.2, 49.33], [1.4, 49.25], [1.48, 49.09], [1.72, 48.99], [2.0, 48.93], [2.2, 48.9], [2.35, 48.86], [2.6, 48.82]], 4),
  river([[-0.25, 49.29], [-0.36, 49.18], [-0.4, 49.05], [-0.25, 48.9], [-0.1, 48.75], [0.0, 48.7]]),
  river([[-1.12, 49.33], [-1.09, 49.11], [-0.95, 48.9], [-0.89, 48.8]]),
  river([[-1.12, 49.33], [-1.3, 49.28], [-1.45, 49.3]]),
  river([[-0.12, 49.29], [-0.1, 49.1], [0.0, 48.95]]),
  blob(2.35, 48.86, 12, "m"), blob(2.3, 48.88, 8, "l"),                                                                     // Paris
  town(-1.62, 49.63, 6), town(-0.36, 49.18, 6), town(-1.09, 49.11, 4), town(-0.7, 49.28, 4), town(1.1, 49.44, 6),
  town(0.12, 49.49, 6), town(-0.2, 48.89, 2), town(-0.94, 48.65, 2), town(1.48, 49.09, 2), town(-1.25, 49.3, 2),
  town(-1.36, 48.68, 2), town(-1.44, 49.05, 2), town(0.23, 49.15, 4), town(1.15, 49.02, 4), town(-1.6, 48.84, 2),
  (c) => { for (const [lon, lat] of [[-1.1, 49.47], [-0.95, 49.46], [-0.8, 49.44], [-0.6, 49.42], [-0.45, 49.41], [-0.3, 49.4], [-1.0, 49.52], [-0.7, 49.5]]) { const [x, y] = P(lon, lat); c.hline(x - 5, y, 10, "M"); c.hline(x - 3, y - 1, 5, "m"); c.px(x, y - 2, "M") } },   // the invasion fleet
  box(0, 0, MW, MH, "W"), box(2, 2, MW - 4, MH - 4, "x"))
