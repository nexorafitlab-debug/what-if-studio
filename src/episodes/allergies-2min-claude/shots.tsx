import React from 'react';
import {
  Hero, HeroRig, walkCyclePose, poseAt, faceAt, clamp, backOut, FONT, Look, Expr,
  camT, ShotProps, Sparkle, NightSky, Stars, Moon,
  Bedroom, Street, Park, Kitchen, LivingRoom, Hallway, Library, Cafe, Classroom, Study,
} from '../../engine';

/* Allergies2minClaude — 'What If You Could Read Anyone's Allergies?'
   (2-minute sample, 37 shots s1-01..s1-37, 329 words). FRESH sample built
   ONLY from Claude's delivery (allergies-2min-claude-narration.txt +
   allergies-2min-claude-scenes.json). No old video reused.
   LOOK (approved 40s sample, copied exactly): solid BLACK round heads
   (skin '#0D0D12', white face), thin stick limbs, flat coloured tops;
   hero ALEX in blue hoodie '#2E6FF0'. NOT pale heads / orange hoodie.
   LABELS: Claude's "label" field as a green pill above the character's
   head (LabelStamp pattern + pillY from allergies-first-2min). Multi-label
   shots show one pill per character, in narration order. HERO NEVER HAS
   A LABEL — verified per shot below; pills are kept clear of the hero's
   head in every shot, including the floating-label shots.
   PROGRESSION DEVICE (Claude specified none — mechanical): "LABELS SEEN n"
   pill, top-left, same pill in every shot; n = distinct allergy labels
   first revealed up to the current shot (POLLEN/CATS/PEANUTS first appear
   in s1-03 -> 3; dust first appears in s1-06 -> 4; 0 before s1-03).
   MOTION: every shot's motion comes from its "motion" field. Walk/entry/
   exit/travel shots use walkCyclePose (foot-locked walk) or HeroRig 'walk'
   — the walk exemption to the MONOTONIC rule; all other gestures are
   monotonic (one pose, hold). Named gestures use HERO_POSES via HeroRig
   (point, think, look-up, worried). Face swaps on cuts (faceAt). NO fully
   static characters: every shot has >=1 body action or face swap.
   CAMERA: static inside every shot EXCEPT s1-13 (slow pan to the peanut,
   then the dust mote) and s1-36 (slow pull-back). Hard cuts only.
   No whoosh. grain: false. Letterbox applied in stitch.sh.
   DEVIATIONS (all presentational, no story change):
   - "dust" is rendered "DUST" on the pill: the house pill is white bold
     caps, and every other label is caps.
   - s1-08/s1-09/s1-10 name no specific allergy word; the generic label
     there reads "ALLERGY", exactly as the approved 40s S2 did.
   - s1-11's trigger icons drift toward three small repeat labels
     (PEANUTS/POLLEN/CATS); its label field is empty.
   - s1-13/s1-20 peanut is a small brown ellipse on the counter (no peanut
     prop in the rig); s1-27's office cat is off-frame right (no cat prop).
   - s1-34's DUST pill floats above the bookstacks (the dust itself is the
     subject; no character owns it in Claude's visual).
   - s1-20/s1-24/s1-25 walks are straight-line walkCyclePose; the rig has
     no curved path, so "reaches out"/"steps around"/"weaves" read as the
     walk toward/past the trigger. */

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
    holds. Never alternate an angle, so no limb ever loops. Walks are
    EXEMPT: they go through walkCyclePose, not keys. */
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

/** Hip x/y of a walkCyclePose walker, so a label can ride above the
    walking character's head. Mirrors walkCyclePose's own math exactly
    (speed = stride/stepDuration; hip bob 3*cos(2*pi*phase)). */
const walkHipX = (t: number, x0: number, stride: number, sd: number, facing: 1 | -1) =>
  x0 + (stride / sd) * t * facing;
const walkHipY = (t: number, groundY: number, scale: number, sd: number) =>
  groundY - 132 * scale + 3 * Math.cos((2 * Math.PI * t) / sd);

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

/** Persistent progression device: "LABELS SEEN n" pill, top-left corner.
    Rendered OUTSIDE the camera group so it stays put on the pan (S13)
    and the pull-back (S36). n is the per-shot distinct-label count. */
const LabelsSeen: React.FC<{ n: number }> = ({ n }) => {
  const text = `LABELS SEEN ${n}`;
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

/** Starry void background shared by the dark + title shots. */
const Void: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <NightSky id={id} horizonY={1080} />
    <Stars seed={113} x0={0} y0={0} w={1920} h={1080} t={t} n={60} o={0.8} />
    <Moon x={1700} y={180} r={54} />
  </g>
);

/** Growing hum waveform: a gold line whose amplitude rises with t. */
const wavePts = (t: number, amp: number, y0: number) => {
  const pts: string[] = [];
  for (let x = 0; x <= 1920; x += 48) pts.push(`${x},${(y0 + amp * Math.sin(x / 90 + t / 4)).toFixed(1)}`);
  return pts.join(' ');
};

/* S1 s1-01: bedroom — hero stirs in bed, morning light through the
   curtains. "You stir awake and the room snaps into sharper focus."
   ONE action: sits up slowly, rubs eyes, looks around. No labels yet. */
