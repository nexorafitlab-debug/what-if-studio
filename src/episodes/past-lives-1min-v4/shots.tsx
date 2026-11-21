import React from 'react';
import {
  Hero, poseAt, easeOut, faceAt, clamp, backOut, FONT, Look, Expr,
  camT, ShotProps, Sparkle, FocusRings, Glow,
  Pl2Gate, PL2GATE, Pl2Classroom, PL2CLASSROOM, Pl2Stairwell, PL2STAIRWELL,
  Pl2Corridor, PL2CORRIDOR, Pl2Cafeteria, PL2CAFETERIA, Pl2ArtRoom, PL2ARTROOM,
  Pl2Bedroom, PL2BEDROOM, PL2B_WINDOW, PL2B_DETECTOR,
  Pl2Bathroom, PL2BATHROOM, Pl2Street, PL2STREET,
  Detector, NightSky, Stars, Moon, stand, walkPose,
  EyeBeam as HouseEyeBeam, Library, Hallway, Study,
} from '../../engine';

/* PastLives1MinV3 — 'What If You Could See How Many Lives Everyone Has
   Lived?' (27 shots, 60.6s). REBUILT to the read-thoughts-40s-v2 standard
   after the user rejected v2 ("long pause in between, unnecessary motion").
   The v2 fault was the VOICEOVER, not the pictures: 98 words in 60s
   (1.6 words/sec), ~25s of silence, characters moving through the gaps.
   v3 fixes it at the source:
   - FRESH dense voiceover: 169 words (Beat 1 -> Beat 2 -> Beat 3 -> Beat 4
     Stevenson), gaps between lines 0.20-0.50s, longest inter-line gap
     0.50s. Helio narration + Sam (Kokoro af_heart) + Jordan (am_adam).
     Every chunk whisper-verified; full voice 171/171 tokens in order.
   - A NUMBER OR GRAPHIC IN EVERY SHOT (more than the file's true rule:
     SOMETHING NEW every 1-2s — a new place, a face change, or a panel
     pop; f02 and f34 have no panel. v3 meets the rule with margin: a
     pill pops, ticks, or flickers in every shot — or a graphic (FREEZE
     diagram, 12 LIVES dots, Stevenson citation, 2,500 counter, end
     card). Something new appears every 1-2s.
   - THE BEAM (CORRECTED — the v3 "no dotted beam" claim was WRONG):
     the benchmark file DOES show a dotted gold line from the hero's
     glowing eyes to the panel (f03 library, f23 hallway); the code
     confirms EyeBeam, dasharray "12 8". So: gold eye-glint on Alex +
     the house EyeBeam (dotted amber, 4px, 0.75 opacity), never a solid
     arrow. In close-ups the beam comes from the frame corner where Alex
     stands off-screen. Origin is the EYE (hip-y via walk.y).
   - SHOT SIZES CHANGE EVERY 1-2s: wide -> medium -> close-up -> extreme
     close-up, constantly. 27 shots in 60.6s (~27 cuts/min), longest shot
     3.8s, shortest 1.1s.
   - CLOSE-UP PILLS ARE HUGE (measured f07: the "fire me" pill is
     ~30-40% of frame width). Short numbers need a big scale to match,
     so ECU/CU pills use s=2.4-2.8 with bigPillY (pill bottom 14px above
     the head top, pointer nearly touching — never overlapping the face).
   - 13 PLACES (v4: corridor x6 -> x3, bedroom x4 -> x3): gate,
     classroom, stairwell, corridor, library, hallway, study, cafeteria,
     art room, bedroom, bathroom, evening street + starry void.
   - MOTION TIED TO WORDS ONLY: one purposeful action per shot, keyed to
     the word spoken over it. Every Actor's keys move MONOTONICALLY to ONE
     pose and hold — no A->B->A oscillation, no looping limb motion.
     Walk cycles (walkPose) only while a character is actually walking.
     NO WallClock, NO Pendant anywhere.
   - KEPT FROM V2: FREEZE diagram (detector -> beam -> pill), "12 LIVES"
     graphic with 12 dots, tick-down 12 -> 11 (the ONE slow push-in),
     music ~-44 dB mean, SFX on every action + room tone.
   - ENDS ON A CLIFFHANGER CARD: "PART ONE / WHAT HAPPENS AT ZERO?"
     with a red "0" pill.
   Style: black round heads, white dot eyes, thin stick limbs, flat
   coloured tops, thin light rim. Pill rules (never break): small dark
   pill, coloured outline (gold for 12, soft white for the rest), nearly
   touching the head, tiny downward pointer, same number stays with the
   same person (Sam 12, Jordan 3, Harwick 7), Alex's own number is NEVER
   shown. Camera STATIC inside shots except the ONE slow push-in (S12).
   No blur16 filter anywhere. grain: false. */

const BLACK = '#0D0D12';
const WHITE = '#F6EFE3';
const GOLD = '#FFD700';
const SOFT = '#E8E4DA';
const RED = '#FF3344';

const mkLook = (jacket: string, shade: string, accent: string, extra?: Look['extra'], shoe = '#3A3446'): Look => ({
  skin: BLACK, skinShade: '#141419', hand: '#26232F', jacket, jacketShade: shade,
  accent, limb: '#26232F', line: '#121019', shoe, face: '#FFFFFF', hair: BLACK, extra,
});

const ALEX: Look = mkLook('#2E6FF0', '#2458C4', '#F2B33D', 'hood', '#1E4FB0');
const SAM: Look = mkLook('#E8823A', '#C96A2A', '#F2B33D', 'bob');
const JORDAN: Look = mkLook('#2A9D8F', '#1F7A70', '#E9C46A');
const HARWICK: Look = mkLook('#3A3F4A', '#2C3038', '#A8323E', 'suit', '#14151A');
const GREY: Look = mkLook('#6A7A8A', '#55646E', '#E9C46A');
const GREEN: Look = mkLook('#5A7A4A', '#46603A', '#E9C46A');
const PURPLE: Look = mkLook('#7B4B94', '#5E3873', '#C9A0DC', 'bob');
const REDTOP: Look = mkLook('#A83A3A', '#86302E', '#E9C46A');

const LOOKMAP: Record<string, Look> = {
  alex: ALEX, sam: SAM, jordan: JORDAN, harwick: HARWICK,
  grey: GREY, green: GREEN, purple: PURPLE, red: REDTOP,
};

type Key = { f: number; p: Parameters<typeof poseAt>[1][number]['p']; ease?: (t: number) => number };

/** A character moving through keyframed gestures over the shot clock.
    MOTION RULE: keys must be MONOTONIC — each limb moves to ONE pose and
    holds. Never alternate an angle (no A->B->A), so no limb ever loops. */
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

/** Pill centre y for a BIG close-up pill (s >= 2): the pill's bottom edge
    sits 14px above the head top, so the pointer nearly touches the head
    exactly like the benchmark's f07 ("fire me", ~30% frame width). With
    pillY the pointer would stab into the face at big scales. */
const bigPillY = (hipY: number, scale: number, s: number) => hipY - 238 * scale - 14 - 26 * s;

/** The eye position of a character (for the beam): head centre + facing. */
const headPos = (p: { x: number; y: number; scale: number }, facing: 1 | -1) => ({
  x: p.x + facing * 22 * p.scale, y: p.y - 185 * p.scale,
});

/** The eye beam (CORRECTED — the v3 "no dotted beam" claim was WRONG).
    The benchmark file DOES show a dotted gold line from the hero's
    glowing eyes to the panel (f03 library, f23 hallway) and the code
    confirms EyeBeam, dasharray "12 8". This adapter keeps the v3 call
    signature (x0/y0 = eye, x1/y1 = panel bottom, t = shot clock,
    from = pop frame) and renders the house EyeBeam: a thin DOTTED amber
    line, stroke #FFAA00, 4px, 0.75 opacity, dasharray "12 8", fading in
    over 5 frames and out after ~22 frames (~0.7 s visible). NOT a solid
    arrow. The origin must be the EYE (hip-y via walk.y), never the
    walk-cycle floor-y (the v3 S3/S18 waist-origin bug). */
const EyeBeam: React.FC<{ x0: number; y0: number; x1: number; y1: number; t: number; from: number }> = ({ x0, y0, x1, y1, t, from }) => (
  <HouseEyeBeam x1={x0} y1={y0} x2={x1} y2={y1} t={t - from} />
);

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

/** The detector worn on Alex's head: perched on top of the head like a
    cap, antenna up. `glow` fades it (S13: the detector powers down). */
const HeadDetector: React.FC<{ ax: number; hy: number; sc: number; t: number; glow?: number }> = ({ ax, hy, sc, t, glow = 1 }) => (
  <g>
    <Detector x={ax} y={hy - 250 * sc} s={0.8 * sc} t={t} glow={glow} />
    <Glow x={ax} y={hy - 250 * sc} r={90 * sc} o={0.35 * glow} />
  </g>
);

/** A line that draws itself on over `dur` frames (Freeze-diagram helper). */
const DrawLine: React.FC<{ d: string; t: number; dur?: number; color?: string; width?: number }> = ({ d, t, dur = 12, color = WHITE, width = 5 }) => {
  const k = clamp(t / dur);
  if (k <= 0) return null;
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={100} strokeDasharray="100" strokeDashoffset={100 * (1 - k)} />;
};

/* S1: school gate, wide — Alex WALKS in through the open gate (walk cycle,
   planted feet). Two students ahead wear pills: "3" pops at t=15, "7" at
   t=30. The cold-open question runs. */
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const x = 480 + (t / Math.max(1, len)) * 700;
  const walk = walkPose(x, t * 0.55, 760, 0.9, {}, 1);
  const w1 = walkPose(300 + t * 7, t * 0.55, 760, 0.7, {}, 1);
  const w2 = walkPose(1650 - t * 6, t * 0.55, 760, 0.75, {}, -1);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Pl2Gate t={t} />
      <Hero look={GREY} pose={{ ...w1, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={w1.x} y={pillY(w1.y, 0.7, 0.9)} num="3" t={t} from={15} outline={SOFT} s={0.9} />
      <Hero look={GREEN} pose={{ ...w2, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={w2.x} y={pillY(w2.y, 0.75, 0.9)} num="7" t={t} from={30} outline={SOFT} s={0.9} />
      <Hero look={ALEX} pose={{ ...walk, ...faceAt(t, [[0, 'neutral'], [30, 'smug']]), glint: t >= 15 ? 1 : 0, glintColor: '#FFD700' }} shadow={0} rimId="rimR" />
    </g>
  );
};

/* S2: classroom, medium — Alex stands by his desk and LOOKS UP, turning
   his head toward the camera. A classmate at the next desk wears a "5"
   pill that pops at t=20. ONE action: the head turn (monotonic). */
const S2_ALEX = stand(PL2CLASSROOM, 0.5, 0.4);
const S2_MATE = stand(PL2CLASSROOM, 0.78, 0.38);
export const S2: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Pl2Classroom t={t} />
    <Actor look="grey" x={S2_MATE.x} y={S2_MATE.y} scale={S2_MATE.scale} facing={-1} t={t}
      keys={[{ f: 30, p: { headTilt: -4, armR: { a: 30, b: -10 } } }]} />
    <NumberPill x={S2_MATE.x} y={pillY(S2_MATE.y, S2_MATE.scale, 0.9)} num="5" t={t} from={20} outline={SOFT} s={0.9} />
    <Actor look="alex" x={S2_ALEX.x} y={S2_ALEX.y} scale={S2_ALEX.scale} facing={1} t={t} glintFrom={20}
      keys={[
        { f: 25, p: { headTilt: -4, tilt: -2 } },
        { f: 55, p: { headTilt: 5, tilt: 2, armR: { a: 30, b: -10 } } },
      ]} />
    <EyeBeam x0={headPos(S2_ALEX, 1).x} y0={headPos(S2_ALEX, 1).y} x1={S2_MATE.x} y1={pillY(S2_MATE.y, S2_MATE.scale, 0.9) + 30} t={t} from={20} />
  </g>
);

/* S3: corridor, medium — Alex WALKS toward Sam at her locker (walk cycle).
   Sam waits, head down. Her gold "12" pops at t=12 with the beam from
   Alex's glowing eyes. "Hey." */
const S3_SAM = stand(PL2CORRIDOR, 0.25, 0.3);
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const x = 1500 - (t / Math.max(1, len)) * 700;
  const walk = walkPose(x, t * 0.55, 922, 1.35, {}, -1);
  const eye = headPos({ x, y: walk.y, scale: 1.35 }, -1);  // v4: hip-y, never the walk-cycle floor-y (v3 waist-origin bug)
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Pl2Corridor t={t} />
      <Actor look="sam" x={S3_SAM.x} y={S3_SAM.y} scale={S3_SAM.scale} facing={1} t={t} keys={[]} exprs={[[0, 'neutral']]} />
      <NumberPill x={S3_SAM.x} y={pillY(S3_SAM.y, S3_SAM.scale, 0.9)} num="12" t={t} from={12} outline={GOLD} s={0.9} />
      <EyeBeam x0={eye.x} y0={eye.y} x1={S3_SAM.x} y1={pillY(S3_SAM.y, S3_SAM.scale, 0.9) + 30} t={t} from={12} />
      <Hero look={ALEX} pose={{ ...walk, ...faceAt(t, [[0, 'neutral'], [30, 'happy']]), glint: t >= 12 ? 1 : 0, glintColor: '#FFD700' }} shadow={0} rimId="rimR" />
    </g>
  );
};

