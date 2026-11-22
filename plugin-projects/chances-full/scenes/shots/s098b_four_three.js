// s098 P2 — "Four. Three. She turns away." Her pill JUMPS 4 to 3 on "Three."; she turns and goes.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, headPos } from '/engine/rig2d.js';
import { streetNight } from '../sets/street_night.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s131', { draw(g, t, info) {
  const cam = { z: 1.4, x: 100, y: 120 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetNight(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const turned = t > 1.8;
    const her = { x: E.W * 0.6 + (turned ? (t - 1.8) * 60 : 0), y: GY, s: V(1.4, 1.5), facing: turned ? 1 : -1, outfit: CAST.PASSER2.outfit, pose: breathe(t > 0.88 ? POSES.sad : POSES.crossArms, t, 1, 2), expr: t > 0.88 ? 'sad' : 'angry', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, her);
    const [hx, hy, hr] = headPos(her);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '4'], [0.88, '3']]), t);
    const him = { x: E.W * 0.82, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.PASSER1.outfit, pose: breathe(POSES.talk, t, 1, 2), expr: 'angry', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, him);
    drawFigure(g, { x: E.W * 0.32, y: GY, s: V(1.25, 1.35), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
