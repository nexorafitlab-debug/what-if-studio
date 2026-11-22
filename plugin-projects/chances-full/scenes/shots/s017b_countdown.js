// s017 P2 — "Two. One." The countdown finishes; Jay's pill hits 1, red pulse.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s019', { draw(g, t, info) {
  const cam = { z: 1.4, x: 40, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Kian at the edge, small, watching it happen
    drawFigure(g, { x: E.W * 0.24, y: GY, s: V(1.15, 1.25), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t, 1, 4), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // Jay, centre — the countdown is the whole shot
    const jay = { x: E.W * 0.58, y: GY, s: V(1.6, 1.7), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.stand, t), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '2'], [1.03, '1']]), t, { size: V(52, 60) });
  });
} });
