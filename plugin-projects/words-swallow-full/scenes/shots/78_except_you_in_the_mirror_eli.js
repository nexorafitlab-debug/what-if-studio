import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { bathroomMirror } from '../sets/bathroom_mirror.js';
import { mirrorWords } from '../_helpers.js';
registerShot('s078', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.28, y: 0, s: 1.5, facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.reach]]), t) };
  let _rf = { x: E.W * 0.74, y: 0, s: 1.45, facing: -1, outfit: CAST.ELI.outfit, pose: breathe(POSES.stand, t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = bathroomMirror(g, t, info, {});
    // reflection in the mirror (dim, flipped) — Eli's OWN words live only here
    _rf.y = GY;
    drawFigure(g, { ..._rf, expr: 'sad', talk: 0, blink: (t % 3.7) < 0.12, dim: true, alpha: 0.55 });
    const _rf2 = { x: E.W * 0.74, y: GY, s: 1.45, facing: -1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, POSES.reach]]), t) };
    drawFigure(g, { ..._rf2, expr: 'determined', talk: 0, blink: (t % 3.7) < 0.12, dim: true, alpha: 0.55 });
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "sad"], [0.6, "determined"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12, look: [0.5, -0.2], rim });
  });
  const [_rhx, _rhy] = headPos(_rf);
  mirrorWords(g, _rhx, _rhy, ["I'M SORRY.", "I'M SCARED.", "I LOVE YOU."], t, { at: 0.2, dur: 2.33 });
} });
