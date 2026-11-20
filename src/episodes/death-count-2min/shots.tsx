import React from 'react';
import {
  Hero, poseAt, kf, easeOut, faceAt, FONT, Look,
  TitleCard, Foreground, camT, ShotProps,
  Kitchen, KitchenIsland, KITCHEN, islandTop, stand, Rooftop,
  RainyStreet, Bathroom, Calendar, Classroom, CLS, SchoolDesk,
  Study, STUDY, Bus, BUS, Bedroom, BEDROOM, Street, STREET, Stairwell,
} from '../../engine';

/* ------------------------------------------------------------------ */
/* IFINITE LOOKS — solid BLACK round heads, white dot eyes, thin stick */
/* limbs, flat coloured tops, thin light rim on the lit side.          */
/* ------------------------------------------------------------------ */
const BLACK = '#0D0D12';
const SAM: Look = {
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket: '#2E8C86', jacketShade: '#256B66',
  accent: '#F2B33D', limb: '#26232F', line: '#121019', shoe: '#2FB7A6', face: '#FFFFFF', hair: BLACK,
};
const LILY: Look = {
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket: '#F2C230', jacketShade: '#D9A41F',
  accent: '#2E8C86', limb: '#26232F', line: '#121019', shoe: '#F28C6A', face: '#FFFFFF', hair: BLACK,
  extra: 'bunches',
};
const MAN: Look = {
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket: '#6B5E4A', jacketShade: '#554A39',
  accent: '#E9C46A', limb: '#26232F', line: '#121019', shoe: '#3A3446', face: '#FFFFFF', hair: BLACK,
};
const ALEX: Look = {
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket: '#E8823A', jacketShade: '#B85F22',
  accent: '#F2C230', limb: '#26232F', line: '#121019', shoe: '#3A3446', face: '#FFFFFF', hair: BLACK,
  extra: 'hood',
};
const ORTIZ: Look = {
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket: '#5E6E46', jacketShade: '#4C5A38',
  accent: '#E9C46A', limb: '#26232F', line: '#121019', shoe: '#3A3446', face: '#FFFFFF', hair: BLACK,
};
const MAYA: Look = {
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket: '#7A5EA8', jacketShade: '#5F4882',
  accent: '#F2C230', limb: '#26232F', line: '#121019', shoe: '#8A7AB0', face: '#FFFFFF', hair: BLACK,
  extra: 'bob',
};
const MOTHER: Look = {
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket: '#8A5A6A', jacketShade: '#704858',
  accent: '#E9C46A', limb: '#26232F', line: '#121019', shoe: '#5A4A6A', face: '#FFFFFF', hair: BLACK,
  extra: 'bob',
};
const BABY: Look = {
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket: '#9FC0FF', jacketShade: '#7A9AD0',
  accent: '#FFFFFF', limb: '#26232F', line: '#121019', shoe: '#9FC0FF', face: '#FFFFFF', hair: BLACK,
};

const GREEN = '#3ED598';
const ORANGE = '#FF8A3D';
const RED = '#FF3344';

/* ------------------------------------------------------------------ */
/* THE COUNTER — Ifinite spec, measured. Small dark pill, coloured     */
/* outline by urgency, white bold text, tiny downward pointer. Gap     */
/* above the head ≈ 1/6 of head diameter — nearly touching. NO label.  */
/* NEVER above the hero's own head.                                    */
/* ------------------------------------------------------------------ */
const Count: React.FC<{ x: number; y: number; n: string; t: number; outline: string; pulse?: boolean; s?: number }> = ({
  x, y, n, t, outline, pulse = false, s = 1,
}) => {
  const w = 36 + n.length * 20;
  const o = pulse ? 0.75 + 0.25 * Math.sin(t / 4) : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <rect x={-w / 2} y={-24} width={w} height={48} rx={24} fill="#0E0C1E" stroke={outline} strokeWidth={3} />
      <polygon points="-10,20 10,20 0,34" fill="#0E0C1E" stroke={outline} strokeWidth={3} strokeLinejoin="round" />
      <text x={0} y={11} fontFamily={FONT.title} fontWeight={700} fontSize={30} fill="#FFFFFF" textAnchor="middle">
        {n}
      </text>
    </g>
  );
};

/** Where a counter sits above a character's head: pointer tip ~1/6 head diameter above the head top. */
const above = (p: { x: number; y: number; scale: number }) => ({ x: p.x, y: p.y - 295 * p.scale });

/** Small pop pill, e.g. "+41 YEARS" / "+8 MIN" — Ifinite's pop-ins. */
const PopPill: React.FC<{ x: number; y: number; n: string; t: number; from: number; color: string; s?: number }> = ({
  x, y, n, t, from, color, s = 1,
}) => {
  const k = Math.min(1, Math.max(0, (t - from) / 6));
  if (k <= 0) return null;
  const w = 30 + n.length * 18;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (0.6 + 0.4 * k)})`} opacity={k}>
      <rect x={-w / 2} y={-20} width={w} height={40} rx={20} fill="#0E0C1E" stroke={color} strokeWidth={3} />
      <text x={0} y={9} fontFamily={FONT.title} fontWeight={700} fontSize={24} fill="#FFFFFF" textAnchor="middle">
        {n}
      </text>
    </g>
  );
};

/** Yellow ALL-CAPS banner, top-centre — the genre's beat label. Pops on at t=2. */
const Banner: React.FC<{ text: string; y?: number; t: number }> = ({ text, y = 130, t }) => {
  const k = Math.min(1, Math.max(0, (t - 2) / 8));
  if (k <= 0) return null;
  const w = text.length * 26 + 60;
  return (
    <g transform={`translate(960 ${y}) scale(${0.7 + 0.3 * k})`} opacity={k}>
      <rect x={-w / 2} y={-32} width={w} height={64} rx={10} fill="#FFD23F" />
      <text x={0} y={13} fontFamily={FONT.title} fontWeight={700} fontSize={38} fill="#14101E" textAnchor="middle" letterSpacing={2}>
        {text}
      </text>
    </g>
  );
};

/** Small red label for time pressure, e.g. NOT IN A MIRROR / SATURDAY. */
const RedLabel: React.FC<{ text: string; y?: number; t: number; from?: number }> = ({ text, y = 130, t, from = 2 }) => {
  const k = Math.min(1, Math.max(0, (t - from) / 8));
  if (k <= 0) return null;
  return (
    <g transform={`translate(960 ${y})`} opacity={k}>
      <text fontFamily={FONT.title} fontWeight={700} fontSize={34} fill={RED} textAnchor="middle" letterSpacing={6}>
        {text}
      </text>
    </g>
  );
};

/** Dark navy void with a few stars — the infographic ground. */
const Void: React.FC = () => (
  <g>
    <rect x={-400} y={-200} width={2720} height={1480} fill="#0E0C1E" />
    {Array.from({ length: 42 }).map((_, i) => {
      const x = ((i * 173 + 61) % 1900) + 10;
      const yy = ((i * 97 + 43) % 1000) + 40;
      return <circle key={i} cx={x} cy={yy} r={1.5 + (i % 3)} fill="#FFFFFF" opacity={0.25 + ((i * 7) % 10) / 18} />;
    })}
  </g>
);

/** Clock format DD:HH:MM:SS from total seconds. */
const fmtClock = (totalSec: number) => {
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d)}:${p(h)}:${p(m)}:${p(s)}`;
};
const hash = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** A truck: box trailer + cab + headlights, drawn at world x `x` (its centre). */
const Truck: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-260} y={700} width={380} height={180} rx={8} fill="#3A3446" stroke="#14101E" strokeWidth={4} />
    <rect x={120} y={740} width={150} height={140} rx={10} fill="#2A2440" stroke="#14101E" strokeWidth={4} />
    <rect x={150} y={760} width={70} height={50} fill="#9FC0FF" opacity={0.8} />
    <circle cx={270} cy={820} r={16} fill="#FFE7B3" />
    <circle cx={270} cy={820} r={30} fill="#FFE7B3" opacity={0.2} />
    <circle cx={-180} cy={880} r={26} fill="#0E0C1E" stroke="#4A4460" strokeWidth={5} />
    <circle cx={-40} cy={880} r={26} fill="#0E0C1E" stroke="#4A4460" strokeWidth={5} />
    <circle cx={190} cy={880} r={26} fill="#0E0C1E" stroke="#4A4460" strokeWidth={5} />
    <rect x={-262} y={780} width={14} height={26} fill="#FF3344" />
  </g>
);

