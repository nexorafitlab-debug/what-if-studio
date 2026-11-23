import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolClassroom } from '../sets/school_classroom.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s020', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  // "You cannot make anyone say them." — Eli reaches for June's grey word;
  // his hand passes straight through it. June keeps drawing, oblivious.
  const juneFig = { x: E.W * 0.64, y: 0, s: 1.6, facing: 1, outfit: CAST.JUNE.outfit, pose: POSES.sit };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolClassroom(g, t, info, {});
    juneFig.y = GY + 10; juneFig.pose = breathe(POSES.sit, t, 1, juneFig.x);
    drawFigure(g, { ...juneFig, expr: 'neutral', talk: 0, blink: (t % 3.7) < 0.12, look: [0, 0.4], prop: { type: 'paper' } });
    drawFigure(g, { x: E.W * 0.28, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.5, POSES.reach], [1.6, POSES.sad]]), t), expr: exprAt(t, [[0, 'determined'], [0.5, 'surprised'], [1.6, 'sad']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.5, -0.4], rim });
  });
  // TEXT LAST, on top: the word shimmers where his hand passes through
  swallowedWord(g, juneFig, 'I LIKE YOU.', t, { at: 0, fadeAt: 1e9, dy: -8 * Math.sin(t * 3) });
} });
