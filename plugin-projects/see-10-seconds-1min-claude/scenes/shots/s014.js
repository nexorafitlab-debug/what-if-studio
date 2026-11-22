import { E, V, registerShot, layer, ease } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { rooftop } from '../sets/rooftop.js';
import { CAST } from '../cast.js';

registerShot('s014', { draw(g, t, info) {
  const dur = info.dur;
  const cam = { z: 1 + 0.08 * ease.inOut(t / dur), x: 0 };
  const { GY, M } = rooftop(g, t, cam);

  layer(g, cam, 1, (g) => {
    // Kian on rooftop - wind gusts, phone slips
    const kianX = E.W / 2;
    const kianY = GY - V(80, 100);
    const kianPose = breathe(posesAt(t, [[0, 'stand'], [0.5, 'point']]), t);
    drawFigure(g, { x: kianX, y: kianY, s: 1.4, facing: 1, outfit: CAST.KIAN.outfit, pose: kianPose, expr: 'worried',
      rim: { color: M.rim, dir: [1, -0.5] } });

    // Particles hanging in air for freeze moment
    FX.drops(g, t, { seed: 6, count: 80, color: '#ffd700', a: 0.8 });
    FX.dust(g, t, { seed: 6, count: 30, color: '#fff', a: 0.3 });
  });
}});