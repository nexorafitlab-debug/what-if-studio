import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolClassroom, seatedRow } from '../sets/school_classroom.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s015', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  // "Every unsaid sentence floats above their head." — WIDE classroom,
  // four students at desks, grey words above two of them
  const wordFigs = [
    { x: E.W * 0.42, y: 0, s: 1.05, facing: 1, outfit: CAST.STU3.outfit, pose: POSES.sit, words: 'I HATE MATHS.' },
    { x: E.W * 0.80, y: 0, s: 1.05, facing: -1, outfit: CAST.STU6.outfit, pose: POSES.sit, words: "I'M HUNGRY." },
  ];
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolClassroom(g, t, info, {});
    drawFigure(g, { x: E.W * 0.12, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(POSES.stand, t), expr: 'awe', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.5, -0.2], rim });
    seatedRow(g, t, info, GY + 20, [
      { x: E.W * 0.30, cast: CAST.STU1, expr: 'neutral', look: [0, 0.3] },
      { x: E.W * 0.42, cast: CAST.STU3, expr: 'worried', look: [0, 0.3] },
      { x: E.W * 0.62, cast: CAST.JUNE, expr: 'neutral', look: [0, 0.3] },
      { x: E.W * 0.80, cast: CAST.STU6, expr: 'neutral', look: [0, 0.3] },
    ], null);
    for (const f of wordFigs) f.y = GY + 20;
  });
  // TEXT LAST, on top
  for (const [i, f] of wordFigs.entries()) swallowedWord(g, f, f.words, t, { at: 0.4 + i * 0.4, fadeAt: 1e9 });
} });
