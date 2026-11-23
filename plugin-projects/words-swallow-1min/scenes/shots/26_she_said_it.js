import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetMorning } from '../sets/street_morning.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s026', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  // "A girl told her friend she was sorry." — the girl SPEAKS; her friend's
  // face changes; the grey word hangs, waiting for the turn
  const girlFig = { x: E.W * 0.58, y: 0, s: V(1.45, 1.55), facing: 1, outfit: CAST.GIRL.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = streetMorning(g, t, info, {});
    girlFig.y = GY;
    girlFig.pose = breathe(posesAt(t, [[0, POSES.talk], [1.2, POSES.stand]]), t);
    drawFigure(g, { ...girlFig, expr: exprAt(t, [[0, 'nervous'], [1.2, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.4, 0] });
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.45, 1.55), facing: -1, outfit: CAST.FRIEND.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.9, POSES.stand]]), t), expr: exprAt(t, [[0, 'confused'], [0.9, 'surprised'], [1.4, 'smile']]), talk: 0, blink: (t % 3.7) < 0.12, look: [-0.4, 0] });
    drawFigure(g, { x: E.W * 0.24, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(POSES.stand, t), expr: 'awe', talk: 0, blink: (t % 3.7) < 0.12, look: [0.5, -0.2], rim });
  });
  // TEXT LAST, on top: grey word still hanging
  swallowedWord(g, girlFig, "I'M SORRY.", t, { at: 0, fadeAt: 1e9 });
} });
