// s101 P2 — "Eight. Six. Five. Three." Four pills flash past Kian as he walks and counts.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { streetNight } from '../sets/street_night.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s138', { draw(g, t, info) {
  const cam = { z: 0.95, x: 0, y: 20 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetNight(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Kian FIRST: when he crosses a passer, the passer (and their pill) draws
    // OVER him, so no pill ever reads as above the hero's head.
    const lx = E.W * 0.1 + (t + 2.26) * 160;
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose((t + 2.26) * Math.PI * 2 * 0.9), expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    const spots = [[0.52, CAST.PASSER2, '5'], [0.68, CAST.PASSER1, '8'], [0.84, CAST.PASSER2, '6'], [0.96, CAST.PASSER1, '3']];
    for (const [cx, cast, val] of spots) {
      const p = { x: E.W * cx, y: GY, s: V(1.15, 1.25), facing: -1, outfit: cast.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
      drawFigure(g, p);
      const [hx, hy, hr] = headPos(p);
      chancePill(g, hx, hy, hr, val, t);
    }
  });
} });
