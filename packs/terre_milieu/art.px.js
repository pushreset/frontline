// War of the Ring — every picture of the pack: cards 128x80, terrains 320x144, map 640x280, icons, coin.
// Build (writes packs/terre_milieu/out/): node ~/.claude/skills/pxl-pixel-art/bin/pxl.js build packs/terre_milieu/art.px.js --no-preview
// Split in files that share one palette; each wraps its helpers in a { } block (one global scope) and prefixes its
// parts (_u1 _u2 _ld) so names never clash.
include("palette.px.js")
include("art-units-a.px.js")   // Free Peoples' core units and their Shadow versions
include("art-units-b.px.js")   // heroes, monsters, orders, card back, icons, coin
include("art-land.px.js")      // terrains and the map of Middle-earth
