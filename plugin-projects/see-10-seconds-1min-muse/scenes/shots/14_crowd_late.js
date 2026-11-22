// s014 — "The crowd surges behind you — three seconds late." Kian steps aboard; the crowd rushes in late.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import { streetBus } from '../sets/street_bus.js';
import { CAST } from '../cast.js';
registerShot('s014', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetBus(g, t, info, {});
    const s = V(1.3, 1.4), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // the crowd surges in from the left, three seconds late
    const crowd = [CAST.CROWD1, CAST.CROWD2, CAST.CROWD3];
    crowd.forEach((c, i) => {
      const cx = E.W * 0.06 + i * 110 + t * 150;
      drawFigure(g, { x: cx, y: GY, s: V(1.15, 1.25), facing: 1, outfit: c.outfit, pose: walkPose(t * Math.PI * 2 * 1.3 + i * 1.7), expr: 'neutral', rim });
    });
    // Kian is already at the door, stepping up into the bus
    const step = prog(t, 0.4, 1.4);
    const pose = posesAt(t, [[0, POSES.stand], [0.4, POSES.reach]]);
    drawFigure(g, { x: E.W * 0.56, y: GY - step * 34, s, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(pose, t), expr: 'smirk', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 1.8, 2.2));
  text(g, '3 SECONDS LATE.', E.W / 2, E.H * 0.2, { size: V(64, 72), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });
