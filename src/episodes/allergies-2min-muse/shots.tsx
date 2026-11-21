import React from 'react';
import {
  Hero, HeroRig, walkCyclePose, poseAt, faceAt, clamp, backOut, FONT, Look, Expr,
  camT, ShotProps, Sparkle, NightSky, Stars, Moon,
  Bedroom, Street, Cafe, Park, Bathroom, Pl2Street, Taxi, Pl2Gate, Garden,
  Classroom, Hospital, Market, Gym, Bus, Rooftop,
} from '../../engine';

/* Allergies2minMuse — 'What If You Could Read Anyone's Allergies?' (39 shots,
   ~355 words, ~125s). FRESH sample written by Muse for the quality check:
   fresh script (allergies-2min-muse-script.txt) + fresh shot plan
   (allergies-2min-muse-shotplan.md). NOT the old allergies-narration.txt,
   NOT the 40s shots, NOT the first-2min episode code.
   Look: approved 40s sample — solid black round heads, white dot eyes,
   thin stick limbs, flat coloured tops, hero BLUE hoodie #2E6FF0.
   Hero NEVER has a label. Labels colour-coded: PEANUTS #38A169 green,
   POLLEN #D69E2E gold, CATS #805AD5 purple. Label gap ~1/6 head diameter.
   Persistent device: "LABELS SEEN: n" pill top-left, S4-S38 (not void cards).
   Motion: walkCyclePose walks (S4, S10, S11, S14, S30, S36, S37);
   HeroRig point pose (S16, S24, S25). ZERO fully-static characters:
   every Actor has >=1 key or >=2 exprs; keys are MONOTONIC (each limb
   moves to ONE pose and holds, never loops) — walks are EXEMPT, they go
   through walkCyclePose, not keys. Camera STATIC inside every shot.
   Hard cuts only. No whoosh. grain: false. */

const BLACK = '#0D0D12';
const WHITE = '#F6EFE3';
const GOLD = '#FFD700';
const GREEN = '#38A169';
const GOLDLBL = '#D69E2E';
const PURPLELBL = '#805AD5';
const RED = '#E5484D';

const LABEL_COLORS: Record<string, string> = {
  PEANUTS: GREEN, POLLEN: GOLDLBL, CATS: PURPLELBL,
};

const mkLook = (jacket: string, shade: string, accent: string, extra?: Look['extra'], shoe = '#3A3446'): Look => ({
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket, jacketShade: shade,
  accent, limb: '#26232F', line: '#121019', shoe, face: '#FFFFFF', hair: BLACK, extra,
});

const ALEX: Look = mkLook('#2E6FF0', '#2458C4', '#F2B33D', 'hood', '#1E4FB0');
const SAM: Look = mkLook('#E8823A', '#C96A2A', '#F2B33D', 'bob');
const HARWICK: Look = mkLook('#3A3F4A', '#2C3038', '#A8323E', 'suit', '#14151A');
const GREY: Look = mkLook('#6A7A8A', '#55646E', '#E9C46A');
const KIDGREEN: Look = mkLook('#5A7A4A', '#46603A', '#E9C46A');
const PURPLE: Look = mkLook('#7B4B94', '#5E3873', '#C9A0DC', 'bob');
const REDTOP: Look = mkLook('#A83A3A', '#86302E', '#E9C46A');
const NAVY: Look = mkLook('#2E4A6B', '#233A55', '#E9C46A');
const TEAL: Look = mkLook('#2A7A6B', '#1F5E53', '#E9C46A');

const LOOKMAP: Record<string, Look> = {
  alex: ALEX, sam: SAM, harwick: HARWICK,
  grey: GREY, green: KIDGREEN, purple: PURPLE, red: REDTOP,
  navy: NAVY, teal: TEAL,
};

type Key = { f: number; p: Parameters<typeof poseAt>[1][number]['p']; ease?: (t: number) => number };

/** A character moving through keyframed gestures over the shot clock.
    MOTION RULE: keys must be MONOTONIC — each limb moves to ONE pose and
    holds. Never alternate an angle, so no limb ever loops. */
const Actor: React.FC<{
  look: string; x: number; y: number; scale: number; facing?: 1 | -1;
  keys: Key[]; exprs?: [number, Expr][]; t: number;
}> = ({ look, x, y, scale, facing = 1, keys, exprs, t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x, y, scale, facing, headTilt: 0, armR: { a: 18, b: -10 }, armL: { a: 10, b: -8 }, legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 } } },
    ...keys,
  ]);
  const faces: [number, Expr][] = exprs ?? [[0, 'neutral']];
  return <Hero look={LOOKMAP[look]} pose={{ ...pose, ...faceAt(t, faces) }} shadow={0} rimId="rimR" />;
};

/** Pill centre y for a character with hip y and scale: head top is
    hip - 238*scale; the label hangs 10px below it, nearly touching. */
const pillY = (hipY: number, scale: number, s = 1) => hipY - 238 * scale - 10 - 26 * s;

/** The allergy label stamp: colour-coded rounded-rectangle with white bold
    caps, tiny downward pointer, pops with overshoot + ring + sparkle.
    Modelled on the house NumberPill. No whoosh. */
