import React from 'react';
import { makeRoom } from '../room';
import { RoomShell, WallLight } from '../furnish';
import { Box } from '../room';
import { Glow, Dust, LightVeil } from '../light';

// A NEW bathroom, drawn fresh for PastLives1MinV2 (house pack #68, DRAWN
// as bathroom.tsx, but this one is new: warm bulb light, big mirror on the
// back wall, sink below it, towel on a ring, small moonlit window). The
// mirror shows only the detector's blue glow reflected — no figure, so no
// mismatched reflection. Characters stand on the floor at about w 0.4
// (stand(PL2BATHROOM, u, 0.4)). NO clock anywhere on this set.
export const PL2BATHROOM = makeRoom({ x: 960, y: 540 }, { x0: 420, x1: 1500, y0: 300, y1: 760 }, 3.4);

/** The mirror's screen rect (its centre is the reflection point). */
export const PL2B_MIRROR = { x: 960, y: 480 };

export const Pl2Bathroom: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'pl2h', veil = 0.4 }) => {
  const R = PL2BATHROOM;
  const bulb = 0.92 + 0.08 * Math.sin(t / 9);
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall="#4A5A6A" side="#36444E" floorC="#2A3238" ceiling="#1E242A" />
      {/* tile grid lines on the back wall */}
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={`v${i}`} d={`M ${480 + i * 120} 300 L ${480 + i * 120} 760`} stroke="#2A3238" strokeWidth={3} opacity={0.6} />
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <path key={`h${i}`} d={`M 420 ${380 + i * 120} L 1500 ${380 + i * 120}`} stroke="#2A3238" strokeWidth={3} opacity={0.6} />
      ))}
      {/* small moonlit window, upper left */}
      <rect x={520} y={340} width={150} height={180} rx={6} fill="#2A3A5A" stroke="#1E242A" strokeWidth={6} />
      <circle cx={595} cy={410} r={28} fill="#E8ECF2" />
      <Glow x={595} y={410} r={110} o={0.4} />
      <path d="M 595 340 L 595 520 M 520 430 L 670 430" stroke="#1E242A" strokeWidth={8} />
      {/* the big mirror on the back wall */}
      <g>
        <rect x={780} y={330} width={360} height={300} rx={14} fill="#9AB2C0" stroke="#3A4A56" strokeWidth={8} />
        <rect x={800} y={350} width={320} height={260} rx={8} fill="#B8C8D4" opacity={0.85} />
        {/* the detector's blue glow reflected in the glass */}
        <circle cx={960} cy={440} r={26} fill="#7FD4FF" opacity={0.5} />
        <Glow x={960} y={440} r={90} o={0.5} />
        <circle cx={900} cy={560} r={14} fill="#FFFFFF" opacity={0.35} />
        <circle cx={1040} cy={380} r={10} fill="#FFFFFF" opacity={0.3} />
      </g>
      {/* warm bulb above the mirror */}
      <g opacity={bulb}>
        <path d="M 960 300 L 960 322" stroke="#2A2026" strokeWidth={6} />
        <circle cx={960} cy={336} r={14} fill="#FFE7B3" />
        <Glow x={960} y={336} r={120} o={0.55} />
      </g>
      {/* sink + faucet below the mirror */}
      <Box r={R} u={[0.36, 0.64]} v={[0.72, 0.8]} w={[0.28, 0.44]} front="#B8C4C8" top="#D8E2E8" />
      <path d="M 960 560 q 0 -40 30 -40" stroke="#8A9AAA" strokeWidth={9} fill="none" />
      <circle cx={990} cy={520} r={6} fill="#8A9AAA" />
      {/* towel on a ring, right */}
      <circle cx={1330} cy={430} r={26} fill="none" stroke="#8A9AAA" strokeWidth={6} />
      <rect x={1300} y={440} width={60} height={110} rx={8} fill="#E8823A" />
      <rect x={1300} y={440} width={60} height={20} rx={8} fill="#C96A2A" />
      {/* bath mat + toothbrush cup on the sink */}
      <ellipse cx={960} cy={900} rx={200} ry={26} fill="#2A9D8F" opacity={0.7} />
      <rect x={820} y={540} width={26} height={36} rx={4} fill="#2A9D8F" />
      <path d="M 826 540 L 820 506 M 840 540 L 846 508" stroke="#E8E2D2" strokeWidth={5} strokeLinecap="round" />
      <WallLight r={R} u={0.85} v={0.3} w={0.15} o={0.4} />
      <LightVeil
        id={`${id}veil`}
        lights={[
          [960, 336, 300],
          [595, 410, 200],
          [960, 900, 340],
        ]}
        o={veil}
      />
      <Dust t={t} seed={229} x0={700} y0={400} w={500} h={300} n={12} o={0.3} />
    </g>
  );
};
