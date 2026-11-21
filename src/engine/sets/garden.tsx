import React from 'react';
import { rnd } from '../anim';
import { makeRoom } from '../room';
import { NightSky, Stars, Moon, Skyline } from '../kit';
import { Glow, Dust } from '../light';

// The rooftop garden at dusk — wooden planters with tall grasses, a small
// tree strung with fairy lights, a bench, the city skyline and the moon
// behind. The title shot lives here. Characters stand on the deck at w 0.4.
export const GARDEN = makeRoom({ x: 960, y: 540 }, { x0: 0, x1: 1920, y0: 540, y1: 820 }, 3.0);

export const Garden: React.FC<{ t: number }> = ({ t }) => {
  const sway = Math.sin(t / 26) * 5;
  return (
    <g>
      <NightSky id="gardensky" horizonY={600} />
      <Stars seed={91} x0={0} y0={0} w={1920} h={560} t={t} n={46} o={0.85} />
      <Moon x={1640} y={220} r={64} />
      <Skyline y={600} seed={13} h={190} />
      {/* deck */}
      <rect x={-400} y={600} width={2720} height={480} fill="#3A2E26" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={-400 + i * 230} y={600} width={8} height={480} fill="#2A211C" opacity={0.7} />
      ))}
      {/* planters with tall grasses */}
      {[
        { x: 220, w: 300, h: 120 },
        { x: 1420, w: 300, h: 120 },
        { x: 620, w: 220, h: 100 },
      ].map((p, i) => (
        <g key={i}>
          <rect x={p.x} y={700} width={p.w} height={p.h} fill="#5B4038" />
          <rect x={p.x} y={700} width={p.w} height={14} fill="#7A5747" />
          {Array.from({ length: 7 }).map((_, j) => (
            <path key={j} d={`M ${p.x + 20 + j * (p.w / 7)} 700 Q ${p.x + 30 + j * (p.w / 7) + sway * (j % 2 ? 1 : -1)} ${700 - 90 - rnd(97, i * 7 + j) * 60} ${p.x + 14 + j * (p.w / 7)} ${700 - 130 - rnd(99, i * 7 + j) * 60}`} stroke={j % 2 ? '#3A5A40' : '#4A6A48'} strokeWidth={7} fill="none" />
          ))}
        </g>
      ))}
      {/* small tree with fairy lights */}
      <g>
        <path d="M 1090 700 L 1100 480 L 1112 700 Z" fill="#4A3226" />
        <circle cx={1100} cy={420} r={110} fill="#2E4A34" />
        <circle cx={1020} cy={470} r={70} fill="#35563A" />
        <circle cx={1180} cy={470} r={70} fill="#2E4A34" />
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          const x = 1100 + Math.cos(a) * 88;
          const y = 440 + Math.sin(a) * 62;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={8} fill="#FFE7B3" />
              <Glow x={x} y={y} r={34} o={0.6} />
            </g>
          );
        })}
      </g>
      {/* string lights across the deck */}
      <path d="M 0 260 Q 960 380 1920 260" stroke="#2A2026" strokeWidth={5} fill="none" />
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 80 + i * 160;
        const y = 260 + Math.sin((x / 1920) * Math.PI) * 110;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={9} fill="#FFE7B3" />
            <Glow x={x} y={y} r={40} o={0.55} />
          </g>
        );
      })}
      {/* bench */}
      <rect x={820} y={780} width={280} height={20} rx={8} fill="#7A5747" />
      <rect x={840} y={800} width={16} height={70} fill="#2A2026" />
      <rect x={1064} y={800} width={16} height={70} fill="#2A2026" />
      <Dust t={t} seed={95} x0={200} y0={400} w={1500} h={300} n={18} o={0.3} />
    </g>
  );
};
