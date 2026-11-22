import { E, V, registerShot, layer, ease, prog } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { exam } from '../sets/exam.js';
import { CAST } from '../cast.js';

registerShot('s011', { draw(g, t, info) {
  const dur = info.dur;
  const cam = { z: 1 + 0.02 * ease.inOut(t / dur), x: -5 * ease.inOut(t / dur) };
  const { GY, M } = exam(g, t, cam);

  layer(g, cam, 1, (g) => {
    // Kian in exam hall - spare appears
    const kianX = E.W / 2;
    const kianY = GY - V(80, 100);
    const kianPose = breathe(posesAt(t, [[0, 'think'], [0.5, 'point']]), t);
    drawFigure(g, { x: kianX, y: kianY, s: 1.3, facing: 1, outfit: CAST.KIAN.outfit, pose: kianPose, expr: 'focused',
      rim: { color: M.rim, dir: [0.3, -0.5] } });

    // Cool fluorescent ambience
    FX.dust(g, t, { seed: 4, count: 10, color: '#e8e8f0', a: 0.15 });
  });
}});