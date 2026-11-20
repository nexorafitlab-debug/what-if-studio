import React from 'react';
import { rnd } from '../anim';
import { makeRoom, Box, S3 } from '../room';
import { RoomShell, BackWindow, Pendant, pendantLight, FloorShadow, WallClock } from '../furnish';
import { Glow, LightVeil, Dust } from '../light';

// The corner cafe — Ifinite scene 033: a woman on a ladder decorating the window, hero outside, "OPEN" sign.
// Inside: a counter with a glass display case of pastries, a menu board, hanging lamps, small tables with chairs,
// a shelf of cups, and the big shop window with the striped awning outside. Warm light from the lamps and the
// window. Characters stand at the counter at about w 0.35 (stand(CAFE, u, 0.35)).
export const CAFE = makeRoom({ x: 960, y: 500 }, { x0: 480, x1: 1440, y0: 320, y1: 742 }, 3.4);

const C = { wall: '#4A3A3C', side: '#3A2E30', floor: '#2E2626', ceiling: '#221A20', lines: '#221A20' };

export const Cafe: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'cafe', veil = 0.5 }) => {
  const R = CAFE;
  const { P, Q } = R;
  const T = 0.72; // counter top
  return (
    <g>
      <RoomShell r={R} id={id} wall={C.wall} side={C.side} floorC={C.floor} ceiling={C.ceiling} lines={C.lines} />
      {/* the big shop window: street and awning outside, evening light coming in */}
      <BackWindow r={R} id={`${id}w`} t={t} x0={560} x1={940} y0={360} y1={620} sun={{ x: 750, y: 560 }} cols={3} />
      {/* striped awning across the top of the window */}
      {Array.from({ length: 8 }).map((_, i) => (
        <polygon key={i} points={` ${560 + i * 48},360 ${560 + i * 48 + 48},360 ${560 + i * 48 + 44},420 ${560 + i * 48 + 4},420`} fill={i % 2 ? '#C96A5A' : '#F2E8D8'} opacity={0.95} />
      ))}
      {/* OPEN sign hanging in the window, gently swinging */}
      {(() => {
        const a = Math.sin(t / 20) * 0.03;
        const p = P(0.3, 0.42, 0.02);
        return (
          <g transform={`rotate(${a} ${p.x} ${p.y})`}>
            <path d={`M ${p.x} ${p.y - 60} L ${p.x} ${p.y - 10}`} stroke="#2A2026" strokeWidth={4} />
            <rect x={p.x - 56} y={p.y - 10} width={112} height={52} rx={8} fill="#1E2A1E" stroke={S3.warm} strokeWidth={3} />
            <text x={p.x} y={p.y + 26} fontFamily="Montserrat, sans-serif" fontWeight={700} fontSize={30} fill="#7AE0A0" textAnchor="middle">
              OPEN
            </text>
          </g>
        );
      })()}
      {/* menu board on the back wall */}
      <rect x={P(0.62, 0.2, 0).x} y={P(0.62, 0.2, 0).y} width={300} height={190} rx={10} fill="#2A2018" stroke="#6A4E40" strokeWidth={4} />
      {['COFFEE', 'TEA', 'CAKE', 'SOUP'].map((m, i) => (
        <text key={i} x={P(0.64, 0.24 + i * 0.07, 0).x} y={P(0.64, 0.24 + i * 0.07, 0).y} fontFamily="Montserrat, sans-serif" fontWeight={600} fontSize={22} fill="#E9D9B8">
          {m}
        </text>
      ))}
      <WallClock x={P(0.86, 0.16, 0).x} y={P(0.86, 0.16, 0).y} r={24} t={t} />
      {/* the counter: wood front, glass display case with pastries */}
      <FloorShadow r={R} u={[0.1, 0.68]} w={[0.02, 0.2]} />
      <Box r={R} u={[0.1, 0.68]} v={[T, 1]} w={[0.02, 0.18]} front="#4A3630" side="#382A26" top="#5E483C" />
      <Box r={R} u={[0.1, 0.69]} v={[T - 0.025, T]} w={[0, 0.2]} front={S3.woodLight} top="#8A6A50" side="#5A4438" rim />
      {/* glass case on the counter */}
      <polygon points={Q([[0.16, T - 0.16, 0.03], [0.44, T - 0.16, 0.03], [0.44, T - 0.025, 0.03], [0.16, T - 0.025, 0.03]])} fill="#BFD6FF" opacity={0.25} />
      <polygon points={Q([[0.16, T - 0.16, 0.03], [0.44, T - 0.16, 0.03], [0.44, T - 0.025, 0.03], [0.16, T - 0.025, 0.03]])} fill="none" stroke="#9AA0B0" strokeWidth={3} />
      {[0.2, 0.3, 0.4].map((u, i) => {
        const p = P(u, T - 0.025, 0.03);
        return <circle key={i} cx={p.x} cy={p.y - 18} r={14} fill={['#D9A44A', '#C96A5A', '#8A6A4A'][i]} />;
      })}
      {/* coffee machine on the counter */}
      {(() => {
        const m = P(0.56, T - 0.025, 0.08);
        return (
          <g>
            <rect x={m.x - 30} y={m.y - 64} width={60} height={64} rx={6} fill="#3A3446" />
            <rect x={m.x - 20} y={m.y - 56} width={40} height={22} rx={4} fill="#14101E" />
            <circle cx={m.x} cy={m.y - 45} r={6} fill="#3ED598" />
            <path d={`M ${m.x} ${m.y - 34} L ${m.x} ${m.y - 10}`} stroke="#9AA0B0" strokeWidth={6} />
          </g>
        );
      })()}
      {/* shelf of cups on the left wall */}
      {[0.3, 0.44].map((v, i) => (
        <polygon key={i} points={Q([[0.005, v, 0.3], [0.055, v, 0.3], [0.055, v, 0.6], [0.005, v, 0.6]])} fill="#6A4E40" />
      ))}
      {Array.from({ length: 6 }).map((_, i) => {
        const p = P(0.03, 0.24 + (i % 3) * 0.14, 0.45);
        return <rect key={i} x={p.x - 10 + (i % 3) * 8} y={p.y - 20} width={20} height={20} rx={3} fill={['#C96A5A', '#5A7AB0', '#D9C69A'][i % 3]} />;
      })}
      {/* two small tables with chairs on the right */}
      {[0.78, 0.92].map((u, i) => {
        const tb = P(u, 1, 0.55);
        const ch = P(u - 0.06, 1, 0.62);
        return (
          <g key={i}>
            <ellipse cx={tb.x} cy={tb.y + 2} rx={60} ry={10} fill="#000" opacity={0.35} />
            <ellipse cx={tb.x} cy={tb.y - 64} rx={52} ry={12} fill="#7A5747" />
            <path d={`M ${tb.x} ${tb.y - 58} L ${tb.x} ${tb.y}`} stroke="#3A2826" strokeWidth={8} />
            <rect x={ch.x - 26} y={ch.y - 84} width={52} height={52} rx={8} fill="#4A3630" />
            <path d={`M ${ch.x - 22} ${ch.y - 32} L ${ch.x - 22} ${ch.y} M ${ch.x + 22} ${ch.y - 32} L ${ch.x + 22} ${ch.y}`} stroke="#3A2826" strokeWidth={7} />
            {i === 0 ? <rect x={tb.x - 12} y={tb.y - 84} width={24} height={20} rx={3} fill="#C96A5A" /> : null}
          </g>
        );
      })}
      {/* the ladder by the window (the woman decorating it) */}
      {(() => {
        const l = P(0.24, 1, 0.14);
        return (
          <g>
            <path d={`M ${l.x - 44} ${l.y} L ${l.x - 14} ${l.y - 260} M ${l.x + 44} ${l.y} L ${l.x + 14} ${l.y - 260}`} stroke="#8A6A50" strokeWidth={8} strokeLinecap="round" />
            {[0.3, 0.55, 0.8].map((f, i) => (
              <path key={i} d={`M ${l.x - 44 + 30 * f} ${l.y - 260 * f} L ${l.x + 44 - 30 * f} ${l.y - 260 * f}`} stroke="#8A6A50" strokeWidth={6} />
            ))}
          </g>
        );
      })()}
      <Pendant r={R} u={0.42} w={0.5} v={0.24} t={t} />
      <Pendant r={R} u={0.68} w={0.5} v={0.24} t={t + 11} />
      <LightVeil id={`${id}veil`} lights={[[750, 480, 380], pendantLight(R, 0.42, 0.5, 0.24), pendantLight(R, 0.68, 0.5, 0.24), [960, 900, 400]]} o={veil} />
      <Glow x={750} y={480} r={260} o={0.35} />
      <Dust t={t} seed={71} x0={560} y0={380} w={420} h={320} n={22} o={0.4} />
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={560 + rnd(13, i) * 800} cy={740 + rnd(14, i) * 180} r={1.5} fill="#BFD6FF" opacity={0.2} />
      ))}
    </g>
  );
};
