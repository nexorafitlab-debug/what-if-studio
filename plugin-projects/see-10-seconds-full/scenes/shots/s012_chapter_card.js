// s012 — CHAPTER 2 card: THE RULE (music-only 4s pause)
import { E, V, registerShot } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
import { chapterCard } from '/engine/story.js';
registerShot('s012', { draw(g, t, info) {
  voidSet(g, t, info);
  chapterCard(g, t, { n: 2, title: 'THE RULE', sub: 'YOU: 10s  |  WORLD: 0s', dur: 4 });
} });