export const S1: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Bedroom t={t} id="al2-bed1" veil={0.3} lamp={0.5} />
      <Actor look="alex" x={840} y={681} scale={1.35} facing={1} t={t}
        keys={[
          { f: 20, p: { headTilt: -6, armR: { a: -60, b: -30 } } },
          { f: 60, p: { headTilt: 2, armR: { a: -30, b: -10 } } },
        ]} exprs={[[0, 'neutral'], [20, 'worried']]} />
    </g>
    <LabelsSeen n={0} />
  </>
);

/* S2 s1-02: bedroom — hero lifts his head, gaze sweeping across the
   room. "Above each person's head a small label floats —" Labels
   briefly materialize (next shot); here the gaze sweep is the action. */
export const S2: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Bedroom t={t} id="al2-bed2" veil={0.3} lamp={0.5} />
      <Actor look="alex" x={960} y={681} scale={1.35} facing={1} t={t}
        keys={[
          { f: 15, p: { headTilt: -8 } },
          { f: 50, p: { headTilt: 6 } },
        ]} exprs={[[0, 'neutral'], [15, 'shock']]} />
    </g>
    <LabelsSeen n={0} />
  </>
);

/* S3 s1-03: street close-up — one label reads POLLEN, another CATS,
   another PEANUTS, each a single word hovering above a head. "a single
   word naming what sets off their allergies." Labels pop one by one
   (pop-blop). First appearance of all three: LABELS SEEN 3. */
