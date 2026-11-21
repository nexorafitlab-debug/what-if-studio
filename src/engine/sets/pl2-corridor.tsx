import React from 'react';
import { makeRoom } from '../room';
import { RoomShell, WallFrame } from '../furnish';
import { Box } from '../room';
import { Glow, Dust, Cone, LightVeil } from '../light';

// A NEW school corridor, drawn fresh for PastLives1MinV2 — NOT pl-hallway
// (teal/burgundy lockers, bench, sun window) and NOT hallway.tsx. This one
// is blue lockers on the left, a glass trophy case and cork notice board on
// the right, classroom doors with small windows, a drinking fountain, flat
// fluorescent light. Characters stand on the floor at about w 0.4
// (stand(PL2CORRIDOR, u, 0.4)). NO clock anywhere on this set.
export const PL2CORRIDOR = makeRoom({ x: 960, y: 540 }, { x0: 200, x1: 1720, y0: 120, y1: 820 }, 3.0);

const BLUE = ['#2E5A7A', '#356A8A', '#2A526E', '#3A7494'];

const LockerRow: React.FC<{ x0: number; cols: string[] }> = ({ x0, cols }) => (
  <g>
    {cols.map((c, i) => {
      const x = x0 + i * 118;
      return (
        <g key={i}>
          <rect x={x} y={230} width={110} height={420} fill={c} stroke="#1E1622" strokeWidth={4} />
          <rect x={x + 16} y={260} width={44} height={8} rx={4} fill="#1E1622" opacity={0.55} />
          <rect x={x + 16} y={276} width={44} height={8} rx={4} fill="#1E1622" opacity={0.55} />
          <rect x={x + 80} y={410} width={12} height={30} rx={6} fill="#C8B49A" />
        </g>
      );
    })}
  </g>
);

export const Pl2Corridor: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'pl2k', veil = 0.3 }) => {
  const R = PL2CORRIDOR;
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall="#5A5A48" side="#424232" floorC="#36362A" ceiling="#26261E" />
      {/* classroom doors on the back wall, centre */}
      {[
        { x: 820, c: '#4A3A2E' },
        { x: 1010, c: '#4A3A2E' },
      ].map((d, i) => (
        <g key={i}>
          <rect x={d.x} y={220} width={150} height={430} rx={6} fill={d.c} stroke="#2A211C" strokeWidth={5} />
          <rect x={d.x + 25} y={250} width={100} height={130} rx={4} fill="#BFD6E8" opacity={0.7} stroke="#2A211C" strokeWidth={4} />
          <circle cx={d.x + 128} cy={440} r={9} fill="#C9A46A" />
        </g>
      ))}
      {/* blue lockers, left */}
      <LockerRow x0={268} cols={BLUE} />
      {/* trophy case, right — gold cups on two shelves */}
      <g>
        <rect x={1330} y={240} width={300} height={400} rx={8} fill="#2A2E38" stroke="#8A6A3A" strokeWidth={5} />
        <rect x={1350} y={260} width={260} height={360} fill="#BFD6E8" opacity={0.28} />
        {[0, 1, 2].map((i) => {
          const cx = 1400 + i * 80;
          const cy = 600 - i * 110;
          return (
            <g key={i}>
              {/* cup */}
              <path d={`M ${cx - 16} ${cy - 34} L ${cx + 16} ${cy - 34} L ${cx + 11} ${cy - 2} L ${cx - 11} ${cy - 2} Z`} fill="#FFD700" stroke="#8A6A3A" strokeWidth={3} />
              <path d={`M ${cx - 16} ${cy - 30} q -14 6 0 18 M ${cx + 16} ${cy - 30} q 14 6 0 18`} stroke="#FFD700" strokeWidth={4} fill="none" />
              <path d={`M ${cx} ${cy - 2} L ${cx} ${cy + 8}`} stroke="#FFD700" strokeWidth={6} />
              <rect x={cx - 16} y={cy + 8} width={32} height={8} rx={3} fill="#8A6A3A" />
            </g>
          );
        })}
        <rect x={1330} y={400} width={300} height={8} fill="#8A6A3A" />
      </g>
      {/* cork notice board above the case */}
      <rect x={1360} y={150} width={240} height={70} rx={6} fill="#8A6A4A" stroke="#5E462E" strokeWidth={4} />
      {[
        { x: 1380, c: '#F2EFE4' },
        { x: 1430, c: '#FFD39A' },
        { x: 1480, c: '#BFD6E8' },
        { x: 1530, c: '#E8A0A0' },
      ].map((p, i) => (
        <rect key={i} x={p.x} y={164} width={40} height={44} fill={p.c} opacity={0.92} />
      ))}
      {/* drinking fountain, far right */}
      <g>
        <rect x={1660} y={560} width={60} height={90} rx={8} fill="#7A8A9A" />
        <rect x={1672} y={520} width={36} height={40} rx={6} fill="#9AAABA" />
      </g>
      {/* fluorescent tubes */}
      {[620, 960, 1300].map((x) => (
        <g key={x}>
          <rect x={x - 80} y={138} width={160} height={16} rx={8} fill="#FFF3D0" />
          <Glow x={x} y={146} r={120} o={0.28} />
        </g>
      ))}
      <Cone d="M 860 650 L 1120 650 L 1300 900 L 680 900 Z" o={0.16} />
      <WallFrame x={700} y={680} w={120} h={90} art={2} />
      <LightVeil
        id={`${id}veil`}
        lights={[
          [960, 400, 420],
          [620, 146, 240],
          [1300, 146, 240],
          [960, 900, 380],
        ]}
        o={veil}
      />
      <Dust t={t} seed={211} x0={300} y0={300} w={1300} h={380} n={12} o={0.16} />
    </g>
  );
};
