import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { bedroom } from '../sets/bedroom.js';
import { goldLine } from '../_helpers.js';
registerShot('s001', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = bedroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // sit-up: rot unwinds -90 deg (flat, head on pillow) -> 0 (sitting), over 0.5 s
    const k = ease.inOut(prog(t, 0, 0.5));
    const rot = -Math.PI / 2 * (1 - k);
    const x = lerp(E.W * 0.20, E.W * 0.30, k);
    const y = lerp(GY + 93, GY + 40, k);
    const pose = breathe(posesAt(t, [[0, POSES.lie], [0.4, POSES.sit]]), t);
    drawFigure(g, { x, y, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose, rot, expr: t > 0.8 ? 'surprised' : 'sleepy', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
