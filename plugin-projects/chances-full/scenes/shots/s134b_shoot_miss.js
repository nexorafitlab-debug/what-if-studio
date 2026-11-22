// s134 P2 — "You shoot. You miss." Kian jumps, shoots, and the ball flies to
// the hoop, clips the rim and drops to the grass — it MISSES. He goes quiet.
import { E, V, registerShot, layer, talkAmount, prog, clamp, lerp, circle, seg } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { backyard } from '../sets/backyard.js';
import { CAST } from '../cast.js';
import { handPos } from '../_helpers.js';
function drawBall(g, bx, by, r) {
  circle(g, bx, by, r, '#e07856');
  seg(g, [[bx - r, by], [bx + r, by]], 3, '#5a2a1a');
  seg(g, [[bx, by - r], [bx, by + r]], 3, '#5a2a1a');
  g.strokeStyle = '#5a2a1a'; g.lineWidth = 3;
  g.beginPath(); g.arc(bx, by, r * 0.55, -0.6, 1.2); g.stroke();
}
registerShot('s201', { draw(g, t, info) {
  const cam = { z: 1.2, x: 80, y: 80 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = backyard(g, t, info, { ball: false });
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const jay = { x: E.W * 0.66, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const pose = breathe(posesAt(t, [[0, POSES.jump], [0.24, POSES.sad]]), t);
    const kian = { x: E.W * 0.3, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: t > 0.24 ? 'sad' : 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim };
    // ball flight: hands (release at 0.24) -> arc over the rim -> clips the
    // rim -> bounces right and down -> lands on the grass and stays
    const [hx, hy] = handPos(kian);
    const [rx, ry] = handPos({ ...kian, pose: breathe(POSES.jump, 0) }); // release = jump hands
    const release = [rx, ry], rimTop = [E.W * 0.78 + 55, GY - 214], bounce = [E.W * 0.90, GY - 40], ground = [E.W * 0.88, GY + 100];
    let bx, by;
    if (t < 0.24) { bx = hx; by = hy; }
    else if (t < 1.0) { const k = clamp(prog(t, 0.24, 1.0)); bx = lerp(release[0], rimTop[0], k); by = lerp(release[1], rimTop[1], k) - Math.sin(k * Math.PI) * 130; }
    else if (t < 1.3) { const k = clamp(prog(t, 1.0, 1.3)); bx = lerp(rimTop[0], bounce[0], k); by = lerp(rimTop[1], bounce[1], k); }
    else { const k = Math.min(1, clamp(prog(t, 1.3, 1.55))); bx = lerp(bounce[0], ground[0], k); by = lerp(bounce[1], ground[1], k); }
    drawBall(g, bx, by, 26);
    drawFigure(g, kian);
  });
} });
