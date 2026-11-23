import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolClassroom } from '../sets/school_classroom.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s018', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  // "It hangs for a few seconds. Then it fades." — Theo's word goes first,
  // June's follows; Eli watches both disappear
  const juneFig = { x: E.W * 0.62, y: 0, s: 1.9, facing: 1, outfit: CAST.JUNE.outfit, pose: POSES.sit };
  const theoFig = { x: E.W * 0.24, y: 0, s: 1.5, facing: 1, outfit: CAST.THEO.outfit, pose: POSES.sit };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolClassroom(g, t, info, {});
    juneFig.y = GY + 10; juneFig.pose = breathe(POSES.sit, t, 1, juneFig.x);
    theoFig.y = GY + 10; theoFig.pose = breathe(POSES.sit, t, 1, theoFig.x);
    drawFigure(g, { ...theoFig, expr: 'sad', talk: 0, blink: (t % 3.7) < 0.12, look: [0, 0.4] });
    drawFigure(g, { ...juneFig, expr: 'neutral', talk: 0, blink: (t % 3.7) < 0.12, look: [0, 0.4], prop: { type: 'paper' } });
    drawFigure(g, { x: E.W * 0.88, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.ELI.outfit, pose: breathe(POSES.stand, t), expr: exprAt(t, [[0, 'sad'], [1.4, 'thinking']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [-0.5, -0.2], rim });
  });
  // TEXT LAST, on top: Theo fades at 0.5 s, June at 1.3 s
  swallowedWord(g, theoFig, 'I MISS MY MOM.', t, { at: 0, fadeAt: 0.5 });
  swallowedWord(g, juneFig, 'I LIKE YOU.', t, { at: 0, fadeAt: 1.3 });
} });
