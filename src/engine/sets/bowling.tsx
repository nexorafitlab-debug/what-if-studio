import React from 'react';
import { rnd } from '../anim';
import { makeRoom, Box, S3 } from '../room';
import { RoomShell, FloorShadow, WallClock } from '../furnish';
import { Glow, LightVeil, Dust } from '../light';

// The bowling alley — Ifinite scenes 085-090: Lily's 11th birthday party, loud and sticky and perfect.
// Looking down the lanes: the pins at the far end (back wall), four lanes receding toward the camera, the ball
// return, balloons and bunting overhead, party tables with a dragon cake, score screens. Bright party light from
// the ceiling panels and the lane glow. Characters stand at the foul line at about w 0.5 (stand(BOWLING, u, 0.5)).
export const BOWLING = makeRoom({ x: 960, y: 500 }, { x0: 480, x1: 1440, y0: 320, y1: 742 }, 3.4);

const B = { wall: '#332E4A', side: '#2A2540', floor: '#2A2230', ceiling: '#1E1828', lines: '#1E1826' };

export const Bowling: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'bowl', veil = 0.45 }) => {
  const R = BOWLING;
  const { P, Q } = R;
  const lanes = [0.14, 0.36, 0.6, 0.82];
  return (
    <g>
      <RoomShell r={R} id={id} wall={B.wall} side={B.side} floorC={B.floor} ceiling={B.ceiling} lines={B.lines} />
      {/* the pin decks at the far end: dark back with white pins */}
      {lanes.map((u, i) => {
        const p = P(u, 0.34, 0);
        return (
          <g key={i}>
            <rect x={p.x - 44} y={p.y - 30} width={88} height={120} rx={6} fill="#14101E" stroke="#3A3446" strokeWidth={3} />
            {[0, 1, 2].map((r2, j) => (
              <g key={j}>
                {[0, 1, 2, 3].slice(0, 3 - r2).map((k) => {
                  const x = p.x - (3 - r2 - 1) * 12 + k * 24;
                  const y = p.y + 58 - r2 * 26;
                  return (
                    <g key={k}>
                      <ellipse cx={x} cy={y} rx={7} ry={12} fill="#F2EFE4" />
                      <rect x={x - 7} y={y - 6} width={14} height={5} fill="#FF3344" />
                    </g>
                  );
                })}
              </g>
            ))}
          </g>
        );
      })}
      {/* score screens above the pins */}
      {lanes.map((u, i) => {
        const p = P(u, 0.12, 0);
        return (
          <g key={i}>
            <rect x={p.x - 52} y={p.y - 18} width={104} height={52} rx={6} fill="#14101E" stroke="#3A3446" strokeWidth={3} />
            <text x={p.x} y={p.y + 14} fontFamily="Montserrat, sans-serif" fontWeight={700} fontSize={22} fill="#3ED598" textAnchor="middle">
              {['SAM', 'LILY', 'JOE', 'MOM'][i]}
            </text>
          </g>
        );
      })}
      {/* the lanes: wood, receding toward the camera, with gutters */}
      {lanes.map((u, i) => (
        <g key={i}>
          <polygon points={Q([[u - 0.09, 1, 0.02], [u + 0.09, 1, 0.02], [u + 0.05, 1, 0.95], [u - 0.05, 1, 0.95]])} fill="#8A6A50" />
          <polygon points={Q([[u - 0.02, 1, 0.02], [u + 0.02, 1, 0.02], [u + 0.012, 1, 0.95], [u - 0.012, 1, 0.95]])} fill="#6A4E40" opacity={0.6} />
          <polygon points={Q([[u - 0.11, 1, 0.02], [u - 0.09, 1, 0.02], [u - 0.06, 1, 0.95], [u - 0.11, 1, 0.95]])} fill="#14101E" />
          <polygon points={Q([[u + 0.09, 1, 0.02], [u + 0.11, 1, 0.02], [u + 0.11, 1, 0.95], [u + 0.06, 1, 0.95]])} fill="#14101E" />
          {Array.from({ length: 5 }).map((_, j) => {
            const a = P(u, 1, 0.1 + j * 0.18);
            return <circle key={j} cx={a.x} cy={a.y - 4} r={4} fill="#3ED598" opacity={0.5} />;
          })}
        </g>
      ))}
      {/* a bowling ball rolling down lane 2 */}
      {(() => {
        const w = 0.25 + ((t % 60) / 60) * 0.6;
        const b = P(0.36, 1, w);
        const s = R.s(w);
        return (
          <g>
            <circle cx={b.x} cy={b.y - 16 * s} r={22 * s} fill="#3E5A8A" />
            <circle cx={b.x - 6 * s} cy={b.y - 22 * s} r={3 * s} fill="#14101E" />
            <circle cx={b.x + 6 * s} cy={b.y - 20 * s} r={3 * s} fill="#14101E" />
          </g>
        );
      })()}
      {/* the ball return rail */}
      <polygon points={Q([[0.46, 1, 0.05], [0.54, 1, 0.05], [0.54, 1, 0.9], [0.46, 1, 0.9]])} fill="#2E2A3A" />
      {[0.5, 0.3].map((u, i) => {
        const b = P(u, 1, 0.6);
        return <circle key={i} cx={b.x} cy={b.y - 14} r={16} fill={['#3E5A8A', '#8A3E5A'][i]} />;
      })}
      {/* party tables with the dragon cake, right side */}
      <FloorShadow r={R} u={[0.86, 1]} w={[0.4, 0.7]} o={0.4} />
      <Box r={R} u={[0.86, 1]} v={[0.78, 0.84]} w={[0.4, 0.7]} front="#5B4038" top="#7A5747" side="#3A2826" rim />
      {[0.88, 0.98].map((u, i) => (
        <polygon key={i} points={Q([[u, 0.84, 0.45], [u, 0.84, 0.65], [u, 1, 0.65], [u, 1, 0.45]])} fill="#3A2826" />
      ))}
      {(() => {
        const c = P(0.93, 0.78, 0.55);
        return (
          <g>
            <ellipse cx={c.x} cy={c.y - 4} rx={44} ry={10} fill="#F2E8D8" />
            <rect x={c.x - 36} y={c.y - 40} width={72} height={36} rx={6} fill="#4E8A6A" />
            <circle cx={c.x - 20} cy={c.y - 46} r={10} fill="#4E8A6A" />
            <circle cx={c.x + 20} cy={c.y - 46} r={10} fill="#4E8A6A" />
            <circle cx={c.x - 24} cy={c.y - 48} r={3} fill="#FFFFFF" />
            <circle cx={c.x + 16} cy={c.y - 48} r={3} fill="#FFFFFF" />
            {[0, 1, 2, 3].map((i2) => {
              const x = c.x - 24 + i2 * 16;
              return <path key={i2} d={`M ${x} ${c.y - 52} L ${x} ${c.y - 66}`} stroke="#FFD23F" strokeWidth={3} strokeLinecap="round" />;
            })}
          </g>
        );
      })()}
      {/* balloons and bunting overhead */}
      {[
        { x: 620, y: 300, c: '#FF6A5A' },
        { x: 760, y: 260, c: '#3ED598' },
        { x: 1180, y: 280, c: '#FFD23F' },
        { x: 1340, y: 320, c: '#5A7AB0' },
      ].map((b, i) => (
        <g key={i}>
          <path d={`M ${b.x} ${b.y + 40} Q ${b.x + 10} ${b.y + 90} ${b.x - 6} ${b.y + 130}`} stroke="#8A8498" strokeWidth={2} fill="none" />
          <ellipse cx={b.x} cy={b.y} rx={26} ry={34} fill={b.c} opacity={0.95} />
          <polygon points={`${b.x - 8},${b.y + 34} ${b.x + 8},${b.y + 34} ${b.x},${b.y + 46}`} fill={b.c} />
        </g>
      ))}
      <path d="M 560 200 Q 960 260 1360 200" stroke="#3A3446" strokeWidth={3} fill="none" />
      {Array.from({ length: 11 }).map((_, i) => {
        const x = 600 + i * 72;
        const y = 200 + 52 * (1 - Math.pow((x - 960) / 400, 2));
        return <polygon key={i} points={`${x - 16},${y} ${x + 16},${y} ${x},${y + 30}`} fill={['#FF6A5A', '#FFD23F', '#3ED598', '#5A7AB0'][i % 4]} />;
      })}
      <WallClock x={P(0.5, 0.1, 0).x} y={P(0.5, 0.1, 0).y} r={24} t={t} />
      <LightVeil id={`${id}veil`} lights={[[700, 380, 380], [1250, 380, 380], [960, 900, 420]]} o={veil} />
      <Glow x={700} y={380} r={280} o={0.35} />
      <Glow x={1250} y={380} r={280} o={0.35} />
      <Dust t={t} seed={111} x0={560} y0={360} w={700} h={300} n={20} o={0.35} />
      {Array.from({ length: 4 }).map((_, i) => (
        <circle key={i} cx={560 + rnd(21, i) * 800} cy={740 + rnd(22, i) * 180} r={1.5} fill="#BFD6FF" opacity={0.18} />
      ))}
    </g>
  );
};
