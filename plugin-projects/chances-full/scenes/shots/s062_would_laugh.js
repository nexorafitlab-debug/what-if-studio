// s062 — "She would laugh. Then it would drop again." Bedroom: Mia laughs it off; Kian holds his head.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s072', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mia = { x: E.W * 0.64, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.SISTER.outfit, pose: breathe(t > 1.0 ? POSES.cheer : POSES.stand, t, 1, 2), expr: t > 1.0 ? 'smile' : 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mia);
    const [hx, hy, hr] = headPos(mia);
    chancePill(g, hx, hy, hr, '6', t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [1.2, POSES.handsOnHead]]), t);
    drawFigure(g, { x: E.W * 0.28, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
