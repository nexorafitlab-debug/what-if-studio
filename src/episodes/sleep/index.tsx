import React from 'react';
import { defineEpisode } from '../../engine';
import { Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7, Sh8, Sh9, Sh10, Sh11, Sh12, Sh13, Sh14, Sh15, Sh16, Sh17 } from './shots';
import timeline from './timeline.json';

export const sleep = defineEpisode('Sleep', {
  timeline: timeline as any,
  shots: { Sh1, Sh2, Sh3, Sh4, Sh5, Sh6, Sh7, Sh8, Sh9, Sh10, Sh11, Sh12, Sh13, Sh14, Sh15, Sh16, Sh17 },
});