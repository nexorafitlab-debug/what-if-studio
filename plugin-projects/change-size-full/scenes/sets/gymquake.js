// scenes/sets/gymquake.js — the school gym AFTER the earthquake. Fresh set:
// a fallen steel beam across the floor, rubble, a cracked floor, a tilted
// basketball hoop, dust in the air, a bent strut. The rescue happens here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, poly, fillRect, seg, text, FONTS, shake } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';
import { drawBeam } from '../_helpers.js';

export function gymquake(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  const sh = params.shake ? shake(t, 6, 1.6, 7) : [0, 0];
  g.save(); g.translate(sh[0], sh[1]);
  backdrop(g, ['#2a2438', '#1a1622'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#3a3244');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#241e2a');
  // cracked floor
  g.strokeStyle = 'rgba(0,0,0,0.6)'; g.lineWidth = 5;
  g.beginPath(); g.moveTo(E.W * 0.30, GY + 10); g.lineTo(E.W * 0.42, GY + 80); g.lineTo(E.W * 0.38, GY + 150); g.stroke();
  g.beginPath(); g.moveTo(E.W * 0.62, GY + 20); g.lineTo(E.W * 0.58, GY + 100); g.lineTo(E.W * 0.70, GY + 170); g.stroke();
  // tilted hoop (left, hanging crooked)
  rr(g, E.W * 0.06, 150, 170, 130, 6); g.fillStyle = '#f2ead8'; g.fill();
  g.save(); g.translate(E.W * 0.145, 300); g.rotate(0.35);
  g.strokeStyle = '#e07856'; g.lineWidth = 7; g.beginPath(); g.arc(0, 0, 40, 0, Math.PI * 2); g.stroke(); g.restore();
  // the FALLEN steel beam (centre) — drawn by the helper, resting on rubble
  // params.hideBeam: the shot draws its own falling beam; params.beamRot: tilt it
  if (!params.hideBeam) drawBeam(g, E.W * 0.50, GY - 60, 760, 0.06 + (params.beamRot || 0));
  // rubble piles under the beam
  for (const [rx, ry, rw] of [[0.24, GY + 10, 120], [0.34, GY + 24, 90], [0.66, GY + 16, 110], [0.76, GY + 6, 80]]) {
    poly(g, [[E.W * rx, ry], [E.W * rx + rw / 2, ry - 46], [E.W * rx + rw, ry]], '#4a3a44');
  }
  // the bent strut the beam rests on (right end) + the ONE pin
  seg(g, [[E.W * 0.84, GY], [E.W * 0.80, GY - 150]], 14, '#6a6a78');
  circle(g, E.W * 0.80, GY - 150, 12, '#ffd76a');
  // a fallen ceiling panel + dust
  rr(g, E.W * 0.12, GY + 90, 220, 26, 4); g.fillStyle = '#5a4a5a'; g.fill();
  dust(g, t, { count: 34, seed: 121 });
  veil(g, '#000', 0.12);
  g.restore();
  return { GY, CX, M: m, beam: { x: E.W * 0.50, y: GY - 60, len: 760 }, pin: { x: E.W * 0.80, y: GY - 150 } };
}
