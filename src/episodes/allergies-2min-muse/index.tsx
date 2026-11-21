import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27, S28, S29, S30, S31, S32, S33, S34, S35, S36, S37, S38, S39 } from './shots';

// Allergies2minMuse — 'What If You Could Read Anyone's Allergies?' (39 shots,
// ~350 words, ~123.5s / 3706 frames, DRAFT timings). FRESH sample written by
// Muse for the quality check: fresh script + fresh shot plan, same topic as
// the 40s sample but no reused narration, scenes, or shots. Timeline is a
// DRAFT (word-count distribution at ~170 wpm, 30fps); it will be replaced
// with whisper-anchored timings once the voice is recorded.
// Look: approved 40s sample (black heads, blue hoodie hero, colour-coded
// labels, "LABELS SEEN: n" pill). Walks via walkCyclePose (S4, S10, S11,
// S14, S30, S36, S37); HeroRig point pose (S16, S24, S25). Zero fully-static
// characters. Camera static inside every shot. grain: false. No whoosh.
export const allergies2minMuse = defineEpisode('Allergies2minMuse', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27, S28, S29, S30, S31, S32, S33, S34, S35, S36, S37, S38, S39 },
  grain: false,
});
