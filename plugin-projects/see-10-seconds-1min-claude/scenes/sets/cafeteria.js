import { E, V, mood, layer, backdrop, seg, circle, linGrad, shade, alpha, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export function cafeteria(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = E.H * V(0.8, 0.68), CX = E.W / 2;

  // Sky and daylight
  layer(g, cam, 0.1, (g) => {
    backdrop(g, M.sky);
    FX.sun(g, CX - V(200, 100), GY - V(250, 450), 30, '#fff8dc', M.key, 3);
  });

  // Walls
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = shade(M.wall, -0.15);
    g.fillRect(-E.W, GY - V(80, 150), E.W * 3, GY - top + 4);
    // Food service counter
    g.fillStyle = shade(M.practical, 0.2);
    g.fillRect(CX - V(400, 500), GY - V(150, 250), 800, V(120, 180));
  });

  // Floor
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 300, [shade(M.floor, -0.05), M.dark]);
    g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
  });

  // Foreground: counter, trays
  layer(g, cam, 1.1, (g) => {
    g.fillStyle = '#2a2230';
    g.fillRect(CX - V(300, 400), GY - V(30, 50), 600, V(20, 30));
    // Vending machines
    for (const x of [-E.W + V(200, 300), 0, E.W - V(200, 300)]) {
      g.fillStyle = '#3a3a48';
      g.fillRect(x - V(80, 100), GY - V(100, 130), 160, V(100, 120));
    }
    // Trays stacking
    for (const y of [GY - V(20, 30), GY - V(50, 60)]) {
      g.fillStyle = '#e8d5c7';
      g.fillRect(CX - V(100, 120), y, 200, V(15, 20));
    }
  });

  return { GY, CX, M };
}