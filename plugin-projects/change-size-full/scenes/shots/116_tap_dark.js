import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s116', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = gymquake(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You tap. Two taps. Pause. One tap." — tiny Noah taps the beam
    const tap = (t > 0.3 && t < 0.5) || (t > 0.7 && t < 0.9) || (t > 1.5 && t < 1.7);
    drawFigure(g, { x: E.W * 0.52, y: GY + 6, s: 0.3, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(tap ? POSES.point : POSES.stand, t), expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  g.save(); g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); g.restore();
  const a = clamp(prog(t, 0.2, 0.5));
  text(g, 'TAP  TAP  ·  TAP', E.W / 2, E.H * 0.18, { size: V(56, 60), color: '#ffd76a', glow: 20, glowColor: 'rgba(255,215,106,0.5)', spacing: 6, alpha: a });
} });
