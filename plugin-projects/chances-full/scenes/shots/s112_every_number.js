// s112 — "Everyone has a number. And every number is falling." Street: passers with pills 8, 6, 5; Kian walks between them.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { streetMorning } from '../sets/street_morning.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s159', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    for (const [cx, cast, val] of [[0.18, CAST.PASSER1, '8'], [0.76, CAST.PASSER2, '5'], [0.88, CAST.TEACHER, '6']]) {
      const p = { x: E.W * cx, y: GY, s: V(1.15, 1.25), facing: cx < 0.5 ? 1 : -1, outfit: cast.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
      drawFigure(g, p);
      const [hx, hy, hr] = headPos(p);
      chancePill(g, hx, hy, hr, val, t);
    }
    const lx = E.W * 0.3 + t * 110;
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose(t * Math.PI * 2 * 0.8), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