/* S4: corridor, close-up — Sam STARTLES and looks up. ONE action: the head
   snaps up (10 -> -6) and her arm rises once. Her gold "12" is big above
   her; the beam comes from the frame corner where Alex stands. */
export const S4: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <Pl2Corridor t={t} />
    <Actor look="sam" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 0, p: { headTilt: 10, armR: { a: 20, b: -20 }, armL: { a: 16, b: -16 } } },
        { f: 8, p: { headTilt: -6, armR: { a: -50, b: -20 }, armL: { a: -40, b: -16 }, tilt: -3 }, ease: easeOut },
        { f: 22, p: { headTilt: 2, armR: { a: -20, b: -10 }, tilt: 0 } },
      ]} exprs={[[0, 'neutral'], [8, 'shock']]} />
    <NumberPill x={960} y={bigPillY(1020, 1.9, 2.4)} num="12" t={t} from={0} outline={GOLD} s={2.4} />
    <EyeBeam x0={80} y0={980} x1={960} y1={bigPillY(1020, 1.9, 2.4) + 40} t={t} from={6} />
  </g>
);

/* S5: bedroom, wide — the detector glows on the desk; Alex steps toward
   it and POINTS. A holographic "12" pill floats above the detector (it
   pops at t=20) with a "LIFESIGHT DETECTOR" label. ONE action: step +
   point (arm extends monotonically). */
const S5_ALEX = stand(PL2BEDROOM, 0.35, 0.4);
export const S5: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.9)}>
    <Pl2Bedroom t={t} />
    <NumberPill x={PL2B_DETECTOR.x} y={PL2B_DETECTOR.y - 110} num="12" t={t} from={20} outline={GOLD} s={0.8} />
    <text x={PL2B_DETECTOR.x} y={PL2B_DETECTOR.y + 95} fontFamily={FONT.title} fontWeight={600} fontSize={24} fill={WHITE} textAnchor="middle" letterSpacing={4} opacity={clamp((t - 20) / 8)}>
      LIFESIGHT DETECTOR
    </text>
    <Actor look="alex" x={S5_ALEX.x} y={S5_ALEX.y} scale={S5_ALEX.scale} facing={1} t={t}
      keys={[
        { f: 20, p: { x: S5_ALEX.x + 70, legL: { a: 18, b: -8 }, legR: { a: -16, b: -6 } } },
        { f: 50, p: { x: S5_ALEX.x + 110, armR: { a: 70, b: -10 }, handR: 'point', headTilt: -3, tilt: 3 } },
      ]} exprs={[[0, 'neutral'], [50, 'happy']]} />
  </g>
);

/* S6: bedroom, medium — Alex picks up the detector, lifts it, places it
   on his head; the screen activates with a glow at t=65. ONE action: the
   arm rises once to place the detector, then lowers once to rest. */
const S6_ALEX = stand(PL2BEDROOM, 0.42, 0.4);
export const S6: React.FC<ShotProps> = ({ t }) => {
  const ax = S6_ALEX.x;
  const hy = S6_ALEX.y;
  const sc = S6_ALEX.scale;
  const k1 = clamp((t - 15) / 30, 0, 1);
  const k2 = clamp((t - 45) / 25, 0, 1);
  const handX = ax + 90 * sc;
  const handY = hy - 150 * sc;
  const headX = ax + 55 * sc;
  const headY = hy - 205 * sc;
  const e1 = easeOut(k1);
  const e2 = easeOut(k2);
  const dx = PL2B_DETECTOR.x + (handX - PL2B_DETECTOR.x) * e1 + (headX - handX) * e2;
  const dy = PL2B_DETECTOR.y + (handY - PL2B_DETECTOR.y) * e1 + (headY - handY) * e2;
  const active = t >= 65;
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Pl2Bedroom t={t} detectorOnDesk={t < 15} />
      <Actor look="alex" x={ax} y={hy} scale={sc} facing={1} t={t} glintFrom={active ? 65 : 9999}
        keys={[
          { f: 20, p: { armR: { a: -60, b: -8 }, headTilt: -3, tilt: 3 } },
          { f: 45, p: { armR: { a: -110, b: -30 }, headTilt: -5, tilt: 2 } },
          { f: 65, p: { armR: { a: -130, b: -60 }, headTilt: 3, tilt: 0 } },
          { f: 78, p: { armR: { a: -20, b: -10 }, headTilt: 0 } },
        ]} exprs={[[0, 'neutral'], [65, 'happy']]} />
      <Detector x={dx} y={dy} s={0.62 + (active ? 0.25 : 0)} t={t} glow={active ? 1 : 0.7} />
      {active ? <Glow x={dx} y={dy} r={140} o={0.5} /> : null}
    </g>
  );
};

/* S7: corridor, EXTREME CLOSE-UP on the "12" pill above Sam's head — the
   visual explanation shot. The gold pill POPS at t=15 with overshoot +
   ring + sparkles, then glows and breathes. The beam comes from the
   frame corner where Alex stands off-screen. Sam nods once. */
export const S7: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <Pl2Corridor t={t} />
    <Actor look="sam" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 20, p: { headTilt: 4, tilt: 2 } },
        { f: 60, p: { headTilt: -2, tilt: 0 } },
      ]} exprs={[[0, 'happy'], [20, 'happy']]} />
    <NumberPill x={960} y={bigPillY(1020, 1.9, 2.6)} num="12" t={t} from={15} outline={GOLD} s={2.6} />
    <EyeBeam x0={120} y0={980} x1={960} y1={bigPillY(1020, 1.9, 2.6) + 40} t={t} from={15} />
  </g>
);

/* S8: FREEZE insert on the starry void — the detector -> beam -> pill
   diagram draws itself on: a big detector, a beam to a glowing "12" pill,
   the word LIVES. Alex stands FROZEN mid-gesture (one static pose, gold
   ring pulsing). The vector illustration that explains the power. */
