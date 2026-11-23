import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
registerShot('s180', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.86, y: 0, s: 1.2, facing: -1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "thinking"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12, rim });
  });
  // 6,000 thoughts a day: 100 dots, each dot = 60 thoughts
  text(g, '6,000', E.W * 0.40, E.H * 0.26, { size: 110, color: '#ffd76a', font: FONTS.ui, weight: 900, glow: 22, glowColor: 'rgba(255,215,106,0.55)' });
  text(g, 'THOUGHTS A DAY', E.W * 0.40, E.H * 0.40, { size: 36, color: '#cfe2ff', font: FONTS.ui, weight: 800, spacing: 3 });
  const _gold = [3, 14, 27, 38, 52, 66, 81];
  for (let _i = 0; _i < 100; _i++) { const _r = Math.floor(_i / 10), _c = _i % 10; const _g = _gold.includes(_i); const _a = _g ? clamp(prog(t, 0.3 + _gold.indexOf(_i) * 0.12, 0.5 + _gold.indexOf(_i) * 0.12)) : 0.9; circle(g, E.W * 0.40 - 207 + _c * 46, E.H * 0.52 + _r * 46, _g ? 16 : 13, _g ? alpha('#ffd76a', _a) : alpha('#8a8f9e', 0.35)); if (_g && _a > 0) glow(g, E.W * 0.40 - 207 + _c * 46, E.H * 0.52 + _r * 46, 30, '#ffd76a', 0.5 * _a); }
  text(g, 'ONLY A FEW ARE EVER SAID OUT LOUD', E.W * 0.40, E.H * 0.94 - 40, { size: 30, color: '#ffd76a', font: FONTS.ui, weight: 800, spacing: 2 });
} });
