import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { kitchenMorning } from '../sets/kitchen_morning.js';
import { handPos } from '../_helpers.js';
import { veil, rr, circle } from '/engine/core.js';
registerShot('s005', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: E.W * 0.46, y: 0, s: V(1.7, 1.8), facing: 1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = kitchenMorning(g, t, info, {});
    kaiFig.y = GY;
    kaiFig.pose = breathe(posesAt(t, [[0, POSES.holdFront], [1.0, POSES.talk]]), t);
    // "You played games till midnight" — Kai at the table, game controller in hand
    drawFigure(g, { ...kaiFig, expr: exprAt(t, [[0, 'happy'], [1.0, 'smile']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.2, 0.3], rim });
    // the game controller in his hands
    const [hx2, hy2] = handPos(kaiFig);
    rr(g, hx2 - 34, hy2 - 18, 68, 36, 10); g.fillStyle = '#1c1c28'; g.fill();
    g.strokeStyle = '#3a3a48'; g.lineWidth = 3; g.stroke();
    circle(g, hx2 - 18, hy2, 7, '#c94a3a'); circle(g, hx2 + 18, hy2, 7, '#4a7ac9');
    // night tint over the morning kitchen — it is midnight in this memory
    veil(g, '#0a1030', 0.30);
  });
} });