/** A dead potted plant by the gym door — drooping brown leaves. */
const DeadPlant: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -34 0 L 34 0 L 26 44 L -26 44 Z" fill="#8A5A4A" stroke="#14101E" strokeWidth={3} />
    <path d="M 0 0 Q -30 -50 -52 -34" stroke="#6A4A2A" strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M 0 0 Q 4 -60 30 -44" stroke="#6A4A2A" strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M 0 0 Q 0 -40 0 -70" stroke="#6A4A2A" strokeWidth={6} fill="none" strokeLinecap="round" />
    <ellipse cx={-52} cy={-34} rx={16} ry={8} fill="#7A5A34" transform="rotate(-30 -52 -34)" />
    <ellipse cx={30} cy={-44} rx={16} ry={8} fill="#7A5A34" transform="rotate(30 30 -44)" />
    <ellipse cx={0} cy={-70} rx={14} ry={7} fill="#8A6A3A" />
  </g>
);

/* ============================ SHOTS ============================= */
/* CAMERA IS STATIC inside every shot (Ifinite, measured). All        */
/* "movement" = hard cuts changing shot SIZE. No push-in, no pan.     */
/* ================================================================== */

// ---------- S1: WIDE, rainy street; the man waits, timer 00:00:00:12 ----------
export const S1: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { x: 420, y: 730, scale: 0.95, look: -0.4 } },
    { f: 40, p: { look: 0.3, headTilt: 2 } },
    { f: 80, p: { look: 0.5 } },
  ]);
  const man = poseAt(t, [
    { f: 0, p: { x: 1330, y: 730, scale: 0.95, facing: -1 } },
    { f: 50, p: { y: 726 } },
    { f: 90, p: { y: 730 } },
  ]);
  const other = poseAt(t, [{ f: 0, p: { x: 1650, y: 740, scale: 0.9, facing: -1 } }]);
  const manHead = above(man);
  const otherHead = above(other);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <RainyStreet t={t} />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={MAN} pose={{ ...man, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={MAN} pose={{ ...other, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Count x={manHead.x} y={manHead.y} n="00:00:00:12" t={t} outline={RED} pulse />
      <Count x={otherHead.x} y={otherHead.y} n="52 YEARS" t={t} outline={GREEN} />
    </g>
  );
};

// ---------- S2: CLOSE-UP, Sam grabs the man's collar; timer 00:00:00:03 ----------
export const S2: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { x: 780, y: 740, scale: 1.25, armR: { a: 10, b: -8 } } },
    { f: 14, p: { armR: { a: 70, b: -10 }, x: 820 }, ease: easeOut },
    { f: 40, p: { armR: { a: 75, b: -6 } } },
  ]);
  const man = poseAt(t, [
    { f: 0, p: { x: 1180, y: 740, scale: 1.25, facing: -1, headTilt: 0 } },
    { f: 14, p: { headTilt: -6, x: 1200 }, ease: easeOut },
    { f: 40, p: { headTilt: -3 } },
  ]);
  const manHead = above(man);
  const secs = Math.max(0, 3 - Math.floor(t / 30));
  return (
    <g transform={camT(980, 560, 1.5)}>
      <g filter="url(#blur16)">
        <RainyStreet t={t} />
      </g>
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral'], [14, 'shock']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={MAN} pose={{ ...man, ...faceAt(t, [[0, 'neutral'], [14, 'shock']]) }} shadow={0} rimId="rimBlue" />
      <Count x={manHead.x} y={manHead.y} n={`00:00:00:0${secs}`} t={t} outline={RED} pulse />
    </g>
  );
};

// ---------- S3: WIDE LOW, the truck blasts through the red light ----------
export const S3: React.FC<ShotProps> = ({ t }) => {
  const truckX = kf(t, [[0, 2300], [55, -500]], easeOut);
  const sam = poseAt(t, [
    { f: 0, p: { x: 500, y: 760, scale: 0.95, armR: { a: 10, b: -8 } } },
    { f: 20, p: { x: 470, armR: { a: 60, b: -10 } }, ease: easeOut },
    { f: 55, p: { x: 480, armR: { a: 50, b: -6 } } },
  ]);
  const man = poseAt(t, [
    { f: 0, p: { x: 700, y: 760, scale: 0.95, facing: -1 } },
    { f: 20, p: { x: 660 }, ease: easeOut },
    { f: 55, p: { x: 670 } },
  ]);
  return (
    <g transform={camT(960, 600, 0.85)}>
      <RainyStreet t={t} />
      <Truck x={truckX} />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'shock'], [30, 'worried']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={MAN} pose={{ ...man, ...faceAt(t, [[0, 'shock'], [30, 'worried']]) }} shadow={0} rimId="rimBlue" />
    </g>
  );
};

