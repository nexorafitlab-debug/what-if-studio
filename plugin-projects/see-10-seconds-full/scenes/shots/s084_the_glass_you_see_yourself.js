// s084 — "the glass. You see yourself." [BUS STOP - NORTH PLATFORM] · look
import { E, V, registerShot, layer, clamp, prog, slowCam } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, exprAt, headPos } from '/engine/rig2d.js';
import { bus_stop } from '../sets/bus_stop.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore } from '/engine/story.js';
registerShot('s084', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bus_stop(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = posesAt(t, [[0, 'point'], [D * 0.35, 'think'], [D * 0.7, 'stand']]);
    drawFigure(g, { x: E.W * 0.30, y: GY, s: V(1.4, 1.5), facing: 1, outfit: CAST.KIAN.outfit, pose: pose, expr: exprAt(t, [[0, 'determined'], [D * 0.35, 'thinking'], [D * 0.7, 'worried']]), rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 90.32, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 7 }] });
} });
