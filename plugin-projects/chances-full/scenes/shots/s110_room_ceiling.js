// s110 — "You go to your room. You stare at the ceiling." Bedroom: Kian lies down, staring up.
import { E, V, registerShot, layer, talkAmount, prog, ease, lerp } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
registerShot('s155', { draw(g, t, info) {
  const cam = { z: 1.1, x: 0, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const s = V(1.4, 1.5), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const k = ease.inOut(prog(t, 0, 0.6));
    const rot = Math.PI / 2 * k;
    const x = lerp(E.W * 0.3, E.W * 0.42, k);
    const y = lerp(GY + 40, GY + 93, k);
    const pose = breathe(posesAt(t, [[0, POSES.sit], [0.6, POSES.lie]]), t);
    drawFigure(g, { x, y, s, facing: 1, outfit: CAST.KIAN.outfit, pose, rot, expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
