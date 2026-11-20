import React from 'react';
import { rnd } from '../anim';
import { makeRoom, Box, S3 } from '../room';
import { RoomShell, FloorShadow } from '../furnish';
import { Glow, LightVeil, Dust } from '../light';

// The bus interior — Ifinite scenes 079-084: Sam rides the bus, sunlight through the windows, counts the stops.
// Looking down the aisle: the windshield and driver at the front (back wall), seat rows on both sides receding
// toward the camera, poles to hold, a stop button, ads above the windows, ticket machine by the door. Sunlight
// through the windows is the main light. Characters sit or stand in the aisle at about w 0.5 (stand(BUS, u, 0.5)).
export const BUS = makeRoom({ x: 960, y: 500 }, { x0: 480, x1: 1440, y0: 320, y1: 742 }, 3.4);

const B = { wall: '#3A3E4A', side: '#2E323C', floor: '#2A2626', ceiling: '#232028', lines: '#1E1A22' };

export const Bus: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'bus', veil = 0.5 }) => {
  const R = BUS;
  const { P, Q } = R;
  const seatRows = [0.06, 0.2, 0.36, 0.54, 0.74];
  return (
    <g>
      <RoomShell r={R} id={id} wall={B.wall} side={B.side} floorC={B.floor} ceiling={B.ceiling} lines={B.lines} />
      {/* the windshield at the front: road and sky ahead */}
      <polygon points={Q([[0.3, 0.12, 0], [0.7, 0.12, 0], [0.7, 0.48, 0], [0.3, 0.48, 0]])} fill="#B8C8E8" />
      <polygon points={Q([[0.3, 0.12, 0], [0.7, 0.12, 0], [0.7, 0.3, 0], [0.3, 0.3, 0]])} fill="#8A9AC0" />
      <polygon points={Q([[0.3, 0.48, 0], [0.7, 0.48, 0], [0.7, 0.52, 0], [0.3, 0.52, 0]])} fill="#2E323C" />
      <polygon points={Q([[0.48, 0.12, 0], [0.52, 0.12, 0], [0.52, 0.48, 0], [0.48, 0.48, 0]])} fill="#2E323C" />
      {/* the road ahead: dark road, centre dashes */}
      <polygon points={Q([[0.3, 0.3, 0], [0.7, 0.3, 0], [0.7, 0.48, 0], [0.3, 0.48, 0]])} fill="#3A3A44" />
      {[0.32, 0.38, 0.44].map((v, i) => (
        <polygon key={i} points={Q([[0.49, v, 0], [0.51, v, 0], [0.51, v + 0.03, 0], [0.49, v + 0.03, 0]])} fill="#E8E2D2" opacity={0.85} />
      ))}
      {/* driver area: wheel and dashboard */}
      {(() => {
        const d = P(0.18, 0.56, 0.02);
        return (
          <g>
            <circle cx={d.x} cy={d.y} r={30} fill="none" stroke="#1E1C28" strokeWidth={8} />
            <circle cx={d.x} cy={d.y} r={8} fill="#1E1C28" />
            <polygon points={Q([[0.08, 0.52, 0], [0.28, 0.52, 0], [0.28, 0.58, 0], [0.08, 0.58, 0]])} fill="#242028" />
          </g>
        );
      })()}
      {/* windows along both side walls, sunlight slanting in */}
      {seatRows.map((w, i) => {
        const lw = P(0, 0.22, w);
        const rw = P(1, 0.22, w);
        const s = R.s(w);
        return (
          <g key={i}>
            <polygon points={Q([[0, 0.16, w], [0, 0.16, w + 0.06], [0, 0.44, w + 0.06], [0, 0.44, w]])} fill="#C8D4F0" />
            <polygon points={Q([[1, 0.16, w], [1, 0.16, w + 0.06], [1, 0.44, w + 0.06], [1, 0.44, w]])} fill="#C8D4F0" />
            {i % 2 === 0 ? <polygon points={Q([[0, 0.44, w], [0.1, 0.62, w + 0.1], [0.16, 0.62, w + 0.1], [0, 0.5, w]])} fill="#FFD39A" opacity={0.18} style={{ mixBlendMode: 'screen' }} /> : null}
            <polygon points={Q([[0.02, 0.14, w], [0.02, 0.14, w + 0.07], [0.02, 0.46, w + 0.07], [0.02, 0.46, w]])} fill="none" stroke="#1E1A22" strokeWidth={2 * s} />
            <polygon points={Q([[0.98, 0.14, w], [0.98, 0.14, w + 0.07], [0.98, 0.46, w + 0.07], [0.98, 0.46, w]])} fill="none" stroke="#1E1A22" strokeWidth={2 * s} />
          </g>
        );
      })}
      {/* ads above the windows */}
      {[0.2, 0.5].map((w, i) => (
        <polygon key={i} points={Q([[0.06, 0.08, w], [0.3, 0.08, w], [0.3, 0.13, w], [0.06, 0.13, w]])} fill={['#C96A5A', '#5A7AB0'][i]} opacity={0.85} />
      ))}
      {/* seat rows: left and right of the aisle, receding toward the camera */}
      {seatRows.map((w, i) => (
        <g key={i}>
          <FloorShadow r={R} u={[0.04, 0.4]} w={[w, w + 0.1]} o={0.3} />
          <Box r={R} u={[0.04, 0.4]} v={[0.66, 0.78]} w={[w, w + 0.1]} front="#3E5A7A" side="#2E4258" top="#4E6A8A" />
          <Box r={R} u={[0.04, 0.4]} v={[0.5, 0.66]} w={[w, w + 0.02]} front="#3E5A7A" side="#2E4258" top="#4E6A8A" />
          <FloorShadow r={R} u={[0.6, 0.96]} w={[w, w + 0.1]} o={0.3} />
          <Box r={R} u={[0.6, 0.96]} v={[0.66, 0.78]} w={[w, w + 0.1]} front="#3E5A7A" side="#2E4258" top="#4E6A8A" />
          <Box r={R} u={[0.6, 0.96]} v={[0.5, 0.66]} w={[w, w + 0.02]} front="#3E5A7A" side="#2E4258" top="#4E6A8A" />
        </g>
      ))}
      {/* poles to hold: vertical at one depth, so they read as poles, not diagonals */}
      {[0.44, 0.56].map((u, i) => {
        const a = P(u, 0.08, 0.5);
        const b = P(u, 1, 0.5);
        return <path key={i} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke="#8A8A96" strokeWidth={7} strokeLinecap="round" />;
      })}
      <path d={`M ${P(0.44, 0.08, 0.5).x} ${P(0.44, 0.08, 0.5).y} L ${P(0.56, 0.08, 0.5).x} ${P(0.56, 0.08, 0.5).y}`} stroke="#8A8A96" strokeWidth={6} />
      {/* stop button on a pole */}
      {(() => {
        const b = P(0.56, 0.3, 0.5);
        return <circle cx={b.x} cy={b.y} r={12} fill="#FF3344" stroke="#8A1A24" strokeWidth={3} />;
      })()}
      {/* (no ticket machine — it read as a stray box on the seats) */}
      <LightVeil id={`${id}veil`} lights={[[700, 460, 340], [1250, 460, 340], [960, 900, 420]]} o={veil} />
      <Glow x={700} y={460} r={260} o={0.3} />
      <Glow x={1250} y={460} r={260} o={0.3} />
      <Dust t={t} seed={81} x0={560} y0={360} w={700} h={300} n={24} o={0.45} />
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={560 + rnd(15, i) * 800} cy={740 + rnd(16, i) * 180} r={1.5} fill="#BFD6FF" opacity={0.2} />
      ))}
    </g>
  );
};