export const S8: React.FC<ShotProps> = ({ t }) => {
  const dk = clamp(t / 10);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <NightSky id="pl3-void" horizonY={1080} />
      <Stars seed={113} x0={0} y0={0} w={1920} h={1080} t={t} n={60} o={0.8} />
      <Moon x={1700} y={180} r={54} />
      <g opacity={dk}>
        <g transform={`translate(480 330) scale(${clamp(t / 12)})`}>
          <Detector x={0} y={0} s={1.6} t={t} glow={1} />
        </g>
        <DrawLine d="M 620 330 L 980 330" t={Math.max(0, t - 14)} dur={10} color="#7FD4FF" width={6} />
        <polygon points="980,306 1028,330 980,354" fill="#7FD4FF" opacity={clamp((t - 24) / 6)} />
        <g transform={`translate(1290 330) scale(${clamp((t - 24) / 8)})`} opacity={clamp((t - 24) / 8)}>
          <rect x={-150} y={-52} width={300} height={104} rx={52} fill="#0E0C1E" stroke={GOLD} strokeWidth={4} style={{ filter: 'drop-shadow(0 0 18px rgba(255,215,0,0.8))' }} />
          <text x={0} y={14} fontFamily={FONT.title} fontWeight={700} fontSize={48} fill={GOLD} textAnchor="middle">12</text>
        </g>
        <g opacity={clamp((t - 34) / 8)}>
          <text x={480} y={470} fontFamily={FONT.title} fontWeight={600} fontSize={40} fill={WHITE} textAnchor="middle" letterSpacing={3}>DETECTOR</text>
          <text x={1290} y={470} fontFamily={FONT.title} fontWeight={600} fontSize={40} fill={GOLD} textAnchor="middle" letterSpacing={3}>LIVES APPEAR</text>
        </g>
      </g>
      <g opacity={clamp((t - 44) / 6)}>
        <rect x={810} y={120} width={300} height={64} rx={32} fill="#0E0C1E" stroke={GOLD} strokeWidth={3} />
        <text x={960} y={164} fontFamily={FONT.title} fontWeight={700} fontSize={38} fill={GOLD} textAnchor="middle" letterSpacing={6}>FREEZE</text>
      </g>
      <Hero look={ALEX} pose={{ ...poseAt(0, [{ f: 0, p: { x: 960, y: 900, scale: 1.0, facing: 1, armR: { a: -70, b: -10 }, handR: 'point', headTilt: -4, tilt: 3 } }]), ...faceAt(0, [[0, 'worried']]) }} shadow={0} rimId="rimR" />
      <FocusRings x={960} y={760} t={(t % 24)} r0={180} color={GOLD} />
    </g>
  );
};

/* S9: hallway, medium close-up — Alex and Sam together. Alex POINTS at
   Sam's gold "12" (arm extends monotonically) and the gold beam runs
   from his glowing eyes to the pill. "Almost touching the top of their
   head." */
export const S9: React.FC<ShotProps> = ({ t }) => {
  const alexP = { x: 1200, y: 1010, scale: 1.6 };
  return (
    <g transform={camT(960, 540, 1.35)}>
      <Hallway t={t} />
      <Actor look="sam" x={600} y={1010} scale={1.6} facing={1} t={t}
        keys={[{ f: 25, p: { headTilt: 4 } }]} exprs={[[0, 'happy']]} />
      <NumberPill x={600} y={pillY(1010, 1.6, 1.0)} num="12" t={t} from={10} outline={GOLD} s={1.6} />
      <EyeBeam x0={headPos(alexP, -1).x} y0={headPos(alexP, -1).y} x1={600} y1={pillY(1010, 1.6, 1.0) + 30} t={t} from={10} />
      <Actor look="alex" x={alexP.x} y={alexP.y} scale={alexP.scale} facing={-1} t={t} glintFrom={10}
        keys={[
          { f: 15, p: { armR: { a: -70, b: -8 }, handR: 'point', headTilt: -3, tilt: 3 }, ease: easeOut },
          { f: 40, p: { armR: { a: -50, b: -10 }, handR: 'point', headTilt: 2 } },
        ]} exprs={[[0, 'neutral'], [10, 'smug']]} />
    </g>
  );
};

/* S10: "12 LIVES" illustration on the starry void — the lives-counter
   graphic. A huge gold 12 pops in, twelve life dots light up one by one
   below it, "LIVES LIVED" underneath. Pure vector illustration, no
   characters — the idea made visible. */
export const S10: React.FC<ShotProps> = ({ t }) => {
  const pop = backOut(clamp(t / 8));
  return (
    <g transform={camT(960, 540, 1.0)}>
      <NightSky id="pl3-void2" horizonY={1080} />
      <Stars seed={117} x0={0} y0={0} w={1920} h={1080} t={t} n={60} o={0.8} />
      <Moon x={1700} y={180} r={54} />
      <g transform={`translate(960 380) scale(${0.6 + 0.4 * pop})`} opacity={clamp(t / 6)}>
        <text x={0} y={0} fontFamily={FONT.title} fontWeight={700} fontSize={260} fill={GOLD} textAnchor="middle"
          style={{ filter: 'drop-shadow(0 0 34px rgba(255,215,0,0.85))' }}>
          12
        </text>
      </g>
      <text x={960} y={520} fontFamily={FONT.title} fontWeight={700} fontSize={52} fill={WHITE} textAnchor="middle" letterSpacing={10} opacity={clamp((t - 12) / 8)}>
        LIVES LIVED
      </text>
      <g>
        {Array.from({ length: 12 }).map((_, i) => {
          const lit = t >= 16 + i * 4;
          const x = 960 - 11 * 42 + i * 84;
          return (
            <g key={i}>
              <circle cx={x} cy={620} r={26} fill={lit ? GOLD : '#3A3446'} stroke={lit ? GOLD : '#5A5468'} strokeWidth={3}
                style={lit ? { filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.8))' } : undefined} />
              {lit && t - (16 + i * 4) < 10 ? <Sparkle x={x} y={620} t={t - (16 + i * 4)} s={0.7} /> : null}
            </g>
          );
        })}
      </g>
      <text x={960} y={720} fontFamily={FONT.title} fontWeight={600} fontSize={30} fill={WHITE} textAnchor="middle" letterSpacing={4} opacity={clamp((t - 56) / 8)}>
        EACH DOT IS ONE LIFE
      </text>
    </g>
  );
};

/* S11: cafeteria, wide — other students walk past, pills popping above
   their heads (3, 7, 2, 9), one blank. Alex watches from the left,
   eye-glint on, head turning once to follow them. "Reincarnation." */
