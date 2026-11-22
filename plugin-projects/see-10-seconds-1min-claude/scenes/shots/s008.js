import { E, V, registerShot, layer, ease, prog } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { cafeteria } from '../sets/cafeteria.js';
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

registerShot('s008', { draw(g, t, info) {
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

    // Gold countdown numbers 5-4-3 bloom above the tray
    const countdownPhase = Math.floor(t / 0.7) % 3;
    if (countdownPhase === 0) countdownNumber(g, t, info, 5, dur);
    else if (countdownPhase === 1) countdownNumber(g, t, info, 4, dur);
    else if (countdownPhase === 2) countdownNumber(g, t, info, 3, dur);

    // Foreground: blurred lunch crowd
    FX.dust(g, t, { seed: 3, count: 40, color: '#ffe9d2', a: 0.25 });
  });
}});