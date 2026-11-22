// s101 — "You count them as you pass. Eight. Six. Five. Three." Night street: pills 8, 6, 5, 3 flash past Kian.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { streetNight } from '../sets/street_night.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s137', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetNight(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const spots = [[0.7, CAST.PASSER1, '8'], [0.86, CAST.PASSER2, '6']];
    for (const [cx, cast, val] of spots) {
      const p = { x: E.W * cx, y: GY, s: V(1.15, 1.25), facing: -1, outfit: cast.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
      drawFigure(g, p);
      const [hx, hy, hr] = headPos(p);
      chancePill(g, hx, hy, hr, val, t);
    }
    const lx = E.W * 0.1 + t * 160;
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
