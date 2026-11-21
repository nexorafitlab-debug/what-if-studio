import React from 'react';
import { makeRoom } from '../room';
import { RoomShell, WallFrame, WallLight } from '../furnish';
import { Glow, Dust, Cone, LightVeil } from '../light';

// A NEW stairwell, drawn fresh for PastLives1MinV2 — NOT stairwell.tsx.
// A straight flight of stairs climbs left to right up to a landing door,
// a tall arched window at the top pours evening sun down the steps, framed
// pictures line the wall, a hanging lantern glows over the landing.
// Characters walk the floor at the foot of the stairs at about w 0.4
// (stand(PL2STAIRWELL, u, 0.4)). NO clock anywhere on this set.
export const PL2STAIRWELL = makeRoom({ x: 960, y: 540 }, { x0: 200, x1: 1720, y0: 120, y1: 820 }, 3.0);

export const Pl2Stairwell: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'pl2s', veil = 0.32 }) => {
  const R = PL2STAIRWELL;
  const flick = 0.94 + 0.06 * Math.sin(t / 7);
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall="#5A4A52" side="#423842" floorC="#3A2E34" ceiling="#261E28" />
      {/* tall arched window at the top, evening sun */}
      <g>
        <path d="M 1180 560 L 1180 260 Q 1180 150 1300 150 Q 1420 150 1420 260 L 1420 560 Z" fill="#E8915A" />
        <path d="M 1180 560 L 1180 260 Q 1180 150 1300 150 Q 1420 150 1420 260 L 1420 560 Z" fill="#F2C078" opacity={0.6} />
        <circle cx={1300} cy={300} r={52} fill="#FFE7B3" />
        <Glow x={1300} y={300} r={200} o={0.5} />
        <path d="M 1300 150 L 1300 560 M 1180 360 L 1420 360" stroke="#3A2A34" strokeWidth={12} />
      </g>
      <Cone d="M 1220 560 L 1380 560 L 1560 900 L 1040 900 Z" o={0.2} />
      {/* the flight: 8 steps climbing left to right */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = 320 + i * 118;
        const y = 660 - i * 42;
        return (
          <g key={i}>
            <rect x={x} y={y} width={118} height={42} fill="#6A4A38" stroke="#3A2826" strokeWidth={3} />
            <rect x={x} y={y} width={118} height={10} fill="#8A6244" />
          </g>
        );
      })}
      {/* railing along the flight */}
      <path d="M 320 640 L 1260 300" stroke="#3A2E34" strokeWidth={10} strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path key={i} d={`M ${360 + i * 118} ${640 - i * 42} L ${360 + i * 118} ${560 - i * 42}`} stroke="#3A2E34" strokeWidth={7} />
      ))}
      {/* landing door at the top */}
      <rect x={1470} y={220} width={170} height={340} rx={8} fill="#3E5A4A" stroke="#2A3E32" strokeWidth={5} />
      <circle cx={1610} cy={400} r={10} fill="#C9A46A" />
      <rect x={1490} y={250} width={130} height={110} fill="#2A3E32" opacity={0.5} />
      {/* framed pictures on the left wall */}
      <WallFrame x={300} y={220} w={130} h={100} art={1} />
      <WallFrame x={470} y={240} w={110} h={90} art={2} />
      {/* hanging lantern over the stairs (left of the window, clear of the sun) */}
      <g opacity={flick}>
        <path d="M 980 120 L 980 180" stroke="#1E1622" strokeWidth={6} />
        <rect x={952} y={180} width={56} height={70} rx={10} fill="#2A2026" stroke="#3A2E34" strokeWidth={4} />
        <circle cx={980} cy={215} r={16} fill="#FFE7B3" />
        <Glow x={980} y={215} r={130} o={0.55} />
      </g>
      <WallLight r={R} u={0.2} v={0.3} w={0.15} o={0.5} />
      <LightVeil
        id={`${id}veil`}
        lights={[
          [1300, 300, 380],
          [980, 215, 220],
          [960, 900, 360],
        ]}
        o={veil}
      />
      <Dust t={t} seed={207} x0={1150} y0={300} w={400} h={420} n={14} o={0.4} />
    </g>
  );
};
