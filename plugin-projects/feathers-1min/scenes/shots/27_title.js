import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
import { goldLine } from '../_helpers.js';
import { slowCam } from '/engine/core.js';
registerShot('s027', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  // TITLE CARD on the void — the ONE slow push-in of the video, on Kai
  const cam = slowCam(t, 3.38, { type: 'pushIn', from: 1, to: 1.08, focus: [E.W * 0.5, E.H * 0.55] });
  layer(g, cam, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
    drawFigure(g, { x: E.W * 0.5, y: GY, s: V(1.5, 1.6), facing: 1, outfit: CAST.KAI.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.wave], [2.2, POSES.stand]]), t), expr: exprAt(t, [[0, 'smile'], [1.0, 'happy']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  // TEXT LAST, on top (static while Kai pushes in)
  goldLine(g, 'WHAT IF EVERY LIE', E.H * 0.22, V(58, 64));
  goldLine(g, 'YOU TELL GROWS A FEATHER?', E.H * 0.34, V(58, 64));
} });
