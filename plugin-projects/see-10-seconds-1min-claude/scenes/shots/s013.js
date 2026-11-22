import { E, V, registerShot, layer, ease } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street } from '../sets/street.js';
import { CAST } from '../cast.js';

registerShot('s013', { draw(g, t, info) {
  const dur = info.dur;
  const cam = { z: 1 + 0.06 * ease.inOut(t / dur), x: -60 * ease.inOut(t / dur) };
  const { GY, M } = street(g, t, cam);

  layer(g, cam, 1, (g) => {
    // Kian strides onto bus; crowd surges behind
    const kianX = E.W / 2 - 360 + t * 70;
    const kianPose = walkPose(t * 9, { stride: 26, lift: 12, arm: 16 });
    drawFigure(g, { x: kianX, y: GY, s: 1.5, facing: 1, outfit: CAST.KIAN.outfit, pose: kianPose, expr: 'determined',
      rim: { color: M.rim, dir: [0.8, -0.5] } });

    // Crowd behind
    for (let i = 0; i < 5; i++) {
      const wx = E.W / 2 + 200 + i * 80 + t * 30;
      const wPhase = t * 8 + wx;
      const wp = walkPose(wPhase, { stride: 22, lift: 10, arm: 14 });
      drawFigure(g, { x: wx, y: GY, s: 1.2, facing: 1, outfit: { top: 'jacket', color: '#3a3a48', legs: '#1c1c28' },
        pose: wp, expr: 'neutral', dim: true, rim: { color: M.rim, dir: [-0.6, -0.5] } });
    }

    FX.dust(g, t, { seed: 5, count: 60, color: '#ffe9d2', a: 0.3 });
  });
}});