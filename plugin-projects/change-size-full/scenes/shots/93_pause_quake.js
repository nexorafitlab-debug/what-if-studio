import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { gymquake } from '../sets/gymquake.js';
registerShot('s093', { draw(g, t, info) {
  // MUSIC-ONLY pause before the earthquake (no voice line in this shot)
  // the gym trembles slightly; dust hangs in the air
  layer(g, { z: 1 }, 1, (g) => { gymquake(g, t, info, { shake: true }); });
  const a = clamp(prog(t, 0.4, 1.0)) * (1 - clamp(prog(t, info.dur - 0.6, info.dur)));
  text(g, 'THEN THE GROUND MOVES', E.W / 2, E.H * 0.42, { size: V(72, 78), color: '#e07856', glow: 26, glowColor: 'rgba(224,120,86,0.5)', spacing: 4, alpha: a });
} });
