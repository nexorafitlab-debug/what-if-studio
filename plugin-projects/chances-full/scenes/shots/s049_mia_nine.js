// s049 — "Your sister Mia has nine. Nine chances." Bedroom: Mia smiling, green 9 above her.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
import { goldLine } from '../_helpers.js';
registerShot('s055', { draw(g, t, info) {
  const cam = { z: 1.2, x: 0, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const mia = { x: E.W * 0.58, y: GY, s: V(1.35, 1.45), facing: -1, outfit: CAST.SISTER.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, mia);
    const [hx, hy, hr] = headPos(mia);
    chancePill(g, hx, hy, hr, '9', t);
    const pose = breathe(posesAt(t, [[0, POSES.talk], [0.8, POSES.point]]), t);
    drawFigure(g, { x: E.W * 0.26, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  if (t > 0.4) goldLine(g, 'MIA  ·  9', E.H * 0.90, V(60, 68)); // bottom: the bedroom wall clock sits at top-centre and covered this text at 0.16H (seen in sheet still)
} });
