import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetMorning } from '../sets/street_morning.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s025', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  // The girl STOPS and turns to her friend — the grey word still hangs.
  // Eli stops too, watching from behind.
  const girlFig = { x: 0, y: 0, s: V(1.45, 1.55), facing: 1, outfit: CAST.GIRL.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = streetMorning(g, t, info, {});
    const k = prog(t, 0, 0.7);
    const gx = lerp(E.W * 0.55, E.W * 0.58, k);
    const fx = lerp(E.W * 0.70, E.W * 0.72, k);
    const ex = lerp(E.W * 0.22, E.W * 0.24, k);
    girlFig.x = gx; girlFig.y = GY;
    girlFig.pose = t < 0.7 ? walkPose(t * 6) : breathe(posesAt(t, [[0.7, POSES.stand], [1.4, POSES.talk]]), t);
    drawFigure(g, { ...girlFig, expr: exprAt(t, [[0, 'worried'], [1.4, 'nervous']]), talk: 0, blink: (t % 3.7) < 0.12, look: [0.4, 0] });
    drawFigure(g, { x: fx, y: GY, s: V(1.45, 1.55), facing: t < 0.8 ? 1 : -1, outfit: CAST.FRIEND.outfit, pose: t < 0.7 ? walkPose(t * 6 + 1) : breathe(POSES.stand, t), expr: exprAt(t, [[0, 'neutral'], [0.8, 'confused']]), talk: 0, blink: (t % 3.7) < 0.12, look: [-0.4, 0] });
    drawFigure(g, { x: ex, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.ELI.outfit, pose: t < 0.7 ? walkPose(t * 6 + 2) : breathe(POSES.stand, t), expr: 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.5, -0.2], rim });
  });
  // TEXT LAST, on top: grey word still hangs above the girl
  swallowedWord(g, girlFig, "I'M SORRY.", t, { at: 0, fadeAt: 1e9 });
} });
