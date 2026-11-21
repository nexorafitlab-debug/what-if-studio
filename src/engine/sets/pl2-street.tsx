import React from 'react';
import { rnd } from '../anim';
import { makeRoom } from '../room';
import { DuskSky } from '../kit';
import { Glow, Dust } from '../light';

// The evening street at dusk — drawn fresh for PastLives1MinV2, NOT
// street.tsx (different palette and layout: deep blue dusk with a pink
// band, shopfronts with awnings on the RIGHT, a bus stop on the left,
// street lamps, trees). Characters walk the sidewalk at about w 0.4
// (stand(PL2STREET, u, 0.4)). NO clock anywhere on this set.
export const PL2STREET = makeRoom({ x: 960, y: 540 }, { x0: 0, x1: 1920, y0: 540, y1: 820 }, 3.0);

export const Pl2Street: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <DuskSky id="pl2streetdusk" horizonY={640} red={0.35} />
    {/* pink dusk band */}
    <rect x={-400} y={480} width={2720} height={160} fill="#E8917A" opacity={0.35} />
    {/* left buildings with lit windows */}
    <rect x={-400} y={180} width={620} height={460} fill="#3A2E44" />
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={-360 + (i % 3) * 190} y={220 + Math.floor(i / 3) * 130} width={100} height={80} fill="#FFC27A" opacity={0.3 + rnd(41, i) * 0.5} />
    ))}
    {/* bus stop shelter, left */}
    <g>
      <rect x={280} y={420} width={260} height={220} fill="#2A2430" stroke="#4A4258" strokeWidth={4} />
      <rect x={300} y={440} width={220} height={120} fill="#B8D4F0" opacity={0.35} />
      <rect x={280} y={400} width={260} height={22} rx={8} fill="#4A4258" />
      <text x={410} y={392} fontFamily="Montserrat, sans-serif" fontWeight={700} fontSize={24} fill="#FFD23F" textAnchor="middle">
        BUS STOP
      </text>
      <rect x={300} y={560} width={220} height={18} fill="#5B4038" />
    </g>
    {/* right building with shops + awnings */}
    <rect x={1420} y={120} width={900} height={520} fill="#46303A" />
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x={1470 + (i % 4) * 200} y={170 + Math.floor(i / 4) * 130} width={100} height={76} fill="#FFC27A" opacity={0.3 + rnd(43, i) * 0.5} />
    ))}
    <rect x={1460} y={470} width={340} height={170} fill="#2A1E28" stroke="#3A2E38" strokeWidth={4} />
    <rect x={1480} y={490} width={300} height={110} fill="#FFD39A" opacity={0.5} />
    <text x={1630} y={452} fontFamily="Montserrat, sans-serif" fontWeight={700} fontSize={30} fill="#FFD23F" textAnchor="middle">
      BAKERY
    </text>
    {Array.from({ length: 7 }).map((_, i) => (
      <polygon key={i} points={`${1460 + i * 48},470 ${1460 + i * 48 + 48},470 ${1460 + i * 48 + 44},500 ${1460 + i * 48 + 4},500`} fill={i % 2 ? '#2A9D8F' : '#F2E8D8'} opacity={0.95} />
    ))}
    {/* one tree, left of centre — the second tree hid pills behind it */}
    {[
      { x: 620, s: 1.0 },
    ].map((tr, i) => (
      <g key={i} transform={`translate(${tr.x} 0) scale(${tr.s})`}>
        <path d="M 0 640 L 12 480 L -12 480 Z" fill="#2A2018" />
        <circle cx={0} cy={430} r={100} fill="#2E4A34" />
        <circle cx={-64} cy={476} r={64} fill="#35563A" />
        <circle cx={64} cy={476} r={64} fill="#2A4230" />
      </g>
    ))}
    {/* sidewalk and road */}
    <rect x={-400} y={640} width={2720} height={130} fill="#33302E" />
    <rect x={-400} y={640} width={2720} height={10} fill="#443F3A" />
    <rect x={-400} y={770} width={2720} height={310} fill="#1A1620" />
    <rect x={-400} y={900} width={2720} height={8} fill="#E8E2D2" opacity={0.3} />
    {/* street lamps, lit, with pools of light */}
    {[
      { x: 900, h: 300 },
      { x: 1400, h: 320 },
    ].map((l, i) => (
      <g key={i}>
        <path d={`M ${l.x} 770 L ${l.x} ${770 - l.h}`} stroke="#1E1A22" strokeWidth={10} />
        <circle cx={l.x} cy={770 - l.h - 6} r={15} fill="#FFE7B3" />
        <Glow x={l.x} y={770 - l.h - 6} r={140} o={0.6} />
        <ellipse cx={l.x} cy={772} rx={120} ry={14} fill="#FFD39A" opacity={0.14} />
      </g>
    ))}
    <Dust t={t} seed={231} x0={200} y0={400} w={1500} h={300} n={18} o={0.25} />
  </g>
);
