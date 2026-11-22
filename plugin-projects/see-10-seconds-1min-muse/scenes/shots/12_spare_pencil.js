// s012 — "Spare appears in your grip. Teacher never notices." Kian writes on; teacher at the board.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { examhall } from '../sets/examhall.js';
import { CAST } from '../cast.js';
import { drawPencil, handPos } from '../_helpers.js';
registerShot('s012', { draw(g, t, info) {
  const cam = { z: 1.15, x: 40, y: 120 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = examhall(g, t, info, {});
    const s = V(1.35, 1.45), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // teacher writing on the blackboard, facing away
    const tp = breathe(POSES.pointUp, t, 1, 7);
    drawFigure(g, { x: E.W * 0.74, y: GY, s: V(1.2, 1.3), facing: -1, outfit: CAST.TEACHER.outfit, pose: tp, expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } });
    const kian = { x: E.W * 0.5, y: GY + 10, s, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sit, t), expr: 'smirk', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim };
    drawFigure(g, kian);
    // spare pencil pops into his grip, then writes (tiny writing wobble)
    const pop = ease.out(clamp(prog(t, 0.25, 0.45)));
    if (pop > 0) {
      const [hx, hy] = handPos(kian);
      drawPencil(g, hx + 16, hy + 4, -0.15 + Math.sin(t * 6) * 0.04 * pop, pop);
    }
  });
} });
