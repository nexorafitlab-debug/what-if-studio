import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { scienceLab } from '../sets/science_lab.js';
registerShot('s157', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.18, y: 0, s: 1.35, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = scienceLab(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "awe"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12, look: [0.5, -0.3], rim });
  });
  text(g, "TRY NOT TO THINK OF IT...", E.W / 2, E.H * 0.18, { size: 40, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 2, glow: 10, glowColor: 'rgba(255,255,255,0.35)' });
  // Wegner white bear: white bear icon; trying not to think makes it come back stronger
  const _bx = E.W * 0.78, _by = E.H * 0.56;
  g.save(); g.globalAlpha = 0.35; circle(g, _bx - 150, _by - 30, 62, '#f2f2f2'); circle(g, _bx - 150, _by - 80, 42, '#f2f2f2'); g.restore();
  glow(g, _bx, _by - 40, 190, '#ffffff', 0.25);
  circle(g, _bx, _by + 30, 92, '#f2f2f2'); circle(g, _bx, _by - 78, 62, '#f2f2f2');
  circle(g, _bx - 48, _by - 122, 22, '#f2f2f2'); circle(g, _bx + 48, _by - 122, 22, '#f2f2f2');
  circle(g, _bx - 48, _by - 122, 10, '#d8d8d8'); circle(g, _bx + 48, _by - 122, 10, '#d8d8d8');
  circle(g, _bx, _by - 62, 26, '#ffffff'); circle(g, _bx, _by - 72, 9, '#1a1622');
  circle(g, _bx - 24, _by - 88, 6, '#1a1622'); circle(g, _bx + 24, _by - 88, 6, '#1a1622');
  g.save(); g.strokeStyle = '#ffd76a'; g.lineWidth = 5; g.beginPath(); g.arc(_bx, _by - 40, 190, -2.4, 0.6); g.stroke(); seg(g, [[_bx + 178, _by - 140], [_bx + 150, _by - 96]], 5, '#ffd76a'); seg(g, [[_bx + 178, _by - 140], [_bx + 196, _by - 100]], 5, '#ffd76a'); g.restore();
  text(g, 'IT COMES BACK STRONGER', E.W / 2, E.H * 0.86, { size: 36, color: '#ffd76a', font: FONTS.ui, weight: 900, spacing: 2 });
} });
