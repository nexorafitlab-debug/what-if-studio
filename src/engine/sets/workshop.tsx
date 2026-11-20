import React from 'react';
import { rnd } from '../anim';
import { makeRoom, Box, S3 } from '../room';
import { RoomShell, BackWindow, Pendant, pendantLight, FloorShadow, WallClock } from '../furnish';
import { Glow, LightVeil, Dust } from '../light';

// The bike repair workshop — Ifinite scene 043: Sam fixes bikes here. A workbench along the back wall with a
// pegboard of tools above it, a bicycle on a repair stand in the middle, a stack of tyres, shelves of parts,
// a window with evening light, a hanging lamp over the bench, oil stains on the floor. The lamp is the main
// light; the window answers it. Characters stand at the bench at about w 0.3 (stand(WORKSHOP, u, 0.3)).
export const WORKSHOP = makeRoom({ x: 960, y: 500 }, { x0: 480, x1: 1440, y0: 320, y1: 742 }, 3.4);

const W = { wall: '#3A3A42', side: '#2E2E36', floor: '#2A2626', ceiling: '#1E1A20', lines: '#1E1A20' };

export const Workshop: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'work', veil = 0.5 }) => {
  const R = WORKSHOP;
  const { P, Q } = R;
  const T = 0.74; // workbench top
  return (
    <g>
      <RoomShell r={R} id={id} wall={W.wall} side={W.side} floorC={W.floor} ceiling={W.ceiling} lines={W.lines} />
      <BackWindow r={R} id={`${id}w`} t={t} x0={1080} x1={1360} y0={370} y1={560} sun={{ x: 1220, y: 540 }} cols={2} />
      {/* pegboard with tools above the bench */}
      <polygon points={Q([[0.06, 0.16, 0], [0.6, 0.16, 0], [0.6, 0.5, 0], [0.06, 0.5, 0]])} fill="#5A4034" />
      {Array.from({ length: 40 }).map((_, i) => {
        const p = P(0.08 + (i % 8) * 0.065, 0.2 + Math.floor(i / 8) * 0.07, 0.005);
        return <circle key={i} cx={p.x} cy={p.y} r={3} fill="#2E2018" />;
      })}
      {/* wrenches, hammer, screwdrivers hanging on the pegboard */}
      {[
        { u: 0.12, v: 0.28, rot: 0, c: '#9AA0B0' },
        { u: 0.2, v: 0.3, rot: 12, c: '#9AA0B0' },
        { u: 0.28, v: 0.26, rot: -8, c: '#C96A5A' },
        { u: 0.36, v: 0.3, rot: 0, c: '#D9C69A' },
        { u: 0.44, v: 0.28, rot: 10, c: '#9AA0B0' },
        { u: 0.52, v: 0.3, rot: -12, c: '#7A9A6A' },
      ].map((tl2, i) => {
        const p = P(tl2.u, tl2.v, 0.01);
        return (
          <g key={i} transform={`rotate(${tl2.rot} ${p.x} ${p.y})`}>
            <rect x={p.x - 4} y={p.y - 26} width={8} height={52} rx={3} fill={tl2.c} />
            <circle cx={p.x} cy={p.y - 30} r={9} fill={tl2.c} />
          </g>
        );
      })}
      <WallClock x={P(0.78, 0.16, 0).x} y={P(0.78, 0.16, 0).y} r={26} t={t} />
      {/* the workbench: legs, top, a drawer, a vice, an oil can, a rag */}
      <FloorShadow r={R} u={[0.06, 0.66]} w={[0, 0.16]} />
      <Box r={R} u={[0.06, 0.66]} v={[T, 1]} w={[0, 0.14]} front="#4A3630" side="#382A26" top="#5E483C" />
      <Box r={R} u={[0.06, 0.67]} v={[T - 0.025, T]} w={[0, 0.16]} front={S3.woodLight} top="#8A6A50" side="#5A4438" rim />
      <polygon points={Q([[0.1, 0.82, 0.14], [0.3, 0.82, 0.14], [0.3, 0.9, 0.14], [0.1, 0.9, 0.14]])} fill="none" stroke="#2E2018" strokeWidth={3} />
      {(() => {
        const v = P(0.56, T - 0.025, 0.08);
        const o = P(0.2, T - 0.025, 0.08);
        const rg = P(0.36, T - 0.025, 0.08);
        return (
          <g>
            <rect x={v.x - 22} y={v.y - 40} width={44} height={40} rx={4} fill="#5E5A6C" />
            <rect x={v.x - 30} y={v.y - 48} width={60} height={10} rx={3} fill="#3A3446" />
            <path d={`M ${o.x} ${o.y} L ${o.x - 6} ${o.y - 34} Q ${o.x} ${o.y - 44} ${o.x + 10} ${o.y - 38} L ${o.x + 8} ${o.y}`} fill="#C9A44A" />
            <path d={`M ${rg.x - 26} ${rg.y - 6} L ${rg.x + 26} ${rg.y - 6} L ${rg.x + 18} ${rg.y + 4} L ${rg.x - 18} ${rg.y + 4} Z`} fill="#7A6A72" opacity={0.9} />
          </g>
        );
      })()}
      {/* shelves of parts on the right wall */}
      {[0.3, 0.46, 0.62].map((v, i) => (
        <polygon key={i} points={Q([[0.72, v, 0.02], [0.98, v, 0.02], [0.98, v, 0.14], [0.72, v, 0.14]])} fill="#6A4E40" />
      ))}
      {Array.from({ length: 9 }).map((_, i) => {
        const p = P(0.75 + (i % 3) * 0.09, 0.24 + Math.floor(i / 3) * 0.16, 0.08);
        const c = ['#B9705A', '#8FA6B9', '#D9C69A', '#7A9A6A'][(i * 3) % 4];
        return <rect key={i} x={p.x - 14} y={p.y - 26} width={28} height={26} rx={4} fill={c} opacity={0.9} />;
      })}
      {/* a stack of tyres against the right wall */}
      {[0, 1, 2, 3].map((i) => {
        const p = P(0.88, 1, 0.3 + i * 0.02);
        return (
          <g key={i}>
            <ellipse cx={p.x} cy={p.y - 26 - i * 30} rx={52} ry={16} fill="#1E1C20" stroke="#3A3446" strokeWidth={4} />
            <ellipse cx={p.x} cy={p.y - 26 - i * 30} rx={26} ry={8} fill="#0E0C12" />
          </g>
        );
      })}
      {/* the bicycle on a repair stand, centre-right */}
      {(() => {
        const b = P(0.74, 1, 0.42);
        const s = R.s(0.42);
        return (
          <g>
            <ellipse cx={b.x} cy={b.y + 4} rx={150 * s} ry={14 * s} fill="#000" opacity={0.4} />
            <path d={`M ${b.x - 40 * s} ${b.y} L ${b.x - 10 * s} ${b.y - 130 * s}`} stroke="#4A4460" strokeWidth={8 * s} />
            <path d={`M ${b.x - 10 * s} ${b.y - 130 * s} L ${b.x + 40 * s} ${b.y - 130 * s}`} stroke="#4A4460" strokeWidth={8 * s} />
            <circle cx={b.x - 96 * s} cy={b.y - 96 * s} r={46 * s} fill="none" stroke="#2E8C86" strokeWidth={9 * s} />
            <circle cx={b.x + 96 * s} cy={b.y - 96 * s} r={46 * s} fill="none" stroke="#2E8C86" strokeWidth={9 * s} />
            <path d={`M ${b.x - 96 * s} ${b.y - 96 * s} L ${b.x - 10 * s} ${b.y - 170 * s} L ${b.x + 40 * s} ${b.y - 170 * s} L ${b.x + 96 * s} ${b.y - 96 * s} L ${b.x + 10 * s} ${b.y - 96 * s} L ${b.x - 10 * s} ${b.y - 170 * s}`} stroke="#2E8C86" strokeWidth={8 * s} fill="none" />
            <path d={`M ${b.x + 40 * s} ${b.y - 170 * s} L ${b.x + 70 * s} ${b.y - 186 * s}`} stroke="#C9A44A" strokeWidth={8 * s} strokeLinecap="round" />
            <path d={`M ${b.x - 10 * s} ${b.y - 170 * s} L ${b.x - 40 * s} ${b.y - 186 * s}`} stroke="#C9A44A" strokeWidth={8 * s} strokeLinecap="round" />
          </g>
        );
      })()}
      {/* oil stains and a rag on the floor */}
      <ellipse cx={P(0.5, 1, 0.5).x} cy={P(0.5, 1, 0.5).y - 6} rx={90} ry={14} fill="#0E0C12" opacity={0.5} />
      <ellipse cx={P(0.3, 1, 0.62).x} cy={P(0.3, 1, 0.62).y - 4} rx={60} ry={10} fill="#0E0C12" opacity={0.4} />
      <Pendant r={R} u={0.36} w={0.5} v={0.24} t={t} />
      <LightVeil id={`${id}veil`} lights={[[800, 470, 420], pendantLight(R, 0.36, 0.5, 0.24), [1220, 460, 320], [960, 900, 400]]} o={veil} />
      <Glow x={800} y={436} r={240} o={0.35} />
      <Dust t={t} seed={51} x0={600} y0={420} w={500} h={380} n={30} o={0.4} />
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={560 + rnd(9, i) * 800} cy={740 + rnd(10, i) * 180} r={1.5} fill="#BFD6FF" opacity={0.2} />
      ))}
    </g>
  );
};
