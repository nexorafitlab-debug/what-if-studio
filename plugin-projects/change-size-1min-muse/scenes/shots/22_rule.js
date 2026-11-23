import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
import { goldLine, freezeLabel } from '../_helpers.js';
registerShot('s022', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { voidSet(g, t, info, {}); });
  freezeLabel(g, t, { dur: info.dur, y: E.H * 0.16 });
  const a1 = clamp(prog(t, 0.3, 0.7)), a2 = clamp(prog(t, 1.2, 1.6)), a3 = clamp(prog(t, 2.0, 2.4));
  text(g, 'BUT THERE IS A RULE', E.W / 2, E.H * 0.34, { size: V(64, 70), color: '#9fd8ff', glow: 22, glowColor: 'rgba(159,216,255,0.5)', spacing: 4, alpha: a1 });
  text(g, 'YOUR BODY', E.W / 2, E.H * 0.52, { size: V(110, 120), color: '#ffd76a', glow: 34, glowColor: 'rgba(255,215,106,0.55)', spacing: 4, alpha: a2 });
  text(g, 'STAYS YOURS.', E.W / 2, E.H * 0.66, { size: V(110, 120), color: '#ffd76a', glow: 34, glowColor: 'rgba(255,215,106,0.55)', spacing: 4, alpha: a3 });
  layer(g, { z: 1 }, 1, (g) => {
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.5, y: E.H * 0.92, s: V(1.1, 1.2), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.think, t), expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