// ---------- S4: MACRO, the timer spins 00:00:00:12 → 41 YEARS ----------
export const S4: React.FC<ShotProps> = ({ t }) => {
  const phase = t < 18 ? 'tick' : t < 48 ? 'spin' : 'settled';
  let label = '00:00:00:12';
  let outline = RED;
  if (phase === 'tick') {
    label = `00:00:00:${String(Math.max(0, 12 - Math.floor(t / 3))).padStart(2, '0')}`;
  } else if (phase === 'spin') {
    label = `00:00:${String(Math.floor(hash(t) * 60)).padStart(2, '0')}:${String(Math.floor(hash(t + 7) * 60)).padStart(2, '0')}`;
    outline = t % 4 < 2 ? RED : GREEN;
  } else {
    label = '41 YEARS';
    outline = GREEN;
  }
  const sc = phase === 'spin' ? 2.4 + 0.12 * Math.sin(t * 1.6) : 2.4;
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Void />
      <Count x={960} y={480} n={label} t={t} outline={outline} pulse={phase !== 'settled'} s={sc} />
      <PopPill x={960} y={640} n="+41 YEARS" t={t} from={55} color={GREEN} s={1.2} />
    </g>
  );
};

// ---------- S5: TITLE CARD on the void ----------
export const S5: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Void />
      <g transform={`translate(960 300) scale(${Math.min(1, Math.max(0, (t - 2) / 8))})`}>
        <rect x={-260} y={-34} width={520} height={68} rx={34} fill="#0E0C1E" stroke="#FFD23F" strokeWidth={4} />
        <text x={0} y={12} fontFamily={FONT.title} fontWeight={700} fontSize={40} fill="#FFD23F" textAnchor="middle">
          ?? ??:??:??:??
        </text>
      </g>
      <TitleCard t={t} lines={['WHAT IF YOU COULD SEE', 'HOW LONG EVERYONE HAS LEFT?']} accent="LEFT" y={430} size={100} />
    </g>
  );
};

// ---------- S6: RULES on the void — green / orange / red ----------
export const S6: React.FC<ShotProps> = ({ t }) => {
  const fade = (d: number) => Math.min(1, Math.max(0, (t - d) / 8));
  const figs = [
    { x: 560, look: SAM, n: '52 YEARS', c: GREEN, label: 'DECADES', d: 6 },
    { x: 960, look: MAN, n: '3 YEARS', c: ORANGE, label: 'YEARS', d: 16 },
    { x: 1360, look: LILY, n: '00:00:00:12', c: RED, label: 'DAYS', d: 26 },
  ];
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Void />
      <Banner text="GREEN MEANS DECADES" y={120} t={t} />
      {figs.map((f, i) => {
        const pose = poseAt(t, [{ f: 0, p: { x: f.x, y: 740, scale: 0.95 } }]);
        const head = above(pose);
        return (
          <g key={i} opacity={fade(f.d)}>
            <Hero look={f.look} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
            <Count x={head.x} y={head.y} n={f.n} t={t} outline={f.c} pulse={f.c === RED} />
            <text x={f.x} y={960} fontFamily={FONT.title} fontWeight={700} fontSize={30} fill="#F6EFE3" textAnchor="middle" letterSpacing={4}>
              {f.label}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// ---------- S6B: CLOSE-UP, the red figure — RED MEANS HURRY ----------
export const S6B: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 780, scale: 1.3 } }]);
  const head = above(pose);
  return (
    <g transform={camT(960, 540, 1.15)}>
      <Void />
      <Banner text="RED MEANS HURRY" y={120} t={t} />
      <Hero look={LILY} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} shadow={0} rimId="rimBlue" />
      <Count x={head.x} y={head.y} n="00:00:00:12" t={t} outline={RED} pulse />
    </g>
  );
};

// ---------- S7: CLOSE-UP, bathroom mirror — NO timer above his head ----------
export const S7: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { x: 640, y: 740, scale: 1.15, headTilt: 0 } },
    { f: 30, p: { headTilt: 4, x: 660 } },
    { f: 60, p: { headTilt: 0, x: 640 } },
  ]);
  return (
    <g transform={camT(960, 540, 1.15)}>
      <Bathroom />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral'], [30, 'worried']]) }} shadow={0} rimId="rimBlue" />
      <RedLabel text="NOT IN A MIRROR" y={110} t={t} />
      <Foreground blur={10}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
      </Foreground>
    </g>
  );
};

// ---------- S8: MEDIUM WIDE, kitchen morning; Lily's green 81 YRS 6 MO ----------
const S8_SAM = stand(KITCHEN, 0.36, 0.4);
const S8_LILY = stand(KITCHEN, 0.62, 0.4);
const S8_BOX = islandTop(0.5, 0.45);
export const S8: React.FC<ShotProps> = ({ t }) => {
  const samBase = { x: S8_SAM.x, y: S8_SAM.y, scale: S8_SAM.scale };
  const lilyBase = { x: S8_LILY.x, y: S8_LILY.y, scale: S8_LILY.scale * 0.75 };
  const sam = poseAt(t, [
    { f: 0, p: { ...samBase, headTilt: 0 } },
    { f: 30, p: { headTilt: 3 } },
    { f: 60, p: { headTilt: 0 } },
  ]);
  const lily = poseAt(t, [
    { f: 0, p: { ...lilyBase, facing: -1, headTilt: 0 } },
    { f: 25, p: { headTilt: -5 } },
    { f: 55, p: { headTilt: 0 } },
  ]);
  const lilyHead = above(lily);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Kitchen t={t} id="k8" veil={0.3} />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={LILY} pose={{ ...lily, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Count x={lilyHead.x} y={lilyHead.y} n="81 YRS 6 MO" t={t} outline={GREEN} />
      <KitchenIsland />
      <g transform={`translate(${S8_BOX.x} ${S8_BOX.y})`}>
        <rect x={-30} y={-64} width={60} height={80} rx={6} fill="#F2C230" stroke="#14101E" strokeWidth={3} />
        <circle cx={0} cy={-34} r={16} fill="#FF3344" />
        <rect x={-20} y={-8} width={40} height={8} fill="#14101E" />
      </g>
    </g>
  );
};

// ---------- S9: EXTREME CLOSE-UP, Lily's timer HUGE and ticking down ----------
export const S9: React.FC<ShotProps> = ({ t }) => {
  const START = 2 * 86400 + 6 * 3600 + 19 * 60 + 45; // 02:06:19:45
  const left = Math.max(0, START - t / 30);
  const clock = fmtClock(left);
  const lily = poseAt(t, [{ f: 0, p: { x: 960, y: 980, scale: 1.4 } }]);
  const headTop = lily.y - 238 * lily.scale;
  const bigY = headTop - 21 * lily.scale - 12 * 2.6 - 24 * 2.6;
  return (
    <g transform={camT(960, 540, 1.0)}>
      <g filter="url(#blur16)">
        <Kitchen t={t} id="k9" veil={0.3} />
      </g>
      <Hero look={LILY} pose={{ ...lily, ...faceAt(t, [[0, 'neutral'], [30, 'worried']]) }} shadow={0} rimId="rimR" />
      <Count x={960} y={150} n="81 YRS 4 MO" t={t} outline={GREEN} s={0.9} />
      <g>
        <Count x={820} y={300} n="2 DAYS" t={t} outline={RED} s={0.9} />
        <Count x={1060} y={300} n="6 HOURS" t={t} outline={RED} s={0.9} />
        <Count x={960} y={390} n="19 MINUTES" t={t} outline={RED} s={0.9} />
      </g>
      <Count x={960} y={bigY} n={clock} t={t} outline={RED} pulse s={2.6} />
    </g>
  );
};

// ---------- S10: MACRO, the calendar — SATURDAY 2:40 PM ----------
export const S10: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Calendar t={t} />
      <RedLabel text="SATURDAY" y={110} t={t} />
    </g>
  );
};

