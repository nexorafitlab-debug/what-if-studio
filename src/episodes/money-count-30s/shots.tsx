import React from 'react';
import {
  Hero, poseAt, kf, easeOut, faceAt, FONT, Look,
  camT, ShotProps, Classroom, reachAngle,
} from '../../engine';

/* ------------------------------------------------------------------ */
/* IFINITE LOOKS — solid BLACK round heads, white dot eyes, thin stick */
/* limbs, flat coloured tops, thin light rim on the lit side.          */
/* ------------------------------------------------------------------ */
const BLACK = '#0D0D12';
const HERO: Look = {
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket: '#2E6FF0', jacketShade: '#2456C4',
  accent: '#FFD23F', limb: '#26232F', line: '#121019', shoe: '#1E2A44', face: '#FFFFFF', hair: BLACK,
  extra: 'hood',
};
const SAM: Look = {
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket: '#F28C3D', jacketShade: '#D9732A',
  accent: '#2E6FF0', limb: '#26232F', line: '#121019', shoe: '#8A4A1A', face: '#FFFFFF', hair: BLACK,
};
const PARK: Look = {
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket: '#7A6A9A', jacketShade: '#5F5278',
  accent: '#F4F1EA', limb: '#26232F', line: '#121019', shoe: '#3A3446', face: '#FFFFFF', hair: BLACK,
  extra: 'bob',
};
const CROWD_A: Look = {
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket: '#6A8A9A', jacketShade: '#52707E',
  accent: '#E9C46A', limb: '#26232F', line: '#121019', shoe: '#3A3446', face: '#FFFFFF', hair: BLACK,
};
const CROWD_B: Look = {
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket: '#9A6A5A', jacketShade: '#7E5648',
  accent: '#9FC0D6', limb: '#26232F', line: '#121019', shoe: '#3A3446', face: '#FFFFFF', hair: BLACK,
};

const GREEN = '#3ED598';
const WHITE = '#F4F1EA';

/* ------------------------------------------------------------------ */
/* THE BALANCE PILL — Ifinite spec, measured. Small dark pill,         */
/* coloured outline, white bold text, tiny downward pointer. Gap       */
/* above the head ≈ 1/6 of head diameter — nearly touching. NO label.  */
/* First appearance: SOFT WHITE ("like a price tag in the air"). On    */
/* the ticks it flashes GREEN and the number climbs. NEVER above the   */
/* hero's own head.                                                    */
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

/* ------------------------------------------------------------------ */
/* CAFETERIA — the classroom set reused as the lunch line. The board  */
/* carries the lunch menu instead of a sum; the serving counter runs   */
/* across the bottom of the close-ups, Mrs. Park behind it.           */
/* ------------------------------------------------------------------ */
const LunchBoard: React.FC = () => (
  <g>
    <text x={740} y={300} textAnchor="middle" fontFamily={FONT.hand} fontSize={72} fill="#EDEFE6" opacity={0.92}>
      TODAY'S LUNCH
    </text>
    <text x={740} y={400} textAnchor="middle" fontFamily={FONT.hand} fontSize={56} fill="#EDEFE6" opacity={0.85}>
      PIZZA • PASTA
    </text>
    <text x={740} y={480} textAnchor="middle" fontFamily={FONT.hand} fontSize={56} fill="#E9C46A" opacity={0.92}>
      $4.00
    </text>
  </g>
);

