import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  ShotFrame, RainyStreet, Kitchen, Classroom, Stairwell, Study, Bus, Bedroom,
} from './engine';

// Debug composition: one frame per set, set ALONE, no characters, no Grade
// (grain/vignette) — so the still is the raw set. Used to bake pre-blurred
// backgrounds for the death-count-2min close-ups: the live SVG blur16 filter
// races in Chrome and tiles frames 3x3, so blurred sets are pre-rendered
// stills (ffmpeg gblur sigma 16) under public/death-count-2min/blurred/.
// Frame map: 0 RainyStreet, 1 Kitchen (veil 0.3, as S9), 2 Classroom,
// 3 Stairwell, 4 Study (veil 0.35, as S16), 5 Bus, 6 Bedroom (veil 0.35,
// lamp 0.4, as S35). Props match the shots that use each blurred still.
//   TMPDIR=/home/hatch/tmp-remotion npx remotion still BlurredSets --frame=N out.png
export const BlurredSets: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#0E0C1E' }}>
      <ShotFrame>
        {f === 0 && <RainyStreet t={15} />}
        {f === 1 && <Kitchen t={15} id="k9" veil={0.3} />}
        {f === 2 && <Classroom t={15} id="c12" />}
        {f === 3 && <Stairwell t={15} id="s14" />}
        {f === 4 && <Study t={15} id="st16" veil={0.35} />}
        {f === 5 && <Bus t={15} id="b18" />}
        {f === 6 && <Bedroom t={15} id="bd35" veil={0.35} lamp={0.4} />}
      </ShotFrame>
    </AbsoluteFill>
  );
};
