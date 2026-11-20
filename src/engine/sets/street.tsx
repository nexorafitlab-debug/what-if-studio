import React from 'react';
import { rnd } from '../anim';
import { makeRoom } from '../room';
import { DuskSky, Sun } from '../kit';
import { Glow, Dust } from '../light';

// The evening street — Ifinite scenes 015-016, 034, 036, 051, 078, 082, 084: brick buildings, shop fronts with
// awnings, the "SHOP" sign, a clock on a building, street lamps, sidewalk and road. Dusk sky, lit windows, warm
// pools of light. Characters walk the sidewalk at about w 0.4 (stand(STREET, u, 0.4)).
export const STREET = makeRoom({ x: 960, y: 540 }, { x0: 0, x1: 1920, y0: 540, y1: 820 }, 3.0);

export const Street: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <DuskSky id="streetdusk" horizonY={640} />
    <Sun x={420} y={560} r={100} t={t} />
    {/* left brick building with shops */}
    <rect x={-400} y={120} width={760} height={520} fill="#4A3226" />
    <rect x={-400} y={120} width={760} height={520} fill="url(#g3fadeDown)" opacity={0.25} />
    {Array.from({ length: 12 }).map((_, i) => (
      <rect key={i} x={-360 + (i % 4) * 180} y={160 + Math.floor(i / 4) * 130} width={90} height={70} fill="#FFC27A" opacity={0.3 + rnd(25, i) * 0.5} />
    ))}
    {/* shop fronts on the left */}
    <rect x={-380} y={470} width={340} height={170} fill="#2A1E28" stroke="#3A2E38" strokeWidth={4} />
    <rect x={-360} y={490} width={300} height={110} fill="#B8D4F0" opacity={0.5} />
    <text x={-210} y={450} fontFamily="Montserrat, sans-serif" fontWeight={700} fontSize={34} fill="#FFD23F" textAnchor="middle">
      SHOP
    </text>
    <rect x={-20} y={470} width={340} height={170} fill="#2A1E28" stroke="#3A2E38" strokeWidth={4} />
    <rect x={0} y={490} width={300} height={110} fill="#C96A5A" opacity={0.55} />
    {/* striped awnings over the shops */}
    {[-380, -20].map((x, bi) => (
      <g key={bi}>
        {Array.from({ length: 7 }).map((_, i) => (
          <polygon key={i} points={`${x + i * 48},470 ${x + i * 48 + 48},470 ${x + i * 48 + 44},500 ${x + i * 48 + 4},500`} fill={i % 2 ? '#C96A5A' : '#F2E8D8'} opacity={0.95} />
        ))}
      </g>
    ))}
    {/* right building with a clock */}
    <rect x={1560} y={80} width={760} height={560} fill="#3E2A30" />
    {Array.from({ length: 10 }).map((_, i) => (
      <rect key={i} x={1600 + (i % 3) * 200} y={140 + Math.floor(i / 3) * 130} width={100} height={76} fill="#FFC27A" opacity={0.3 + rnd(26, i) * 0.5} />
    ))}
    {(() => {
      const cx = 1780;
      const cy = 300;
      return (
        <g>
          <circle cx={cx} cy={cy} r={64} fill="#F2EFE4" stroke="#3A2E38" strokeWidth={6} />
          <path d={`M ${cx} ${cy} L ${cx} ${cy - 40}`} stroke="#14101E" strokeWidth={6} strokeLinecap="round" />
          <path d={`M ${cx} ${cy} L ${cx + 26} ${cy + 12}`} stroke="#14101E" strokeWidth={6} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={7} fill="#14101E" />
        </g>
      );
    })()}
    <rect x={1580} y={470} width={320} height={170} fill="#2A1E28" stroke="#3A2E38" strokeWidth={4} />
    <rect x={1600} y={490} width={280} height={110} fill="#7A9A6A" opacity={0.5} />
    {/* sidewalk and road */}
    <rect x={-400} y={640} width={2720} height={130} fill="#3A3238" />
    <rect x={-400} y={640} width={2720} height={10} fill="#4A4248" />
    <rect x={-400} y={770} width={2720} height={310} fill="#1E1A22" />
    <rect x={-400} y={900} width={2720} height={8} fill="#E8E2D2" opacity={0.35} />
    <rect x={-400} y={1000} width={2720} height={8} fill="#E8E2D2" opacity={0.2} />
    {/* a blue car parked on the right */}
    <g>
      <ellipse cx={1680} cy={862} rx={170} ry={12} fill="#000" opacity={0.4} />
      <path d="M 1520 860 Q 1510 810 1590 804 L 1630 764 Q 1680 750 1740 764 L 1790 804 Q 1870 810 1860 860 Z" fill="#4A6A8A" />
      <polygon points="1640,768 1730,768 1770,800 1610,800" fill="#B8D4F0" opacity={0.85} />
      <circle cx={1590} cy={858} r={26} fill="#0E0C12" stroke="#4A4460" strokeWidth={5} />
      <circle cx={1790} cy={858} r={26} fill="#0E0C12" stroke="#4A4460" strokeWidth={5} />
      <circle cx={1858} cy={826} r={10} fill="#FFE7B3" />
      <Glow x={1858} y={826} r={60} o={0.5} />
    </g>
    {/* street lamps, lit, with pools of light */}
    {[
      { x: 700, h: 300 },
      { x: 1250, h: 320 },
    ].map((l, i) => (
      <g key={i}>
        <path d={`M ${l.x} 770 L ${l.x} ${770 - l.h}`} stroke="#1E1A22" strokeWidth={10} />
        <circle cx={l.x} cy={770 - l.h - 6} r={15} fill="#FFE7B3" />
        <Glow x={l.x} y={770 - l.h - 6} r={140} o={0.6} />
        <ellipse cx={l.x} cy={772} rx={120} ry={14} fill="#FFD39A" opacity={0.14} />
      </g>
    ))}
    {/* a bicycle leaning on a lamp post */}
    {(() => {
      const b = { x: 1250, y: 770 };
      return (
        <g opacity={0.95}>
          <circle cx={b.x - 60} cy={b.y - 30} r={30} fill="none" stroke="#2E8C86" strokeWidth={7} />
          <circle cx={b.x + 60} cy={b.y - 30} r={30} fill="none" stroke="#2E8C86" strokeWidth={7} />
          <path d={`M ${b.x - 60} ${b.y - 30} L ${b.x - 10} ${b.y - 80} L ${b.x + 30} ${b.y - 80} L ${b.x + 60} ${b.y - 30} L ${b.x} ${b.y - 30} L ${b.x - 10} ${b.y - 80}`} stroke="#2E8C86" strokeWidth={6} fill="none" />
        </g>
      );
    })()}
    {/* a bin and a newspaper on the sidewalk */}
    <rect x={860} y={690} width={46} height={70} rx={6} fill="#4A4460" />
    <rect x={980} y={748} width={40} height={26} rx={2} fill="#E9E2D2" transform="rotate(-8 1000 761)" />
    <Dust t={t} seed={131} x0={200} y0={400} w={1500} h={300} n={22} o={0.3} />
  </g>
);
