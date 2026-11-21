import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18 } from './shots';

// PastLives1Min — 'What If You Could See How Many Lives Everyone Has
// Lived?' (18 shots, 60.0s). Built fresh from scratch: 2 brand-new sets
// (plHallway, plBedroom) + starry void; no old set is used. Movement in
// every shot (stand, walk cycle with planted feet, reach, head turns,
// face changes), pill pop with overshoot + ring + sparkles on Sam's "12",
// detector screen glow, tick-down pulse 12 -> 11, eye-glint when the
// power fires. Voice: Helio narration + Kokoro af_heart for Sam, 98 words,
// whisper-verified (voice-1min.wav, NOT regenerated).
// grain: false — the per-frame epGrain feTurbulence filter stays off.
export const pastLives1Min = defineEpisode('PastLives1Min', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18 },
  grain: false,
});
