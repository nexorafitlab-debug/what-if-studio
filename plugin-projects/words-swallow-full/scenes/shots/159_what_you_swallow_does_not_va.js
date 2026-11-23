import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { scienceLab } from '../sets/science_lab.js';
import { goldLine } from '../_helpers.js';
registerShot('s159', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.20, y: 0, s: 1.4, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = scienceLab(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "sad"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12, rim });
  });
  text(g, "WHAT YOU SWALLOW", E.W / 2, E.H * 0.22, { size: 48, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 2, glow: 10, glowColor: 'rgba(255,255,255,0.35)' });
  text(g, "DOES NOT VANISH.", E.W / 2, E.H * 0.34, { size: 48, color: '#ffd76a', font: FONTS.ui, weight: 900, spacing: 2, glow: 26, glowColor: 'rgba(255,215,106,0.55)' });
  // Wegner white bear: white bear icon; trying not to think makes it come back stronger
  const _bx = E.W * 0.78, _by = E.H * 0.56;
  glow(g, _bx, _by - 40, 190, '#ffffff', 0.25);
  circle(g, _bx, _by + 30, 92, '#f2f2f2'); circle(g, _bx, _by - 78, 62, '#f2f2f2');
  circle(g, _bx - 48, _by - 122, 22, '#f2f2f2'); circle(g, _bx + 48, _by - 122, 22, '#f2f2f2');
  circle(g, _bx - 48, _by - 122, 10, '#d8d8d8'); circle(g, _bx + 48, _by - 122, 10, '#d8d8d8');
  circle(g, _bx, _by - 62, 26, '#ffffff'); circle(g, _bx, _by - 72, 9, '#1a1622');
  circle(g, _bx - 24, _by - 88, 6, '#1a1622'); circle(g, _bx + 24, _by - 88, 6, '#1a1622');
  text(g, 'Z', _bx + 110, _by - 150 + Math.sin(t * 1.5) * 6, { size: 34, color: '#9fb4d8', font: FONTS.ui, weight: 900 });
  text(g, 'Z', _bx + 140, _by - 190 + Math.sin(t * 1.5 + 1) * 6, { size: 26, color: '#9fb4d8', font: FONTS.ui, weight: 900 });
} });
