import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10 } from './shots';

// 30s money-count sample: the cold open (Beat 1) only — the cashier's $40
// ticks $40 → $44 → $48. Voice is Kokoro am_michael, chunks 1–16 with
// inter-chunk dead air trimmed to 0.35s gaps (raw Kokoro chunks carry
// ~0.4s lead + ~0.55s trailing silence each; 16 raw chunks would run
// ~39s — trimming lands the sample at 32.8s with 10 shots, ~18 cuts/min).
// grain: false — the per-frame epGrain feTurbulence filter is removed for
// this episode only (prime suspect in the GitHub render race that tiled
// ~1 in 13 frames in the last two videos). The shared engine is untouched.
export const moneyCount30s = defineEpisode('MoneyCount30s', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10 },
  grain: false,
});
