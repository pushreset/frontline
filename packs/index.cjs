// Every campaign pack, for node (sim.cjs, balance.cjs). The browser loads the same files with the
// <script> tags of index.html: adding a campaign = its folder + a line here + its tags there.
const LIST = {
  normandie: ['pack', 'cards', 'terrains', 'battles'],
  verdun: ['pack', 'cards', 'terrains', 'battles'],
  pacifique: ['pack', 'cards', 'terrains', 'battles'],
  test: ['pack'],                   // hidden test campaign, simulator only
};
for (const [id, files] of Object.entries(LIST)) for (const f of files) require(`./${id}/${f}.js`);
module.exports = globalThis.PACKS;