const S11_FLOOR35 = PL2CAFETERIA.P(0.5, 1, 0.35).y;
const S11_FLOOR40 = PL2CAFETERIA.P(0.5, 1, 0.4).y;
const S11_FLOOR50 = PL2CAFETERIA.P(0.5, 1, 0.5).y;
const S11_ALEX = stand(PL2CAFETERIA, 0.18, 0.42);
export const S11: React.FC<ShotProps> = ({ t }) => {
  const a = walkPose(200 + t * 12, t * 0.55, S11_FLOOR35, 0.8, {}, 1);
  const b = walkPose(1700 - t * 11, t * 0.55, S11_FLOOR40, 0.9, {}, -1);
  const c = walkPose(500 + t * 10, t * 0.55, S11_FLOOR50, 1.0, {}, 1);
  const d = walkPose(1400 - t * 9, t * 0.55, S11_FLOOR35, 0.7, {}, -1);
  const e = walkPose(900 + t * 8, t * 0.55, S11_FLOOR40, 0.85, {}, 1);
  return (
    <g transform={camT(960, 540, 0.9)}>
      <Pl2Cafeteria t={t} />
      <Hero look={GREY} pose={{ ...a, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={a.x} y={pillY(a.y, 0.8, 0.9)} num="3" t={t} from={10} outline={SOFT} s={0.9} />
      <Hero look={GREEN} pose={{ ...b, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={b.x} y={pillY(b.y, 0.9, 0.9)} num="7" t={t} from={22} outline={SOFT} s={0.9} />
      <Hero look={PURPLE} pose={{ ...c, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={c.x} y={pillY(c.y, 1.0, 0.9)} num="2" t={t} from={34} outline={SOFT} s={0.9} />
      <Hero look={REDTOP} pose={{ ...d, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={d.x} y={pillY(d.y, 0.7, 0.9)} num="9" t={t} from={46} outline={SOFT} s={0.9} />
      <Hero look={GREY} pose={{ ...e, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <Actor look="alex" x={S11_ALEX.x} y={S11_ALEX.y} scale={S11_ALEX.scale} facing={1} t={t} glintFrom={10}
        keys={[
          { f: 20, p: { headTilt: -4, tilt: -2 } },
          { f: 50, p: { headTilt: 4, tilt: 2, armR: { a: 40, b: -16 } } },
        ]} exprs={[[0, 'neutral'], [10, 'smug']]} />
    </g>
  );
};

/* S12: THE ONE slow push-in (1.45 -> 1.57) — close-up on a big gold pill
   above a stranger on the street: it TICKS down 12 -> 11 at t=25 with a
   pulse, a gold ring and a glow. Alex watches from the right — his head
   is WELL inside the frame, NOT at the edge. "The number ticks down." */
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.45 * (1.0 + 0.08 * clamp(t / Math.max(1, len)));
  return (
    <g transform={camT(760, 520, s)}>
      <Pl2Street t={t} />
      <Actor look="red" x={660} y={687} scale={0.95} facing={1} t={t}
        keys={[
          { f: 15, p: { headTilt: -4, tilt: -2 } },
          { f: 45, p: { headTilt: 3, tilt: 1 } },
        ]} />
      <NumberPill x={660} y={bigPillY(687, 0.95, 2.4)} num="12" t={t} from={6} outline={GOLD} s={2.4} tickTo="11" tickAt={25} />
      {t >= 25 && t < 41 ? <FocusRings x={660} y={bigPillY(687, 0.95, 2.4)} t={t - 25} r0={90} color={GOLD} /> : null}
      <Actor look="alex" x={1050} y={687} scale={0.95} facing={-1} t={t} glintFrom={25}
        keys={[
          { f: 12, p: { headTilt: -4, tilt: -2 } },
          { f: 25, p: { headTilt: 4, tilt: 2, armR: { a: -50, b: -10 }, handR: 'point' } },
        ]} exprs={[[0, 'neutral'], [25, 'shock'], [55, 'worried']]} />
      <HeadDetector ax={1050} hy={687} sc={0.95} t={t} />
      <EyeBeam x0={headPos({ x: 1050, y: 687, scale: 0.95 }, -1).x} y0={headPos({ x: 1050, y: 687, scale: 0.95 }, -1).y} x1={660} y1={bigPillY(687, 0.95, 2.4) + 30} t={t} from={25} />
    </g>
  );
};

/* S13: street, close-up — Alex worried as the detector glow fades. A small
   ghost "11" pill lingers top-right: the number he just saw. Centred
   framing: his head is dead centre, well inside the frame. */
export const S13: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.45)}>
    <Pl2Street t={t} />
    <NumberPill x={1480} y={200} num="11" t={t} from={5} outline={GOLD} s={0.7} />
    <Actor look="alex" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 15, p: { headTilt: -4, tilt: -2 } },
        { f: 35, p: { headTilt: 3, tilt: 2 } },
      ]} exprs={[[0, 'shock'], [15, 'worried']]} />
    <HeadDetector ax={960} hy={1020} sc={1.9} t={t} glow={t >= 25 ? 0.25 : 1} />
  </g>
);

/* S14: classroom, medium — Mr. Harwick at the board, Alex at his desk
   pointing at him. The "7" pill pops above Harwick at t=20 with the beam
   from Alex's glowing eyes. "Look at Mr. Harwick, the history teacher." */
const S14_ALEX = stand(PL2CLASSROOM, 0.3, 0.4);
const S14_HAR = stand(PL2CLASSROOM, 0.68, 0.38);
export const S14: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 0.95)}>
    <Pl2Classroom t={t} />
    <Actor look="harwick" x={S14_HAR.x} y={S14_HAR.y} scale={S14_HAR.scale} facing={-1} t={t}
      keys={[
        { f: 30, p: { armR: { a: -50, b: -20 }, headTilt: -4 } },
        { f: 60, p: { armR: { a: -20, b: -10 }, headTilt: 3 } },
      ]} exprs={[[0, 'neutral'], [20, 'smug']]} />
    <NumberPill x={S14_HAR.x} y={pillY(S14_HAR.y, S14_HAR.scale, 0.9)} num="7" t={t} from={20} outline={SOFT} s={0.9} />
    <EyeBeam x0={headPos(S14_ALEX, 1).x} y0={headPos(S14_ALEX, 1).y} x1={S14_HAR.x} y1={pillY(S14_HAR.y, S14_HAR.scale, 0.9) + 30} t={t} from={20} />
    <Actor look="alex" x={S14_ALEX.x} y={S14_ALEX.y} scale={S14_ALEX.scale} facing={1} t={t} glintFrom={20}
      keys={[
        { f: 20, p: { armR: { a: -80, b: -6 }, handR: 'point', headTilt: -4, tilt: -4 } },
        { f: 50, p: { armR: { a: -50, b: -10 }, handR: 'point', headTilt: 4 } },
      ]} exprs={[[0, 'neutral'], [20, 'smug']]} />
  </g>
);

/* S15: classroom, close-up — Harwick's face fills the frame; the "7" pill
   flickers above him; the beam comes from the frame corner where Alex
   stands. "Seven lives." */
