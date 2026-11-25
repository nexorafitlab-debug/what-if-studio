import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolClassroom } from '../sets/school_classroom.js';
registerShot('s025', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolClassroom(g, t, info, {});
    // "You cannot see anyone else's. Only yours." — classmates have NO feathers
    drawFigure(g, { x: E.W * 0.22, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.KAI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.4, POSES.point]]), t), expr: exprAt(t, [[0, 'thinking'], [1.4, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.5, -0.1], rim });
    drawFigure(g, { x: E.W * 0.60, y: GY, s: V(1.45, 1.55), facing: -1, outfit: CAST.STU1.outfit, pose: breathe(POSES.stand, t), expr: 'neutral', talk: 0, blink: (t % 3.7) < 0.12, look: [-0.4, 0] });
    drawFigure(g, { x: E.W * 0.78, y: GY, s: V(1.45, 1.55), facing: -1, outfit: CAST.STU3.outfit, pose: breathe(POSES.stand, t), expr: 'smile', talk: 0, blink: (t % 3.7) < 0.12, look: [-0.4, 0] });
  });
  text(g, 'ONLY YOURS.', E.W / 2, E.H * 0.16, { size: V(46, 50), color: '#ffd76a', font: FONTS.ui, weight: 900, spacing: 4, glow: 18, glowColor: 'rgba(255,215,106,0.55)', alpha: clamp(prog(t, 1.4, 1.7)) });
} });
