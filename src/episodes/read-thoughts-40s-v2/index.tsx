import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17 } from './shots';

// ReadThoughts40sV2 — 'What If You Could Read Anyone's Thoughts?' (17 shots, ~39s).
// Rebuilt from scratch: 10 brand-new sets (library, lobby, market, taxi,
// gallery, train, hallway, garden, gym, laundromat) + starry void; no old
// set is used. Movement in every shot, stronger panel VFX (burst + ring +
// sparkles + eye-beam + eye-glint), Freeze diagram + said-vs-thought split
// for visual explanation, Helio voice (5 short chunks, whisper-verified).
// grain: false — the per-frame epGrain feTurbulence filter stays off.
export const readThoughts40sV2 = defineEpisode('ReadThoughts40sV2', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17 },
  grain: false,
});
