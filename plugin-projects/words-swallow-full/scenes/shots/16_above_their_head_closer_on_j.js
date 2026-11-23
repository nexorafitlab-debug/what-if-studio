import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolClassroom } from '../sets/school_classroom.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s016', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.34, y: 0, s: 1.35, facing: 1, outfit: CAST.JUNE.outfit, pose: breathe(posesAt(t, [[0, POSES.sit]]), t) };
  const f1 = { x: E.W * 0.66, y: 0, s: 1.35, facing: -1, outfit: CAST.THEO.outfit, pose: breathe(posesAt(t, [[0, POSES.sit]]), t) };
  const f2 = { x: E.W * 0.90, y: 0, s: 1.2, facing: -1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolClassroom(g, t, info, {});
    f0.y = GY + 20;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "neutral"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12 });
    rr(g, f0.x - 95, f0.y - 78, 190, 78, 6); g.fillStyle = '#6a4a2a'; g.fill(); g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 3; g.stroke();
    rr(g, f0.x - 60, f0.y - 96, 120, 18, 4); g.fillStyle = '#f2ead8'; g.fill();
    f1.y = GY + 20;
    drawFigure(g, { ...f1, expr: exprAt(t, [[0, "sad"]]), talk: 0, blink: (t + f1.x * 0.01) % 3.7 < 0.12 });
    rr(g, f1.x - 95, f1.y - 78, 190, 78, 6); g.fillStyle = '#6a4a2a'; g.fill(); g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 3; g.stroke();
    rr(g, f1.x - 60, f1.y - 96, 120, 18, 4); g.fillStyle = '#f2ead8'; g.fill();
    f2.y = GY;
    drawFigure(g, { ...f2, expr: exprAt(t, [[0, "thinking"]]), talk: 0, blink: (t + f2.x * 0.01) % 3.7 < 0.12, rim });
  });
  swallowedWord(g, f0, "I LIKE YOU.", t, { at: 0.1, dur: 1.02 });
  swallowedWord(g, f1, "I MISS MY MOM.", t, { at: 0.35, dur: 1.02 });
} });
