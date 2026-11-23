import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, seg, circle } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gym } from '../sets/gym.js';
registerShot('s023', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M, barY } = gym(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // GIANT Noah at the barbell — but his arms are still thin; he strains
    const fig = { x: E.W * 0.17, y: GY, s: 2.6, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.ready], [0.8, POSES.stand]]), t) };
    drawFigure(g, { ...fig, expr: exprAt(t, [[0, 'determined'], [0.8, 'worried']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // the barbell barely lifts off the rack, then settles back
    const lift = 26 * Math.sin(Math.PI * clamp(prog(t, 0.3, 1.3)));
    seg(g, [[E.W * 0.04, barY - lift], [E.W * 0.30, barY - lift]], 10, '#3a3a48');
    circle(g, E.W * 0.04, barY - lift, 30, '#2a2a33'); circle(g, E.W * 0.30, barY - lift, 30, '#2a2a33');
    drawFigure(g, { x: E.W * 0.68, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.GYM1.outfit, pose: breathe(POSES.stand, t), expr: 'worried', talk: 0, blink: (t % 3.3) < 0.12, rim });
    text(g, 'SAME MUSCLES', E.W / 2, E.H * 0.90, { size: V(44, 48), color: '#ffd76a', glow: 18, glowColor: 'rgba(255,215,106,0.5)', spacing: 3 });
  });
} });
