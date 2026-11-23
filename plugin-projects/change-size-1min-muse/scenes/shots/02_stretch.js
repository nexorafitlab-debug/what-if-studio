import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { bedroom } from '../sets/bedroom.js';
registerShot('s002', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = bedroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // stretch: arms rise from sit to a big reach over the shot
    const pose = breathe(posesAt(t, [[0, POSES.sit], [0.5, POSES.reach]]), t);
    drawFigure(g, { x: E.W * 0.30, y: GY + 40, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose, expr: exprAt(t, [[0, 'sleepy'], [0.5, 'neutral']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
