// s102 — "Jada's tray slips again. You move to catch it." [CAFETERIA - TABLE 7] · catch
import { E, V, registerShot, layer, clamp, prog, slowCam, circle, rr } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, headPos } from '/engine/rig2d.js';
import { cafeteria } from '../sets/cafeteria.js';
import { CAST } from '../cast.js';
import { drawTray } from '../_helpers.js';
import { dualCounter } from '/engine/counters.js';
import { beatBanner, hudScore } from '/engine/story.js';
registerShot('s102', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = cafeteria(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // tray tilts, then levels as the hand catches it
    const tilt = 0.5 * (1 - prog(t, 0.15, D * 0.6));
    drawTray(g, E.W * 0.52, GY - 190, tilt);
    const pose = posesAt(t, [[0, 'stand'], [D * 0.25, 'reach'], [D * 0.55, 'holdFront'], [D * 0.8, 'stand']]);
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: pose, expr: 'determined', rim });
    const pose2 = posesAt(t, [[0, 'stand'], [D * 0.4, 'talk'], [D * 0.8, 'stand']]);
    drawFigure(g, { x: E.W * 0.74, y: GY, s: V(1.15, 1.25), facing: -1, outfit: CAST.JADA.outfit, pose: pose2, expr: 'surprised', rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 247.16, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 250 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 7 }] });
  beatBanner(g, t, { n: 14, title: 'THE MISS', dur: D, y: E.H * 0.12 });
} });