/** Serving counter across the bottom of the frame, with a tray and coins on top. */
const Counter: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-400} y={950} width={2720} height={330} fill="#3A2C35" />
    <rect x={-400} y={950} width={2720} height={14} fill="#5A4A52" />
    <rect x={-400} y={964} width={2720} height={6} fill="#FFB46A" opacity={0.25} />
    {/* lunch tray on the counter */}
    <rect x={820} y={896} width={380} height={54} rx={10} fill="#C9C2B2" stroke="#8A8272" strokeWidth={3} />
    <rect x={850} y={910} width={150} height={26} rx={6} fill="#E08A5E" />
    <rect x={1020} y={910} width={150} height={26} rx={6} fill="#6AA06A" />
    {/* coins beside the tray */}
    <circle cx={1290} cy={928} r={14} fill="#E9C46A" stroke="#B08A2A" strokeWidth={3} />
    <circle cx={1322} cy={934} r={14} fill="#E9C46A" stroke="#B08A2A" strokeWidth={3} />
    <circle cx={1306} cy={912} r={14} fill="#F2D98A" stroke="#B08A2A" strokeWidth={3} />
    {/* steam rising off the tray */}
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={940 + i * 90} cy={880 - ((t * 0.9 + i * 22) % 44)} r={10} fill="#FFFFFF" opacity={0.22 - ((t * 0.9 + i * 22) % 44) * 0.004} />
    ))}
  </g>
);

/* ============================ SHOTS ============================= */
/* CAMERA IS STATIC inside every shot (Ifinite, measured). All        */
/* "movement" = hard cuts changing shot SIZE. No push-in, no pan.     */
/* ================================================================== */

