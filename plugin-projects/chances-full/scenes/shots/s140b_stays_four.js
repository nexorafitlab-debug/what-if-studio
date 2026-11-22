// s140 P2 — "It stays four. It will always stay four." Reflection 4; Kian, sad, accepts it.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { bathroomMirror } from '../sets/bathroom_mirror.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s211', { draw(g, t, info) {
  const cam = { z: 1.2, x: -60, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M, mirror } = bathroomMirror(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const refl = { x: E.W * 0.42, y: mirror.y + mirror.h - 20, s: 1.2, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', alpha: 0.9, rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, refl);
    const [hx, hy, hr] = headPos(refl);
    chancePill(g, hx, hy, hr, '4', t);
    drawFigure(g, { x: E.W * 0.66, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.6, 0.9));
  text(g, 'STAYS FOUR.', E.W / 2, E.H * 0.90, { size: V(56, 64), color: '#ffb347', glow: 26, glowColor: 'rgba(255,179,71,0.55)', spacing: 2, alpha: a });
} });
