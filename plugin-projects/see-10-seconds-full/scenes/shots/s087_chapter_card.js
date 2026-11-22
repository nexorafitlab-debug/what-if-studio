// s087 — CHAPTER 4 card: THE COST (music-only 4s pause)
import { E, V, registerShot } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
import { chapterCard } from '/engine/story.js';
registerShot('s087', { draw(g, t, info) {
  voidSet(g, t, info);
  chapterCard(g, t, { n: 4, title: 'THE COST', sub: 'YOU: 10s  |  WORLD: 0s', dur: 4 });
} });
