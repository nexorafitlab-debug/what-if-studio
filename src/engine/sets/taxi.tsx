import React from 'react';
import { makeRoom } from '../room';
import { Glow, Dust } from '../light';

// Inside a taxi at dusk — the back seat looking forward: two front headrests,
// the driver's shoulders and the wheel, the glowing meter, the rear-view
// mirror, and the city sliding past the windscreen. The driver sits up front
// (stand(TAXI, 0.3, 0.3)); the hero rides in the back (stand(TAXI, 0.62, 0.5)).
export const TAXI = makeRoom({ x: 960, y: 540 }, { x0: 100, x1: 1820, y0: 200, y1: 820 }, 3.0);

export const Taxi: React.FC<{ t: number }> = ({ t }) => {
  const slide = (t * 2.2) % 480;
  return (
    <g>
      {/* windscreen: the dusk city sliding past */}
      <rect x={-400} y={-400} width={2720} height={900} fill="#241A3E" />
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 1920 - ((slide + i * 480) % 2400);
        return (
          <g key={i}>
            <rect x={x} y={180} width={150} height={320} fill="#2A1B45" />
            <rect x={x + 20} y={230} width={14} height={18} fill="#FFC27A" opacity={0.8} />
            <rect x={x + 60} y={280} width={14} height={18} fill="#FFC27A" opacity={0.6} />
            <rect x={x + 100} y={230} width={14} height={18} fill="#FFC27A" opacity={0.7} />
          </g>
        );
      })}
      <circle cx={300} cy={240} r={44} fill="#FFE7B3" opacity={0.85} />
      <Glow x={300} y={240} r={140} o={0.4} />
      {/* dashboard */}
      <rect x={-400} y={500} width={2720} height={120} fill="#1E1A24" />
      <rect x={-400} y={500} width={2720} height={14} fill="#3A3446" />
      {/* glowing meter */}
      <g>
        <rect x={880} y={520} width={160} height={64} rx={8} fill="#101A2A" stroke="#FFB46A" strokeWidth={3} />
        <text x={960} y={564} fontFamily="monospace" fontWeight={700} fontSize={34} fill="#FFC27A" textAnchor="middle">$12.40</text>
        <Glow x={960} y={552} r={90} o={0.5} />
      </g>
      {/* rear-view mirror */}
      <rect x={860} y={120} width={200} height={56} rx={10} fill="#141019" stroke="#3A3446" strokeWidth={4} />
      <rect x={880} y={132} width={160} height={32} rx={6} fill="#2A2438" />
      {/* steering wheel hint, front centre-left */}
      <circle cx={620} cy={560} r={74} fill="none" stroke="#0E0C12" strokeWidth={16} />
      <circle cx={620} cy={560} r={16} fill="#0E0C12" />
      {/* front headrests */}
      <rect x={380} y={600} width={200} height={150} rx={26} fill="#262030" />
      <rect x={1340} y={600} width={200} height={150} rx={26} fill="#262030" />
      {/* back seat */}
      <rect x={-400} y={760} width={2720} height={320} fill="#2E2433" />
      <rect x={-400} y={760} width={2720} height={18} fill="#4A3E52" />
      {/* door handle + window crank on the right */}
      <rect x={1720} y={640} width={90} height={18} rx={9} fill="#5E5A6C" />
      <Dust t={t} seed={61} x0={200} y0={200} w={1500} h={300} n={14} o={0.25} />
    </g>
  );
};
