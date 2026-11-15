'use strict';
// Music and sound effects, synthesised with Web Audio: no asset files, works from file://.
// Music: slow D-minor march (string pad, bass, horn calls); 'battle' mood adds a field snare.
// Browsers only allow audio after a user gesture, so the context starts on the first click.
const SND = (() => {
  const PREF = 'ldf-audio';
  let pref = { music: true, sfx: true };
  try { Object.assign(pref, JSON.parse(localStorage.getItem(PREF)) || {}); } catch { /* defaults */ }
  let ctx = null, musicBus, sfxBus, verb, noiseBuf, mood = 'calm', timer = null, nextBar = 0, bar = 0;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = pref.music ? 0.32 : 0; musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = pref.sfx ? 0.7 : 0; sfxBus.connect(master);
    // Cheap hall: convolver fed with decaying noise.
    verb = ctx.createConvolver();
    const len = ctx.sampleRate * 2.2, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3; }
    verb.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = 0.35; verb.connect(wet); wet.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    if (pref.music) startMusic();
  }
  const now = () => ctx.currentTime;
  const hz = m => 440 * 2 ** ((m - 69) / 12);

  // ---- voices --------------------------------------------------------------------------------
  function env(g, t, peak, a, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function tone(f, t, dur, { type = 'sine', gain = 0.2, a = 0.01, bus = sfxBus, to, lp, wet = false, vib = 0 } = {}) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    if (vib) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 5.5; lg.gain.value = vib; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur + 0.1); }
    let node = o;
    if (lp) { const f2 = ctx.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = lp; o.connect(f2); node = f2; }
    node.connect(g); g.connect(bus); if (wet) g.connect(verb);
    env(g, t, gain, a, dur); o.start(t); o.stop(t + a + dur + 0.05);
  }
  function noise(t, dur, { gain = 0.3, type = 'lowpass', f = 1000, to, q = 1, a = 0.005, bus = sfxBus, wet = false } = {}) {
    const n = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    n.buffer = noiseBuf; n.loop = true; fl.type = type; fl.Q.value = q; fl.frequency.setValueAtTime(f, t);
    if (to) fl.frequency.exponentialRampToValueAtTime(to, t + dur);
    n.connect(fl); fl.connect(g); g.connect(bus); if (wet) g.connect(verb);
    env(g, t, gain, a, dur); n.start(t); n.stop(t + a + dur + 0.05);
  }

  // ---- effects -------------------------------------------------------------------------------
  const FX = {
    click: t => tone(1200, t, 0.03, { type: 'square', gain: 0.03 }),
    coin: t => { tone(2637, t, 0.5, { type: 'triangle', gain: 0.1, wet: true }); tone(3520, t, 0.35, { gain: 0.05 }); }, // ting of a flipped coin
    card: t => noise(t, 0.14, { type: 'bandpass', f: 3500, to: 1200, q: 0.8, gain: 0.25 }),
    shuffle: t => { for (let i = 0; i < 4; i++) FX.card(t + i * 0.09); },
    flip: t => { noise(t, 0.05, { type: 'highpass', f: 3000, gain: 0.2 }); tone(660, t + 0.05, 0.12, { type: 'triangle', gain: 0.08, to: 990 }); },
    boots: t => { for (let i = 0; i < 4; i++) noise(t + i * 0.13, 0.07, { f: 500, gain: 0.35 }); },
    tank: t => {
      const o = ctx.createOscillator(), lfo = ctx.createOscillator(), lg = ctx.createGain(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(42, t); o.frequency.linearRampToValueAtTime(55, t + 0.6); o.frequency.linearRampToValueAtTime(38, t + 1.5);
      fl.type = 'lowpass'; fl.frequency.value = 260; lfo.frequency.value = 11; lg.gain.value = 0.12;
      lfo.connect(lg); lg.connect(g.gain); o.connect(fl); fl.connect(g); g.connect(sfxBus);
      env(g, t, 0.3, 0.25, 1.4); o.start(t); lfo.start(t); o.stop(t + 1.8); lfo.stop(t + 1.8);
      for (let i = 0; i < 6; i++) noise(t + 0.2 + i * 0.2, 0.03, { type: 'bandpass', f: 1800, q: 4, gain: 0.08 });   // track clank
    },
    plane: t => {
      for (const d of [0, 7]) tone(150 + d, t, 1.6, { type: 'sawtooth', gain: 0.06, a: 0.7, to: 85, lp: 700 });
      noise(t, 1.6, { f: 600, to: 250, gain: 0.12, a: 0.7 });
    },
    boom: t => {
      noise(t, 1.6, { f: 1400, to: 60, gain: 0.7, wet: true });
      tone(70, t, 0.8, { gain: 0.6, to: 28 });
    },
    whistle: t => { tone(1500, t, 0.7, { gain: 0.06, to: 450, wet: true }); FX.boom(t + 0.75); },
    // Officer's whistle before an assault: two trilled blasts (the pea makes the warble).
    assault: t => { for (const [dt, d] of [[0, 0.35], [0.45, 0.9]]) tone(2300, t + dt, d, { type: 'triangle', gain: 0.07, a: 0.02, vib: 120, wet: true }); },
    // Shovel biting into earth: short scrapes with a thud.
    dig: t => { for (let i = 0; i < 3; i++) { noise(t + i * 0.28, 0.12, { type: 'bandpass', f: 1600, q: 2, gain: 0.18 }); noise(t + i * 0.28 + 0.1, 0.08, { f: 300, gain: 0.3 }); } },
    // Ship's horn: two deep blasts across the water.
    horn: t => { for (const [dt, d] of [[0, 0.8], [1.0, 1.3]]) { tone(98, t + dt, d, { type: 'sawtooth', gain: 0.1, a: 0.06, lp: 420, wet: true }); tone(147, t + dt, d, { type: 'sawtooth', gain: 0.05, a: 0.06, lp: 420 }); } },
    // Ship under way: diesel throb and the bow wave.
    naval: t => { tone(48, t, 1.4, { type: 'sawtooth', gain: 0.12, a: 0.3, lp: 180 }); noise(t, 1.4, { f: 500, to: 220, gain: 0.22, a: 0.3 }); noise(t + 0.4, 0.6, { type: 'bandpass', f: 2600, q: 0.7, gain: 0.07, a: 0.2 }); },
    // Gallop: three hoofbeats (thud + dirt) per stride, three strides fading away.
    hooves: t => { for (let s = 0; s < 3; s++) for (const dt of [0, 0.07, 0.15]) { const at = t + s * 0.34 + dt, k = 1 - s * 0.25; tone(110, at, 0.06, { gain: 0.16 * k, to: 60 }); noise(at, 0.05, { f: 420, gain: 0.3 * k }); } },
    // Roman cornu: a bronze horn, a rising fifth, brassy (sawtooth through a lowpass), with the hall's echo.
    cornu: t => { for (const [f, dt, d] of [[196, 0, 0.55], [294, 0.6, 1.1]]) { tone(f, t + dt, d, { type: 'sawtooth', gain: 0.08, a: 0.05, lp: 1300, wet: true, vib: 2 }); tone(f * 2, t + dt, d, { type: 'square', gain: 0.015, a: 0.06, lp: 1800 }); } },
    smoke: t => noise(t, 1.8, { type: 'bandpass', f: 900, to: 400, q: 0.5, gain: 0.25, a: 0.2 }),
    drumroll: t => { for (let i = 0; i < 12; i++) noise(t + i * 0.045, 0.05, { type: 'bandpass', f: 2200, q: 1.5, gain: 0.08 + i * 0.012 }); noise(t + 0.55, 0.25, { type: 'bandpass', f: 2000, gain: 0.25, wet: true }); },
    // Bugle calls: horn-ish triangle + quiet square, through the hall.
    bugle: (t, notes) => { for (const [m, dt, d] of notes) { tone(hz(m), t + dt, d, { type: 'triangle', gain: 0.16, a: 0.03, wet: true, vib: 3 }); tone(hz(m), t + dt, d, { type: 'square', gain: 0.025, a: 0.03, lp: 1800 }); } },
    capture: t => FX.bugle(t, [[67, 0, 0.14], [72, 0.16, 0.14], [76, 0.32, 0.14], [79, 0.5, 0.6]]),
    lost: t => FX.bugle(t, [[62, 0, 0.35], [58, 0.4, 0.8]]),
    victory: t => FX.bugle(t, [[67, 0, 0.12], [67, 0.14, 0.12], [72, 0.3, 0.3], [76, 0.65, 0.12], [76, 0.8, 0.12], [79, 0.95, 0.3], [84, 1.3, 1.2]]),
    defeat: t => FX.bugle(t, [[69, 0, 0.6], [65, 0.65, 0.6], [62, 1.3, 0.6], [57, 1.95, 1.4]]),
  };
  function play(name, delay = 0) { if (!ctx || !pref.sfx) return; FX[name](now() + 0.02 + delay); }

  // ---- music ---------------------------------------------------------------------------------
  const BEAT = 60 / 72;
  // i - VI - III - VII - i - iv - V - V in D minor (MIDI notes, root first).
  const PROG = [[50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55], [50, 53, 57], [55, 58, 62], [57, 61, 64], [57, 61, 64]];
  const SCALE = [62, 64, 65, 67, 69, 70, 72, 74];
  function scheduleBar(t) {
    const ch = PROG[bar % PROG.length];
    for (const m of ch) for (const det of [-5, 5]) {                                  // string pad
      const o = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = hz(m); o.detune.value = det; fl.type = 'lowpass'; fl.frequency.value = 800;
      o.connect(fl); fl.connect(g); g.connect(musicBus); g.connect(verb);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.03, t + 1); g.gain.setValueAtTime(0.03, t + 4 * BEAT - 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + 4 * BEAT + 0.4);
      o.start(t); o.stop(t + 4 * BEAT + 0.5);
    }
    for (const b of [0, 2]) tone(hz(ch[0] - 12), t + b * BEAT, BEAT * 1.6, { type: 'triangle', gain: 0.16, a: 0.02, bus: musicBus, lp: 400 });   // bass
    if (bar % 4 === 0) tone(hz(ch[0] - 24), t, 1.2, { gain: 0.25, a: 0.005, bus: musicBus, to: hz(ch[0] - 26) });                                   // timpani
    if (mood === 'battle') {                                                         // field snare, military pattern
      [1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0].forEach((on, i) => { if (on) noise(t + i * BEAT / 4, 0.06, { type: 'bandpass', f: 2400, q: 1.2, gain: i % 4 ? 0.035 : 0.06, bus: musicBus }); });
    }
    if (bar % 2 === 1 && Math.random() < 0.6) {                                      // horn call
      let i = SCALE.indexOf(ch[1] + 12); if (i < 0) i = 3;
      const steps = [0, 1, 2, 2.5].slice(0, 2 + Math.floor(Math.random() * 3));
      steps.forEach((s, k) => { i = Math.max(0, Math.min(SCALE.length - 1, i + [-2, -1, 1, 2][Math.floor(Math.random() * 4)])); tone(hz(SCALE[i]), t + s * BEAT, BEAT * (k === steps.length - 1 ? 1.8 : 0.9), { type: 'triangle', gain: 0.07, a: 0.08, bus: musicBus, wet: true, vib: 2.5 }); });
    }
    bar++;
  }
  function startMusic() {
    if (!ctx || timer) return;
    nextBar = now() + 0.1;
    timer = setInterval(() => { while (nextBar < now() + 1) { scheduleBar(nextBar); nextBar += 4 * BEAT; } }, 250);
  }
  function stopMusic() { clearInterval(timer); timer = null; }

  function set(k, v) {
    pref[k] = v;
    try { localStorage.setItem(PREF, JSON.stringify(pref)); } catch { /* not saved */ }
    if (!ctx) return;
    if (k === 'music') { musicBus.gain.setTargetAtTime(v ? 0.32 : 0, now(), 0.3); v ? startMusic() : stopMusic(); }
    if (k === 'sfx') sfxBus.gain.value = v ? 0.7 : 0;
  }

  document.addEventListener('pointerdown', () => { init(); if (ctx.state === 'suspended') ctx.resume(); });
  return { play, set, pref, setMood: m => { mood = m; } };
})();
