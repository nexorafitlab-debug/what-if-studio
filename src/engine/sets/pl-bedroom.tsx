import React from 'react';
import { makeRoom } from '../room';
import { RoomShell, WallFrame } from '../furnish';
import { Box } from '../room';
import { Glow, Dust, Cone, LightVeil } from '../light';

// A NEW bedroom, drawn fresh for PastLives1Min — NOT the old bedroom.tsx.
// Evening layout, mirrored from the old room: the bed is on the RIGHT with
// posters above it, the messy desk is on the LEFT with a glowing laptop,
// the window sits centre-left with a low orange evening sun and swaying
// curtains, and the nightstand between bed and window holds a warm lamp
// and the circular lifesight detector. Warm lamp light is the key light;
// the evening window answers it in orange.
// Characters stand on the floor at about w 0.4 (stand(PLBEDROOM, u, 0.4)).
export const PLBEDROOM = makeRoom({ x: 960, y: 520 }, { x0: 420, x1: 1500, y0: 300, y1: 760 }, 3.4);

/** The window's screen rect, for people passing outside it. */
export const PLB_WINDOW = { x0: 560, x1: 860, y0: 340, y1: 600 };
/** Where the detector sits on the nightstand (its centre). */
export const PLB_DETECTOR = (() => {
  const p = PLBEDROOM.P(0.54, 0.78, 0.1);
  return { x: p.x, y: p.y - 34 };
})();
/** Where the lamp bulb is. */
export const PLB_LAMP = (() => {
  const p = PLBEDROOM.P(0.47, 0.78, 0.06);
  return { x: p.x, y: p.y - 92 };
})();

/** The lifesight detector: a circular device with a glowing screen. `n`
    is the number on its screen (undefined = idle soft glow). */
export const Detector: React.FC<{ x: number; y: number; s?: number; t?: number; n?: string; glow?: number }> = ({
  x, y, s = 1, t = 0, n, glow = 1,
}) => {
  const pulse = 0.85 + 0.15 * Math.sin(t / 8);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={46} fill="#1E1C28" stroke="#3A3446" strokeWidth={4} />
      <circle r={46} fill="none" stroke="#7FD4FF" strokeWidth={3} opacity={0.5 * glow * pulse} style={{ filter: 'drop-shadow(0 0 10px #7FD4FF)' }} />
      <circle r={34} fill="#0E2A3A" stroke="#7FD4FF" strokeWidth={2} />
      {n ? (
        <text x={0} y={12} fontFamily="Montserrat, sans-serif" fontWeight={700} fontSize={34} fill="#FFD700" textAnchor="middle" style={{ filter: 'drop-shadow(0 0 8px #FFD700)' }}>
          {n}
        </text>
      ) : (
        <g opacity={0.9 * glow * pulse}>
          <circle r={10} fill="#7FD4FF" style={{ filter: 'drop-shadow(0 0 10px #7FD4FF)' }} />
          <circle r={18} fill="none" stroke="#7FD4FF" strokeWidth={2} opacity={0.6} />
        </g>
      )}
      {/* little antenna + base nub */}
      <path d="M 0 -46 L 0 -62" stroke="#3A3446" strokeWidth={5} strokeLinecap="round" />
      <circle cx={0} cy={-66} r={5} fill="#FF5A5A" opacity={0.7 + 0.3 * Math.sin(t / 5)} />
    </g>
  );
};

