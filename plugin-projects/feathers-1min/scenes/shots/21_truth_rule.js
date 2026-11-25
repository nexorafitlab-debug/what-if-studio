import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, walkLocked, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { voidSet } from '../sets/void.js';
import { goldLine } from '../_helpers.js';
import { drawFeather, featherAnchor } from '../_feathers.js';
registerShot('s021', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  const kaiFig = { x: E.W * 0.5, y: 0, s: V(1.2, 1.3), facing: 1, outfit: CAST.KAI.outfit, pose: POSES.stand };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = voidSet(g, t, info, {});
    kaiFig.y = GY;
    kaiFig.pose = breathe(posesAt(t, [[0, POSES.stand], [1.4, POSES.sad]]), t);
    // RULE CARD 3 — the only way out: tell the truth
    drawFigure(g, { ...kaiFig, expr: exprAt(t, [[0, 'sad'], [1.4, 'determined']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0, -0.6], rim });
  });
  const [cx, cy] = featherAnchor(kaiFig, 'collar');
  drawFeather(g, cx, cy, 65, { color: 'white', rot: -1.0 });
  text(g, 'THE ONLY WAY', E.W / 2, E.H * 0.18, { size: V(36, 40), color: '#9fb4d8', font: FONTS.ui, weight: 800, spacing: 6, glow: 10, glowColor: 'rgba(159,180,216,0.4)' });
  goldLine(g, 'TO LOSE A FEATHER', E.H * 0.32, V(64, 72));
  goldLine(g, 'TELL THE TRUTH.', E.H * 0.46, V(64, 72));
} });
