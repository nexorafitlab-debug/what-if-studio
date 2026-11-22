import { E, V, registerShot, layer, ease, prog } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { cafeteria } from '../sets/cafeteria.js';
import { CAST } from '../cast.js';

registerShot('s009', { draw(g, t, info) {
  const dur = info.dur;
  const cam = { z: 1 + 0.05 * ease.inOut(t / dur), x: -15 * ease.inOut(t / dur) };
  const { GY, M } = cafeteria(g, t, cam);

  layer(g, cam, 1, (g) => {
    // Kian's hand catches tray; gold '3' freezes
    const kianX = E.W / 2 + V(100, 160);
    const kianY = GY - V(60, 90);
    const kianPose = breathe(posesAt(t, [[0, 'reach'], [0.5, 'point']]), t);
    drawFigure(g, { x: kianX, y: kianY, s: 1.5, facing: -1, outfit: CAST.KIAN.outfit, pose: kianPose, expr: 'worried',
      rim: { color: M.rim, dir: [0.8, -0.5] } });

    // Freeze gold '3' above
    g.save();
    const a = Math.max(0, 1 - Math.max(0, t - dur * 0.5) / (dur * 0.3));
    g.globalAlpha *= a;
    g.font = `900 ${V(180, 140)}px "Fredoka"`;
    g.fillStyle = '#f2c21a';
    g.shadowColor = 'rgba(255,160,60,.9)';
    g.shadowBlur = 24;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('3', E.W / 2, E.H * 0.35);
    g.restore();

    // Foreground: blurred lunch crowd
    FX.dust(g, t, { seed: 3, count: 40, color: '#ffe9d2', a: 0.25 });
  });
}});