import React from 'react';
import { FONT } from '../fonts';

// Rainy street / bus stop at night — ported from the death-count-v2 episode (S1–S3): wet road with light
// reflections, lit building windows, a bus stop sign, a red traffic light, and rain falling diagonally with the
// shot clock. The opening scene of the Ifinite video (scenes 001-005).
const hash = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const RainyStreet: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-400} y={-200} width={2720} height={1480} fill="#14102A" />
    {/* buildings with lit windows */}
    {[
      { x: -200, w: 420, h: 520, win: 4 },
      { x: 300, w: 360, h: 640, win: 5 },
      { x: 1300, w: 400, h: 560, win: 4 },
      { x: 1780, w: 380, h: 700, win: 6 },
    ].map((b, bi) => (
      <g key={bi}>
        <rect x={b.x} y={720 - b.h} width={b.w} height={b.h} fill="#1B1533" />
        {Array.from({ length: b.win }).map((_, wi) => (
          <rect key={wi} x={b.x + 40 + (wi % 3) * 110} y={720 - b.h + 60 + Math.floor(wi / 3) * 130} width={56} height={70} fill="#FFC27A" opacity={0.35 + hash(bi * 10 + wi) * 0.45} />
        ))}
      </g>
    ))}
    {/* sidewalk */}
    <rect x={-400} y={720} width={2720} height={120} fill="#1E1830" />
    {/* wet road with light reflections */}
    <rect x={-400} y={840} width={2720} height={440} fill="#0A0912" />
    <rect x={100} y={880} width={500} height={10} fill="#FF8A3D" opacity={0.35} />
    <rect x={900} y={920} width={700} height={10} fill="#9FC0FF" opacity={0.3} />
    <rect x={400} y={980} width={900} height={8} fill="#FFC27A" opacity={0.25} />
    {/* bus stop sign */}
    <g>
      <rect x={1290} y={380} width={10} height={340} fill="#4A4460" />
      <rect x={1230} y={300} width={130} height={80} rx={8} fill="#1D2A4A" stroke="#9FC0FF" strokeWidth={3} />
      <text x={1295} y={332} fontFamily={FONT.title} fontWeight={700} fontSize={22} fill="#FFFFFF" textAnchor="middle">
        BUS
      </text>
      <text x={1295} y={360} fontFamily={FONT.title} fontWeight={700} fontSize={22} fill="#FFFFFF" textAnchor="middle">
        STOP
      </text>
    </g>
    {/* traffic light, red */}
    <g>
      <rect x={560} y={420} width={10} height={300} fill="#4A4460" />
      <rect x={520} y={300} width={90} height={130} rx={12} fill="#14101E" stroke="#3A3446" strokeWidth={4} />
      <circle cx={565} cy={335} r={18} fill="#FF3344" />
      <circle cx={565} cy={335} r={30} fill="#FF3344" opacity={0.25} />
      <circle cx={565} cy={385} r={14} fill="#3A3446" />
    </g>
    {/* rain: diagonal streaks falling with the shot clock */}
    {Array.from({ length: 46 }).map((_, i) => {
      const x = ((i * 97 + t * 3) % 2000) - 40;
      const y = ((i * 53 + t * 14) % 1100) - 100;
      return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 28} stroke="#9FC0FF" strokeWidth={2.5} opacity={0.28} />;
    })}
  </g>
);
