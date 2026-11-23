import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, glow, slowCam, FONTS, alpha, rr, circle, seg, measure } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { hospitalRoom } from '../sets/hospital_room.js';
registerShot('s101', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const f0 = { x: E.W * 0.30, y: 0, s: 1.4, facing: 1, outfit: CAST.ROSE.outfit, pose: breathe(posesAt(t, [[0, POSES.sitBack]]), t) };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = hospitalRoom(g, t, info, {});
    f0.y = GY;
    drawFigure(g, { ...f0, expr: exprAt(t, [[0, "sleepy"]]), talk: 0, blink: (t + f0.x * 0.01) % 3.7 < 0.12 });
    // hospital monitor: ECG line scrolling across the screen
    rr(g, E.W * 0.60, E.H * 0.28, 340, 170, 8); g.fillStyle = '#0c1420'; g.fill(); g.strokeStyle = '#3a4a5a'; g.lineWidth = 3; g.stroke();
    g.save(); g.beginPath(); g.rect(E.W * 0.60, E.H * 0.28, 340, 170); g.clip(); g.strokeStyle = '#7ee787'; g.lineWidth = 4; g.beginPath();
    for (let _x = 0; _x <= 340; _x += 4) { const _p = ((_x + t * 140) % 340) / 340; const _y = E.H * 0.28 + 85 - (_p < 0.08 ? 0 : _p < 0.12 ? -55 * ((_p - 0.08) / 0.04) : _p < 0.16 ? 70 * (1 - (_p - 0.12) / 0.04) : _p < 0.22 ? -12 * ((_p - 0.16) / 0.06) : 0); if (_x === 0) g.moveTo(E.W * 0.60 + _x, _y); else g.lineTo(E.W * 0.60 + _x, _y); }
    g.stroke(); g.restore();
  });
} });
