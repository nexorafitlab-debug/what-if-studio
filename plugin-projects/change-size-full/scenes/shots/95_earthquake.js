import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s095', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = gymquake(g, t, info, { shake: true });
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "An earthquake. At school." — the whole gym shakes, students run
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.ready, t), expr: 'scared', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    const mx = E.W * 0.62 + t * 60;
    drawFigure(g, { x: mx, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: walkPose(t * Math.PI * 2 * 1.2), expr: 'scared', talk: 0, blink: (t % 3.1) < 0.12, rim });
    const sx = E.W * 0.88 - t * 80;
    drawFigure(g, { x: sx, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.STU7.outfit, pose: walkPose(t * Math.PI * 2 * 1.2 + 1), expr: 'scared', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.2, 0.5));
  text(g, 'EARTHQUAKE', E.W / 2, E.H * 0.16, { size: V(64, 70), color: '#e07856', glow: 24, glowColor: 'rgba(224,120,86,0.5)', spacing: 6, alpha: a });
} });
