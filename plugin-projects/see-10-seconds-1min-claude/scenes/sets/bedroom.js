import { E, V, mood, layer, backdrop, seg, circle, linGrad, shade, alpha, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export function bedroom(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = E.H * V(0.8, 0.68), CX = E.W / 2;

  // Sky and dawn light
  layer(g, cam, 0.1, (g) => {
    backdrop(g, M.sky);
    // Sunrise gradient
    const sunY = GY - V(300, 500);
    g.fillStyle = linGrad(g, CX, sunY - V(200, 300), CX, sunY + V(100, 200), [
      mix(M.practical, M.sky[1], 0.8),
      M.sky[1],
    ]);
    g.fillRect(CX - V(400, 600), GY - V(800, 1200), E.W * 2, GY * 2);
  });

  // Walls
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = shade(M.wall, -0.1);
    g.fillRect(-E.W, GY - V(100, 200), E.W * 3, GY - top + 4);
  });

  // Floor
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 300, [shade(M.floor, -0.05), M.dark]);
    g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
  });

  // Bed and props
  layer(g, cam, 1.0, (g) => {
    // Bed
    g.fillStyle = '#2c1a30';
    // Pillow
    g.fillStyle = '#4a354c';
    g.fillRect(CX - V(100, 150), GY - V(200, 250), V(200, 120), 120);
    // Rug
    g.fillStyle = '#4a354c';
    g.fillRect(CX - V(250, 350), GY + V(50, 100), 500, V(80, 120));
    // Lamp
    g.fillStyle = '#f2c21a';
    g.fillRect(CX - V(200, 300), GY - V(100, 150), 40, V(100, 150));
    // Fan
    g.strokeStyle = '#f2c21a';
    g.lineWidth = 2;
    g.beginPath();
    g.arc(CX, GY - V(300, 400), V(60, 80), 0, Math.PI * 2);
    g.stroke();
  });

  return { GY, CX, M };
}