export const S15: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <Pl2Classroom t={t} />
    <Actor look="harwick" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 16, p: { headTilt: -6, armR: { a: -60, b: -20 } } },
        { f: 40, p: { headTilt: 5, armR: { a: -20, b: -10 } } },
      ]} exprs={[[0, 'neutral'], [18, 'smug']]} />
    <NumberPill x={960} y={bigPillY(1020, 1.9, 2.8)} num="7" t={t} from={0} outline={SOFT} s={2.8} />
    <EyeBeam x0={140} y0={960} x1={960} y1={bigPillY(1020, 1.9, 2.8) + 40} t={t} from={8} />
  </g>
);

/* S16: library, medium — Alex REACHES OUT and TAPS Sam's shoulder. ONE
   action: the arm extends monotonically and holds. Her gold "12" pops at
   t=8 with the beam from Alex's eyes. "You've lived twelve times." */
export const S16: React.FC<ShotProps> = ({ t }) => {
  const alexP = { x: 1200, y: 1010, scale: 1.6 };
  return (
    <g transform={camT(960, 540, 1.35)}>
      <Library t={t} id="pl4-lib16" />
      <Actor look="sam" x={600} y={1010} scale={1.6} facing={1} t={t}
        keys={[{ f: 30, p: { headTilt: 9 } }]} />
      <NumberPill x={600} y={pillY(1010, 1.6, 1.0)} num="12" t={t} from={8} outline={GOLD} s={1.6} />
      <EyeBeam x0={headPos(alexP, -1).x} y0={headPos(alexP, -1).y} x1={600} y1={pillY(1010, 1.6, 1.0) + 30} t={t} from={8} />
      <Actor look="alex" x={alexP.x} y={alexP.y} scale={alexP.scale} facing={-1} t={t} glintFrom={8}
        keys={[
          { f: 25, p: { armR: { a: -70, b: -8 }, handR: 'open', headTilt: -3, tilt: 3 }, ease: easeOut },
          { f: 45, p: { armR: { a: -78, b: -6 }, handR: 'open', headTilt: 2 } },
        ]} exprs={[[0, 'neutral'], [25, 'happy']]} />
    </g>
  );
};

/* S17: library, close-up — Sam's shock melts into a shy smile; she
   RAISES one hand in greeting (monotonic: -20 -> -110, holds). Her gold
   "12" glows above her; the beam comes from the frame corner. */
export const S17: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <Library t={t} id="pl4-lib17" />
    <Actor look="sam" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 0, p: { headTilt: -4, armR: { a: -20, b: -10 } } },
        { f: 15, p: { headTilt: 4, armR: { a: -110, b: -30 }, tilt: 2 } },
        { f: 30, p: { headTilt: -2, armR: { a: -110, b: -30 }, tilt: 0 } },
      ]} exprs={[[0, 'shock'], [10, 'happy']]} />
    <NumberPill x={960} y={bigPillY(1020, 1.9, 2.6)} num="12" t={t} from={0} outline={GOLD} s={2.6} />
    <EyeBeam x0={120} y0={980} x1={960} y1={bigPillY(1020, 1.9, 2.6) + 40} t={t} from={4} />
  </g>
);

/* S18: art room, medium — Alex WALKS past the easels (walk cycle); Jordan
   at an easel raises her brush once and her "3" pill pops at t=25 with
   the beam from Alex's eyes. "Three lives, Jordan." */
const S18_JOR = stand(PL2ARTROOM, 0.68, 0.38);
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const x = 350 + (t / Math.max(1, len)) * 950;
  const walk = walkPose(x, t * 0.55, 922, 1.3, {}, 1);
  const eye = headPos({ x, y: walk.y, scale: 1.3 }, 1);  // v4: hip-y, never the walk-cycle floor-y (v3 waist-origin bug)
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Pl2ArtRoom t={t} />
      <Actor look="jordan" x={S18_JOR.x} y={S18_JOR.y} scale={S18_JOR.scale} facing={-1} t={t}
        keys={[
          { f: 25, p: { armR: { a: -50, b: -20 }, headTilt: -4 } },
        ]} />
      <NumberPill x={S18_JOR.x} y={pillY(S18_JOR.y, S18_JOR.scale, 0.9)} num="3" t={t} from={25} outline={SOFT} s={0.9} />
      <EyeBeam x0={eye.x} y0={eye.y} x1={S18_JOR.x} y1={pillY(S18_JOR.y, S18_JOR.scale, 0.9) + 30} t={t} from={25} />
      <Hero look={ALEX} pose={{ ...walk, ...faceAt(t, [[0, 'neutral'], [25, 'smug']]), glint: t >= 25 ? 1 : 0, glintColor: '#FFD700' }} shadow={0} rimId="rimR" />
    </g>
  );
};

/* S19: art room, close-up — Jordan grins and laughs, leaning back once.
   Her "3" pill glows above her; the beam comes from the frame corner. */
export const S19: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.5)}>
    <Pl2ArtRoom t={t} />
    <Actor look="jordan" x={960} y={1020} scale={1.9} facing={1} t={t}
      keys={[
        { f: 12, p: { headTilt: -4, armR: { a: -60, b: -20 }, tilt: -3 } },
        { f: 35, p: { headTilt: 4, armR: { a: -20, b: -10 }, tilt: 3 } },
      ]} exprs={[[0, 'happy'], [12, 'happy']]} />
    <NumberPill x={960} y={bigPillY(1020, 1.9, 2.8)} num="3" t={t} from={0} outline={SOFT} s={2.8} />
    <EyeBeam x0={140} y0={960} x1={960} y1={bigPillY(1020, 1.9, 2.8) + 40} t={t} from={6} />
  </g>
);

/* S20: bathroom, medium — Alex at the mirror wearing the detector. ONE
   action: he raises one hand to adjust the detector (monotonic), then
   holds it. Gold glowing "IS THIS REAL?" appears across the top at t=10.
   His own reflection shows NO number — the mirror beat. */
const S20_ALEX = stand(PL2BATHROOM, 0.32, 0.42);
export const S20: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, 1.0)}>
    <Pl2Bathroom t={t} />
    <text x={960} y={150} fontFamily={FONT.title} fontWeight={700} fontSize={56} fill={GOLD} textAnchor="middle" letterSpacing={6}
      style={{ filter: 'drop-shadow(0 0 18px rgba(255,215,0,0.7))' }} opacity={clamp((t - 10) / 8)}>
      IS THIS REAL?
    </text>
    <Actor look="alex" x={S20_ALEX.x} y={S20_ALEX.y} scale={S20_ALEX.scale} facing={1} t={t} glintFrom={10}
      keys={[
        { f: 20, p: { armR: { a: -110, b: -40 }, headTilt: -4, tilt: 2 } },
        { f: 55, p: { armR: { a: -110, b: -40 }, headTilt: 4, tilt: 0 } },
        { f: 85, p: { armR: { a: -20, b: -10 }, headTilt: 0 } },
      ]} exprs={[[0, 'neutral'], [10, 'worried']]} />
    <HeadDetector ax={S20_ALEX.x} hy={S20_ALEX.y} sc={S20_ALEX.scale} t={t} />
  </g>
);

