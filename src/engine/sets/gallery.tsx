import React from 'react';
import { makeRoom } from '../room';
import { RoomShell, WallFrame } from '../furnish';
import { Box } from '../room';
import { Glow, Dust } from '../light';

// The art gallery at dusk — white walls, big framed canvases lit by warm
// spotlights, a bench in the middle, a sculpture plinth, polished floor
// reflecting the light. Characters walk the gallery floor at about w 0.4.
export const GALLERY = makeRoom({ x: 960, y: 540 }, { x0: 220, x1: 1700, y0: 130, y1: 820 }, 3.0);

const Canvas: React.FC<{ x: number; y: number; w: number; h: number; art: 0 | 1 | 2; glow: string }> = ({ x, y, w, h, art, glow }) => (
  <g>
    <rect x={x - 12} y={y - 12} width={w + 24} height={h + 24} fill="#1A141E" />
    <rect x={x} y={y} width={w} height={h} fill="#F6EFE3" />
    {art === 0 ? (
      <g>
        <circle cx={x + w * 0.5} cy={y + h * 0.45} r={w * 0.22} fill="#E85A3A" />
        <polygon points={`${x + w * 0.2},${y + h * 0.8} ${x + w * 0.5},${y + h * 0.3} ${x + w * 0.8},${y + h * 0.8}`} fill="#2A6A8A" />
      </g>
    ) : art === 1 ? (
      <g>
        <rect x={x + w * 0.15} y={y + h * 0.2} width={w * 0.7} height={h * 0.18} fill="#2A9D8F" />
        <rect x={x + w * 0.15} y={y + h * 0.5} width={w * 0.7} height={h * 0.18} fill="#F2A93D" />
        <circle cx={x + w * 0.72} cy={y + h * 0.32} r={w * 0.12} fill="#A8323E" />
      </g>
    ) : (
      <g>
        <path d={`M ${x + w * 0.1} ${y + h * 0.8} Q ${x + w * 0.5} ${y + h * 0.1} ${x + w * 0.9} ${y + h * 0.8}`} stroke="#5A4A7A" strokeWidth={14} fill="none" />
        <circle cx={x + w * 0.3} cy={y + h * 0.3} r={w * 0.1} fill="#F2A93D" />
      </g>
    )}
    {/* spotlight cone + glow */}
    <polygon points={`${x + w / 2 - 14},${y - 120} ${x + w / 2 + 14},${y - 120} ${x + w / 2 + w * 0.4},${y + h * 0.4} ${x + w / 2 - w * 0.4},${y + h * 0.4}`} fill={glow} opacity={0.14} />
    <Glow x={x + w / 2} y={y + h / 2} r={110} o={0.4} />
  </g>
);

export const Gallery: React.FC<{ t: number }> = ({ t }) => {
  const R = GALLERY;
  return (
    <g>
      <RoomShell r={R} id="gal" floor="tiles" wall="#4A4038" side="#3E362E" floorC="#3A322A" ceiling="#241E1A" />
      <Canvas x={300} y={220} w={300} h={220} art={0} glow="#FFD39A" />
      <Canvas x={760} y={200} w={400} h={260} art={1} glow="#FFD39A" />
      <Canvas x={1320} y={220} w={300} h={220} art={2} glow="#FFD39A" />
      {/* small brass plaques under each canvas */}
      {[450, 960, 1470].map((x) => (
        <rect key={x} x={x - 40} y={500} width={80} height={22} rx={4} fill="#8A6A3A" />
      ))}
      {/* sculpture plinth */}
      <Box r={R} u={[0.68, 0.76]} v={[0.55, 0.72]} w={[0.42, 0.5]} front="#2E2433" top="#4A3E52" />
      <circle cx={1400} cy={520} r={34} fill="#7FD4FF" opacity={0.85} />
      <circle cx={1400} cy={470} r={20} fill="#7FD4FF" opacity={0.7} />
      <Glow x={1400} y={500} r={110} o={0.45} />
      {/* bench */}
      <Box r={R} u={[0.3, 0.5]} v={[0.62, 0.66]} w={[0.55, 0.62]} front="#5B4038" top="#8A6452" />
      <WallFrame x={560} y={700} w={140} h={100} art={0} />
      <Dust t={t} seed={71} x0={300} y0={300} w={1300} h={400} n={16} o={0.22} />
    </g>
  );
};
