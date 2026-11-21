import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4 } from './shots';

// ReadThoughts — 'What If You Could Read Anyone's Thoughts?' (4 shots, 10s sample).
// The thought panels live in the shots themselves (ThoughtPanel in shots.tsx)
// — there is no look overlay: the old thoughtLook drew a countdown Dial
// (a death/money-count device, wrong for this power) and a TitleCard on
// EVERY frame, which would have stamped the title over the whole video.
// grain: false — the per-frame epGrain feTurbulence filter is removed for
// this episode (prime suspect in the GitHub render race that tiled ~1 in 13
// frames in the last two videos). The shared engine is untouched.
export const readThoughts = defineEpisode('ReadThoughts', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4 },
  grain: false,
});
