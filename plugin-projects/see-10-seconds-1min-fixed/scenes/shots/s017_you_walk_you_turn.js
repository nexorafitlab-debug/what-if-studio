// s017 — "You walk. You turn." [SCHOOL HALLWAY] · walk — FIXED: was walkLocked
// with the stock params {x0: 0.10W, stride: 52, stepDur: 0.5} — Kian shuffled
// 192→400px hugging the left lockers. Now: a real walk across open floor
// (x0 0.24W, stride 64, stepDur 0.42 → 461→682px) WITH the turn — at 1.45s he
// stops, turns back (facing -1) and points. Ghost trail kept. The science
// citation uses citePill (shorter text, 22% width safety) — the stock
// scienceCite clipped "SOON ET AL." off the left frame edge here.
import { E, V, registerShot, layer, clamp } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkLocked, blendPose } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
import { ghostTrail } from '/engine/fx2d.js';
import { citePill } from '../_helpers.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore } from '/engine/story.js';
registerShot('s017', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  const TURN = 1.45;
  const walk = { x0: E.W * 0.24, stride: 64, stepDur: 0.42, facing: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    if (t < TURN) {
      const wlk = walkLocked(t, walk);
      ghostTrail(g, (gg, ox, oy) => drawFigure(gg, { x: wlk.x + ox, y: GY + oy, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: wlk.pose, expr: 'neutral', rim }), { dx: -70, count: 2 });
      drawFigure(g, { x: wlk.x, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: wlk.pose, expr: 'neutral', rim });
    } else {
      const endX = walkLocked(TURN, walk).x;
      // blend out of the mid-stride walk pose into stand over 0.35s so the
      // stop does not snap (the facing flip at TURN is one hard frame, in-style)
      const target = posesAt(t - TURN, [[0, 'stand'], [0.3, 'point']]);
      const pose = breathe(blendPose(walkLocked(TURN, walk).pose, target, clamp((t - TURN) / 0.35)), t);
      drawFigure(g, { x: endX, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.KIAN.outfit, pose, expr: 'neutral', rim });
    }
  });
  dualCounter(g, info.globalT, { chapterStart: 39.64, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 1 }] });
  citePill(g, t, { source: 'SOON ET AL.', place: 'MAX PLANCK INST., BERLIN', year: '2008' });
} });
