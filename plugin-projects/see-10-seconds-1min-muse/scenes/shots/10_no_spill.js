// s010 — "No spill. No stares." Kian sits calm at the table; nobody is looking.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { cafeteria } from '../sets/cafeteria.js';
import { CAST } from '../cast.js';
import { drawTray } from '../_helpers.js';
registerShot('s010', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = cafeteria(g, t, info, {});
    const s = V(1.35, 1.45), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // students at the far table, eating, not looking
    const st1 = { x: E.W * 0.68, y: GY + 76, s: V(1.1, 1.2), facing: -1, outfit: CAST.STUDENT1.outfit, pose: breathe(POSES.sit, t, 1, 2), expr: 'neutral', rim };
    drawFigure(g, st1);
    const st2 = { x: E.W * 0.82, y: GY + 76, s: V(1.1, 1.2), facing: -1, outfit: CAST.STUDENT3.outfit, pose: breathe(POSES.sit, t, 1, 5), expr: 'neutral', rim };
    drawFigure(g, st2);
    // Kian seated, tray safe on the table in front of him
    drawFigure(g, { x: E.W * 0.3, y: GY + 40, s, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sit, t), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawTray(g, E.W * 0.3 + 60, GY - 56, 0, 1.0);
  });
  const a1 = clamp(prog(t, 0.2, 0.6)), a2 = clamp(prog(t, 1.0, 1.4));
  text(g, 'NO SPILL.', E.W / 2, E.H * 0.24, { size: V(64, 72), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a1 });
  text(g, 'NO STARES.', E.W / 2, E.H * 0.38, { size: V(64, 72), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a2 });
} });
