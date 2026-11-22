// s009 — "Your hand snags it mid-air." The tray snaps level; a sparkle marks the catch.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { cafeteria } from '../sets/cafeteria.js';
import { CAST } from '../cast.js';
import { drawTray, handPos } from '../_helpers.js';
registerShot('s009', { draw(g, t, info) {
  const cam = { z: 1.35, x: -160, y: 200 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = cafeteria(g, t, info, {});
    const s = V(1.4, 1.5), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.holdFront], [0.35, POSES.reach]]), t);
    const kian = { x: E.W * 0.42, y: GY + 40, s, facing: 1, outfit: CAST.KIAN.outfit, pose, expr: t > 1.2 ? 'smirk' : 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim };
    drawFigure(g, kian);
    // tray snaps back level the instant his hand closes on it
    const [hx, hy] = handPos(kian);
    drawTray(g, hx + 10, hy + 6, 0.55 * (1 - prog(t, 0.2, 0.45)), 1.1);
    if (t > 0.4 && t < 1.1) FX.sparkle(g, hx + 10, hy - 20, 26, '#ffd76a', clamp(1 - (t - 0.4) / 0.7));
  });
} });
