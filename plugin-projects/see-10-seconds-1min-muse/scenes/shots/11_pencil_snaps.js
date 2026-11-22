// s011 — "Pencil snaps. Two. One." Pencil cracks in Kian's hand; countdown ticks.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { examhall } from '../sets/examhall.js';
import { CAST } from '../cast.js';
import { bigCount, drawPencil, handPos } from '../_helpers.js';
registerShot('s011', { draw(g, t, info) {
  const cam = { z: 1.35, x: 40, y: 170 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = examhall(g, t, info, {});
    const s = V(1.35, 1.45), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // teacher at the front, back to the class
    drawFigure(g, { x: E.W * 0.74, y: GY, s: V(1.2, 1.3), facing: -1, outfit: CAST.TEACHER.outfit, pose: breathe(POSES.stand, t, 1, 3), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } });
    const kian = { x: E.W * 0.5, y: GY + 10, s, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sit, t), expr: t > 0.25 && t < 1.2 ? 'surprised' : 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim };
    drawFigure(g, kian);
    // pencil: whole until the snap, then two halves — one in hand, one tumbling
    const [hx, hy] = handPos(kian);
    const snap = prog(t, 0.25, 0.4);
    if (snap < 1) {
      drawPencil(g, hx + 16, hy + 4, -0.15 + Math.sin(t * 2) * 0.02, 1.0);
    } else {
      drawPencil(g, hx + 16, hy + 4, -0.15, 0.62);
      const ft = prog(t, 0.4, 1.2);
      drawPencil(g, hx + 60 + ft * 50, hy + 30 + ease.in(ft) * 130, 0.4 + ft * 2.4, 0.38);
    }
    if (t > 0.25 && t < 0.55) FX.sparkle(g, hx + 30, hy, 22, '#ffffff', clamp(1 - (t - 0.25) / 0.3));
  });
  bigCount(g, t, [[1.33, '2'], [1.79, '1']]);
} });
