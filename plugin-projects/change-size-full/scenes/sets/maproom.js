// scenes/sets/maproom.js — geography room with a GIANT wall map. Fresh set:
// huge wall map with continents + mountain range, a map TABLE in the centre,
// globe on a stand, atlases on a shelf. Tiny Noah walks across the map here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, windowFrame, floorLines, clouds } from '/engine/fx2d.js';
import { drawWallMap } from '../_helpers.js';

export function maproom(g, t, info, params = {}) {
  const m = mood('interiorWarm');
  const GY = E.H * 0.84, CX = E.W / 2;
  backdrop(g, m.sky, [-E.W, -E.H, E.W * 3, E.H * 3]);
  fillRect(g, -E.W, 0, E.W * 3, GY, m.wall);
  fillRect(g, -E.W, GY, E.W * 3, E.H, m.floor);
  floorLines(g, GY + 6, E.H);
  // the GIANT wall map (left-centre)
  drawWallMap(g, E.W * 0.06, 110, 900, 480);
  // window (right) with daylight
  windowFrame(g, { x: E.W * 0.76, y: E.H * 0.12, w: 340, h: 300, mullions: [0.5, 0.5] }, (gg2) => {
    gg2.fillStyle = '#cfe8ff'; gg2.fillRect(0, 0, 340, 300);
  });
  clouds(g, { seed: 93, count: 3, y: E.H * 0.14, h: 60, color: '#ffffff', a: 0.25 });
  // map TABLE (centre) — a flat paper map Noah walks across when tiny
  rr(g, E.W * 0.34, GY - 90, 620, 90, 8); g.fillStyle = '#6a4a2a'; g.fill();
  seg(g, [[E.W * 0.37, GY], [E.W * 0.37, GY + 90]], 10, '#4a2a1a');
  seg(g, [[E.W * 0.90, GY], [E.W * 0.90, GY + 90]], 10, '#4a2a1a');
  rr(g, E.W * 0.36, GY - 118, 580, 30, 4); g.fillStyle = '#d8c49a'; g.fill();
  g.fillStyle = '#7ac74a';
  g.beginPath(); g.ellipse(E.W * 0.52, GY - 103, 90, 12, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(E.W * 0.78, GY - 103, 70, 10, 0, 0, Math.PI * 2); g.fill();
  // globe on a stand (right)
  circle(g, E.W * 0.68, GY - 210, 52, '#5a9ac9');
  g.fillStyle = '#7ac74a';
  g.beginPath(); g.ellipse(E.W * 0.68, GY - 220, 26, 16, 0.4, 0, Math.PI * 2); g.fill();
  seg(g, [[E.W * 0.68, GY - 158], [E.W * 0.68, GY - 60]], 8, '#8a6a3a');
  // atlas shelf (left, under the map)
  rr(g, E.W * 0.06, GY - 60, 300, 16, 4); g.fillStyle = '#5a3a2a'; g.fill();
  for (let i = 0; i < 5; i++) { rr(g, E.W * 0.08 + i * 56, GY - 116, 44, 56, 3); g.fillStyle = ['#e07856', '#4a9a6a', '#5a7ac9', '#c9a44a', '#7a5ac9'][i]; g.fill(); }
  dust(g, t, { count: 12, seed: 95 });
  veil(g, '#000', 0.05);
  return { GY, CX, M: m, mapTable: { x: E.W * 0.36, y: GY - 118, w: 580 }, wallMap: { x: E.W * 0.06, y: 110, w: 900, h: 480 } };
}
