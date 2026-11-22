// scenes/sets/cafeteria.js — school cafeteria: serving counter, long tables, hanging lamps.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg } from '/engine/core.js';
import { dust, counter } from '/engine/fx2d.js';

export function cafeteria(g, t, info, params = {}) {
  const m = mood('interiorWarm');
  const GY = E.H * 0.8, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  // big windows on the back wall (left)
  for (const x of [E.W * 0.06, E.W * 0.3]) {
    rr(g, x, 120, 300, 260, 8); g.fillStyle = '#ffd9a0'; g.fill();
    g.strokeStyle = '#2a2238'; g.lineWidth = 8; g.strokeRect(x, 120, 300, 260);
    seg(g, [[x + 150, 120], [x + 150, 380]], 6, '#2a2238');
    seg(g, [[x, 250], [x + 300, 250]], 6, '#2a2238');
  }
  // menu board (right)
  rr(g, E.W * 0.62, 120, 560, 200, 8); g.fillStyle = '#241a30'; g.fill();
  g.strokeStyle = '#ffd76a'; g.lineWidth = 3; g.strokeRect(E.W * 0.62, 120, 560, 200);
  // serving counter across the back
  counter(g, { x: E.W * 0.06, y: GY - 40, w: E.W * 0.88, h: 110, color: '#3a2a37', top: '#5a4a52', doors: 10 });
  // food trays lined on the counter
  for (let i = 0; i < 5; i++) {
    const x = E.W * 0.12 + i * 300;
    rr(g, x, GY - 176, 200, 22, 8); g.fillStyle = '#c8b898'; g.fill();
    circle(g, x + 50, GY - 186, 14, '#e8a04a'); circle(g, x + 110, GY - 188, 12, '#7ac74a'); circle(g, x + 160, GY - 186, 11, '#e8e4f4');
  }
  // long tables with benches (foreground)
  const table = (x, y, w) => {
    rr(g, x, y, w, 26, 10); g.fillStyle = '#6a4a3a'; g.fill();
    seg(g, [[x + 30, y + 26], [x + 30, y + 90]], 10, '#3a2a2a');
    seg(g, [[x + w - 30, y + 26], [x + w - 30, y + 90]], 10, '#3a2a2a');
    rr(g, x - 20, y + 96, w + 40, 18, 8); g.fillStyle = '#4a3a34'; g.fill();
  };
  table(E.W * 0.08, GY - 50, 640);
  table(E.W * 0.58, GY - 20, 640);
  // hanging lamps
  for (const x of [E.W * 0.25, E.W * 0.5, E.W * 0.75]) {
    seg(g, [[x, 0], [x, 110]], 4, '#241a30');
    circle(g, x, 130, 26, '#ffcf8a');
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,213,154,0.10)';
    g.beginPath(); g.arc(x, 130, 110, 0, Math.PI * 2); g.fill(); g.restore();
  }
  dust(g, t, { count: 18, seed: 33 });
  veil(g, '#000', 0.07);
  return { GY, CX, M: m };
}
