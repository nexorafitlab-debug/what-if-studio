import React from 'react';
import { rnd } from '../anim';
import { makeRoom, Box, S3 } from '../room';
import { RoomShell, FloorShadow } from '../furnish';
import { Glow, LightVeil, Dust } from '../light';

// The airplane cabin — Ifinite scene 023: "EVERYONE: 50 YEARS", turbulence, everyone back to the magazine.
// Looking down the aisle: the cockpit door and galley at the front (back wall), seat rows on both sides receding
// toward the camera, overhead bins, round windows with sky and drifting clouds, seatback screens, the blue aisle
// carpet. Flat cabin light from the ceiling panels. Characters sit in the seats at about w 0.4 (stand(AIRPLANE, u, 0.4)).
export const AIRPLANE = makeRoom({ x: 960, y: 500 }, { x0: 480, x1: 1440, y0: 320, y1: 742 }, 3.4);

const A = { wall: '#3E4250', side: '#323642', floor: '#2A2E3A', ceiling: '#2A2E3A', lines: '#20242E' };

export const Airplane: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'plane', veil = 0.45 }) => {
  const R = AIRPLANE;
  const { P, Q } = R;
  const rows = [0.04, 0.18, 0.34, 0.52, 0.72];
  return (
    <g>
      <RoomShell r={R} id={id} wall={A.wall} side={A.side} floorC={A.floor} ceiling={A.ceiling} lines={A.lines} />
      {/* cockpit door and galley at the front */}
      <polygon points={Q([[0.42, 0.14, 0], [0.58, 0.14, 0], [0.58, 0.62, 0], [0.42, 0.62, 0]])} fill="#2A2E3A" stroke="#1E222C" strokeWidth={4} />
      <circle cx={P(0.55, 0.4, 0).x} cy={P(0.55, 0.4, 0).y} r={6} fill="#C9A44A" />
      <polygon points={Q([[0.6, 0.2, 0], [0.72, 0.2, 0], [0.72, 0.62, 0], [0.6, 0.62, 0]])} fill="#3A3E4A" />
      <polygon points={Q([[0.28, 0.2, 0], [0.4, 0.2, 0], [0.4, 0.62, 0], [0.28, 0.62, 0]])} fill="#3A3E4A" />
      {/* ceiling light panels down the aisle */}
      {[0.15, 0.4, 0.65].map((w, i) => {
        const c = P(0.5, 0, w);
        return <ellipse key={i} cx={c.x} cy={c.y + 14} rx={110 * R.s(w)} ry={12 * R.s(w)} fill="#F2F0E4" opacity={0.85} />;
      })}
      {/* overhead bins along both sides */}
      {rows.map((w, i) => (
        <g key={i}>
          <Box r={R} u={[0.02, 0.3]} v={[0.1, 0.24]} w={[w, w + 0.1]} front="#4A4E5E" side="#3A3E4A" top="#5A5E6E" />
          <Box r={R} u={[0.7, 0.98]} v={[0.1, 0.24]} w={[w, w + 0.1]} front="#4A4E5E" side="#3A3E4A" top="#5A5E6E" />
        </g>
      ))}
      {/* round windows with sky and drifting clouds */}
      {rows.map((w, i) => {
        const lw = P(0, 0.32, w + 0.03);
        const rw = P(1, 0.32, w + 0.03);
        const s = R.s(w);
        const cx = ((t * 0.4 + i * 90) % 200) - 100;
        return (
          <g key={i}>
            <ellipse cx={lw.x} cy={lw.y} rx={34 * s} ry={42 * s} fill="#B8D4F0" />
            <ellipse cx={lw.x + cx * 0.2} cy={lw.y - 10 * s} rx={22 * s} ry={10 * s} fill="#FFFFFF" opacity={0.85} />
            <ellipse cx={lw.x} cy={lw.y} rx={34 * s} ry={42 * s} fill="none" stroke="#1E222C" strokeWidth={4 * s} />
            <ellipse cx={rw.x} cy={rw.y} rx={34 * s} ry={42 * s} fill="#B8D4F0" />
            <ellipse cx={rw.x - cx * 0.2} cy={rw.y + 6 * s} rx={22 * s} ry={10 * s} fill="#FFFFFF" opacity={0.85} />
            <ellipse cx={rw.x} cy={rw.y} rx={34 * s} ry={42 * s} fill="none" stroke="#1E222C" strokeWidth={4 * s} />
          </g>
        );
      })}
      {/* the blue aisle carpet */}
      <polygon points={Q([[0.42, 1, 0.02], [0.58, 1, 0.02], [0.58, 1, 0.95], [0.42, 1, 0.95]])} fill="#2E4A6E" />
      <polygon points={Q([[0.46, 1, 0.02], [0.54, 1, 0.02], [0.54, 1, 0.95], [0.46, 1, 0.95]])} fill="#3A5A82" />
      {/* seat rows: three seats each side, headrests, seatback screens */}
      {rows.map((w, i) => (
        <g key={i}>
          <FloorShadow r={R} u={[0.06, 0.4]} w={[w, w + 0.1]} o={0.3} />
          <Box r={R} u={[0.06, 0.4]} v={[0.62, 0.76]} w={[w, w + 0.1]} front="#4A5A7A" side="#38445E" top="#5A6A8A" />
          <Box r={R} u={[0.06, 0.4]} v={[0.44, 0.62]} w={[w, w + 0.02]} front="#4A5A7A" side="#38445E" top="#5A6A8A" />
          <FloorShadow r={R} u={[0.6, 0.94]} w={[w, w + 0.1]} o={0.3} />
          <Box r={R} u={[0.6, 0.94]} v={[0.62, 0.76]} w={[w, w + 0.1]} front="#4A5A7A" side="#38445E" top="#5A6A8A" />
          <Box r={R} u={[0.6, 0.94]} v={[0.44, 0.62]} w={[w, w + 0.02]} front="#4A5A7A" side="#38445E" top="#5A6A8A" />
          {/* seatback screens on the front row faces */}
          <polygon points={Q([[0.14, 0.5, w], [0.2, 0.5, w], [0.2, 0.58, w], [0.14, 0.58, w]])} fill="#14101E" />
          <polygon points={Q([[0.8, 0.5, w], [0.86, 0.5, w], [0.86, 0.58, w], [0.8, 0.58, w]])} fill="#14101E" />
          {/* tray tables folded down on two seats */}
          {i === 1 ? <polygon points={Q([[0.24, 0.62, w], [0.36, 0.62, w], [0.36, 0.66, w], [0.24, 0.66, w]])} fill="#6A6E7E" /> : null}
        </g>
      ))}
      {/* a magazine on one seat */}
      {(() => {
        const m = P(0.7, 0.74, 0.55);
        return <rect x={m.x - 24} y={m.y - 14} width={48} height={28} rx={3} fill="#D9C69A" transform={`rotate(-6 ${m.x} ${m.y})`} />;
      })()}
      <LightVeil id={`${id}veil`} lights={[[700, 460, 340], [1250, 460, 340], [960, 900, 420]]} o={veil} />
      <Glow x={700} y={460} r={240} o={0.25} />
      <Glow x={1250} y={460} r={240} o={0.25} />
      <Dust t={t} seed={91} x0={560} y0={360} w={700} h={300} n={18} o={0.3} />
      {Array.from({ length: 4 }).map((_, i) => (
        <circle key={i} cx={560 + rnd(17, i) * 800} cy={740 + rnd(18, i) * 180} r={1.5} fill="#BFD6FF" opacity={0.18} />
      ))}
    </g>
  );
};
