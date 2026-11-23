import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolClassroom } from '../sets/school_classroom.js';
import { swallowedWord } from '../_helpers.js';
import { rr } from '/engine/core.js';
registerShot('s014', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  // "And you can see the words people swallow." — Eli at the front, grey
  // words hanging above three seated students
  const figs = [
    { x: E.W * 0.38, y: 0, s: 1.05, facing: 1, outfit: CAST.JUNE.outfit, pose: POSES.sit, words: 'I LIKE YOU.' },
    { x: E.W * 0.60, y: 0, s: 1.05, facing: 1, outfit: CAST.STU1.outfit, pose: POSES.sit, words: "I'M SO TIRED." },
    { x: E.W * 0.82, y: 0, s: 1.05, facing: -1, outfit: CAST.STU4.outfit, pose: POSES.sit, words: "I'M SCARED." },
  ];
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolClassroom(g, t, info, {});
    drawFigure(g, { x: E.W * 0.13, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.point]]), t), expr: exprAt(t, [[0, 'neutral'], [1.0, 'awe']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.4, -0.3], rim });
    for (const f of figs) {
      f.y = GY + 20;
      f.pose = breathe(POSES.sit, t, 1, f.x);
      drawFigure(g, { ...f, expr: f.words === 'I LIKE YOU.' ? 'neutral' : 'worried', talk: 0, blink: (t + f.x * 0.01) % 3.7 < 0.12, look: [0, 0.3] });
      // desk front over the seated legs
      rr(g, f.x - 95, f.y - 78, 190, 78, 6); g.fillStyle = '#6a4a2a'; g.fill();
      g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 3; g.stroke();
    }
  });
  // TEXT LAST, on top: grey words above each student's head, staggered in
  for (const [i, f] of figs.entries()) swallowedWord(g, f, f.words, t, { at: 0.3 + i * 0.25, fadeAt: 1e9 });
} });