// ---------- S1: WIDE, the lunch line; hero mid-line, Sam beside him, Mrs. Park at the till; no number yet ----------
export const S1: React.FC<ShotProps> = ({ t }) => {
  const hero = poseAt(t, [
    { f: 0, p: { x: 720, y: 730, scale: 0.95, look: 0.3 } },
    { f: 40, p: { look: 0.5 } },
    { f: 80, p: { look: 0.2 } },
  ]);
  const sam = poseAt(t, [
    { f: 0, p: { x: 480, y: 740, scale: 0.9, facing: 1 } },
    { f: 50, p: { y: 736 } },
    { f: 90, p: { y: 740 } },
  ]);
  const park = poseAt(t, [
    { f: 0, p: { x: 1330, y: 730, scale: 0.95, facing: -1 } },
    { f: 50, p: { y: 726 } },
    { f: 90, p: { y: 730 } },
  ]);
  const crowd = poseAt(t, [{ f: 0, p: { x: 1650, y: 740, scale: 0.9, facing: -1 } }]);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Classroom t={t} id="mc1" board={<LunchBoard />} />
      <Hero look={CROWD_B} pose={{ ...crowd, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={HERO} pose={{ ...hero, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={PARK} pose={{ ...park, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Banner text="COLD OPEN" y={120} t={t} />
    </g>
  );
};

// ---------- S2: CLOSE-UP, Mrs. Park at the till; the soft white $40 pill appears nearly touching her head ----------
export const S2: React.FC<ShotProps> = ({ t }) => {
  const park = poseAt(t, [
    { f: 0, p: { x: 1150, y: 740, scale: 1.25, facing: -1 } },
    { f: 30, p: { headTilt: 2 } },
    { f: 60, p: { headTilt: 0 } },
  ]);
  const hero = poseAt(t, [
    { f: 0, p: { x: 560, y: 740, scale: 1.25, look: 0.5 } },
    { f: 20, p: { look: 0.6, headTilt: -3 }, ease: easeOut },
    { f: 60, p: { look: 0.5, headTilt: 0 } },
  ]);
  const parkHead = above(park);
  // the pill pops in a few frames into the shot, soft and white
  const k = Math.min(1, Math.max(0, (t - 6) / 8));
  return (
    <g transform={camT(980, 560, 1.4)}>
      <g filter="url(#blur16)">
        <Classroom t={t} id="mc2" board={<LunchBoard />} />
      </g>
      <Hero look={PARK} pose={{ ...park, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Counter t={t} />
      <Hero look={HERO} pose={{ ...hero, ...faceAt(t, [[0, 'neutral'], [24, 'shock']]) }} shadow={0} rimId="rimBlue" />
      <g opacity={k} transform={`translate(${parkHead.x} ${parkHead.y}) scale(${0.7 + 0.3 * k})`}>
        <Count x={0} y={0} n="$40" t={t} outline={WHITE} />
      </g>
    </g>
  );
};

// ---------- S3: MACRO, the $40 pill HUGE, soft white, floating like a price tag; blurred cafeteria behind ----------
export const S3: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 540, 1.0)}>
      <g filter="url(#blur16)">
        <Classroom t={t} id="mc3" board={<LunchBoard />} />
      </g>
      <circle cx={960} cy={480} r={260} fill="#FFFFFF" opacity={0.06} />
      <Count x={960} y={480} n="$40" t={t} outline={WHITE} s={2.4} />
    </g>
  );
};

// ---------- S4: MEDIUM, hero glances around the lunch line; nobody else looks up; the $40 pill visible only to him ----------
export const S4: React.FC<ShotProps> = ({ t }) => {
  const hero = poseAt(t, [
    { f: 0, p: { x: 700, y: 740, scale: 1.05, look: -0.5 } },
    { f: 25, p: { look: 0.5, headTilt: 2 }, ease: easeOut },
    { f: 60, p: { look: 0.4, headTilt: 0 } },
  ]);
  const park = poseAt(t, [{ f: 0, p: { x: 1380, y: 740, scale: 1.0, facing: -1 } }]);
  const crowdA = poseAt(t, [{ f: 0, p: { x: 420, y: 750, scale: 0.9, facing: 1 } }]);
  const crowdB = poseAt(t, [{ f: 0, p: { x: 1620, y: 750, scale: 0.9, facing: -1 } }]);
  const parkHead = above(park);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Classroom t={t} id="mc4" board={<LunchBoard />} />
      <Hero look={CROWD_A} pose={{ ...crowdA, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={CROWD_B} pose={{ ...crowdB, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={HERO} pose={{ ...hero, ...faceAt(t, [[0, 'neutral'], [30, 'worried']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={PARK} pose={{ ...park, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Count x={parkHead.x} y={parkHead.y} n="$40" t={t} outline={WHITE} />
    </g>
  );
};

// ---------- S5: CLOSE-UP, hero blinks (face swap blinks shut, then open); the $40 pill is still there above Mrs. Park ----------
export const S5: React.FC<ShotProps> = ({ t }) => {
  const hero = poseAt(t, [
    { f: 0, p: { x: 820, y: 780, scale: 1.3, headTilt: 0 } },
    { f: 25, p: { headTilt: 4, x: 840 } },
    { f: 55, p: { headTilt: 0, x: 820 } },
  ]);
  const park = poseAt(t, [{ f: 0, p: { x: 1420, y: 760, scale: 1.1, facing: -1 } }]);
  const parkHead = above(park);
  return (
    <g transform={camT(960, 540, 1.15)}>
      <g filter="url(#blur16)">
        <Classroom t={t} id="mc5" board={<LunchBoard />} />
      </g>
      <Hero look={PARK} pose={{ ...park, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={HERO} pose={{ ...hero, ...faceAt(t, [[0, 'neutral'], [28, 'worried']]) }} shadow={0} rimId="rimBlue" />
      <Count x={parkHead.x} y={parkHead.y} n="$40" t={t} outline={WHITE} />
    </g>
  );
};

// ---------- S6: MEDIUM, Mrs. Park hands hero his tray and takes his lunch money; her $40 pill above her; Sam behind hero ----------
export const S6: React.FC<ShotProps> = ({ t }) => {
  const park = poseAt(t, [
    { f: 0, p: { x: 1250, y: 740, scale: 1.1, facing: -1, armR: { a: 10, b: -8 } } },
    { f: 20, p: { armR: { a: 55, b: -10 } }, ease: easeOut },
    { f: 50, p: { armR: { a: 30, b: -6 } } },
  ]);
  const hero = poseAt(t, [
    { f: 0, p: { x: 700, y: 740, scale: 1.05, armR: { a: 10, b: -8 } } },
    { f: 20, p: { armR: { a: 45, b: -8 }, x: 730 }, ease: easeOut },
    { f: 50, p: { armR: { a: 20, b: -6 } } },
  ]);
  const sam = poseAt(t, [{ f: 0, p: { x: 420, y: 750, scale: 0.95, facing: 1 } }]);
  const parkHead = above(park);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Classroom t={t} id="mc6" board={<LunchBoard />} />
      <Hero look={PARK} pose={{ ...park, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Counter t={t} />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={HERO} pose={{ ...hero, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Count x={parkHead.x} y={parkHead.y} n="$40" t={t} outline={WHITE} />
    </g>
  );
};

// ---------- S7: CLOSE-UP, Mrs. Park's pill ticks $40 → $44 → $48, flashing green on each +$4 step; coins and tray on the counter ----------
// Tick thresholds (shot-local frames) from the real word timings in words.json:
// S7 starts at "ticks" (20.00s, frame 600); "$44," starts 21.98s (local f59), "$48." starts 23.50s (local f105).
export const S7: React.FC<ShotProps> = ({ t }) => {
  const park = poseAt(t, [{ f: 0, p: { x: 1150, y: 740, scale: 1.25, facing: -1 } }]);
  const parkHead = above(park);
  const phase = t < 59 ? 0 : t < 105 ? 1 : 2;
  const label = phase === 0 ? '$40' : phase === 1 ? '$44' : '$48';
  const outline = phase === 0 ? WHITE : GREEN;
  const flash = (phase === 1 && t < 75) || (phase === 2 && t < 121);
  return (
    <g transform={camT(980, 560, 1.4)}>
      <g filter="url(#blur16)">
        <Classroom t={t} id="mc7" board={<LunchBoard />} />
      </g>
      <Hero look={PARK} pose={{ ...park, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Counter t={t} />
      <g transform={`translate(${parkHead.x} ${parkHead.y})`}>
        <circle cx={0} cy={0} r={flash ? 150 : 110} fill={GREEN} opacity={flash ? 0.18 : 0.05} />
        <Count x={0} y={0} n={label} t={t} outline={outline} pulse={phase > 0} s={1.15} />
      </g>
    </g>
  );
};

// ---------- S8: MEDIUM, hero watches the till, eyes wide; the $48 pill glows green above Mrs. Park; Sam nudges him ----------
export const S8: React.FC<ShotProps> = ({ t }) => {
  const hero = poseAt(t, [
    { f: 0, p: { x: 700, y: 740, scale: 1.05, look: 0.5 } },
    { f: 30, p: { look: 0.6, headTilt: -2 } },
    { f: 60, p: { look: 0.5, headTilt: 0 } },
  ]);
  const park = poseAt(t, [{ f: 0, p: { x: 1350, y: 740, scale: 1.0, facing: -1 } }]);
  const sam = poseAt(t, [
    { f: 0, p: { x: 450, y: 750, scale: 0.95, facing: 1, armR: { a: 10, b: -8 } } },
    { f: 25, p: { armR: { a: 50, b: -10 } }, ease: easeOut },
    { f: 55, p: { armR: { a: 15, b: -8 } } },
  ]);
  const parkHead = above(park);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Classroom t={t} id="mc8" board={<LunchBoard />} />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={HERO} pose={{ ...hero, ...faceAt(t, [[0, 'shock'], [40, 'worried']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={PARK} pose={{ ...park, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Count x={parkHead.x} y={parkHead.y} n="$48" t={t} outline={GREEN} />
    </g>
  );
};

// ---------- S9: CLOSE-UP, Sam elbows hero in the ribs, grinning; hero startled; Mrs. Park's $48 pill behind them ----------
export const S9: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { x: 700, y: 740, scale: 1.25, facing: 1, armR: { a: 10, b: -8 } } },
    { f: 14, p: { armR: { a: 65, b: -12 }, x: 760 }, ease: easeOut },
    { f: 40, p: { armR: { a: 40, b: -8 } } },
  ]);
  const hero = poseAt(t, [
    { f: 0, p: { x: 1150, y: 740, scale: 1.25, facing: -1 } },
    { f: 14, p: { headTilt: -5, x: 1180 }, ease: easeOut },
    { f: 40, p: { headTilt: -2 } },
  ]);
  const park = poseAt(t, [{ f: 0, p: { x: 1560, y: 760, scale: 1.0, facing: -1 } }]);
  const parkHead = above(park);
  return (
    <g transform={camT(980, 560, 1.4)}>
      <g filter="url(#blur16)">
        <Classroom t={t} id="mc9" board={<LunchBoard />} />
      </g>
      <Hero look={PARK} pose={{ ...park, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Count x={parkHead.x} y={parkHead.y} n="$48" t={t} outline={GREEN} />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'happy'], [14, 'smug']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={HERO} pose={{ ...hero, ...faceAt(t, [[0, 'neutral'], [14, 'shock']]) }} shadow={0} rimId="rimBlue" />
    </g>
  );
};

// ---------- S10: MEDIUM, Sam leans in, worried; hero's face pale; lunch-line crowd behind, no numbers visible to Sam ----------
export const S10: React.FC<ShotProps> = ({ t }) => {
  const sam = poseAt(t, [
    { f: 0, p: { x: 700, y: 740, scale: 1.1, facing: 1, headTilt: 0 } },
    { f: 25, p: { headTilt: 5, x: 740 }, ease: easeOut },
    { f: 60, p: { headTilt: 3 } },
  ]);
  const hero = poseAt(t, [
    { f: 0, p: { x: 1150, y: 740, scale: 1.1, facing: -1 } },
    { f: 25, p: { headTilt: -3 }, ease: easeOut },
    { f: 60, p: { headTilt: 0 } },
  ]);
  const crowdA = poseAt(t, [{ f: 0, p: { x: 400, y: 760, scale: 0.9, facing: 1 } }]);
  const crowdB = poseAt(t, [{ f: 0, p: { x: 1560, y: 760, scale: 0.9, facing: -1 } }]);
  return (
    <g transform={camT(960, 540, 1.05)}>
      <Classroom t={t} id="mc10" board={<LunchBoard />} />
      <Hero look={CROWD_A} pose={{ ...crowdA, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={CROWD_B} pose={{ ...crowdB, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral'], [25, 'worried']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={HERO} pose={{ ...hero, ...faceAt(t, [[0, 'worried']]) }} shadow={0} rimId="rimBlue" />
    </g>
  );
};

// ---------- S11: CLOSE-UP, hero points up at Mrs. Park's $48 pill; Sam follows his finger, sees nothing; hero's face urgent ----------
export const S11: React.FC<ShotProps> = ({ t }) => {
  const heroBase = poseAt(t, [
    { f: 0, p: { x: 700, y: 760, scale: 1.25, facing: 1, armR: { a: 10, b: -8 } } },
    { f: 16, p: { armR: { a: -120, b: 0 } }, ease: easeOut },
    { f: 50, p: { armR: { a: -120, b: 0 } } },
  ]);
  const park = poseAt(t, [{ f: 0, p: { x: 1450, y: 760, scale: 1.05, facing: -1 } }]);
  const parkHead = above(park);
  // point the hero's right hand at the pill (recomputed every frame so the arm tracks it)
  const hero: typeof heroBase = {
    ...heroBase,
    armR: { a: kf(t, [[0, 10], [16, reachAngle(heroBase, parkHead)], [50, reachAngle(heroBase, parkHead)]], easeOut), b: 0 },
    handR: 'point',
  };
  const sam = poseAt(t, [
    { f: 0, p: { x: 1080, y: 770, scale: 1.2, facing: -1, headTilt: 0 } },
    { f: 20, p: { headTilt: -6, look: 0.4 }, ease: easeOut },
    { f: 50, p: { headTilt: -4 } },
  ]);
  return (
    <g transform={camT(960, 560, 1.35)}>
      <g filter="url(#blur16)">
        <Classroom t={t} id="mc11" board={<LunchBoard />} />
      </g>
      <Hero look={PARK} pose={{ ...park, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimBlue" />
      <Count x={parkHead.x} y={parkHead.y} n="$48" t={t} outline={GREEN} />
      <Hero look={SAM} pose={{ ...sam, ...faceAt(t, [[0, 'neutral'], [20, 'oops']]) }} shadow={0} rimId="rimBlue" />
      <Hero look={HERO} pose={{ ...hero, ...faceAt(t, [[0, 'neutral'], [16, 'shock']]) }} shadow={0} rimId="rimBlue" />
    </g>
  );
};
