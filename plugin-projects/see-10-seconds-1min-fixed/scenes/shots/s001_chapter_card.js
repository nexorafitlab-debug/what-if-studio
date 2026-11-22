// s001 — CHAPTER 1 card: THE FAN (music-only 4s pause) — unchanged
import { E, V, registerShot } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
import { chapterCard } from '/engine/story.js';
registerShot('s001', { draw(g, t, info) {
  voidSet(g, t, info);
  chapterCard(g, t, { n: 1, title: 'THE FAN', sub: 'YOU: 10s  |  WORLD: 0s', dur: 4 });
} });
