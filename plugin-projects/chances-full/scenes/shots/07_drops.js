// s007 — "Every mistake, it drops by one." The pill JUMPS 7 to 6, Kian winces.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { streetMorning } from '../sets/street_morning.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s007', { draw(g, t, info) {
  const cam = { z: 1.25, x: -100, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // Kian flinches as the number drops
    const pose = breathe(posesAt(t, [[0, POSES.explain], [0.7, POSES.sad]]), t);
    drawFigure(g, { x: E.W * 0.36, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: t > 0.7 ? 'worried' : 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // the passer-by's number: 7, then a hard JUMP to 6 on the word "one"
    const ps = { x: E.W * 0.72, y: GY, s: V(1.25, 1.35), facing: -1, outfit: CAST.PASSER2.outfit, pose: breathe(POSES.stand, t, 1, 5), expr: t > 0.7 ? 'confused' : 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, ps);
    const [hx, hy, hr] = headPos(ps);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '7'], [0.7, '6']]), t);
  });
  const a = clamp(prog(t, 1.0, 1.3));
  text(g, 'ONE MISTAKE. MINUS ONE.', E.W / 2, E.H * 0.2, { size: V(56, 64), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });
