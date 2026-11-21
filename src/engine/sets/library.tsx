import React from 'react';
import { rnd } from '../anim';
import { makeRoom } from '../room';
import { RoomShell, Pendant, WallFrame } from '../furnish';
import { Box } from '../room';
import { Glow, Dust } from '../light';
import { BookTower, OpenBook } from '../props';

// The library at dusk — tall dark-wood shelves on the back wall, a rolling
// ladder, warm pendant lamps over a reading table, a tall window with the
// evening sky. Characters stand on the floor at about w 0.4 (stand(LIBRARY, u, 0.4)).
export const LIBRARY = makeRoom({ x: 960, y: 540 }, { x0: 240, x1: 1680, y0: 120, y1: 820 }, 3.0);

const SPINE = ['#7A4A3A', '#4A6A8A', '#5A7A4A', '#8A6A3A', '#6A4A7A', '#3A5A6A', '#9A5A4A'];

const Shelf: React.FC<{ x: number; y: number; w: number; h: number; seed: number }> = ({ x, y, w, h, seed }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#3A2826" />
    {Array.from({ length: 4 }).map((_, r) => (
      <g key={r}>
        <rect x={x + 8} y={y + 10 + r * (h / 4)} width={w - 16} height={h / 4 - 14} fill="#2A1C1A" />
        {Array.from({ length: 9 }).map((__, i) => (
          <rect key={i} x={x + 12 + i * ((w - 24) / 9)} y={y + 12 + r * (h / 4)} width={(w - 24) / 9 - 4} height={h / 4 - 18} fill={SPINE[Math.floor(rnd(seed, r * 9 + i) * SPINE.length)]} opacity={0.85} />
        ))}
        <rect x={x} y={y + (r + 1) * (h / 4) - 6} width={w} height={8} fill="#5B4038" />
      </g>
    ))}
  </g>
);

export const Library: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'lib', veil = 0 }) => {
  const R = LIBRARY;
  return (
    <g>
      <RoomShell r={R} id={id} floor="boards" wall="#3A2E3E" side="#2E2433" floorC="#2A1E22" ceiling="#1E1622" />
      {/* tall window with the dusk sky, between the shelves */}
      <rect x={820} y={180} width={280} height={420} fill="#2A1B45" />
      <rect x={840} y={200} width={240} height={380} fill="#E8915A" opacity={0.55} />
      <rect x={840} y={200} width={240} height={120} fill="#F2C078" opacity={0.7} />
      <circle cx={960} cy={300} r={46} fill="#FFE7B3" />
      <Glow x={960} y={300} r={180} o={0.5} />
      <path d="M 950 180 L 950 600 M 820 390 L 1100 390" stroke="#2A1C1A" strokeWidth={14} />
      {/* shelves left and right of the window */}
      <Shelf x={300} y={170} w={460} h={470} seed={11} />
      <Shelf x={1160} y={170} w={460} h={470} seed={23} />
      {/* rolling ladder against the right shelf */}
      <g stroke="#8A6452" strokeWidth={10}>
        <path d="M 1180 640 L 1300 170 M 1260 640 L 1380 170" />
        {[220, 320, 420, 520].map((yy) => (
          <path key={yy} d={`M ${1180 + (640 - yy) * 0.26} ${yy} L ${1260 + (640 - yy) * 0.26} ${yy}`} />
        ))}
      </g>
      {/* reading table with books and a lamp */}
      <Box r={R} u={[0.38, 0.62]} v={[0.62, 0.66]} w={[0.55, 0.62]} front="#5B4038" top="#7A5747" />
      <BookTower x={900} y={640} n={3} s={0.8} />
      <OpenBook x={1040} y={648} w={170} cover="#4A6A8A" />
      <g>
        <path d="M 980 640 L 980 560" stroke="#2A2026" strokeWidth={8} />
        <path d="M 950 560 L 1010 560 L 1022 596 L 938 596 Z" fill="#2A9D8F" />
        <circle cx={980} cy={600} r={16} fill="#FFE7B3" />
        <Glow x={980} y={600} r={130} o={0.6} />
      </g>
      <Pendant r={R} u={0.5} w={0.45} t={t} />
      <WallFrame x={360} y={700} w={150} h={110} art={1} />
      <WallFrame x={1440} y={700} w={150} h={110} art={2} />
      <Dust t={t} seed={31} x0={300} y0={300} w={1300} h={400} n={22} o={0.3} />
      {veil > 0 ? <rect x={-400} y={-400} width={2720} height={1880} fill="#000" opacity={veil} /> : null}
    </g>
  );
};
