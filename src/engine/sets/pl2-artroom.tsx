import React from 'react';
import { makeRoom } from '../room';
import { RoomShell, WallFrame, BackWindow } from '../furnish';
import { Box } from '../room';
import { Glow, Dust, LightVeil } from '../light';

// A NEW art room, drawn fresh for PastLives1MinV2. Easels with half-finished
// paintings, a table of paint jars and brushes, a sink, posters, a big
// north window with cool daylight. Colourful where the rest of the school
// is muted. Characters stand on the floor at about w 0.4
// (stand(PL2ARTROOM, u, 0.4)). NO clock anywhere on this set.
export const PL2ARTROOM = makeRoom({ x: 960, y: 540 }, { x0: 200, x1: 1720, y0: 120, y1: 820 }, 3.0);

const Easel: React.FC<{ x: number; y: number; s: number; c1: string; c2: string }> = ({ x, y, s, c1, c2 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={70} ry={8} fill="#000" opacity={0.3} />
    <path d="M -50 0 L -20 -190 M 50 0 L 20 -190 M 0 0 L 0 -200" stroke="#5B4038" strokeWidth={9} strokeLinecap="round" />
    <rect x={-72} y={-190} width={144} height={120} rx={4} fill="#F2EFE4" stroke="#7A5747" strokeWidth={5} />
    <circle cx={-30} cy={-150} r={26} fill={c1} opacity={0.85} />
    <path d="M -72 -100 L 10 -130 L 72 -90 L 72 -70 L -72 -70 Z" fill={c2} opacity={0.85} />
    <circle cx={34} cy={-158} r={16} fill={c2} opacity={0.85} />
  </g>
);

export const Pl2ArtRoom: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'pl2a', veil = 0.28 }) => {
  const R = PL2ARTROOM;
  return (
    <g>
      <RoomShell r={R} id={id} floor="boards" wall="#5A4A6A" side="#423852" floorC="#342A3E" ceiling="#241C2E" />
      {/* big north window, cool daylight */}
      <BackWindow r={R} id={`${id}win`} t={t} x0={1120} x1={1660} y0={170} y1={560} sun={{ x: 1400, y: 280 }} cols={3} />
      {/* posters on the left wall */}
      <WallFrame x={300} y={220} w={140} h={170} art={1} />
      <WallFrame x={480} y={250} w={120} h={140} art={2} />
      {/* paint table with jars and brushes */}
      <Box r={R} u={[0.06, 0.34]} v={[0.62, 0.68]} w={[0.32, 0.46]} front="#5B4038" top="#7A5747" />
      {['#E84A4A', '#2E6FF0', '#E8C832', '#2A9D5A', '#7B4B94'].map((c, i) => (
        <g key={i}>
          <rect x={330 + i * 62} y={540} width={34} height={44} rx={5} fill={c} />
          <rect x={330 + i * 62} y={528} width={34} height={12} rx={3} fill="#F2EFE4" opacity={0.8} />
        </g>
      ))}
      <path d="M 700 540 L 730 480 M 720 540 L 760 486" stroke="#7A5747" strokeWidth={6} strokeLinecap="round" />
      {/* sink, right wall */}
      <g>
        <rect x={1580} y={560} width={110} height={70} rx={10} fill="#B8C4C8" />
        <path d="M 1635 560 q 0 -34 26 -34" stroke="#8A9AAA" strokeWidth={8} fill="none" />
      </g>
      {/* easels */}
      <Easel x={620} y={700} s={1.0} c1="#E84A4A" c2="#2E6FF0" />
      <Easel x={920} y={720} s={0.9} c1="#E8C832" c2="#2A9D5A" />
      <Easel x={1420} y={700} s={0.85} c1="#7B4B94" c2="#E84A4A" />
      {/* paint splats on the floor */}
      {[
        { x: 520, y: 860, c: '#E84A4A' },
        { x: 780, y: 900, c: '#2E6FF0' },
        { x: 1150, y: 870, c: '#E8C832' },
      ].map((p, i) => (
        <ellipse key={i} cx={p.x} cy={p.y} rx={26} ry={8} fill={p.c} opacity={0.6} />
      ))}
      <LightVeil
        id={`${id}veil`}
        lights={[
          [1400, 360, 420],
          [960, 300, 300],
          [960, 900, 360],
        ]}
        o={veil}
      />
      <Glow x={1400} y={360} r={240} o={0.35} />
      <Dust t={t} seed={217} x0={1100} y0={300} w={500} h={400} n={14} o={0.3} />
    </g>
  );
};
