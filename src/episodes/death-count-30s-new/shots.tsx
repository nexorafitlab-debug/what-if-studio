import React from 'react';
import {
  Hero, poseAt, kf, easeOut, faceAt, FONT, Look,
  TitleCard, Foreground, camT, ShotProps,
  Kitchen, KitchenIsland, KITCHEN, islandTop, stand, Rooftop,
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

/* ------------------------------------------------------------------ */
/* RAINY STREET / BUS STOP — custom set: night, wet road, red light.  */
/* ------------------------------------------------------------------ */
const RainyStreet: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-400} y={-200} width={2720} height={1480} fill="#14102A" />
    {/* buildings with lit windows */}
    {[
      { x: -200, w: 420, h: 520, win: 4 },
      { x: 300, w: 360, h: 640, win: 5 },
      { x: 1300, w: 400, h: 560, win: 4 },
      { x: 1780, w: 380, h: 700, win: 6 },
    ].map((b, bi) => (
      <g key={bi}>
        <rect x={b.x} y={720 - b.h} width={b.w} height={b.h} fill="#1B1533" />
        {Array.from({ length: b.win }).map((_, wi) => (
          <rect key={wi} x={b.x + 40 + (wi % 3) * 110} y={720 - b.h + 60 + Math.floor(wi / 3) * 130} width={56} height={70} fill="#FFC27A" opacity={0.35 + hash(bi * 10 + wi) * 0.45} />
        ))}
      </g>
    ))}
    {/* sidewalk */}
    <rect x={-400} y={720} width={2720} height={120} fill="#1E1830" />
    {/* wet road with light reflections */}
    <rect x={-400} y={840} width={2720} height={440} fill="#0A0912" />
    <rect x={100} y={880} width={500} height={10} fill="#FF8A3D" opacity={0.35} />
    <rect x={900} y={920} width={700} height={10} fill="#9FC0FF" opacity={0.3} />
    <rect x={400} y={980} width={900} height={8} fill="#FFC27A" opacity={0.25} />
    {/* bus stop sign */}
    <g>
      <rect x={1290} y={380} width={10} height={340} fill="#4A4460" />
      <rect x={1230} y={300} width={130} height={80} rx={8} fill="#1D2A4A" stroke="#9FC0FF" strokeWidth={3} />
      <text x={1295} y={332} fontFamily={FONT.title} fontWeight={700} fontSize={22} fill="#FFFFFF" textAnchor="middle">
        BUS
      </text>
      <text x={1295} y={360} fontFamily={FONT.title} fontWeight={700} fontSize={22} fill="#FFFFFF" textAnchor="middle">
        STOP
      </text>
    </g>
    {/* traffic light, red */}
    <g>
      <rect x={560} y={420} width={10} height={300} fill="#4A4460" />
      <rect x={520} y={300} width={90} height={130} rx={12} fill="#14101E" stroke="#3A3446" strokeWidth={4} />
      <circle cx={565} cy={335} r={18} fill="#FF3344" />
      <circle cx={565} cy={335} r={30} fill="#FF3344" opacity={0.25} />
      <circle cx={565} cy={385} r={14} fill="#3A3446" />
    </g>
    {/* rain: diagonal streaks falling with the shot clock */}
    {Array.from({ length: 46 }).map((_, i) => {
      const x = ((i * 97 + t * 3) % 2000) - 40;
      const y = ((i * 53 + t * 14) % 1100) - 100;
      return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 28} stroke="#9FC0FF" strokeWidth={2.5} opacity={0.28} />;
    })}
  </g>
);

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

