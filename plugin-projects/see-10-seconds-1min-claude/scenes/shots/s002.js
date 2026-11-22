import { E, V, registerShot, layer, ease } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { school } from '../sets/school.js';
import { CAST } from '../cast.js';

registerShot('s002', { draw(g, t, info) {
  const dur = info.dur;
  const cam = { z: 1 + 0.03 * ease.inOut(t / dur), x: -10 * ease.inOut(t / dur) };
  const { GY, M } = school(g, t, cam);

  layer(g, cam, 1, (g) => {
    // Kian in school hallway - medium two-shot
    const kianX = E.W / 2 - V(80, 120);
    const kianY = GY - V(40, 60);
    const kianPose = breathe(posesAt(t, [[0, 'stand'], [0.3, 'point']]), t);
    drawFigure(g, { x: kianX, y: kianY, s: 1.4, facing: 1, outfit: CAST.KIAN.outfit, pose: kianPose, expr: 'neutral',
      rim: { color: M.rim, dir: [0.5, -0.3] } });

    // Gold countdown word labels appear timed to speech
    // Environment only; text composited in post

    // Subtle dust motes in hallway air
    FX.dust(g, t, { seed: 2, count: 15, color: '#ffe5c7', a: 0.2 });
  });
}});