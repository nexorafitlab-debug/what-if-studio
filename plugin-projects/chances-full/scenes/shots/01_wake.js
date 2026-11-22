// s001 — "You wake up." Bedroom morning, Kian sits up in bed.
// NOTE: POSES.lie without rot does NOT lie down (rig2d: "use with rot: ±Math.PI/2") —
// the 57s sample's s001 has that quirk (Kian standing by the bed at t=0). Fixed here
// the way the v3 sample did: unwind rot -90°→0 as he sits up, head on the pillow.
import { E, V, registerShot, layer, talkAmount, prog, ease, lerp } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import { bedroomMorning } from '../sets/bedroom_morning.js';
import { CAST } from '../cast.js';
registerShot('s001', { draw(g, t, info) {
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = bedroomMorning(g, t, info, {});
    const s = V(1.5, 1.6), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    // sit-up: rot unwinds -90° (flat, head on pillow) → 0 (sitting), hip slides
    // from the pillow end of the bed to the sitting position, over the first 0.5 s
    const k = ease.inOut(prog(t, 0, 0.5));
    const rot = -Math.PI / 2 * (1 - k);
    const x = lerp(E.W * 0.20, E.W * 0.30, k);
    const y = lerp(GY + 93, GY + 40, k);
    const pose = breathe(posesAt(t, [[0, POSES.lie], [0.4, POSES.sit]]), t);
    drawFigure(g, { x, y, s, facing: 1, outfit: CAST.KIAN.outfit, pose, rot, expr: t > 0.8 ? 'surprised' : 'sleepy', talk: talkAmount(info.globalT), blink: (t % 3.7) < 0.12, rim });
  });
} });
