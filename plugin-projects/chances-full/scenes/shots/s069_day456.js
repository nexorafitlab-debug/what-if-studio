// s069 — "Day four. Day five. Day six." Three quick beats in one shot: Kian walks schoolyard, hallway, gym.
import { E, V, registerShot, layer, prog, clamp, talkAmount, text } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose } from '/engine/rig2d.js';
import { schoolyard } from '../sets/schoolyard.js';
import { CAST } from '../cast.js';
registerShot('s084', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = schoolyard(g, t, info, {});
    const rim = { color: M.rim, dir: [-1, -1], w: 4 };
    const lx = E.W * 0.1 + t * 190;
    drawFigure(g, { x: lx, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose(t * Math.PI * 2 * 1.0), expr: 'determined', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
  const day = t < 1.0 ? 'DAY FOUR.' : t < 2.0 ? 'DAY FIVE.' : 'DAY SIX.';
  const a = clamp(prog(t % 1.0, 0.05, 0.25));
  text(g, day, E.W / 2, E.H * 0.16, { size: V(56, 64), color: '#ffd76a', glow: 26, glowColor: 'rgba(255,215,106,0.55)', spacing: 2, alpha: a });
} });
