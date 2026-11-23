import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { crowdSet } from '../sets/crowd.js';
registerShot('s138', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = crowdSet(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "He taps the knock on your arm. Two taps. Pause. One tap." — Milo taps Noah
    const tap = (t > 0.4 && t < 0.6) || (t > 0.8 && t < 1.0) || (t > 1.5 && t < 1.7);
    drawFigure(g, { x: E.W * 0.55, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(tap ? POSES.point : POSES.stand, t), expr: 'smile', talk: 0, blink: (t % 3.1) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.44, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.stand, t), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'TAP  TAP  ·  TAP', E.W / 2, E.H * 0.18, { size: V(56, 60), color: '#ffd76a', glow: 20, glowColor: 'rgba(255,215,106,0.5)', spacing: 6, alpha: a });
} });
