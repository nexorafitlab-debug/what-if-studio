import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { crowdSet } from '../sets/crowd.js';
registerShot('s136', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = crowdSet(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "I'm not a show." — Noah stands tall, the crowd behind him
    drawFigure(g, { x: E.W * 0.44, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.holdFront], [0.5, POSES.stand]]), t), expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.55, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.MILO.outfit, pose: breathe(POSES.cheer, t), expr: 'happy', talk: 0, blink: (t % 3.1) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.66, y: GY, s: V(1.6, 1.7), facing: -1, outfit: CAST.VANE.outfit, pose: breathe(POSES.sad, t), expr: 'angry', talk: 0, blink: (t % 3.5) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, "I'M NOT A SHOW.", E.W / 2, E.H * 0.16, { size: V(64, 70), color: '#ffd76a', glow: 24, glowColor: 'rgba(255,215,106,0.55)', spacing: 4, alpha: a });
} });
