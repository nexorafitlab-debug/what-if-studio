// s158 — choice ending (end card)
import { E, V, registerShot } from '/engine/core.js';
import { voidSet } from '../sets/void.js';
import { choiceEnding } from '/engine/story.js';
registerShot('s158', { draw(g, t, info) {
  voidSet(g, t, info);
  choiceEnding(g, t, { question: 'STOP PREVENTING... AND START CHOOSING?', opt1: 'CATCH IT', opt2: 'LET IT FALL', cta: 'TELL ME IN THE COMMENTS', dur: info.dur });
} });
