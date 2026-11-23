import { E, V, registerShot, layer, talkAmount, prog, ease, lerp, clamp, text, slowCam, circle, seg, rr, poly, alpha } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos, exprAt } from '/engine/rig2d.js';
import { CAST } from '../cast.js';
import { streetRain } from '../sets/street_rain.js';
registerShot('s062', { draw(g, t, info) {
  layer(g, { z: 1 }, 1, (g) => {
    const { GY, M } = streetRain(g, t, info, {});
    const rim = { color: '#ffd76a', dir: [-1, -1], w: 4 };
    // "You grow back, soaked." — Noah grows back, water dripping off him
    const k = ease.inOut(prog(t, 0.1, 0.9));
    const s = lerp(0.3, 1.5, k);
    drawFigure(g, { x: E.W * 0.5, y: GY, s, facing: 1, outfit: CAST.NOAH.outfit, pose: breathe(posesAt(t, [[0, POSES.crouch], [0.6, POSES.stand], [1.2, POSES.sad]]), t), expr: exprAt(t, [[0, 'scared'], [0.8, 'sad']]), talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
    // drips falling off his hoodie
    for (let i = 0; i < 4; i++) {
      const dy = GY - 100 + ((t * 160 + i * 90) % 200);
      circle(g, E.W * (0.44 + i * 0.04), dy, 5, 'rgba(159,216,255,0.7)');
    }
    const px = E.W * 0.85 - t * 90;
    drawFigure(g, { x: px, y: GY, s: V(1.3, 1.4), facing: -1, outfit: CAST.PASSER.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'neutral', talk: 0, blink: (t % 3.1) < 0.12, rim });
  });
} });
