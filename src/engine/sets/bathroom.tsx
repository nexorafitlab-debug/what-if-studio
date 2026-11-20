import React from 'react';

// Bathroom — ported from the death-count-v2 episode (S7): wall, small moonlit window, towel on a ring, a mirror
// whose reflection is a dark-head silhouette with NO timer (Rule 3: you can't see your own), and a sink with a
// faucet below the mirror. Ifinite scenes 013-014, 048-049.
const BLACK = '#0D0D12';

export const Bathroom: React.FC = () => (
  <g>
    <rect x={-400} y={-200} width={2720} height={1480} fill="#232038" />
    <rect x={-400} y={820} width={2720} height={460} fill="#17142A" />
    {/* small window with moonlight */}
    <rect x={-200} y={120} width={220} height={300} rx={8} fill="#111A3E" stroke="#3A3446" strokeWidth={5} />
    <circle cx={-90} cy={220} r={42} fill="#F1F3FF" opacity={0.9} />
    <rect x={-200} y={430} width={220} height={10} fill="#3A3446" />
    {/* towel on a ring */}
    <circle cx={380} cy={330} r={26} fill="none" stroke="#9FC0FF" strokeWidth={6} />
    <rect x={350} y={350} width={70} height={150} rx={8} fill="#5E6E46" />
    {/* mirror: the reflection is a dark-head silhouette with NO timer */}
    <rect x={1020} y={180} width={520} height={420} rx={14} fill="#2E3A55" stroke="#4A4460" strokeWidth={6} />
    <rect x={1040} y={200} width={60} height={380} fill="#FFFFFF" opacity={0.08} />
    <g opacity={0.9}>
      <circle cx={1280} cy={360} r={62} fill={BLACK} />
      <circle cx={1259} cy={356} r={7} fill="#FFFFFF" />
      <circle cx={1301} cy={356} r={7} fill="#FFFFFF" />
      <path d="M 1270 388 Q 1280 392 1290 388" stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M 1234 448 Q 1280 436 1326 448 L 1320 600 L 1240 600 Z" fill="#2E8C86" />
    </g>
    {/* sink + faucet below the mirror */}
    <rect x={1080} y={620} width={400} height={60} rx={16} fill="#E9E2D2" />
    <path d="M 1280 620 L 1280 580 Q 1280 560 1300 560" stroke="#9AA0B0" strokeWidth={10} fill="none" strokeLinecap="round" />
  </g>
);
