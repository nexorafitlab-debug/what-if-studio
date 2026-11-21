import React from 'react';
import {
  Hero, poseAt, easeOut, faceAt, clamp, backOut, FONT, Look, Expr,
  camT, ShotProps, Sparkle, NightSky, Stars, Moon,
  Bedroom, Kitchen, Park, Street, Bus,
} from '../../engine';

/* Allergies40s — 'What If You Could Read Anyone's Allergies?' (17 shots,
   40.8s / 1224 frames). Built ONLY from Claude's delivery
   (allergies-narration.txt, allergies-full-script.md,
   allergies-full-scenes.json, Beat 1 + Beat 2 = first 105 words).
   No creative content by Muse: shots b1-01..b1-12 as Claude specified
   (characters, sets, labels), plus a title card for Beat 2.
   Voice: Helio (avocado_v2:MAI_03), 2 chunks, both whisper-verified
   (44/44 and 61/61 words, in order, no hallucination).
   Shot timing is anchored to the whisper word timings of the real voice.
   NOTE on anchors: Claude's scenes.json s/e phrases ("Your mum, making
   breakfast", "You blink", "You stop asking what the labels mean"...)
   belong to a different cold-open draft and do NOT occur in the 105-word
   narration. The visual content (characters/sets/labels) is used as-is;
   timing follows the actual voice. The six middle shots (S3-S8) therefore
   sit on the one 10-word line "Everyone's biggest allergy, written where
   only you can see it." as a rapid label-flash montage (~0.65s each) —
   the three bus close-ups (S9-S11) and the trio (S12) stay pinned to
   their exact matching lines so the voice never contradicts the screen.
   LABEL CORRECTION (mechanical, narration wins): Claude's scenes.json
   puts CATS on the girl and POLLEN on the driver (b1-10/b1-11), CATS on
   the girl in b1-12, and PEANUTS on the girl / POLLEN on the driver in
   b1-08 — but Claude's own narration and script both say girl POLLEN,
   driver CATS. All four shots use girl POLLEN, driver CATS (bigguy
   PEANUTS throughout), so the screen matches the voice.
   Dog + pram props are not in the studio rig, so b1-04 shows the
   little kid alone in the park and b1-07 the pram woman alone on the
   street; no new character designs were invented.
   Sets: studio Bedroom/Kitchen/Park/Street/Bus + starry void (NightSky).
   grain: false. Letterbox applied in stitch.sh. No whoosh on any cut. */

const BLACK = '#0D0D12';
const WHITE = '#F6EFE3';
const GOLD = '#FFD700';
const GREEN = '#38A169';

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

const LOOKMAP: Record<string, Look> = {
  alex: ALEX, sam: SAM, harwick: HARWICK,
  grey: GREY, green: KIDGREEN, purple: PURPLE, red: REDTOP,
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
    sparkle. Modelled on the house NumberPill. No whoosh. */
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

/* S1: bedroom — hero wakes up. "You wake up, and the world has changed."
   ONE action: head lifts once, one arm rises to rub his eyes. */
export const S1: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Bedroom t={t} id="al-bed1" veil={0.3} lamp={0.5} />
    <Actor look="alex" x={840} y={681} scale={1.35} facing={1} t={t}
      keys={[
        { f: 20, p: { headTilt: -6, armR: { a: -60, b: -30 } } },
        { f: 60, p: { headTilt: 2, armR: { a: -30, b: -10 } } },
      ]} exprs={[[0, 'neutral'], [20, 'worried']]} />
  </g>
);

/* S2: dark void — hero shocked, the first label appears. "Above every
   head, a little green label." ALLERGY pops big at t=6. */
export const S2: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="al-void2" />
    <Actor look="alex" x={750} y={714} scale={1.11} facing={1} t={t}
      keys={[{ f: 15, p: { headTilt: -4 } }]} exprs={[[0, 'shock']]} />
    <LabelStamp x={750} y={pillY(714, 1.11, 1.6)} text="ALLERGY" t={t} from={6} s={1.6} />
  </g>
);

/* S3: kitchen — mum making breakfast, hero small at right. "Everyone's
   biggest allergy..." PEANUTS pops over mum at t=6. Flash cut (~20f). */
