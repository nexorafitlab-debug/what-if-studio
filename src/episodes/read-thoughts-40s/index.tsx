import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17 } from './shots';

// ReadThoughts40s — 'What If You Could Read Anyone's Thoughts?' (17 shots, 40s sample).
// The thought panels live in the shots themselves (ThoughtPanel in shots.tsx)
// — there is no look overlay: the old thoughtLook drew a countdown Dial
// (a death/money-count device, wrong for this power) and a TitleCard on
// EVERY frame, which would have stamped the title over the whole video.
// grain: false — the per-frame epGrain feTurbulence filter is removed for
// this episode (prime suspect in the GitHub render race that tiled ~1 in 13
// frames in the last two videos). The shared engine is untouched.
export const readThoughts40s = defineEpisode('ReadThoughts40s', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17 },
  grain: false,
});
