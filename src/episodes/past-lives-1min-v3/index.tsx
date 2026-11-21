import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27 } from './shots';

// PastLives1MinV3 — 'What If You Could See How Many Lives Everyone Has
// Lived?' (27 shots, 60.6s). REBUILT to the read-thoughts-40s-v2 standard
// after the user rejected v2 ("long pause in between, unnecessary motion").
// The fix is the VOICEOVER, rebuilt fresh: 169 words (Beat 1 -> Beat 2 ->
// Beat 3 -> Beat 4 Stevenson), Helio + Sam (Kokoro af_heart) + Jordan
// (am_adam), gaps between lines 0.20-0.50s, every chunk whisper-verified,
// full voice 171/171 tokens in order. Plus: a number or graphic in EVERY
// shot, a solid gold arrow from Alex's glowing eyes to every pill, shot sizes
// changing every 1-2s (~27 cuts/min), 10 places, motion tied to words
// only, FREEZE diagram + 12 LIVES dots + tick-down kept, cliffhanger end
// card "PART ONE / WHAT HAPPENS AT ZERO?".
// Voice: public/past-lives-1min-v3/voice.wav. grain: false. No blur16.
export const pastLives1minV3 = defineEpisode('PastLives1MinV3', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27 },
  grain: false,
});
