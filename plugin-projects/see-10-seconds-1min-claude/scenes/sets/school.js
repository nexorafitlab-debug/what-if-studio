import { E, V, mood, layer, backdrop, seg, circle, linGrad, shade, alpha, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export function school(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = E.H * V(0.8, 0.68), CX = E.W / 2;

  // Sky and daylight
  layer(g, cam, 0.1, (g) => {
    backdrop(g, M.sky);
    // Sunlight from windows
    FX.sun(g, CX - V(300, 200), GY - V(350, 600), 40, '#fff8dc', M.key, 4);
    FX.clouds(g, { y: GY - V(500, 900), h: 180, color: '#ffe5c7', a: 0.1, seed: 2 });
  });

  // Walls
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = shade(M.wall, -0.15);
    g.fillRect(-E.W, GY - V(100, 200), E.W * 3, GY - top + 4);
    // Lockers
    for (const x of [-E.W + V(100, 200), 0, E.W - V(200, 300)]) {
      g.fillStyle = shade(M.practical, 0.1);
      g.fillRect(x, GY - V(300, 400), V(150, 250), V(300, 400));
    }
  });

  // Floor
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 300, [shade(M.floor, -0.05), M.dark]);
    g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
  });

  // Foreground: lockers, fountain
  layer(g, cam, 1.1, (g) => {
    g.fillStyle = '#2a2230';
    g.fillRect(CX - V(150, 200), GY - V(50, 80), 300, V(40, 60));
    g.fillStyle = '#1a1a2a';
    g.beginPath();
    g.ellipse(CX - V(60, 80), GY - V(30, 50), 40, 40, 0, 0, Math.PI * 2);
    g.fill();
  });

  return { GY, CX, M };
}