import React from 'react';
import { makeRoom } from '../room';
import { RoomShell, WallLight } from '../furnish';
import { Box } from '../room';
import { Glow, Dust } from '../light';

// The gym at dusk — a mirrored wall, a rack of dumbbells, a bench press,
// yoga mats rolled in the corner, a skipping rope on the floor, a water
// cooler glowing in the corner. The said-vs-thought split lives here.
export const GYM = makeRoom({ x: 960, y: 540 }, { x0: 220, x1: 1700, y0: 130, y1: 820 }, 3.0);

export const Gym: React.FC<{ t: number }> = ({ t }) => {
  const R = GYM;
  return (
    <g>
      <RoomShell r={R} id="gym" floor="tiles" wall="#3E3A44" side="#322E38" floorC="#2A262E" ceiling="#201A24" />
      {/* mirrored wall */}
      <rect x={300} y={180} width={560} height={380} fill="#8AA0B8" opacity={0.5} />
      <rect x={300} y={180} width={560} height={380} fill="none" stroke="#1A141E" strokeWidth={10} />
      <path d="M 580 180 L 580 560" stroke="#1A141E" strokeWidth={6} />
      <circle cx={460} cy={330} r={40} fill="#F6EFE3" opacity={0.25} />
      <circle cx={700} cy={300} r={30} fill="#FFE7B3" opacity={0.3} />
      {/* dumbbell rack */}
      <g>
        <rect x={1080} y={480} width={420} height={26} fill="#2A2026" />
        <rect x={1100} y={506} width={16} height={130} fill="#2A2026" />
        <rect x={1460} y={506} width={16} height={130} fill="#2A2026" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <circle cx={1130 + i * 100} cy={452} r={26} fill="#26232F" stroke="#5E5A6C" strokeWidth={5} />
            <circle cx={1170 + i * 100} cy={452} r={26} fill="#26232F" stroke="#5E5A6C" strokeWidth={5} />
          </g>
        ))}
      </g>
      {/* bench press */}
      <Box r={R} u={[0.3, 0.52]} v={[0.6, 0.64]} w={[0.5, 0.58]} front="#26232F" top="#3A3446" />
      <rect x={620} y={430} width={300} height={14} fill="#5E5A6C" />
      <circle cx={620} cy={437} r={26} fill="#26232F" stroke="#5E5A6C" strokeWidth={5} />
      <circle cx={920} cy={437} r={26} fill="#26232F" stroke="#5E5A6C" strokeWidth={5} />
      {/* rolled yoga mats */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={1560 + i * 8} y={600 - i * 46} width={130} height={40} rx={20} fill={i % 2 ? '#2A9D8F' : '#7B4B94'} />
          <circle cx={1690 + i * 8} cy={620 - i * 46} r={20} fill="#1E1622" opacity={0.5} />
        </g>
      ))}
      {/* water cooler, glowing */}
      <g>
        <rect x={330} y={560} width={90} height={150} rx={10} fill="#4A4460" />
        <rect x={348} y={480} width={54} height={84} rx={12} fill="#7FD4FF" opacity={0.8} />
        <Glow x={375} y={520} r={90} o={0.5} />
      </g>
      {/* skipping rope on the floor */}
      <path d="M 900 780 Q 1000 860 1150 790" stroke="#E85A3A" strokeWidth={8} fill="none" />
      <WallLight r={R} u={0.14} v={0.3} w={0.1} o={0.5} />
      <WallLight r={R} u={0.86} v={0.3} w={0.1} o={0.5} />
      <Dust t={t} seed={101} x0={300} y0={300} w={1300} h={400} n={16} o={0.22} />
    </g>
  );
};
