// s013 — "Kian. That's your name. Seventeen." [SCHOOL HALLWAY] · act — FIXED:
// was the stock act template parked at 0.42W + a beat banner that HID the EXIT
// sign and clipped the bulletin board. Now: the sample's s005 walk-in — Kian
// walks in left→right (walkPose, lx = 0.24W + t*120) and stops under his name
// tag, two breathing students by the lockers. No beat banner (the chapter
// card just announced THE RULE); EXIT + board stay visible.
import { E, V, registerShot, layer } from '/engine/core.js';
import { drawFigure, POSES, breathe, walkPose } from '/engine/rig2d.js';
import { hallway } from '../sets/hallway.js';
import { CAST } from '../cast.js';
import { dualCounter } from '/engine/counters.js';
import { hudScore, nameTag } from '/engine/story.js';
registerShot('s013', { draw(g, t, info) {
  const D = info.dur;
  const cam = { z: 1 };
  layer(g, cam, 1, (g) => {
    const { GY, M } = hallway(g, t, info, {});
    const s = V(1.3, 1.4), rim = { color: M.rim, dir: [-1, -1], w: 4 };
    drawFigure(g, { x: E.W * 0.78, y: GY, s: V(1.1, 1.2), facing: -1, outfit: CAST.STUDENT1.outfit, pose: breathe(POSES.stand, t, 1, 2), expr: 'neutral', rim });
    drawFigure(g, { x: E.W * 0.88, y: GY, s: V(1.1, 1.2), facing: -1, outfit: CAST.STUDENT2.outfit, pose: breathe(POSES.stand, t, 1, 4), expr: 'neutral', rim });
    const lx = E.W * 0.24 + t * 120;
    drawFigure(g, { x: lx, y: GY, s, facing: 1, outfit: CAST.KIAN.outfit, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'neutral', rim });
  });
  dualCounter(g, info.globalT, { chapterStart: 39.64, left: { label: 'YOU', from: 0, rate: 1 }, right: { label: 'WORLD', from: 0, rate: 0 }, format: 'clock', x: 70, y: 130 });
  hudScore(g, t, { items: [{ label: 'SAVES', value: 1 }] });
  nameTag(g, { name: 'KIAN', role: 'SEVENTEEN', fact: 'SEES 10 SECONDS AHEAD', x: E.W * 0.42, y: E.H * 0.88 });
} });
