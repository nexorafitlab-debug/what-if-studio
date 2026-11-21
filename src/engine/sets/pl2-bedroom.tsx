import React from 'react';
import { makeRoom } from '../room';
import { RoomShell, WallFrame } from '../furnish';
import { Box } from '../room';
import { Glow, Dust, Cone, LightVeil } from '../light';
import { Detector } from './pl-bedroom';

// A NEW bedroom, drawn fresh for PastLives1MinV2 — NOT pl-bedroom.tsx
// (purple walls, bed right, desk left, window centre-left). This one is
// deep teal: the bed is on the LEFT, the desk is on the RIGHT under a BIG
// window (people pass outside it), the rug is centre, posters above the
// bed. Dusk: warm lamp light vs orange window light. The detector sits on
// the desk, not the nightstand. Characters stand on the floor at about
// w 0.4 (stand(PL2BEDROOM, u, 0.4)).
export const PL2BEDROOM = makeRoom({ x: 960, y: 520 }, { x0: 420, x1: 1500, y0: 300, y1: 760 }, 3.4);

/** The big window's screen rect, for people passing outside it. */
export const PL2B_WINDOW = { x0: 960, x1: 1420, y0: 330, y1: 620 };
/** Where the detector sits on the desk (its centre). */
export const PL2B_DETECTOR = (() => {
  const p = PL2BEDROOM.P(0.72, 0.74, 0.1);
  return { x: p.x, y: p.y - 30 };
})();

