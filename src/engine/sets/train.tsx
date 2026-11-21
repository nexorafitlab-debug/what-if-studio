import React from 'react';
import { makeRoom } from '../room';
import { Glow, Dust } from '../light';

// A train compartment at dusk — long bench seats, big windows with the
// evening landscape and telegraph poles rushing past, a luggage rack with
// bags, warm ceiling lights, a hanging strap. Passengers sit along the
// benches (stand(TRAIN, u, 0.4)); the hero stands in the aisle.
export const TRAIN = makeRoom({ x: 960, y: 540 }, { x0: 100, x1: 1820, y0: 200, y1: 820 }, 3.0);

export const Train: React.FC<{ t: number }> = ({ t }) => {
  const rush = (t * 14) % 700;
  return (
    <g>
      {/* windows: the landscape rushing past */}
      <rect x={-400} y={-400} width={2720} height={900} fill="#2A1B45" />
      {[0, 1, 2].map((i) => {
        const x = 200 + i * 640;
        return (
          <g key={i}>
            <rect x={x} y={140} width={420} height={300} fill="#3E2E52" />
            <rect x={x} y={330} width={420} height={110} fill="#2A3A2E" />
            <circle cx={x + 320} cy={220} r={36} fill="#FFB46A" opacity={0.9} />
            <rect x={x + ((rush + i * 230) % 420)} y={180} width={10} height={260} fill="#1A1026" />
            <rect x={x + ((rush + 180 + i * 230) % 420)} y={180} width={10} height={260} fill="#1A1026" />
          </g>
        );
      })}
      {/* window frames */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={190 + i * 640} y={130} width={440} height={320} fill="none" stroke="#1A141E" strokeWidth={18} />
      ))}
      {/* luggage rack */}
      <rect x={-400} y={470} width={2720} height={22} fill="#3A2E22" />
      <rect x={300} y={420} width={220} height={50} rx={10} fill="#5A4A3A" />
      <rect x={900} y={420} width={180} height={50} rx={10} fill="#3A5A6A" />
      <rect x={1400} y={420} width={240} height={50} rx={10} fill="#6A4A3A" />
      {/* ceiling lights */}
      {[480, 960, 1440].map((x) => (
        <g key={x}>
          <rect x={x - 90} y={60} width={180} height={26} rx={13} fill="#FFE7B3" />
          <Glow x={x} y={73} r={150} o={0.5} />
        </g>
      ))}
      {/* hanging straps */}
      {[640, 1120, 1600].map((x) => (
        <g key={x}>
          <path d={`M ${x} 90 L ${x} 170`} stroke="#2A2026" strokeWidth={8} />
          <circle cx={x} cy={196} r={26} fill="none" stroke="#8A7A62" strokeWidth={10} />
        </g>
      ))}
      {/* bench seats along the wall */}
      <rect x={-400} y={640} width={2720} height={150} fill="#4A2E3E" />
      <rect x={-400} y={640} width={2720} height={20} fill="#6A4460" />
      <rect x={-400} y={790} width={2720} height={290} fill="#2C262E" />
      <Dust t={t} seed={77} x0={200} y0={200} w={1500} h={300} n={14} o={0.22} />
    </g>
  );
};
