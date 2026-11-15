// War of the Ring — shared palette for every picture of the pack (included first by art.px.js).
// Same key convention as packs/art-lib.px.js and the other packs, with Middle-earth colours, plus a few keys
// of its own: orc skin < > *, the ash sky of Mordor ; - :, cold elven light ! and white ?.
pal({
  k: "#15110f",                                                                     // outline
  1: "#3f5a85", 2: "#6585ad", 3: "#98b2cb", 4: "#cbd5d6", 5: "#eee9d8", 6: "#8a9a99", // sky top -> haze, cloud, far hills
  "+": "#52709a", "=": "#7d9bbd", "~": "#b2c5d4",                                   // sky in-betweens (smooth gradients)
  "^": "#5f7a33",                                                                   // grass in-between
  "%": "#677c7a", "&": "#50625c",                                                   // far woods in the haze (lit, shade)
  7: "#a85a4e", 8: "#dc9a6a", 9: "#f2d39c",                                         // dusk
  i: "#30353f", I: "#545d6b", j: "#8892a0", J: "#cdd3d8",                           // steel, mail, mithril glints
  b: "#4a2e16", B: "#80561f", n: "#bd8c38", N: "#ecd078",                           // bronze, gold
  r: "#3c1216", R: "#701d25", s: "#a7342c", S: "#d4624a",                           // red (Mordor's eye, Harad, banners)
  g: "#1f2d22", G: "#355037", h: "#587a49", H: "#8ba766",                           // green cloth (Rohan, elven cloaks)
  u: "#16161f", U: "#2b2f45", v: "#4b557a", V: "#8592b8",                           // sable and night blue (Gondor's black, the Nazgûl)
  o: "#523818", O: "#87602a", y: "#c19a40", Y: "#e7cc72",                           // ochre, thatch, blond hair
  e: "#45281f", E: "#7a4834", f: "#b47860", F: "#e1ae8e",                           // skin
  w: "#28190f", W: "#523420", x: "#825636", X: "#b18451",                           // wood, leather
  a: "#1c2918", A: "#30441f", c: "#506629", C: "#7c8c3a", d: "#aaa95b",             // grass, leaves
  t: "#38291c", T: "#64472f", q: "#916c48", Q: "#bf9c6b",                           // earth, roads
  0: "#3e3b39", M: "#69655d", m: "#979084", l: "#cbc4b1",                           // stone (the white stone of Gondor at its lightest)
  z: "#18262f", Z: "#2a4555", p: "#4b7280", P: "#86a9ad",                           // water
  D: "#c84a1d", L: "#ef9f38", K: "#fbedb0",                                         // fire
  "<": "#2f3a24", ">": "#56603c", "*": "#838a5c",                                   // orc skin, dark -> light (greenish grey)
  ";": "#2a1c1c", "-": "#4a2a28", ":": "#6e3a2c",                                   // ash sky of Mordor, dark -> glowing
  "!": "#bfe6ff", "?": "#ffffff",                                                   // cold elven light, pure white (glow cores, Gandalf)
})
ramps("1+2=3~45", "kaAc^Cd", "kiIjJ", "kbBnN", "krRsS", "kgGhH", "kuUvV", "koOyY", "keEfF", "kwWxX", "kaAcCd", "ktTqQ", "k0Mml", "kzZpP",
  "12345", "&%6345", "789", "DLK", "k<>*", ";-:", "!?")
include("../art-lib.px.js")
