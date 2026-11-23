import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
registerShot('s027', { draw(g, t, info) {
  // THE ONE slow camera move: a slow push-in on the title (payoff moment)
  const cam = slowCam(t, info.dur, { type: 'pushIn', from: 1, to: 1.08, focus: [E.W / 2, E.H * 0.5] });
  layer(g, cam, 1, (g) => { voidSet(g, t, info, {}); });
  const a1 = clamp(prog(t, 0.2, 0.6)), a2 = clamp(prog(t, 0.8, 1.2));
  text(g, 'SO WHAT IF YOU', E.W / 2, E.H * 0.30, { size: V(84, 92), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 3, alpha: a1 });
  text(g, 'COULD CHANGE YOUR SIZE?', E.W / 2, E.H * 0.44, { size: V(84, 92), color: '#ffd76a', glow: 30, glowColor: 'rgba(255,215,106,0.55)', spacing: 3, alpha: a2 });
  layer(g, cam, 1, (g) => {
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.5, y: E.H * 0.88, s: V(1.5, 1.6), facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.2, POSES.wave]]), t), expr: exprAt(t, [[0, 'neutral'], [1.2, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
