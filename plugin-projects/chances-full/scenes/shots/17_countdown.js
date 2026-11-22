// s017 — "Four. Three. Two. One." Jay's pill ticks down 4-3-2-1, red pulse at 1.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s018', { draw(g, t, info) {
  const cam = { z: 1.25, x: 0, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Kian at the edge, small, watching it happen
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.15, 1.25), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t, 1, 4), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // Jay, centre — the countdown is the whole shot
    const pose = breathe(posesAt(t, [[0, POSES.ready], [1.4, POSES.stand]]), t);
    const jay = { x: E.W * 0.55, y: GY, s: V(1.5, 1.6), facing: -1, outfit: CAST.JAY.outfit, pose, expr: t > 2.15 ? 'sad' : 'determined', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '4'], [0.99, '3'], [1.41, '2'], [2.15, '1']]), t, { size: V(52, 60) });
  });
} });
