import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
import { goldLine } from '../_helpers.js';
registerShot('s028', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  // TITLE CARD on the void — the ONE slow push-in of the video, on Eli
  const cam = slowCam(t, 3.26, { type: 'pushIn', from: 1, to: 1.08, focus: [E.W * 0.5, E.H * 0.55] });
  layer(g, cam, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.wave], [2.2, POSES.stand]]), t), expr: exprAt(t, [[0, 'smile'], [1.0, 'happy']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  // TEXT LAST, on top (static while Eli pushes in)
  goldLine(g, 'WHAT IF YOU COULD SEE', E.H * 0.22, V(62, 70));
  goldLine(g, 'THE WORDS PEOPLE SWALLOW?', E.H * 0.34, V(62, 70));
} });
