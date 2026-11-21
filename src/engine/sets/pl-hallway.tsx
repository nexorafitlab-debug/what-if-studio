import React from 'react';
import { rnd } from '../anim';
import { makeRoom } from '../room';
import { RoomShell, WallClock, stand } from '../furnish';
import { Box } from '../room';
import { Glow, Dust, Cone, LightVeil } from '../light';

// A NEW school hallway, drawn fresh for PastLives1Min — NOT the old
// hallway.tsx and NOT the v2 corridor. Morning light: tall windows in the
// centre of the back wall spill pale gold across the floor; lockers line
// BOTH sides (teal left, burgundy right); a wooden bench sits left of
// centre where Alex waits; backpacks are dropped by the lockers; one locker
// door on the right hangs slightly open; fluorescent tubes hum overhead.
// Characters stand on the floor at about w 0.4 (stand(PLHALLWAY, u, 0.4)).
// The bench seat top is plHallBench() — sit Alex there with bent legs.
export const PLHALLWAY = makeRoom({ x: 960, y: 540 }, { x0: 200, x1: 1720, y0: 120, y1: 820 }, 3.0);

/** Hip position + scale for someone sitting on the bench (seat top, u 0.28).
    The bench sits a little back (w 0.41) so a seated character reads at a
    wide-shot size; scale matches stand() at the same depth. */
export const plHallBench = () => {
  const p = PLHALLWAY.P(0.28, 0.78, 0.41);
  return { x: p.x, y: p.y + 4, scale: stand(PLHALLWAY, 0.28, 0.41).scale };
};

const TEAL = ['#2E6E6A', '#357A72', '#2A625E', '#3A8278'];
const BURG = ['#7A3A44', '#84444E', '#6E323C', '#8A4A54'];

const LockerRow: React.FC<{ x0: number; cols: string[]; open?: number }> = ({ x0, cols, open = -1 }) => (
  <g>
    {cols.map((c, i) => {
      const x = x0 + i * 118;
      const ajar = i === open;
      return (
        <g key={i}>
          <rect x={x} y={220} width={110} height={430} fill={c} stroke="#1E1622" strokeWidth={4} />
          {/* vents + handle */}
          <rect x={x + 16} y={252} width={44} height={8} rx={4} fill="#1E1622" opacity={0.55} />
          <rect x={x + 16} y={268} width={44} height={8} rx={4} fill="#1E1622" opacity={0.55} />
          <rect x={x + 80} y={400} width={12} height={30} rx={6} fill="#C8B49A" />
          {ajar ? (
            <g>
              {/* dark interior behind the open door */}
              <rect x={x + 8} y={228} width={94} height={414} fill="#14101A" />
              <rect x={x + 22} y={300} width={60} height={70} rx={4} fill="#F6EFE3" opacity={0.85} />
              <rect x={x + 22} y={390} width={60} height={44} rx={4} fill="#E8823A" opacity={0.9} />
              {/* the door itself, swung open toward the camera */}
              <polygon points={`${x + 102},228 ${x + 168},258 ${x + 168},612 ${x + 102},642`} fill={c} stroke="#1E1622" strokeWidth={4} />
              <rect x={x + 148} y={400} width={10} height={28} rx={5} fill="#C8B49A" />
            </g>
          ) : null}
        </g>
      );
    })}
  </g>
);

const Backpack: React.FC<{ x: number; y: number; s: number; color: string; rot: number }> = ({ x, y, s, color, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={4} cy={4} rx={46} ry={10} fill="#000" opacity={0.35} />
    <path d="M -38 0 L -34 -72 Q 0 -88 34 -72 L 38 0 Z" fill={color} />
    <rect x={-24} y={-46} width={48} height={32} rx={8} fill="#00000033" />
    <path d="M -20 -80 Q 0 -102 20 -80" stroke="#1E1622" strokeWidth={6} fill="none" />
  </g>
);

export const PlHallway: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'plh', veil = 0.32 }) => {
  const R = PLHALLWAY;
  const flick = 0.9 + 0.1 * Math.sin(t / 4);
  const sway = Math.sin(t / 30) * 3; // the open locker door sways gently
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall="#6B5A48" side="#4A3E32" floorC="#3A2E24" ceiling="#2A211C" />
      {/* tall morning windows in the centre of the back wall */}
      <g>
        <rect x={790} y={170} width={340} height={470} fill="#F2C078" />
        <rect x={790} y={170} width={340} height={180} fill="#FFE7B3" opacity={0.8} />
        <circle cx={960} cy={280} r={52} fill="#FFF3D0" />
        <Glow x={960} y={280} r={220} o={0.55} />
        {/* distant rooftops + a tree, seen through the glass */}
        <polygon points="790,560 880,470 960,540 1040,470 1130,560 1130,640 790,640" fill="#8A6A4A" opacity={0.7} />
        <circle cx={1090} cy={545} r={26} fill="#5A7A4A" opacity={0.8} />
        <path d="M 955 170 L 955 640 M 790 400 L 1130 400" stroke="#3A2E24" strokeWidth={16} />
        <path d="M 790 170 L 1130 170 L 1130 640 L 790 640 Z" fill="none" stroke="#2A211C" strokeWidth={8} />
      </g>
      {/* morning light shaft across the floor */}
      <Cone d="M 830 640 L 1100 640 L 1300 900 L 640 900 Z" o={0.28} />
      {/* lockers both sides */}
      <LockerRow x0={268} cols={TEAL} />
      <g transform={`translate(${sway} 0)`}>
        <LockerRow x0={1152} cols={BURG} open={1} />
      </g>
      <WallClock x={1450} y={150} r={28} t={t} />
      {/* the wooden bench, left of centre — seat top at v 0.78 so a seated
          character's feet (rig leg length 140) reach the floor; set back at
          w 0.41 so the sitter reads at wide-shot size */}
      <Box r={R} u={[0.18, 0.38]} v={[0.78, 0.84]} w={[0.35, 0.47]} front="#6A4A34" top="#8A6244" side="#4A3226" rim />
      <Box r={R} u={[0.19, 0.21]} v={[0.84, 1]} w={[0.37, 0.45]} front="#4A3226" top="#5A4030" />
      <Box r={R} u={[0.35, 0.37]} v={[0.84, 1]} w={[0.37, 0.45]} front="#4A3226" top="#5A4030" />
      {/* backpacks dropped by the lockers */}
      <Backpack x={520} y={800} s={0.9} color="#2E6FF0" rot={-6} />
      <Backpack x={1420} y={810} s={1.0} color="#E8823A" rot={8} />
      <Backpack x={700} y={905} s={0.7} color="#5A7A4A" rot={3} />
      {/* fluorescent tubes */}
      {[620, 960, 1300].map((x) => (
        <g key={x} opacity={flick}>
          <rect x={x - 80} y={138} width={160} height={16} rx={8} fill="#FFF3D0" />
          <Glow x={x} y={146} r={130} o={0.3} />
        </g>
      ))}
      <LightVeil
        id={`${id}veil`}
        lights={[
          [960, 400, 460],
          [620, 146, 260],
          [1300, 146, 260],
          [960, 900, 420],
        ]}
        o={veil}
      />
      <Glow x={960} y={300} r={260} o={0.4} />
      <Dust t={t} seed={41} x0={820} y0={300} w={320} h={500} n={18} o={0.5} />
      <Dust t={t} seed={47} x0={300} y0={300} w={1300} h={380} n={12} o={0.18} />
    </g>
  );
};
