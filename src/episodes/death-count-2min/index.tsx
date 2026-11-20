import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import {
  S1, S2, S3, S4, S5, S6, S6B, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19,
  S20, S21, S22, S23, S24, S25, S26, S27, S28, S29, S30, S31, S31B, S32, S33, S34, S35, S36, S37, S38,
} from './shots';

export const deathCount2Min = defineEpisode('DeathCount2Min', {
  timeline: timeline as Timeline,
  shots: {
    S1, S2, S3, S4, S5, S6, S6B, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19,
    S20, S21, S22, S23, S24, S25, S26, S27, S28, S29, S30, S31, S31B, S32, S33, S34, S35, S36, S37, S38,
  },
});
