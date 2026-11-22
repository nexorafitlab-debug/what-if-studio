// s095 P2 — "You get off the bus." Kian walks away from the old man, sad.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose } from '/engine/rig2d.js';
import { busStop } from '../sets/bus_stop.js';
import { CAST } from '../cast.js';
registerShot('s126', { draw(g, t, info) {
  const cam = { z: 1.1, x: -40, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = busStop(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.66, y: GY + 30, s: V(1.25, 1.35), facing: -1, outfit: CAST.OLD.outfit, pose: breathe(POSES.sit, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } });
    const lx = E.W * 0.3 + (t + 3.42) * 150;
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose((t + 3.42) * Math.PI * 2 * 0.9), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
