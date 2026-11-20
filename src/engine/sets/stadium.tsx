import React from 'react';
import { rnd } from '../anim';
import { makeRoom } from '../room';
import { NightSky, Stars } from '../kit';
import { Glow } from '../light';

// The stadium at night — Ifinite scenes 044-047: 40,000 people, 40,000 little lights, one of them says "tonight".
// The hero walks the stairs the whole first half and never finds which one. Floodlights, the stands in tiers full
// of crowd dots and phone lights, the green field below, the running track. Characters stand on the field at about
// w 0.5 (stand(STADIUM, u, 0.5)).
export const STADIUM = makeRoom({ x: 960, y: 540 }, { x0: 0, x1: 1920, y0: 540, y1: 820 }, 3.0);

export const Stadium: React.FC<{ t: number }> = ({ t }) => {
  // the crowd: rows of tiny heads, some with phone lights that blink
  const crowd: React.ReactNode[] = [];
  for (let row = 0; row < 7; row++) {
    const y = 300 + row * 44;
    const n = 26 + row * 2;
    for (let i = 0; i < n; i++) {
      const x = 60 + (i / n) * 1800 + rnd(27, row * 40 + i) * 20;
      const q = rnd(28, row * 40 + i);
      const phone = q > 0.82 && Math.sin(t / 9 + i * 2.1 + row) > 0;
      crowd.push(
        <g key={`${row}-${i}`}>
          <circle cx={x} cy={y} r={9 + row * 0.8} fill={['#2E8C86', '#F2C230', '#C96A5A', '#5A7AB0', '#8A6A9A', '#7A9A6A'][Math.floor(q * 6)]} />
          <circle cx={x} cy={y - 3} r={6 + row * 0.6} fill="#0D0D12" />
          {phone ? <rect x={x - 5} y={y - 34} width={10} height={14} rx={2} fill="#BFD6FF" opacity={0.95} /> : null}
          {phone ? <Glow x={x} y={y - 28} r={26} kind="cool" o={0.7} /> : null}
        </g>,
      );
    }
  }
  return (
    <g>
      <NightSky id="stadnight" horizonY={560} />
      <Stars seed={31} x0={0} y0={0} w={1920} h={420} t={t} n={60} o={0.7} />
      {/* the moon */}
      <circle cx={1700} cy={130} r={44} fill="#F1F3FF" opacity={0.9} />
      <circle cx={1700} cy={130} r={90} fill="#F1F3FF" opacity={0.12} />
      {/* floodlight towers */}
      {[
        { x: 120, y: 210 },
        { x: 1800, y: 210 },
      ].map((fl, i) => (
        <g key={i}>
          <path d={`M ${fl.x - 30} 560 L ${fl.x} ${fl.y} L ${fl.x + 30} 560`} stroke="#2A2440" strokeWidth={10} />
          <rect x={fl.x - 70} y={fl.y - 50} width={140} height={60} rx={8} fill="#1E1A2A" stroke="#3A3446" strokeWidth={3} />
          {[0, 1, 2, 3].map((j) => (
            <circle key={j} cx={fl.x - 48 + j * 32} cy={fl.y - 20} r={12} fill="#FFF2CC" />
          ))}
          <polygon points={`${fl.x - 60},${fl.y + 10} ${fl.x + 60},${fl.y + 10} ${fl.x + 320},560 ${fl.x - 320},560`} fill="#FFF2CC" opacity={0.07} />
          <Glow x={fl.x} y={fl.y - 20} r={180} o={0.7} />
        </g>
      ))}
      {/* the stands: tiered, dark, full of crowd */}
      <polygon points="-400,560 2320,560 2320,180 -400,180" fill="#1E1628" />
      <polygon points="-400,560 2320,560 2320,300 -400,300" fill="#241C34" />
      <polygon points="-400,560 2320,560 2320,420 -400,420" fill="#2A2240" />
      {/* tier edges */}
      <path d="M -400 300 L 2320 300 M -400 420 L 2320 420" stroke="#3A3048" strokeWidth={6} />
      {crowd}
      {/* the running track and the field */}
      <rect x={-400} y={560} width={2720} height={120} fill="#8A4A3A" />
      <rect x={-400} y={560} width={2720} height={10} fill="#C9A44A" opacity={0.5} />
      <rect x={-400} y={680} width={2720} height={400} fill="#2E5E34" />
      <rect x={-400} y={680} width={2720} height={14} fill="#3A6E42" />
      {/* field markings */}
      <ellipse cx={960} cy={900} rx={300} ry={70} fill="none" stroke="#E8EFE4" strokeWidth={5} opacity={0.7} />
      <path d="M 960 680 L 960 1080" stroke="#E8EFE4" strokeWidth={5} opacity={0.7} />
      {/* mowing stripes */}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={-400 + i * 340} y={680} width={170} height={400} fill="#355E3A" opacity={0.5} />
      ))}
      {/* stairs the hero walks, on the left */}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={120} y={300 + i * 32} width={160 - i * 8} height={26} fill="#3A3048" />
      ))}
      {/* a few floodlight glows on the field */}
      <Glow x={400} y={700} r={300} o={0.25} />
      <Glow x={1520} y={700} r={300} o={0.25} />
    </g>
  );
};
