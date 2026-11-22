// s015 — "Wind gusts. Your phone slips." Rooftop sunset; the phone leaves Kian's hand.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount, alpha, seg } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, headPos } from '/engine/rig2d.js';
import { rooftop } from '../sets/rooftop.js';
import { CAST } from '../cast.js';
import { drawPhone, handPos } from '../_helpers.js';
registerShot('s015', { draw(g, t, info) {
  const cam = { z: 1.1, x: 60, y: 0 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = rooftop(g, t, info, {});
    const s = V(1.4, 1.5), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // the girl, behind him to the left, watching
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.GIRL.outfit, pose: breathe(POSES.stand, t, 1, 3), expr: 'neutral', look: [0.6, 0], rim: { color: M.rim, dir: [1, -1], w: 3 } });
    const pose = breathe(posesAt(t, [[0, POSES.phone], [1.3, POSES.reach]]), t);
    const kian = { x: E.W * 0.68, y: GY, s, facing: 1, outfit: CAST.KIAN.outfit, pose, expr: t > 1.25 ? 'surprised' : 'neutral', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim };
    drawFigure(g, kian);
    // wind streaks
    for (let i = 0; i < 5; i++) {
      const wx = ((i * 397 + t * 620) % (E.W + 400)) - 200, wy = 200 + i * 130;
      seg(g, [[wx, wy], [wx + 120, wy]], 3, alpha('#ffe2a8', 0.25 + 0.2 * Math.sin(t * 3 + i)));
    }
    // phone: in his hand until the slip, then falling
    const [hx, hy] = handPos(kian);
    const slip = prog(t, 1.25, 2.1);
    if (slip < 1) drawPhone(g, hx + 8, hy - 6, 0.15, 1.15);
    else drawPhone(g, hx + 8 + ease.in(slip) * 40, hy - 6 + ease.in(slip) * 320, 0.15 + slip * 1.8, 1.15);
  });
} });