export const S3: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Street t={t} />
      <Actor look="sam" x={480} y={636} scale={1.1} facing={1} t={t}
        keys={[{ f: 12, p: { headTilt: -4 } }]} exprs={[[0, 'happy']]} />
      <LabelStamp x={480} y={pillY(636, 1.1, 1)} text="POLLEN" t={t} from={4} s={1} />
      <Actor look="harwick" x={960} y={636} scale={1.1} facing={-1} t={t}
        keys={[{ f: 20, p: { headTilt: 3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={960} y={pillY(636, 1.1, 1)} text="CATS" t={t} from={18} s={1} />
      <Actor look="red" x={1440} y={636} scale={1.1} facing={1} t={t}
        keys={[{ f: 28, p: { headTilt: -3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={1440} y={pillY(636, 1.1, 1)} text="PEANUTS" t={t} from={32} s={1} />
    </g>
    <LabelsSeen n={3} />
  </>
);

/* S4 s1-04: bedroom window — hero glances toward the window, a girl in
   a yellow dress with POLLEN floating above her head. "You notice a
   girl with POLLEN tagged above her," POLLEN pops (pop-blop). */
export const S4: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Bedroom t={t} id="al2-bed4" veil={0.3} lamp={0.5} />
      <Actor look="alex" x={300} y={551} scale={0.675} facing={1} t={t}
        keys={[
          { f: 15, p: { headTilt: -5 } },
          { f: 45, p: { headTilt: 2 } },
        ]} exprs={[[0, 'neutral'], [15, 'worried']]} />
      <Actor look="sam" x={1150} y={681} scale={1.35} facing={-1} t={t}
        keys={[{ f: 20, p: { headTilt: 4 } }]} exprs={[[0, 'happy']]} />
      <LabelStamp x={1150} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={6} s={1} />
    </g>
    <LabelsSeen n={3} />
  </>
);

/* S5 s1-05: street through the window — the bus driver tagged CATS and
   a construction worker below tagged PEANUTS. "the bus driver with
   CATS, a construction worker with PEANUTS," Hero's gaze shifts from
   driver down to worker; labels pop in order (pop-blop). */
export const S5: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Street t={t} />
      <Actor look="alex" x={280} y={551} scale={0.675} facing={1} t={t}
        keys={[
          { f: 12, p: { headTilt: -5 } },
          { f: 45, p: { headTilt: 6 } },
        ]} exprs={[[0, 'neutral']]} />
      <Actor look="harwick" x={850} y={681} scale={1.35} facing={1} t={t}
        keys={[{ f: 15, p: { headTilt: -3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={850} y={pillY(681, 1.35, 1)} text="CATS" t={t} from={4} s={1} />
      <Actor look="red" x={1450} y={681} scale={1.35} facing={-1} t={t}
        keys={[{ f: 30, p: { headTilt: 3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={1450} y={pillY(681, 1.35, 1)} text="PEANUTS" t={t} from={18} s={1} />
    </g>
    <LabelsSeen n={3} />
  </>
);

/* S6 s1-06: street — a jogger passing below tagged POLLEN, a mother on
   the sidewalk tagged dust. "a jogger with POLLEN, a mother with dust."
   The jogger WALKS (walkCyclePose, left to right) with his POLLEN label
   riding above his head; hero tracks him, then shifts to the mother.
   dust first appears here: LABELS SEEN 4. (pop-blop) */
export const S6: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Street t={t} />
      <Actor look="alex" x={220} y={551} scale={0.675} facing={1} t={t}
        keys={[
          { f: 12, p: { headTilt: -6 } },
          { f: 55, p: { headTilt: 5 } },
        ]} exprs={[[0, 'neutral']]} />
      <Hero pose={walkCyclePose(t, { x0: 420, groundY: 860, scale: 1.2, facing: 1, stride: 70, stepDuration: 13 })} look={KIDGREEN} />
      <LabelStamp x={walkHipX(t, 420, 70, 13, 1)} y={pillY(walkHipY(t, 860, 1.2, 13), 1.2, 0.9)} text="POLLEN" t={t} from={6} s={0.9} />
      <Actor look="purple" x={1500} y={681} scale={1.35} facing={-1} t={t}
        keys={[{ f: 50, p: { headTilt: -3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={1500} y={pillY(681, 1.35, 1)} text="DUST" t={t} from={40} s={1} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S7 s1-07: bedroom — hero touches the space above their own head, no
   label present, just empty air. "You carry no label at all — just
   empty space above your own head." The dashed ring marks the empty
   space; NO label anywhere in frame. */
export const S7: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 1.0)}>
      <Bedroom t={t} id="al2-bed7" veil={0.3} lamp={0.5} />
      <Actor look="alex" x={960} y={681} scale={1.35} facing={1} t={t}
        keys={[{ f: 18, p: { headTilt: -8, armR: { a: -110, b: -60 } } }]} exprs={[[0, 'neutral'], [18, 'worried']]} />
      <circle cx={960} cy={pillY(681, 1.35, 1)} r={34} fill="none" stroke={WHITE} strokeWidth={3}
        strokeDasharray="8 8" opacity={0.35 + 0.15 * Math.sin(t / 8)} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S8 s1-08: void diagram — a simple rule icon, then a person appearing
   and a label fading in above their head. "The labels work on a simple
   rule: they appear the moment you notice a person" The person WALKS
   IN (walkCyclePose) and the generic ALLERGY label pops above his head
   (no specific allergy word in this shot's visual). */
export const S8: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 1.0)}>
      <Void t={t} id="al2-void8" />
      <GoldLine x={960} y={180} text="THE RULE" t={t} from={4} size={56} color={WHITE} />
      <Hero pose={walkCyclePose(t, { x0: 350, groundY: 860, scale: 1.35, facing: 1, stride: 64, stepDuration: 15 })} look={GREY} />
      <LabelStamp x={walkHipX(t, 350, 64, 15, 1)} y={pillY(walkHipY(t, 860, 1.35, 15), 1.35, 1)} text="ALLERGY" t={t} from={30} s={1} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S9 s1-09: street — hero watches a labeled person, the label staying
   fixed; hero looks away and the label dissolves. "and hold steady
   while you look, then fade when you look away." The ALLERGY label
   holds until t=50, then dissolves over ~22 frames. */
export const S9: React.FC<ShotProps> = ({ t }) => {
  const fade = t < 50 ? 1 : clamp((72 - t) / 22);
  return (
    <>
      <g transform={camT(960, 540, 0.95)}>
        <Street t={t} />
        <Actor look="alex" x={520} y={681} scale={1.35} facing={1} t={t}
          keys={[{ f: 50, p: { headTilt: 8 } }]} exprs={[[0, 'neutral'], [50, 'worried']]} />
        <Actor look="grey" x={1300} y={681} scale={1.35} facing={-1} t={t}
          keys={[{ f: 15, p: { headTilt: -3 } }]} exprs={[[0, 'neutral']]} />
        <g opacity={fade}>
          <LabelStamp x={1300} y={pillY(681, 1.35, 1)} text="ALLERGY" t={t} from={2} s={1} />
        </g>
      </g>
      <LabelsSeen n={4} />
    </>
  );
};

/* S10 s1-10: void — side-by-side: a labeled person and an unlabeled
   person, emphasis on the distinction. "The label does not tell you how
   a person feels —" Hero looks between the two, comparing expressions.
   Only the left figure carries the generic ALLERGY label. */
export const S10: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 1.0)}>
      <Void t={t} id="al2-void10" />
      <Actor look="grey" x={600} y={681} scale={1.35} facing={1} t={t}
        keys={[{ f: 15, p: { headTilt: -3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={600} y={pillY(681, 1.35, 1)} text="ALLERGY" t={t} from={6} s={1} />
      <Actor look="purple" x={1350} y={681} scale={1.35} facing={-1} t={t}
        keys={[{ f: 20, p: { headTilt: 3 } }]} exprs={[[0, 'neutral']]} />
      <Actor look="alex" x={960} y={551} scale={0.675} facing={1} t={t}
        keys={[
          { f: 12, p: { headTilt: -6 } },
          { f: 45, p: { headTilt: 6 } },
        ]} exprs={[[0, 'neutral']]} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S11 s1-11: void — a small icon of a trigger symbol (pollen grain,
   peanut, cat hair, dust mote) connects to the label. "it only marks
   what triggers a reaction." Three trigger dots drift in and lock onto
   three small repeat labels (PEANUTS/POLLEN/CATS). */
export const S11: React.FC<ShotProps> = ({ t }) => {
  const driftX = (from: number, x0: number, x1: number) => x0 + (x1 - x0) * clamp((t - from) / 40);
  const driftY = (from: number, y0: number, y1: number) => y0 + (y1 - y0) * clamp((t - from) / 40);
  return (
    <>
      <g transform={camT(960, 540, 1.0)}>
        <Void t={t} id="al2-void11" />
        <circle cx={driftX(0, 280, 468)} cy={driftY(0, 700, 606)} r={10} fill={GOLD} opacity={0.9} />
        <circle cx={driftX(14, 760, 948)} cy={driftY(14, 720, 606)} r={10} fill={GOLD} opacity={0.9} />
        <circle cx={driftX(28, 1240, 1428)} cy={driftY(28, 700, 606)} r={10} fill={GOLD} opacity={0.9} />
        <LabelStamp x={480} y={520} text="PEANUTS" t={t} from={6} s={0.9} />
        <LabelStamp x={960} y={520} text="POLLEN" t={t} from={20} s={0.9} />
        <LabelStamp x={1440} y={520} text="CATS" t={t} from={34} s={0.9} />
      </g>
      <LabelsSeen n={4} />
    </>
  );
};

/* S12 s1-12: park — POLLEN drifts in a sunbeam, CATS settles on a
   chair. "A POLLEN cloud, a CATS whisker," The jogger's POLLEN pops,
   then the seated figure's CATS (pop-blop); pollen motes drift in the
   light. Hero small at left, watching. */
export const S12: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Park t={t} />
      <Actor look="alex" x={280} y={551} scale={0.675} facing={1} t={t}
        keys={[{ f: 15, p: { headTilt: -5 } }]} exprs={[[0, 'neutral']]} />
      <Actor look="green" x={800} y={681} scale={1.35} facing={1} t={t}
        keys={[{ f: 10, p: { legL: { a: 28, b: -12 }, legR: { a: -24, b: -10 }, armR: { a: 40, b: -20 } } }]}
        exprs={[[0, 'happy']]} />
      <LabelStamp x={800} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={6} s={1} />
      <Actor look="grey" x={1400} y={681} scale={1.35} facing={-1} t={t}
        keys={[{ f: 25, p: { headTilt: 3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={1400} y={pillY(681, 1.35, 1)} text="CATS" t={t} from={20} s={1} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={700 + i * 60 + t * 0.5} cy={300 + i * 30 + 10 * Math.sin(t / 9 + i)} r={5} fill={WHITE} opacity={0.5} />
      ))}
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S13 s1-13: kitchen — a single PEANUT visible on a surface, a dust
   mote dancing in light. "a PEANUTS crumb, a dust mote —" THE FIRST
   CAMERA MOVE: a slow pan right, from the peanut on the counter to the
   dust motes in the sunbeam. Labels pop as the pan reaches them
   (pop-blop). */
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len));
  const cx = 650 + 650 * k;
  return (
    <>
      <g transform={camT(cx, 540, 1.0)}>
        <Kitchen t={t} id="al2-kit13" veil={0.3} />
        <Actor look="alex" x={420} y={681} scale={1.35} facing={1} t={t}
          keys={[{ f: 15, p: { headTilt: -4 } }]} exprs={[[0, 'neutral']]} />
        <ellipse cx={1250} cy={640} rx={26} ry={16} fill="#A0662C" />
        <LabelStamp x={1250} y={560} text="PEANUTS" t={t} from={10} s={0.8} />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={1520 + i * 34 + 6 * Math.sin(t / 12 + i)} cy={470 + i * 26} r={5} fill={WHITE} opacity={0.55} />
        ))}
        <LabelStamp x={1560} y={400} text="DUST" t={t} from={40} s={0.8} />
      </g>
      <LabelsSeen n={4} />
    </>
  );
};

/* S14 s1-14: living room — labels remain neutral, unobtrusive: no
   scoring, no ranking, just identification. "each is a quiet
   identifier, not a judgment." Three repeat labels, already there,
   pulsing gently (LabelStamp breathes). */
export const S14: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <LivingRoom t={t} id="al2-liv14" veil={0.3} />
      <Actor look="grey" x={480} y={636} scale={1.1} facing={1} t={t}
        keys={[{ f: 15, p: { headTilt: -3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={480} y={pillY(636, 1.1, 0.9)} text="PEANUTS" t={t} from={-30} s={0.9} />
      <Actor look="purple" x={960} y={636} scale={1.1} facing={-1} t={t}
        keys={[{ f: 20, p: { headTilt: 3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={960} y={pillY(636, 1.1, 0.9)} text="POLLEN" t={t} from={-30} s={0.9} />
      <Actor look="red" x={1440} y={636} scale={1.1} facing={1} t={t}
        keys={[{ f: 25, p: { headTilt: -3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={1440} y={pillY(636, 1.1, 0.9)} text="CATS" t={t} from={-30} s={0.9} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S15 s1-15: bedroom — hero looks overwhelmed, the room full of labels,
   a visual representation of mounting pressure. "Seeing comes with a
   cost. Each label adds a faint pressure," HeroRig 'worried' (face
   swaps neutral -> worried at 18); three small repeat labels crowd the
   frame edges, clear of the hero's head. */
export const S15: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 1.0)}>
      <Bedroom t={t} id="al2-bed15" veil={0.3} lamp={0.5} />
      <HeroRig frame={t} pose="worried" look={ALEX} x={960} y={681} scale={1.35} facing={1}
        face={[[0, 'neutral'], [18, 'worried']]} />
      <LabelStamp x={420} y={300} text="POLLEN" t={t} from={-30} s={0.7} />
      <LabelStamp x={1500} y={300} text="CATS" t={t} from={-30} s={0.7} />
      <LabelStamp x={1500} y={560} text="PEANUTS" t={t} from={-30} s={0.7} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S16 s1-16: void — thought bubble above hero's head with faint whisper
   lines, representing the internal cost. "a soft whisper in your
   thoughts." Whisper lines spiral outward: three wavy lines pulsing
   inside the bubble. */
export const S16: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 1.0)}>
      <Void t={t} id="al2-void16" />
      <Actor look="alex" x={960} y={700} scale={1.5} facing={1} t={t}
        keys={[{ f: 15, p: { headTilt: -4 } }]} exprs={[[0, 'neutral'], [15, 'worried']]} />
      <circle cx={960} cy={215} r={52} fill={WHITE} opacity={0.92} />
      <circle cx={905} cy={300} r={16} fill={WHITE} opacity={0.9} />
      <circle cx={880} cy={335} r={9} fill={WHITE} opacity={0.9} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${908 + i * 34} ${205 + i * 22} q 14 -14 28 0 q 14 14 28 0`} fill="none"
          stroke={BLACK} strokeWidth={4} strokeLinecap="round" opacity={0.35 + 0.3 * Math.sin(t / 6 + i * 2)} />
      ))}
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S17 s1-17: street — as hero reads more labels, the hum grows
   visually: a waveform growing louder. "The more you read, the louder
   the hum grows." Hero's eyes scan rapidly across labels (head sweep +
   face swaps); the gold waveform's amplitude rises with t. */
export const S17: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Street t={t} />
      <Actor look="grey" x={420} y={573} scale={0.516} facing={1} t={t}
        keys={[{ f: 15, p: { headTilt: -3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={420} y={pillY(573, 0.516, 0.8)} text="POLLEN" t={t} from={-30} s={0.8} />
      <Actor look="purple" x={1500} y={573} scale={0.516} facing={-1} t={t}
        keys={[{ f: 20, p: { headTilt: 3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={1500} y={pillY(573, 0.516, 0.8)} text="CATS" t={t} from={-30} s={0.8} />
      <Actor look="alex" x={960} y={681} scale={1.35} facing={1} t={t}
        keys={[
          { f: 12, p: { headTilt: -8 } },
          { f: 45, p: { headTilt: 8 } },
        ]} exprs={[[0, 'neutral'], [12, 'shock'], [45, 'worried']]} />
      <polyline points={wavePts(t, 8 + t * 0.5, 980)} fill="none" stroke={GOLD} strokeWidth={4} opacity={0.7} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S18 s1-18: park — hero gazes upward, tracking POLLEN particles in the
   air around them. "You find yourself noticing the POLLEN drifting in
   the air," HeroRig 'look-up' (face swaps to shock at 15); the jogger
   WALKS past with his POLLEN label riding above his head (pop-blop). */
export const S18: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Park t={t} />
      <HeroRig frame={t} pose="look-up" look={ALEX} x={650} y={681} scale={1.35} facing={1}
        face={[[0, 'neutral'], [15, 'shock']]} />
      <Hero pose={walkCyclePose(t, { x0: 1050, groundY: 860, scale: 1.1, facing: 1, stride: 64, stepDuration: 14 })} look={KIDGREEN} />
      <LabelStamp x={walkHipX(t, 1050, 64, 14, 1)} y={pillY(walkHipY(t, 860, 1.1, 14), 1.1, 0.9)} text="POLLEN" t={t} from={8} s={0.9} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S19 s1-19: living room — the CATS label lingers on a chair, the cat
   settled comfortably. "the CATS settled on the chair," Hero's gaze
   drops to the chair; the CATS label holds steady (pop-blop). */
export const S19: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <LivingRoom t={t} id="al2-liv19" veil={0.3} />
      <Actor look="alex" x={500} y={681} scale={1.35} facing={1} t={t}
        keys={[{ f: 15, p: { headTilt: 8 } }]} exprs={[[0, 'neutral'], [15, 'worried']]} />
      <Actor look="grey" x={1250} y={681} scale={1.35} facing={-1} t={t}
        keys={[{ f: 20, p: { headTilt: -3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={1250} y={pillY(681, 1.35, 1)} text="CATS" t={t} from={6} s={1} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S20 s1-20: kitchen — a peanut left on a counter, the label still
   visible. "the PEANUTS left on the counter," Hero WALKS toward the
   counter (walkCyclePose); the PEANUTS label pops above the peanut as
   he nears it (pop-blop). */
export const S20: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 1.0)}>
      <Kitchen t={t} id="al2-kit20" veil={0.3} />
      <Hero pose={{ ...walkCyclePose(t, { x0: 300, groundY: 860, scale: 1.35, facing: 1, stride: 64, stepDuration: 14 }), ...faceAt(t, [[0, 'worried']]) }} look={ALEX} />
      <ellipse cx={800} cy={640} rx={26} ry={16} fill="#A0662C" />
      <LabelStamp x={800} y={560} text="PEANUTS" t={t} from={45} s={0.8} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S21 s1-21: hallway — dust motes accumulating in corners of the room.
   "the dust settling in corners." Hero WALKS to the corner
   (walkCyclePose); dust motes catch the light as they settle and the
   DUST label pops above them (pop-blop). */
export const S21: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Hallway t={t} />
      <Hero pose={walkCyclePose(t, { x0: 300, groundY: 860, scale: 1.35, facing: 1, stride: 64, stepDuration: 15 })} look={ALEX} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={1350 + i * 30 + 5 * Math.sin(t / 10 + i)} cy={520 + i * 36} r={5} fill={WHITE} opacity={0.5} />
      ))}
      <LabelStamp x={1420} y={430} text="DUST" t={t} from={50} s={0.9} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S22 s1-22: living room — the room is now filled with a grid of
   labels, a visual map of hidden triggers everywhere. "The world feels
   less open, more mapped with hidden prompts." Six repeat labels in a
   grid, already there; hero stands in the center turning slowly. All
   pills are placed clear of the hero's head (x and y). */
export const S22: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <LivingRoom t={t} id="al2-liv22" veil={0.3} />
      <LabelStamp x={350} y={300} text="PEANUTS" t={t} from={-30} s={0.7} />
      <LabelStamp x={700} y={230} text="POLLEN" t={t} from={-30} s={0.7} />
      <LabelStamp x={1200} y={230} text="CATS" t={t} from={-30} s={0.7} />
      <LabelStamp x={1550} y={300} text="DUST" t={t} from={-30} s={0.7} />
      <LabelStamp x={1550} y={560} text="PEANUTS" t={t} from={-30} s={0.7} />
      <LabelStamp x={380} y={560} text="POLLEN" t={t} from={-30} s={0.7} />
      <Actor look="alex" x={960} y={681} scale={1.35} facing={1} t={t}
        keys={[
          { f: 20, p: { headTilt: -8 } },
          { f: 55, p: { headTilt: 8 } },
        ]} exprs={[[0, 'neutral'], [20, 'worried']]} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S23 s1-23: study — hero pausing, thoughtful, the weight of the
   knowledge settling in. "And yet you find yourself wondering. If you
   know what triggers someone," HeroRig 'think' (finger to chin, face
   swaps neutral -> worried at 20). (ding) */
export const S23: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 1.0)}>
      <Study t={t} id="al2-off23" veil={0.3} />
      <HeroRig frame={t} pose="think" look={ALEX} x={960} y={681} scale={1.35} facing={1}
        face={[[0, 'neutral'], [20, 'worried']]} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S24 s1-24: street — two scenarios: hero choosing a different path,
   avoiding a trigger; hero approaching someone cautiously. "can you
   protect them? Can you make different choices?" Hero WALKS
   (walkCyclePose) toward the person standing ahead, worried. (ding) */
export const S24: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Street t={t} />
      <Hero pose={{ ...walkCyclePose(t, { x0: 250, groundY: 860, scale: 1.35, facing: 1, stride: 90, stepDuration: 12 }), ...faceAt(t, [[0, 'worried']]) }} look={ALEX} />
      <Actor look="grey" x={1050} y={636} scale={1.1} facing={-1} t={t}
        keys={[{ f: 20, p: { headTilt: -3 } }]} exprs={[[0, 'neutral']]} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S25 s1-25: park — hero moving through a space, the labels shifting
   and influencing direction, the room reoriented around triggers. "The
   tags are small, but they reshape how you move through any room."
   Hero WALKS (walkCyclePose) past two clusters of repeat labels, kept
   high (y=280) so none sits above the hero's head as he passes. */
export const S25: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Park t={t} />
      <LabelStamp x={700} y={280} text="PEANUTS" t={t} from={-30} s={0.7} />
      <LabelStamp x={850} y={280} text="POLLEN" t={t} from={-30} s={0.7} />
      <LabelStamp x={1300} y={280} text="CATS" t={t} from={-30} s={0.7} />
      <LabelStamp x={1450} y={280} text="DUST" t={t} from={-30} s={0.7} />
      <Hero pose={walkCyclePose(t, { x0: 200, groundY: 860, scale: 1.35, facing: 1, stride: 80, stepDuration: 13 })} look={ALEX} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S26 s1-26: cafe — two friends talking, one's label becoming a factor
   in their interaction, dynamics subtly changing. "You notice that
   friendships shift when you suddenly understand" Friends lean in; one
   gestures toward the other. No label in this shot (Claude's field). */
export const S26: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Cafe t={t} id="al2-cafe26" veil={0.3} />
      <Actor look="sam" x={700} y={681} scale={1.35} facing={1} t={t}
        keys={[{ f: 15, p: { headTilt: 6, armR: { a: 55, b: -15 } } }]} exprs={[[0, 'happy'], [40, 'neutral']]} />
      <Actor look="purple" x={1250} y={681} scale={1.35} facing={-1} t={t}
        keys={[{ f: 20, p: { headTilt: -6 } }]} exprs={[[0, 'neutral'], [40, 'happy']]} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S27 s1-27: study (office) — a colleague moving away from an office
   cat, the CATS label visible. "why a colleague steps away from the
   office cat," The colleague WALKS BACKWARD (walkCyclePose, facing -1)
   away from the cat off-frame right, his CATS label riding above his
   head (pop-blop). Hero small at left, watching. */
export const S27: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Study t={t} id="al2-off27" veil={0.3} />
      <Actor look="alex" x={300} y={551} scale={0.675} facing={1} t={t}
        keys={[{ f: 15, p: { headTilt: -5 } }]} exprs={[[0, 'neutral'], [15, 'worried']]} />
      <Hero pose={walkCyclePose(t, { x0: 1250, groundY: 860, scale: 1.35, facing: -1, stride: 64, stepDuration: 15 })} look={GREY} />
      <LabelStamp x={walkHipX(t, 1250, 64, 15, -1)} y={pillY(walkHipY(t, 860, 1.35, 15), 1.35, 1)} text="CATS" t={t} from={6} s={1} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S28 s1-28: cafe — a date menu with options highlighted, a peanut-free
   choice marked. "why a date chooses a peanut-free dessert," The date
   POINTS at the menu (HeroRig 'point'); her PEANUTS label pops above
   her (pop-blop); the menu card shows a green-checked option. */
export const S28: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Cafe t={t} id="al2-cafe28" veil={0.3} />
      <HeroRig frame={t} pose="point" look={PURPLE} x={800} y={681} scale={1.35} facing={1}
        face={[[0, 'neutral'], [20, 'happy']]} />
      <LabelStamp x={800} y={pillY(681, 1.35, 1)} text="PEANUTS" t={t} from={10} s={1} />
      <g transform="translate(1350 420)">
        <rect x={-130} y={-110} width={260} height={220} rx={14} fill="#F6EFE3" opacity={0.95} />
        <rect x={-100} y={-70} width={200} height={10} rx={5} fill="#121019" opacity={0.7} />
        <rect x={-100} y={-30} width={200} height={10} rx={5} fill="#121019" opacity={0.7} />
        <rect x={-100} y={10} width={140} height={10} rx={5} fill="#38A169" />
        <circle cx={95} cy={15} r={14} fill="none" stroke="#38A169" strokeWidth={5} />
        <path d="M 86 15 l 6 6 l 12 -12" fill="none" stroke="#38A169" strokeWidth={5} strokeLinecap="round" />
      </g>
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S29 s1-29: classroom — a classmate reaching for tissues, the label
   system influencing behavior. "why a classmate keeps tissues stocked."
   The classmate reaches out offering a tissue (white rect appears at
   t=30) to the friend with the POLLEN label (pop-blop). */
export const S29: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Classroom t={t} id="al2-cls29" />
      <Actor look="green" x={700} y={681} scale={1.35} facing={1} t={t}
        keys={[{ f: 15, p: { armR: { a: 55, b: -25 }, headTilt: 4 } }]} exprs={[[0, 'neutral'], [15, 'happy']]} />
      <rect x={800} y={545} width={34} height={26} rx={4} fill={WHITE} opacity={clamp((t - 30) / 6)} />
      <Actor look="sam" x={1300} y={681} scale={1.35} facing={-1} t={t}
        keys={[{ f: 30, p: { headTilt: -4, armL: { a: 30, b: -20 } } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={1300} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={10} s={1} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S30 s1-30: hallway — a series of interactions where the background
   hum is visible, coloring each exchange. "The knowledge is quiet but
   constant, a background hum that colors every interaction." Hero
   greets two people in turn (face swaps); the gold hum waveform runs
   along the bottom. */
export const S30: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Hallway t={t} />
      <Actor look="alex" x={650} y={681} scale={1.35} facing={1} t={t}
        keys={[{ f: 15, p: { headTilt: -5, armR: { a: 40, b: -15 } } }]}
        exprs={[[0, 'neutral'], [15, 'happy'], [50, 'neutral']]} />
      <Actor look="grey" x={1200} y={681} scale={1.35} facing={-1} t={t}
        keys={[{ f: 20, p: { headTilt: 4 } }]} exprs={[[0, 'happy']]} />
      <Actor look="purple" x={1600} y={636} scale={1.1} facing={-1} t={t}
        keys={[{ f: 30, p: { headTilt: -3 } }]} exprs={[[0, 'neutral']]} />
      <polyline points={wavePts(t, 14, 980)} fill="none" stroke={GOLD} strokeWidth={4} opacity={0.5} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S31 s1-31: park — hero looks twice at POLLEN drifting by, the second
   look deliberate. "You find yourself glancing twice at the POLLEN in
   the spring air," Double glance = two face swaps (shock at 15, back
   to neutral, shock again at 55); the jogger's POLLEN pops (pop-blop). */
export const S31: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Park t={t} />
      <Actor look="alex" x={600} y={681} scale={1.35} facing={1} t={t}
        keys={[
          { f: 15, p: { headTilt: -6 } },
          { f: 50, p: { headTilt: -8 } },
        ]} exprs={[[0, 'neutral'], [15, 'shock'], [40, 'neutral'], [55, 'shock']]} />
      <Actor look="green" x={1350} y={681} scale={1.35} facing={-1} t={t}
        keys={[{ f: 10, p: { legL: { a: 28, b: -12 }, legR: { a: -24, b: -10 } } }]} exprs={[[0, 'happy']]} />
      <LabelStamp x={1350} y={pillY(681, 1.35, 1)} text="POLLEN" t={t} from={8} s={1} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S32 s1-32: living room — a second look at CATS on the sofa, the label
   still present. "twice at the CATS on the sofa," Double glance (two
   face swaps); the CATS label pops (pop-blop). */
export const S32: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <LivingRoom t={t} id="al2-liv32" veil={0.3} />
      <Actor look="alex" x={500} y={681} scale={1.35} facing={1} t={t}
        keys={[
          { f: 15, p: { headTilt: -5 } },
          { f: 50, p: { headTilt: -7 } },
        ]} exprs={[[0, 'neutral'], [15, 'shock'], [40, 'neutral'], [55, 'shock']]} />
      <Actor look="grey" x={1250} y={681} scale={1.35} facing={-1} t={t}
        keys={[{ f: 20, p: { headTilt: 3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={1250} y={pillY(681, 1.35, 1)} text="CATS" t={t} from={8} s={1} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S33 s1-33: cafe — a second look at PEANUTS at a potluck spread.
   "twice at the PEANUTS at the potluck," Hero scans the table, eyes
   return to the PEANUTS dish (head sweep + face swap); the PEANUTS
   label pops above the guest at the table (pop-blop). */
export const S33: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Cafe t={t} id="al2-cafe33" veil={0.3} />
      <rect x={1050} y={760} width={500} height={26} rx={8} fill="#3A3446" />
      <circle cx={1100} cy={745} r={22} fill="#E9C46A" />
      <circle cx={1380} cy={745} r={22} fill="#A0662C" />
      <circle cx={1500} cy={745} r={22} fill="#5A7A4A" />
      <Actor look="alex" x={500} y={681} scale={1.35} facing={1} t={t}
        keys={[
          { f: 15, p: { headTilt: -6 } },
          { f: 50, p: { headTilt: 4 } },
        ]} exprs={[[0, 'neutral'], [15, 'shock'], [50, 'neutral']]} />
      <Actor look="red" x={1250} y={681} scale={1.35} facing={-1} t={t}
        keys={[{ f: 20, p: { headTilt: -3 } }]} exprs={[[0, 'neutral']]} />
      <LabelStamp x={1250} y={pillY(681, 1.35, 1)} text="PEANUTS" t={t} from={8} s={1} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S34 s1-34: library — a second look at dust in old bookstacks.
   "twice at the dust in old books —" Hero brushes a book spine, dust
   rises, he looks again at the floating motes. The DUST pill floats
   above the bookstacks (the dust is the subject; no character owns it
   here — see header). (pop-blop) */
export const S34: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 0.95)}>
      <Library t={t} id="al2-lib34" veil={0.3} />
      <Actor look="alex" x={700} y={681} scale={1.35} facing={1} t={t}
        keys={[{ f: 15, p: { armR: { a: 45, b: -25 }, headTilt: 5 } }]} exprs={[[0, 'neutral'], [15, 'worried']]} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={1250 + i * 40 + 4 * Math.sin(t / 10 + i)} cy={500 - i * 20 - Math.min(t * 0.3, 30)} r={5} fill={WHITE} opacity={0.5} />
      ))}
      <LabelStamp x={1300} y={400} text="DUST" t={t} from={10} s={0.9} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S35 s1-35: void — the world feeling more alive, more aware with each
   look. "each second look sharpens the sense" Hero close-up: eyes
   sharpen, focus intensifies with each glance (head tilts + face
   swaps neutral -> worried -> shock). */
export const S35: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 1.0)}>
      <Void t={t} id="al2-void35" />
      <Actor look="alex" x={960} y={700} scale={1.5} facing={1} t={t}
        keys={[
          { f: 20, p: { headTilt: -5 } },
          { f: 55, p: { headTilt: -7 } },
        ]} exprs={[[0, 'neutral'], [20, 'worried'], [55, 'shock']]} />
    </g>
    <LabelsSeen n={4} />
  </>
);

/* S36 s1-36: living room — the full room of labels, the sense that
   everything has a hidden trigger beneath the surface. "that the world
   is alive with hidden triggers." THE SECOND CAMERA MOVE: a slow
   pull-back (1.08 -> 0.89) as the room full of labels pulses. All five
   pills are placed clear of the hero's head. */
export const S36: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.08 * (1.0 - 0.18 * clamp(t / Math.max(1, len)));
  return (
    <>
      <g transform={camT(960, 540, s)}>
        <LivingRoom t={t} id="al2-liv36" veil={0.3} />
        <LabelStamp x={420} y={300} text="PEANUTS" t={t} from={-30} s={0.8} />
        <LabelStamp x={620} y={220} text="POLLEN" t={t} from={-30} s={0.8} />
        <LabelStamp x={1300} y={220} text="CATS" t={t} from={-30} s={0.8} />
        <LabelStamp x={1500} y={300} text="DUST" t={t} from={-30} s={0.8} />
        <LabelStamp x={1500} y={560} text="POLLEN" t={t} from={-30} s={0.8} />
        <LabelStamp x={420} y={560} text="CATS" t={t} from={-30} s={0.8} />
        <Actor look="alex" x={960} y={681} scale={1.35} facing={1} t={t}
          keys={[{ f: 20, p: { headTilt: -6 } }]} exprs={[[0, 'neutral'], [20, 'worried']]} />
      </g>
      <LabelsSeen n={4} />
    </>
  );
};

/* S37 s1-37: void — hero looks directly at the viewer, the space above
   their head empty, the question hanging: What would YOUR label say?
   "What would YOUR label say?" Hero turns to camera, makes direct eye
   contact, holds the gaze; the question fades in above him. NO label
   above the hero — the empty space is the point. */
export const S37: React.FC<ShotProps> = ({ t }) => (
  <>
    <g transform={camT(960, 540, 1.0)}>
      <Void t={t} id="al2-void37" />
      <GoldLine x={960} y={180} text="WHAT WOULD" t={t} from={15} size={72} />
      <GoldLine x={960} y={280} text="YOUR LABEL SAY?" t={t} from={35} size={72} />
      <Actor look="alex" x={960} y={720} scale={1.4} facing={1} t={t}
        keys={[{ f: 15, p: { headTilt: -3 } }]} exprs={[[0, 'neutral'], [15, 'worried']]} />
    </g>
    <LabelsSeen n={4} />
  </>
);
