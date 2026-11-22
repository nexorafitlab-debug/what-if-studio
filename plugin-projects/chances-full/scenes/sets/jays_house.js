// scenes/sets/jays_house.js — Jay's house front at dusk: porch, front door,
// steps, path, tree, warm window light. Fresh set for this video.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, poly, text, FONTS } from '/engine/core.js';
import { stars, dust } from '/engine/fx2d.js';

export function jaysHouse(g, t, info, params = {}) {
  const m = mood('dusk');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, ['#1e1430', '#5a3a6a', '#e07856'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  stars(g, t, { count: 50, seed: 11, area: [0, 0, E.W, E.H * 0.3] });
  circle(g, E.W * 0.85, E.H * 0.14, 34, '#f2ead8');
  // house body
  fillRect(g, E.W * 0.22, GY - 330, E.W * 0.56, 330, '#7a5a6a');
  poly(g, [[E.W * 0.18, GY - 330], [E.W * 0.5, GY - 430], [E.W * 0.82, GY - 330]], '#4a2a3a');
  // warm windows
  rr(g, E.W * 0.28, GY - 280, 110, 130, 6); g.fillStyle = '#ffd76a'; g.fill();
  seg(g, [[E.W * 0.28 + 55, GY - 280], [E.W * 0.28 + 55, GY - 150]], 4, '#7a5a6a');
  rr(g, E.W * 0.62, GY - 280, 110, 130, 6); g.fillStyle = '#2a3648'; g.fill();
  // porch + front door (centre)
  fillRect(g, E.W * 0.4, GY - 60, E.W * 0.2, 60, '#5a4a3a');
  rr(g, CX - 70, GY - 250, 140, 250, 8); g.fillStyle = '#2a4a3a'; g.fill();
  g.strokeStyle = '#ffd76a'; g.lineWidth = 4; g.stroke();
  circle(g, CX + 44, GY - 130, 9, '#ffd59a');
  // porch light above the door
  circle(g, CX, GY - 282, 14, '#ffe9a8');
  circle(g, CX, GY - 282, 34, 'rgba(255,233,168,0.2)');
  // steps + path
  fillRect(g, CX - 110, GY, 220, 22, '#8a8a92');
  fillRect(g, CX - 90, GY + 22, 180, 20, '#7a7a82');
  fillRect(g, CX - 60, GY + 42, 120, E.H - GY - 42, '#9a8a72');
  // lawn + tree (left)
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#2a4a2a');
  fillRect(g, CX - 60, GY + 42, 120, E.H - GY - 42, '#9a8a72');
  seg(g, [[E.W * 0.1, GY], [E.W * 0.1, GY - 200]], 14, '#4a2a1a');
  circle(g, E.W * 0.1, GY - 240, 70, '#2a5a2a');
  circle(g, E.W * 0.1 - 50, GY - 196, 48, '#3a6a3a');
  circle(g, E.W * 0.1 + 50, GY - 196, 48, '#1e4a1e');
  // bike leaning by the porch (right) — a real bicycle: two spoked wheels,
  // frame triangle, fork, handlebars, seat and crank, not a line + circles
  const bx = E.W * 0.79, by = GY - 34, br = 34; // rear-wheel centre / radius
  const fx = E.W * 0.90, fy = GY - 34;           // front-wheel centre
  const seat = [bx + 18, GY - 118], head = [fx - 22, GY - 100], crank = [bx + 52, GY - 40];
  g.strokeStyle = '#d8d8e0'; g.lineWidth = 5;
  for (const [wx, wy] of [[bx, by], [fx, fy]]) {
    g.beginPath(); g.arc(wx, wy, br, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 2; g.strokeStyle = 'rgba(216,216,224,0.5)';
    seg(g, [[wx - br, wy], [wx + br, wy]], 2, 'rgba(216,216,224,0.5)');
    seg(g, [[wx, wy - br], [wx, wy + br]], 2, 'rgba(216,216,224,0.5)');
    g.lineWidth = 5; g.strokeStyle = '#d8d8e0';
  }
  g.strokeStyle = '#e07856'; g.lineWidth = 6; // warm red frame
  seg(g, [[bx, by], crank], 6, '#e07856');            // chain stay
  seg(g, [[bx, by], seat], 6, '#e07856');             // seat stay
  seg(g, [seat, head], 6, '#e07856');                 // top tube
  seg(g, [head, crank], 6, '#e07856');                // down tube
  seg(g, [head, [fx, fy]], 5, '#d8d8e0');             // fork
  seg(g, [[head[0] - 16, head[1] - 18], [head[0] + 14, head[1] - 6]], 5, '#d8d8e0'); // handlebars
  seg(g, [[seat[0] - 16, seat[1] - 4], [seat[0] + 16, seat[1] - 4]], 5, '#2a2a34');   // saddle
  circle(g, crank[0], crank[1], 10, '#d8d8e0');
  seg(g, [[crank[0], crank[1]], [crank[0] - 16, crank[1] + 18]], 4, '#d8d8e0');      // pedal crank
  dust(g, t, { count: 10, seed: 61 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m };
}