/* ------------------------------------------------------------------ */
/* BATHROOM — custom set: wall, mirror, sink, towel.                  */
/* ------------------------------------------------------------------ */
const Bathroom: React.FC = () => (
  <g>
    <rect x={-400} y={-200} width={2720} height={1480} fill="#232038" />
    <rect x={-400} y={820} width={2720} height={460} fill="#17142A" />
    {/* small window with moonlight */}
    <rect x={-200} y={120} width={220} height={300} rx={8} fill="#111A3E" stroke="#3A3446" strokeWidth={5} />
    <circle cx={-90} cy={220} r={42} fill="#F1F3FF" opacity={0.9} />
    <rect x={-200} y={430} width={220} height={10} fill="#3A3446" />
    {/* towel on a ring */}
    <circle cx={380} cy={330} r={26} fill="none" stroke="#9FC0FF" strokeWidth={6} />
    <rect x={350} y={350} width={70} height={150} rx={8} fill="#5E6E46" />
    {/* mirror: the reflection is a dark-head silhouette with NO timer */}
    <rect x={1020} y={180} width={520} height={420} rx={14} fill="#2E3A55" stroke="#4A4460" strokeWidth={6} />
    <rect x={1040} y={200} width={60} height={380} fill="#FFFFFF" opacity={0.08} />
    <g opacity={0.9}>
      <circle cx={1280} cy={360} r={62} fill={BLACK} />
      <circle cx={1259} cy={356} r={7} fill="#FFFFFF" />
      <circle cx={1301} cy={356} r={7} fill="#FFFFFF" />
      <path d="M 1270 388 Q 1280 392 1290 388" stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M 1234 448 Q 1280 436 1326 448 L 1320 600 L 1240 600 Z" fill="#2E8C86" />
    </g>
    {/* sink + faucet below the mirror */}
    <rect x={1080} y={620} width={400} height={60} rx={16} fill="#E9E2D2" />
    <path d="M 1280 620 L 1280 580 Q 1280 560 1300 560" stroke="#9AA0B0" strokeWidth={10} fill="none" strokeLinecap="round" />
  </g>
);

/* ------------------------------------------------------------------ */
/* CALENDAR macro — THIS WEEK, red X marks, LILY'S B-DAY! circled.    */
/* ------------------------------------------------------------------ */
const Calendar: React.FC<{ t: number }> = ({ t }) => {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const circ = Math.min(1, Math.max(0, (t - 18) / 10));
  return (
    <g>
      <rect x={-400} y={-200} width={2720} height={1480} fill="#0E0C1E" />
      <rect x={420} y={170} width={1080} height={740} rx={28} fill="#F4F1EA" />
      <text x={960} y={260} fontFamily={FONT.title} fontWeight={700} fontSize={52} fill="#14101E" textAnchor="middle" letterSpacing={4}>
        THIS WEEK
      </text>
      {days.map((d, i) => {
        const cx = 510 + i * 140;
        const isSat = d === 'SAT';
        return (
          <g key={d}>
            <text x={cx + 60} y={330} fontFamily={FONT.title} fontWeight={700} fontSize={26} fill={isSat ? RED : '#14101E'} textAnchor="middle">
              {d}
            </text>
            <rect x={cx} y={350} width={120} height={120} rx={10} fill={isSat ? '#FFE9E9' : '#FFFFFF'} stroke="#C9C2B2" strokeWidth={3} />
            {!isSat && i < 5 && (
              <g stroke={RED} strokeWidth={7} strokeLinecap="round">
                <line x1={cx + 25} y1={375} x2={cx + 95} y2={445} />
                <line x1={cx + 95} y1={375} x2={cx + 25} y2={445} />
              </g>
            )}
          </g>
        );
      })}
      {/* red circle around SAT, drawn on the beat */}
      <g opacity={circ} transform={`translate(1230 410) scale(${0.7 + 0.3 * circ})`}>
        <ellipse cx={0} cy={0} rx={86} ry={76} fill="none" stroke={RED} strokeWidth={7} />
      </g>
      <text x={960} y={560} fontFamily={FONT.title} fontWeight={700} fontSize={58} fill={RED} textAnchor="middle">
        LILY'S B-DAY!
      </text>
      <text x={960} y={640} fontFamily={FONT.title} fontWeight={700} fontSize={44} fill={RED} textAnchor="middle">
        2:40 PM
      </text>
      <text x={960} y={760} fontFamily={FONT.title} fontWeight={600} fontSize={30} fill="#5A4A3A" textAnchor="middle">
        blue car · windows down
      </text>
    </g>
  );
};

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
      {/* cereal box on the island */}
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

// ---------- S11: WIDE, rooftop at dusk; city timers flicker; PART 1 ----------
export const S11: React.FC<ShotProps> = ({ t }) => {
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
      <TitleCard t={t} lines={['', 'PART 1']} accent="PART" y={200} size={120} />
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
