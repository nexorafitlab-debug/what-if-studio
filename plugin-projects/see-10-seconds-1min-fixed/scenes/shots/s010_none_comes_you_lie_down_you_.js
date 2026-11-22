// s010 — "None comes. You lie down. You stare at the ceiling." [BEDROOM - DAWN] · look — FIXED:
// was point→think→stand standing at 0.50W (he never lay down). Now: he really
// lies down — sitBack→sit→lie with the whole figure rotating back (rot
// 0 → -90°) and sinking onto the mattress, head landing on the pillow
// (x=0.39W so head 588 / feet 900 sit on the bed, 499..1119).
import { E, V, registerShot, layer, prog } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
registerShot('s010', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomDawn(g, t, info, { fanSpeed: 1.0 });
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const lieK = prog(t, 2.0, 3.4);
    const rot = -Math.PI / 2 * lieK;
    const ky = (GY + 40) + 66 * lieK;
    const pose = breathe(posesAt(t, [[0, 'sitBack'], [1.2, 'sit'], [2.2, 'lie']]), t);
    drawFigure(g, { x: E.W * 0.39, y: ky, s: V(1.5, 1.6), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'neutral', rot, rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 4.0, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
} });
