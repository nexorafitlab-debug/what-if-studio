import React from 'react';
import { rnd } from '../anim';
import { makeRoom } from '../room';
import { DuskSky, Sun } from '../kit';
import { Glow, Dust } from '../light';

// The fairground at dusk — Ifinite scene 025: the ferris wheel, bunting, stalls, "ALMOST." — the roller coaster
// is almost boring, the wheel is almost fun. A big ferris wheel turning slowly, striped stall awnings, string
// lights, a ticket booth, the dusk sky. Characters walk the midway at about w 0.4 (stand(FAIRGROUND, u, 0.4)).
export const FAIRGROUND = makeRoom({ x: 960, y: 540 }, { x0: 0, x1: 1920, y0: 540, y1: 820 }, 3.0);

export const Fairground: React.FC<{ t: number }> = ({ t }) => {
  const wheelR = 250;
  const wheelX = 1420;
  const wheelY = 430;
  const rot = t * 0.25; // slow turn
  const gondolas = Array.from({ length: 8 }).map((_, i) => {
    const a = (i / 8) * Math.PI * 2 + (rot * Math.PI) / 180;
    return { x: wheelX + Math.cos(a) * wheelR, y: wheelY + Math.sin(a) * wheelR, c: ['#FF6A5A', '#FFD23F', '#3ED598', '#5A7AB0'][i % 4] };
  });
  return (
    <g>
      <DuskSky id="fairdusk" horizonY={660} />
      <Sun x={360} y={540} r={100} t={t} />
      {/* the ground: midway dirt with a worn path */}
      <rect x={-400} y={660} width={2720} height={420} fill="#3A2E28" />
      <polygon points="-400,1080 780,660 1140,660 2320,1080" fill="#5A4A3E" />
      {/* the ferris wheel: rim, spokes, gondolas, hub light */}
      <g>
        <path d={`M ${wheelX - 60} 660 L ${wheelX} ${wheelY} L ${wheelX + 60} 660`} stroke="#2A2440" strokeWidth={14} />
        <circle cx={wheelX} cy={wheelY} r={wheelR} fill="none" stroke="#8A6A9A" strokeWidth={10} />
        {gondolas.map((g, i) => (
          <g key={i}>
            <path d={`M ${wheelX} ${wheelY} L ${g.x} ${g.y}`} stroke="#8A6A9A" strokeWidth={5} />
            <rect x={g.x - 22} y={g.y - 6} width={44} height={34} rx={8} fill={g.c} />
            <Glow x={g.x} y={g.y + 10} r={30} o={0.4} />
          </g>
        ))}
        <circle cx={wheelX} cy={wheelY} r={26} fill="#FFD23F" />
        <Glow x={wheelX} y={wheelY} r={90} o={0.6} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 + (rot * Math.PI) / 180;
          return <circle key={i} cx={wheelX + Math.cos(a) * wheelR} cy={wheelY + Math.sin(a) * wheelR} r={7} fill="#FFE7B3" opacity={0.9} />;
        })}
      </g>
      {/* the roller coaster silhouette on the left */}
      <g stroke="#2A1E34" strokeWidth={10} fill="none" strokeLinecap="round">
        <path d="M -100 660 L 60 660 L 140 420 L 260 660 L 340 500 L 480 660" />
        <path d="M 140 420 Q 200 380 260 420" />
      </g>
      <circle cx={200} cy={400} r={10} fill="#FF6A5A" />
      {/* stalls with striped awnings */}
      {[
        { x: 120, c1: '#C96A5A', c2: '#F2E8D8', label: 'POPCORN' },
        { x: 480, c1: '#3ED598', c2: '#F2E8D8', label: 'CANDY' },
        { x: 840, c1: '#5A7AB0', c2: '#F2E8D8', label: 'TICKETS' },
      ].map((s, si) => (
        <g key={si}>
          <rect x={s.x} y={520} width={260} height={140} fill="#2A2030" stroke="#3A2E40" strokeWidth={4} />
          <rect x={s.x + 20} y={560} width={220} height={80} fill="#B8D4F0" opacity={0.35} />
          {Array.from({ length: 6 }).map((_, i) => (
            <polygon key={i} points={`${s.x + i * 44},520 ${s.x + i * 44 + 44},520 ${s.x + i * 44 + 40},556 ${s.x + i * 44 + 4},556`} fill={i % 2 ? s.c1 : s.c2} opacity={0.95} />
          ))}
          <text x={s.x + 130} y={500} fontFamily="Montserrat, sans-serif" fontWeight={700} fontSize={26} fill="#FFD23F" textAnchor="middle">
            {s.label}
          </text>
          <Glow x={s.x + 130} y={600} r={90} o={0.35} />
        </g>
      ))}
      {/* string lights across the midway, swaying gently */}
      <path d="M 100 340 Q 960 420 1820 340" stroke="#3A2E40" strokeWidth={4} fill="none" />
      {Array.from({ length: 18 }).map((_, i) => {
        const x = 140 + i * 96;
        const y = 340 + 72 * (1 - Math.pow((x - 960) / 860, 2)) + Math.sin(t / 24 + i) * 2;
        return (
          <g key={i}>
            <circle cx={x} cy={y + 8} r={8} fill={['#FFD23F', '#FF6A5A', '#3ED598'][i % 3]} opacity={0.9} />
            <Glow x={x} y={y + 8} r={26} o={0.5} />
          </g>
        );
      })}
      {/* bunting between the stalls */}
      <path d="M 120 300 Q 500 360 880 300" stroke="#3A2E40" strokeWidth={3} fill="none" />
      {Array.from({ length: 9 }).map((_, i) => {
        const x = 160 + i * 80;
        const y = 300 + 52 * (1 - Math.pow((x - 500) / 380, 2));
        return <polygon key={i} points={`${x - 14},${y} ${x + 14},${y} ${x},${y + 26}`} fill={['#FF6A5A', '#FFD23F', '#3ED598', '#5A7AB0'][i % 4]} />;
      })}
      {/* a few people silhouettes on the midway */}
      {[620, 1050, 1180].map((x, i) => (
        <g key={i} opacity={0.9}>
          <circle cx={x} cy={760} r={22} fill="#0D0D12" />
          <path d={`M ${x - 16} 790 L ${x + 16} 790 L ${x + 12} 880 L ${x - 12} 880 Z`} fill={['#2E8C86', '#F2C230', '#C96A5A'][i]} />
        </g>
      ))}
      {/* balloons tied to a stall */}
      {[
        { x: 400, y: 420, c: '#FF6A5A' },
        { x: 440, y: 390, c: '#3ED598' },
      ].map((b, i) => (
        <g key={i}>
          <path d={`M ${b.x} ${b.y + 30} Q ${b.x + 8} ${b.y + 80} ${b.x - 4} ${b.y + 120}`} stroke="#8A8498" strokeWidth={2} fill="none" />
          <ellipse cx={b.x} cy={b.y} rx={22} ry={28} fill={b.c} opacity={0.95} />
        </g>
      ))}
      <Dust t={t} seed={141} x0={200} y0={420} w={1500} h={300} n={24} o={0.35} />
      {Array.from({ length: 4 }).map((_, i) => (
        <circle key={i} cx={300 + rnd(29, i) * 1300} cy={760 + rnd(30, i) * 220} r={1.5} fill="#BFD6FF" opacity={0.2} />
      ))}
    </g>
  );
};
