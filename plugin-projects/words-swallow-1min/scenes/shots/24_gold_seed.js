import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetMorning } from '../sets/street_morning.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s024', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  // "Once, just once, you saw a word turn gold." — by the school gate, a
  // girl walks with her friend; grey "I'M SORRY." hangs above the girl.
  // Eli walks behind them, watching.
  const girlFig = { x: 0, y: 0, s: V(1.45, 1.55), facing: 1, outfit: CAST.GIRL.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = streetMorning(g, t, info, {});
    const gg = walkLocked(t, { x0: E.W * 0.48, stride: 46, stepDur: 0.55, facing: 1 });
    const ff = walkLocked(t, { x0: E.W * 0.63, stride: 46, stepDur: 0.55, facing: 1 });
    const ee = walkLocked(t, { x0: E.W * 0.08, stride: 52, stepDur: 0.55, facing: 1 });
    girlFig.x = gg.x; girlFig.y = GY; girlFig.pose = gg.pose;
    drawFigure(g, { ...girlFig, expr: 'worried', talk: 0, blink: (t % 3.7) < 0.12, look: [0.3, 0.2] });
    drawFigure(g, { x: ff.x, y: GY, s: V(1.45, 1.55), facing: 1, outfit: CAST.FRIEND.outfit, pose: ff.pose, expr: 'neutral', talk: 0, blink: (t % 3.7) < 0.12 });
    drawFigure(g, { x: ee.x, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.ELI.outfit, pose: ee.pose, expr: 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.5, -0.2], rim });
  });
  // TEXT LAST, on top: grey "I'M SORRY." hangs above the girl
  swallowedWord(g, girlFig, "I'M SORRY.", t, { at: 0.3, fadeAt: 1e9 });
} });
