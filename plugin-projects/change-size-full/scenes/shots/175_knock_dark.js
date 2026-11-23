import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { observatory } from '../sets/observatory.js';
registerShot('s175', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => { observatory(g, t, info, {}); });
  const a = clamp(prog(t, 0.3, 0.7));
  text(g, 'AND IF YOU FELT THAT KNOCK', E.W / 2, E.H * 0.28, { size: V(64, 70), color: '#9fd8ff', glow: 24, glowColor: 'rgba(159,216,255,0.5)', spacing: 4, alpha: a });
  text(g, 'IN THE DARK...', E.W / 2, E.H * 0.40, { size: V(64, 70), color: '#9fd8ff', glow: 24, glowColor: 'rgba(159,216,255,0.5)', spacing: 4, alpha: a });
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = observatory(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // Noah taps the knock on Milo's arm, one last time
    const tap = (t > 0.5 && t < 0.7) || (t > 0.9 && t < 1.1) || (t > 1.6 && t < 1.8);
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(tap ? POSES.point : POSES.stand, t), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.58, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(POSES.stand, t), expr: 'smile', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });
