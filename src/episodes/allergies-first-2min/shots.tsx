import React from 'react';
import {
  Hero, poseAt, faceAt, clamp, backOut, FONT, Look, Expr,
  camT, ShotProps, Sparkle, NightSky, Stars, Moon,
  Bedroom, Park, Street, Bus, Rooftop,
} from '../../engine';

/* AllergiesFirst2min — 'What If You Could Read Anyone's Allergies?'
   (first 2 minutes: 39 shots b1-01..b3-09, 114.9s / 3447 frames).
   Built ONLY from Claude's delivery (allergies-narration.txt first 329
   words, allergies-scenes-part1.json beats 1-3). Voice: Helio
   (avocado_v2:MAI_03), 6 chunks, all whisper-verified word-for-word
   (chunk 4 regenerated once: first take heard "watched" for "watch").
   Shot timing is anchored to the whisper word timings of the real voice.
   RIG (Claude's own spec, narration line 29 + thumbnail line 39): round
   pale heads, dot eyes, thin eyebrows, hair, blush, small line mouth;
   solid coloured torsos; HERO in a warm orange hoodie #FDB33F. This is
   Claude's spec, NOT the 40s sample's black-head/blue-hoodie Ifinite
   look — the 40s sample deviated from Claude; this build follows Claude.
   LABELS (narration wins): hero NEVER has a label; girl POLLEN, driver
   CATS, big guy PEANUTS, construction worker PEANUTS, jogger POLLEN,
   stroller woman CATS. Only PEANUTS/POLLEN/CATS (+dust, not in beats
   1-3) appear as allergy words. The two generic first-appearance
   stamps (b1-02/b1-03, neighbour unspecified) use the plain ALLERGY
   stamp exactly as the approved 40s S2 did. No whoosh on any cut.
   Camera STATIC in every shot except b2-06's slight push-in (Claude's
   visual: "camera pushes in slightly"). grain: false. Letterbox in
   stitch.sh. Sets: studio Bedroom/Street/Park/Bus/Rooftop + starry void.
   No pram prop in the rig: the stroller woman appears alone (40s note). */

const BLACK = '#0D0D12';
const WHITE = '#F6EFE3';
const GOLD = '#FFD700';
const GREEN = '#38A169';
const INK = '#121019';
const PALE = '#F6EFE3';
const PALESHADE = '#E2D3BE';

const mkLook = (jacket: string, shade: string, accent: string, extra?: Look['extra'], hair = '#2A1C18', shoe = '#3A3446'): Look => ({
  skin: PALE, skinShade: PALESHADE, hand: PALE, jacket, jacketShade: shade,
  accent, limb: '#3A3446', line: INK, shoe, face: INK, hair, extra,
});

const HERO: Look = mkLook('#FDB33F', '#D18A1E', '#F2B33D', 'hood', '#2A1C18', '#8A5A1E');
const GIRL: Look = mkLook('#7B4B94', '#5E3873', '#C9A0DC', 'bob', '#3A2620');
const DRIVER: Look = mkLook('#3A3F4A', '#2C3038', '#A8323E', 'suit', '#17141A', '#14151A');
const BIGGUY: Look = mkLook('#A83A3A', '#86302E', '#E9C46A', undefined, '#1E1410');
const WORKER: Look = mkLook('#E8C832', '#C4A51F', '#F2B33D', undefined, '#3A2A10', '#4A3A1A');
const JOGGER: Look = mkLook('#5A7A4A', '#46603A', '#E9C46A', undefined, '#241A12');
const STROLLER: Look = mkLook('#3E8C86', '#2F6E69', '#F28C6A', 'bob', '#3A2620');
const GREY: Look = mkLook('#6A7A8A', '#55646E', '#E9C46A', undefined, '#2A2620');
const KIDGREEN: Look = mkLook('#5A7A4A', '#46603A', '#E9C46A', undefined, '#241A12');

const LOOKMAP: Record<string, Look> = {
  hero: HERO, girl: GIRL, driver: DRIVER, bigguy: BIGGUY,
  worker: WORKER, jogger: JOGGER, stroller: STROLLER,
  grey: GREY, kid: KIDGREEN,
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

/** The green allergy label stamp: green rounded-rectangle (#38A169) with
    white bold caps, tiny downward pointer, pops with overshoot + ring +
    sparkle. Modelled on the house NumberPill. No whoosh.
    `from` < 0 means the label is already there when the shot starts. */
const LabelStamp: React.FC<{
  x: number; y: number; text: string; t: number; from?: number; s?: number;
}> = ({ x, y, text, t, from = 0, s = 1 }) => {
  const k = clamp((t - from) / 6);
  if (k <= 0) return null;
  const pop = backOut(k);
  const breathe = 0.94 + 0.06 * Math.sin(t / 9);
  const w = 30 + text.length * 26;
  const bt = t - from;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (0.55 + 0.45 * pop) * breathe})`} opacity={1}>
      {bt >= 0 && bt < 14 ? (
        <g>
          <circle r={30 + bt * 9} fill="none" stroke={GREEN} strokeWidth={5} opacity={0.9 * (1 - bt / 14)} />
          <Sparkle x={-w / 2 - 26} y={-26} t={bt} s={0.8} />
          <Sparkle x={w / 2 + 26} y={-30} t={bt + 2} s={0.7} />
          <Sparkle x={0} y={-58} t={bt + 4} s={0.9} />
        </g>
      ) : null}
      <rect x={-w / 2 - 12} y={-34} width={w + 24} height={68} rx={20} fill={GREEN} opacity={0.96}
        style={{ filter: 'drop-shadow(0 0 12px rgba(56,161,105,0.75))' }} />
      <polygon points="-9,30 9,30 0,44" fill={GREEN} strokeLinejoin="round" />
      <text x={0} y={11} fontFamily={FONT.title} fontWeight={700} fontSize={30} fill="#FFFFFF" textAnchor="middle">
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

/** Starry void background shared by the dark + title shots. */
const Void: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <NightSky id={id} horizonY={1080} />
    <Stars seed={113} x0={0} y0={0} w={1920} h={1080} t={t} n={60} o={0.8} />
    <Moon x={1700} y={180} r={54} />
  </g>
);

/* S1 b1-01: bedroom — hero wakes up. "You wake up, and the world has
   changed." ONE action: head lifts once, one arm rises to rub his eyes. */
export const S1: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Bedroom t={t} id="al-bed1" veil={0.3} lamp={0.5} />
    <Actor look="hero" x={840} y={681} scale={1.35} facing={1} t={t}
      keys={[
        { f: 20, p: { headTilt: -6, armR: { a: -60, b: -30 } } },
        { f: 60, p: { headTilt: 2, armR: { a: -30, b: -10 } } },
      ]} exprs={[[0, 'neutral'], [20, 'worried']]} />
  </g>
);

/* S2 b1-02: bedroom — hero at the window, the first stamp in the glass.
   "Above every head, a little green label." ALLERGY pops at t=6 inside
   the window (the neighbour is unseen behind the glass; the stamp is
   the label — the approved 40s S2 treatment). */
export const S2: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Bedroom t={t} id="al-bed2" veil={0.3} lamp={0.5} />
    <Actor look="hero" x={1500} y={681} scale={1.35} facing={-1} t={t}
      keys={[{ f: 25, p: { headTilt: -5, armR: { a: -50, b: -20 } } }]} exprs={[[0, 'neutral'], [25, 'shock']]} />
    <LabelStamp x={1200} y={330} text="ALLERGY" t={t} from={6} s={1.1} />
  </g>
);

/* S3 b1-03: void — close-up of the glowing green stamp, big and alone.
   "Everyone's biggest allergy, written where only you can see it."
   ALLERGY pops at t=6 and breathes. */
export const S3: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="al-void3" />
    <LabelStamp x={960} y={520} text="ALLERGY" t={t} from={6} s={2.2} />
  </g>
);

/* S4 b1-04: street — construction worker, hero small at left watching.
   "The labels glow softly in the morning light — PEANUTS on the
   construction worker three buildings over," PEANUTS pops at t=75, on
   the word PEANUTS. */
export const S4: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="hero" x={300} y={551} scale={0.675} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <Actor look="worker" x={1150} y={681} scale={1.35} facing={-1} t={t}
      keys={[{ f: 40, p: { headTilt: -3, armR: { a: 45, b: -15 } } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1150} y={pillY(681, 1.35, 1)} text="PEANUTS" t={t} from={75} s={1} />
  </g>
);

/* S5 b1-05: street — jogger mid-stride, hero small at left. "POLLEN on
   the jogger running past the window," POLLEN pops at t=2. */
export const S5: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="hero" x={300} y={551} scale={0.675} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <Actor look="jogger" x={1150} y={681} scale={1.35} facing={-1} t={t}
      keys={[{ f: 10, p: { legL: { a: 35, b: -20 }, legR: { a: -30, b: -15 }, armR: { a: 55, b: -40 }, armL: { a: -30, b: -30 } } }]}
      exprs={[[0, 'happy']]} />
    <LabelStamp x={1150} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={2} s={1} />
  </g>
);

/* S6 b1-06: street — woman with the stroller (no pram in the rig).
   "CATS on the woman with the baby stroller two doors down." CATS pops
   at t=2. */
export const S6: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="hero" x={300} y={551} scale={0.675} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <Actor look="stroller" x={1150} y={681} scale={1.35} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1150} y={pillY(681, 1.35, 1)} text="CATS" t={t} from={2} s={1} />
  </g>
);

/* S7 b1-07: bedroom — hero in the orange hoodie touches his own head,
   puzzled. "You pull your hoodie up, checking your own head." */
export const S7: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bedroom t={t} id="al-bed7" veil={0.3} lamp={0.5} />
    <Actor look="hero" x={960} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 18, p: { headTilt: -8, armR: { a: -110, b: -60 } } }]} exprs={[[0, 'neutral'], [18, 'worried']]} />
  </g>
);

/* S8 b1-08: bedroom — mirror shot: hero's bare head, NO label anywhere.
   "No label. Just skin." Hero large, facing camera, hand to head. */
export const S8: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.05)}>
    <Bedroom t={t} id="al-bed8" veil={0.3} lamp={0.5} />
    <Actor look="hero" x={960} y={700} scale={1.5} facing={1} t={t}
      keys={[{ f: 15, p: { headTilt: -4, armR: { a: -90, b: -50 } } }]} exprs={[[0, 'worried']]} />
  </g>
);

/* S9 b1-09: street — hero standing alone. "You're the only one who
   doesn't have a tag." No other characters, no labels in frame. */
export const S9: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="hero" x={960} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 25, p: { headTilt: -4 } }]} exprs={[[0, 'neutral'], [25, 'worried']]} />
  </g>
);

/* S10 b1-10: street wide — three pedestrians, different labels.
   "The labels are different for everyone." Pops at 6/20/34. */
export const S10: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="worker" x={480} y={636} scale={1.1} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={480} y={pillY(636, 1.1, 0.9)} text="PEANUTS" t={t} from={6} s={0.9} />
    <Actor look="jogger" x={960} y={636} scale={1.1} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={960} y={pillY(636, 1.1, 0.9)} text="POLLEN" t={t} from={20} s={0.9} />
    <Actor look="stroller" x={1440} y={636} scale={1.1} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1440} y={pillY(636, 1.1, 0.9)} text="CATS" t={t} from={34} s={0.9} />
  </g>
);

/* S11 b1-11: void — the stamps at three sizes. "Some are small. Some
   are bold." Small PEANUTS, medium POLLEN, large CATS. Pops 4/18/32. */
export const S11: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="al-void11" />
    <LabelStamp x={480} y={520} text="PEANUTS" t={t} from={4} s={0.7} />
    <LabelStamp x={960} y={520} text="POLLEN" t={t} from={18} s={1.0} />
    <LabelStamp x={1440} y={520} text="CATS" t={t} from={32} s={1.4} />
  </g>
);

/* S12 b1-12: street wide — hero looking out at the crowded street
   below. "But they're all there, above every head, while yours stands
   alone." The crowd's labels are ALREADY there (from=-30); hero has
   none. */
export const S12: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="hero" x={350} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 30, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
    <Actor look="worker" x={1150} y={573} scale={0.516} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1150} y={pillY(573, 0.516, 0.8)} text="PEANUTS" t={t} from={-30} s={0.8} />
    <Actor look="jogger" x={1400} y={573} scale={0.516} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1400} y={pillY(573, 0.516, 0.8)} text="POLLEN" t={t} from={-30} s={0.8} />
    <Actor look="stroller" x={1650} y={573} scale={0.516} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1650} y={pillY(573, 0.516, 0.8)} text="CATS" t={t} from={-30} s={0.8} />
  </g>
);

/* S13 b1-13: rooftop — sunrise over the city skyline. "It's a quiet
   morning. The sun is just coming up." No characters. */
export const S13: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Rooftop t={t} sunX={960} sunY={700} cityLit={1} />
  </g>
);

/* S14 b1-14: street — morning commuters on the sidewalk, labels
   already there. "People are starting their day. But the labels are
   already there —" */
export const S14: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="grey" x={550} y={636} scale={1.1} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={550} y={pillY(636, 1.1, 0.9)} text="POLLEN" t={t} from={-30} s={0.9} />
    <Actor look="worker" x={960} y={636} scale={1.1} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={960} y={pillY(636, 1.1, 0.9)} text="PEANUTS" t={t} from={-30} s={0.9} />
    <Actor look="kid" x={1370} y={593} scale={0.6} facing={1} t={t} keys={[]} exprs={[[0, 'happy']]} />
    <LabelStamp x={1370} y={pillY(593, 0.6, 0.8)} text="CATS" t={t} from={-30} s={0.8} />
  </g>
);

/* S15 b1-15: street — construction worker and jogger passing by.
   "PEANUTS on the construction worker, POLLEN on the jogger," PEANUTS
   pops at t=2 on the word; the jogger's POLLEN is already there (this
   is the "already there" repeat — established in S5). */
export const S15: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="worker" x={700} y={681} scale={1.35} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={700} y={pillY(681, 1.35, 1)} text="PEANUTS" t={t} from={2} s={1} />
    <Actor look="jogger" x={1300} y={681} scale={1.35} facing={-1} t={t}
      keys={[{ f: 10, p: { legL: { a: 35, b: -20 }, legR: { a: -30, b: -15 } } }]} exprs={[[0, 'happy']]} />
    <LabelStamp x={1300} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={-30} s={1} />
  </g>
);

/* S16 b1-16: street — woman with the stroller passing by. "CATS on
   the woman with the baby stroller." CATS pops at t=2. */
export const S16: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="stroller" x={960} y={681} scale={1.35} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={960} y={pillY(681, 1.35, 1)} text="CATS" t={t} from={2} s={1} />
  </g>
);

/* S17 b1-17: bus — the big guy. "On the bus, the big guy's label says
   PEANUTS." PEANUTS pops at t=61, on the word PEANUTS. Hero small at
   left watching. */
export const S17: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="al-bus17" veil={0.4} />
    <Actor look="hero" x={300} y={551} scale={0.675} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <Actor look="bigguy" x={1050} y={636} scale={1.35} facing={1} t={t}
      keys={[{ f: 30, p: { headTilt: -3 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1050} y={pillY(636, 1.35, 1)} text="PEANUTS" t={t} from={61} s={1} />
  </g>
);

/* S18 b1-18: bus — the girl by the window. "The girl by the window:
   POLLEN." POLLEN pops at t=39, on the word POLLEN. */
export const S18: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="al-bus18" veil={0.4} />
    <Actor look="girl" x={960} y={636} scale={1.35} facing={1} t={t}
      keys={[{ f: 30, p: { headTilt: 4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={960} y={pillY(636, 1.35, 1)} text="POLLEN" t={t} from={39} s={1} />
  </g>
);

/* S19 b1-19: bus — the driver. "Even the driver: CATS." CATS pops at
   t=36, on the word CATS. */
export const S19: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="al-bus19" veil={0.4} />
    <Actor look="driver" x={960} y={636} scale={1.35} facing={1} t={t}
      keys={[{ f: 40, p: { headTilt: -3, armR: { a: 30, b: -10 } } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={960} y={pillY(636, 1.35, 1)} text="CATS" t={t} from={36} s={1} />
  </g>
);

/* S20 b1-20: bus — hero watching the passengers. "The labels never
   lie. They don't change." Labels already there. */
export const S20: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="al-bus20" veil={0.4} />
    <Actor look="bigguy" x={400} y={573} scale={0.6} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={400} y={pillY(573, 0.6, 0.8)} text="PEANUTS" t={t} from={-30} s={0.8} />
    <Actor look="hero" x={960} y={636} scale={1.35} facing={1} t={t}
      keys={[{ f: 30, p: { headTilt: -4 } }]} exprs={[[0, 'neutral'], [30, 'worried']]} />
    <Actor look="girl" x={1520} y={573} scale={0.6} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1520} y={pillY(573, 0.6, 0.8)} text="POLLEN" t={t} from={-30} s={0.8} />
  </g>
);

/* S21 b1-21: bus — the passenger next to hero, oblivious. "And nobody
   else can see them. Only you." The passenger's POLLEN label is there;
   he doesn't react. Hero has none. */
export const S21: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="al-bus21" veil={0.4} />
    <Actor look="hero" x={700} y={636} scale={1.35} facing={1} t={t}
      keys={[{ f: 30, p: { headTilt: -4 } }]} exprs={[[0, 'neutral'], [30, 'worried']]} />
    <Actor look="grey" x={1250} y={636} scale={1.35} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1250} y={pillY(636, 1.35, 1)} text="POLLEN" t={t} from={-30} s={1} />
  </g>
);

/* S22 b1-22: bus wide — multiple glowing green stamps. "You watch the
   labels float above the crowd." Pops at 6/20/34. */
export const S22: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Bus t={t} id="al-bus22" veil={0.4} />
    <Actor look="bigguy" x={480} y={636} scale={1.1} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={480} y={pillY(636, 1.1, 0.9)} text="PEANUTS" t={t} from={6} s={0.9} />
    <Actor look="girl" x={960} y={636} scale={1.1} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={960} y={pillY(636, 1.1, 0.9)} text="POLLEN" t={t} from={20} s={0.9} />
    <Actor look="driver" x={1440} y={636} scale={1.1} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1440} y={pillY(636, 1.1, 0.9)} text="CATS" t={t} from={34} s={0.9} />
  </g>
);

/* S23 b1-23: bus — hero's thoughtful expression in close-up. "Each one
   a secret you now hold." */
export const S23: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.05)}>
    <Bus t={t} id="al-bus23" veil={0.4} />
    <Actor look="hero" x={960} y={700} scale={1.5} facing={1} t={t}
      keys={[{ f: 25, p: { headTilt: -5 } }]} exprs={[[0, 'neutral'], [25, 'worried']]} />
  </g>
);

/* S24 b1-24: bus — hero pulls his hood tighter as the bus moves.
   "A responsibility you never asked for." ONE action: arm rises to the
   hood and holds. */
export const S24: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="al-bus24" veil={0.4} />
    <Actor look="hero" x={960} y={636} scale={1.35} facing={1} t={t}
      keys={[{ f: 20, p: { headTilt: -4, armR: { a: -80, b: -40 } } }]} exprs={[[0, 'worried']]} />
  </g>
);

/* S25 b2-01: title card on the void — the question. "What if you could
   read anyone's allergies?" Lines reveal in sequence. (The one low boom
   in the SFX stem lands on this shot's first frame.) */
export const S25: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="al-void25" />
    <GoldLine x={960} y={400} text="WHAT IF YOU COULD" t={t} from={8} size={92} />
    <GoldLine x={960} y={520} text="READ ANYONE'S" t={t} from={28} size={92} />
    <GoldLine x={960} y={640} text="ALLERGIES?" t={t} from={48} size={110} />
  </g>
);

/* S26 b2-02: void — rapid montage of label close-ups. "Not just the
   big ones. Not just the obvious ones." Three stamps pop in a row. */
export const S26: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="al-void26" />
    <GoldLine x={960} y={340} text="NOT JUST THE BIG ONES." t={t} from={6} size={56} color={WHITE} />
    <GoldLine x={960} y={430} text="NOT JUST THE OBVIOUS ONES." t={t} from={30} size={56} color={WHITE} />
    <LabelStamp x={480} y={640} text="PEANUTS" t={t} from={6} s={1.1} />
    <LabelStamp x={960} y={640} text="POLLEN" t={t} from={30} s={1.1} />
    <LabelStamp x={1440} y={640} text="CATS" t={t} from={54} s={1.1} />
  </g>
);

/* S27 b2-03: street — hero walking down the bustling sidewalk.
   "Every single one. All day, every day." One mid-stride pose, held. */
export const S27: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="grey" x={420} y={573} scale={0.516} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={420} y={pillY(573, 0.516, 0.8)} text="POLLEN" t={t} from={-30} s={0.8} />
    <Actor look="hero" x={960} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 12, p: { legL: { a: 28, b: -12 }, legR: { a: -24, b: -10 }, armR: { a: 40, b: -20 }, armL: { a: -25, b: -15 } } }]}
      exprs={[[0, 'neutral']]} />
    <Actor look="worker" x={1520} y={573} scale={0.516} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1520} y={pillY(573, 0.516, 0.8)} text="PEANUTS" t={t} from={-30} s={0.8} />
  </g>
);

/* S28 b2-04: street — hero looking up at a crowd of glowing labels.
   "Labels above every head. Sounds like a superpower, right?" Pops at
   6/20/34. */
export const S28: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="hero" x={960} y={700} scale={1.5} facing={1} t={t}
      keys={[{ f: 20, p: { headTilt: -10 } }]} exprs={[[0, 'neutral'], [20, 'shock']]} />
    <Actor look="grey" x={420} y={480} scale={0.45} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={420} y={pillY(480, 0.45, 0.75)} text="PEANUTS" t={t} from={6} s={0.75} />
    <Actor look="girl" x={1500} y={480} scale={0.45} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1500} y={pillY(480, 0.45, 0.75)} text="POLLEN" t={t} from={20} s={0.75} />
    <Actor look="driver" x={1150} y={440} scale={0.4} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1150} y={pillY(440, 0.4, 0.7)} text="CATS" t={t} from={34} s={0.7} />
  </g>
);

/* S29 b2-05: street — hero turning to face the camera directly.
   "Stick around, because by the end of this," */
export const S29: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Street t={t} />
    <Actor look="hero" x={960} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 15, p: { headTilt: 3 } }, { f: 40, p: { headTilt: -2 } }]} exprs={[[0, 'neutral'], [15, 'smug']]} />
  </g>
);

/* S30 b2-06: serious close-up, THE one slow push-in (0.95 -> 1.02).
   "it won't feel like one." */
export const S30: React.FC<ShotProps> = ({ t, len }) => {
  const s = 0.95 * (1.0 + 0.07 * clamp(t / Math.max(1, len)));
  return (
    <g transform={camT(960, 540, s)}>
      <Void t={t} id="al-void30" />
      <Actor look="hero" x={960} y={700} scale={1.5} facing={1} t={t}
        keys={[{ f: 15, p: { headTilt: -4 } }]} exprs={[[0, 'worried'], [15, 'neutral']]} />
    </g>
  );
};

/* S31 b3-01: park — hero by the bench. "First, the rules." (Claude's
   visual says sitting on the bench, but the rig has no usable seated
   pose — the bench sits at the frame's far-left edge and a bent-leg
   pose reads as a mid-air crouch. Hero stands in the park instead;
   same shot, same set, same character.) */
export const S31: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Park t={t} />
    <Actor look="hero" x={960} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 10, p: { headTilt: 4, armR: { a: 35, b: -25 }, armL: { a: 30, b: -20 } } }]}
      exprs={[[0, 'neutral']]} />
  </g>
);

/* S32 b3-02: void — detailed close-up of the green stamp floating in
   air. "The labels appear above every head — green rounded-rectangle
   stamps with white bold caps." PEANUTS pops big at t=6. */
export const S32: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="al-void32" />
    <LabelStamp x={960} y={520} text="PEANUTS" t={t} from={6} s={2.0} />
  </g>
);

/* S33 b3-03: park — pedestrian walking past the bench with a PEANUTS
   label. "They show each person's biggest allergy." Hero small
   standing at right, watching. */
export const S33: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Park t={t} />
    <Actor look="worker" x={800} y={681} scale={1.35} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={800} y={pillY(681, 1.35, 1)} text="PEANUTS" t={t} from={6} s={1} />
    <Actor look="hero" x={1400} y={551} scale={0.675} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
  </g>
);

/* S34 b3-04: park — hero writing notes in the notebook. "They never
   lie. They don't change." Standing, head bowed over the notebook,
   arm forward (same no-seated-pose reason as S31). */
export const S34: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Park t={t} />
    <Actor look="hero" x={960} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 10, p: { armR: { a: 45, b: -35 }, headTilt: 6 } }]}
      exprs={[[0, 'neutral']]} />
  </g>
);

/* S35 b3-05: park — another person walks by, ignoring the label
   completely. "And nobody else can see them. Only you." */
export const S35: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Park t={t} />
    <Actor look="grey" x={800} y={681} scale={1.35} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={800} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={-30} s={1} />
    <Actor look="hero" x={1400} y={551} scale={0.675} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
  </g>
);

/* S36 b3-06: street — hero touches his head in the shop window's
   reflection. "Your own head has no label. You can't see your own
   allergy." No label anywhere in frame. */
export const S36: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Street t={t} />
    <Actor look="hero" x={960} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 20, p: { headTilt: -6, armR: { a: -100, b: -55 } } }]} exprs={[[0, 'worried']]} />
  </g>
);

/* S37 b3-07: void — warning-sign graphic insert. "The labels are about
   big allergies — the ones that cause real reactions." Gold triangle
   with "!" pops in, gold + white lines reveal. */
export const S37: React.FC<ShotProps> = ({ t }) => {
  const k = clamp((t - 6) / 8);
  const pop = backOut(k);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Void t={t} id="al-void37" />
      <g transform={`translate(960 380) scale(${0.5 + 0.5 * pop})`} opacity={k}>
        <polygon points="0,-110 105,70 -105,70" fill={GOLD} stroke="#8A6D00" strokeWidth={6} strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 18px rgba(255,215,0,0.6))' }} />
        <text x={0} y={52} fontFamily={FONT.title} fontWeight={700} fontSize={96} fill={BLACK} textAnchor="middle">!</text>
      </g>
      <GoldLine x={960} y={560} text="BIG ALLERGIES." t={t} from={30} size={84} />
      <GoldLine x={960} y={680} text="REAL REACTIONS." t={t} from={60} size={64} color={WHITE} />
    </g>
  );
};

/* S38 b3-08: street — person scratching their arm, red hive marks.
   "Not mild sensitivities. The ones that make you break out in hives,"
   The figure's left arm is raised across the body; red hive dots sit
   on the forearm. */
export const S38: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Street t={t} />
    <Actor look="grey" x={960} y={681} scale={1.35} facing={1} t={t}
      keys={[{ f: 15, p: { headTilt: -6, armR: { a: 60, b: -70 }, armL: { a: -20, b: -30 } } }]}
      exprs={[[0, 'worried']]} />
    <g fill="#C0392B" opacity={0.95}>
      <circle cx={862} cy={530} r={11} />
      <circle cx={882} cy={565} r={9} />
      <circle cx={858} cy={600} r={10} />
      <circle cx={890} cy={600} r={8} />
      <circle cx={905} cy={540} r={7} />
    </g>
  </g>
);

/* S39 b3-09: void — EpiPen device graphic. "that make you gasp for
   air, that make you carry an EpiPen." Yellow auto-injector with its
   name on the body, popping in with overshoot. */
export const S39: React.FC<ShotProps> = ({ t }) => {
  const k = clamp((t - 6) / 8);
  const pop = backOut(k);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Void t={t} id="al-void39" />
      <g transform={`translate(960 520) rotate(-24) scale(${0.5 + 0.5 * pop})`} opacity={k}>
        <rect x={-70} y={-230} width={140} height={460} rx={70} fill="#F2C200" stroke="#8A6D00" strokeWidth={5} />
        <rect x={-70} y={-230} width={140} height={110} rx={55} fill="#1E5AA8" />
        <rect x={-70} y={60} width={140} height={90} fill="#FFFFFF" opacity={0.92} />
        <text x={0} y={118} fontFamily={FONT.title} fontWeight={700} fontSize={34} fill={BLACK} textAnchor="middle">EPIPEN</text>
        <circle cx={0} cy={-190} r={22} fill="#FFFFFF" opacity={0.85} />
      </g>
    </g>
  );
};
