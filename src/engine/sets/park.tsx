import React from 'react';
import { rnd } from '../anim';
import { makeRoom } from '../room';
import { DuskSky, Sun } from '../kit';
import { Glow, Dust } from '../light';

// The park at dusk — Ifinite scenes 031-032: the ball chase, the "HEY!" shout. A path through the grass, big trees,
// a bench, a parked car, a street lamp, bushes, the city skyline behind. The low sun is the light. Characters
// stand on the path at about w 0.4 (stand(PARK, u, 0.4)).
export const PARK = makeRoom({ x: 960, y: 540 }, { x0: 0, x1: 1920, y0: 540, y1: 820 }, 3.0);

export const Park: React.FC<{ t: number }> = ({ t }) => {
  const R = PARK;
  const { P } = R;
  return (
    <g>
      <DuskSky id="parksky" horizonY={620} />
      <Sun x={1560} y={520} r={110} t={t} />
      {/* the city skyline behind the park */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = -100 + i * 180;
        const h = 120 + rnd(23, i) * 180;
        return (
          <g key={i}>
            <rect x={x} y={620 - h} width={150} height={h} fill="#3E2E52" />
            {Array.from({ length: 4 }).map((__, j) => (
              <rect key={j} x={x + 20 + j * 32} y={620 - h + 30 + (j % 2) * 50} width={14} height={18} fill="#FFC27A" opacity={0.5 + rnd(24, i * 5 + j) * 0.4} />
            ))}
          </g>
        );
      })}
      {/* the grass */}
      <rect x={-400} y={620} width={2720} height={460} fill="#2A3A2E" />
      <rect x={-400} y={620} width={2720} height={26} fill="#3A4A38" />
      {/* the path, widening toward the camera */}
      <polygon points="-400,1080 760,620 1160,620 2320,1080" fill="#8A7A62" />
      <polygon points="-400,1080 820,620 1100,620 2320,1080" fill="#9A8A72" opacity={0.6} />
      {/* big trees */}
      {[
        { x: 180, s: 1.15, c: '#2E4A34' },
        { x: 420, s: 0.9, c: '#35563A' },
        { x: 1560, s: 1.05, c: '#2E4A34' },
        { x: 1800, s: 0.85, c: '#3A5A40' },
      ].map((tr, i) => (
        <g key={i}>
          <path d={`M ${tr.x - 16 * tr.s} 640 L ${tr.x - 10 * tr.s} ${640 - 200 * tr.s} L ${tr.x + 10 * tr.s} ${640 - 200 * tr.s} L ${tr.x + 16 * tr.s} 640 Z`} fill="#4A3226" />
          <circle cx={tr.x} cy={640 - 260 * tr.s} r={110 * tr.s} fill={tr.c} />
          <circle cx={tr.x - 70 * tr.s} cy={640 - 200 * tr.s} r={70 * tr.s} fill={tr.c} />
          <circle cx={tr.x + 70 * tr.s} cy={640 - 210 * tr.s} r={76 * tr.s} fill={tr.c} />
          <circle cx={tr.x - 30 * tr.s} cy={640 - 300 * tr.s} r={40 * tr.s} fill="#FFB46A" opacity={0.25} />
        </g>
      ))}
      {/* bushes along the path */}
      {[
        { x: 640, y: 700, s: 1 },
        { x: 1240, y: 720, s: 1.2 },
        { x: 700, y: 880, s: 1.4 },
      ].map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r={46 * b.s} fill="#35563A" />
          <circle cx={b.x + 40 * b.s} cy={b.y + 8} r={34 * b.s} fill="#2E4A34" />
        </g>
      ))}
      {/* the bench */}
      {(() => {
        const b = P(0.2, 1, 0.5);
        return (
          <g>
            <ellipse cx={b.x} cy={b.y + 4} rx={130} ry={12} fill="#000" opacity={0.35} />
            <rect x={b.x - 120} y={b.y - 120} width={240} height={16} rx={6} fill="#7A5747" />
            <rect x={b.x - 120} y={b.y - 96} width={240} height={16} rx={6} fill="#6A4A3E" />
            <rect x={b.x - 120} y={b.y - 60} width={240} height={20} rx={6} fill="#8A6452" />
            <path d={`M ${b.x - 110} ${b.y - 44} L ${b.x - 110} ${b.y} M ${b.x + 110} ${b.y - 44} L ${b.x + 110} ${b.y}`} stroke="#2A2026" strokeWidth={10} />
            <path d={`M ${b.x - 120} ${b.y - 120} L ${b.x - 120} ${b.y - 200} M ${b.x + 120} ${b.y - 120} L ${b.x + 120} ${b.y - 200}`} stroke="#2A2026" strokeWidth={8} />
            <rect x={b.x - 126} y={b.y - 210} width={252} height={14} rx={6} fill="#7A5747" />
          </g>
        );
      })()}
      {/* the parked car */}
      {(() => {
        const c = P(0.82, 1, 0.42);
        return (
          <g>
            <ellipse cx={c.x} cy={c.y + 4} rx={170} ry={12} fill="#000" opacity={0.4} />
            <path d={`M ${c.x - 160} ${c.y} Q ${c.x - 170} ${c.y - 50} ${c.x - 90} ${c.y - 56} L ${c.x - 50} ${c.y - 96} Q ${c.x} ${c.y - 110} ${c.x + 60} ${c.y - 96} L ${c.x + 110} ${c.y - 56} Q ${c.x + 170} ${c.y - 50} ${c.x + 160} ${c.y} Z`} fill="#4A6A8A" />
            <polygon points={`${c.x - 40},${c.y - 92} ${c.x + 50},${c.y - 92} ${c.x + 80},${c.y - 58} ${c.x - 70},${c.y - 58}`} fill="#B8D4F0" opacity={0.85} />
            <circle cx={c.x - 100} cy={c.y - 2} r={26} fill="#0E0C12" stroke="#4A4460" strokeWidth={5} />
            <circle cx={c.x + 100} cy={c.y - 2} r={26} fill="#0E0C12" stroke="#4A4460" strokeWidth={5} />
            <circle cx={c.x + 158} cy={c.y - 34} r={10} fill="#FFE7B3" />
            <Glow x={c.x + 158} y={c.y - 34} r={60} o={0.5} />
          </g>
        );
      })()}
      {/* the street lamp, lit */}
      {(() => {
        const l = P(0.62, 1, 0.3);
        return (
          <g>
            <path d={`M ${l.x} ${l.y} L ${l.x} ${l.y - 260}`} stroke="#2A2026" strokeWidth={10} />
            <path d={`M ${l.x} ${l.y - 260} Q ${l.x + 40} ${l.y - 280} ${l.x + 60} ${l.y - 250}`} stroke="#2A2026" strokeWidth={8} fill="none" />
            <circle cx={l.x + 62} cy={l.y - 246} r={14} fill="#FFE7B3" />
            <Glow x={l.x + 62} y={l.y - 246} r={120} o={0.6} />
          </g>
        );
      })()}
      {/* a ball on the path */}
      <circle cx={P(0.48, 1, 0.7).x} cy={P(0.48, 1, 0.7).y - 18} r={18} fill="#FF6A5A" />
      <Dust t={t} seed={121} x0={200} y0={400} w={1500} h={300} n={24} o={0.35} />
    </g>
  );
};