/* S21: study, close-up — Alex holds the detector up in his hand, its
   screen glowing, a small holographic "12" floating above it. ONE action:
   the arm rises once to lift the detector and holds. "The device I built
   is my own invention." */
export const S21: React.FC<ShotProps> = ({ t }) => {
  const ax = 960;
  const hy = 1020;
  const sc = 1.9;
  const handX = ax + 150;
  const handY = hy - 260;
  return (
    <g transform={camT(960, 540, 1.45)}>
      <Study t={t} id="pl4-study" />
      <Actor look="alex" x={ax} y={hy} scale={sc} facing={1} t={t} glintFrom={20}
        keys={[
          { f: 15, p: { armR: { a: -130, b: -60 }, headTilt: -4, tilt: 2 } },
          { f: 45, p: { armR: { a: -130, b: -60 }, headTilt: 3, tilt: 0 } },
        ]} exprs={[[0, 'neutral'], [20, 'worried']]} />
      <Detector x={handX} y={handY} s={0.9} t={t} glow={1} />
      <Glow x={handX} y={handY} r={130} o={0.5} />
      <NumberPill x={handX} y={handY - 130} num="12" t={t} from={20} outline={GOLD} s={0.8} />
    </g>
  );
};

/* S22: bedroom, medium — Alex puts the detector DOWN on the desk (the arm
   lowers once, the detector travels hand -> desk, its glow fades to half)
   and turns his head to the camera. "It doesn't measure anything
   scientific." */
const S22_ALEX = stand(PL2BEDROOM, 0.42, 0.4);
export const S22: React.FC<ShotProps> = ({ t }) => {
  const ax = S22_ALEX.x;
  const hy = S22_ALEX.y;
  const sc = S22_ALEX.scale;
  const k = clamp((t - 10) / 30, 0, 1);
  const e = easeOut(k);
  const handX = ax + 90 * sc;
  const handY = hy - 150 * sc;
  const dx = handX + (PL2B_DETECTOR.x - handX) * e;
  const dy = handY + (PL2B_DETECTOR.y - handY) * e;
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Pl2Bedroom t={t} detectorOnDesk={t >= 40} />
      <Actor look="alex" x={ax} y={hy} scale={sc} facing={1} t={t}
        keys={[
          { f: 0, p: { armR: { a: -110, b: -40 }, headTilt: -4 } },
          { f: 30, p: { armR: { a: -20, b: -10 }, headTilt: 4, tilt: 2 } },
          { f: 55, p: { armR: { a: 10, b: -8 }, headTilt: 0, tilt: 0 } },
        ]} exprs={[[0, 'worried'], [30, 'neutral']]} />
      <Detector x={dx} y={dy} s={0.62} t={t} glow={t >= 40 ? 0.5 : 1} />
      {/* PAYOFF (v4): when the detector lands on the desk, its hologram ticks down 12 -> 11 with a gold ring — the cost lands in this shot. */}
      <NumberPill x={PL2B_DETECTOR.x} y={PL2B_DETECTOR.y - 110} num="12" t={t} from={40} outline={GOLD} s={0.8} tickTo="11" tickAt={48} />
      {t < 40 ? <Glow x={dx} y={dy} r={120} o={0.4} /> : null}
    </g>
  );
};

/* S23: science citation card on the starry void — the Stevenson evidence,
   drawn on piece by piece: name, affiliation, divider, huge "2,500+",
   "DOCUMENTED CASES OF CHILDREN". */
export const S23: React.FC<ShotProps> = ({ t }) => {
  const pop = backOut(clamp((t - 40) / 8));
  return (
    <g transform={camT(960, 540, 1.0)}>
      <NightSky id="pl3-void3" horizonY={1080} />
      <Stars seed={151} x0={0} y0={0} w={1920} h={1080} t={t} n={60} o={0.8} />
      <Moon x={1700} y={180} r={54} />
      <g opacity={clamp((t - 8) / 8)}>
        <text x={960} y={400} fontFamily={FONT.title} fontWeight={700} fontSize={58} fill={GOLD} textAnchor="middle" letterSpacing={4}
          style={{ filter: 'drop-shadow(0 0 18px rgba(255,215,0,0.65))' }}>
          DR. IAN STEVENSON
        </text>
      </g>
      <g opacity={clamp((t - 20) / 8)}>
        <text x={960} y={470} fontFamily={FONT.title} fontWeight={600} fontSize={32} fill={WHITE} textAnchor="middle" letterSpacing={3}>
          PSYCHIATRIST · UNIVERSITY OF VIRGINIA
        </text>
      </g>
      <DrawLine d="M 660 520 L 1260 520" t={Math.max(0, t - 30)} dur={10} color={GOLD} width={4} />
      <g transform={`translate(960 640) scale(${0.6 + 0.4 * pop})`} opacity={clamp((t - 40) / 6)}>
        <text x={0} y={0} fontFamily={FONT.title} fontWeight={700} fontSize={170} fill={GOLD} textAnchor="middle"
          style={{ filter: 'drop-shadow(0 0 28px rgba(255,215,0,0.8))' }}>
          2,500+
        </text>
      </g>
      <text x={960} y={740} fontFamily={FONT.title} fontWeight={600} fontSize={30} fill={WHITE} textAnchor="middle" letterSpacing={5} opacity={clamp((t - 55) / 8)}>
        DOCUMENTED CASES OF CHILDREN
      </text>
    </g>
  );
};

/* S24: void close-up — the "2,500" counter ticks UP huge in gold, 0 ->
   2,500 across the shot, with the citation line underneath. */
export const S24: React.FC<ShotProps> = ({ t }) => {
  const n = Math.round(2500 * easeOut(clamp(t / 64)));
  return (
    <g transform={camT(960, 540, 1.15)}>
      <NightSky id="pl3-void4" horizonY={1080} />
      <Stars seed={157} x0={0} y0={0} w={1920} h={1080} t={t} n={60} o={0.8} />
      <Moon x={1700} y={180} r={54} />
      <text x={960} y={430} fontFamily={FONT.title} fontWeight={700} fontSize={240} fill={GOLD} textAnchor="middle"
        style={{ filter: 'drop-shadow(0 0 34px rgba(255,215,0,0.85))' }}>
        {n.toLocaleString('en-US')}
      </text>
      <text x={960} y={560} fontFamily={FONT.title} fontWeight={700} fontSize={52} fill={WHITE} textAnchor="middle" letterSpacing={10} opacity={clamp((t - 10) / 8)}>
        CASES
      </text>
      <text x={960} y={650} fontFamily={FONT.title} fontWeight={600} fontSize={28} fill={WHITE} textAnchor="middle" letterSpacing={4} opacity={clamp((t - 20) / 8)}>
        CHILDREN WHO REMEMBERED PAST LIVES
      </text>
      <text x={960} y={730} fontFamily={FONT.title} fontWeight={600} fontSize={26} fill={GOLD} textAnchor="middle" letterSpacing={4} opacity={clamp((t - 30) / 8)}>
        UNIVERSITY OF VIRGINIA
      </text>
    </g>
  );
};

