// s137 — CHAPTER 6 card: THE TWIST (music-only 4s pause)
import { E, V, registerShot } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
import { chapterCard } from '/engine/story.js';
registerShot('s137', { draw(g, t, info) {
  voidSet(g, t, info);
  chapterCard(g, t, { n: 6, title: 'THE TWIST', sub: 'YOU: 10s  |  WORLD: 0s', dur: 4 });
} });
