import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { bedroomEli } from '../sets/bedroom_eli.js';
registerShot('s070', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.70, y: 0, s: 1.35, facing: -1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.sit]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = bedroomEli(g, t, info, {});
    f0.y = GY + 20;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "sad"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12, rim });
    rr(g, f0.x - 95, f0.y - 78, 190, 78, 6); g.fillStyle = '#6a4a2a'; g.fill(); g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 3; g.stroke();
    rr(g, f0.x - 60, f0.y - 96, 120, 18, 4); g.fillStyle = '#f2ead8'; g.fill();
  });
  text(g, "DAY 43", E.W / 2, E.H * 0.3, { size: 40, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 2, glow: 10, glowColor: 'rgba(255,255,255,0.35)' });
} });
