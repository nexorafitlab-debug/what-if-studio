// s004 — "You reach up. You catch the falling blade before it hits your pillow." [BEDROOM - DAWN] · catch — FIXED:
// was: blade fell at x=0.50W while Kian stood at 0.70W (~470px apart — the
// catch did not read). Now: the sample's s004 method — the blade falls from
// the fan hub TO the hand (handPos-anchored), then stays caught in the hand.
// Camera zooms in (z=1.3) like the sample so the catch fills the frame.
import { E, V, registerShot, layer, ease, prog } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomDawn } from '../sets/bedroom_dawn.js';
import { CAST } from '../cast.js';
import { fanBlade, handPos } from '../_helpers.js';
import { dualCounter } from '/engine/counters.js';
registerShot('s004', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1.3, x: -96, y: 150 };
  layer(g, cam, 1, (g) => {
    const { GY, M, fan } = bedroomDawn(g, t, info, { fanSpeed: 3.0, wobble: 6 });
    const s = V(1.5, 1.6), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, 'reach'], [1.7, 'holdFront'], [3.0, 'stand']]), t);
    const kian = { x: E.W * 0.45, y: GY + 40, s, facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'determined', rim };
    drawFigure(g, kian);
    // blade falls from the fan to the hand, then stays caught in the hand
    const [hx, hy] = handPos(kian);
    const fall = prog(t, 0.2, 1.6);
    if (fall < 1) {
      const by = fan.y + ease.in(fall) * (hy - fan.y - 20);
      fanBlade(g, fan.x + 60 + fall * 40, by, 0.5 + fall * 1.6, 200, 26, '#3a2a36');
    } else {
      fanBlade(g, hx + 10, hy - 6, 0.25, 200, 26, '#3a2a36');
    }
  });
  dualCounter(g, info.globalT, { chapterStart: 4.0, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
} });
