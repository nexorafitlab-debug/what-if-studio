import { E, V, registerShot, layer, ease } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street } from '../sets/street.js';
import { CAST } from '../cast.js';

registerShot('s012', { draw(g, t, info) {
  const dur = info.dur;
  const cam = { z: 1 + 0.06 * ease.inOut(t / dur), x: -60 * ease.inOut(t / dur) };
  const { GY, M } = street(g, t, cam);

  layer(g, cam, 1, (g) => {
    // Kian stepping onto bus as it brakes
    const kianX = E.W / 2 - 360 + t * 70;
    const kianPose = walkPose(t * 9, { stride: 26, lift: 12, arm: 16 });
    drawFigure(g, { x: kianX, y: GY, s: 1.5, facing: 1, outfit: CAST.KIAN.outfit, pose: kianPose, expr: 'determined',
      rim: { color: M.rim, dir: [0.8, -0.5] } });

    // Dust from street traffic
    FX.dust(g, t, { seed: 5, count: 50, color: '#ffe9d2', a: 0.2 });
  });
}});