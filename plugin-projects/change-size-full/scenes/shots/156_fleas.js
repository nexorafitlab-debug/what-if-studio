import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { nature } from '../sets/nature.js';
registerShot('s156', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = nature(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "Fleas jump two hundred times their own height." — a flea BOINGS sky-high
    const jump = Math.abs(Math.sin(t * 3)) * 320;
    circle(g, E.W * 0.40, GY - 40 - jump, 10, '#2a1a12');
    circle(g, E.W * 0.40 + 6, GY - 46 - jump, 6, '#2a1a12');
    // arc trail
    g.strokeStyle = 'rgba(255,215,106,0.5)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(E.W * 0.40, GY - 40); g.quadraticCurveTo(E.W * 0.40 + 40, GY - 200, E.W * 0.40, GY - 40 - jump); g.stroke();
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.crouch], [0.6, POSES.pointUp]]), t), expr: 'awe', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, '200x', E.W / 2, E.H * 0.16, { size: V(96, 104), color: '#7ac74a', glow: 28, glowColor: 'rgba(122,199,74,0.5)', spacing: 2, alpha: a });
} });
