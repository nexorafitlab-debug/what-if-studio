import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { bedroom } from '../sets/bedroom.js';
registerShot('s005', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = bedroom(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // YOU SHRINK BACK DOWN: tall Noah scales back to normal size
    const k = ease.inOut(prog(t, 0.1, 1.0));
    const s = lerp(2.4, 1.5, k);
    const pose = breathe(posesAt(t, [[0, POSES.holdFront], [0.6, POSES.stand]]), t);
    drawFigure(g, { x: E.W * 0.42, y: GY, s, facing: 1, outfit: CAST.NOAH.outfit, pose, expr: exprAt(t, [[0, 'smile'], [0.7, 'neutral']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
