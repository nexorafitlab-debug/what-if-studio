// s055 — "You forget. You are playing a game." Bedroom: Kian on his phone, gaming, face lit by the screen.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
registerShot('s062', { draw(g, t, info) {
  const cam = { z: 1.3, x: 0, y: 100 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.phone], [1.0, POSES.facepalm]]), t);
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: t > 1.0 ? 'shocked' : 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
