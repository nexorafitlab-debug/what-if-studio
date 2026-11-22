// s099 P3 — "Nobody leaves. But something left anyway." The porch is empty of her; he is alone.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import { streetNight } from '../sets/street_night.js';
import { CAST } from '../cast.js';
registerShot('s134', { draw(g, t, info) {
  const cam = { z: 1.4, x: 100, y: 120 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = streetNight(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const him = { x: E.W * 0.56, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.PASSER1.outfit, pose: breathe(POSES.sad, t, 1, 2), expr: 'sad', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, him);
    drawFigure(g, { x: E.W * 0.32, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t), expr: 'sad', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'BUT SOMETHING LEFT ANYWAY.', E.W / 2, E.H * 0.90, { size: V(40, 46), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });
