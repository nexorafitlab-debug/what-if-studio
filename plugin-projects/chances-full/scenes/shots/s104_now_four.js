// s104 — "Now it is four. Four chances left with the people who matter." Bathroom: reflection pill JUMPS 5 to 4.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { bathroomMirror } from '../sets/bathroom_mirror.js';
import { CAST } from '../cast.js';
import { chancePill, jumpValue } from '../_helpers.js';
registerShot('s142', { draw(g, t, info) {
  const cam = { z: 1.2, x: -60, y: 40 };
  layer(g, cam, 1, (g) => {
    const { GY, M, mirror } = bathroomMirror(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const refl = { x: E.W * 0.42, y: mirror.y + mirror.h - 20, s: 1.2, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.sad, t, 1, 2), expr: 'sad', alpha: 0.9, rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, refl);
    const [hx, hy, hr] = headPos(refl);
    chancePill(g, hx, hy, hr, jumpValue(t, [[0, '5'], [0.8, '4']]), t);
    const pose = breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.handsOnHead]]), t);
    drawFigure(g, { x: E.W * 0.66, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.KIAN.outfit, pose, expr: 'shocked', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.8, 1.0));
  text(g, 'FOUR.', E.W / 2, E.H * 0.90, { size: V(64, 72), color: '#ffb347', glow: 30, glowColor: 'rgba(255,179,71,0.55)', spacing: 2, alpha: a });
} });
