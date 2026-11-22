// s019 — "She reaches. She catches it. She smiles." The girl catches the phone; both smile.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { rooftop } from '../sets/rooftop.js';
import { CAST } from '../cast.js';
import { drawPhone, handPos } from '../_helpers.js';
registerShot('s019', { draw(g, t, info) {
  const cam = { z: 1.15, x: 60, y: 0 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = rooftop(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // the girl: reach, then the phone is in her hand and she smiles
    const gpose = breathe(posesAt(t, [[0, POSES.reach], [0.5, POSES.stand]]), t);
    const girl = { x: E.W * 0.4, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.GIRL.outfit, pose: gpose, expr: t > 0.9 ? 'smile' : 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, girl);
    // Kian watches her, then smiles back
    drawFigure(g, { x: E.W * 0.66, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.KIAN.outfit, pose: breathe(POSES.stand, t), expr: t > 1.2 ? 'smile' : 'surprised', look: [-0.6, 0], talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // phone: drops into her hand at the catch, then stays there
    const [hx, hy] = handPos(girl);
    const catchK = prog(t, 0.1, 0.45);
    if (catchK < 1) {
      drawPhone(g, E.W * 0.52, GY - 300 + ease.in(catchK) * (hy - (GY - 300)), 0.9 + catchK * 0.5, 1.4);
    } else {
      drawPhone(g, hx + 6, hy - 4, 0.2, 1.15);
    }
    if (t > 0.4 && t < 1.1) FX.sparkle(g, hx + 6, hy - 20, 26, '#ffd76a', clamp(1 - (t - 0.4) / 0.7));
  });
  const a = clamp(prog(t, 1.8, 2.2));
  text(g, 'SHE SMILES.', E.W / 2, E.H * 0.2, { size: V(64, 72), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });
