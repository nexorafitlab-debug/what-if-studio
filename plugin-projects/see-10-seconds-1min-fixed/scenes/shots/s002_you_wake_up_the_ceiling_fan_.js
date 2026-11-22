// s002 — "You wake up. The ceiling fan spins." [BEDROOM - DAWN] · wake — FIXED:
// was: Kian already standing beside the bed. Now: lie→sit→sitBack IN bed,
// copied from the good sample's s001 wake shot (hero-motion 6.73). No beat
// banner here — the chapter card just announced THE FAN, and the banner
// covered the fan blades + poster top.
import { E, V, registerShot, layer, prog } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
registerShot('s002', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomDawn(g, t, info, { fanSpeed: 2.2 });
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const sitK = prog(t, 0, 1.2);
    const rot = -Math.PI / 2 * (1 - sitK);
    const ky = (GY + 40) + 66 * (1 - sitK);
    const pose = breathe(posesAt(t, [[0, 'lie'], [0.5, 'sit'], [1.2, 'sitBack']]), t);
    drawFigure(g, { x: E.W * 0.36, y: ky, s: V(1.5, 1.6), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sleepy', rot, rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 4.0, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 250 });
} });
