import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { schoolClassroom } from '../sets/school_classroom.js';
import { swallowedWord } from '../_helpers.js';
registerShot('s016', { draw(g, t, info) {
  const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
  // "Grey text. Soft." — CLOSE on June, drawing birds; her grey words hang
  // soft above her, drifting up like smoke
  const juneFig = { x: E.W * 0.62, y: 0, s: 1.9, facing: 1, outfit: CAST.JUNE.outfit, pose: POSES.sit };
  layer(g, { z: 1 }, 1, (g) => {
    const { GY } = schoolClassroom(g, t, info, {});
    juneFig.y = GY + 10;
    juneFig.pose = breathe(POSES.sit, t, 1, juneFig.x);
    drawFigure(g, { ...juneFig, expr: 'neutral', talk: 0, blink: (t % 3.7) < 0.12, look: [0, 0.4], prop: { type: 'paper' } });
    // Eli at the left edge, watching her words
    drawFigure(g, { x: E.W * 0.14, y: GY, s: V(1.3, 1.4), facing: 1, outfit: CAST.ELI.outfit, pose: breathe(POSES.stand, t), expr: 'thinking', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, look: [0.5, -0.3], rim });
  });
  // TEXT LAST, on top: soft grey, slowly rising
  swallowedWord(g, juneFig, 'I LIKE YOU.', t, { at: 0, fadeAt: 1e9, dy: -26 * t });
} });
