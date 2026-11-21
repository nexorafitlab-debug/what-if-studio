import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27 } from './shots';

// PastLives1MinV4 — 'What If You Could See How Many Lives Everyone Has
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
// v4 fixes: DOTTED house EyeBeam (dasharray 12 8) from the EYE (hip-y via walk.y) —
// the v3 solid arrow + S3/S18 waist-origin bug are gone; S22 gets a payoff (hologram
// ticks 12 -> 11 when the detector lands); places: S9 -> Hallway, S16/S17 -> Library,
// S21 -> Study (corridor x6 -> x3, bedroom x4 -> x3); hum beds thinned so gaps fall
// toward -50 dB (chimes NOT shortened — they already decay in 0.35s).
// Voice: public/past-lives-1min-v4/voice.wav (reused v3 voice, 169 words, verified).
// grain: false. No blur16. Letterbox applied in stitch.sh.
export const pastLives1minV4 = defineEpisode('PastLives1MinV4', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27 },
  grain: false,
});
