import React from 'react';
import {
  Hero, poseAt, easeOut, faceAt, clamp, backOut, FONT, Look, Expr,
  camT, ShotProps, Sparkle, FocusRings, Glow,
  PlHallway, PLHALLWAY, plHallBench, PlBedroom, PLBEDROOM, PLB_WINDOW, PLB_DETECTOR,
  Detector, NightSky, Stars, Moon, stand, walkPose,
} from '../../engine';

/* PastLives1Min — 'What If You Could See How Many Lives Everyone Has
   Lived?' (18 shots, 60.0s). Built fresh: TWO brand-new sets (plHallway,
   plBedroom) + starry void; no old set is used. Voice is Helio narration +
   Kokoro af_heart for Sam (98 words, whisper-verified, NOT regenerated).
   Style kept: black round heads, white dot eyes, thin stick limbs, flat
   coloured tops, thin light rim. Number pill rules (never break): small
   dark pill, coloured outline (gold for 12, soft white for the rest),
   nearly touching the head, tiny downward pointer, same number stays with
   the same person, Alex's own number is NEVER shown.
   Motion (rig skill): walk cycle with planted feet in S3/S9 (walkPose,
   root travel matched to stride), stand in S2, reach in S4/S12, head
   turns and face changes in every shot — no static pose holds.
   Camera STATIC inside shots; the ONE slow push-in is S17 (tick-down).
   VFX: pill pop with overshoot + ring + sparkle burst (S8), detector
   screen glow (S12/S15), tick-down pulse (S17), eye-glint when the power
   fires (S9/S10/S14). No blur16 filter anywhere. grain: false. */

const BLACK = '#0D0D12';
const WHITE = '#F6EFE3';
const GOLD = '#FFD700';
const SOFT = '#E8E4DA';

const mkLook = (jacket: string, shade: string, accent: string, extra?: Look['extra'], shoe = '#3A3446'): Look => ({
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket, jacketShade: shade,
  accent, limb: '#26232F', line: '#121019', shoe, face: '#FFFFFF', hair: BLACK, extra,
});

const ALEX: Look = mkLook('#2E6FF0', '#2458C4', '#F2B33D', 'hood', '#1E4FB0');
const SAM: Look = mkLook('#E8823A', '#C96A2A', '#F2B33D', 'bob');
const GREY: Look = mkLook('#6A7A8A', '#55646E', '#E9C46A');
const GREEN: Look = mkLook('#5A7A4A', '#46603A', '#E9C46A');
const TEAL: Look = mkLook('#2A9D8F', '#1F7A70', '#E9C46A');
const PURPLE: Look = mkLook('#7B4B94', '#5E3873', '#C9A0DC', 'bob');

const LOOKMAP: Record<string, Look> = {
  alex: ALEX, sam: SAM, grey: GREY, green: GREEN, teal: TEAL, purple: PURPLE,
};

type Key = { f: number; p: Parameters<typeof poseAt>[1][number]['p']; ease?: (t: number) => number };

/** A character moving through keyframed gestures over the shot clock. */
const Actor: React.FC<{
  look: string; x: number; y: number; scale: number; facing?: 1 | -1;
  keys: Key[]; exprs?: [number, Expr][]; t: number; glintFrom?: number;
}> = ({ look, x, y, scale, facing = 1, keys, exprs, t, glintFrom }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x, y, scale, facing, headTilt: 0, armR: { a: 18, b: -10 }, armL: { a: 10, b: -8 }, legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 } } },
    ...keys,
  ]);
  const faces: [number, Expr][] = exprs ?? [[0, 'neutral']];
  const glint = glintFrom !== undefined && t >= glintFrom ? 1 : 0;
  return <Hero look={LOOKMAP[look]} pose={{ ...pose, ...faceAt(t, faces), glint, glintColor: '#FFD700' }} shadow={0} rimId="rimR" />;
};

/** Pill centre y for a character with hip y and scale: head top is
    hip - 238*scale; the pill hangs 10px below it, nearly touching. */
