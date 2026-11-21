import React from 'react';
import { makeRoom } from '../room';
import { RoomShell, WallLight } from '../furnish';
import { Box } from '../room';
import { Glow, Dust } from '../light';

// The laundromat at night — two rows of round-window washers humming with
// warm light, a pink neon sign in the window, a folding table with a stack
// of towels, laundry baskets, a vending machine glowing in the corner.
// Mom folds laundry here (stand(LAUNDROMAT, u, 0.4)).
export const LAUNDROMAT = makeRoom({ x: 960, y: 540 }, { x0: 220, x1: 1700, y0: 130, y1: 820 }, 3.0);

const Washer: React.FC<{ x: number; y: number; on: boolean; spin: number }> = ({ x, y, on, spin }) => (
  <g>
    <rect x={x} y={y} width={150} height={180} rx={10} fill="#4A4460" stroke="#1E1622" strokeWidth={4} />
    <rect x={x} y={y} width={150} height={34} rx={10} fill="#5E5A6C" />
    <circle cx={x + 75} cy={y + 108} r={48} fill="#101A2A" stroke="#8A8498" strokeWidth={6} />
    <circle cx={x + 75} cy={y + 108} r={34} fill={on ? '#7FD4FF' : '#1E2A3A'} opacity={on ? 0.9 : 0.6} />
    {on ? (
      <g transform={`rotate(${spin * 40} ${x + 75} ${y + 108})`}>
        <circle cx={x + 75} cy={y + 88} r={10} fill="#F6EFE3" opacity={0.9} />
        <circle cx={x + 92} cy={y + 122} r={8} fill="#F2A93D" opacity={0.9} />
      </g>
    ) : null}
    <rect x={x + 18} y={y + 12} width={50} height={10} rx={5} fill="#FFC27A" opacity={on ? 0.9 : 0.3} />
  </g>
);

export const Laundromat: React.FC<{ t: number }> = ({ t }) => {
  const R = LAUNDROMAT;
  const neon = 0.75 + 0.25 * Math.sin(t / 6);
  return (
    <g>
      <RoomShell r={R} id="laund" floor="tiles" wall="#3A3448" side="#2E2838" floorC="#28242E" ceiling="#1E1822" />
      {/* neon sign in the window */}
      <g opacity={neon}>
        <text x={960} y={240} fontFamily="sans-serif" fontWeight={700} fontSize={64} fill="#FF6A9A" textAnchor="middle" style={{ filter: 'drop-shadow(0 0 18px #FF6A9A)' }}>WASH &amp; DRY</text>
        <Glow x={960} y={220} r={220} o={0.4} />
      </g>
      {/* washer rows */}
      {[300, 460, 620].map((x, i) => (
        <Washer key={i} x={x} y={330} on={i !== 1} spin={t + i * 7} />
      ))}
      {[1120, 1280, 1440].map((x, i) => (
        <Washer key={i} x={x} y={330} on={i !== 0} spin={t + i * 11} />
      ))}
      {/* folding table with towels */}
      <Box r={R} u={[0.36, 0.64]} v={[0.6, 0.66]} w={[0.5, 0.6]} front="#5B4038" top="#7A5747" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={860 + i * 12} y={560 - i * 22} width={180} height={20} rx={6} fill={['#F6EFE3', '#7FD4FF', '#F2A93D'][i]} />
      ))}
      {/* laundry baskets */}
      <g>
        <polygon points="560,700 680,700 660,800 580,800" fill="#8A6A3A" />
        <circle cx={600} cy={690} r={22} fill="#F6EFE3" />
        <circle cx={640} cy={686} r={22} fill="#7FD4FF" />
        <polygon points="1260,700 1380,700 1360,800 1280,800" fill="#5A6A3A" />
        <circle cx={1310} cy={690} r={22} fill="#F2A93D" />
      </g>
      {/* vending machine glowing in the corner */}
      <g>
        <rect x={1600} y={330} width={150} height={330} rx={10} fill="#2A2A3A" stroke="#1E1622" strokeWidth={4} />
        <rect x={1620} y={350} width={110} height={180} rx={6} fill="#7FD4FF" opacity={0.75} />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={1630} y={370 + i * 56} width={90} height={34} rx={4} fill={['#E85A3A', '#F2A93D', '#2A9D8F'][i]} opacity={0.9} />
        ))}
        <Glow x={1675} y={440} r={110} o={0.4} />
      </g>
      <WallLight r={R} u={0.5} v={0.18} w={0.1} o={0.6} />
      <Dust t={t} seed={107} x0={300} y0={300} w={1300} h={400} n={16} o={0.22} />
    </g>
  );
};
