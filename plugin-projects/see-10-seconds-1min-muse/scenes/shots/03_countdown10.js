// s003 — countdown "Ten. Nine. Eight." Kian reaches up; a blade detaches and falls.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
import { CAST } from '../cast.js';
import { bigCount, fanBlade } from '../_helpers.js';
registerShot('s003', { draw(g, t, info) {
  const cam = { z: 1.12, x: 0, y: -50 };
  layer(g, cam, 1, (g) => {
    const { GY, M, fan } = bedroomDawn(g, t, info, { fanSpeed: 3.4, wobble: 16 });
    const s = V(1.5, 1.6), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.stand], [0.4, POSES.reach]]), t);
    drawFigure(g, { x: E.W * 0.45, y: GY + 40, s, facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'surprised', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // the blade detaches near the end of the shot and starts to fall
    const fall = prog(t, 1.9, 2.4);
    if (fall > 0) {
      const by = fan.y + ease.in(fall) * 480;
      fanBlade(g, fan.x + 60, by, 0.5 + fall * 2.2, 200, 26, '#3a2a36');
    }
  });
  bigCount(g, t, [[0.43, '10'], [1.11, '9'], [2.19, '8']]);
} });
