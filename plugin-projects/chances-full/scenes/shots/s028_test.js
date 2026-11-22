// s028 — "So you run a test." Schoolyard: Kian walks in, thinking, hand on chin.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import { schoolyard } from '../sets/schoolyard.js';
import { CAST } from '../cast.js';
registerShot('s032', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = schoolyard(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const lx = E.W * 0.16 + t * 150;
    const kpose = t < 1.2 ? walkPose(t * Math.PI * 2 * 0.9) : breathe(POSES.think, t);
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: kpose, expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
