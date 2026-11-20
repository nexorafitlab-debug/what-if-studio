import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S15, S24, S25, S28, S29, S30 } from './shots';

// 30s money-count sample v2: FOUR environments in 30 seconds (the v1 sample
// was a single lunch-line scene). Reuses the full video's voice segments and
// the full episode's shot specs: classroom S1-S3 (the $40 appears) -> dark
// void S15 (title) -> bathroom S24-S25 (nothing above your head) -> kitchen
// S28-S30 (Mom's $86 drops $112). Voice is Kokoro am_michael, sliced from
// the full 557s voiceover with 0.35s gaps between beats (80 words, 909
// frames, ~30.3s). Mom's pill is $86 here — the full episode leaves her
// balance blank, which reads as a rendering bug; $86 is under $100 (red)
// and the $112 bill is the payoff in S30.
// grain: false — the per-frame epGrain feTurbulence filter is removed for
// this episode only (prime suspect in the GitHub render race that tiled
// ~1 in 13 frames in the last two videos). The shared engine is untouched.
export const moneyCount30sV2 = defineEpisode('MoneyCount30sV2', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S15, S24, S25, S28, S29, S30 },
  grain: false,
});