// ---------- S11: MEDIUM, school hallway; Sam + Alex, pill 15204 ----------
const S11_SAM = stand(CLS, 0.34, 0.42);
const S11_ALEX = stand(CLS, 0.6, 0.42);
export const S11: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { ...S11_SAM, headTilt: 0 } },
    { f: 35, p: { headTilt: 3 } },
    { f: 70, p: { headTilt: 0 } },
  ]);
  const alex = poseAt(t, [
    { f: 0, p: { ...S11_ALEX, facing: -1, headTilt: 0 } },
    { f: 30, p: { headTilt: -4 } },
    { f: 65, p: { headTilt: 0 } },
  ]);
  const alexHead = above(alex);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Classroom t={t} id="c11" />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Count x={alexHead.x} y={alexHead.y} n="15204" t={t} outline={GREEN} />
    </g>
  );
};

// ---------- S12: CLOSE-UP, Alex; pill 15204 ----------
// NOTE: close-ups use ABSOLUTE poses (y≈740, scale≈1.25) — stand()×1.9 puts
// the hip too high and the head + pill go off the top of the frame.
export const S12: React.FC<ShotProps> = ({ t }) => {
  const alex = poseAt(t, [
    { f: 0, p: { x: 960, y: 740, scale: 1.25, headTilt: 0 } },
    { f: 30, p: { headTilt: -3 } },
    { f: 60, p: { headTilt: 2 } },
  ]);
  const alexHead = above(alex);
  return (
    <g transform={camT(960, 540, 1.15)}>
      <g filter="url(#blur16)">
        <Classroom t={t} id="c12" />
      </g>
      <Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'happy'], [40, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Count x={alexHead.x} y={alexHead.y} n="15204" t={t} outline={GREEN} />
    </g>
  );
};

// ---------- S13: MEDIUM, stairwell corridor; Mr. Ortiz with mop, pill 9412 ----------
export const S13: React.FC<ShotProps> = ({ t }) => {
  const ortiz = poseAt(t, [
    { f: 0, p: { x: 700, y: 780, scale: 0.95, facing: 1, armR: { a: 20, b: -10 } } },
    { f: 40, p: { armR: { a: 30, b: -6 } } },
    { f: 80, p: { armR: { a: 20, b: -10 } } },
  ]);
  const sam = poseAt(t, [
    { f: 0, p: { x: 1150, y: 780, scale: 0.95, facing: -1 } },
    { f: 45, p: { headTilt: 3 } },
  ]);
  const ortizHead = above(ortiz);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Stairwell t={t} id="s13" />
      <DeadPlant x={980} y={830} s={1.1} />
      <Hero look={ORTIZ} pose={{ ...ortiz, ...faceAt(t, [[0, 'neutral'], [30, 'happy']]) }} shadow={0} rimId="rimR" />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Count x={ortizHead.x} y={ortizHead.y} n="9412" t={t} outline={ORANGE} />
    </g>
  );
};

// ---------- S14: CLOSE-UP, Ortiz waters the dead plant; pill 9412 ----------
export const S14: React.FC<ShotProps> = ({ t }) => {
  const ortiz = poseAt(t, [
    { f: 0, p: { x: 820, y: 800, scale: 1.25, armR: { a: 40, b: -20 } } },
    { f: 30, p: { armR: { a: 55, b: -12 } }, ease: easeOut },
    { f: 70, p: { armR: { a: 45, b: -16 } } },
  ]);
  const ortizHead = above(ortiz);
  const drop = t < 30 ? null : { x: 880 + ((t - 30) % 12) * 2, y: 700 + ((t - 30) % 12) * 6 };
  return (
    <g transform={camT(960, 560, 1.3)}>
      <g filter="url(#blur16)">
        <Stairwell t={t} id="s14" />
      </g>
      <DeadPlant x={1080} y={860} s={1.5} />
      {drop ? <circle cx={drop.x} cy={drop.y} r={5} fill="#9FC0FF" opacity={0.8} /> : null}
      <Hero look={ORTIZ} pose={{ ...ortiz, ...faceAt(t, [[0, 'neutral'], [25, 'happy']]) }} shadow={0} rimId="rimR" />
      <Count x={ortizHead.x} y={ortizHead.y} n="9412" t={t} outline={ORANGE} />
    </g>
  );
};

// ---------- S15: MEDIUM, library; Maya at a desk, pill 17842 ----------
const S15_MAYA = stand(STUDY, 0.55, 0.45);
const S15_SAM = stand(STUDY, 0.3, 0.45);
export const S15: React.FC<ShotProps> = ({ t }) => {
  const maya = poseAt(t, [
    { f: 0, p: { ...S15_MAYA, facing: -1, headTilt: 0 } },
    { f: 35, p: { headTilt: -4 } },
    { f: 70, p: { headTilt: 0 } },
  ]);
  const sam = poseAt(t, [
    { f: 0, p: { ...S15_SAM, headTilt: 0 } },
    { f: 40, p: { headTilt: 3 } },
  ]);
  const mayaHead = above(maya);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Study t={t} id="st15" veil={0.35} />
      <Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Count x={mayaHead.x} y={mayaHead.y} n="17842" t={t} outline={GREEN} />
    </g>
  );
};

