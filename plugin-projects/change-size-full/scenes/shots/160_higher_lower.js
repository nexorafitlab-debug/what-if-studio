import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { science } from '../sets/science.js';
registerShot('s160', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = science(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Children sound higher. Large men sound lower." — a child and a big man
    drawFigure(g, { x: E.W * 0.24, y: GY, s: V(1.0, 1.1), facing: 1, outfit: CAST.LILY.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.talk]]), t), expr: 'smile', talk: 0, blink: (t % 3.1) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.72, y: GY, s: 2.2, facing: -1, outfit: CAST.WADLOW.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.talk]]), t), expr: 'neutral', talk: 0, blink: (t % 3.5) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.50, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.stand, t), expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // high tight waves from the child, low wide waves from the tall man
    g.strokeStyle = 'rgba(255,215,106,0.7)'; g.lineWidth = 3;
    for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(E.W * 0.24, GY - 160, 30 + i * 18 + Math.sin(t * 8 + i) * 4, -0.7, 0.7); g.stroke(); }
    g.strokeStyle = 'rgba(159,216,255,0.7)'; g.lineWidth = 5;
    for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(E.W * 0.72, GY - 300, 50 + i * 30 + Math.sin(t * 3 + i) * 6, Math.PI - 0.7, Math.PI + 0.7); g.stroke(); }
  });
} });
