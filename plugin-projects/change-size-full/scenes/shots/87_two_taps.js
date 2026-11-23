import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { roof } from '../sets/roof.js';
registerShot('s087', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = roof(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Two taps. Pause. One tap. For the treehouse." — the knock, on screen
    drawFigure(g, { x: E.W * 0.56, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(posesAt(t, [[0, POSES.sit], [0.4, POSES.point], [0.9, POSES.sit], [1.4, POSES.point]]), t), expr: 'smile', talk: 0, blink: (t % 3.1) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.sit, t), expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.2, 0.5));
  text(g, 'TAP  TAP  ·  TAP', E.W / 2, E.H * 0.18, { size: V(56, 60), color: '#ffd76a', glow: 20, glowColor: 'rgba(255,215,106,0.5)', spacing: 6, alpha: a });
} });
