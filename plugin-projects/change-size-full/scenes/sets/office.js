// scenes/sets/office.js — Mr. Vane's talent office / stage. Fresh set:
// posters of giant stars on the wall, a stage with a spotlight, a desk with
// a contract. Vane makes his offer here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, lightCone } from '/engine/fx2d.js';
import { glow } from '/engine/core.js';

export function office(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, ['#1a1424', '#241a30'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, '#2a2238');
  fillRect(g, -E.W, GY, E.W * 3, E.H, '#1a1424');
  // posters on the wall (three star posters)
  const posters = [
    { x: E.W * 0.06, c: '#c94a3a', label: 'THE GIANT' },
    { x: E.W * 0.30, c: '#3a7ae0', label: 'TINY TIM' },
    { x: E.W * 0.54, c: '#e8b23a', label: 'MEGA KID' },
  ];
  for (const p of posters) {
    rr(g, p.x, 120, 260, 380, 8); g.fillStyle = p.c; g.fill();
    g.strokeStyle = '#f2ead8'; g.lineWidth = 4; g.stroke();
    circle(g, p.x + 130, 260, 62, '#1a1622');
    circle(g, p.x + 108, 252, 6, '#f2ead8'); circle(g, p.x + 152, 252, 6, '#f2ead8');
    text(g, p.label, p.x + 130, 440, { size: 30, color: '#f2ead8', font: FONTS.ui, weight: 900 });
  }
  // stage platform (right) with a spotlight cone
  rr(g, E.W * 0.78, GY - 90, 380, 90, 8); g.fillStyle = '#3a2a44'; g.fill();
  lightCone(g, E.W * 0.97, 60, { angle: Math.PI / 2 + 0.3, spread: 0.5, len: 800, color: '#ffe2a8', a: 0.16 });
  // desk (left-centre) with a contract stack
  rr(g, E.W * 0.30, GY - 110, 360, 110, 8); g.fillStyle = '#5a3a2a'; g.fill();
  rr(g, E.W * 0.38, GY - 150, 130, 40, 3); g.fillStyle = '#f2ead8'; g.fill();
  g.strokeStyle = '#3a3a48'; g.lineWidth = 3;
  for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(E.W * 0.40, GY - 140 + i * 11); g.lineTo(E.W * 0.48, GY - 140 + i * 11); g.stroke(); }
  dust(g, t, { count: 10, seed: 115 });
  veil(g, '#000', 0.08);
  return { GY, CX, M: m, stage: { x: E.W * 0.78, y: GY - 90 }, desk: { x: E.W * 0.30, y: GY - 110 } };
}
