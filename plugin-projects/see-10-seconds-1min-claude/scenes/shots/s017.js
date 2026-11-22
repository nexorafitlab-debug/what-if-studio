import { E, V, registerShot, layer, ease, prog } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { rooftop } from '../sets/rooftop.js';
import { CAST } from '../cast.js';

registerShot('s017', { draw(g, t, info) {
  const dur = info.dur;
  const cam = { z: 1 + 0.08 * ease.inOut(t / dur), x: 0 };
  const { GY, M } = rooftop(g, t, cam);

  layer(g, cam, 1, (g) => {
    // The girl catches the falling object and smiles
    const girlX = E.W / 2 + 80;
    const girlY = GY - V(80, 100);
    drawFigure(g, { x: girlX, y: girlY, s: 1.3, facing: -1, outfit: { top: 'jacket', color: '#3a3a48', legs: '#1c1c28' },
      pose: POSES.cheer, expr: 'smile', rim: { color: M.rim, dir: [0.8, -0.5] } });

    // Kian watches, surprised
    const kianX = E.W / 2;
    const kianY = GY - V(80, 100);
    drawFigure(g, { x: kianX, y: kianY, s: 1.4, facing: 1, outfit: CAST.KIAN.outfit, pose: breathe(posesAt(t, [[0, 'stand'], [0.5, 'point']]), t), expr: 'surprised',
      rim: { color: M.rim, dir: [1, -0.5] } });

    // Celebration particles
    FX.drops(g, t, { seed: 8, count: 60, color: '#f2c21a', a: 0.8 });
  });
}});