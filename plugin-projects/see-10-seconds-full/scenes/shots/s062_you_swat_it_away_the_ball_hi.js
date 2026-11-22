// s062 — "You swat it away. The ball hits the floor." [GYM - COURT 2] · catch
import { E, V, registerShot, layer, clamp, prog, slowCam, circle, rr } from '/engine/core.js';
import { drawFigure, POSES, posesAt, walkLocked, exprAt, headPos } from '/engine/rig2d.js';
import { gym } from '../sets/gym.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore } from '/engine/story.js';
registerShot('s062', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gym(g, t, info);
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // ball flies at the teammate's face, hero swats it down
    const bx = E.W * 0.3 + E.W * 0.4 * Math.min(1, t / (D * 0.5));
    const by = GY - 300 + (t < D * 0.5 ? 0 : 260 * prog(t, D * 0.5, D) ** 2);
    circle(g, bx, by, 26, '#e07856');
    const pose = posesAt(t, [[0, 'stand'], [D * 0.25, 'reach'], [D * 0.55, 'holdFront'], [D * 0.8, 'stand']]);
    drawFigure(g, { x: E.W * 0.42, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: pose, expr: exprAt(t, [[0, 'neutral'], [D * 0.25, 'surprised'], [D * 0.55, 'determined'], [D * 0.85, 'smile']]), rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 90.32, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 6 }] });
} });
