import { E, V, mood, layer, backdrop, seg, circle, linGrad, shade, alpha, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export function street(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = E.H * V(0.84, 0.72), CX = E.W / 2;
  const wall = shade(M.wall, -0.2), wallDark = shade(M.wall, -0.6);

  // Sky and golden hour sun
  layer(g, cam, 0.1, (g) => {
    backdrop(g, M.sky);
    FX.sun(g, CX - V(400, 200), GY - V(420, 700), 60, '#fff3dc', M.key, 5);
    FX.clouds(g, { y: GY - V(700, 1200), h: 220, color: '#ffe7c7', a: 0.14, seed: 3 });
    FX.skyline(g, {
      x: -E.W, y: GY - V(340, 560), w: E.W * 3, minH: 90, maxH: V(280, 440),
      color: mix(M.sky[1], wallDark, 0.7), windowColor: alpha(M.practical, 0.45), lit: 0.12, seed: 9,
    });
  });

  // Building facades with warm lit windows
  layer(g, cam, 0.55, (g) => {
    const top = GY - V(520, 800), left = CX - 1600, w = 3200;
    g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(wall, 0.05), wall, wallDark]);
    g.fillRect(left, top, w, GY - top + 4);
    for (const bx of [left + 200, left + 700, left + 1300, left + 2100]) {
      FX.facade(g, {
        x: bx, y: GY - 20, w: 420, h: V(460, 720), color: wall, win: M.practical, dark: wallDark,
        cols: 2, rows: 4, lit: 0.5, seed: 11 + bx,
      });
    }
  });

  // Street floor
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 500, [shade(M.floor, -0.05), shade(M.dark, -0.25)]);
    g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 600, 'rgba(0,0,0,.2)', 0.07);
    for (const x of [-500, 0, 500, 1000]) FX.pool(g, CX + x, GY + 12, 220, 30, M.practical, 0.15);
  });

  // Foreground: lamp posts, trees, benches
  layer(g, cam, 1.1, (g) => {
    for (const x of [-700, 300, 1300]) FX.lampPost(g, CX + x, GY + 10, V(340, 420), { light: M.practical, on: true });
    for (const x of [-400, 400, 1100]) FX.tree(g, CX + x, GY + 12, 1, shade(M.grass, -0.3));
    for (const x of [-200, 800]) {
      g.fillStyle = '#2a2230';
      g.fillRect(CX + x - 60, GY - 10, 120, 10);
      g.fillRect(CX + x - 10, GY - 30, 20, 22);
    }
  });

  return { GY, CX, M };
}