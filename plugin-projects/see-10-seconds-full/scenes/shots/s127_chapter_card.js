// s127 — CHAPTER 5 card: THE MIRROR (music-only 4s pause)
import { E, V, registerShot } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
import { chapterCard } from '/engine/story.js';
registerShot('s127', { draw(g, t, info) {
  voidSet(g, t, info);
  chapterCard(g, t, { n: 5, title: 'THE MIRROR', sub: 'YOU: 10s  |  WORLD: 0s', dur: 4 });
} });
