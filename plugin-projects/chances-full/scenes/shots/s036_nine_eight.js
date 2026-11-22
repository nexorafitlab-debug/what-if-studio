// s036 — "Nine. Eight." Bedroom: Mia looks at her phone, no reply. Her pill JUMPS 9 to 8.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s040', { draw(g, t, info) {
  const cam = { z: 1.3, x: 0, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mia = { x: E.W * 0.52, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.SISTER.outfit, pose: breathe(posesAt(t, [[0, POSES.phone], [1.1, POSES.sad]]), t), expr: t > 1.1 ? 'sad' : 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mia);
    const [hx, hy, hr] = headPos(mia);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '9'], [0.62, '8']]), t);
  });
} });
