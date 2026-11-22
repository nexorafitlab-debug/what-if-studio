// s063 P2 — "Sixty-six days to build one good habit." Bedroom: Kian marks day 1 on a wall calendar.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
registerShot('s074', { draw(g, t, info) {
  const cam = { z: 1.2, x: 40, y: 60 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // wall calendar: white board, 7x4 day grid, day 1 crossed in red
    const bx = E.W * 0.52, by = E.H * 0.16, bw = 300, bh = 220;
    g.save();
    g.fillStyle = '#f4efe4'; g.fillRect(bx, by, bw, bh);
    g.strokeStyle = 'rgba(20,24,48,0.35)'; g.lineWidth = 2; g.strokeRect(bx, by, bw, bh);
    g.beginPath();
    for (let c = 1; c < 7; c++) { g.moveTo(bx + c * bw / 7, by + 34); g.lineTo(bx + c * bw / 7, by + bh); }
    for (let r = 1; r < 4; r++) { g.moveTo(bx, by + 34 + r * (bh - 34) / 4); g.lineTo(bx + bw, by + 34 + r * (bh - 34) / 4); }
    g.stroke();
    g.fillStyle = '#2e6ff0'; g.font = 'bold 20px sans-serif'; g.textAlign = 'center';
    g.fillText('66 DAYS', bx + bw / 2, by + 24);
    // a new red X every 0.7s — he is marking the days, not frozen
    const marks = Math.min(5, 1 + Math.floor(t / 0.7));
    g.strokeStyle = '#e5484d'; g.lineWidth = 4;
    for (let d = 0; d < marks; d++) {
      const cx0 = bx + d * bw / 7, cy0 = by + 34, cw = bw / 7, ch = (bh - 34) / 4;
      g.beginPath();
      g.moveTo(cx0 + 6, cy0 + 6); g.lineTo(cx0 + cw - 6, cy0 + ch - 6);
      g.moveTo(cx0 + cw - 6, cy0 + 6); g.lineTo(cx0 + 6, cy0 + ch - 6);
      g.stroke();
    }
    g.restore();
    const pose = breathe(posesAt(t, [[0, POSES.pointUp], [0.7, POSES.stand], [1.4, POSES.pointUp], [2.1, POSES.stand], [2.8, POSES.pointUp]]), t);
    drawFigure(g, { x: E.W * 0.3, y: GY, s: V(1.35, 1.45), facing: 1, outfit: CAST.KIAN.outfit, pose, expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const a = clamp(prog(t, 0.3, 0.6));
  text(g, `DAY ${Math.min(5, 1 + Math.floor(t / 0.7))} OF 66.`, E.W / 2, E.H * 0.90, { size: V(48, 54), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });
