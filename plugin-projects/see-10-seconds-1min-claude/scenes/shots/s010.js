import { E, V, registerShot, layer, ease, prog } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { exam } from '../sets/exam.js';
import { CAST } from '../cast.js';

function countdownNumber(g, t, info, num, dur) {
  const a = Math.max(0, 1 - Math.abs(t - (info.dur * 0.5)) / (dur * 0.3));
  if (a <= 0) return;
  g.save(); g.globalAlpha *= a;
  g.font = `900 ${V(180, 140)}px "Fredoka"`;
  g.fillStyle = '#f2c21a';
  g.shadowColor = 'rgba(255,160,60,.9)';
  g.shadowBlur = 24;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(String(num), E.W / 2, E.H * 0.35);
  g.restore();
}

registerShot('s010', { draw(g, t, info) {
  const dur = info.dur;
  const cam = { z: 1 + 0.02 * ease.inOut(t / dur), x: -5 * ease.inOut(t / dur) };
  const { GY, M } = exam(g, t, cam);

  layer(g, cam, 1, (g) => {
    // Kian in exam hall - pencil snaps
    const kianX = E.W / 2;
    const kianY = GY - V(80, 100);
    const kianPose = breathe(posesAt(t, [[0, 'think'], [0.3, 'point']]), t);
    drawFigure(g, { x: kianX, y: kianY, s: 1.3, facing: 1, outfit: CAST.KIAN.outfit, pose: kianPose, expr: 'focused',
      rim: { color: M.rim, dir: [0.3, -0.5] } });

    // Gold countdown numbers 2-1
    if (t < dur * 0.5) countdownNumber(g, t, info, 2, dur);
    else countdownNumber(g, t, info, 1, dur);

    // Cool fluorescent ambience
    FX.dust(g, t, { seed: 4, count: 10, color: '#e8e8f0', a: 0.15 });
  });
}});