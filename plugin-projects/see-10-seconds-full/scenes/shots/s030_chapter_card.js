// s030 — CHAPTER 3 card: THE GAMES (music-only 4s pause)
import { E, V, registerShot } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
import { chapterCard } from '/engine/story.js';
registerShot('s030', { draw(g, t, info) {
  voidSet(g, t, info);
  chapterCard(g, t, { n: 3, title: 'THE GAMES', sub: 'YOU: 10s  |  WORLD: 0s', dur: 4 });
} });
