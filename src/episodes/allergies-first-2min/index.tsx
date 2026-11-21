import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import {
  S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16,
  S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27, S28, S29, S30,
  S31, S32, S33, S34, S35, S36, S37, S38, S39,
} from './shots';

// AllergiesFirst2min — 'What If You Could Read Anyone's Allergies?'
// (first 2 minutes: 39 shots b1-01..b3-09, 114.9s / 3447 frames).
// Built ONLY from Claude's delivery (first 329 words of
// allergies-narration.txt + allergies-scenes-part1.json beats 1-3).
// Voice: Helio, 6 chunks, all whisper-verified word-for-word.
// Rig per Claude's spec: pale round heads, dot eyes, hero in warm
// orange hoodie #FDB33F. Labels: hero none; girl POLLEN, driver CATS,
// big guy PEANUTS, worker PEANUTS, jogger POLLEN, stroller woman CATS.
// grain: false. Letterbox applied in stitch.sh. No whoosh on any cut.
export const allergiesFirst2min = defineEpisode('AllergiesFirst2min', {
  timeline: timeline as Timeline,
  shots: {
    S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16,
    S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27, S28, S29, S30,
    S31, S32, S33, S34, S35, S36, S37, S38, S39,
  },
  grain: false,
});
