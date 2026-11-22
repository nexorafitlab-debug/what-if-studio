// scenes/sets/bus_interior.js — inside a city bus at dusk: windows with the
// passing street outside, seat rows, a pole, the door at the right.
// Fresh set for this video (s115 "You are on the bus" — the bus stop bench
// was the wrong place for that line).
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, poly, text, FONTS } from '/engine/core.js';
import { dust } from '/engine/fx2d.js';

export function busInterior(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.82, CX = E.W / 2;
  // ceiling + upper wall
  fillRect(g, -E.W, 0, E.W * 3, 200, '#241f30');
  circle(g, CX, 70, 22, '#ffe9a8');
  circle(g, CX, 70, 52, 'rgba(255,233,168,0.14)');
  // window band: three big windows, dusk sky + passing houses outside
  fillRect(g, -E.W, 200, E.W * 3, 380, '#2a2438');
  const wins = [[140, 520], [640, 1020], [1140, 1520]];
  for (let i = 0; i < wins.length; i++) {
    const [x0, x1] = wins[i];
    rr(g, x0, 220, x1 - x0, 340, 10); g.fillStyle = '#e07856'; g.fill();
    // sun + house silhouettes sliding slowly past (the bus is moving),
    // clipped to the window so they never paint over the wall
    g.save(); g.beginPath(); g.rect(x0, 220, x1 - x0, 340); g.clip();
    const off = ((t * 60 + i * 260) % 700) - 80;
    circle(g, x0 + 90, 300, 30, '#f2ead8');
    fillRect(g, x0 + off - 60, 420, 130, 140, '#3a2a4a');
    poly(g, [[x0 + off - 70, 420], [x0 + off + 5, 370], [x0 + off + 80, 420]], '#2a1a3a');
    fillRect(g, x0 + off + 190, 450, 110, 110, '#2a2038');
    poly(g, [[x0 + off + 180, 450], [x0 + off + 245, 405], [x0 + off + 310, 450]], '#241a32');
    g.restore();
    // window frame crossbar
    fillRect(g, x0, 380, x1 - x0, 10, '#241f30');
    g.strokeStyle = '#241f30'; g.lineWidth = 12; g.strokeRect(x0, 220, x1 - x0, 340);
  }
  // wall below the windows + floor
  fillRect(g, -E.W, 580, E.W * 3, GY - 580, '#3a3248');
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#1e1a24');
  seg(g, [[-E.W, GY + 60], [E.W * 3, GY + 60]], 4, '#ffd76a');
  // seat rows (backs behind the sitters)
  for (const sx of [120, 700, 1280]) {
    rr(g, sx, GY - 190, 300, 190, 12); g.fillStyle = '#5a4a6a'; g.fill();
    rr(g, sx + 24, GY - 220, 252, 46, 10); g.fillStyle = '#6a5a7a'; g.fill();
  }
  // vertical pole + door at the right (the old man boards through it)
  seg(g, [[1560, 180], [1560, GY]], 10, '#c8c8d0');
  rr(g, 1640, 300, 260, GY - 300, 8); g.fillStyle = '#2a2438'; g.fill();
  g.strokeStyle = '#ffd76a'; g.lineWidth = 4; g.stroke();
  seg(g, [[1770, 300], [1770, GY]], 4, '#8a8a92');
  circle(g, 1670, 700, 8, '#ffd59a');
  dust(g, t, { count: 8, seed: 71 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}
