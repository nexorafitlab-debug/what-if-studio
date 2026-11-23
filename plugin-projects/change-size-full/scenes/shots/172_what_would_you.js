import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { observatory } from '../sets/observatory.js';
registerShot('s172', { draw(g, t, info) {
  // THE ONE slow camera move of the ending: slow push-in on the observatory
  const cam = slowCam(t, info.dur, { type: 'pushIn', from: 1, to: 1.08, focus: [E.W / 2, E.H * 0.5] });
  layer(g, cam, 1, (g) => { observatory(g, t, info, {}); });
  const a = clamp(prog(t, 0.3, 0.7));
  layer(g, cam, 1, (g) => {
    const { GY } = observatory(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.stand, t), expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    drawFigure(g, { x: E.W * 0.58, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.MILO.outfit, pose: breathe(POSES.stand, t), expr: 'smile', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
  text(g, 'SO WHAT WOULD YOU DO', E.W / 2, E.H * 0.26, { size: V(76, 82), color: '#ffd76a', glow: 28, glowColor: 'rgba(255,215,106,0.55)', spacing: 4, alpha: a });
  text(g, 'IF YOU COULD CHANGE YOUR SIZE?', E.W / 2, E.H * 0.38, { size: V(64, 70), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 4, alpha: a });
} });
