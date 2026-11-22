// s073 — "Jay reads your text. He does not reply. But he reads it." Bedroom: Kian's phone, SEEN.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
registerShot('s089', { draw(g, t, info) {
  const cam = { z: 1.3, x: 0, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.phone], [1.6, POSES.sad]]), t);
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: t > 1.6 ? 'sad' : 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
