import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S6B, S7, S8, S9, S10, S11 } from './shots';

export const deathCountV2 = defineEpisode('DeathCountV2', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S6B, S7, S8, S9, S10, S11 },
});