export const Pl2Bedroom: React.FC<{ t: number; id?: string; veil?: number; detectorOnDesk?: boolean }> = ({
  t, id = 'pl2b', veil = 0.4, detectorOnDesk = true,
}) => {
  const R = PL2BEDROOM;
  const { P, Q } = R;
  const lampFlick = 0.92 + 0.08 * Math.sin(t / 7);
  const lamp = P(0.12, 0.74, 0.06);
  return (
    <g>
      <RoomShell r={R} id={id} floor="boards" wall="#2E4A48" side="#223836" floorC="#222A28" ceiling="#182222" />
      {/* BIG window, centre-right: low orange sun, rooftops, street below */}
      <g>
        <rect x={PL2B_WINDOW.x0} y={PL2B_WINDOW.y0} width={PL2B_WINDOW.x1 - PL2B_WINDOW.x0} height={PL2B_WINDOW.y1 - PL2B_WINDOW.y0} fill="#E8915A" />
        <rect x={PL2B_WINDOW.x0} y={PL2B_WINDOW.y0} width={PL2B_WINDOW.x1 - PL2B_WINDOW.x0} height={120} fill="#F2C078" opacity={0.85} />
        <circle cx={1290} cy={430} r={46} fill="#FFE7B3" />
        <Glow x={1290} y={430} r={180} o={0.5} />
        <polygon points="960,620 1050,520 1140,580 1240,510 1330,580 1420,520 1420,620 960,620" fill="#3A2A4A" opacity={0.85} />
        <rect x={PL2B_WINDOW.x0} y={PL2B_WINDOW.y0 + 130} width={PL2B_WINDOW.x1 - PL2B_WINDOW.x0} height={14} fill="#2A1C26" opacity={0.7} />
        <path d={`M ${PL2B_WINDOW.x0 + 230} ${PL2B_WINDOW.y0} L ${PL2B_WINDOW.x0 + 230} ${PL2B_WINDOW.y1} M ${PL2B_WINDOW.x0} ${PL2B_WINDOW.y0 + 145} L ${PL2B_WINDOW.x1} ${PL2B_WINDOW.y0 + 145}`} stroke="#2A1C26" strokeWidth={12} />
        <rect x={PL2B_WINDOW.x0} y={PL2B_WINDOW.y0} width={PL2B_WINDOW.x1 - PL2B_WINDOW.x0} height={PL2B_WINDOW.y1 - PL2B_WINDOW.y0} fill="none" stroke="#1E2222" strokeWidth={8} />
      </g>
      <Cone d="M 1000 620 L 1380 620 L 1560 900 L 820 900 Z" o={0.2} />
      {/* the bed, LEFT side: headboard, mattress, orange blanket, pillows */}
      <Box r={R} u={[0.04, 0.36]} v={[0.5, 0.72]} w={[0, 0.06]} front="#3E3038" top="#4A3A44" />
      <Box r={R} u={[0.04, 0.36]} v={[0.72, 1]} w={[0.02, 0.1]} front="#332828" top="#3E3038" />
      <polygon points={Q([[0.04, 0.72, 0.04], [0.36, 0.72, 0.04], [0.36, 0.72, 0.42], [0.04, 0.72, 0.42]])} fill="#E6E0D2" />
      <polygon points={Q([[0.04, 0.72, 0.1], [0.36, 0.72, 0.1], [0.36, 0.72, 0.42], [0.04, 0.72, 0.42]])} fill="#C96A2A" />
      <polygon points={Q([[0.04, 0.72, 0.42], [0.36, 0.72, 0.42], [0.36, 1, 0.42], [0.04, 1, 0.42]])} fill="#A85420" />
      <ellipse cx={P(0.1, 0.72, 0.08).x} cy={P(0.1, 0.72, 0.08).y - 16} rx={46} ry={22} fill="#E9E2D2" />
      <ellipse cx={P(0.28, 0.72, 0.08).x} cy={P(0.28, 0.72, 0.08).y - 16} rx={46} ry={22} fill="#DCD4C4" />
      {/* posters above the bed */}
      <WallFrame x={560} y={330} w={110} h={140} art={2} />
      <WallFrame x={700} y={348} w={92} h={112} art={1} />
      {/* the desk, RIGHT under the window: papers, books, glowing laptop */}
      <Box r={R} u={[0.62, 0.94]} v={[0.68, 0.76]} w={[0.3, 0.46]} front="#5B4038" top="#7A5747" side="#3A2826" rim />
      <Box r={R} u={[0.63, 0.65]} v={[0.76, 1]} w={[0.32, 0.44]} front="#3A2826" top="#4A322A" />
      <Box r={R} u={[0.91, 0.93]} v={[0.76, 1]} w={[0.32, 0.44]} front="#3A2826" top="#4A322A" />
      {(() => {
        const d = P(0.78, 0.68, 0.4);
        return (
          <g>
            <rect x={d.x - 120} y={d.y - 8} width={64} height={40} fill="#F6EFE3" opacity={0.9} transform={`rotate(-6 ${d.x - 90} ${d.y + 10})`} />
            <rect x={d.x - 40} y={d.y - 14} width={60} height={38} fill="#E9E2D2" opacity={0.9} transform={`rotate(5 ${d.x - 10} ${d.y + 4})`} />
            <rect x={d.x - 160} y={d.y - 26} width={70} height={12} rx={3} fill="#7A4A3A" />
            <rect x={d.x - 156} y={d.y - 38} width={62} height={12} rx={3} fill="#4A6A8A" />
            <rect x={d.x + 60} y={d.y - 34} width={26} height={30} rx={4} fill="#E8823A" />
            <g>
              <polygon points={`${d.x + 110},${d.y - 6} ${d.x + 190},${d.y - 6} ${d.x + 190},${d.y + 2} ${d.x + 110},${d.y + 2}`} fill="#1E1C28" />
              <polygon points={`${d.x + 112},${d.y - 66} ${d.x + 188},${d.y - 66} ${d.x + 188},${d.y - 8} ${d.x + 112},${d.y - 8}`} fill="#BFD6FF" opacity={0.9} />
              <polygon points={`${d.x + 112},${d.y - 66} ${d.x + 188},${d.y - 66} ${d.x + 188},${d.y - 8} ${d.x + 112},${d.y - 8}`} fill="none" stroke="#1E1C28" strokeWidth={4} />
              <Glow x={d.x + 150} y={d.y - 36} r={70} o={0.35} />
            </g>
          </g>
        );
      })()}
      {/* the lamp on the nightstand between bed and desk */}
      <Box r={R} u={[0.42, 0.54]} v={[0.78, 1]} w={[0.02, 0.12]} front="#4A3A36" top="#5E4A44" side="#3A2C29" rim />
      <g opacity={lampFlick}>
        <path d={`M ${lamp.x} ${lamp.y + 90} L ${lamp.x} ${lamp.y + 20}`} stroke="#2A2026" strokeWidth={6} />
        <path d={`M ${lamp.x - 24} ${lamp.y - 18} L ${lamp.x + 24} ${lamp.y - 18} L ${lamp.x + 38} ${lamp.y + 24} L ${lamp.x - 38} ${lamp.y + 24} Z`} fill="#F2D2A0" />
        <Cone d={`M ${lamp.x - 36} ${lamp.y + 24} L ${lamp.x + 36} ${lamp.y + 24} L ${lamp.x + 140} ${lamp.y + 96} L ${lamp.x - 140} ${lamp.y + 96} Z`} o={0.5} />
      </g>
      {detectorOnDesk ? <Detector x={PL2B_DETECTOR.x} y={PL2B_DETECTOR.y} s={0.62} t={t} /> : null}
      {/* rug centre + clothes pile */}
      <polygon points={Q([[0.38, 1, 0.4], [0.62, 1, 0.4], [0.62, 1, 0.72], [0.38, 1, 0.72]])} fill="#41304E" />
      <polygon points={Q([[0.41, 1, 0.43], [0.59, 1, 0.43], [0.59, 1, 0.69], [0.41, 1, 0.69]])} fill="none" stroke="#5A426A" strokeWidth={5} />
      <LightVeil
        id={`${id}veil`}
        lights={[
          [lamp.x, lamp.y + 20, 420 * (0.25 + 0.75 * lampFlick)],
          [1190, 470, 320],
          [960, 900, 380],
        ]}
        o={veil}
      />
      <Glow x={lamp.x} y={lamp.y + 6} r={280} o={0.55 * lampFlick} />
      <Glow x={1190} y={470} r={200} o={0.35} />
      <Dust t={t} seed={223} x0={lamp.x - 180} y0={lamp.y - 40} w={360} h={240} n={16} o={0.4 * lampFlick} />
      <Dust t={t} seed={227} x0={PL2B_WINDOW.x0} y0={PL2B_WINDOW.y1} w={460} h={280} n={12} o={0.3} />
    </g>
  );
};
