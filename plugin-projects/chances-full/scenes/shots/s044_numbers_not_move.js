// s044 — "The numbers do not move. Not one." Street: two passers-by, pills 7 and 8, both still.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { streetMorning } from '../sets/street_morning.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s048', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    for (const [cx, cast, val] of [[0.24, CAST.PASSER1, '8'], [0.74, CAST.PASSER2, '7']]) {
      const p = { x: E.W * cx, y: GY, s: V(1.2, 1.3), facing: cx < 0.5 ? 1 : -1, outfit: cast.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
      drawFigure(g, p);
      const [hx, hy, hr] = headPos(p);
      chancePill(g, hx, hy, hr, val, t);
    }
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.think]]), t);
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