// ---------- S16: CLOSE-UP, Maya's notebook; pill 17842 ----------
export const S16: React.FC<ShotProps> = ({ t }) => {
  const maya = poseAt(t, [
    { f: 0, p: { x: 820, y: 740, scale: 1.25, facing: -1, headTilt: 0, armR: { a: 30, b: -20 } } },
    { f: 30, p: { armR: { a: 38, b: -14 } } },
    { f: 60, p: { armR: { a: 32, b: -18 } } },
  ]);
  const mayaHead = above(maya);
  const nbX = maya.x + 130;
  const nbY = maya.y + 60;
  return (
    <g transform={camT(960, 540, 1.15)}>
      <g filter="url(#blur16)">
        <Study t={t} id="st16" veil={0.35} />
      </g>
      {/* the notebook, handwritten pages */}
      <g transform={`translate(${nbX} ${nbY}) rotate(-4)`}>
        <rect x={-90} y={-60} width={180} height={120} rx={8} fill="#F4F1EA" stroke="#14101E" strokeWidth={3} />
        <path d="M -70 -40 Q -20 -30 20 -44" stroke="#3A3446" strokeWidth={3} fill="none" />
        <path d="M -70 -14 Q -10 -6 40 -18" stroke="#3A3446" strokeWidth={3} fill="none" />
        <path d="M -70 12 Q 0 20 50 8" stroke="#3A3446" strokeWidth={3} fill="none" />
        <path d="M -70 38 Q -20 44 30 36" stroke="#3A3446" strokeWidth={3} fill="none" />
      </g>
      <Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral'], [35, 'happy']]) }} shadow={0} rimId="rimR" />
      <Count x={mayaHead.x} y={mayaHead.y} n="17842" t={t} outline={GREEN} />
    </g>
  );
};

// ---------- S17: WIDE, bus interior; mother + baby, pills 41 / 19801 ----------
const S17_MOM = stand(BUS, 0.42, 0.5);
const S17_SAM = stand(BUS, 0.68, 0.5);
export const S17: React.FC<ShotProps> = ({ t }) => {
  const mom = poseAt(t, [
    { f: 0, p: { ...S17_MOM, facing: 1, headTilt: 0 } },
    { f: 40, p: { headTilt: 3 } },
    { f: 80, p: { headTilt: 0 } },
  ]);
  const baby = poseAt(t, [
    { f: 0, p: { x: mom.x + 90, y: mom.y - 40, scale: 0.35, facing: 1 } },
    { f: 45, p: { y: mom.y - 46 } },
    { f: 85, p: { y: mom.y - 40 } },
  ]);
  const sam = poseAt(t, [
    { f: 0, p: { ...S17_SAM, facing: -1, headTilt: 0 } },
    { f: 35, p: { headTilt: -3 } },
  ]);
  const momHead = above(mom);
  const babyHead = above(baby);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Bus t={t} id="b17" />
      <Hero look={MOTHER} pose={{ ...mom, ...faceAt(t, [[0, 'neutral'], [30, 'worried']]) }} shadow={0} rimId="rimR" />
      <Hero look={BABY} pose={{ ...baby, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Count x={momHead.x} y={momHead.y} n="41" t={t} outline={RED} pulse />
      <Count x={babyHead.x} y={babyHead.y} n="19801" t={t} outline={GREEN} s={0.8} />
    </g>
  );
};

// ---------- S18: CLOSE-UP, the mother's red pill 41 ----------
export const S18: React.FC<ShotProps> = ({ t }) => {
  const mom = poseAt(t, [
    { f: 0, p: { x: 960, y: 740, scale: 1.25, headTilt: 0 } },
    { f: 30, p: { headTilt: 4 } },
    { f: 60, p: { headTilt: 0 } },
  ]);
  const momHead = above(mom);
  return (
    <g transform={camT(960, 540, 1.15)}>
      <g filter="url(#blur16)">
        <Bus t={t} id="b18" />
      </g>
      <Hero look={MOTHER} pose={{ ...mom, ...faceAt(t, [[0, 'worried']]) }} shadow={0} rimId="rimR" />
      <Count x={momHead.x} y={momHead.y} n="41" t={t} outline={RED} pulse />
    </g>
  );
};

// ---------- S19: CLOSE-UP, the baby; green pill 19801 ----------
export const S19: React.FC<ShotProps> = ({ t }) => {
  const baby = poseAt(t, [
    { f: 0, p: { x: 960, y: 740, scale: 0.95, headTilt: 0 } },
    { f: 30, p: { headTilt: -4 } },
    { f: 60, p: { headTilt: 2 } },
  ]);
  const mom = poseAt(t, [{ f: 0, p: { x: 640, y: 760, scale: 1.05, facing: 1 } }]);
  const babyHead = above(baby);
  return (
    <g transform={camT(960, 540, 1.15)}>
      <g filter="url(#blur16)">
        <Bus t={t} id="b19" />
      </g>
      <Hero look={MOTHER} pose={{ ...mom, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={BABY} pose={{ ...baby, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Count x={babyHead.x} y={babyHead.y} n="19801" t={t} outline={GREEN} />
    </g>
  );
};

// ---------- S20: WIDE, classroom crowd; pills over every head, bright over friends ----------
const S20_SAM = stand(CLS, 0.5, 0.55);
export const S20: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { ...S20_SAM, headTilt: 0 } },
    { f: 40, p: { headTilt: 3 } },
  ]);
  const alex = poseAt(t, [{ f: 0, p: { x: 620, y: 760, scale: 0.85, facing: 1 } }]);
  const maya = poseAt(t, [{ f: 0, p: { x: 1280, y: 760, scale: 0.85, facing: -1 } }]);
  const s1 = poseAt(t, [{ f: 0, p: { x: 380, y: 770, scale: 0.8, facing: 1 } }]);
  const s2 = poseAt(t, [{ f: 0, p: { x: 1560, y: 770, scale: 0.8, facing: -1 } }]);
  const alexHead = above(alex);
  const mayaHead = above(maya);
  const s1Head = above(s1);
  const s2Head = above(s2);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Classroom t={t} id="c20" />
      <Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={MAN} pose={{ ...s1, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={MAN} pose={{ ...s2, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Count x={alexHead.x} y={alexHead.y} n="15204" t={t} outline={GREEN} />
      <Count x={mayaHead.x} y={mayaHead.y} n="17842" t={t} outline={GREEN} />
      <g opacity={0.45}>
        <Count x={s1Head.x} y={s1Head.y} n="9412" t={t} outline={ORANGE} />
        <Count x={s2Head.x} y={s2Head.y} n="21008" t={t} outline={GREEN} />
      </g>
      <Banner text="THE PEOPLE YOU LOVE BURN BRIGHT" y={120} t={t} />
    </g>
  );
};

// ---------- S21: MEDIUM, two strangers with dim pills ----------
export const S21: React.FC<ShotProps> = ({ t }) => {
  const s1 = poseAt(t, [{ f: 0, p: { x: 700, y: 760, scale: 0.95, facing: 1 } }]);
  const s2 = poseAt(t, [{ f: 0, p: { x: 1240, y: 760, scale: 0.95, facing: -1 } }]);
  const sam = poseAt(t, [
    { f: 0, p: { x: 960, y: 790, scale: 0.7, facing: 1, headTilt: 0 } },
    { f: 40, p: { headTilt: -3 } },
  ]);
  const s1Head = above(s1);
  const s2Head = above(s2);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Classroom t={t} id="c21" />
      <g opacity={0.45}>
        <Hero look={MAN} pose={{ ...s1, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
        <Hero look={MAN} pose={{ ...s2, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
        <Count x={s1Head.x} y={s1Head.y} n="21008" t={t} outline={GREEN} />
        <Count x={s2Head.x} y={s2Head.y} n="18770" t={t} outline={GREEN} />
      </g>
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
    </g>
  );
};

// ---------- S22: CLOSE-UP, Alex + Maya; their pills burn bright ----------
export const S22: React.FC<ShotProps> = ({ t }) => {
  const alex = poseAt(t, [
    { f: 0, p: { x: 700, y: 740, scale: 1.15, facing: 1, headTilt: 0 } },
    { f: 30, p: { headTilt: -3 } },
  ]);
  const maya = poseAt(t, [
    { f: 0, p: { x: 1220, y: 740, scale: 1.15, facing: -1, headTilt: 0 } },
    { f: 30, p: { headTilt: 3 } },
  ]);
  const alexHead = above(alex);
  const mayaHead = above(maya);
  return (
    <g transform={camT(960, 540, 1.15)}>
      <g filter="url(#blur16)">
        <Classroom t={t} id="c22" />
      </g>
      <Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Count x={alexHead.x} y={alexHead.y} n="15204" t={t} outline={GREEN} />
      <Count x={mayaHead.x} y={mayaHead.y} n="17842" t={t} outline={GREEN} />
    </g>
  );
};

// ---------- S23: MEDIUM, evening street; Sam carries a box for an old woman ----------
const S23_SAM = stand(STREET, 0.42, 0.5);
const S23_WOMAN = stand(STREET, 0.62, 0.5);
export const S23: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { ...S23_SAM, facing: 1, armR: { a: 30, b: -20 } } },
    { f: 40, p: { armR: { a: 38, b: -14 } } },
  ]);
  const woman = poseAt(t, [
    { f: 0, p: { ...S23_WOMAN, scale: S23_WOMAN.scale * 0.9, facing: -1, headTilt: 0 } },
    { f: 40, p: { headTilt: -4 } },
  ]);
  const womanHead = above(woman);
  const boxX = (sam.x + woman.x) / 2;
  const boxY = sam.y + 30;
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Street t={t} />
      {/* cardboard box Sam carries */}
      <g transform={`translate(${boxX} ${boxY})`}>
        <rect x={-52} y={-44} width={104} height={88} rx={4} fill="#A8845A" stroke="#14101E" strokeWidth={3} />
        <path d="M -52 -10 L 52 -10" stroke="#14101E" strokeWidth={3} />
        <path d="M 0 -44 L 0 44" stroke="#14101E" strokeWidth={3} />
      </g>
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral'], [30, 'happy']]) }} shadow={0} rimId="rimR" />
      <Hero look={MOTHER} pose={{ ...woman, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Count x={womanHead.x} y={womanHead.y} n="6 DAYS" t={t} outline={RED} pulse />
    </g>
  );
};

// ---------- S24: MEDIUM, street; Sam holds a door, a kid walks through ----------
const S24_SAM = stand(STREET, 0.4, 0.5);
const S24_KID = stand(STREET, 0.62, 0.5);
export const S24: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { ...S24_SAM, facing: 1, armR: { a: 55, b: -8 } } },
    { f: 45, p: { armR: { a: 60, b: -4 } } },
  ]);
  const kid = poseAt(t, [
    { f: 0, p: { ...S24_KID, scale: S24_KID.scale * 0.72, facing: -1 } },
    { f: 20, p: { x: S24_KID.x - 30 }, ease: easeOut },
    { f: 60, p: { x: S24_KID.x - 70 } },
  ]);
  const kidHead = above(kid);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Street t={t} />
      {/* shop door Sam holds open */}
      <g>
        <rect x={1330} y={330} width={150} height={430} rx={8} fill="#2A2440" stroke="#4A4460" strokeWidth={4} />
        <rect x={1350} y={350} width={110} height={180} fill="#FFC27A" opacity={0.5} />
        <circle cx={1452} cy={560} r={10} fill="#F2C230" />
      </g>
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Hero look={MAN} pose={{ ...kid, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Count x={kidHead.x} y={kidHead.y} n="23104" t={t} outline={GREEN} />
    </g>
  );
};

// ---------- S25: MEDIUM, hallway; Sam faces Alex, about to speak ----------
const S25_SAM = stand(CLS, 0.36, 0.42);
const S25_ALEX = stand(CLS, 0.62, 0.42);
export const S25: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { ...S25_SAM, facing: 1, armR: { a: 10, b: -8 } } },
    { f: 30, p: { armR: { a: 45, b: -10 } }, ease: easeOut },
    { f: 70, p: { armR: { a: 40, b: -8 } } },
  ]);
  const alex = poseAt(t, [
    { f: 0, p: { ...S25_ALEX, facing: -1, headTilt: 0 } },
    { f: 35, p: { headTilt: -3 } },
  ]);
  const alexHead = above(alex);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Classroom t={t} id="c25" />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'worried']]) }} shadow={0} rimId="rimR" />
      <Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Count x={alexHead.x} y={alexHead.y} n="15204" t={t} outline={GREEN} />
    </g>
  );
};

