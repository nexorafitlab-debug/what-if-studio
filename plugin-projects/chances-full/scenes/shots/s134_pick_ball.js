// s134 — "You pick up the ball. You shoot. You miss." Backyard: Kian picks
// the ball up off the grass and rises into the shot. The ball is IN HIS
// HANDS the whole time (never sitting on the ground while he shoots).
import { E, V, registerShot, layer, talkAmount, prog, clamp, lerp, circle, seg } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { backyard } from '../sets/backyard.js';
import { CAST } from '../cast.js';
import { handPos } from '../_helpers.js';
// orange basketball with seams, centred at (bx, by)
function drawBall(g, bx, by, r) {
  circle(g, bx, by, r, '#e07856');
  seg(g, [[bx - r, by], [bx + r, by]], 3, '#5a2a1a');
  seg(g, [[bx, by - r], [bx, by + r]], 3, '#5a2a1a');
  g.strokeStyle = '#5a2a1a'; g.lineWidth = 3;
  g.beginPath(); g.arc(bx, by, r * 0.55, -0.6, 1.2); g.stroke();
}
registerShot('s200', { draw(g, t, info) {
  const cam = { z: 1.1, x: 60, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = backyard(g, t, info, { ball: false });
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jay = { x: E.W * 0.66, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const pose = breathe(posesAt(t, [[0, POSES.crouch], [0.9, POSES.jump], [1.8, POSES.sad]]), t);
    const kian = { x: E.W * 0.3, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: t > 1.8 ? 'sad' : 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim };
    // ball: on the grass by his feet, then up into his hands as he rises
    const [hx, hy] = handPos(kian);
    const k = clamp(prog(t, 0.4, 0.9));
    drawBall(g, lerp(E.W * 0.3 + 70, hx, k), lerp(GY + 100, hy, k), 26);
    drawFigure(g, kian);
  });
} });
