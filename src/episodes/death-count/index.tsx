import React from 'react';
import { defineEpisode, Timeline, LookDef, Dial, TitleCard } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10 } from './shots';

const deathLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.15 * lv}) brightness(${1 + 0.03 * lv})`,
  Overlay: ({ f, p, n }) => {
    return (
      <g>
        <Dial p={1 - p} readout={`0${String(Math.floor(14 * (1 - p))).slice(-2)}`} x={1800} y={80} fontSize={24} color="#FF3344" />
      </g>
    );
  },
};

export const deathCount = defineEpisode('DeathCount', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10 },
  looks: { death: deathLook },
});