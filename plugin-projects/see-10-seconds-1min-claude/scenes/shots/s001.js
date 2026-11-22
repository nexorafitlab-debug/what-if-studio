import { E, V, registerShot, layer, ease } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { bedroom } from '../sets/bedroom.js';
import { CAST } from '../cast.js';

registerShot('s001', { draw(g, t, info) {
  const dur = info.dur;
  const cam = { z: 1 + 0.06 * ease.inOut(t / dur), x: -20 * ease.inOut(t / dur) };
  const { GY, M } = bedroom(g, t, cam);

  layer(g, cam, 1, (g) => {
    // Kian in bed, lying down
    const kianX = E.W / 2;
    const kianY = GY - V(120, 80);
    const kianPose = breathe(posesAt(t, [[0, 'relaxed'], [0.5, 'point']]), t);
    drawFigure(g, { x: kianX, y: kianY, s: 1.2, facing: 1, outfit: CAST.KIAN.outfit, pose: kianPose, expr: 'neutral',
      rim: { color: M.rim, dir: [-0.3, -0.5] } });

    // Countdown numbers will appear as on-screen gold text (composited later)
    // Just set up the environment

    // Fan above the bed - subtle dust particles
    FX.dust(g, t, { seed: 1, count: 20, color: '#ffe9d2', a: 0.3 });
  });
}});