export const S3: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Kitchen t={t} id="al-kit3" veil={0.3} />
    <Actor look="purple" x={720} y={681} scale={1.35} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={720} y={pillY(681, 1.35, 1)} text="PEANUTS" t={t} from={6} s={1} />
    <Actor look="alex" x={1200} y={551} scale={0.675} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
  </g>
);

/* S4: park — little kid chasing (no dog in the rig). POLLEN pops at t=4.
   Flash cut (~19f). */
export const S4: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Park t={t} />
    <Actor look="green" x={750} y={593} scale={0.6} facing={1} t={t}
      keys={[{ f: 8, p: { legL: { a: 22, b: -10 }, legR: { a: -20, b: -8 }, armR: { a: 40, b: -10 } } }]} exprs={[[0, 'happy']]} />
    <LabelStamp x={750} y={pillY(593, 0.6, 0.9)} text="POLLEN" t={t} from={4} s={0.9} />
  </g>
);

/* S5: dark void — hero blinks, face swaps shocked -> neutral. The labels
   don't go away. Flash cut (~20f). */
export const S5: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.1)}>
    <Void t={t} id="al-void5" />
    <Actor look="alex" x={810} y={507} scale={0.87} facing={1} t={t}
      keys={[{ f: 10, p: { headTilt: -4, armR: { a: -70, b: -20 } } }]}
      exprs={[[0, 'neutral'], [8, 'shock'], [16, 'neutral']]} />
  </g>
);

/* S6: street — old man, hero small at right. CATS pops at t=4.
   Flash cut (~19f). */
export const S6: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="grey" x={780} y={681} scale={1.35} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={780} y={pillY(681, 1.35, 1)} text="CATS" t={t} from={4} s={1} />
    <Actor look="alex" x={1230} y={551} scale={0.675} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
  </g>
);

/* S7: street — woman with the pram (no pram in the rig). POLLEN pops
   at t=3. Flash cut (~20f). */
export const S7: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="purple" x={780} y={681} scale={1.35} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={780} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={3} s={1} />
  </g>
);

/* S8: street — hero left, girl + driver right. Labels corrected to the
   narration: girl POLLEN, driver CATS (scenes.json had them swapped the
   other way). Pops at t=2 and t=10. Flash cut (~19f). */
export const S8: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Street t={t} />
    <Actor look="alex" x={300} y={681} scale={1.35} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <Actor look="sam" x={1350} y={573} scale={0.516} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1350} y={pillY(573, 0.516, 0.8)} text="POLLEN" t={t} from={2} s={0.8} />
    <Actor look="harwick" x={1620} y={573} scale={0.516} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={1620} y={pillY(573, 0.516, 0.8)} text="CATS" t={t} from={10} s={0.8} />
  </g>
);

/* S9: bus — the big guy. "On the bus, the big guy's label says PEANUTS."
   PEANUTS pops at t=48, right after "says". */
