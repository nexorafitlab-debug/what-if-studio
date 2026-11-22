// s011 — "The fan turns. The room is still." [BEDROOM - DAWN] · act — FIXED:
// was the stock act template at 0.70W + a recap banner whose text overflowed
// its pill on both sides and covered the hero's feet. Now: points up at the
// turning fan, then folds his arms and watches (pointUp→crossArms) at 0.30W;
// the recap is shortened to 'You caught the blade.' and moved to y=0.90H,
// below his feet and inside the letterbox-safe area.
import { E, V, registerShot, layer } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
import { recapBanner } from '/engine/story.js';
registerShot('s011', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomDawn(g, t, info, { fanSpeed: 2.2 });
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, 'pointUp'], [1.4, 'crossArms']]), t);
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'neutral', rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 4.0, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  recapBanner(g, t, { str: 'You caught the blade.', dur: D, y: E.H * 0.90 });
} });
