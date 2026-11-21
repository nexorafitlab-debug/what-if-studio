import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17 } from './shots';

// Allergies40s — 'What If You Could Read Anyone's Allergies?' (17 shots,
// 40.8s / 1224 frames). Built ONLY from Claude's delivery (Beat 1's 12
// shots b1-01..b1-12 + a title card for Beat 2, first 105 words of
// allergies-narration.txt). Voice: Helio, 2 chunks, whisper-verified.
// Label correction: girl POLLEN, driver CATS everywhere (narration wins
// over scenes.json's swapped labels in b1-08/b1-10/b1-11/b1-12).
// grain: false. Letterbox applied in stitch.sh. No whoosh on any cut.
export const allergies40s = defineEpisode('Allergies40s', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17 },
  grain: false,
});