// ---------- S26: CLOSE-UP, Alex's pill 15204 HUGE; Sam points ----------
export const S26: React.FC<ShotProps> = ({ t }) => {
  const alex = poseAt(t, [
    { f: 0, p: { x: 1150, y: 740, scale: 1.25, facing: -1, headTilt: 0 } },
    { f: 30, p: { headTilt: -3 } },
  ]);
  const sam = poseAt(t, [
    { f: 0, p: { x: 420, y: 760, scale: 1.1, facing: 1, armR: { a: 70, b: -5 } } },
  ]);
  const alexHead = above(alex);
  return (
    <g transform={camT(960, 540, 1.15)}>
      <g filter="url(#blur16)">
        <Classroom t={t} id="c26" />
      </g>
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'worried']]) }} shadow={0} rimId="rimR" />
      <Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Count x={alexHead.x} y={alexHead.y} n="15204" t={t} outline={GREEN} s={1.5} />
    </g>
  );
};

// ---------- S27: CLOSE-UP, Alex's face swaps laugh to still ----------
export const S27: React.FC<ShotProps> = ({ t }) => {
  const alex = poseAt(t, [
    { f: 0, p: { x: 960, y: 740, scale: 1.25, headTilt: -2 } },
    { f: 25, p: { headTilt: 0 } },
    { f: 55, p: { headTilt: 2 } },
  ]);
  const alexHead = above(alex);
  return (
    <g transform={camT(960, 540, 1.15)}>
      <g filter="url(#blur16)">
        <Classroom t={t} id="c27" />
      </g>
      <Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'happy'], [25, 'neutral'], [45, 'worried']]) }} shadow={0} rimId="rimR" />
      <Count x={alexHead.x} y={alexHead.y} n="15204" t={t} outline={GREEN} />
    </g>
  );
};

