// s013 — "Bus brakes. Doors hiss. You're already stepping on." Kian walks to the open bus door.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount, alpha, seg } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose } from '/engine/rig2d.js';
import { streetBus } from '../sets/street_bus.js';
import { CAST } from '../cast.js';
registerShot('s013', { draw(g, t, info) {
  const cam = { z: 1.05, x: 0, y: 0 };
  layer(g, cam, 1, (g) => {
    const { GY, M, bus } = streetBus(g, t, info, {});
    const s = V(1.3, 1.4), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // commuters waiting at the stop
    const c1 = { x: E.W * 0.62, y: GY, s: V(1.1, 1.2), facing: -1, outfit: CAST.CROWD1.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim };
    drawFigure(g, c1);
    const c2 = { x: E.W * 0.7, y: GY, s: V(1.1, 1.2), facing: -1, outfit: CAST.CROWD2.outfit, pose: breathe(POSES.stand, t, 1, 5), expr: 'neutral', rim };
    drawFigure(g, c2);
    // Kian walks from the left toward the glowing open door
    const lx = E.W * 0.14 + t * 230;
    drawFigure(g, { x: lx, y: GY, s, facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // door hiss: little puffs at the door as it opens
    if (t > 1.0 && t < 1.7) {
      const a = clamp(1 - Math.abs(t - 1.35) / 0.35);
      for (let i = 0; i < 3; i++) seg(g, [[bus.x + 220 + i * 8, bus.y - 120 + i * 26], [bus.x + 260 + i * 8, bus.y - 120 + i * 26]], 3, alpha('#ffffff', 0.5 * a));
    }
  });
} });
