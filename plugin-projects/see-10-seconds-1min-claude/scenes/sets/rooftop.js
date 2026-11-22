import { E, V, mood, layer, backdrop, seg, circle, linGrad, shade, alpha, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export function rooftop(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = E.H * V(0.85, 0.7), CX = E.W / 2;

  // Sky and sunset
  layer(g, cam, 0.1, (g) => {
    backdrop(g, M.sky);
    // Sunset sun
    FX.sun(g, CX - V(300, 150), GY - V(200, 400), 50, '#ffd6a6', M.key, 4);
    FX.clouds(g, { y: GY - V(400, 700), h: 150, color: '#fdcb6e', a: 0.2, seed: 4 });
    // City skyline far below
    FX.skyline(g, {
      x: -E.W, y: GY - V(100, 250), w: E.W * 4, minH: 50, maxH: V(120, 180),
      color: mix(M.sky[1], M.wall, 0.5), windowColor: alpha(M.practical, 0.3), lit: 0.08, seed: 7,
    });
  });

  // Building edge / low wall
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = shade(M.wall, -0.2);
    g.fillRect(CX - 500, GY - 100, 1000, 80);
    // Railing
    g.strokeStyle = shade(M.practical, 0.3);
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(CX - 480, GY - 20);
    g.lineTo(CX + 480, GY - 20);
    g.stroke();
  });

  // Floor / ground
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 200, [shade(M.floor, -0.1), M.dark]);
    g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    // Wind effect lines
    g.strokeStyle = 'rgba(255,255,255,0.1)';
    g.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = GY + 20 + i * 30;
      g.beginPath();
      g.moveTo(CX - 500, y);
      g.lineTo(CX + 500, y);
      g.stroke();
    }
  });

  // Foreground: wind, atmospheric
  layer(g, cam, 1.0, (g) => {
    FX.dust(g, t, { seed: 2, count: 30, color: '#f5c7a8', a: 0.2 });
  });

  return { GY, CX, M };
}