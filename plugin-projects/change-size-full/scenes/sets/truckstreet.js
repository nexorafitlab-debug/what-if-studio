// scenes/sets/truckstreet.js — a sunny street with a big delivery truck.
// Fresh set: the truck in the middle of the road, houses, a sidewalk where
// Mia stands, clouds. Giant Noah pushes the truck here.
import { E, V, mood, backdrop, alpha, veil, circle, rr, fillRect, seg, text, FONTS } from '/engine/core.js';
import { dust, facade, floorLines, clouds } from '/engine/fx2d.js';
import { drawTruck } from '../_helpers.js';

export function truckstreet(g, t, info, params = {}) {
  const m = mood('interiorCool');
  const GY = E.H * 0.82, CX = E.W / 2;
  backdrop(g, ['#bfe0ff', '#8fc4ef'], [-E.W, -E.H, E.W * 3, E.H * 3]);
  clouds(g, { seed: 105, count: 4, y: E.H * 0.10, h: 80, color: '#ffffff', a: 0.35 });
  facade(g, { x: -E.W * 0.08, y: GY, w: 560, h: 380, color: '#4a3a5a', win: '#ffcf8a', lit: 0.4, cols: 3, rows: 2, seed: 106 });
  facade(g, { x: E.W * 0.78, y: GY, w: 560, h: 400, color: '#3a4a5a', win: '#ffcf8a', lit: 0.4, cols: 3, rows: 2, seed: 107 });
  // road + sidewalk
  fillRect(g, -E.W, GY, E.W * 3, E.H - GY, '#3a3a44');
  fillRect(g, -E.W, GY - 14, E.W * 3, 14, '#8a8a92');
  g.strokeStyle = '#f2ead8'; g.lineWidth = 6; g.setLineDash([40, 40]);
  g.beginPath(); g.moveTo(-E.W, GY + 90); g.lineTo(E.W * 2, GY + 90); g.stroke();
  g.setLineDash([]);
  // the TRUCK (centre), drawn by the helper — params.truckPush rolls it
  drawTruck(g, E.W * 0.52 + (params.truckPush || 0), GY + 6, 1.0, 1);
  dust(g, t, { count: 10, seed: 108 });
  veil(g, '#000', 0.04);
  return { GY, CX, M: m, truck: { x: E.W * 0.52, y: GY } };
}
