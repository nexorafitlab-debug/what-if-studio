import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetMorning } from '../sets/street_morning.js';
import { goldWord } from '../_helpers.js';
import { sparkle } from '/engine/fx2d.js';
registerShot('s027', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  // "The grey word turned gold and floated up, like light." — at 0.85 s the
  // grey word turns GOLD and rises; after it fades, a golden glow keeps
  // rising where it was. Eli is amazed.
  const girlFig = { x: E.W * 0.58, y: 0, s: V(1.45, 1.55), facing: 1, outfit: CAST.GIRL.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = streetMorning(g, t, info, {});
    girlFig.y = GY;
    girlFig.pose = breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.stand]]), t);
    drawFigure(g, { ...girlFig, expr: exprAt(t, [[0, 'smile'], [1.0, 'happy']]), talk: 0, blink: (t % 3.7) < 0.12, look: [0.4, -0.4] });
    drawFigure(g, { x: E.W * 0.72, y: GY, s: V(1.45, 1.55), facing: -1, outfit: CAST.FRIEND.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.2, POSES.cheer]]), t), expr: exprAt(t, [[0, 'smile'], [1.2, 'happy']]), talk: 0, blink: (t % 3.7) < 0.12, look: [-0.4, -0.2] });
    drawFigure(g, { x: E.W * 0.24, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [2.0, POSES.cheer]]), t), expr: exprAt(t, [[0, 'awe'], [2.0, 'joy']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.5, -0.5], rim });
  });
  // TEXT LAST, on top: grey -> GOLD at 0.85 s, rises ~90 px, fades by ~1.85 s
  goldWord(g, girlFig, "I'M SORRY.", t, { at: 0.85, greyAt: 0 });
  // after the gold word fades, a golden glow keeps rising where it was
  if (t > 1.85) {
    const [hx, hy] = headPos(girlFig);
    const k = prog(t, 1.85, 3.8);
    const a = 0.5 * (1 - k);
    glow(g, hx, hy - 120 - 70 * k, 130, '#ffd76a', a);
    sparkle(g, hx - 30, hy - 150 - 80 * k, 16, '#ffd76a', a);
    sparkle(g, hx + 40, hy - 130 - 60 * k, 12, '#fff3d0', a * 0.8);
  }
} });
