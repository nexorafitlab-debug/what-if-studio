// s041 — "You help a stranger with his books." Park: Kian kneels, gathering books for a stranger.
import { E, V, registerShot, layer, talkAmount, rr, circle } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { park } from '../sets/park.js';
import { CAST } from '../cast.js';
import { chancePill, handPos } from '../_helpers.js';
// a dropped book: cover + page edge, tilted
function drawBook(g, x, y, rot, cover, pages) {
  g.save(); g.translate(x, y); g.rotate(rot);
  rr(g, -34, -12, 68, 24, 4); g.fillStyle = cover; g.fill();
  g.fillStyle = pages; g.fillRect(-34, -12, 68, 8);
  g.restore();
}
registerShot('s045', { draw(g, t, info) {
  const cam = { z: 1.1, x: 0, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = park(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // scattered books on the path between Kian and the stranger
    drawBook(g, E.W * 0.48, GY + 46, 0.12, '#c94a3a', '#f2e6c8');
    drawBook(g, E.W * 0.52, GY + 78, -0.2, '#2e6ff0', '#f2e6c8');
    drawBook(g, E.W * 0.56, GY + 40, 0.3, '#4a9a6a', '#f2e6c8');
    drawBook(g, E.W * 0.60, GY + 82, -0.08, '#e8a04a', '#f2e6c8');
    const ps = { x: E.W * 0.64, y: GY, s: V(1.25, 1.35), facing: -1, outfit: CAST.PASSER1.outfit, pose: breathe(posesAt(t, [[0, POSES.crouch], [1.2, POSES.reach]]), t, 1, 2), expr: t > 1.2 ? 'smile' : 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, ps);
    const [hx, hy, hr] = headPos(ps);
    chancePill(g, hx, hy, hr, '8', t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.kneel]]), t);
    const kian = { x: E.W * 0.42, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim };
    drawFigure(g, kian);
    // the book he picks up: in his hand once he kneels
    if (t > 0.6) { const [bx, by] = handPos(kian); drawBook(g, bx + 10, by + 6, -0.3, '#c94a3a', '#f2e6c8'); }
  });
} });
