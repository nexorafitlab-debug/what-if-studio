// s008 — "Lunch tray slips. Five. Four. Three." Tray tilts in Kian's hands; countdown ticks.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { cafeteria } from '../sets/cafeteria.js';
import { CAST } from '../cast.js';
import { bigCount, drawTray, handPos } from '../_helpers.js';
registerShot('s008', { draw(g, t, info) {
  const cam = { z: 1.25, x: -160, y: 200 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = cafeteria(g, t, info, {});
    const s = V(1.4, 1.5), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const kian = { x: E.W * 0.42, y: GY + 40, s, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.holdFront, t), expr: t > 0.3 ? 'worried' : 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim };
    drawFigure(g, kian);
    // tray in his hands, tipping further as the seconds run out
    const [hx, hy] = handPos(kian);
    drawTray(g, hx + 10, hy + 6, prog(t, 0.2, 2.6) * 0.55, 1.1);
  });
  bigCount(g, t, [[1.31, '5'], [2.01, '4'], [2.89, '3']]);
} });
