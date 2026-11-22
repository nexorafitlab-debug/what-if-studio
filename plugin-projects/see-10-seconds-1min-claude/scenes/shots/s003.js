import { E, V, registerShot, layer, ease } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { cafeteria } from '../sets/cafeteria.js';
import { CAST } from '../cast.js';

registerShot('s003', { draw(g, t, info) {
  const dur = info.dur;
  const cam = { z: 1 + 0.05 * ease.inOut(t / dur), x: -15 * ease.inOut(t / dur) };
  const { GY, M } = cafeteria(g, t, cam);

  layer(g, cam, 1, (g) => {
    // Kian in cafeteria - reaching for tray
    const kianX = E.W / 2 + V(100, 160);
    const kianY = GY - V(60, 90);
    const kianPose = breathe(posesAt(t, [[0, 'reach'], [0.4, 'point']]), t);
    drawFigure(g, { x: kianX, y: kianY, s: 1.5, facing: -1, outfit: CAST.KIAN.outfit, pose: kianPose, expr: 'worried',
      rim: { color: M.rim, dir: [0.8, -0.5] } });

    // Gold countdown numbers 5-4-3 bloom above the tray (on-screen text in final)
    // Environment only

    // Foreground: blurred lunch crowd
    FX.dust(g, t, { seed: 3, count: 40, color: '#ffe9d2', a: 0.25 });
  });
}});