// ---------- S28: MEDIUM, Alex's empty desk; college letter; faint pill ----------
export const S28: React.FC<ShotProps> = ({ t }) => {
  const chair = poseAt(t, [{ f: 0, p: { x: 960, y: 780, scale: 0.8 } }]);
  const chairHead = above(chair);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Classroom t={t} id="c28" />
      <SchoolDesk x={960} />
      {/* college letter on the desk */}
      <g transform="translate(960 700) rotate(-3)">
        <rect x={-70} y={-46} width={140} height={92} rx={6} fill="#F4F1EA" stroke="#14101E" strokeWidth={3} />
        <path d="M -50 -26 L 50 -26" stroke="#3A3446" strokeWidth={4} />
        <path d="M -50 -8 L 50 -8" stroke="#3A3446" strokeWidth={3} />
        <path d="M -50 10 L 20 10" stroke="#3A3446" strokeWidth={3} />
        <circle cx={44} cy={22} r={12} fill="none" stroke={RED} strokeWidth={4} />
      </g>
      <g opacity={0.5}>
        <Count x={chairHead.x} y={chairHead.y} n="15204" t={t} outline={GREEN} />
      </g>
      <RedLabel text="HE STOPS APPLYING" y={130} t={t} />
    </g>
  );
};

// ---------- S29: CLOSE-UP, Alex tired; pill 15204 ----------
export const S29: React.FC<ShotProps> = ({ t }) => {
  const alex = poseAt(t, [
    { f: 0, p: { x: 960, y: 740, scale: 1.25, headTilt: 4 } },
    { f: 40, p: { headTilt: 2 } },
  ]);
  const alexHead = above(alex);
  return (
    <g transform={camT(960, 540, 1.15)}>
      <g filter="url(#blur16)">
        <Classroom t={t} id="c29" />
      </g>
      <Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'tired']]) }} shadow={0} rimId="rimR" />
      <Count x={alexHead.x} y={alexHead.y} n="15204" t={t} outline={GREEN} />
    </g>
  );
};

// ---------- S30: MEDIUM, Sam reaches out; Alex walks away ----------
const S30_SAM = stand(CLS, 0.32, 0.42);
export const S30: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { ...S30_SAM, facing: 1, armR: { a: 65, b: -8 } } },
    { f: 30, p: { armR: { a: 75, b: -4 } }, ease: easeOut },
    { f: 70, p: { armR: { a: 40, b: -10 } } },
  ]);
  const alex = poseAt(t, [
    { f: 0, p: { x: 1080, y: 760, scale: 0.9, facing: 1 } },
    { f: 25, p: { x: 1240 }, ease: easeOut },
    { f: 70, p: { x: 1420 } },
  ]);
  const alexHead = above(alex);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Classroom t={t} id="c30" />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'worried']]) }} shadow={0} rimId="rimR" />
      <Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Count x={alexHead.x} y={alexHead.y} n="15204" t={t} outline={GREEN} />
    </g>
  );
};

// ---------- S31: WIDE, cafeteria; Sam sorts people by their numbers ----------
export const S31: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { x: 960, y: 800, scale: 0.75, headTilt: 0 } },
    { f: 40, p: { headTilt: -4 } },
  ]);
  const big1 = poseAt(t, [{ f: 0, p: { x: 480, y: 750, scale: 0.85, facing: 1 } }]);
  const big2 = poseAt(t, [{ f: 0, p: { x: 700, y: 750, scale: 0.85, facing: -1 } }]);
  const small1 = poseAt(t, [{ f: 0, p: { x: 1280, y: 750, scale: 0.85, facing: 1 } }]);
  const small2 = poseAt(t, [{ f: 0, p: { x: 1500, y: 750, scale: 0.85, facing: -1 } }]);
  const b1 = above(big1);
  const b2 = above(big2);
  const s1 = above(small1);
  const s2 = above(small2);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Classroom t={t} id="c31" />
      <Hero look={MAN} pose={{ ...big1, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Hero look={MAYA} pose={{ ...big2, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Hero look={MAN} pose={{ ...small1, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={MOTHER} pose={{ ...small2, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'worried']]) }} shadow={0} rimId="rimR" />
      <Count x={b1.x} y={b1.y} n="23104" t={t} outline={GREEN} />
      <Count x={b2.x} y={b2.y} n="17842" t={t} outline={GREEN} />
      <Count x={s1.x} y={s1.y} n="41" t={t} outline={RED} pulse />
      <Count x={s2.x} y={s2.y} n="6 DAYS" t={t} outline={RED} pulse />
    </g>
  );
};

// ---------- S31B: MEDIUM, Sam sits with the big numbers; a small red pill across the room ----------
export const S31B: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { x: 700, y: 760, scale: 0.9, facing: 1, headTilt: 0 } },
    { f: 40, p: { headTilt: -3 } },
  ]);
  const big1 = poseAt(t, [{ f: 0, p: { x: 480, y: 750, scale: 0.85, facing: 1 } }]);
  const big2 = poseAt(t, [{ f: 0, p: { x: 960, y: 750, scale: 0.85, facing: -1 } }]);
  const small1 = poseAt(t, [{ f: 0, p: { x: 1500, y: 750, scale: 0.85, facing: -1 } }]);
  const b1 = above(big1);
  const b2 = above(big2);
  const s1 = above(small1);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Classroom t={t} id="c31b" />
      <Hero look={MAN} pose={{ ...big1, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Hero look={MAYA} pose={{ ...big2, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Hero look={MAN} pose={{ ...small1, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Count x={b1.x} y={b1.y} n="23104" t={t} outline={GREEN} />
      <Count x={b2.x} y={b2.y} n="17842" t={t} outline={GREEN} />
      <Count x={s1.x} y={s1.y} n="41" t={t} outline={RED} pulse />
    </g>
  );
};

// ---------- S32: CLOSE-UP, Sam; he catches himself and feels sick ----------
export const S32: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { x: 960, y: 740, scale: 1.25, headTilt: 0 } },
    { f: 25, p: { headTilt: -4 } },
    { f: 55, p: { headTilt: 3 } },
  ]);
  return (
    <g transform={camT(960, 540, 1.15)}>
      <g filter="url(#blur16)">
        <Classroom t={t} id="c32" />
      </g>
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'worried'], [25, 'oops'], [50, 'tired']]) }} shadow={0} rimId="rimR" />
    </g>
  );
};

