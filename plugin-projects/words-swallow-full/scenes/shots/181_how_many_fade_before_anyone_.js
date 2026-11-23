import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
registerShot('s181', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.50, y: 0, s: 1.3, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "sad"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12, rim });
  });
  // 6,000 thoughts a day: 100 dots, each dot = 60 thoughts
  text(g, '6,000', E.W * 0.40, E.H * 0.26, { size: 110, color: '#ffd76a', font: FONTS.ui, weight: 900, glow: 22, glowColor: 'rgba(255,215,106,0.55)' });
  for (let _i = 0; _i < 100; _i++) { const _r = Math.floor(_i / 10), _c = _i % 10; const _a = 1 - clamp(prog(t, 0.2 + _i * 0.012, 0.6 + _i * 0.012)); if (_a <= 0.02) continue; circle(g, E.W * 0.40 - 207 + _c * 46, E.H * 0.52 + _r * 46, 13, alpha('#b8b8c0', 0.85 * _a)); }
  text(g, 'MOST FADE BEFORE ANYONE HEARS THEM', E.W * 0.40, E.H * 0.42, { size: 30, color: '#b8b8c0', font: FONTS.ui, weight: 800, spacing: 2 });
} });
