import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { bedroomEli } from '../sets/bedroom_eli.js';
registerShot('s069', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.45, y: 0, s: 1.55, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.sit], [0.9, POSES.sad]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = bedroomEli(g, t, info, {});
    f0.y = GY + 20;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "thinking"], [0.9, "sad"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12, rim });
    rr(g, f0.x - 95, f0.y - 78, 190, 78, 6); g.fillStyle = '#6a4a2a'; g.fill(); g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 3; g.stroke();
    rr(g, f0.x - 60, f0.y - 96, 120, 18, 4); g.fillStyle = '#f2ead8'; g.fill();
  });
  text(g, "I'M SORRY.", E.W / 2, E.H * 0.28, { size: 40, color: '#b8b8c0', font: FONTS.ui, weight: 900, spacing: 2, glow: 14, glowColor: 'rgba(184,184,192,0.4)', alpha: 1 - prog(t, 0.97, 2.75) });
  text(g, "THANK YOU.", E.W / 2, E.H * 0.42, { size: 40, color: '#b8b8c0', font: FONTS.ui, weight: 900, spacing: 2, glow: 14, glowColor: 'rgba(184,184,192,0.4)', alpha: 1 - prog(t, 0.97, 2.75) });
  text(g, "I LOVE YOU.", E.W / 2, E.H * 0.56, { size: 40, color: '#b8b8c0', font: FONTS.ui, weight: 900, spacing: 2, glow: 14, glowColor: 'rgba(184,184,192,0.4)', alpha: 1 - prog(t, 0.97, 2.75) });
} });
