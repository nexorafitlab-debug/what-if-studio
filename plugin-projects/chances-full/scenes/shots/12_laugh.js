// s012 — "You laugh." Kian laughs and walks away, Jay left behind with his 5.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { schoolyard } from '../sets/schoolyard.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s013', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = schoolyard(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Jay, left behind, watching Kian go
    const jay = { x: E.W * 0.8, y: GY, s: V(1.25, 1.35), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, '5', t);
    // Kian walks away to the left, laughing
    const lx = E.W * 0.55 - t * 150;
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.KIAN.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'joy', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
