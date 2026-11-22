// s102 — "You stop counting. You run the rest of the way home." Night street: Kian breaks into a run.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import { streetNight } from '../sets/street_night.js';
import { CAST } from '../cast.js';
registerShot('s139', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetNight(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const lx = E.W * 0.14 + t * 260;
    const kpose = t < 0.8 ? breathe(POSES.think, t) : walkPose(t * Math.PI * 2 * 1.6);
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: kpose, expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
