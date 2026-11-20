import React from 'react';
import { rnd } from '../anim';
import { makeRoom, Box } from '../room';
import { RoomShell, FloorShadow } from '../furnish';
import { Glow, LightVeil, Dust } from '../light';

// The cinema — Ifinite scene 024: "ALSO BORING", horror movie boring, the audience's pills, a ghost on screen.
// Looking at the screen (back wall): the glowing screen, red seat rows receding toward the camera, aisle lights
// down the middle, a few heads in the seats, popcorn on the floor. The screen is the only light — everything else
// is dark red and black. Characters sit in the seats at about w 0.4 (stand(CINEMA, u, 0.4)).
export const CINEMA = makeRoom({ x: 960, y: 500 }, { x0: 480, x1: 1440, y0: 320, y1: 742 }, 3.4);

const C = { wall: '#241A22', side: '#1C141C', floor: '#1E1418', ceiling: '#160F14', lines: '#140D12' };

export const Cinema: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'cine', veil = 0.55 }) => {
  const R = CINEMA;
  const { P, Q } = R;
  const rows = [0.06, 0.22, 0.4, 0.6, 0.82];
  const flick = 0.85 + 0.15 * Math.sin(t / 7);
  return (
    <g>
      <RoomShell r={R} id={id} wall={C.wall} side={C.side} floorC={C.floor} ceiling={C.ceiling} lines={C.lines} />
      {/* the screen: a pale ghost on a dark wash, flickering with the shot clock */}
      <polygon points={Q([[0.2, 0.14, 0], [0.8, 0.14, 0], [0.8, 0.52, 0], [0.2, 0.52, 0]])} fill="#0E1420" />
      <polygon points={Q([[0.2, 0.14, 0], [0.8, 0.14, 0], [0.8, 0.52, 0], [0.2, 0.52, 0]])} fill="none" stroke="#3A3446" strokeWidth={5} />
      <polygon points={Q([[0.2, 0.14, 0], [0.8, 0.14, 0], [0.8, 0.52, 0], [0.2, 0.52, 0]])} fill="#BFD6FF" opacity={0.12 * flick} />
      {(() => {
        const g = P(0.5, 0.34, 0.005);
        return (
          <g opacity={0.85 * flick}>
            <circle cx={g.x} cy={g.y} r={44} fill="#E8ECF2" />
            <circle cx={g.x - 16} cy={g.y - 6} r={7} fill="#14101E" />
            <circle cx={g.x + 16} cy={g.y - 6} r={7} fill="#14101E" />
            <path d={`M ${g.x - 12} ${g.y + 18} Q ${g.x} ${g.y + 26} ${g.x + 12} ${g.y + 18}`} stroke="#14101E" strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d={`M ${g.x - 30} ${g.y + 46} Q ${g.x} ${g.y + 34} ${g.x + 30} ${g.y + 46} L ${g.x + 24} ${g.y + 90} L ${g.x - 24} ${g.y + 90} Z`} fill="#E8ECF2" />
          </g>
        );
      })()}
      {/* curtains framing the screen */}
      <polygon points={Q([[0.14, 0.1, 0], [0.2, 0.1, 0], [0.2, 0.54, 0], [0.14, 0.54, 0]])} fill="#5E1E24" />
      <polygon points={Q([[0.8, 0.1, 0], [0.86, 0.1, 0], [0.86, 0.54, 0], [0.8, 0.54, 0]])} fill="#5E1E24" />
      <polygon points={Q([[0.14, 0.1, 0], [0.86, 0.1, 0], [0.86, 0.16, 0], [0.14, 0.16, 0]])} fill="#5E1E24" />
      {/* wall sconces, dim red */}
      {[0.1, 0.9].map((u, i) => {
        const p = P(u, 0.34, 0.3);
        return <circle key={i} cx={p.x} cy={p.y} r={10} fill="#FF6A5A" opacity={0.5} />;
      })}
      {/* red seat rows receding toward the camera, aisle in the middle */}
      {rows.map((w, i) => (
        <g key={i}>
          <FloorShadow r={R} u={[0.04, 0.44]} w={[w, w + 0.1]} o={0.35} />
          <Box r={R} u={[0.04, 0.44]} v={[0.66, 0.8]} w={[w, w + 0.12]} front="#7A2028" side="#5E1820" top="#8A2830" />
          <Box r={R} u={[0.04, 0.44]} v={[0.48, 0.66]} w={[w, w + 0.02]} front="#7A2028" side="#5E1820" top="#8A2830" />
          <FloorShadow r={R} u={[0.56, 0.96]} w={[w, w + 0.1]} o={0.35} />
          <Box r={R} u={[0.56, 0.96]} v={[0.66, 0.8]} w={[w, w + 0.12]} front="#7A2028" side="#5E1820" top="#8A2830" />
          <Box r={R} u={[0.56, 0.96]} v={[0.48, 0.66]} w={[w, w + 0.02]} front="#7A2028" side="#5E1820" top="#8A2830" />
          {/* armrests between seats */}
          {[0.16, 0.32, 0.68, 0.84].map((u, j) => (
            <polygon key={j} points={Q([[u, 0.66, w + 0.02], [u + 0.02, 0.66, w + 0.02], [u + 0.02, 0.78, w + 0.02], [u, 0.78, w + 0.02]])} fill="#3A1016" />
          ))}
          {/* a head or two in the seats */}
          {i === 1 ? <circle cx={P(0.24, 0.42, w).x} cy={P(0.24, 0.42, w).y} r={26 * R.s(w)} fill="#0D0D12" /> : null}
          {i === 2 ? <circle cx={P(0.72, 0.42, w).x} cy={P(0.72, 0.42, w).y} r={26 * R.s(w)} fill="#0D0D12" /> : null}
          {i === 3 ? <circle cx={P(0.14, 0.42, w).x} cy={P(0.14, 0.42, w).y} r={26 * R.s(w)} fill="#0D0D12" /> : null}
        </g>
      ))}
      {/* aisle lights down the middle */}
      {rows.map((w, i) => {
        const a = P(0.5, 1, w + 0.05);
        return <circle key={i} cx={a.x} cy={a.y - 4} r={6} fill="#FFB46A" opacity={0.7} />;
      })}
      {/* popcorn on the floor */}
      {Array.from({ length: 14 }).map((_, i) => {
        const p = P(0.42 + rnd(19, i) * 0.16, 1, 0.5 + rnd(20, i) * 0.4);
        return <circle key={i} cx={p.x} cy={p.y - 4} r={4} fill="#F2E8D8" opacity={0.8} />;
      })}
      {/* a popcorn tub tipped on a seat */}
      {(() => {
        const b = P(0.86, 0.64, 0.6);
        return (
          <g transform={`rotate(24 ${b.x} ${b.y})`}>
            <path d={`M ${b.x - 20} ${b.y - 20} L ${b.x + 20} ${b.y - 20} L ${b.x + 14} ${b.y + 20} L ${b.x - 14} ${b.y + 20} Z`} fill="#C94A3A" />
            <path d={`M ${b.x - 20} ${b.y - 20} L ${b.x + 20} ${b.y - 20} L ${b.x + 16} ${b.y - 4} L ${b.x - 16} ${b.y - 4} Z`} fill="#F2E8D8" />
          </g>
        );
      })()}
      <LightVeil id={`${id}veil`} lights={[[960, 420, 420], [960, 900, 380]]} o={veil} />
      <Glow x={960} y={420} r={380} o={0.35 * flick} kind="cool" />
      <Dust t={t} seed={101} x0={600} y0={360} w={700} h={300} n={16} o={0.3} />
    </g>
  );
};
