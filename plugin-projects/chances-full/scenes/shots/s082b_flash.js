// s082 P2 — "It does not flash. It just disappears." Jay, no pill; Kian reaches for him.
import { E, V, registerShot, layer, prog, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
registerShot('s104', { draw(g, t, info) {
  const cam = { z: 1.4, x: 60, y: 120 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Jay turns away and drifts off as the pill disappears
    const jayX = E.W * 0.58 + prog(t, 1.2, 2.6) * 40;
    const jay = { x: jayX, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(posesAt(t, [[0, POSES.sad], [1.2, POSES.stand]]), t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    // Kian reaches, his hand drops, then he steps toward Jay
    const lx = E.W * 0.34 + prog(t, 1.0, 2.4) * 50;
    const pose = breathe(posesAt(t, [[0, POSES.reach], [0.9, POSES.sad]]), t);
    drawFigure(g, { x: lx, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
