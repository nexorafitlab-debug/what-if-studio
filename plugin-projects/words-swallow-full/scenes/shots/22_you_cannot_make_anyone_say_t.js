import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolClassroom } from '../sets/school_classroom.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s022', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.30, y: 0, s: 1.55, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.7, POSES.reach]]), t) };
  const f1 = { x: E.W * 0.68, y: 0, s: 1.35, facing: -1, outfit: CAST.JUNE.outfit, pose: breathe(posesAt(t, [[0, POSES.sit]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolClassroom(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "determined"]]), talk: talkAmount(info.globalT, 42.58, 44.08), blink: (t + f0.x * 0.01) % 3.7 < 0.12, rim });
    f1.y = GY + 20;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "neutral"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12 });
    rr(g, f1.x - 95, f1.y - 78, 190, 78, 6); g.fillStyle = '#6a4a2a'; g.fill(); g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 3; g.stroke();
    rr(g, f1.x - 60, f1.y - 96, 120, 18, 4); g.fillStyle = '#f2ead8'; g.fill();
  });
  swallowedWord(g, f1, "I LIKE YOU.", t, { at: 0.2, dur: 2.17 });
} });
