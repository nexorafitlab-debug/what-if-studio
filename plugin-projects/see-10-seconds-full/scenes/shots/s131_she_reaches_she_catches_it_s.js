// s131 — "She reaches. She catches it. She smiles." [ROOFTOP - SUNSET] · catch
import { E, V, registerShot, layer, clamp, prog, slowCam, circle, rr } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, exprAt, headPos } from '/engine/rig2d.js';
import { rooftop } from '../sets/rooftop.js';
import { CAST } from '../cast.js';
import { drawPhone } from '../_helpers.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore } from '/engine/story.js';
registerShot('s131', { draw(g, t, info) {
  const D = info.dur;
  const cam = slowCam(t, D, { type: 'pushIn', from: 1, to: 1.08, focus: [E.W * 0.55, E.H * 0.55] });
  layer(g, cam, 1, (g) => {
    const { GY, M } = rooftop(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // the phone tumbles down — Mira reaches past Kian and catches it
    const fy = GY - 340 + 340 * Math.min(1, t / (D * 0.55)) ** 2;
    drawPhone(g, E.W * 0.58, Math.min(fy, GY - 140), t * 1.4);
    const pose = posesAt(t, [[0, 'stand'], [D * 0.25, 'reach'], [D * 0.55, 'holdFront'], [D * 0.8, 'stand']]);
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: pose, expr: exprAt(t, [[0, 'neutral'], [D * 0.25, 'surprised'], [D * 0.55, 'determined'], [D * 0.85, 'smile']]), rim });
    const pose2 = posesAt(t, [[0, 'stand'], [D * 0.3, 'reach'], [D * 0.55, 'holdFront'], [D * 0.85, 'stand']]);
    drawFigure(g, { x: E.W * 0.68, y: GY, s: V(1.15, 1.25), facing: -1, outfit: CAST.MIRA.outfit, pose: pose2, expr: exprAt(t, [[0, 'neutral'], [D * 0.55, 'smile'], [D * 0.85, 'happy']]), rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 368.52, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 7 }, { label: 'MISSES', value: 1 }] });
} });
