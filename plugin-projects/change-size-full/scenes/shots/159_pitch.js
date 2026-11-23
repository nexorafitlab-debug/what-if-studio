import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { science } from '../sets/science.js';
registerShot('s159', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = science(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Voice pitch and body size are linked in real life too." — sound waves
    drawFigure(g, { x: E.W * 0.55, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.explain]]), t), expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.28, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.GALILEO.outfit, pose: breathe(POSES.stand, t), expr: 'thinking', talk: 0, blink: (t % 3.5) < 0.12, rim });
    // sound waves rippling from Noah
    for (let i = 0; i < 3; i++) {
      const r = 60 + ((t * 120 + i * 80) % 240);
      g.strokeStyle = 'rgba(159,216,255,' + (0.6 * (1 - r / 300)).toFixed(2) + ')'; g.lineWidth = 4;
      g.beginPath(); g.arc(E.W * 0.55, GY - 200, r, -0.6, 0.6); g.stroke();
    }
  });
} });
