import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S6B, S7, S8, S9, S10, S11 } from './shots';

// Fresh rebuild of the approved death-count-v2 30s sample.
// grain: false — the per-frame epGrain feTurbulence filter is removed for
// this episode only (prime suspect in the GitHub render race that tiled
// ~1 in 13 frames in the last two videos). The shared engine is untouched.
export const deathCount30sNew = defineEpisode('DeathCount30sNew', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S6B, S7, S8, S9, S10, S11 },
  grain: false,
});