// ---------- S33: CLOSE-UP, bathroom mirror at night; NOTHING above his head ----------
export const S33: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { x: 640, y: 740, scale: 1.15, headTilt: 0 } },
    { f: 30, p: { headTilt: 4, x: 660 } },
    { f: 60, p: { headTilt: 0, x: 640 } },
  ]);
  return (
    <g transform={camT(960, 540, 1.15)}>
      <Bathroom />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral'], [30, 'worried']]) }} shadow={0} rimId="rimBlue" />
      <RedLabel text="NOTHING ABOVE YOUR HEAD" y={110} t={t} />
      <Foreground blur={10}>
        <path d="M -140 1220 L -140 860 Q -128 786 -30 786 L 236 786 Q 322 786 334 862 L 344 1220 Z" fill="#140F1A" />
      </Foreground>
    </g>
  );
};

// ---------- S34: MEDIUM, bedroom night; Sam on a chair, phone up, blank ----------
const S34_SAM = stand(BEDROOM, 0.45, 0.4);
export const S34: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { ...S34_SAM, armR: { a: 150, b: -10 } } },
    { f: 30, p: { armR: { a: 160, b: -6 } } },
    { f: 60, p: { armR: { a: 150, b: -10 } } },
  ]);
  const chairX = sam.x;
  const chairY = sam.y + 150;
  const phoneX = sam.x + 95;
  const phoneY = sam.y - 176 * sam.scale - 130;
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Bedroom t={t} id="bd34" veil={0.35} lamp={0.4} />
      {/* chair Sam stands on */}
      <g transform={`translate(${chairX} ${chairY})`}>
        <rect x={-70} y={-16} width={140} height={20} rx={6} fill="#7A5747" stroke="#14101E" strokeWidth={3} />
        <rect x={-60} y={4} width={10} height={90} fill="#5B4038" />
        <rect x={50} y={4} width={10} height={90} fill="#5B4038" />
      </g>
      {/* phone held up, screen blank */}
      <g transform={`translate(${phoneX} ${phoneY}) rotate(8)`}>
        <rect x={-26} y={-48} width={52} height={96} rx={10} fill="#14101E" stroke="#4A4460" strokeWidth={3} />
        <rect x={-19} y={-41} width={38} height={82} rx={6} fill="#2E3A55" />
      </g>
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'worried']]) }} shadow={0} rimId="rimBlue" />
    </g>
  );
};

// ---------- S35: EXTREME CLOSE-UP, Sam's eyes; the space above his head is empty ----------
export const S35: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { x: 960, y: 980, scale: 1.6, headTilt: 0 } },
    { f: 30, p: { headTilt: 2 } },
    { f: 60, p: { headTilt: -2 } },
  ]);
  return (
    <g transform={camT(960, 700, 1.6)}>
      <g filter="url(#blur16)">
        <Bedroom t={t} id="bd35" veil={0.35} lamp={0.4} />
      </g>
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'worried']]) }} shadow={0} rimId="rimBlue" />
    </g>
  );
};

// ---------- S36: WIDE, rooftop at dusk; city timers flicker; SATURDAY 2:40 PM ----------
export const S36: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { x: 960, y: 700 } },
    { f: 40, p: { y: 680, armR: { a: 20, b: 0 } }, ease: easeOut },
    { f: 90, p: { y: 700 } },
  ]);
  const flick = 0.6 + 0.4 * Math.sin(t / 3);
  const far1 = poseAt(t, [{ f: 0, p: { x: 420, y: 700, scale: 0.35, facing: -1 } }]);
  const far2 = poseAt(t, [{ f: 0, p: { x: 1500, y: 700, scale: 0.35 } }]);
  const far1Head = above(far1);
  const far2Head = above(far2);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Rooftop t={t} sunX={960} sunY={620} cityLit={1} />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'worried']]) }} shadow={0} rimId="rimR" />
      <Hero look={MAN} pose={{ ...far1, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={MAN} pose={{ ...far2, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <g opacity={flick}>
        <Count x={far1Head.x} y={far1Head.y} n="52 YEARS" t={t} outline={GREEN} s={0.9} />
        <Count x={far2Head.x} y={far2Head.y} n="3 YEARS" t={t} outline={ORANGE} s={0.9} />
      </g>
      <RedLabel text="SATURDAY 2:40 PM" y={130} t={t} />
    </g>
  );
};

// ---------- S37: MEDIUM, rooftop; Sam holds up a hand-lettered 14 DAYS sign ----------
// NOTE: this is a held SIGN, not a counter — the Count pill component is never
// used here, so nothing reads as a number above the hero's own head.
export const S37: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { x: 960, y: 720, scale: 1.05, armR: { a: 55, b: -15 } } },
    { f: 35, p: { armR: { a: 65, b: -10 } }, ease: easeOut },
    { f: 75, p: { armR: { a: 60, b: -12 } } },
  ]);
  const handX = sam.x + 150;
  const handY = sam.y - 60;
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Rooftop t={t} sunX={960} sunY={620} cityLit={1} />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral'], [30, 'worried']]) }} shadow={0} rimId="rimR" />
      <g transform={`rotate(-8 ${handX} ${handY})`}>
        <rect x={handX - 125} y={handY - 38} width={250} height={76} rx={10} fill="#14141C" stroke={RED} strokeWidth={4} />
        <text x={handX} y={handY + 16} fontFamily={FONT.title} fontWeight={800} fontSize={46} fill={RED} textAnchor="middle">
          14 DAYS
        </text>
      </g>
      <PopPill x={960} y={220} n="USE EVERY ONE" t={t} from={40} color={RED} s={1.1} />
    </g>
  );
};

// ---------- S38: WIDE, evening street; Sam + Lily walk home; PART 1 end card ----------
export const S38: React.FC<ShotProps> = ({ t }) => {
  const samX = kf(t, [[0, 700], [90, 830]], easeOut);
  const lilyX = kf(t, [[0, 900], [90, 1030]], easeOut);
  const sam = poseAt(t, [{ f: 0, p: { x: samX, y: 760, scale: 0.85, facing: 1 } }]);
  const lily = poseAt(t, [{ f: 0, p: { x: lilyX, y: 760, scale: 0.62, facing: 1 } }]);
  const lilyHead = above(lily);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Street t={t} />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral'], [40, 'happy']]) }} shadow={0} rimId="rimR" />
      <Hero look={LILY} pose={{ ...lily, ...faceAt(t, [[0, 'happy']]) }} shadow={0} rimId="rimR" />
      <Count x={lilyHead.x} y={lilyHead.y} n="14" t={t} outline={RED} pulse />
      <TitleCard t={t} lines={['', 'PART 1']} accent="PART" y={200} size={120} />
    </g>
  );
};
