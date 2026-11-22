// s090 — "A kid bumps into him. Spills his coffee." Bus stop: the kid runs in, the old man's pill is about to fall.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { busStop } from '../sets/bus_stop.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s117', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = busStop(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const old = { x: E.W * 0.6, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.OLD.outfit, pose: breathe(t > 1.2 ? POSES.sad : POSES.stand, t, 1, 2), expr: t > 1.2 ? 'sad' : 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, old);
    const [hx, hy, hr] = headPos(old);
    chancePill(g, hx, hy, hr, '1', t);
    const kx = E.W * 0.15 + Math.min(t, 1.2) * 260;
    drawFigure(g, { x: kx, y: GY, s: V(1.05, 1.15), facing: 1, outfit: CAST.KID.outfit, pose: walkPose(t * Math.PI * 2 * 1.4), expr: 'surprised', rim: { color: M.rim, dir: [1, -1], w: 3 } });
    const pose = breathe(posesAt(t, [[0, POSES.sit], [1.0, POSES.stand]]), t);
    drawFigure(g, { x: E.W * 0.2, y: GY + 20, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