const pillY = (hipY: number, scale: number, s = 1) => hipY - 238 * scale - 10 - 26 * s;

/** The number pill: small dark pill, coloured outline, tiny downward
    pointer. Pops with overshoot + expanding ring + sparkle burst, then
    breathes. `tickTo`/`tickAt`: the number switches at tickAt with a
    pulse + ring (the tick-down). */
const NumberPill: React.FC<{
  x: number; y: number; num: string; t: number; from?: number;
  outline?: string; s?: number; tickTo?: string; tickAt?: number;
}> = ({ x, y, num, t, from = 0, outline = SOFT, s = 1, tickTo, tickAt }) => {
  const k = clamp((t - from) / 6);
  if (k <= 0) return null;
  const show = tickAt !== undefined && tickTo !== undefined && t >= tickAt ? tickTo : num;
  const pop = backOut(k);
  const breathe = 0.94 + 0.06 * Math.sin(t / 9);
  let pulse = 1;
  let tickRing = -1;
  if (tickAt !== undefined && t >= tickAt) {
    const dt = t - tickAt;
    if (dt < 14) pulse = 1 + 0.28 * Math.sin((dt / 14) * Math.PI);
    if (dt < 16) tickRing = dt;
  }
  const w = 34 + show.length * 30;
  const bt = t - from;
  const gold = outline === GOLD;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (0.55 + 0.45 * pop) * breathe * pulse})`} opacity={1}>
      {bt >= 0 && bt < 14 ? (
        <g>
          <circle r={30 + bt * 9} fill="none" stroke={outline} strokeWidth={5} opacity={0.9 * (1 - bt / 14)} />
          <Sparkle x={-w / 2 - 26} y={-26} t={bt} s={0.8} />
          <Sparkle x={w / 2 + 26} y={-30} t={bt + 2} s={0.7} />
          <Sparkle x={0} y={-58} t={bt + 4} s={0.9} />
        </g>
      ) : null}
      {tickRing >= 0 ? (
        <circle r={34 + tickRing * 10} fill="none" stroke={GOLD} strokeWidth={6} opacity={0.9 * (1 - tickRing / 16)} />
      ) : null}
      <rect x={-w / 2 - 12} y={-34} width={w + 24} height={68} rx={34} fill={outline} opacity={0.16} />
      <rect x={-w / 2} y={-26} width={w} height={52} rx={26} fill="#0E0C1E" opacity={0.94} stroke={outline} strokeWidth={3}
        style={gold ? { filter: 'drop-shadow(0 0 14px rgba(255,215,0,0.8))' } : { filter: `drop-shadow(0 0 10px ${outline})` }} />
      <polygon points="-9,22 9,22 0,36" fill="#0E0C1E" stroke={outline} strokeWidth={3} strokeLinejoin="round" />
      <text x={0} y={11} fontFamily={FONT.title} fontWeight={700} fontSize={30} fill={gold ? GOLD : '#FFFFFF'} textAnchor="middle"
        style={gold ? { filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.9))' } : undefined}>
        {show}
      </text>
    </g>
  );
};

/** A small person seen through the bedroom window, walking past outside,
    with a pill above their head. Figure height ~200*s. */
const WinWalker: React.FC<{
  x: number; baseY: number; s: number; num: string; from: number; t: number;
  outline?: string; color?: string; tickTo?: string; tickAt?: number;
}> = ({ x, baseY, s, num, from, t, outline = SOFT, color = '#1E1C28', tickTo, tickAt }) => {
  const headY = baseY - 170 * s;
  const bob = Math.sin(t / 4) * 2 * s;
  return (
    <g>
      <g transform={`translate(${x} ${baseY + bob}) scale(${s})`}>
        <ellipse cx={0} cy={2} rx={30} ry={6} fill="#000" opacity={0.3} />
        <path d="M -22 0 L -20 -118 Q 0 -132 20 -118 L 22 0 Z" fill={color} />
        <circle cx={0} cy={-152} r={20} fill={color} />
        <path d="M -20 -60 L -34 -20 M 20 -60 L 34 -24" stroke={color} strokeWidth={10} strokeLinecap="round" />
      </g>
      <NumberPill x={x} y={headY - 20 * s - 12 - 24} num={num} t={t} from={from} outline={outline} s={0.55 * s + 0.25} tickTo={tickTo} tickAt={tickAt} />
    </g>
  );
};

/** The detector worn on Alex's head (from S12 onward he never takes it
    off): perched on top of the head like a cap, antenna up. */
const HeadDetector: React.FC<{ ax: number; hy: number; sc: number; t: number }> = ({ ax, hy, sc, t }) => (
  <g>
    <Detector x={ax} y={hy - 250 * sc} s={0.8 * sc} t={t} glow={1} />
    <Glow x={ax} y={hy - 250 * sc} r={90 * sc} o={0.35} />
  </g>
);

/* S1: hallway wide — Alex sits on the bench, students pass; the cold-open
   narration runs. No pills yet: the power hasn't been revealed. */
const S1_SEAT = plHallBench();
const S1_FLOOR = PLHALLWAY.P(0.5, 1, 0.3).y;
export const S1: React.FC<ShotProps> = ({ t }) => {
  const w1 = walkPose(260 + t * 9, t * 0.55, S1_FLOOR, 0.7, {}, 1);
  const w2 = walkPose(1660 - t * 8, t * 0.55, S1_FLOOR, 0.75, {}, -1);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <PlHallway t={t} id="pl1-1" />
      <Hero look={GREY} pose={{ ...w1, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Hero look={TEAL} pose={{ ...w2, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Actor look="alex" x={S1_SEAT.x} y={S1_SEAT.y} scale={S1_SEAT.scale} facing={1} t={t}
        keys={[
          { f: 0, p: { legL: { a: 35, b: -35 }, legR: { a: 30, b: -30 }, armR: { a: 25, b: -15 }, armL: { a: 22, b: -12 }, yaw: 1 } },
          { f: 30, p: { headTilt: -5, tilt: -2 } },
          { f: 70, p: { headTilt: 5, tilt: 2, armR: { a: 40, b: -20 } } },
          { f: 105, p: { headTilt: 0, tilt: 0, armR: { a: 25, b: -15 } } },
        ]} />
    </g>
  );
};

/* S2: hallway medium — Alex STANDS up from the bench (seat -> stand,
   legs straighten, arms swing), face neutral -> cool (determined). */
const S2_STAND = stand(PLHALLWAY, 0.28, 0.41);
export const S2: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <PlHallway t={t} id="pl1-2" />
    <Actor look="alex" x={S1_SEAT.x} y={S1_SEAT.y} scale={S1_SEAT.scale} facing={1} t={t}
      keys={[
        { f: 0, p: { legL: { a: 35, b: -35 }, legR: { a: 30, b: -30 }, armR: { a: 25, b: -15 }, armL: { a: 22, b: -12 }, yaw: 1 } },
        { f: 55, p: { x: S2_STAND.x, y: S2_STAND.y, legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 }, armR: { a: -30, b: -10 }, armL: { a: -20, b: -8 }, tilt: -3, headTilt: -3, yaw: 0 }, ease: easeOut },
        { f: 85, p: { tilt: 0, headTilt: 2, armR: { a: 18, b: -10 }, armL: { a: 10, b: -8 } } },
      ]} exprs={[[0, 'neutral'], [55, 'smug']]} />
  </g>
);

/* S3: hallway wide — Alex WALKS toward Sam (walkPose, planted feet, root
   travel matched to stride). Sam waits at the right, head down. */
const S3_FLOOR = PLHALLWAY.P(0.5, 1, 0.45).y;
const S3_SAM = stand(PLHALLWAY, 0.82, 0.35);
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const x = 420 + (t / Math.max(1, len)) * 900;
  const walk = walkPose(x, t * 0.55, S3_FLOOR, 1.35, {}, 1);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <PlHallway t={t} id="pl1-3" />
      <Hero look={ALEX} pose={{ ...walk, ...faceAt(t, [[0, 'neutral'], [30, 'smug']]), glint: 0 }} shadow={0} rimId="rimR" />
      <Actor look="sam" x={S3_SAM.x} y={S3_SAM.y} scale={S3_SAM.scale} facing={-1} t={t}
        keys={[
          { f: 20, p: { headTilt: 10, armR: { a: 30, b: -30 }, armL: { a: 25, b: -25 } } },
          { f: 80, p: { headTilt: 8, armR: { a: 20, b: -20 } } },
        ]} />
    </g>
  );
};

/* S4: hallway medium — Alex approaches Sam and reaches out to tap her
   shoulder; Sam looks down at her sweater. */
const S4_SAM = stand(PLHALLWAY, 0.8, 0.42);
const S4_ALEX = stand(PLHALLWAY, 0.58, 0.42);
export const S4: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <PlHallway t={t} id="pl1-4" />
    <Actor look="alex" x={S4_ALEX.x} y={S4_ALEX.y} scale={S4_ALEX.scale} facing={1} t={t}
      keys={[
        { f: 0, p: { x: S4_ALEX.x - 260, legL: { a: 20, b: -10 }, legR: { a: -18, b: -8 } } },
        { f: 55, p: { x: S4_ALEX.x - 40, armR: { a: -55, b: -10 }, handR: 'open', headTilt: -3, tilt: 3 }, ease: easeOut },
        { f: 90, p: { x: S4_ALEX.x, armR: { a: -72, b: -6 }, handR: 'open', headTilt: 2 } },
      ]} exprs={[[0, 'neutral'], [55, 'happy']]} />
    <Actor look="sam" x={S4_SAM.x} y={S4_SAM.y} scale={S4_SAM.scale} facing={-1} t={t}
      keys={[
        { f: 30, p: { headTilt: 9, armL: { a: 34, b: -30 } } },
        { f: 80, p: { headTilt: 7, armL: { a: 20, b: -20 } } },
      ]} />
  </g>
);

/* S5: medium close-up — Alex: "Hey. Nice sweater." He points at the
   sweater; Sam listens at the right edge. */
export const S5: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.35)}>
    <PlHallway t={t} id="pl1-5" />
    <Actor look="alex" x={720} y={1010} scale={1.6} facing={1} t={t}
      keys={[
        { f: 10, p: { armR: { a: -75, b: -8 }, handR: 'point', headTilt: -4, tilt: 3 } },
        { f: 32, p: { armR: { a: -55, b: -10 }, handR: 'point', headTilt: 3, tilt: 0 } },
      ]} exprs={[[0, 'happy'], [10, 'happy']]} />
    <Actor look="sam" x={1520} y={1010} scale={1.6} facing={-1} t={t}
      keys={[
        { f: 12, p: { headTilt: 8, armR: { a: 30, b: -30 } } },
        { f: 34, p: { headTilt: 4, armR: { a: 18, b: -10 } } },
      ]} exprs={[[0, 'neutral'], [12, 'neutral']]} />
  </g>
);

/* S6: close-up — Sam startles and looks up, shock. */
export const S6: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <PlHallway t={t} id="pl1-6" />
    <Actor look="sam" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 0, p: { headTilt: 10, armR: { a: 20, b: -20 }, armL: { a: 16, b: -16 } } },
        { f: 8, p: { headTilt: -6, armR: { a: -50, b: -20 }, armL: { a: -40, b: -16 }, tilt: -3 }, ease: easeOut },
        { f: 22, p: { headTilt: 2, armR: { a: -20, b: -10 }, tilt: 0 } },
      ]} exprs={[[0, 'neutral'], [8, 'shock']]} />
  </g>
);

/* S7: close-up — Sam: "Oh, hey. Thanks." Shock melts into a shy smile;
   a small wave. */
export const S7: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <PlHallway t={t} id="pl1-7" />
    <Actor look="sam" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 0, p: { headTilt: -4, armR: { a: -20, b: -10 } } },
        { f: 20, p: { headTilt: 4, armR: { a: -60, b: -30 }, tilt: 2 } },
        { f: 42, p: { headTilt: -2, armR: { a: -30, b: -16 }, tilt: 0 } },
        { f: 58, p: { headTilt: 3, armR: { a: 10, b: -8 } } },
      ]} exprs={[[0, 'shock'], [12, 'happy']]} />
  </g>
);

/* S8: EXTREME CLOSE-UP on the "12" pill above Sam's head — the visual
   explanation shot. The gold pill POPS with overshoot + ring + sparkle
   burst at t=20, then glows and breathes. */
export const S8: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <PlHallway t={t} id="pl1-8" />
    <Actor look="sam" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 20, p: { headTilt: 4, tilt: 2 } },
        { f: 60, p: { headTilt: -2, tilt: 0, armR: { a: -20, b: -10 } } },
        { f: 95, p: { headTilt: 3 } },
      ]} exprs={[[0, 'happy'], [20, 'happy']]} />
    <NumberPill x={960} y={pillY(1020, 1.9, 1.4)} num="12" t={t} from={20} outline={GOLD} s={1.4} />
  </g>
);

/* S9: hallway wide — other students pass, pills popping above their heads
   (3, 7, 2, 9), one blank. Alex watches from the left, eye-glint on. */
const S9_FLOOR35 = PLHALLWAY.P(0.5, 1, 0.35).y;
const S9_FLOOR40 = PLHALLWAY.P(0.5, 1, 0.4).y;
const S9_FLOOR50 = PLHALLWAY.P(0.5, 1, 0.5).y;
const S9_ALEX = stand(PLHALLWAY, 0.2, 0.42);
export const S9: React.FC<ShotProps> = ({ t }) => {
  const a = walkPose(200 + t * 12, t * 0.55, S9_FLOOR35, 0.8, {}, 1);
  const b = walkPose(1700 - t * 11, t * 0.55, S9_FLOOR40, 0.9, {}, -1);
  const c = walkPose(500 + t * 10, t * 0.55, S9_FLOOR50, 1.0, {}, 1);
  const d = walkPose(1400 - t * 9, t * 0.55, S9_FLOOR35, 0.7, {}, -1);
  const e = walkPose(900 + t * 8, t * 0.55, S9_FLOOR40, 0.85, {}, 1);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <PlHallway t={t} id="pl1-9" />
      <Hero look={GREY} pose={{ ...a, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={a.x} y={pillY(a.y, 0.8, 0.9)} num="3" t={t} from={15} outline={SOFT} s={0.9} />
      <Hero look={GREEN} pose={{ ...b, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={b.x} y={pillY(b.y, 0.9, 0.9)} num="7" t={t} from={30} outline={SOFT} s={0.9} />
      <Hero look={TEAL} pose={{ ...c, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={c.x} y={pillY(c.y, 1.0, 0.9)} num="2" t={t} from={45} outline={SOFT} s={0.9} />
      <Hero look={PURPLE} pose={{ ...d, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={d.x} y={pillY(d.y, 0.7, 0.9)} num="9" t={t} from={60} outline={SOFT} s={0.9} />
      <Hero look={GREY} pose={{ ...e, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Actor look="alex" x={S9_ALEX.x} y={S9_ALEX.y} scale={S9_ALEX.scale} facing={1} t={t} glintFrom={10}
        keys={[
          { f: 20, p: { headTilt: -4, tilt: -2 } },
          { f: 50, p: { headTilt: 4, tilt: 2, armR: { a: 40, b: -16 } } },
          { f: 78, p: { headTilt: 0, tilt: 0, armR: { a: 18, b: -10 } } },
        ]} exprs={[[0, 'neutral'], [10, 'smug']]} />
    </g>
  );
};

/* S10: close-up — Alex's face, realization and fascination; eye-glint
   fires at t=30. */
export const S10: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.45)}>
    <PlHallway t={t} id="pl1-10" />
    <Actor look="alex" x={960} y={1020} scale={1.9} facing={1} t={t} glintFrom={30}
      keys={[
        { f: 20, p: { headTilt: -4, tilt: -2 } },
        { f: 35, p: { headTilt: 5, tilt: 3, armR: { a: -30, b: -12 } } },
        { f: 65, p: { headTilt: 2, tilt: 0, armR: { a: 10, b: -8 } } },
        { f: 85, p: { headTilt: -2 } },
      ]} exprs={[[0, 'neutral'], [35, 'shock'], [65, 'happy']]} />
  </g>
);

/* S11: bedroom wide — the detector glows on the nightstand; Alex steps
   toward it and points. Beat 2 narration begins. */
const S11_ALEX = stand(PLBEDROOM, 0.35, 0.4);
export const S11: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.9)}>
    <PlBedroom t={t} id="pl1-11" />
    <Actor look="alex" x={S11_ALEX.x} y={S11_ALEX.y} scale={S11_ALEX.scale} facing={1} t={t}
      keys={[
        { f: 20, p: { x: S11_ALEX.x + 70, legL: { a: 18, b: -8 }, legR: { a: -16, b: -6 } } },
        { f: 50, p: { x: S11_ALEX.x + 110, armR: { a: -70, b: -10 }, handR: 'point', headTilt: -3, tilt: 3 } },
        { f: 85, p: { armR: { a: -30, b: -10 }, handR: 'open', headTilt: 3, tilt: 0 } },
      ]} exprs={[[0, 'neutral'], [50, 'happy']]} />
  </g>
);

/* S12: bedroom medium — Alex picks up the detector, lifts it, places it
   on his head; the screen activates with a glow at t=80. */
const S12_ALEX = stand(PLBEDROOM, 0.42, 0.4);
export const S12: React.FC<ShotProps> = ({ t }) => {
  const ax = S12_ALEX.x;
  const hy = S12_ALEX.y;
  const sc = S12_ALEX.scale;
  // detector travel: nightstand -> hand -> head
  const k1 = clamp((t - 20) / 35, 0, 1);
  const k2 = clamp((t - 55) / 25, 0, 1);
  const handX = ax + 90 * sc;
  const handY = hy - 150 * sc;
  const headX = ax + 55 * sc;
  const headY = hy - 205 * sc;
  const e1 = easeOut(k1);
  const e2 = easeOut(k2);
  const dx = PLB_DETECTOR.x + (handX - PLB_DETECTOR.x) * e1 + (headX - handX) * e2;
  const dy = PLB_DETECTOR.y + (handY - PLB_DETECTOR.y) * e1 + (headY - handY) * e2;
  const active = t >= 80;
  return (
    <g transform={camT(960, 540, 1.0)}>
      <PlBedroom t={t} id="pl1-12" detectorOnStand={t < 20} />
      <Actor look="alex" x={ax} y={hy} scale={sc} facing={1} t={t} glintFrom={active ? 80 : 9999}
        keys={[
          { f: 25, p: { armR: { a: -60, b: -8 }, headTilt: -3, tilt: 3 } },
          { f: 55, p: { armR: { a: -110, b: -30 }, headTilt: -5, tilt: 2 } },
          { f: 80, p: { armR: { a: -130, b: -60 }, headTilt: 3, tilt: 0 } },
          { f: 100, p: { armR: { a: -90, b: -40 }, headTilt: 0 } },
        ]} exprs={[[0, 'neutral'], [80, 'happy']]} />
      <Detector x={dx} y={dy} s={0.62 + (active ? 0.25 : 0)} t={t} glow={active ? 1 : 0.7} />
      {active ? <Glow x={dx} y={dy} r={140} o={0.5} /> : null}
    </g>
  );
};

/* S13: bedroom medium — Alex turns to the window and watches people pass
   outside; their numbers pop above them (3, 7, 2). */
const S13_ALEX = stand(PLBEDROOM, 0.45, 0.42);
export const S13: React.FC<ShotProps> = ({ t }) => {
  const wx = (off: number) => PLB_WINDOW.x0 + 20 + ((t * 2.2 + off) % (PLB_WINDOW.x1 - PLB_WINDOW.x0 - 40));
  return (
    <g transform={camT(960, 540, 1.0)}>
      <PlBedroom t={t} id="pl1-13" detectorOnStand={false} />
      <WinWalker x={wx(0)} baseY={PLB_WINDOW.y1 - 8} s={0.55} num="3" from={20} t={t} color="#2A3A5A" />
      <WinWalker x={wx(130)} baseY={PLB_WINDOW.y1 - 8} s={0.55} num="7" from={45} t={t} color="#3A2A4A" />
      <WinWalker x={wx(250)} baseY={PLB_WINDOW.y1 - 8} s={0.55} num="2" from={70} t={t} color="#2A4A3A" />
      <Actor look="alex" x={S13_ALEX.x} y={S13_ALEX.y} scale={S13_ALEX.scale} facing={-1} t={t} glintFrom={20}
        keys={[
          { f: 25, p: { headTilt: -5, tilt: -3 } },
          { f: 60, p: { headTilt: 4, tilt: 2, armR: { a: -60, b: -10 }, handR: 'point' } },
          { f: 95, p: { headTilt: -2, tilt: 0, armR: { a: 18, b: -10 } } },
        ]} exprs={[[0, 'neutral'], [20, 'smug']]} />
      <HeadDetector ax={S13_ALEX.x} hy={S13_ALEX.y} sc={S13_ALEX.scale} t={t} />
    </g>
  );
};

/* S14: close-up — Alex's face, fascination, eye-glint on. */
export const S14: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <PlBedroom t={t} id="pl1-14" detectorOnStand={false} />
    <Actor look="alex" x={960} y={1020} scale={1.9} facing={1} t={t} glintFrom={0}
      keys={[
        { f: 25, p: { headTilt: -4, tilt: -2 } },
        { f: 60, p: { headTilt: 5, tilt: 3, armR: { a: -30, b: -12 } } },
        { f: 95, p: { headTilt: 0, tilt: 0, armR: { a: 10, b: -8 } } },
      ]} exprs={[[0, 'neutral'], [25, 'happy'], [70, 'smug']]} />
    <HeadDetector ax={960} hy={1020} sc={1.9} t={t} />
  </g>
);

/* S15: close-up on the detector screen — it shows the number 12, gold,
   glowing. Static camera. */
export const S15: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(1006, 636, 1.6)}>
    <PlBedroom t={t} id="pl1-15" detectorOnStand={false} />
    <Detector x={1006} y={560} s={2.2} t={t} n="12" glow={1} />
    <Glow x={1006} y={560} r={260} o={0.45} />
    {t >= 20 ? <Sparkle x={880} y={440} t={t - 20} s={1.0} /> : null}
    {t >= 28 ? <Sparkle x={1140} y={470} t={t - 28} s={0.9} /> : null}
    <text x={1006} y={720} fontFamily={FONT.title} fontWeight={600} fontSize={26} fill={WHITE} textAnchor="middle" letterSpacing={6} opacity={clamp((t - 10) / 10)}>
      LIVES LIVED
    </text>
  </g>
);

/* S16: bedroom medium — Alex at the window, numbers visible outside;
   his head turns to follow each one. */
const S16_ALEX = stand(PLBEDROOM, 0.45, 0.42);
export const S16: React.FC<ShotProps> = ({ t }) => {
  const wx = (off: number) => PLB_WINDOW.x0 + 20 + ((t * 2.0 + off) % (PLB_WINDOW.x1 - PLB_WINDOW.x0 - 40));
  return (
    <g transform={camT(960, 540, 1.0)}>
      <PlBedroom t={t} id="pl1-16" detectorOnStand={false} />
      <WinWalker x={wx(0)} baseY={PLB_WINDOW.y1 - 8} s={0.55} num="3" from={8} t={t} color="#2A3A5A" />
      <WinWalker x={wx(110)} baseY={PLB_WINDOW.y1 - 8} s={0.55} num="7" from={30} t={t} color="#3A2A4A" />
      <WinWalker x={wx(210)} baseY={PLB_WINDOW.y1 - 8} s={0.55} num="9" from={55} t={t} color="#4A2A2A" />
      <WinWalker x={wx(290)} baseY={PLB_WINDOW.y1 - 8} s={0.55} num="2" from={80} t={t} color="#2A4A3A" />
      <Actor look="alex" x={S16_ALEX.x} y={S16_ALEX.y} scale={S16_ALEX.scale} facing={-1} t={t} glintFrom={8}
        keys={[
          { f: 25, p: { headTilt: -6, tilt: -3 } },
          { f: 60, p: { headTilt: 5, tilt: 2, armR: { a: -50, b: -10 }, handR: 'point' } },
          { f: 100, p: { headTilt: -3, tilt: 0, armR: { a: 18, b: -10 } } },
        ]} exprs={[[0, 'happy'], [25, 'smug']]} />
      <HeadDetector ax={S16_ALEX.x} hy={S16_ALEX.y} sc={S16_ALEX.scale} t={t} />
    </g>
  );
};

/* S17: THE ONE slow push-in (1.0 -> 1.08) — close-up on a number pill
   outside the window: it TICKS down 12 -> 11 at t=40 with a pulse, a
   gold ring and a glow. Alex watches from the right edge. */
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.0 + 0.08 * clamp(t / Math.max(1, len));
  return (
    <g transform={camT(700, 520, 1.5 * s)}>
      <PlBedroom t={t} id="pl1-17" detectorOnStand={false} />
      <WinWalker x={660} baseY={PLB_WINDOW.y1 - 8} s={1.1} num="12" from={6} t={t} outline={GOLD} color="#2A3A5A" tickTo="11" tickAt={40} />
      <Actor look="alex" x={1150} y={940} scale={1.2} facing={-1} t={t} glintFrom={40}
        keys={[
          { f: 20, p: { headTilt: -4, tilt: -2 } },
          { f: 60, p: { headTilt: 4, tilt: 2, armR: { a: -50, b: -10 }, handR: 'point' } },
          { f: 110, p: { headTilt: 0, tilt: 0, armR: { a: 18, b: -10 } } },
        ]} exprs={[[0, 'neutral'], [40, 'shock'], [80, 'worried']]} />
      <HeadDetector ax={1150} hy={940} sc={1.2} t={t} />
      {t >= 40 && t < 56 ? <FocusRings x={660} y={PLB_WINDOW.y1 - 8 - 220} t={t - 40} r0={90} color={GOLD} /> : null}
    </g>
  );
};

/* S18: title card on the starry void — gold glowing question, fits with
   margins, plus the comment CTA underneath. */
export const S18: React.FC<ShotProps> = ({ t }) => {
  const k = clamp(t / 8);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <NightSky id="pl1-end" horizonY={1080} />
      <Stars seed={141} x0={0} y0={0} w={1920} h={1080} t={t} n={60} o={0.85} />
      <Moon x={1700} y={180} r={54} />
      <g opacity={k}>
        <text x={960} y={400} fontFamily={FONT.title} fontWeight={700} fontSize={62} fill={GOLD} textAnchor="middle" style={{ filter: 'drop-shadow(0 0 22px rgba(255,200,69,0.65))' }}>
          WHAT IF YOU COULD SEE
        </text>
        <text x={960} y={490} fontFamily={FONT.title} fontWeight={700} fontSize={62} fill={GOLD} textAnchor="middle" style={{ filter: 'drop-shadow(0 0 22px rgba(255,200,69,0.65))' }}>
          HOW MANY LIVES EVERYONE
        </text>
        <text x={960} y={580} fontFamily={FONT.title} fontWeight={700} fontSize={62} fill={GOLD} textAnchor="middle" style={{ filter: 'drop-shadow(0 0 22px rgba(255,200,69,0.65))' }}>
          HAS LIVED?
        </text>
        <text x={960} y={760} fontFamily={FONT.title} fontWeight={600} fontSize={30} fill={WHITE} textAnchor="middle" letterSpacing={5} opacity={clamp((t - 14) / 8)}>
          TELL ME IN THE COMMENTS
        </text>
      </g>
    </g>
  );
};
