import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import {
  S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16,
  S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27, S28, S29, S30,
  S31, S32, S33, S34, S35, S36, S37,
} from './shots';

// Allergies2minClaude — 'What If You Could Read Anyone's Allergies?'
// (2-minute sample: 37 shots s1-01..s1-37, 329 words). FRESH sample built
// ONLY from Claude's delivery (allergies-2min-claude-narration.txt +
// allergies-2min-claude-scenes.json). No old video reused.
// Look: approved 40s sample — solid black round heads, white face, hero
// in blue hoodie #2E6FF0. Hero NEVER has a label. Labels: green pills,
// POLLEN/CATS/PEANUTS/dust. Progression device: "LABELS SEEN n" pill
// top-left in every shot (0 -> 3 at S3 -> 4 at S6). Walks via
// walkCyclePose (S6, S8, S18, S20, S21, S24, S25, S27); HeroRig named
// poses (S15 worried, S18 look-up, S23 think, S28 point). Camera moves
// only in S13 (slow pan) and S36 (slow pull-back). grain: false.
// Letterbox applied in stitch.sh. No whoosh on any cut.
// NOTE: timeline.json does not exist yet — it is built by the voice step
// from the fresh narration. The import below will fail typecheck until
// then; do NOT invent timeline content here.
export const allergies2minClaude = defineEpisode('Allergies2minClaude', {
  timeline: timeline as Timeline,
  shots: {
    S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16,
    S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27, S28, S29, S30,
    S31, S32, S33, S34, S35, S36, S37,
  },
  grain: false,
});
