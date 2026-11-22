// s004 — "You catch the falling blade before it hits your pillow." Hand snatches the blade mid-air.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
import { CAST } from '../cast.js';
import { fanBlade, handPos } from '../_helpers.js';
registerShot('s004', { draw(g, t, info) {
  const cam = { z: 1.3, x: -96, y: 150 };
  layer(g, cam, 1, (g) => {
    const { GY, M, fan } = bedroomDawn(g, t, info, { fanSpeed: 3.0, wobble: 6 });
    const s = V(1.5, 1.6), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.reach], [0.8, POSES.stand]]), t);
    const kian = { x: E.W * 0.45, y: GY + 40, s, facing: 1, outfit: CAST.KIAN.outfit, pose, expr: t > 0.7 ? 'smirk' : 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim };
    drawFigure(g, kian);
    // blade falls from the fan to the hand, then stays caught in the hand
    const [hx, hy] = handPos(kian);
    const fall = prog(t, 0, 0.55);
    if (fall < 1) {
      const by = fan.y + ease.in(fall) * (hy - fan.y - 20);
      fanBlade(g, fan.x + 60 + fall * 40, by, 0.5 + fall * 1.6, 200, 26, '#3a2a36');
    } else {
      fanBlade(g, hx + 10, hy - 6, 0.25, 200, 26, '#3a2a36');
    }
  });
} });