export const S9: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="al-bus9" veil={0.4} />
    <Actor look="red" x={810} y={636} scale={1.35} facing={1} t={t}
      keys={[{ f: 30, p: { headTilt: -3 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={810} y={pillY(636, 1.35, 1)} text="PEANUTS" t={t} from={48} s={1} />
  </g>
);

/* S10: bus — the girl by the window. "The girl by the window: POLLEN."
   POLLEN pops at t=44, on the word POLLEN. (Narration label; scenes.json
   wrongly had CATS here.) */
export const S10: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="al-bus10" veil={0.4} />
    <Actor look="sam" x={810} y={636} scale={1.35} facing={1} t={t}
      keys={[{ f: 30, p: { headTilt: 4 } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={810} y={pillY(636, 1.35, 1)} text="POLLEN" t={t} from={44} s={1} />
  </g>
);

/* S11: bus — the driver. "Even the driver: CATS." CATS pops at t=37, on
   the word CATS. (Narration label; scenes.json wrongly had POLLEN here.)
   Holds through "The labels never lie." */
export const S11: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Bus t={t} id="al-bus11" veil={0.4} />
    <Actor look="harwick" x={810} y={636} scale={1.35} facing={1} t={t}
      keys={[{ f: 40, p: { headTilt: -3, armR: { a: 30, b: -10 } } }]} exprs={[[0, 'neutral']]} />
    <LabelStamp x={810} y={pillY(636, 1.35, 1)} text="CATS" t={t} from={37} s={1} />
  </g>
);

/* S12: bus trio — hero centre, big guy left, girl right. "They don't
   change. And nobody else can see them. Only you." Labels corrected:
   bigguy PEANUTS, girl POLLEN (scenes.json had CATS over the girl).
   Pops at t=6 and t=15. THE one slow push-in (0.95 -> 1.02). */
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const s = 0.95 * (1.0 + 0.07 * clamp(t / Math.max(1, len)));
  return (
    <g transform={camT(960, 540, s)}>
      <Bus t={t} id="al-bus12" veil={0.4} />
      <Actor look="red" x={270} y={533} scale={0.6} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={270} y={pillY(533, 0.6, 0.9)} text="PEANUTS" t={t} from={6} s={0.9} />
      <Actor look="alex" x={810} y={636} scale={1.35} facing={1} t={t}
        keys={[{ f: 40, p: { headTilt: -4 } }, { f: 90, p: { headTilt: 3 } }]} exprs={[[0, 'neutral'], [40, 'worried']]} />
      <Actor look="sam" x={1380} y={533} scale={0.6} facing={-1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={1380} y={pillY(533, 0.6, 0.9)} text="POLLEN" t={t} from={15} s={0.9} />
    </g>
  );
};

/* S13: title card 1 on the void — the question. "What if you could read
   anyone's allergies? Not just the big ones." Lines reveal in sequence. */
export const S13: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="al-void13" />
    <GoldLine x={960} y={400} text="WHAT IF YOU COULD" t={t} from={15} size={92} />
    <GoldLine x={960} y={520} text="READ ANYONE'S" t={t} from={45} size={92} />
    <GoldLine x={960} y={640} text="ALLERGIES?" t={t} from={70} size={110} />
    <GoldLine x={960} y={760} text="NOT JUST THE BIG ONES." t={t} from={95} size={44} color={WHITE} />
  </g>
);

/* S14: title card 2 on the void — "Not just the obvious ones. Every
   single one." The three labels pop in a row as the voice lists them. */
export const S14: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="al-void14" />
    <GoldLine x={960} y={340} text="NOT JUST THE OBVIOUS ONES." t={t} from={10} size={56} color={WHITE} />
    <GoldLine x={960} y={440} text="EVERY SINGLE ONE." t={t} from={45} size={72} />
    <LabelStamp x={480} y={640} text="PEANUTS" t={t} from={20} s={1.1} />
    <LabelStamp x={960} y={640} text="POLLEN" t={t} from={50} s={1.1} />
    <LabelStamp x={1440} y={640} text="CATS" t={t} from={80} s={1.1} />
  </g>
);

/* S15: title card 3 on the void — "All day, every day. Labels above
   every head." */
export const S15: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="al-void15" />
    <GoldLine x={960} y={430} text="ALL DAY, EVERY DAY." t={t} from={10} size={84} />
    <GoldLine x={960} y={560} text="LABELS ABOVE" t={t} from={55} size={84} />
    <GoldLine x={960} y={680} text="EVERY HEAD." t={t} from={80} size={84} />
  </g>
);

/* S16: title card 4 on the void — "Sounds like a superpower, right?" */
export const S16: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="al-void16" />
    <GoldLine x={960} y={480} text="SOUNDS LIKE A" t={t} from={8} size={84} color={WHITE} />
    <GoldLine x={960} y={600} text="SUPERPOWER, RIGHT?" t={t} from={28} size={84} />
  </g>
);

/* S17: end card on the void — "Stick around, because by the end of this,
   it won't feel like one." Lines reveal, then hold to the end. */
export const S17: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Void t={t} id="al-void17" />
    <GoldLine x={960} y={420} text="STICK AROUND," t={t} from={10} size={84} />
    <GoldLine x={960} y={540} text="BECAUSE BY THE END OF THIS," t={t} from={50} size={56} color={WHITE} />
    <GoldLine x={960} y={660} text="IT WON'T FEEL LIKE ONE." t={t} from={95} size={64} />
  </g>
);