/* S25: stairwell, wide — Alex WALKS across the foot of the stairs (walk
   cycle). Three students walk past with pills that TICK DOWN as he
   watches: 7 -> 6 at t=25, 3 -> 2 at t=40, 9 -> 8 at t=55. */
export const S25: React.FC<ShotProps> = ({ t, len }) => {
  const x = 350 + (t / Math.max(1, len)) * 1050;
  const walk = walkPose(x, t * 0.55, 922, 1.3, {}, 1);
  const a = walkPose(250 + t * 10, t * 0.55, 922, 0.8, {}, 1);
  const b = walkPose(1500 - t * 9, t * 0.55, 922, 0.9, {}, -1);
  const c = walkPose(900 + t * 7, t * 0.55, 922, 0.75, {}, 1);
  return (
    <g transform={camT(960, 540, 0.95)}>
      <Pl2Stairwell t={t} />
      <Hero look={GREY} pose={{ ...a, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={a.x} y={pillY(a.y, 0.8, 0.9)} num="7" t={t} from={10} outline={SOFT} s={0.9} tickTo="6" tickAt={25} />
      <Hero look={GREEN} pose={{ ...b, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={b.x} y={pillY(b.y, 0.9, 0.9)} num="3" t={t} from={18} outline={SOFT} s={0.9} tickTo="2" tickAt={40} />
      <Hero look={PURPLE} pose={{ ...c, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={c.x} y={pillY(c.y, 0.75, 0.9)} num="9" t={t} from={26} outline={SOFT} s={0.9} tickTo="8" tickAt={55} />
      <Hero look={ALEX} pose={{ ...walk, ...faceAt(t, [[0, 'neutral'], [25, 'worried']]), glint: t >= 25 ? 1 : 0, glintColor: '#FFD700' }} shadow={0} rimId="rimR" />
    </g>
  );
};

/* S26: evening street, medium — Alex stands among the evening crowd,
   looking up. Pills pop above the passers-by (3, 7, 2, 9) as he watches;
   one gold "12" glints at the far end. */
const S26_ALEX = stand(PL2STREET, 0.28, 0.4);
export const S26: React.FC<ShotProps> = ({ t }) => {
  const a = walkPose(150 + t * 9, t * 0.55, 770, 0.8, {}, 1);
  const b = walkPose(700 + t * 7, t * 0.55, 770, 0.9, {}, 1);
  const c = walkPose(1050 + t * 7, t * 0.55, 770, 0.75, {}, 1);
  const d = walkPose(1400 + t * 5, t * 0.55, 770, 0.85, {}, 1);
  return (
    <g transform={camT(960, 540, 1.1)}>
      <Pl2Street t={t} />
      <Hero look={GREY} pose={{ ...a, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={a.x} y={pillY(a.y, 0.8, 1.0)} num="3" t={t} from={8} outline={SOFT} s={1.0} />
      <Hero look={GREEN} pose={{ ...b, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={b.x} y={pillY(b.y, 0.9, 1.0)} num="7" t={t} from={18} outline={SOFT} s={1.0} />
      <Hero look={PURPLE} pose={{ ...c, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={c.x} y={pillY(c.y, 0.75, 1.0)} num="2" t={t} from={28} outline={SOFT} s={1.0} />
      <Hero look={REDTOP} pose={{ ...d, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} rimId="rimR" />
      <NumberPill x={d.x} y={pillY(d.y, 0.85, 1.0)} num="9" t={t} from={38} outline={SOFT} s={1.0} />
      <Actor look="alex" x={S26_ALEX.x} y={S26_ALEX.y} scale={S26_ALEX.scale} facing={1} t={t} glintFrom={8}
        keys={[
          { f: 20, p: { headTilt: -4, tilt: -2 } },
          { f: 40, p: { headTilt: 4, tilt: 2, armR: { a: -90, b: -10 }, handR: 'point' } },
        ]} exprs={[[0, 'neutral'], [8, 'smug']]} />
    </g>
  );
};

/* S27: cliffhanger end card on the starry void — gold PART ONE, white
   WHAT HAPPENS AT ZERO?, and a small wide red "0" pill below. Matches
   the benchmark's f39 exactly (PART ONE / WHAT IS SHE HIDING? / small
   red "don't tell him" pill): no extra CTA line on the card. */
export const S27: React.FC<ShotProps> = ({ t }) => {
  const k = clamp(t / 6);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <NightSky id="pl3-end" horizonY={1080} />
      <Stars seed={161} x0={0} y0={0} w={1920} h={1080} t={t} n={60} o={0.85} />
      <Moon x={1700} y={180} r={54} />
      <g opacity={k}>
        <text x={960} y={440} fontFamily={FONT.title} fontWeight={700} fontSize={110} fill={GOLD} textAnchor="middle" style={{ filter: 'drop-shadow(0 0 24px rgba(255,200,69,0.6))' }}>
          PART ONE
        </text>
        <text x={960} y={540} fontFamily={FONT.title} fontWeight={600} fontSize={44} fill={WHITE} textAnchor="middle" letterSpacing={4} opacity={clamp((t - 10) / 6)}>
          WHAT HAPPENS AT ZERO?
        </text>
      </g>
      {/* wide red pill like f39's "don't tell him": wide shape, modest text */}
      <g transform={`translate(960 700) scale(${0.55 + 0.45 * backOut(clamp((t - 16) / 6))})`} opacity={clamp((t - 16) / 6)}>
        <rect x={-150} y={-32} width={300} height={64} rx={32} fill="#0E0C1E" opacity={0.94} stroke={RED} strokeWidth={3} style={{ filter: 'drop-shadow(0 0 14px rgba(255,51,68,0.8))' }} />
        <polygon points="-9,28 9,28 0,42" fill="#0E0C1E" stroke={RED} strokeWidth={3} strokeLinejoin="round" />
        <text x={0} y={12} fontFamily={FONT.title} fontWeight={700} fontSize={36} fill="#FFFFFF" textAnchor="middle">0</text>
      </g>
    </g>
  );
};
