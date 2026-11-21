import React from 'react';
import { makeRoom } from '../room';
import { RoomShell, WallLight, BackWindow } from '../furnish';
import { Box } from '../room';
import { Glow, Dust, LightVeil } from '../light';

// A NEW school cafeteria, drawn fresh for PastLives1MinV2 (house pack
// #120, CONCEPT until now). Long tables with benches, lunch trays with
// food, a serving counter with steam, big windows with daylight, milk
// cartons. Bright flat fluorescent light with warm window light.
// Characters stand on the floor at about w 0.4 (stand(PL2CAFETERIA, u,
// 0.4)). NO clock anywhere on this set.
export const PL2CAFETERIA = makeRoom({ x: 960, y: 540 }, { x0: 200, x1: 1720, y0: 120, y1: 820 }, 3.0);

const Tray: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-14} width={140} height={28} rx={6} fill="#B8B0A0" />
    <rect x={-56} y={-26} width={44} height={16} rx={4} fill="#E8A0A0" />
    <rect x={6} y={-26} width={44} height={16} rx={4} fill="#FFD39A" />
    <rect x={-20} y={-34} width={20} height={24} rx={3} fill="#F2EFE4" />
  </g>
);

export const Pl2Cafeteria: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'pl2f', veil = 0.28 }) => {
  const R = PL2CAFETERIA;
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall="#6A5A4A" side="#4A3E32" floorC="#3A322A" ceiling="#2A211C" />
      {/* big windows on the back wall, daylight */}
      <BackWindow r={R} id={`${id}win`} t={t} x0={760} x1={1180} y0={170} y1={520} sun={{ x: 970, y: 300 }} cols={2} />
      {/* serving counter, right */}
      <Box r={R} u={[0.68, 0.97]} v={[0.58, 0.66]} w={[0.28, 0.42]} front="#7A7A6A" top="#9A9A8A" />
      <rect x={1420} y={520} width={220} height={60} rx={6} fill="#B8D4F0" opacity={0.35} />
      <text x={1530} y={500} fontFamily="Montserrat, sans-serif" fontWeight={700} fontSize={30} fill="#F2EFE4" textAnchor="middle" letterSpacing={3}>
        LUNCH
      </text>
      {/* steam over the counter */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${1460 + i * 60} 520 q ${Math.sin(t / 9 + i) * 8} -30 0 -56`} stroke="#F2EFE4" strokeWidth={5} fill="none" opacity={0.35 + 0.15 * Math.sin(t / 7 + i)} />
      ))}
      {/* long tables with benches */}
      <Box r={R} u={[0.06, 0.4]} v={[0.66, 0.72]} w={[0.4, 0.56]} front="#5B4038" top="#7A5747" />
      <Box r={R} u={[0.06, 0.4]} v={[0.78, 0.82]} w={[0.44, 0.58]} front="#4A3226" top="#5B4038" />
      <Box r={R} u={[0.56, 0.9]} v={[0.66, 0.72]} w={[0.4, 0.56]} front="#5B4038" top="#7A5747" />
      <Box r={R} u={[0.56, 0.9]} v={[0.78, 0.82]} w={[0.44, 0.58]} front="#4A3226" top="#5B4038" />
      {/* trays on the tables */}
      <Tray x={480} y={640} s={0.9} />
      <Tray x={640} y={650} s={0.85} />
      <Tray x={1230} y={640} s={0.9} />
      <Tray x={1400} y={650} s={0.85} />
      {/* milk cartons */}
      {[
        { x: 560, y: 620 },
        { x: 1300, y: 620 },
      ].map((m, i) => (
        <g key={i}>
          <rect x={m.x} y={m.y} width={26} height={34} rx={3} fill="#F2EFE4" />
          <polygon points={`${m.x},${m.y} ${m.x + 26},${m.y} ${m.x + 18},${m.y - 12} ${m.x + 8},${m.y - 12}`} fill="#E8823A" />
        </g>
      ))}
      <WallLight r={R} u={0.3} v={0.16} w={0.2} o={0.5} />
      <WallLight r={R} u={0.7} v={0.16} w={0.2} o={0.5} />
      <LightVeil
        id={`${id}veil`}
        lights={[
          [970, 350, 420],
          [960, 200, 300],
          [960, 900, 380],
        ]}
        o={veil}
      />
      <Glow x={970} y={350} r={240} o={0.35} />
      <Dust t={t} seed={213} x0={700} y0={300} w={500} h={400} n={14} o={0.3} />
    </g>
  );
};
