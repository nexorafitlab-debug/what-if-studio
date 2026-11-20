import React from 'react';
import { rnd } from '../anim';
import { makeRoom, Box, S3 } from '../room';
import { RoomShell, BackWindow, FloorShadow, WallClock } from '../furnish';
import { Glow, LightVeil, Dust } from '../light';

// The hospital ward — Ifinite scenes 026-027 (GREYSCALE: "what everyone sees") and 059-060 (colour, Sam's view).
// Two beds with a privacy curtain between them, IV drips, a monitor with a green trace, a medicine cabinet,
// a window with flat daylight, a wall clock. `grey` switches the whole set to desaturated greys — the way the
// ward looks to everyone except Sam. Characters stand between the beds at about w 0.35 (stand(HOSPITAL, u, 0.35)).
export const HOSPITAL = makeRoom({ x: 960, y: 500 }, { x0: 480, x1: 1440, y0: 320, y1: 742 }, 3.4);

const C = { wall: '#3E4A4E', side: '#323C40', floor: '#33302E', ceiling: '#20262A', lines: '#20242A' };
const G = { wall: '#4A4A4A', side: '#3C3C3C', floor: '#383838', ceiling: '#262626', lines: '#222222' };

export const Hospital: React.FC<{ t: number; id?: string; veil?: number; grey?: boolean }> = ({ t, id = 'hosp', veil = 0.5, grey = false }) => {
  const R = HOSPITAL;
  const { P, Q } = R;
  const K = grey ? G : C;
  const bedC = grey ? '#5A5A5A' : '#7A8A92';
  const sheetC = grey ? '#8A8A8A' : '#D8D2C4';
  const blanketC = grey ? '#6E6E6E' : '#5A7A8A';
  const curtainC = grey ? '#555555' : '#7A9A8A';
  const traceC = grey ? '#AAAAAA' : '#3ED598';
  return (
    <g>
      <RoomShell r={R} id={id} wall={K.wall} side={K.side} floorC={K.floor} ceiling={K.ceiling} lines={K.lines} />
      {/* flat daylight window */}
      <BackWindow r={R} id={`${id}w`} t={t} x0={560} x1={840} y0={370} y1={560} sun={{ x: 700, y: 420 }} cols={2} />
      <WallClock x={P(0.72, 0.14, 0).x} y={P(0.72, 0.14, 0).y} r={26} t={t} />
      {/* ceiling light panels */}
      {[0.3, 0.62].map((u, i) => {
        const c = P(u, 0, 0.4);
        return <ellipse key={i} cx={c.x} cy={c.y + 12} rx={90} ry={14} fill={grey ? '#777777' : '#F2F0E4'} opacity={grey ? 0.5 : 0.9} />;
      })}
      {/* medicine cabinet on the left wall */}
      <Box r={R} u={[0, 0.05]} v={[0.2, 0.5]} w={[0.3, 0.6]} front={grey ? '#666666' : '#8A9497'} side={grey ? '#555555' : '#6E787C'} top={grey ? '#777777' : '#9AA4A7'} />
      <polygon points={Q([[0.005, 0.22, 0.32], [0.045, 0.22, 0.32], [0.045, 0.48, 0.32], [0.005, 0.48, 0.32]])} fill="none" stroke="#2E2E2E" strokeWidth={3} />
      {/* bed 1 (left): frame, mattress, pillow, blanket */}
      <FloorShadow r={R} u={[0.08, 0.42]} w={[0.02, 0.3]} />
      <Box r={R} u={[0.08, 0.42]} v={[0.6, 0.72]} w={[0.02, 0.3]} front={bedC} side={grey ? '#484848' : '#5E6E76'} top={grey ? '#6E6E6E' : '#8A9AA2'} />
      <Box r={R} u={[0.08, 0.42]} v={[0.72, 0.82]} w={[0.02, 0.3]} front={sheetC} side={grey ? '#6E6E6E' : '#B8B2A6'} top="#E6E0D2" />
      <Box r={R} u={[0.1, 0.24]} v={[0.68, 0.72]} w={[0.03, 0.28]} front="#FFFFFF" side="#D8D2C4" top="#FFFFFF" />
      <polygon points={Q([[0.26, 0.72, 0.03], [0.42, 0.72, 0.03], [0.42, 0.82, 0.03], [0.26, 0.82, 0.03]])} fill={blanketC} />
      {/* IV drip by bed 1 */}
      {(() => {
        const top = P(0.46, 0.34, 0.1);
        const base = P(0.46, 1, 0.1);
        return (
          <g>
            <path d={`M ${base.x} ${base.y} L ${top.x} ${top.y}`} stroke={grey ? '#888888' : '#9AA0B0'} strokeWidth={6} />
            <path d={`M ${top.x - 30} ${top.y} L ${top.x + 30} ${top.y}`} stroke={grey ? '#888888' : '#9AA0B0'} strokeWidth={5} />
            <path d={`M ${top.x - 22} ${top.y} L ${top.x - 22} ${top.y + 40} L ${top.x - 10} ${top.y + 40} L ${top.x - 10} ${top.y} Z`} fill={grey ? '#999999' : '#BFD6FF'} opacity={0.8} />
            <path d={`M ${top.x - 16} ${top.y + 40} Q ${top.x} ${top.y + 90} ${top.x - 40} ${top.y + 130}`} stroke={grey ? '#888888' : '#9AA0B0'} strokeWidth={3} fill="none" />
          </g>
        );
      })()}
      {/* the privacy curtain between the beds */}
      <polygon points={Q([[0.48, 0.14, 0.08], [0.52, 0.14, 0.08], [0.52, 0.94, 0.08], [0.48, 0.94, 0.08]])} fill={curtainC} opacity={0.92} />
      {[0.28, 0.48, 0.68, 0.86].map((v, i) => (
        <path key={i} d={`M ${P(0.485, v, 0.08).x} ${P(0.485, v, 0.08).y} L ${P(0.515, v, 0.08).x} ${P(0.515, v, 0.08).y}`} stroke={grey ? '#444444' : '#5E7A6E'} strokeWidth={3} />
      ))}
      <path d={`M ${P(0.5, 0.14, 0.08).x} ${P(0.5, 0.14, 0.08).y} L ${P(0.5, 0.14, 0.42).x} ${P(0.5, 0.14, 0.42).y}`} stroke={grey ? '#777777' : '#9AA0B0'} strokeWidth={5} />
      {/* bed 2 (right) */}
      <FloorShadow r={R} u={[0.58, 0.92]} w={[0.02, 0.3]} />
      <Box r={R} u={[0.58, 0.92]} v={[0.6, 0.72]} w={[0.02, 0.3]} front={bedC} side={grey ? '#484848' : '#5E6E76'} top={grey ? '#6E6E6E' : '#8A9AA2'} />
      <Box r={R} u={[0.58, 0.92]} v={[0.72, 0.82]} w={[0.02, 0.3]} front={sheetC} side={grey ? '#6E6E6E' : '#B8B2A6'} top="#E6E0D2" />
      <Box r={R} u={[0.6, 0.74]} v={[0.68, 0.72]} w={[0.03, 0.28]} front="#FFFFFF" side="#D8D2C4" top="#FFFFFF" />
      <polygon points={Q([[0.76, 0.72, 0.03], [0.92, 0.72, 0.03], [0.92, 0.82, 0.03], [0.76, 0.82, 0.03]])} fill={blanketC} />
      {/* monitor on a stand by bed 2, green trace ticking */}
      {(() => {
        const m = P(0.96, 0.42, 0.05);
        const b = P(0.96, 1, 0.05);
        const ph = (t / 2) % 1;
        return (
          <g>
            <path d={`M ${b.x} ${b.y} L ${m.x} ${m.y + 30}`} stroke={grey ? '#888888' : '#9AA0B0'} strokeWidth={6} />
            <rect x={m.x - 56} y={m.y - 40} width={112} height={80} rx={10} fill="#14101E" stroke={grey ? '#666666' : '#3A3446'} strokeWidth={4} />
            <path d={`M ${m.x - 44} ${m.y} L ${m.x - 20} ${m.y} L ${m.x - 12} ${m.y - 18} L ${m.x} ${m.y + 14} L ${m.x + 12} ${m.y - 6} L ${m.x + 20} ${m.y} L ${m.x + 44} ${m.y}`} stroke={traceC} strokeWidth={4} fill="none" strokeLinecap="round" />
            <circle cx={m.x - 44 + ph * 88} cy={m.y} r={5} fill={traceC} opacity={0.9} />
          </g>
        );
      })()}
      {/* a chair and a small table with a water jug */}
      {(() => {
        const c = P(0.5, 1, 0.5);
        return (
          <g>
            <ellipse cx={c.x} cy={c.y + 2} rx={50} ry={10} fill="#000" opacity={0.35} />
            <rect x={c.x - 40} y={c.y - 90} width={80} height={16} rx={6} fill={grey ? '#555555' : '#6A4A3E'} />
            <path d={`M ${c.x - 34} ${c.y - 74} L ${c.x - 34} ${c.y} M ${c.x + 34} ${c.y - 74} L ${c.x + 34} ${c.y}`} stroke={grey ? '#444444' : '#3A2826'} strokeWidth={8} />
            <rect x={c.x - 40} y={c.y - 140} width={80} height={52} rx={8} fill={grey ? '#555555' : '#6A4A3E'} />
          </g>
        );
      })()}
      <LightVeil id={`${id}veil`} lights={[[700, 460, 360], [960, 900, 420], [1220, 420, 300]]} o={veil} />
      <Glow x={700} y={460} r={280} o={grey ? 0.15 : 0.3} />
      <Dust t={t} seed={61} x0={560} y0={370} w={400} h={300} n={16} o={grey ? 0.15 : 0.3} />
      {grey ? <rect x={-1500} y={-1500} width={5000} height={4500} fill="#888888" opacity={0.12} style={{ mixBlendMode: 'saturation' }} /> : null}
      {Array.from({ length: 4 }).map((_, i) => (
        <circle key={i} cx={560 + rnd(11, i) * 800} cy={740 + rnd(12, i) * 160} r={1.5} fill="#BFD6FF" opacity={0.18} />
      ))}
    </g>
  );
};
