import React from 'react';
import { rnd } from '../anim';
import { makeRoom } from '../room';
import { DuskSky, Sun, Skyline } from '../kit';
import { Glow, Dust } from '../light';

// The evening market — striped awnings over wooden stalls, crates of fruit,
// string lights swaying overhead, a chalkboard menu, the city behind. An
// outdoor set: characters stand on the market lane at about w 0.4.
export const MARKET = makeRoom({ x: 960, y: 540 }, { x0: 0, x1: 1920, y0: 540, y1: 820 }, 3.0);

const FRUIT = ['#E85A3A', '#F2A93D', '#7AB648', '#C65A8A', '#E8E0C8'];

const Stall: React.FC<{ x: number; w: number; awn: string; seed: number; flip?: boolean }> = ({ x, w, awn, seed, flip }) => (
  <g>
    {/* awning */}
    <polygon points={`${x},300 ${x + w},300 ${x + w - 30},380 ${x + 30},380`} fill={awn} />
    {Array.from({ length: 6 }).map((_, i) => (
      <polygon key={i} points={`${x + (i * w) / 6},300 ${x + ((i + 1) * w) / 6},300 ${x + ((i + 1) * w) / 6 - 26},380 ${x + (i * w) / 6 + 26},380`} fill={i % 2 ? '#F6EFE3' : awn} opacity={0.9} />
    ))}
    <path d={`M ${x} 300 L ${x} 640 M ${x + w} 300 L ${x + w} 640`} stroke="#3A2826" strokeWidth={12} />
    {/* counter */}
    <rect x={x - 10} y={620} width={w + 20} height={130} fill="#5B4038" />
    <rect x={x - 10} y={620} width={w + 20} height={18} fill="#7A5747" />
    {/* crates of fruit */}
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={x + 20 + i * (w / 3)} y={560} width={w / 3 - 24} height={60} fill="#6A4A3E" />
        {Array.from({ length: 5 }).map((__, j) => (
          <circle key={j} cx={x + 34 + i * (w / 3) + j * ((w / 3 - 40) / 4)} cy={556 - (j % 2) * 10} r={13} fill={FRUIT[Math.floor(rnd(seed, i * 5 + j) * FRUIT.length)]} />
        ))}
      </g>
    ))}
    {flip ? null : (
      <g>
        <rect x={x + w - 70} y={420} width={90} height={120} rx={6} fill="#1E2A1E" stroke="#8A7A62" strokeWidth={4} />
        <rect x={x + w - 58} y={440} width={66} height={9} rx={4} fill="#F6EFE3" opacity={0.8} />
        <rect x={x + w - 58} y={462} width={48} height={9} rx={4} fill="#F6EFE3" opacity={0.6} />
        <rect x={x + w - 58} y={484} width={58} height={9} rx={4} fill="#F6EFE3" opacity={0.7} />
      </g>
    )}
  </g>
);

export const Market: React.FC<{ t: number }> = ({ t }) => {
  const sway = Math.sin(t / 22) * 6;
  return (
    <g>
      <DuskSky id="marketsky" horizonY={620} />
      <Sun x={300} y={480} r={90} t={t} />
      <Skyline y={620} seed={7} />
      <rect x={-400} y={620} width={2720} height={460} fill="#3A2E28" />
      <polygon points="-400,1080 760,620 1160,620 2320,1080" fill="#6A5A48" />
      <Stall x={120} w={520} awn="#A8323E" seed={5} />
      <Stall x={1280} w={520} awn="#2A6A4A" seed={9} flip />
      {/* string lights overhead */}
      <path d="M -100 180 Q 960 330 2020 180" stroke="#2A2026" strokeWidth={6} fill="none" />
      {Array.from({ length: 14 }).map((_, i) => {
        const x = 40 + i * 135;
        const y = 180 + Math.sin((x / 1920) * Math.PI) * 130 + sway * (i % 2 ? 1 : -1) * 0.3;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={11} fill="#FFE7B3" />
            <Glow x={x} y={y} r={46} o={0.55} />
          </g>
        );
      })}
      {/* a basket and a paper bag on the lane */}
      <rect x={880} y={830} width={110} height={70} rx={8} fill="#8A6A3A" />
      <circle cx={910} cy={824} r={16} fill="#E85A3A" />
      <circle cx={950} cy={820} r={16} fill="#F2A93D" />
      <polygon points="1010,850 1080,850 1070,920 1020,920" fill="#C8B49A" />
      <Dust t={t} seed={55} x0={200} y0={400} w={1500} h={300} n={20} o={0.3} />
    </g>
  );
};
