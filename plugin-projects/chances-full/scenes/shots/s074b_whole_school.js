// s074 P2 — "The whole school is there." Wide gym: crowd, teams, Jay's red 1.
import { E, V, registerShot, layer, talkAmount } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose, headPos } from '/engine/rig2d.js';
import { gymCourt } from '../sets/gym_court.js';
import { CAST } from '../cast.js';
import { chancePill } from '../_helpers.js';
registerShot('s092', { draw(g, t, info) {
  const cam = { z: 0.9, x: 0, y: 20 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = gymCourt(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // the crowd in the stands: 3 rows x 4 per side, kept clear of the
    // scoreboard's centre column (x 790-1130) and the court below
    const crowdCols = ['#c94a3a', '#2e6ff0', '#4a9a6a', '#e8a04a', '#8a5a9a', '#4a9a9a', '#e07856', '#5a7a3a'];
    for (let r = 0; r < 3; r++) {
      const rowY = 180 + r * 92;
      for (let side = 0; side < 2; side++) {
        for (let c = 0; c < 4; c++) {
          const cx = E.W * (side === 0 ? 0.08 + c * 0.08 : 0.62 + c * 0.08);
          const bob = Math.sin(t * 2 + r * 3 + c * 1.7 + side * 2.4) * 2;
          const col = crowdCols[(r * 4 + c + side * 3) % crowdCols.length];
          g.fillStyle = col;
          g.beginPath(); g.arc(cx, rowY - 28 + bob, 14, 0, Math.PI * 2); g.fill(); // head
          g.fillRect(cx - 16, rowY - 14 + bob, 32, 34); // torso
        }
      }
    }
    const t1 = { x: E.W * 0.16, y: GY, s: V(1.2, 1.3), facing: 1, outfit: CAST.TEAM1.outfit, pose: breathe(POSES.cheer, t, 1, 2), expr: 'smile', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, t1);
    const [hx1, hy1, hr1] = headPos(t1);
    chancePill(g, hx1, hy1, hr1, '8', t);
    const jay = { x: E.W * 0.62, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.JAY.outfit, pose: breathe(POSES.ready, t, 1, 2), expr: 'determined', rim: { color: M.rim, dir: [1, -1], w: 3 } };
    drawFigure(g, jay);
    const [hx, hy, hr] = headPos(jay);
    chancePill(g, hx, hy, hr, '1', t);
    const lx = E.W * 0.3 + (t + 2.2) * 60;
    drawFigure(g, { x: lx, y: GY, s: V(1.25, 1.35), facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose((t + 2.2) * Math.PI * 2 * 0.9), expr: 'smile', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
