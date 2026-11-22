// s088 — "Saturday. You are on the bus." INSIDE the bus at dusk: Kian sits by
// the window watching the street slide past; the old man boards through the
// door at the right. (The bus-stop bench was the wrong place for this line.)
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { busInterior } from '../sets/bus_interior.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s115', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = busInterior(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // old man boards through the door and walks in
    const ox = E.W * 0.95 - Math.min(t, 1.6) * 260;
    const old = { x: ox, y: GY, s: V(1.25, 1.35), facing: -1, outfit: CAST.OLD.outfit, pose: t < 1.6 ? walkPose(t * Math.PI * 2 * 0.7) : breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, old);
    const [hx, hy, hr] = headPos(old);
    chancePill(g, hx, hy, hr, '1', t);
    // Kian sits by the window, looking out, then leans back
    const pose = breathe(posesAt(t, [[0, POSES.sit], [1.2, POSES.sitBack]]), t);
    drawFigure(g, { x: E.W * 0.40, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.KIAN.outfit, pose, expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, 'SATURDAY.', E.W / 2, E.H * 0.16, { size: V(56, 64), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });
