import React from 'react';
import { rnd } from '../anim';
import { makeRoom } from '../room';
import { RoomShell, WallLight, WallClock } from '../furnish';
import { Box } from '../room';
import { Glow, Dust } from '../light';

// The school corridor — rows of coloured lockers, a cork notice board with
// pinned papers, classroom doors with small windows, a drinking fountain,
// fluorescent tubes humming overhead. The teacher waits by the lockers
// (stand(HALLWAY, u, 0.4)).
export const HALLWAY = makeRoom({ x: 960, y: 540 }, { x0: 220, x1: 1700, y0: 130, y1: 820 }, 3.0);

const LOCKER = ['#3A5A6A', '#5A6A3A', '#6A4A5A', '#4A5A7A'];

export const Hallway: React.FC<{ t: number }> = ({ t }) => {
  const R = HALLWAY;
  const flick = 0.85 + 0.15 * Math.sin(t / 3);
  return (
    <g>
      <RoomShell r={R} id="hall" floor="tiles" wall="#463A44" side="#382E38" floorC="#2E282C" ceiling="#221C24" />
      {/* lockers along the left wall */}
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}>
          <rect x={280 + i * 120} y={220} width={110} height={420} fill={LOCKER[i % 4]} stroke="#1E1622" strokeWidth={4} />
          <rect x={280 + i * 120 + 78} y={400} width={12} height={30} rx={6} fill="#C8B49A" />
          <rect x={280 + i * 120 + 14} y={250} width={40} height={8} rx={4} fill="#1E1622" opacity={0.6} />
          {i === 2 ? <rect x={280 + i * 120 + 20} y={300} width={70} height={90} rx={4} fill="#F6EFE3" opacity={0.9} /> : null}
        </g>
      ))}
      {/* notice board with pinned papers */}
      <g>
        <rect x={980} y={230} width={300} height={220} rx={8} fill="#6A4A3A" stroke="#3A2826" strokeWidth={6} />
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i}>
            <rect x={996 + (i % 3) * 96} y={246 + Math.floor(i / 3) * 96} width={80} height={80} fill="#F6EFE3" opacity={0.92} transform={`rotate(${rnd(81, i) * 10 - 5} ${1036 + (i % 3) * 96} ${286 + Math.floor(i / 3) * 96})`} />
            <circle cx={1036 + (i % 3) * 96} cy={256 + Math.floor(i / 3) * 96} r={6} fill={i % 2 ? '#A8323E' : '#2A6A8A'} />
          </g>
        ))}
      </g>
      {/* classroom doors on the right */}
      {[1340, 1560].map((x) => (
        <g key={x}>
          <rect x={x} y={240} width={130} height={400} fill="#5B4038" stroke="#2A1C1A" strokeWidth={5} />
          <rect x={x + 30} y={290} width={70} height={90} rx={6} fill="#B8D4F0" opacity={0.7} />
          <circle cx={x + 108} cy={440} r={9} fill="#FFC27A" />
        </g>
      ))}
      <WallClock x={960} y={170} r={30} t={t} />
      {/* fluorescent tubes */}
      {[700, 960, 1220].map((x) => (
        <g key={x} opacity={flick}>
          <rect x={x - 80} y={140} width={160} height={16} rx={8} fill="#E8F0FF" />
          <Glow x={x} y={148} r={130} o={0.35} />
        </g>
      ))}
      <WallLight r={R} u={0.1} v={0.32} w={0.1} o={0.4} />
      {/* drinking fountain */}
      <Box r={R} u={[0.8, 0.88]} v={[0.58, 0.7]} w={[0.4, 0.48]} front="#5E5A6C" top="#7A7488" />
      <Dust t={t} seed={83} x0={300} y0={300} w={1300} h={400} n={16} o={0.22} />
    </g>
  );
};