const LabelStamp: React.FC<{
  x: number; y: number; text: string; t: number; from?: number; s?: number;
  blink?: boolean; redPulse?: boolean;
}> = ({ x, y, text, t, from = 0, s = 1, blink = false, redPulse = false }) => {
  const color = LABEL_COLORS[text] ?? GREEN;
  const k = clamp((t - from) / 6);
  if (k <= 0) return null;
  const pop = backOut(k);
  const breathe = 0.94 + 0.06 * Math.sin(t / 9);
  const w = 30 + text.length * 26;
  const bt = t - from;
  const opacity = blink ? 0.35 + 0.65 * Math.abs(Math.sin(t / 6)) : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (0.55 + 0.45 * pop) * breathe})`} opacity={opacity}>
      {bt >= 0 && bt < 14 ? (
        <g>
          <circle r={30 + bt * 9} fill="none" stroke={color} strokeWidth={5} opacity={0.9 * (1 - bt / 14)} />
          <Sparkle x={-w / 2 - 26} y={-26} t={bt} s={0.8} />
          <Sparkle x={w / 2 + 26} y={-30} t={bt + 2} s={0.7} />
          <Sparkle x={0} y={-58} t={bt + 4} s={0.9} />
        </g>
      ) : null}
      <rect x={-w / 2 - 12} y={-34} width={w + 24} height={68} rx={20} fill={color} opacity={0.96}
        style={{ filter: `drop-shadow(0 0 12px ${color}bf)` }} />
      {redPulse ? (
        <rect x={-w / 2 - 12} y={-34} width={w + 24} height={68} rx={20} fill="none"
          stroke={RED} strokeWidth={6} opacity={0.5 + 0.5 * Math.sin(t / 4)} />
      ) : null}
      <polygon points="-9,30 9,30 0,44" fill={color} strokeLinejoin="round" />
      <text x={0} y={11} fontFamily={FONT.title} fontWeight={700} fontSize={30} fill="#FFFFFF" textAnchor="middle">
        {text}
      </text>
    </g>
  );
};

/** Persistent progression device: "LABELS SEEN: n" pill, top-left.
    ticks is [frame, count] — the count steps up at each tick frame. */
const LabelsSeen: React.FC<{ t: number; ticks: [number, number][] }> = ({ t, ticks }) => {
  let n = ticks[0][1];
  for (const [f, c] of ticks) if (t >= f) n = c;
  const text = `LABELS SEEN: ${n}`;
  const w = 44 + text.length * 17;
  return (
    <g transform="translate(70 44)">
      <rect x={0} y={0} width={w} height={56} rx={28} fill="#141419" opacity={0.92}
        stroke="#FFFFFF" strokeOpacity={0.25} strokeWidth={2} />
      <text x={w / 2} y={37} fontFamily={FONT.title} fontWeight={700} fontSize={28} fill="#FFFFFF" textAnchor="middle">
        {text}
      </text>
    </g>
  );
};

/** Gold glowing title line on the void, fading in from `from`. */
const GoldLine: React.FC<{ x: number; y: number; text: string; t: number; from: number; size?: number; color?: string }> = ({
  x, y, text, t, from, size = 64, color = GOLD,
}) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={700} fontSize={size} fill={color} textAnchor="middle" letterSpacing={4}
    style={{ filter: color === GOLD ? 'drop-shadow(0 0 18px rgba(255,215,0,0.7))' : undefined }}
    opacity={clamp((t - from) / 8)}>
    {text}
  </text>
);

/** Starry void background shared by the title/end cards. */
const Void: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <NightSky id={id} horizonY={1080} />
    <Stars seed={113} x0={0} y0={0} w={1920} h={1080} t={t} n={60} o={0.8} />
    <Moon x={1700} y={180} r={54} />
  </g>
);

/** "?" above the hero's blank head: pops, pulses, fades after `until`. */
const QMark: React.FC<{ x: number; y: number; t: number; from?: number; until?: number }> = ({ x, y, t, from = 0, until = 9999 }) => {
  const k = clamp((t - from) / 6);
  if (k <= 0) return null;
  const pop = backOut(k);
  const fade = clamp((until - t) / 8, 0, 1);
  const pulse = 0.85 + 0.15 * Math.sin(t / 5);
  return (
    <g transform={`translate(${x} ${y}) scale(${pop * pulse})`} opacity={fade}>
      <text x={0} y={22} fontFamily={FONT.title} fontWeight={700} fontSize={72} fill={WHITE} textAnchor="middle"
        style={{ filter: 'drop-shadow(0 0 14px rgba(246,239,227,0.8))' }}>?</text>
    </g>
  );
};

/** Rule card, top-right: dark pill with gold "RULE n", pops from `from`. */
const RuleCard: React.FC<{ text: string; t: number; from?: number }> = ({ text, t, from = 0 }) => {
  const k = clamp((t - from) / 6);
  if (k <= 0) return null;
  const pop = backOut(k);
  return (
    <g transform={`translate(1560 72) scale(${0.6 + 0.4 * pop})`}>
      <rect x={-130} y={-32} width={260} height={64} rx={32} fill="#141419" opacity={0.95}
        stroke={GOLD} strokeWidth={3} />
      <text x={0} y={12} fontFamily={FONT.title} fontWeight={700} fontSize={34} fill={GOLD} textAnchor="middle">
        {text}
      </text>
    </g>
  );
};

/** Green checkmark that pops over a label (S35). */
const CheckMark: React.FC<{ x: number; y: number; t: number; from?: number }> = ({ x, y, t, from = 0 }) => {
  const k = clamp((t - from) / 6);
  if (k <= 0) return null;
  const pop = backOut(k);
  return (
    <g transform={`translate(${x} ${y}) scale(${pop})`}>
      <circle r={30} fill={GREEN} stroke="#FFFFFF" strokeWidth={4} />
      <polyline points="-14,2 -4,12 16,-12" fill="none" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

/* S1: bedroom — hero wakes up. "Morning. You open your eyes, and
   something is wrong with the world." ONE action: head lifts once, one
   arm rises to rub his eyes. */
export const S1: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Bedroom t={t} id="m2-bed1" veil={0.3} lamp={0.5} />
    <Actor look="alex" x={840} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 18, p: { headTilt: -6, armR: { a: -60, b: -30 } } }]}
      exprs={[[0, 'neutral'], [18, 'worried']]} />
  </g>
);

/* S2: bedroom, window framing — hero at the window looking out; a soft
   green glow pulses outside the window. "Above every head, a little label."
   Hero head tilts up, curious face. */
export const S2: React.FC<ShotProps> = ({ t }) => {
  const glow = 0.22 + 0.13 * Math.sin(t / 9);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Bedroom t={t} id="m2-bed2" veil={0.3} lamp={0.5} />
      <ellipse cx={1200} cy={480} rx={150} ry={115} fill={GREEN} opacity={glow} />
      <Actor look="alex" x={1180} y={681} scale={1.25} facing={1} t={t}
        keys={[{ f: 15, p: { headTilt: -8, armR: { a: -30, b: -10 } } }]}
        exprs={[[0, 'neutral'], [15, 'happy']]} />
    </g>
  );
};

/* S3: street wide — 3 people below; labels pop in sequence: POLLEN,
   CATS, PEANUTS. Hero small at the window, hand to glass. */
export const S3: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="grey" x={450} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 10, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={450} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={6} s={1} />
    <Actor look="purple" x={960} y={681} scale={1.35} facing={-1} t={t}
      keys={[{ f: 16, p: { headTilt: 4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={960} y={pillY(681, 1.35, 1)} text="CATS" t={t} from={18} s={1} />
    <Actor look="green" x={1470} y={681} scale={1.35} facing={-1} t={t}
      keys={[{ f: 22, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1470} y={pillY(681, 1.35, 1)} text="PEANUTS" t={t} from={30} s={1} />
    <Actor look="alex" x={1650} y={551} scale={0.675} facing={-1} t={t}
      keys={[{ f: 12, p: { armR: { a: -40, b: -10 } } }]} exprs={[[0, 'neutral'], [12, 'worried']]} />
  </g>
);

/* S4: street — the postman WALKS across frame (walkCyclePose, left to
   right), POLLEN pops above his head at t=8. LABELS SEEN pill appears: 1. */
export const S4: React.FC<ShotProps> = ({ t }) => {
  const speed = 80 / 12;
  const hx = 250 + speed * t;
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Street t={t} />
      <Hero pose={walkCyclePose(t, { x0: 250, groundY: 860, scale: 1.35, facing: 1, stride: 80, stepDuration: 12 })} look={NAVY} />
      <LabelStamp x={hx} y={pillY(682, 1.35, 1)} text="POLLEN" t={t} from={8} s={1} />
      <LabelsSeen t={t} ticks={[[0, 1]]} />
    </g>
  );
};

/* S5: cafe exterior — woman pours coffee (arm tilts down and holds),
   CATS pops at t=8. Counter ticks to 2. */
export const S5: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Cafe t={t} id="m2-cafe5" veil={0.4} />
    <Actor look="purple" x={800} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 10, p: { armR: { a: 42, b: -18 }, headTilt: 3 } }]}
      exprs={[[0, 'neutral'], [10, 'happy']]} />
    <LabelStamp x={800} y={pillY(681, 1.35, 1)} text="CATS" t={t} from={8} s={1} />
    <Actor look="alex" x={1300} y={551} scale={0.675} facing={-1} t={t}
      keys={[{ f: 14, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <LabelsSeen t={t} ticks={[[0, 2]]} />
  </g>
);

/* S6: park — kid kicks a ball (leg swings forward, arms out for balance),
   PEANUTS pops at t=8. Counter ticks to 3. */
export const S6: React.FC<ShotProps> = ({ t }) => {
  const ballX = 880 + Math.max(0, t - 10) * 6;
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Park t={t} />
      <Actor look="green" x={750} y={593} scale={0.6} facing={1} t={t}
        keys={[{ f: 10, p: { legR: { a: 30, b: -5 }, armR: { a: 40, b: -10 }, armL: { a: -30, b: -8 } } }]}
        exprs={[[0, 'happy']]} />
      <LabelStamp x={750} y={pillY(593, 0.6, 0.9)} text="PEANUTS" t={t} from={8} s={0.9} />
      <circle cx={ballX} cy={800} r={18} fill={WHITE} stroke="#121019" strokeWidth={3} />
      <LabelsSeen t={t} ticks={[[0, 3]]} />
    </g>
  );
};

/* S7: bedroom mirror — hero rubs eyes with both hands, face swap
   neutral to worried; through the window behind, labels still glow. */
export const S7: React.FC<ShotProps> = ({ t }) => {
  const glow = 0.7 + 0.3 * Math.sin(t / 9);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Bedroom t={t} id="m2-bed7" veil={0.3} lamp={0.5} />
      <rect x={1120} y={400} width={70} height={26} rx={13} fill={GREEN} opacity={glow} />
      <rect x={1220} y={470} width={70} height={26} rx={13} fill={GOLDLBL} opacity={glow} />
      <Actor look="alex" x={960} y={681} scale={1.35} facing={1} t={t}
        keys={[{ f: 12, p: { armR: { a: -60, b: -40 }, armL: { a: -60, b: -40 } } }]}
        exprs={[[0, 'neutral'], [12, 'worried']]} />
      <LabelsSeen t={t} ticks={[[0, 3]]} />
    </g>
  );
};

/* S8: bathroom mirror close-up — hero close-up, hand to head, NO label;
   a "?" pops above his head and pulses. Shock face. */
export const S8: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.1)}>
    <Bathroom />
    <Actor look="alex" x={960} y={700} scale={1.7} facing={1} t={t}
      keys={[{ f: 12, p: { armR: { a: -70, b: -60 }, headTilt: -4 } }]}
      exprs={[[0, 'neutral'], [12, 'shock']]} />
    <QMark x={960} y={pillY(700, 1.7, 1) - 20} t={t} from={14} />
    <LabelsSeen t={t} ticks={[[0, 3]]} />
  </g>
);

/* S9: bathroom — hero touches head, shakes head slowly (head tilts to
   one side and holds), worried face. "?" fades. */
export const S9: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bathroom />
    <Actor look="alex" x={960} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 14, p: { headTilt: -8, armR: { a: -55, b: -30 } } }]}
      exprs={[[0, 'worried']]} />
    <QMark x={960} y={pillY(681, 1.35, 1) - 10} t={t} from={0} until={10} />
    <LabelsSeen t={t} ticks={[[0, 3]]} />
  </g>
);

/* S10: pl2-street — hero steps out the front door (walkCyclePose exit,
   door frame left), crowd behind with labels; hero has none. Counter 3. */
export const S10: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Pl2Street t={t} />
    <Hero pose={walkCyclePose(t, { x0: 420, groundY: 860, scale: 1.35, facing: 1, stride: 64, stepDuration: 15 })} look={ALEX} />
    <Actor look="purple" x={1250} y={690} scale={1.0} facing={-1} t={t}
      keys={[{ f: 12, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1250} y={pillY(690, 1.0, 0.9)} text="POLLEN" t={t} from={4} s={0.9} />
    <Actor look="grey" x={1580} y={690} scale={1.0} facing={-1} t={t}
      keys={[{ f: 18, p: { headTilt: 4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1580} y={pillY(690, 1.0, 0.9)} text="CATS" t={t} from={12} s={0.9} />
    <LabelsSeen t={t} ticks={[[0, 3]]} />
  </g>
);

/* S11: street — hero WALKS down the street; two passersby cross, their
   labels pop as he passes (POLLEN at t=10, CATS at t=30). Counter 4, then 5. */
export const S11: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Hero pose={{ ...walkCyclePose(t, { x0: 200, groundY: 860, scale: 1.35, facing: 1, stride: 70, stepDuration: 13 }), ...faceAt(t, [[0, 'worried']]) }} look={ALEX} />
    <Actor look="sam" x={1150} y={681} scale={1.35} facing={-1} t={t}
      keys={[{ f: 12, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1150} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={10} s={1} />
    <Actor look="green" x={1520} y={681} scale={1.35} facing={-1} t={t}
      keys={[{ f: 26, p: { headTilt: 4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1520} y={pillY(681, 1.35, 1)} text="CATS" t={t} from={30} s={1} />
    <LabelsSeen t={t} ticks={[[0, 3], [10, 4], [30, 5]]} />
  </g>
);

/* S12: market — crowd of 4 shoppers; labels pop staggered: PEANUTS,
   POLLEN, CATS, PEANUTS. Counter ticks to 6, 7, 8, 9. Hero looks around. */
export const S12: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Market t={t} />
    <Actor look="grey" x={380} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 10, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={380} y={pillY(681, 1.35, 1)} text="PEANUTS" t={t} from={6} s={1} />
    <Actor look="purple" x={760} y={681} scale={1.2} facing={1} t={t}
      keys={[{ f: 18, p: { armR: { a: 35, b: -10 } } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={760} y={pillY(681, 1.2, 1)} text="POLLEN" t={t} from={20} s={1} />
    <Actor look="sam" x={1180} y={681} scale={1.35} facing={-1} t={t}
      keys={[{ f: 28, p: { headTilt: 4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1180} y={pillY(681, 1.35, 1)} text="CATS" t={t} from={34} s={1} />
    <Actor look="green" x={1560} y={681} scale={1.2} facing={-1} t={t}
      keys={[{ f: 40, p: { armL: { a: 35, b: -10 } } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1560} y={pillY(681, 1.2, 1)} text="PEANUTS" t={t} from={48} s={1} />
    <Actor look="alex" x={960} y={560} scale={0.8} facing={1} t={t}
      keys={[{ f: 20, p: { headTilt: -6 } }]} exprs={[[0, 'neutral'], [20, 'worried']]} />
    <LabelsSeen t={t} ticks={[[0, 5], [6, 6], [20, 7], [34, 8], [48, 9]]} />
  </g>
);

/* S13: taxi — driver at the wheel (arm on wheel, head turns to hero),
   PEANUTS pops at t=10. Counter ticks to 10. */
export const S13: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Taxi t={t} />
    <Actor look="harwick" x={800} y={636} scale={1.35} facing={1} t={t}
      keys={[{ f: 12, p: { headTilt: 5, armR: { a: 30, b: -10 } } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={800} y={pillY(636, 1.35, 1)} text="PEANUTS" t={t} from={10} s={1} />
    <Actor look="alex" x={1300} y={560} scale={0.8} facing={-1} t={t}
      keys={[{ f: 16, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <LabelsSeen t={t} ticks={[[0, 9], [10, 10]]} />
  </g>
);

/* S14: school gate — teacher WALKS through the gate, POLLEN pops at
   t=10. Counter ticks to 11. */
export const S14: React.FC<ShotProps> = ({ t }) => {
  const speed = 64 / 14;
  const hx = 300 + speed * t;
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Pl2Gate t={t} />
      <Hero pose={walkCyclePose(t, { x0: 300, groundY: 860, scale: 1.2, facing: 1, stride: 64, stepDuration: 14 })} look={TEAL} />
      <LabelStamp x={hx} y={pillY(702, 1.2, 1)} text="POLLEN" t={t} from={10} s={1} />
      <Actor look="alex" x={1350} y={560} scale={0.8} facing={-1} t={t}
        keys={[{ f: 14, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
      <LabelsSeen t={t} ticks={[[0, 10], [10, 11]]} />
    </g>
  );
};

/* S15: garden — old man scatters seed (arm sweeps down), two pigeons hop,
   CATS pops at t=10. Counter ticks to 12. */
export const S15: React.FC<ShotProps> = ({ t }) => {
  const hop1 = 820 + 5 * Math.sin(t / 5);
  const hop2 = 830 + 5 * Math.sin(t / 5 + 1.5);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Garden t={t} />
      <Actor look="grey" x={750} y={681} scale={1.35} facing={1} t={t}
        keys={[{ f: 10, p: { armR: { a: 50, b: -5 } } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={750} y={pillY(681, 1.35, 1)} text="CATS" t={t} from={10} s={1} />
      <g transform={`translate(1050 ${hop1})`}><ellipse rx={22} ry={14} fill="#6A7A8A" /><circle cx={16} cy={-12} r={9} fill="#6A7A8A" /></g>
      <g transform={`translate(1150 ${hop2})`}><ellipse rx={22} ry={14} fill="#55646E" /><circle cx={-16} cy={-12} r={9} fill="#55646E" /></g>
      <Actor look="alex" x={1450} y={560} scale={0.8} facing={-1} t={t}
        keys={[{ f: 14, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
      <LabelsSeen t={t} ticks={[[0, 11], [10, 12]]} />
    </g>
  );
};

/* S16: garden — hero POINTS at the CATS label (HeroRig point pose);
   old man shrugs (both arms up, confused face). Label stays. */
export const S16: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Garden t={t} />
    <HeroRig frame={t} pose="point" look={ALEX} x={650} y={681} scale={1.35} facing={1} />
    <Actor look="grey" x={1250} y={681} scale={1.2} facing={-1} t={t}
      keys={[{ f: 12, p: { armL: { a: -40, b: -20 }, armR: { a: -40, b: -20 } } }]}
      exprs={[[0, 'neutral'], [12, 'worried']]} />
    <LabelStamp x={1250} y={pillY(681, 1.2, 1)} text="CATS" t={t} from={0} s={1} />
    <LabelsSeen t={t} ticks={[[0, 12]]} />
  </g>
);

/* S17: void title card 1 — "WHAT IF YOU COULD / READ ANYONE'S / ALLERGIES?" */
export const S17: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="m2-void17" />
    <GoldLine x={960} y={400} text="WHAT IF YOU COULD" t={t} from={10} size={92} />
    <GoldLine x={960} y={520} text="READ ANYONE'S" t={t} from={30} size={92} />
    <GoldLine x={960} y={640} text="ALLERGIES?" t={t} from={55} size={110} />
  </g>
);

/* S18: void title card 2 — "NOT JUST THE WORST ONES." / "EVERY ONE OF
   THEM." Three labels pop in a row below. */
export const S18: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="m2-void18" />
    <GoldLine x={960} y={340} text="NOT JUST THE WORST ONES." t={t} from={8} size={56} color={WHITE} />
    <GoldLine x={960} y={440} text="EVERY ONE OF THEM." t={t} from={40} size={72} />
    <LabelStamp x={480} y={640} text="PEANUTS" t={t} from={20} s={1.1} />
    <LabelStamp x={960} y={640} text="POLLEN" t={t} from={50} s={1.1} />
    <LabelStamp x={1440} y={640} text="CATS" t={t} from={80} s={1.1} />
  </g>
);

/* S19: void title card 3 — "ALL DAY. EVERY DAY." / "EVERY HEAD YOU PASS." */
export const S19: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="m2-void19" />
    <GoldLine x={960} y={430} text="ALL DAY. EVERY DAY." t={t} from={8} size={84} />
    <GoldLine x={960} y={560} text="EVERY HEAD YOU PASS." t={t} from={40} size={84} />
  </g>
);

/* S20: void title card 4 — "SOUNDS LIKE A / SUPERPOWER, DOESN'T IT?" /
   "STAY WITH ME." */
export const S20: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="m2-void20" />
    <GoldLine x={960} y={420} text="SOUNDS LIKE A" t={t} from={8} size={84} color={WHITE} />
    <GoldLine x={960} y={540} text="SUPERPOWER, DOESN'T IT?" t={t} from={30} size={84} />
    <GoldLine x={960} y={680} text="STAY WITH ME." t={t} from={60} size={56} color={WHITE} />
  </g>
);

/* S21: void title card 5 — "BECAUSE BY THE END OF THIS, / YOU WON'T WANT IT." */
export const S21: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="m2-void21" />
    <GoldLine x={960} y={430} text="BECAUSE BY THE END OF THIS," t={t} from={8} size={56} color={WHITE} />
    <GoldLine x={960} y={560} text="YOU WON'T WANT IT." t={t} from={45} size={84} />
  </g>
);

/* S22: classroom — hero at a desk raises a hand; rule card "RULE 1" pops
   top-right; two classmates' labels pop: PEANUTS, POLLEN. */
export const S22: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Classroom t={t} id="m2-cls22" />
    <Actor look="alex" x={700} y={660} scale={1.2} facing={1} t={t}
      keys={[{ f: 14, p: { armR: { a: -70, b: -10 } } }]} exprs={[[0, 'neutral']]} />
    <RuleCard text="RULE 1" t={t} from={8} />
    <Actor look="sam" x={1150} y={640} scale={1.0} facing={-1} t={t}
      keys={[{ f: 12, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1150} y={pillY(640, 1.0, 0.9)} text="PEANUTS" t={t} from={10} s={0.9} />
    <Actor look="green" x={1500} y={640} scale={1.0} facing={-1} t={t}
      keys={[{ f: 20, p: { headTilt: 4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1500} y={pillY(640, 1.0, 0.9)} text="POLLEN" t={t} from={22} s={0.9} />
    <LabelsSeen t={t} ticks={[[0, 12]]} />
  </g>
);

/* S23: hospital corridor — patient with PEANUTS label; red cross icon
   pulses; an EpiPen graphic pops beside the label. */
export const S23: React.FC<ShotProps> = ({ t }) => {
  const crossO = 0.6 + 0.4 * Math.sin(t / 5);
  const ly = pillY(636, 1.35, 1);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Hospital t={t} id="m2-hosp23" veil={0.4} />
      <Actor look="red" x={750} y={636} scale={1.35} facing={1} t={t}
        keys={[{ f: 12, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={750} y={ly} text="PEANUTS" t={t} from={6} s={1} />
      <g transform={`translate(1030 ${ly - 10})`} opacity={clamp((t - 20) / 6)}>
        <rect x={-12} y={-34} width={24} height={68} rx={10} fill="#F2B33D" stroke="#121019" strokeWidth={2} />
        <rect x={-12} y={-34} width={24} height={16} rx={8} fill="#E8823A" />
      </g>
      <g transform="translate(1180 380)" opacity={crossO}>
        <rect x={-14} y={-40} width={28} height={80} rx={6} fill={RED} />
        <rect x={-40} y={-14} width={80} height={28} rx={6} fill={RED} />
      </g>
      <Actor look="alex" x={1450} y={560} scale={0.8} facing={-1} t={t}
        keys={[{ f: 14, p: { headTilt: -4 } }]} exprs={[[0, 'neutral'], [14, 'worried']]} />
      <LabelsSeen t={t} ticks={[[0, 12]]} />
    </g>
  );
};

/* S24: market — hero POINTS at a shopper's POLLEN label (HeroRig point);
   shopkeeper shrugs, confused face. */
export const S24: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Market t={t} />
    <HeroRig frame={t} pose="point" look={ALEX} x={650} y={681} scale={1.35} facing={1} />
    <Actor look="purple" x={1250} y={681} scale={1.35} facing={-1} t={t}
      keys={[{ f: 12, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1250} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={6} s={1} />
    <Actor look="grey" x={1620} y={681} scale={1.2} facing={-1} t={t}
      keys={[{ f: 14, p: { armL: { a: -40, b: -20 }, armR: { a: -40, b: -20 } } }]}
      exprs={[[0, 'neutral'], [14, 'worried']]} />
    <LabelsSeen t={t} ticks={[[0, 12]]} />
  </g>
);

/* S25: market — hero points again (point pose, arm lowers); the POLLEN
   label blinks/fades in and out while the shopkeeper shakes his head. */
export const S25: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Market t={t} />
    <HeroRig frame={t} pose="point" look={ALEX} x={650} y={681} scale={1.35} facing={1} face={[[0, 'worried']]} />
    <Actor look="purple" x={1250} y={681} scale={1.35} facing={-1} t={t}
      keys={[{ f: 12, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1250} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={0} s={1} blink />
    <Actor look="grey" x={1620} y={681} scale={1.2} facing={-1} t={t}
      keys={[{ f: 14, p: { headTilt: -7 } }]} exprs={[[0, 'worried']]} />
    <LabelsSeen t={t} ticks={[[0, 12]]} />
  </g>
);

/* S26: bathroom mirror — hero at mirror, blank head, "?" pops above his
   head and pulses. Worried face. */
export const S26: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bathroom />
    <Actor look="alex" x={960} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 12, p: { armR: { a: -60, b: -40 }, headTilt: -4 } }]}
      exprs={[[0, 'neutral'], [12, 'worried']]} />
    <QMark x={960} y={pillY(681, 1.35, 1) - 10} t={t} from={10} />
    <LabelsSeen t={t} ticks={[[0, 12]]} />
  </g>
);

/* S27: bathroom — hero shrugs (both arms up, head tilt), worried face.
   "?" fades. */
export const S27: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bathroom />
    <Actor look="alex" x={960} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 12, p: { armL: { a: -45, b: -20 }, armR: { a: -45, b: -20 }, headTilt: 4 } }]}
      exprs={[[0, 'worried']]} />
    <QMark x={960} y={pillY(681, 1.35, 1) - 10} t={t} from={0} until={10} />
    <LabelsSeen t={t} ticks={[[0, 12]]} />
  </g>
);

/* S28: gym — runner with POLLEN sneezes: head tilts back, face swap
   neutral to shock; rule card "RULE 4" pops top-right. */
export const S28: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Gym t={t} />
    <Actor look="red" x={800} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 14, p: { headTilt: -10 } }]}
      exprs={[[0, 'neutral'], [14, 'shock']]} />
    <LabelStamp x={800} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={6} s={1} />
    <RuleCard text="RULE 4" t={t} from={8} />
    <Actor look="alex" x={1400} y={560} scale={0.8} facing={-1} t={t}
      keys={[{ f: 16, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <LabelsSeen t={t} ticks={[[0, 12]]} />
  </g>
);

/* S29: gym — runner holds his throat (hand to throat), gasps; red
   warning triangle pulses. */
export const S29: React.FC<ShotProps> = ({ t }) => {
  const warnO = 0.55 + 0.45 * Math.sin(t / 4);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Gym t={t} />
      <Actor look="red" x={800} y={681} scale={1.35} facing={1} t={t}
        keys={[{ f: 12, p: { armR: { a: -30, b: -70 }, headTilt: -4 } }]}
        exprs={[[0, 'neutral'], [12, 'shock']]} />
      <LabelStamp x={800} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={0} s={1} />
      <g transform="translate(1180 420)" opacity={warnO}>
        <polygon points="0,-52 52,40 -52,40" fill={RED} stroke="#FFFFFF" strokeWidth={4} strokeLinejoin="round" />
        <text x={0} y={28} fontFamily={FONT.title} fontWeight={700} fontSize={44} fill="#FFFFFF" textAnchor="middle">!</text>
      </g>
      <Actor look="alex" x={1450} y={560} scale={0.8} facing={-1} t={t}
        keys={[{ f: 14, p: { headTilt: -4 } }]} exprs={[[0, 'neutral'], [14, 'worried']]} />
      <LabelsSeen t={t} ticks={[[0, 12]]} />
    </g>
  );
};

/* S30: bus — hero boards the bus (walkCyclePose up the steps, left to
   right), determined face. */
export const S30: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="m2-bus30" veil={0.4} />
    <Hero pose={walkCyclePose(t, { x0: 350, groundY: 820, scale: 1.35, facing: 1, stride: 64, stepDuration: 14 })} look={ALEX} />
    <LabelsSeen t={t} ticks={[[0, 12]]} />
  </g>
);

/* S31: bus — hero sits; stranger beside him; PEANUTS pops above the
   stranger at t=20. Counter reappears top-left: 13. */
export const S31: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="m2-bus31" veil={0.4} />
    <Actor look="alex" x={650} y={636} scale={1.2} facing={1} t={t}
      keys={[{ f: 12, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <Actor look="harwick" x={1200} y={636} scale={1.35} facing={-1} t={t}
      keys={[{ f: 10, p: { headTilt: 4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1200} y={pillY(636, 1.35, 1)} text="PEANUTS" t={t} from={20} s={1} />
    <LabelsSeen t={t} ticks={[[0, 12], [20, 13]]} />
  </g>
);

/* S32: bus — hero extends an arm holding a biscuit (arm out, bag in the
   other hand); stranger turns his head to look. */
export const S32: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="m2-bus32" veil={0.4} />
    <Actor look="alex" x={650} y={636} scale={1.2} facing={1} t={t}
      keys={[{ f: 12, p: { armR: { a: 70, b: 0 } } }]} exprs={[[0, 'neutral']]} />
    {t >= 12 ? (
      <g>
        <circle cx={852} cy={520} r={16} fill="#D9A066" stroke="#A8763E" strokeWidth={3} />
        <circle cx={846} cy={514} r={3} fill="#A8763E" />
        <circle cx={858} cy={526} r={3} fill="#A8763E" />
      </g>
    ) : null}
    <Actor look="harwick" x={1200} y={636} scale={1.35} facing={-1} t={t}
      keys={[{ f: 16, p: { headTilt: -5 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1200} y={pillY(636, 1.35, 1)} text="PEANUTS" t={t} from={0} s={1} />
    <LabelsSeen t={t} ticks={[[0, 13]]} />
  </g>
);

/* S33: bus — stranger pushes hero's arm away (arm sweeps out), face swap
   neutral to shock. Hero recoils (head back). */
export const S33: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="m2-bus33" veil={0.4} />
    <Actor look="alex" x={650} y={636} scale={1.2} facing={1} t={t}
      keys={[{ f: 16, p: { headTilt: -8 } }]} exprs={[[0, 'neutral'], [16, 'worried']]} />
    <Actor look="harwick" x={1200} y={636} scale={1.35} facing={-1} t={t}
      keys={[{ f: 12, p: { armL: { a: 50, b: 0 } } }]}
      exprs={[[0, 'neutral'], [12, 'shock']]} />
    <LabelStamp x={1200} y={pillY(636, 1.35, 1)} text="PEANUTS" t={t} from={0} s={1} />
    <LabelsSeen t={t} ticks={[[0, 13]]} />
  </g>
);

/* S34: bus — stranger holds a hand up in warning (arm up, palm out);
   the PEANUTS label pulses red. */
export const S34: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="m2-bus34" veil={0.4} />
    <Actor look="alex" x={650} y={636} scale={1.2} facing={1} t={t}
      keys={[{ f: 12, p: { headTilt: -4 } }]} exprs={[[0, 'neutral'], [12, 'worried']]} />
    <Actor look="harwick" x={1200} y={636} scale={1.35} facing={-1} t={t}
      keys={[{ f: 10, p: { armR: { a: -80, b: -10 } } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1200} y={pillY(636, 1.35, 1)} text="PEANUTS" t={t} from={0} s={1} redPulse />
    <LabelsSeen t={t} ticks={[[0, 13]]} />
  </g>
);

/* S35: bus — hero nods (head tilts down and holds); a green checkmark
   pops over the PEANUTS label. */
export const S35: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="m2-bus35" veil={0.4} />
    <Actor look="alex" x={650} y={636} scale={1.2} facing={1} t={t}
      keys={[{ f: 12, p: { headTilt: 6 } }]} exprs={[[0, 'neutral'], [12, 'happy']]} />
    <Actor look="harwick" x={1200} y={636} scale={1.35} facing={-1} t={t}
      keys={[{ f: 14, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1200} y={pillY(636, 1.35, 1)} text="PEANUTS" t={t} from={0} s={1} />
    <CheckMark x={1200} y={pillY(636, 1.35, 1) - 70} t={t} from={14} />
    <LabelsSeen t={t} ticks={[[0, 13]]} />
  </g>
);

/* S36: street (bus stop) — hero steps off the bus (walkCyclePose), hand
   on chest; a small heart icon pulses above his chest. */
export const S36: React.FC<ShotProps> = ({ t }) => {
  const speed = 64 / 14;
  const hx = 500 + speed * t;
  const pulse = 1 + 0.15 * Math.sin(t / 4);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Street t={t} />
      <Hero pose={walkCyclePose(t, { x0: 500, groundY: 860, scale: 1.35, facing: 1, stride: 64, stepDuration: 14 })} look={ALEX} />
      <g transform={`translate(${hx} 560) scale(${pulse})`}>
        <path d="M 0 12 C -26 -12 -58 8 0 42 C 58 8 26 -12 0 12 Z" fill={RED} />
      </g>
      <LabelsSeen t={t} ticks={[[0, 13]]} />
    </g>
  );
};

/* S37: street — hero WALKS, worried face, glancing side to side (head
   tilts); crowd labels around him. */
export const S37: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Hero pose={{ ...walkCyclePose(t, { x0: 250, groundY: 860, scale: 1.35, facing: 1, stride: 64, stepDuration: 15 }), ...faceAt(t, [[0, 'worried']]) }} look={ALEX} />
    <Actor look="purple" x={1300} y={681} scale={1.35} facing={-1} t={t}
      keys={[{ f: 12, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1300} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={8} s={1} />
    <Actor look="grey" x={1620} y={681} scale={1.35} facing={-1} t={t}
      keys={[{ f: 20, p: { headTilt: 4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1620} y={pillY(681, 1.35, 1)} text="CATS" t={t} from={24} s={1} />
    <LabelsSeen t={t} ticks={[[0, 13]]} />
  </g>
);

/* S38: rooftop (dusk) — hero looks over the city; distant labels twinkle
   below; hero turns to camera, determined face. */
export const S38: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Rooftop t={t} cityLit={1} />
    <Actor look="alex" x={960} y={700} scale={1.35} facing={1} t={t}
      keys={[{ f: 20, p: { headTilt: -5 } }]}
      exprs={[[0, 'worried'], [25, 'neutral']]} />
    <LabelStamp x={500} y={850} text="POLLEN" t={t} from={10} s={0.45} />
    <LabelStamp x={960} y={880} text="CATS" t={t} from={22} s={0.45} />
    <LabelStamp x={1450} y={840} text="PEANUTS" t={t} from={34} s={0.45} />
    <LabelsSeen t={t} ticks={[[0, 13]]} />
  </g>
);

/* S39: void end card — "WHAT WOULD YOUR / LABEL SAY?" then
   "TELL ME IN THE COMMENTS". Hold to the end. */
export const S39: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="m2-void39" />
    <GoldLine x={960} y={420} text="WHAT WOULD YOUR" t={t} from={10} size={84} />
    <GoldLine x={960} y={540} text="LABEL SAY?" t={t} from={40} size={92} />
    <GoldLine x={960} y={680} text="TELL ME IN THE COMMENTS" t={t} from={70} size={48} color={WHITE} />
  </g>
);
