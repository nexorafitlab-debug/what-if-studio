// s078 P2 — "The team laughs." The whole gym laughs; Kian laughs loudest, not knowing.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s098', { draw(g, t, info) {
  const cam = { z: 1.2, x: -40, y: 0 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const t1 = { x: E.W * 0.68, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.TEAM1.outfit, pose: breathe(POSES.cheer, t, 1, 2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, t1);
    const [h1x, h1y, h1r] = headPos(t1);
    chancePill(g, h1x, h1y, h1r, '6', t);
    const t2 = { x: E.W * 0.86, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.TEAM2.outfit, pose: breathe(POSES.cheer, t, 1, 2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, t2);
    const [h2x, h2y, h2r] = headPos(t2);
    chancePill(g, h2x, h2y, h2r, '7', t);
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.cheer, t), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
