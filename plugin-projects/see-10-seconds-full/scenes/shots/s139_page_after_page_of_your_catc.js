// s139 — "Page after page of your catches. Written before they happened." [ROOFTOP - TWILIGHT] · catch
import { E, V, registerShot, layer, clamp, prog, slowCam, circle, rr } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, headPos } from '/engine/rig2d.js';
import { rooftop_twilight } from '../sets/rooftop_twilight.js';
import { CAST } from '../cast.js';
import { dualCounter, progressCounter } from '/engine/counters.js';
import { hudScore } from '/engine/story.js';
registerShot('s139', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = rooftop_twilight(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // the thing falls — hero is already there
    const oy = GY - 320 + 320 * Math.min(1, t / (D * 0.55)) ** 2;
    circle(g, E.W * 0.54, Math.min(oy, GY - 150), 22, '#ffd76a');
    const pose = posesAt(t, [[0, 'stand'], [D * 0.25, 'reach'], [D * 0.55, 'holdFront'], [D * 0.8, 'stand']]);
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: pose, expr: 'determined', rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 401.48, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  progressCounter(g, t, { label: 'SAVES', total: 100, done: 35, x: 70, y: 240 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 7 }, { label: 'MISSES', value: 1 }] });
} });
