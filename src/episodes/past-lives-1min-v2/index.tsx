import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20 } from './shots';

// PastLives1MinV2 — 'What If You Could See How Many Lives Everyone Has
// Lived?' (20 shots, 60.0s). REBUILT from scratch to the read-thoughts-40s-v2
// standard after the user rejected v1 (BGM inaudible, some SFX missing,
// long scenes, a hand rotating in a loop, no vector illustrations).
//   1. TEN places in 60s: 9 brand-new sets (gate, classroom, stairwell,
//      corridor, cafeteria, art room, bedroom, bathroom, evening street)
//      + the starry void. A new place every 1-2 shots; no set is re-framed
//      as a "new" place.
//   2. NO shot longer than 4s (max 120f); most are 90f (3s) — cut every ~3s.
//   3. MOVEMENT: one purposeful action per shot, tied to the narration
//      (walk, reach + tap, startle, point, lift, adjust, head turn).
//      NO looping limb motion: every Actor's keys move monotonically to
//      ONE pose and hold — no A->B->A oscillation. Walk cycles (walkPose)
//      only while a character is actually walking. NO WallClock anywhere
//      (its hand rotated continuously in v1 — the likely "rotating hand").
//   4. STRONGER VFX + ILLUSTRATIONS: pill pop with overshoot + ring +
//      sparkle + eye-beam (S8); FREEZE diagram (S14: detector -> beam ->
//      pill); "12 LIVES" illustrated graphic with 12 life dots (S15);
//      tick-down 12 -> 11 big and clear (S18, the ONE slow push-in).
//   5. NITS FIXED: no sitting pose at all (S1 is a walk); S18/S19 keep
//      Alex's head well inside the frame; window pills are BIG (S16 zoom
//      1.25, walker scale 1.0, pill scale 1.0).
//   6. SOUND: the v1 voiceover is REUSED unchanged (Helio + Kokoro
//      af_heart, 98 words, whisper-verified). Music stem rebuilt louder
//      (~-44 dB mean, was -48) and SFX rebuilt for the new shot timings
//      with a sound on EVERY action + continuous ambient room tone.
// Voice: public/past-lives-1min-v2/voice.wav (copy of the verified v1
// voice). grain: false. No blur16 filter anywhere.
export const pastLives1minV2 = defineEpisode('PastLives1MinV2', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20 },
  grain: false,
});
