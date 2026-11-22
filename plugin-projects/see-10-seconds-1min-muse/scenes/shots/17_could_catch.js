// s017 — "You watch it fall. You could catch it." Kian's hand hovers; he does not grab.
import { E, V, registerShot, layer, ease, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { rooftop } from '../sets/rooftop.js';
import { CAST } from '../cast.js';
import { drawPhone } from '../_helpers.js';
registerShot('s017', { draw(g, t, info) {
  const cam = { z: 1.25, x: 230, y: 145 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = rooftop(g, t, info, {});
    const s = V(1.5, 1.6), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const pose = breathe(posesAt(t, [[0, POSES.stand], [1.2, POSES.holdFront]]), t);
    drawFigure(g, { x: E.W * 0.62, y: GY, s, facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // phone drifting down slowly (slow motion) at the edge of the frame
    const fall = prog(t, 0, 3);
    drawPhone(g, E.W * 0.82, GY - 480 + fall * 300, 0.6 + fall * 1.2, 1.3);
  });
  const a = clamp(prog(t, 1.6, 2.0));
  text(g, 'YOU COULD CATCH IT.', E.W / 2, E.H * 0.2, { size: V(52, 60), color: '#ffd76a', glow: 24, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });
