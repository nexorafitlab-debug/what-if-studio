import React from 'react';
import { makeRoom } from '../room';
import { Sun } from '../kit';
import { Glow, Dust } from '../light';

// The school gate on a bright morning — drawn fresh for PastLives1MinV2.
// The brick school building behind, tall iron gates swung open, two brick
// pillars, green trees, the morning sun low on the right, the sidewalk
// running across the frame. Characters walk the sidewalk at w 0.4
// (stand(PL2GATE, u, 0.4)). NO clock anywhere on this set.
export const PL2GATE = makeRoom({ x: 960, y: 540 }, { x0: 0, x1: 1920, y0: 540, y1: 820 }, 3.0);

export const Pl2Gate: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {/* morning sky */}
    <rect x={-400} y={-400} width={2720} height={1040} fill="#7FB2D9" />
    <rect x={-400} y={180} width={2720} height={460} fill="#A8C8DE" />
    <Sun x={1500} y={180} r={90} t={t} rays={false} />
    <Glow x={1500} y={180} r={260} o={0.5} />
    {/* soft clouds */}
    {[
      { x: 300, y: 150, w: 260 },
      { x: 800, y: 90, w: 200 },
      { x: 1150, y: 220, w: 220 },
    ].map((c, i) => (
      <g key={i} fill="#F2F6FA" opacity={0.85}>
        <ellipse cx={c.x} cy={c.y} rx={c.w / 2} ry={26} />
        <ellipse cx={c.x + 40} cy={c.y - 16} rx={c.w / 3} ry={20} />
      </g>
    ))}
    {/* the school building: brick, two floors of windows, sign */}
    <rect x={-400} y={300} width={2720} height={340} fill="#8A5A44" />
    <rect x={-400} y={300} width={2720} height={340} fill="url(#g3fadeDown)" opacity={0.2} />
    {Array.from({ length: 16 }).map((_, i) => (
      <rect key={i} x={-320 + (i % 8) * 290} y={340 + Math.floor(i / 8) * 130} width={150} height={90} fill="#BFD6E8" opacity={0.85} stroke="#5E3A2C" strokeWidth={6} />
    ))}
    <rect x={760} y={250} width={400} height={64} rx={10} fill="#F2EFE4" stroke="#5E3A2C" strokeWidth={5} />
    <text x={960} y={296} fontFamily="Montserrat, sans-serif" fontWeight={700} fontSize={38} fill="#3A2A22" textAnchor="middle" letterSpacing={4}>
      SCHOOL
    </text>
    {/* trees flanking the gate */}
    {[
      { x: 120, s: 1.1 },
      { x: 1820, s: 0.95 },
    ].map((tr, i) => (
      <g key={i} transform={`translate(${tr.x} 0) scale(${tr.s})`}>
        <path d="M 0 640 L 12 470 L -12 470 Z" fill="#5E3A2C" />
        <circle cx={0} cy={420} r={110} fill="#3E6A3A" />
        <circle cx={-70} cy={470} r={70} fill="#4A7A44" />
        <circle cx={70} cy={470} r={70} fill="#355E32" />
      </g>
    ))}
    {/* iron gates, swung open */}
    <g stroke="#1E1A22" strokeWidth={10}>
      <path d="M 620 640 L 620 360 M 700 640 L 700 360 M 780 640 L 780 360" />
      <path d="M 620 380 L 780 380 M 620 620 L 780 620" />
      <path d="M 1140 640 L 1140 360 M 1220 640 L 1220 360 M 1300 640 L 1300 360" />
      <path d="M 1140 380 L 1300 380 M 1140 620 L 1300 620" />
    </g>
    {/* brick pillars */}
    {[
      { x: 560 },
      { x: 1300 },
    ].map((p, i) => (
      <g key={i}>
        <rect x={p.x} y={330} width={70} height={310} fill="#7A4A38" stroke="#5E3A2C" strokeWidth={4} />
        <rect x={p.x - 10} y={310} width={90} height={26} rx={6} fill="#9A6A52" />
        <circle cx={p.x + 35} cy={300} r={16} fill="#FFD39A" />
        <Glow x={p.x + 35} y={300} r={60} o={0.4} />
      </g>
    ))}
    {/* sidewalk and road */}
    <rect x={-400} y={640} width={2720} height={130} fill="#8A7A68" />
    <rect x={-400} y={640} width={2720} height={10} fill="#A89880" />
    <rect x={-400} y={770} width={2720} height={310} fill="#3A363E" />
    <rect x={-400} y={900} width={2720} height={8} fill="#E8E2D2" opacity={0.3} />
    <Dust t={t} seed={201} x0={200} y0={400} w={1500} h={300} n={16} o={0.25} />
  </g>
);
