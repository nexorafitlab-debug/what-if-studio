// s022 — "Everyone has one for you too." Kian steps back from the mirror, stunned,
// hands on his head. The reflection — and its number — are still there.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { bathroomMirror } from '../sets/bathroom_mirror.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s024', { draw(g, t, info) {
  const cam = { z: 1.1, x: -60, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M, mirror } = bathroomMirror(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // the reflection, still wearing its number
    const refl = { x: E.W * 0.42, y: mirror.y + mirror.h - 20, s: 1.15, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'shocked', alpha: 0.9, rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, refl);
    const [hx, hy, hr] = headPos(refl);
    chancePill(g, hx, hy, hr, '5', t);
    // Kian steps back, hands on his head
    const lx = E.W * 0.64 + t * 60;
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.handsOnHead]]), t);
    drawFigure(g, { x: lx, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.KIAN.outfit, pose, expr: 'shocked', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.6, 0.9));
  // FIX (2026-11-22): text was at 0.18H and covered the "5" pill above the
  // mirror reflection's head — moved to the floor band (0.90H), clear of the
  // mirror, the pill, the sink and Kian's feet.
  text(g, 'EVERYONE HAS ONE FOR YOU TOO.', E.W / 2, E.H * 0.90, { size: V(44, 50), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });
