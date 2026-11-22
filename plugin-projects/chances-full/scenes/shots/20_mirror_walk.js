// s020 — "Then you look in a mirror." Bathroom: Kian walks up to the mirror.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, walkPose } from '/engine/rig2d.js';
import { bathroomMirror } from '../sets/bathroom_mirror.js';
import { CAST } from '../cast.js';
registerShot('s022', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bathroomMirror(g, t, info, {});
    const s = V(1.3, 1.4), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Kian walks right to left, toward the mirror on the wall
    const lx = E.W * 0.88 - t * 160;
    drawFigure(g, { x: lx, y: GY, s, facing: -1, outfit: CAST.KIAN.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: t > 1.0 ? 'thinking' : 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
