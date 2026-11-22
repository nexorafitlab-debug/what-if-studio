// s004 — "You reach up. You catch the falling blade before it hits your pillow." [BEDROOM - DAWN] · catch
import { E, V, registerShot, layer, clamp, prog, slowCam, circle, rr } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, exprAt, headPos } from '/engine/rig2d.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
registerShot('s004', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomDawn(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // fan blade detaches and drops, spinning
    const fy2 = GY - 420 + 420 * Math.min(1, t / (D * 0.55)) ** 2;
    g.save(); g.translate(E.W * 0.5, Math.min(fy2, GY - 150)); g.rotate(t * 2.2);
    rr(g, -70, -9, 140, 18, 9); g.fillStyle = '#8a8f9e'; g.fill(); g.restore();
    const pose = posesAt(t, [[0, 'stand'], [D * 0.25, 'reach'], [D * 0.55, 'holdFront'], [D * 0.8, 'stand']]);
    drawFigure(g, { x: E.W * 0.70, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: pose, expr: exprAt(t, [[0, 'neutral'], [D * 0.25, 'surprised'], [D * 0.55, 'determined'], [D * 0.85, 'smile']]), rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 4.0, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
} });
