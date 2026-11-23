import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { court } from '../sets/court.js';
import { handPos } from '../_helpers.js';
registerShot('s034', { draw(g, t, info) {
  const cam = { z: 1.1, x: 150, y: 50 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = court(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "It feels like a grape in your hand." — close on the giant hand + tiny ball
    const fig = { x: E.W * 0.52, y: GY, s: 3.0, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(POSES.holdFront, t) };
    drawFigure(g, { ...fig, expr: 'awe', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // the ball sits small in his palm, spinning slowly
    const [hx, hy] = handPos(fig);
    circle(g, hx, hy, 24, '#e07856');
    g.strokeStyle = '#1a1622'; g.lineWidth = 3;
    g.beginPath(); g.arc(hx, hy, 24, t * 2, t * 2 + Math.PI); g.stroke();
  });
} });
