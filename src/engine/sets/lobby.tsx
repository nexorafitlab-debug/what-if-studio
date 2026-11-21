import React from 'react';
import { makeRoom } from '../room';
import { RoomShell, WallLight, FloorPlant, WallClock } from '../furnish';
import { Box } from '../room';
import { Glow, Dust } from '../light';

// The office lobby at dusk — a long reception desk, two elevator doors with
// brass trim, a wall clock, tall plants, a glowing directory board, and the
// glass front doors with the city behind. Characters stand at about w 0.4.
export const LOBBY = makeRoom({ x: 960, y: 540 }, { x0: 200, x1: 1720, y0: 140, y1: 820 }, 3.0);

export const Lobby: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'lobby', veil = 0 }) => {
  const R = LOBBY;
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall="#3E3542" side="#322A38" floorC="#2C262E" ceiling="#221A26" />
      {/* glass front doors: the dusk city behind */}
      <rect x={760} y={180} width={400} height={460} fill="#241A3E" />
      <rect x={780} y={200} width={360} height={440} fill="#3E2E52" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={800 + i * 90} y={640 - 140 - (i % 2) * 60} width={56} height={140 + (i % 2) * 60} fill="#2A1B45" />
          <rect x={810 + i * 90} y={660 - 140 - (i % 2) * 60} width={10} height={12} fill="#FFC27A" opacity={0.8} />
          <rect x={830 + i * 90} y={690 - 140 - (i % 2) * 60} width={10} height={12} fill="#FFC27A" opacity={0.6} />
        </g>
      ))}
      <circle cx={1060} cy={300} r={40} fill="#FFE7B3" opacity={0.9} />
      <Glow x={1060} y={300} r={150} o={0.45} />
      <path d="M 950 180 L 950 640 M 760 180 L 1160 180 M 760 640 L 1160 640" stroke="#1A141E" strokeWidth={16} />
      {/* elevator doors, brass trim */}
      {[330, 1470].map((x) => (
        <g key={x}>
          <rect x={x} y={200} width={190} height={440} fill="#8A6A3A" />
          <rect x={x + 14} y={214} width={162} height={426} fill="#4A4460" />
          <path d={`M ${x + 95} 214 L ${x + 95} 640`} stroke="#2A2430" strokeWidth={6} />
          <rect x={x + 60} y={420} width={70} height={14} rx={7} fill="#FFC27A" opacity={0.85} />
          <circle cx={x + 95} cy={180} r={12} fill="#FF3344" opacity={0.9} />
        </g>
      ))}
      {/* glowing directory board */}
      <g>
        <rect x={600} y={240} width={120} height={180} rx={8} fill="#101A2A" stroke="#FFB46A" strokeWidth={3} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={614} y={258 + i * 38} width={92 - i * 12} height={10} rx={5} fill="#FFC27A" opacity={0.85 - i * 0.15} />
        ))}
      </g>
      <WallClock x={960} y={160} r={34} t={t} />
      <WallLight r={R} u={0.16} v={0.3} w={0.1} />
      <WallLight r={R} u={0.84} v={0.3} w={0.1} />
      {/* reception desk */}
      <Box r={R} u={[0.36, 0.64]} v={[0.6, 0.68]} w={[0.5, 0.6]} front="#2E2228" top="#5B4038" rim />
      <rect x={880} y={560} width={160} height={60} rx={6} fill="#101A2A" />
      <circle cx={960} cy={590} r={18} fill="#7FD4FF" opacity={0.9} />
      <Glow x={960} y={590} r={90} o={0.5} />
      <FloorPlant r={R} u={0.08} w={0.35} size={1.2} />
      <FloorPlant r={R} u={0.92} w={0.35} size={1.2} />
      <Dust t={t} seed={41} x0={300} y0={300} w={1300} h={400} n={18} o={0.25} />
      {veil > 0 ? <rect x={-400} y={-400} width={2720} height={1880} fill="#000" opacity={veil} /> : null}
    </g>
  );
};
