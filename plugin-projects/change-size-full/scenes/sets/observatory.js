// scenes/sets/observatory.js — the old observatory at midnight. Fresh set:
// a domed hilltop observatory, a big telescope through the slit, a winding
// path, stars everywhere, a crescent moon. The final CTA happens here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, poly, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, stars, moon, hills } from '/engine/fx2d.js';

export function observatory(g, t, info, params = {}) {
  const m = mood('night');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#05070d', '#0a1024'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  stars(g, t, { count: 160, seed: 137, area: [0, 0, E.W, E.H * 0.7] });
  moon(g, E.W * 0.16, E.H * 0.16, 44);
  hills(g, { seed: 139, y: GY, amp: 60, color: '#101828' });
  // the observatory dome (centre)
  fillRect(g, E.W * 0.34, GY - 260, E.W * 0.32, 260, '#2a2238');
  g.fillStyle = '#3a2a44';
  g.beginPath(); g.arc(E.W * 0.50, GY - 260, E.W * 0.16, Math.PI, 0); g.fill();
  // the slit with the telescope poking out, glowing
  fillRect(g, E.W * 0.47, GY - 420, 60, 200, '#0a0e1e');
  seg(g, [[E.W * 0.50, GY - 380], [E.W * 0.56, GY - 500]], 16, '#8a8a9a');
  circle(g, E.W * 0.56, GY - 500, 18, '#9fd8ff');
  // a warm lit door
  rr(g, E.W * 0.47, GY - 120, 60, 120, 6); g.fillStyle = '#ffcf8a'; g.fill();
  // winding path down the hill
  g.strokeStyle = '#6a5a6a'; g.lineWidth = 26; g.lineCap = 'round';
  g.beginPath(); g.moveTo(E.W * 0.50, GY); g.quadraticCurveTo(E.W * 0.44, GY + 80, E.W * 0.38, GY + 140); g.stroke();
  // a pine on the left
  seg(g, [[E.W * 0.14, GY + 40], [E.W * 0.14, GY - 120]], 12, '#1c1626');
  poly(g, [[E.W * 0.14, GY - 260], [E.W * 0.14 + 70, GY - 60], [E.W * 0.14 - 70, GY - 60]], '#16241c');
  dust(g, t, { count: 8, seed: 141 });
  veil(g, '#000', 0.06);
  return { GY, CX, M: m, dome: { x: E.W * 0.50, y: GY - 260 } };
}
