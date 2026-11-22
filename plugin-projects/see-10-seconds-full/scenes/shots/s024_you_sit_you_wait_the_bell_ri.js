// s024 — "You sit. You wait. The bell rings." [SCHOOL HALLWAY - 3RD FLOOR] · sit
import { E, V, registerShot, layer, clamp, prog, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, headPos } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore, recapBanner } from '/engine/story.js';
registerShot('s024', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = posesAt(t, [[0, 'stand'], [D * 0.25, 'sit'], [D * 0.6, 'sitBack']]);
    drawFigure(g, { x: E.W * 0.40, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: pose, expr: 'thinking', rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 39.64, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 1 }] });
  recapBanner(g, t, { str: 'Ten seconds ahead. Only yours. Never wrong.', dur: D });
} });
