import React from 'react';
import { defineEpisode, Timeline } from '../../engine';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9 } from './shots';
import { rewindLook } from '../../engine/light'; // We'll create a new look for the timer

// Create a look that shows a glowing golden outline that pulses when the timer is active
const timerLook: LookDef = {
  grade: (lv) => `saturate(1) contrast(1.2) hue-rotate(0deg) brightness(1.1)`,
  jitter: 3,
  Overlay: ({ f, p, n }) => {
    const secs = 10 * (1 - p);
    const read = `-${String(Math.floor(secs)).padStart(2, '0')}.${String(Math.floor((secs % 1) * 100)).padStart(2, '0')}`;
    return (
      <g>
        <Hero look={LOOKS.pipHood} pose={{ x: 0, y: 0, scale: 0.5, yaw: 0, look: 0 }} />
        <HudChip f={f} label="TIMER" icon="timer" />
        <Dial p={1 - p} readout={read} />
      </g>
    );
  },
};

export const timerMind = defineEpisode('TimerMind', {
  timeline: {
    shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9 },
    looks: { timer: timerLook },
  },
});