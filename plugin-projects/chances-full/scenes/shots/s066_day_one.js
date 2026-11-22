// s066 — "Day one: you do the dishes. No one notices." Kitchen: Kian at the sink, Mom behind him, pill 3.
import { E, V, registerShot, layer, talkAmount, rr, seg } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { kitchenEvening } from '../sets/kitchen_evening.js';
import { CAST } from '../cast.js';
import { chancePill, handPos } from '../_helpers.js';
registerShot('s079', { draw(g, t, info) {
  const cam = { z: 1.1, x: 0, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchenEvening(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mom = { x: E.W * 0.7, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mom);
    const [hx, hy, hr] = headPos(mom);
    chancePill(g, hx, hy, hr, '3', t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.holdFront]]), t);
    const kian = { x: E.W * 0.20, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim };
    drawFigure(g, kian);
    // sink counter in front of him (foreground: covers his legs, he stands
    // behind it at the sink), basin + tap
    const sx0 = E.W * 0.05, sx1 = E.W * 0.30, sTop = GY - 150;
    rr(g, sx0, sTop, sx1 - sx0, 150, 8); g.fillStyle = '#7a6a58'; g.fill();
    rr(g, sx0 + 170, sTop + 12, 180, 30, 10); g.fillStyle = '#3a4a5a'; g.fill(); // basin
    seg(g, [[sx0 + 260, sTop], [sx0 + 260, sTop - 80]], 8, '#8a8a92');
    seg(g, [[sx0 + 260, sTop - 80], [sx0 + 300, sTop - 80]], 8, '#8a8a92');
    // dirty stack shrinks, clean stack grows — he IS doing the dishes
    const dirty = Math.max(1, 4 - Math.floor(t / 0.8)), clean = 1 + Math.floor(t / 0.8);
    const stack = (cx, n) => { for (let i = 0; i < n; i++) { rr(g, cx - 22, sTop - 8 - i * 7, 44, 10, 5); g.fillStyle = i % 2 ? '#e8e4f4' : '#d8d8e0'; g.fill(); } };
    stack(sx0 + 420, dirty); // dirty, right of the basin
    stack(sx0 + 70, clean);  // clean, left of the basin
    // the plate he is washing: in his hand, scrubbing side to side
    const [px, py] = handPos(kian);
    rr(g, px - 22 + Math.sin(t * 3) * 14, py - 6, 44, 12, 6); g.fillStyle = '#f2ead8'; g.fill();
  });
} });
