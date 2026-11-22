// s018 — FREEZE. "But the vision shows the girl behind you —" Time stops: phone mid-air, her hand reaching.
import { E, V, registerShot, layer, ease, prog, clamp, veil } from '/engine/core.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { rooftop } from '../sets/rooftop.js';
import { CAST } from '../cast.js';
import { drawPhone, freezeLabel } from '../_helpers.js';
registerShot('s018', { draw(g, t, info) {
  const cam = { z: 1.1, x: 60, y: 0 };
  // everything frozen at t=0.1 — no breathing, no wind, no fall
  const tf = 0.1;
  layer(g, cam, 1, (g) => {
    const { GY, M } = rooftop(g, tf, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // the girl, arm extended toward the phone
    drawFigure(g, { x: E.W * 0.38, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.GIRL.outfit, pose: POSES.reach, expr: 'determined', rim: { color: M.rim, dir: [1, -1], w: 3 } });
    // Kian, hand still hovering, watching her
    drawFigure(g, { x: E.W * 0.66, y: GY, s: V(1.4, 1.5), facing: -1, outfit: CAST.KIAN.outfit, pose: POSES.holdFront, expr: 'surprised', look: [-0.6, 0], rim });
    // the phone, frozen mid-fall between them
    drawPhone(g, E.W * 0.52, GY - 300, 0.9, 1.4);
    FX.rings(g, E.W * 0.52, GY - 300, t, { count: 2, r0: 40, r1: 160, color: '#9fd8ff', a: 0.4, speed: 0.5 });
  });
  veil(g, '#9fd8ff', 0.05);
  freezeLabel(g, t, { dur: info.dur });
} });
