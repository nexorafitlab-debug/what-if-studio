import { E, V, registerShot, layer, ease } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { rooftop } from '../sets/rooftop.js';
import { CAST } from '../cast.js';

registerShot('s016', { draw(g, t, info) {
  const dur = info.dur;
  const cam = { z: 1 + 0.08 * ease.inOut(t / dur), x: 0 };
  const { GY, M } = rooftop(g, t, cam);

  layer(g, cam, 1, (g) => {
    // Kian on rooftop - considering catching, vision shows girl behind reaching
    const kianX = E.W / 2;
    const kianY = GY - V(80, 100);
    const kianPose = breathe(posesAt(t, [[0, 'stand'], [0.5, 'point']]), t);
    drawFigure(g, { x: kianX, y: kianY, s: 1.4, facing: 1, outfit: CAST.KIAN.outfit, pose: kianPose, expr: 'worried',
      rim: { color: M.rim, dir: [1, -0.5] } });

    // Girl silhouette behind Kian, reaching out
    g.save();
    g.globalAlpha = 0.7;
    g.fillStyle = '#666';
    g.strokeStyle = '#666';
    g.beginPath();
    g.ellipse(E.W / 2 + 100, GY - 120, 40, 60, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();

    // Falling object trail
    FX.drops(g, t, { seed: 7, count: 50, color: '#ffd700', a: 0.5 });
  });
}});