export const PlBedroom: React.FC<{ t: number; id?: string; veil?: number; detectorOnStand?: boolean }> = ({
  t, id = 'plb', veil = 0.4, detectorOnStand = true,
}) => {
  const R = PLBEDROOM;
  const { P, Q } = R;
  const lampFlick = 0.92 + 0.08 * Math.sin(t / 7);
  const curtain = Math.sin(t / 26) * 6;
  const lamp = PLB_LAMP;
  return (
    <g>
      <RoomShell r={R} id={id} floor="boards" wall="#4A3550" side="#382A40" floorC="#2C2030" ceiling="#1E1626" />
      {/* evening window, centre-left: low orange sun, rooftops, swaying curtains */}
      <g>
        <rect x={PLB_WINDOW.x0} y={PLB_WINDOW.y0} width={PLB_WINDOW.x1 - PLB_WINDOW.x0} height={PLB_WINDOW.y1 - PLB_WINDOW.y0} fill="#E8915A" />
        <rect x={PLB_WINDOW.x0} y={PLB_WINDOW.y0} width={PLB_WINDOW.x1 - PLB_WINDOW.x0} height={110} fill="#F2C078" opacity={0.85} />
        <circle cx={640} cy={480} r={44} fill="#FFE7B3" />
        <Glow x={640} y={480} r={170} o={0.5} />
        <polygon points="560,600 640,520 720,580 800,520 860,600 860,600 560,600" fill="#3A2A4A" opacity={0.85} />
        <path d={`M ${PLB_WINDOW.x0 + 150} ${PLB_WINDOW.y0} L ${PLB_WINDOW.x0 + 150} ${PLB_WINDOW.y1} M ${PLB_WINDOW.x0} ${PLB_WINDOW.y0 + 130} L ${PLB_WINDOW.x1} ${PLB_WINDOW.y0 + 130}`} stroke="#2A1C26" strokeWidth={12} />
        <rect x={PLB_WINDOW.x0} y={PLB_WINDOW.y0} width={PLB_WINDOW.x1 - PLB_WINDOW.x0} height={PLB_WINDOW.y1 - PLB_WINDOW.y0} fill="none" stroke="#241A28" strokeWidth={8} />
        {/* curtains */}
        <path d={`M ${PLB_WINDOW.x0 - 26} ${PLB_WINDOW.y0 - 14} L ${PLB_WINDOW.x0 + 26 + curtain} ${PLB_WINDOW.y0 - 14} L ${PLB_WINDOW.x0 + 20 + curtain} ${PLB_WINDOW.y1 + 10} L ${PLB_WINDOW.x0 - 20} ${PLB_WINDOW.y1 + 10} Z`} fill="#7A4A5A" opacity={0.95} />
        <path d={`M ${PLB_WINDOW.x1 - 26 - curtain} ${PLB_WINDOW.y0 - 14} L ${PLB_WINDOW.x1 + 26} ${PLB_WINDOW.y0 - 14} L ${PLB_WINDOW.x1 + 20} ${PLB_WINDOW.y1 + 10} L ${PLB_WINDOW.x1 - 20 - curtain} ${PLB_WINDOW.y1 + 10} Z`} fill="#7A4A5A" opacity={0.95} />
      </g>
      {/* the messy desk, left wall: papers, books, a mug, a glowing laptop */}
      <Box r={R} u={[0.04, 0.32]} v={[0.68, 0.76]} w={[0.3, 0.46]} front="#5B4038" top="#7A5747" side="#3A2826" rim />
      <Box r={R} u={[0.05, 0.07]} v={[0.76, 1]} w={[0.32, 0.44]} front="#3A2826" top="#4A322A" />
      <Box r={R} u={[0.29, 0.31]} v={[0.76, 1]} w={[0.32, 0.44]} front="#3A2826" top="#4A322A" />
      {(() => {
        const d = P(0.18, 0.68, 0.4);
        return (
          <g>
            {/* scattered papers */}
            <rect x={d.x - 70} y={d.y - 8} width={64} height={40} fill="#F6EFE3" opacity={0.9} transform={`rotate(-8 ${d.x - 40} ${d.y + 10})`} />
            <rect x={d.x + 6} y={d.y - 14} width={60} height={38} fill="#E9E2D2" opacity={0.9} transform={`rotate(6 ${d.x + 36} ${d.y + 4})`} />
            <rect x={d.x - 40} y={d.y - 30} width={58} height={36} fill="#F6EFE3" opacity={0.85} transform={`rotate(-3 ${d.x - 10} ${d.y - 12})`} />
            {/* book stack */}
            <rect x={d.x - 110} y={d.y - 26} width={70} height={12} rx={3} fill="#7A4A3A" />
            <rect x={d.x - 106} y={d.y - 38} width={62} height={12} rx={3} fill="#4A6A8A" />
            <rect x={d.x - 100} y={d.y - 50} width={54} height={12} rx={3} fill="#5A7A4A" />
            {/* mug */}
            <rect x={d.x + 84} y={d.y - 34} width={26} height={30} rx={4} fill="#2A9D8F" />
            <path d={`M ${d.x + 110} ${d.y - 28} q 14 8 0 20`} stroke="#2A9D8F" strokeWidth={5} fill="none" />
            {/* laptop, screen glowing */}
            <g>
              <polygon points={`${d.x + 130},${d.y - 6} ${d.x + 210},${d.y - 6} ${d.x + 210},${d.y + 2} ${d.x + 130},${d.y + 2}`} fill="#1E1C28" />
              <polygon points={`${d.x + 132},${d.y - 66} ${d.x + 208},${d.y - 66} ${d.x + 208},${d.y - 8} ${d.x + 132},${d.y - 8}`} fill="#BFD6FF" opacity={0.9} />
              <polygon points={`${d.x + 132},${d.y - 66} ${d.x + 208},${d.y - 66} ${d.x + 208},${d.y - 8} ${d.x + 132},${d.y - 8}`} fill="none" stroke="#1E1C28" strokeWidth={4} />
              <Glow x={d.x + 170} y={d.y - 36} r={70} o={0.35} />
            </g>
          </g>
        );
      })()}
      {/* shelf with books above the desk, clear of the window */}
      <Box r={R} u={[0.02, 0.13]} v={[0.42, 0.46]} w={[0.02, 0.1]} front="#5B4038" top="#7A5747" />
      {['#7A4A3A', '#4A6A8A', '#5A7A4A', '#8A6A3A', '#6A4A7A'].map((c, i) => (
        <rect key={i} x={P(0.03 + i * 0.02, 0.42, 0.06).x} y={P(0.03 + i * 0.02, 0.42, 0.06).y - 52} width={20} height={52} fill={c} />
      ))}
      {/* the bed, right side: headboard, mattress, teal blanket, pillows */}
      <Box r={R} u={[0.64, 0.97]} v={[0.5, 0.72]} w={[0, 0.06]} front="#4A3A44" top="#5A4652" />
      <Box r={R} u={[0.64, 0.97]} v={[0.72, 1]} w={[0.02, 0.1]} front="#3E3038" top="#4A3A44" />
      <polygon points={Q([[0.64, 0.72, 0.04], [0.97, 0.72, 0.04], [0.97, 0.72, 0.42], [0.64, 0.72, 0.42]])} fill="#E6E0D2" />
      <polygon points={Q([[0.64, 0.72, 0.1], [0.97, 0.72, 0.1], [0.97, 0.72, 0.42], [0.64, 0.72, 0.42]])} fill="#2F6E69" />
      <polygon points={Q([[0.64, 0.72, 0.42], [0.97, 0.72, 0.42], [0.97, 1, 0.42], [0.64, 1, 0.42]])} fill="#265A56" />
      {/* pillows */}
      <ellipse cx={P(0.7, 0.72, 0.08).x} cy={P(0.7, 0.72, 0.08).y - 16} rx={46} ry={22} fill="#E9E2D2" />
      <ellipse cx={P(0.88, 0.72, 0.08).x} cy={P(0.88, 0.72, 0.08).y - 16} rx={46} ry={22} fill="#DCD4C4" />
      {/* posters above the bed */}
      <WallFrame x={1120} y={330} w={110} h={140} art={1} />
      <WallFrame x={1260} y={348} w={92} h={112} art={2} />
      {/* the nightstand: drawer, warm lamp, the detector */}
      <Box r={R} u={[0.47, 0.6]} v={[0.78, 1]} w={[0.02, 0.12]} front="#4A3A36" top="#5E4A44" side="#3A2C29" rim />
      <polygon points={Q([[0.48, 0.82, 0.12], [0.59, 0.82, 0.12], [0.59, 0.9, 0.12], [0.48, 0.9, 0.12]])} fill="none" stroke="#2E2220" strokeWidth={3} />
      <circle cx={P(0.535, 0.86, 0.12).x} cy={P(0.535, 0.86, 0.12).y} r={4} fill="#C9A46A" />
      {/* lamp */}
      <g opacity={lampFlick}>
        <ellipse cx={lamp.x} cy={lamp.y + 92} rx={20} ry={5} fill="#2A2026" />
        <path d={`M ${lamp.x} ${lamp.y + 90} L ${lamp.x} ${lamp.y + 20}`} stroke="#2A2026" strokeWidth={6} />
        <path d={`M ${lamp.x - 24} ${lamp.y - 18} L ${lamp.x + 24} ${lamp.y - 18} L ${lamp.x + 38} ${lamp.y + 24} L ${lamp.x - 38} ${lamp.y + 24} Z`} fill="#F2D2A0" />
        <Cone d={`M ${lamp.x - 36} ${lamp.y + 24} L ${lamp.x + 36} ${lamp.y + 24} L ${lamp.x + 140} ${lamp.y + 96} L ${lamp.x - 140} ${lamp.y + 96} Z`} o={0.5} />
      </g>
      {detectorOnStand ? <Detector x={PLB_DETECTOR.x} y={PLB_DETECTOR.y} s={0.62} t={t} /> : null}
      {/* rug + clothes pile on the floor */}
      <polygon points={Q([[0.36, 1, 0.4], [0.62, 1, 0.4], [0.62, 1, 0.72], [0.36, 1, 0.72]])} fill="#41304E" />
      <polygon points={Q([[0.39, 1, 0.43], [0.59, 1, 0.43], [0.59, 1, 0.69], [0.39, 1, 0.69]])} fill="none" stroke="#5A426A" strokeWidth={5} />
      {(() => {
        const c = P(0.34, 1, 0.6);
        return (
          <g>
            <ellipse cx={c.x} cy={c.y} rx={60} ry={26} fill="#5A7A4A" />
            <ellipse cx={c.x + 20} cy={c.y - 14} rx={44} ry={20} fill="#E8823A" />
            <ellipse cx={c.x - 16} cy={c.y - 12} rx={36} ry={16} fill="#2E6FF0" />
          </g>
        );
      })()}
      <LightVeil
        id={`${id}veil`}
        lights={[
          [lamp.x, lamp.y + 20, 420 * (0.25 + 0.75 * lampFlick)],
          [710, 470, 320],
          [1300, 500, 300],
          [960, 900, 380],
        ]}
        o={veil}
      />
      <Glow x={lamp.x} y={lamp.y + 6} r={280} o={0.55 * lampFlick} />
      <Glow x={640} y={480} r={200} o={0.35} />
      <Dust t={t} seed={23} x0={lamp.x - 180} y0={lamp.y - 40} w={360} h={240} n={16} o={0.4 * lampFlick} />
      <Dust t={t} seed={29} x0={PLB_WINDOW.x0} y0={PLB_WINDOW.y1} w={300} h={280} n={12} o={0.3} />
    </g>
  );
};
