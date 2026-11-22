import { E, V, mood, layer, backdrop, seg, circle, linGrad, shade, alpha, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export function exam(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorCool'), GY = E.H * V(0.8, 0.68), CX = E.W / 2;

  // Void / blank walls
  layer(g, cam, 0.1, (g) => {
    g.fillStyle = M.sky; // dark cool
    g.fillRect(-E.W, GY - V(400, 600), E.W * 3, GY * 2);
  });

  // Walls
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = shade(M.wall, -0.2);
    g.fillRect(-E.W, GY - V(80, 120), E.W * 3, GY - top + 4);
    // Desks in rows
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 6; col++) {
        const x = CX - V(450, 600) + col * V(80, 100);
        const y = GY - V(300, 400) + row * V(70, 90);
        g.fillStyle = '#252530';
        g.fillRect(x, y, 60, 40);
      }
    }
  });

  // Floor
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 300, [shade(M.floor, -0.1), M.dark]);
    g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
  });

  return { GY, CX, M };
}