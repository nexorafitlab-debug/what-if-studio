import React from 'react';
import { rnd } from '../anim';
import { makeRoom, Box, S3 } from '../room';
import { RoomShell, BackWindow, FloorShadow, WallFrame, WallClock, FloorPlant } from '../furnish';
import { Glow, LightVeil, Dust } from '../light';

// The living room at dusk — Ifinite scenes 017, 019-021, 029-030, 063, 065, 092: the sofa against the back wall,
// coffee table in front of it, floor lamp, TV on the right wall, children's drawings pinned on the wall, a window
// onto the purple-orange dusk, bookshelf, rug, and the cat on the windowsill. The lamp is the main light; the
// window answers it. Characters stand on the rug at about w 0.4 (stand(LIVINGROOM, u, 0.4)).
export const LIVINGROOM = makeRoom({ x: 960, y: 500 }, { x0: 480, x1: 1440, y0: 320, y1: 742 }, 3.4);

const L = { wall: '#41364A', side: '#332B3C', floor: '#2E2228', ceiling: '#1F1826', lines: '#221A26' };

export const LivingRoom: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'liv', veil = 0.5 }) => {
  const R = LIVINGROOM;
  const { P, Q } = R;
  const lamp = P(0.9, 0.72, 0.05);
  return (
    <g>
      <RoomShell r={R} id={id} wall={L.wall} side={L.side} floorC={L.floor} ceiling={L.ceiling} lines={L.lines} />
      {/* dusk window on the back wall, left of centre */}
      <BackWindow r={R} id={`${id}w`} t={t} x0={560} x1={820} y0={380} y1={560} sun={{ x: 700, y: 540 }} cols={2} />
      {/* the cat on the windowsill */}
      {(() => {
        const c = P(0.22, 0.56, 0.02);
        return (
          <g>
            <ellipse cx={c.x} cy={c.y + 4} rx={34} ry={8} fill="#000" opacity={0.35} />
            <path d={`M ${c.x - 26} ${c.y} Q ${c.x - 30} ${c.y - 34} ${c.x - 8} ${c.y - 30} Q ${c.x + 6} ${c.y - 36} ${c.x + 22} ${c.y - 26} Q ${c.x + 30} ${c.y - 6} ${c.x + 24} ${c.y} Z`} fill="#3A3340" />
            <path d={`M ${c.x - 22} ${c.y - 28} L ${c.x - 28} ${c.y - 46} L ${c.x - 12} ${c.y - 34} Z`} fill="#3A3340" />
            <path d={`M ${c.x + 8} ${c.y - 32} L ${c.x + 14} ${c.y - 48} L ${c.x + 22} ${c.y - 32} Z`} fill="#3A3340" />
            <path d={`M ${c.x + 24} ${c.y - 2} Q ${c.x + 44} ${c.y - 10} ${c.x + 40} ${c.y - 30}`} stroke="#3A3340" strokeWidth={7} fill="none" strokeLinecap="round" />
          </g>
        );
      })()}
      {/* children's drawings pinned on the wall, right of the window */}
      {[
        { u: 0.42, v: 0.24, art: 0 },
        { u: 0.5, v: 0.3, art: 1 },
        { u: 0.58, v: 0.22, art: 2 },
        { u: 0.66, v: 0.3, art: 0 },
      ].map((d, i) => {
        const p = P(d.u, d.v, 0.01);
        return (
          <g key={i} transform={`rotate(${(i % 2 ? -3 : 3)} ${p.x} ${p.y})`}>
            <rect x={p.x - 34} y={p.y - 42} width={68} height={84} fill="#EFE8D6" opacity={0.95} />
            {d.art === 0 ? <circle cx={p.x} cy={p.y - 14} r={14} fill="#E9A84A" /> : d.art === 1 ? <path d={`M ${p.x - 16} ${p.y + 18} L ${p.x} ${p.y - 22} L ${p.x + 16} ${p.y + 18} Z`} fill="#4E8A6A" /> : <path d={`M ${p.x - 18} ${p.y + 10} L ${p.x + 18} ${p.y + 10} L ${p.x + 8} ${p.y + 24} L ${p.x - 8} ${p.y + 24} Z`} fill="#5A7AB0" />}
            <path d={`M ${p.x - 24} ${p.y + 30} L ${p.x + 24} ${p.y + 30}`} stroke="#3A6A8A" strokeWidth={4} />
          </g>
        );
      })}
      {/* wall clock above the sofa */}
      <WallClock x={P(0.5, 0.14, 0).x} y={P(0.5, 0.14, 0).y} r={26} t={t} />
      {/* bookshelf on the left wall */}
      <Box r={R} u={[0, 0.06]} v={[0.18, 0.86]} w={[0.3, 0.62]} front="#4A3630" side="#382A26" top="#5A4438" />
      {[0.36, 0.54, 0.72].map((v, i) => (
        <polygon key={i} points={Q([[0.005, v, 0.32], [0.055, v, 0.32], [0.055, v, 0.6], [0.005, v, 0.6]])} fill="#5E483C" />
      ))}
      {Array.from({ length: 9 }).map((_, i) => {
        const p = P(0.03, 0.3 + (i % 3) * 0.18, 0.45);
        const c = ['#B9705A', '#7A9A6A', '#5A7AB0', '#D9C69A', '#8A6A9A'][(i * 2) % 5];
        return <rect key={i} x={p.x - 8 + (i % 3) * 14} y={p.y - 34} width={12} height={34} fill={c} />;
      })}
      {/* TV on the right wall */}
      <FloorShadow r={R} u={[0.94, 1]} w={[0.1, 0.4]} o={0.4} />
      <Box r={R} u={[0.94, 1]} v={[0.28, 0.62]} w={[0.1, 0.4]} front="#14101E" side="#0E0C16" top="#1E1828" />
      <polygon points={Q([[0.94, 0.32, 0.12], [0.94, 0.32, 0.38], [0.94, 0.58, 0.38], [0.94, 0.58, 0.12]])} fill="#1E2A44" />
      <polygon points={Q([[0.94, 0.32, 0.12], [0.94, 0.32, 0.38], [0.94, 0.58, 0.38], [0.94, 0.58, 0.12]])} fill="url(#g3fadeDown)" opacity={0.5} />
      {/* the sofa: base, back, arms, cushions */}
      <FloorShadow r={R} u={[0.28, 0.74]} w={[0.02, 0.22]} />
      <Box r={R} u={[0.28, 0.74]} v={[0.52, 0.78]} w={[0.02, 0.2]} front="#5E3A44" side="#4A2C36" top="#6E4652" rim />
      <Box r={R} u={[0.28, 0.74]} v={[0.78, 1]} w={[0.02, 0.2]} front="#4A2C36" side="#38222A" top="#5E3A44" />
      {[0.36, 0.52].map((u, i) => (
        <polygon key={i} points={Q([[u - 0.06, 0.78, 0.2], [u + 0.06, 0.78, 0.2], [u + 0.06, 0.92, 0.2], [u - 0.06, 0.92, 0.2]])} fill="none" stroke="#38222A" strokeWidth={3} />
      ))}
      {[0.3, 0.7].map((u, i) => {
        const p = P(u, 0.6, 0.2);
        return <circle key={i} cx={p.x} cy={p.y} r={16} fill="#D9A44A" opacity={0.9} />;
      })}
      {/* coffee table in front of the sofa, with a mug and a book */}
      <FloorShadow r={R} u={[0.38, 0.64]} w={[0.24, 0.42]} o={0.45} />
      <Box r={R} u={[0.38, 0.64]} v={[0.82, 0.86]} w={[0.24, 0.42]} front="#5B4038" top="#7A5747" side="#3A2826" rim />
      {[0.4, 0.62].map((u, i) => (
        <polygon key={i} points={Q([[u, 0.86, 0.26], [u, 0.86, 0.4], [u, 1, 0.4], [u, 1, 0.26]])} fill="#3A2826" />
      ))}
      {(() => {
        const m = P(0.44, 0.82, 0.33);
        const b = P(0.58, 0.82, 0.33);
        return (
          <g>
            <rect x={m.x - 12} y={m.y - 22} width={24} height={22} rx={3} fill="#C96A5A" />
            <path d={`M ${m.x + 12} ${m.y - 16} Q ${m.x + 24} ${m.y - 10} ${m.x + 12} ${m.y - 4}`} stroke="#C96A5A" strokeWidth={4} fill="none" />
            <rect x={b.x - 26} y={b.y - 10} width={52} height={10} rx={2} fill="#5A7AB0" />
            <rect x={b.x - 22} y={b.y - 18} width={44} height={8} rx={2} fill="#7A9AC0" />
          </g>
        );
      })()}
      {/* the rug */}
      <polygon points={Q([[0.3, 1, 0.3], [0.72, 1, 0.3], [0.72, 1, 0.75], [0.3, 1, 0.75]])} fill="#4A3040" />
      <polygon points={Q([[0.33, 1, 0.33], [0.69, 1, 0.33], [0.69, 1, 0.72], [0.33, 1, 0.72]])} fill="none" stroke="#6A4260" strokeWidth={4} />
      {/* floor lamp on the right, the main light */}
      <FloorPlant r={R} u={0.06} w={0.5} size={0.9} />
      {(() => {
        const base = P(0.9, 1, 0.05);
        const top = { x: lamp.x, y: lamp.y - 90 };
        return (
          <g>
            <ellipse cx={base.x} cy={base.y + 2} rx={26} ry={7} fill="#1A1420" />
            <path d={`M ${base.x} ${base.y} L ${lamp.x} ${lamp.y}`} stroke="#2A2026" strokeWidth={7} />
            <path d={`M ${top.x - 34} ${top.y - 26} L ${top.x + 34} ${top.y - 26} L ${top.x + 46} ${top.y + 30} L ${top.x - 46} ${top.y + 30} Z`} fill="#F2D2A0" />
            <path d={`M ${top.x - 46} ${top.y + 30} L ${top.x + 46} ${top.y + 30}`} stroke="#FFE7B8" strokeWidth={4} />
          </g>
        );
      })()}
      <WallFrame x={P(0.82, 0.3, 0).x} y={P(0.82, 0.3, 0).y} w={90} h={110} art={1} />
      <LightVeil id={`${id}veil`} lights={[[lamp.x, lamp.y - 60, 460], [690, 470, 340], [960, 900, 420], [1300, 420, 260]]} o={veil} />
      <Glow x={lamp.x} y={lamp.y - 60} r={320} o={0.55} />
      <Glow x={690} y={470} r={260} o={0.3} />
      <Dust t={t} seed={41} x0={560} y0={380} w={400} h={300} n={22} o={0.4} />
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={560 + rnd(7, i) * 800} cy={760 + rnd(8, i) * 160} r={1.5} fill="#BFD6FF" opacity={0.2} />
      ))}
    </g>
  );
};
