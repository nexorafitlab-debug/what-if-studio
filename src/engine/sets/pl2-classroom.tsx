import React from 'react';
import { makeRoom } from '../room';
import { RoomShell, WallFrame, WallLight, BackWindow } from '../furnish';
import { Box } from '../room';
import { Glow, Dust, Cone, LightVeil } from '../light';

// A NEW classroom, drawn fresh for PastLives1MinV2 — NOT classroom.tsx.
// Morning: desks in two rows facing the chalkboard on the left wall,
// tall windows on the right wall spilling sun across the tiled floor,
// the teacher's desk with a globe, a pinboard of class work. Characters
// stand on the floor at about w 0.4 (stand(PL2CLASSROOM, u, 0.4)).
// NO clock anywhere on this set.
export const PL2CLASSROOM = makeRoom({ x: 960, y: 540 }, { x0: 200, x1: 1720, y0: 120, y1: 820 }, 3.0);

const Desk: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={120} ry={10} fill="#000" opacity={0.3} />
    <rect x={-110} y={-70} width={220} height={16} rx={6} fill="#7A5747" />
    <rect x={-110} y={-54} width={220} height={64} fill="#5B4038" />
    <rect x={-100} y={10} width={14} height={60} fill="#3A2826" />
    <rect x={86} y={10} width={14} height={60} fill="#3A2826" />
    <rect x={-70} y={-96} width={60} height={24} rx={3} fill="#4A6A8A" />
    <rect x={10} y={-92} width={46} height={18} rx={3} fill="#7A4A3A" />
    <rect x={64} y={-100} width={22} height={28} rx={4} fill="#2A9D8F" />
  </g>
);

export const Pl2Classroom: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'pl2c', veil = 0.3 }) => {
  const R = PL2CLASSROOM;
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall="#4A5A52" side="#36443C" floorC="#3A3630" ceiling="#242A26" />
      {/* chalkboard on the back wall, left */}
      <rect x={300} y={200} width={560} height={300} rx={8} fill="#2E4A3A" stroke="#7A5747" strokeWidth={10} />
      <text x={580} y={320} fontFamily="Montserrat, sans-serif" fontWeight={700} fontSize={52} fill="#F2EFE4" textAnchor="middle">
        7 × 8 = ?
      </text>
      <text x={580} y={400} fontFamily="Montserrat, sans-serif" fontWeight={600} fontSize={30} fill="#C9D4C2" textAnchor="middle">
        Good morning, class!
      </text>
      <rect x={380} y={470} width={120} height={10} rx={5} fill="#7A5747" />
      <rect x={700} y={466} width={34} height={16} rx={4} fill="#F2EFE4" opacity={0.9} />
      {/* tall windows on the right wall, morning sun */}
      <BackWindow r={R} id={`${id}win`} t={t} x0={1180} x1={1660} y0={170} y1={560} sun={{ x: 1520, y: 280 }} cols={3} />
      <Cone d="M 1240 560 L 1600 560 L 1780 900 L 1080 900 Z" o={0.22} />
      {/* pinboard of class work */}
      <rect x={920} y={220} width={220} height={170} rx={8} fill="#8A6A4A" stroke="#5E462E" strokeWidth={5} />
      {[
        { x: 940, y: 240, c: '#F2EFE4' },
        { x: 1010, y: 250, c: '#FFD39A' },
        { x: 940, y: 310, c: '#BFD6E8' },
        { x: 1010, y: 315, c: '#E8A0A0' },
      ].map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={56} height={64} fill={p.c} opacity={0.92} transform={`rotate(${(i % 2 ? -4 : 4)} ${p.x + 28} ${p.y + 32})`} />
      ))}
      <WallFrame x={340} y={560} w={130} h={100} art={1} />
      {/* teacher's desk with a globe */}
      <Box r={R} u={[0.62, 0.86]} v={[0.6, 0.66]} w={[0.3, 0.44]} front="#5B4038" top="#7A5747" />
      <circle cx={1420} cy={560} r={34} fill="#4A6A8A" stroke="#2E4258" strokeWidth={4} />
      <path d="M 1420 594 L 1420 620" stroke="#2E4258" strokeWidth={8} />
      {/* student desks, two rows */}
      <Desk x={520} y={700} s={0.85} />
      <Desk x={820} y={720} s={0.9} />
      <Desk x={520} y={850} s={1.0} />
      <Desk x={860} y={870} s={1.05} />
      <WallLight r={R} u={0.5} v={0.18} w={0.2} o={0.5} />
      <LightVeil
        id={`${id}veil`}
        lights={[
          [1420, 400, 420],
          [960, 300, 300],
          [960, 900, 380],
        ]}
        o={veil}
      />
      <Glow x={1420} y={360} r={240} o={0.35} />
      <Dust t={t} seed={203} x0={1200} y0={300} w={420} h={420} n={16} o={0.45} />
    </g>
  );
};
