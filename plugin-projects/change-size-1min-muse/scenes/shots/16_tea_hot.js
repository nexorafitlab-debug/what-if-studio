import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchen } from '../sets/kitchen.js';
registerShot('s016', { draw(g, t, info) {
  const cam = { z: 1.25, x: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = kitchen(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // the tea is STILL HOT — steam curls from the mug; Noah leans in, amazed
    drawFigure(g, { x: E.W * 0.52, y: GY + 10, s: V(1.4, 1.5), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.sit], [0.7, POSES.sitBack]]), t), expr: exprAt(t, [[0, 'happy'], [0.7, 'surprised']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.78, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MOM.outfit, pose: breathe(POSES.stand, t), expr: 'smile', talk: 0, blink: (t % 3.3) < 0.12, rim });
  });
} });
