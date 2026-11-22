// s146 — CHAPTER 7 card: THE CHOICE (music-only 4s pause)
import { E, V, registerShot } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
import { chapterCard } from '/engine/story.js';
registerShot('s146', { draw(g, t, info) {
  voidSet(g, t, info);
  chapterCard(g, t, { n: 7, title: 'THE CHOICE', sub: 'YOU: 10s  |  WORLD: 0s', dur: 4 });
} });
