import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
registerShot('s172', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
  });
  // Bronnie Ware top-five regrets — numbered list infographic; #3 (courage to express feelings) is gold: the theme
  rr(g, E.W * 0.10, E.H * 0.16, E.W * 0.80, E.H * 0.68, 18); g.fillStyle = 'rgba(8,12,24,0.92)'; g.fill(); g.strokeStyle = 'rgba(255,215,106,0.7)'; g.lineWidth = 3; g.stroke();
  text(g, 'THE TOP FIVE REGRETS OF THE DYING', E.W / 2, E.H * 0.235, { size: 34, color: '#ffd76a', font: FONTS.ui, weight: 900, spacing: 2, glow: 12, glowColor: 'rgba(255,215,106,0.4)' });
  { const _a = clamp(prog(t, 0.00, 0.30)); if (_a > 0) { g.save(); g.globalAlpha *= _a;
    circle(g, E.W * 0.185, E.H * 0.325, 26, '#3a3a48');
    text(g, "1", E.W * 0.185, E.H * 0.325, { size: 30, color: '#ffffff', font: FONTS.ui, weight: 900 });
    text(g, "I WISH I'D LIVED A LIFE", E.W * 0.235, E.H * 0.308, { size: 30, color: '#ffffff', font: FONTS.ui, weight: 800, align: 'left' });
    text(g, "TRUE TO MYSELF.", E.W * 0.235, E.H * 0.342, { size: 30, color: '#cfe2ff', font: FONTS.ui, weight: 800, align: 'left' });
    g.restore(); } }
  { const _a = clamp(prog(t, 0.25, 0.55)); if (_a > 0) { g.save(); g.globalAlpha *= _a;
    circle(g, E.W * 0.185, E.H * 0.430, 26, '#3a3a48');
    text(g, "2", E.W * 0.185, E.H * 0.430, { size: 30, color: '#ffffff', font: FONTS.ui, weight: 900 });
    text(g, "I WISH I HADN'T WORKED", E.W * 0.235, E.H * 0.413, { size: 30, color: '#ffffff', font: FONTS.ui, weight: 800, align: 'left' });
    text(g, "SO HARD.", E.W * 0.235, E.H * 0.447, { size: 30, color: '#cfe2ff', font: FONTS.ui, weight: 800, align: 'left' });
    g.restore(); } }
  text(g, 'NUMBER THREE:', E.W / 2, E.H * 0.55, { size: 40, color: '#ffd76a', font: FONTS.ui, weight: 900, spacing: 2, glow: 14, glowColor: 'rgba(255,215,106,0.5)' });
} });
